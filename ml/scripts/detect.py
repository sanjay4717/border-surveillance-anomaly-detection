"""
Border Surveillance Anomaly Detection - Core ML Module
========================================================

This script uses YOLOv8 (Ultralytics) — a real-time object detection model —
to detect "anomaly-relevant" objects in surveillance images/frames:
people, vehicles, and other moving objects that could indicate an
intrusion in a restricted/border zone.

Why YOLOv8?
-----------
- Pretrained on COCO dataset (80 object classes including 'person', 'car',
  'truck', 'motorcycle', etc.) — so it works out of the box without
  training your own dataset from scratch.
- Fast enough to run on CPU for a demo/academic project.
- Easy to fine-tune later if you get access to actual border/surveillance
  imagery (e.g. from a dataset like VisDrone or a custom dataset).

How it fits the "anomaly detection" theme:
-------------------------------------------
We don't treat this as plain object detection. We define a RESTRICTED
ZONE (a polygon/region in the frame) and flag any detected
person/vehicle whose bounding box overlaps that zone as an "ANOMALY" —
this simulates a real border-fence / no-go-zone intrusion alert.
"""

from ultralytics import YOLO
import cv2
import numpy as np
import json
from datetime import datetime
from pathlib import Path

# Classes from COCO dataset that are relevant to a surveillance/intrusion
# use case. Full list: https://docs.ultralytics.com/datasets/detect/coco/
RELEVANT_CLASSES = {
    0: "person",
    1: "bicycle",
    2: "car",
    3: "motorcycle",
    5: "bus",
    7: "truck",
}

MODEL_PATH = "yolov8n.pt"  # nano version: smallest & fastest, good for CPU


class AnomalyDetector:
    def __init__(self, model_path: str = MODEL_PATH, confidence: float = 0.4):
        """
        Loads the YOLOv8 model once. Reuse this object across requests —
        loading the model from disk is the slow part, inference is fast.
        """
        self.model = YOLO(model_path)
        self.confidence = confidence

    def define_restricted_zone(self, frame_width: int, frame_height: int):
        """
        Defines a simple rectangular 'restricted zone' covering the
        bottom-center portion of the frame — simulating a fence-line or
        no-go boundary closer to the camera.

        In a real DRDO-style system, this would be calibrated per-camera
        based on actual GPS/terrain coordinates. For this academic
        project, we use a simple illustrative rectangle.
        """
        x1 = int(frame_width * 0.15)
        y1 = int(frame_height * 0.45)
        x2 = int(frame_width * 0.85)
        y2 = int(frame_height * 0.95)
        return (x1, y1, x2, y2)

    def box_overlaps_zone(self, box, zone):
        """Checks if a detected object's bounding box overlaps the restricted zone."""
        bx1, by1, bx2, by2 = box
        zx1, zy1, zx2, zy2 = zone
        return not (bx2 < zx1 or bx1 > zx2 or by2 < zy1 or by1 > zy2)

    def detect(self, image_path: str, save_path: str = None):
        """
        Runs detection on a single image and returns structured results.

        Returns a dict:
        {
            "timestamp": ...,
            "image": ...,
            "restricted_zone": [x1, y1, x2, y2],
            "detections": [
                {"class": "person", "confidence": 0.91, "box": [...], "is_anomaly": true},
                ...
            ],
            "anomaly_count": 2
        }
        """
        frame = cv2.imread(image_path)
        if frame is None:
            raise ValueError(f"Could not read image: {image_path}")

        h, w = frame.shape[:2]
        zone = self.define_restricted_zone(w, h)

        results = self.model(frame, conf=self.confidence, verbose=False)[0]

        detections = []
        anomaly_count = 0

        for box in results.boxes:
            cls_id = int(box.cls[0])
            if cls_id not in RELEVANT_CLASSES:
                continue

            conf = float(box.conf[0])
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            is_anomaly = self.box_overlaps_zone((x1, y1, x2, y2), zone)

            if is_anomaly:
                anomaly_count += 1

            detections.append({
                "class": RELEVANT_CLASSES[cls_id],
                "confidence": round(conf, 3),
                "box": [x1, y1, x2, y2],
                "is_anomaly": is_anomaly,
            })

        # Draw visualizations on the frame for the annotated output image
        annotated = self._draw_annotations(frame.copy(), detections, zone)
        if save_path:
            cv2.imwrite(save_path, annotated)

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "image_size": [w, h],
            "restricted_zone": list(zone),
            "detections": detections,
            "anomaly_count": anomaly_count,
            "annotated_image_path": save_path,
        }

    def _draw_annotations(self, frame, detections, zone):
        """Draws the restricted zone and bounding boxes onto the frame."""
        # Draw restricted zone in semi-transparent yellow
        overlay = frame.copy()
        cv2.rectangle(overlay, (zone[0], zone[1]), (zone[2], zone[3]), (0, 255, 255), -1)
        frame = cv2.addWeighted(overlay, 0.15, frame, 0.85, 0)
        cv2.rectangle(frame, (zone[0], zone[1]), (zone[2], zone[3]), (0, 255, 255), 2)
        cv2.putText(frame, "RESTRICTED ZONE", (zone[0], zone[1] - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

        # Draw each detection
        for det in detections:
            x1, y1, x2, y2 = det["box"]
            color = (0, 0, 255) if det["is_anomaly"] else (0, 200, 0)
            label = f"{det['class']} {det['confidence']:.2f}"
            if det["is_anomaly"]:
                label = "ANOMALY: " + label

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, label, (x1, max(y1 - 8, 15)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        return frame


if __name__ == "__main__":
    # Quick local test: run `python detect.py <image_path>`
    import sys
    if len(sys.argv) < 2:
        print("Usage: python detect.py <image_path>")
        sys.exit(1)

    detector = AnomalyDetector()
    result = detector.detect(sys.argv[1], save_path="output_annotated.jpg")
    print(json.dumps(result, indent=2))
