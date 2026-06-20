"""
Model loader — wraps the AnomalyDetector class from the ml/ folder so the
backend can import and reuse it.

We load the model ONCE when the server starts (not on every request) —
loading a YOLO model from disk takes a second or two, so doing it per
request would make the API very slow.
"""

import sys
from pathlib import Path

# Add the ml/scripts folder to the Python path so we can import detect.py.
#
# Two possible layouts depending on how the app is run:
#   1. Local dev: repo-root/ml/scripts/detect.py
#      (this file lives at repo-root/backend/app/models/model_loader.py,
#       so ml/scripts is 3 levels up, then into ml/scripts)
#   2. Docker/Render: /ml/scripts/detect.py
#      (see Dockerfile — ml/ is copied to /ml at the container root)
_LOCAL_DEV_PATH = Path(__file__).resolve().parents[3] / "ml" / "scripts"
_DOCKER_PATH = Path("/ml/scripts")

if _DOCKER_PATH.exists():
    ML_SCRIPTS_PATH = _DOCKER_PATH
else:
    ML_SCRIPTS_PATH = _LOCAL_DEV_PATH

sys.path.append(str(ML_SCRIPTS_PATH))

from detect import AnomalyDetector  # noqa: E402

# Singleton instance — created once, reused across all requests.
_detector_instance = None


def get_detector() -> AnomalyDetector:
    global _detector_instance
    if _detector_instance is None:
        _detector_instance = AnomalyDetector()
    return _detector_instance
