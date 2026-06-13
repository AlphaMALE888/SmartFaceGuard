"""
Deepfake Detection Module.

Real pretrained model: prithivMLmods/Deep-Fake-Detector-v2-Model
(ViT-based binary classifier: Real vs Fake). CPU-friendly.

Falls back to a heuristic placeholder if the model fails to load
(e.g., no internet on first run), keeping the API contract stable.
"""

import cv2
import numpy as np
from PIL import Image

ANALYSIS_SIZE = (224, 224)  # ViT input size


class BaseDeepfakeModel:
    def predict(self, face_crop: np.ndarray) -> float:
        """Return deepfake probability in range [0.0, 1.0]."""
        raise NotImplementedError


class PretrainedDeepfakeModel(BaseDeepfakeModel):
    """ViT-based deepfake classifier via HuggingFace transformers pipeline."""

    def __init__(self):
        from transformers import pipeline
        self.pipe = pipeline(
            "image-classification",
            model="prithivMLmods/Deep-Fake-Detector-v2-Model",
            device=-1  # CPU
        )

    def predict(self, face_crop: np.ndarray) -> float:
        if face_crop is None or face_crop.size == 0:
            return 0.0

        rgb = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)
        resized = cv2.resize(rgb, ANALYSIS_SIZE, interpolation=cv2.INTER_AREA)
        pil_img = Image.fromarray(resized)

        results = self.pipe(pil_img)  # [{'label': 'Fake', 'score': 0.92}, ...]

        fake_score = 0.0
        for r in results:
            label = r["label"].lower()
            if "fake" in label:
                fake_score = r["score"]
                break
        else:
            for r in results:
                if "real" in r["label"].lower():
                    fake_score = 1.0 - r["score"]
                    break

        return round(float(np.clip(fake_score, 0.0, 1.0)), 4)


class PlaceholderDeepfakeModel(BaseDeepfakeModel):
    """Heuristic fallback — used only if pretrained model fails to load."""

    def predict(self, face_crop: np.ndarray) -> float:
        if face_crop is None or face_crop.size == 0:
            return 0.0

        resized = cv2.resize(face_crop, (160, 160), interpolation=cv2.INTER_AREA)
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

        lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_score = 1.0 - min(lap_var / 1000.0, 1.0)

        f = np.fft.fft2(gray)
        fshift = np.fft.fftshift(f)
        magnitude = np.abs(fshift)
        h, w = magnitude.shape
        cy, cx = h // 2, w // 2
        center = magnitude[cy - 10:cy + 10, cx - 10:cx + 10]
        high_freq_energy = (magnitude.sum() - center.sum()) / (magnitude.sum() + 1e-6)
        freq_score = 1.0 - min(high_freq_energy * 2.0, 1.0)

        raw_score = 0.5 * blur_score + 0.5 * freq_score
        return round(float(np.clip(raw_score, 0.0, 1.0)), 4)


def get_model() -> BaseDeepfakeModel:
    try:
        return PretrainedDeepfakeModel()
    except Exception as e:
        print(f"[deepfake_service] Pretrained model unavailable, using placeholder: {e}")
        return PlaceholderDeepfakeModel()


def classify_risk(probability: float) -> str:
    if probability < 0.35:
        return "LOW"
    elif probability < 0.7:
        return "MEDIUM"
    else:
        return "HIGH"


_model = None


def _get_model_lazy() -> BaseDeepfakeModel:
    global _model
    if _model is None:
        _model = get_model()
    return _model


def detect_deepfake(frame: np.ndarray) -> dict:
    """
    Run deepfake detection on a frame (or face crop).
    Returns dict matching the API contract:
    {"deepfake_probability": float, "risk_level": str}
    """
    model = _get_model_lazy()
    probability = model.predict(frame)
    return {
        "deepfake_probability": probability,
        "risk_level": classify_risk(probability)
    }
