import cv2
import numpy as np
import mediapipe as mp

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1, refine_landmarks=True,
    min_detection_confidence=0.5, min_tracking_confidence=0.5
)

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
EAR_THRESHOLD = 0.21


def eye_aspect_ratio(landmarks, eye_idx, w, h):
    pts = [(landmarks[i].x * w, landmarks[i].y * h) for i in eye_idx]
    A = np.linalg.norm(np.array(pts[1]) - np.array(pts[5]))
    B = np.linalg.norm(np.array(pts[2]) - np.array(pts[4]))
    C = np.linalg.norm(np.array(pts[0]) - np.array(pts[3]))
    return (A + B) / (2.0 * C)


def classify_confidence(score: int) -> str:
    if score >= 80:
        return "HIGH"
    elif score >= 50:
        return "MEDIUM"
    else:
        return "LOW"


def analyze_frame(frame, state, deepfake_probability: float = 0.0):
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    if not results.multi_face_landmarks:
        return {
            "face_detected": False,
            "blink_count": state["blink_count"],
            "head_turn": "none",
            "authenticity_score": 0,
            "confidence_level": classify_confidence(0)
        }

    lm = results.multi_face_landmarks[0].landmark

    # Blink detection
    left_ear = eye_aspect_ratio(lm, LEFT_EYE, w, h)
    right_ear = eye_aspect_ratio(lm, RIGHT_EYE, w, h)
    ear = (left_ear + right_ear) / 2.0

    if ear < EAR_THRESHOLD and not state["eye_closed"]:
        state["eye_closed"] = True
    elif ear >= EAR_THRESHOLD and state["eye_closed"]:
        state["blink_count"] += 1
        state["eye_closed"] = False

    # Head turn detection
    nose_x = lm[1].x * w
    left_eye_x = lm[33].x * w
    right_eye_x = lm[263].x * w
    eye_mid_x = (left_eye_x + right_eye_x) / 2.0
    face_width = abs(right_eye_x - left_eye_x)
    offset_ratio = (nose_x - eye_mid_x) / (face_width + 1e-6)

    if offset_ratio > 0.35:
        head_turn = "right"
    elif offset_ratio < -0.35:
        head_turn = "left"
    else:
        head_turn = "center"

    state["head_turns"].append(head_turn)
    if len(state["head_turns"]) > 30:
        state["head_turns"].pop(0)

    # --- Challenge progression (strict, sequential) ---
    steps = state["challenge_steps"]
    idx = state["challenge_index"]

    if idx < len(steps):
        current_challenge = steps[idx]

        if current_challenge == "blink" and state["blink_count"] > 0 and not state["challenge_done"]["blink"]:
            state["challenge_done"]["blink"] = True
            state["challenge_index"] += 1

        elif current_challenge == "turn_left" and head_turn == "left" and not state["challenge_done"]["turn_left"]:
            state["challenge_done"]["turn_left"] = True
            state["challenge_index"] += 1

        elif current_challenge == "turn_right" and head_turn == "right" and not state["challenge_done"]["turn_right"]:
            state["challenge_done"]["turn_right"] = True
            state["challenge_index"] += 1

    # Verification only completes when ALL THREE steps are done
    if (state["challenge_done"]["blink"]
            and state["challenge_done"]["turn_left"]
            and state["challenge_done"]["turn_right"]):
        state["verification_complete"] = True
    else:
        state["verification_complete"] = False

    # --- Authenticity Score (weighted, evidence-based) ---

    # 1. Face Presence (35%) — requires sustained tracking, not a single frame
    state["face_frame_count"] = state.get("face_frame_count", 0) + 1
    face_presence_score = min(state["face_frame_count"] / 10.0, 1.0)

    # 2. Blink Validation (25%) — requires actual blink challenge completion
    if state["challenge_done"]["blink"]:
        blink_score = 1.0
    elif state["blink_count"] > 0:
        blink_score = 0.5
    else:
        blink_score = 0.0

    # 3. Head Movement Validation (20%) — requires both directions completed
    completed_turns = sum([
        state["challenge_done"]["turn_left"],
        state["challenge_done"]["turn_right"]
    ])
    head_movement_score = completed_turns / 2.0

    # 4. Deepfake Safety (20%)
    deepfake_safety_score = 1.0 - float(np.clip(deepfake_probability, 0.0, 1.0))

    weighted_score = (
        0.35 * face_presence_score +
        0.25 * blink_score +
        0.20 * head_movement_score +
        0.20 * deepfake_safety_score
    )

    score = int(round(weighted_score * 100))
    confidence_level = classify_confidence(score)

    return {
        "face_detected": True,
        "blink_count": state["blink_count"],
        "head_turn": head_turn,
        "authenticity_score": score,
        "confidence_level": confidence_level
    }
