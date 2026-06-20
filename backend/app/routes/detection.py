"""
API Routes for Detection
==========================

Endpoints:
- POST /api/detect       -> upload an image, get back detection results
- GET  /api/history       -> list all past detections (for the dashboard)
- GET  /api/history/{id}  -> get a single detection's full details
- GET  /api/stats         -> summary stats (total scans, total anomalies, etc.)
"""

import json
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.utils.database import get_db, DetectionLog
from app.models.model_loader import get_detector

router = APIRouter()

UPLOAD_DIR = Path(__file__).resolve().parents[3] / "uploads"
DETECTIONS_DIR = Path(__file__).resolve().parents[3] / "detections"
UPLOAD_DIR.mkdir(exist_ok=True)
DETECTIONS_DIR.mkdir(exist_ok=True)


@router.post("/detect")
async def detect_anomaly(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Accepts an uploaded image, runs YOLOv8-based anomaly detection,
    saves an annotated image + a DB log entry, and returns the result.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are supported.")

    # Save the uploaded file with a unique name to avoid collisions
    file_id = uuid.uuid4().hex[:10]
    upload_path = UPLOAD_DIR / f"{file_id}_{file.filename}"
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    annotated_path = DETECTIONS_DIR / f"{file_id}_annotated.jpg"

    detector = get_detector()
    try:
        result = detector.detect(str(upload_path), save_path=str(annotated_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

    # Log to database
    log_entry = DetectionLog(
        filename=file.filename,
        anomaly_count=result["anomaly_count"],
        total_detections=len(result["detections"]),
        detections_json=json.dumps(result["detections"]),
        annotated_image_path=str(annotated_path),
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)

    result["id"] = log_entry.id
    result["filename"] = file.filename
    return result


@router.get("/history")
def get_history(limit: int = 50, db: Session = Depends(get_db)):
    """Returns the most recent detection logs, newest first."""
    logs = (
        db.query(DetectionLog)
        .order_by(DetectionLog.timestamp.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": log.id,
            "filename": log.filename,
            "timestamp": log.timestamp.isoformat(),
            "anomaly_count": log.anomaly_count,
            "total_detections": log.total_detections,
        }
        for log in logs
    ]


@router.get("/history/{log_id}")
def get_detection_detail(log_id: int, db: Session = Depends(get_db)):
    """Returns full details (including all bounding boxes) for one detection."""
    log = db.query(DetectionLog).filter(DetectionLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Detection log not found.")

    return {
        "id": log.id,
        "filename": log.filename,
        "timestamp": log.timestamp.isoformat(),
        "anomaly_count": log.anomaly_count,
        "total_detections": log.total_detections,
        "detections": json.loads(log.detections_json),
    }


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Summary statistics for the dashboard's top cards."""
    total_scans = db.query(func.count(DetectionLog.id)).scalar() or 0
    total_anomalies = db.query(func.sum(DetectionLog.anomaly_count)).scalar() or 0
    total_detections = db.query(func.sum(DetectionLog.total_detections)).scalar() or 0

    return {
        "total_scans": total_scans,
        "total_anomalies": total_anomalies,
        "total_detections": total_detections,
    }
