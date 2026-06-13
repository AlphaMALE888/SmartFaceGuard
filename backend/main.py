import cv2
import numpy as np
import base64
import uuid
from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from face_analyzer import analyze_frame
from deepfake_service import detect_deepfake, _get_model_lazy

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def new_state():
    return {
        "blink_count": 0,
        "eye_closed": False,
        "head_turns": [],
        "face_frame_count": 0,
        "challenge_index": 0,
        "challenge_steps": ["blink", "turn_left", "turn_right"],
        "challenge_done": {"blink": False, "turn_left": False, "turn_right": False},
        "verification_complete": False
    }


# session_id -> state dict. In-memory, single-process — fine for MVP/demo.
sessions: dict[str, dict] = {}


def get_session(session_id):
    if not session_id or session_id not in sessions:
        session_id = str(uuid.uuid4())
        sessions[session_id] = new_state()
    return session_id, sessions[session_id]


class FramePayload(BaseModel):
    image: str


@app.on_event("startup")
def load_models():
    # Pre-load deepfake model at startup to avoid first-request latency
    _get_model_lazy()


@app.post("/analyze")
def analyze(payload: FramePayload, x_session_id: str = Header(default=None)):
    if not payload.image or "," not in payload.image:
        return {"error": "Invalid image payload"}

    try:
        img_data = base64.b64decode(payload.image.split(",")[-1])
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception:
        return {"error": "Failed to decode image"}

    if frame is None:
        return {"error": "Failed to decode image"}

    session_id, state = get_session(x_session_id)

    deepfake_result = detect_deepfake(frame)
    print("Deepfake Result:", deepfake_result)
    result = analyze_frame(frame, state, deepfake_probability=deepfake_result["deepfake_probability"])

    steps = state["challenge_steps"]
    idx = state["challenge_index"]
    result["current_challenge"] = steps[idx] if idx < len(steps) else None
    result["challenge_completed"] = state["challenge_done"]
    result["verification_complete"] = state["verification_complete"]
    result["deepfake_probability"] = deepfake_result["deepfake_probability"]
    result["risk_level"] = deepfake_result["risk_level"]
    result["session_id"] = session_id

    return result


@app.post("/deepfake-check")
def deepfake_check(payload: FramePayload):
    if not payload.image or "," not in payload.image:
        return {"error": "Invalid image payload"}

    try:
        img_data = base64.b64decode(payload.image.split(",")[-1])
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception:
        return {"error": "Failed to decode image"}

    if frame is None:
        return {"error": "Failed to decode image"}

    return detect_deepfake(frame)


@app.post("/reset")
def reset(x_session_id: str = Header(default=None)):
    session_id, _ = get_session(x_session_id)
    sessions[session_id] = new_state()
    return {"status": "reset", "session_id": session_id}


@app.get("/challenge-status")
def challenge_status(x_session_id: str = Header(default=None)):
    session_id, state = get_session(x_session_id)
    steps = state["challenge_steps"]
    idx = state["challenge_index"]
    current = steps[idx] if idx < len(steps) else None
    return {
        "current_challenge": current,
        "completed": state["challenge_done"],
        "verification_complete": state["verification_complete"],
        "session_id": session_id
    }


@app.get("/")
def root():
    return {"status": "SmartFaceGuard backend running"}
