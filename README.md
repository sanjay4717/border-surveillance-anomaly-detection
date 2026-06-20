# SENTRY — Border Surveillance Anomaly Detection System

A full-stack AI/ML application that detects unauthorized presence (people, vehicles) in a restricted border/boundary zone from uploaded surveillance images, using **YOLOv8** object detection. Built as an academic demonstration of how AI-based anomaly detection could support border/perimeter security systems — the kind of problem space relevant to defense and surveillance R&D (e.g. DRDO-style applications).

> ⚠️ **Academic project disclaimer:** This is a learning/demonstration project, not an operational security system. It uses a generic pretrained object detector and a simple illustrative "restricted zone" — it has not been validated for real-world deployment.

---

## 1. What this project does

1. You upload a photo/frame (simulating a camera feed from a border outpost).
2. The backend runs **YOLOv8** (a real-time object detection model) on the image.
3. The system checks whether any detected person/vehicle's bounding box overlaps a defined **restricted zone** in the frame.
4. Any overlap is flagged as an **anomaly** (a potential intrusion).
5. The frontend dashboard shows:
   - The annotated result (bounding boxes, restricted zone outline)
   - A breakdown of every object detected, with confidence scores
   - A running **alert log** of every scan performed
   - Summary stats (total scans, total objects, total anomalies)

This mirrors the basic architecture of a real surveillance alert system: **sensor input → AI inference → structured alert → operator dashboard.**

---

## 2. Why these technical choices (good to know for your viva)

| Choice | Reasoning |
|---|---|
| **YOLOv8 (Ultralytics)** | Industry-standard real-time object detector. Pretrained on COCO (80 classes), so it works immediately without training data of our own — practical for an academic timeline. It can be fine-tuned later on real surveillance datasets (e.g. VisDrone) if you want to extend this project. |
| **FastAPI** | Modern Python web framework, async-friendly, auto-generates interactive API docs (`/docs`), and integrates cleanly with ML code since it's also Python. |
| **SQLite + SQLAlchemy** | Zero-setup database — a single file, no server to install. Perfect for a project that needs to log results but doesn't need to scale to production. |
| **React + Tailwind** | Component-based UI that's fast to build and easy to explain. Tailwind keeps styling consistent without writing custom CSS files everywhere. |
| **"Restricted zone overlap" logic** | This is what turns plain object detection into *anomaly* detection — we're not just detecting objects, we're flagging objects in a context that makes them suspicious (i.e., in a no-go area). This is the core "AI/ML" contribution of the project beyond just calling a pretrained model. |

---

## 3. Project structure

```
border-surveillance-ai/
├── backend/                  # FastAPI server
│   ├── app/
│   │   ├── main.py            # App entry point, CORS, routes
│   │   ├── routes/
│   │   │   └── detection.py   # /api/detect, /api/history, /api/stats
│   │   ├── models/
│   │   │   └── model_loader.py # Loads YOLO model once (singleton)
│   │   └── utils/
│   │       └── database.py    # SQLite models (SQLAlchemy)
│   ├── requirements.txt
│   └── Dockerfile
├── ml/
│   └── scripts/
│       ├── detect.py              # Core AnomalyDetector class (YOLOv8 + zone logic)
│       └── generate_test_image.py # Makes a synthetic test image
├── frontend/                  # React + Vite + Tailwind dashboard
│   └── src/
│       ├── App.jsx
│       ├── components/        # StatusBar, UploadPanel, ResultsPanel, AlertLog, StatsCards
│       └── api/client.js      # Axios wrapper for backend calls
├── render.yaml                 # Render deployment blueprint (backend)
└── docs/
    └── VIVA_NOTES.md            # Likely questions + how to answer them
```

---

## 4. Running it locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The first time you run this, **Ultralytics will automatically download the YOLOv8n weights file** (`yolov8n.pt`, ~6MB) — you need an internet connection for this one-time download. After that it's cached locally.

Visit `http://localhost:8000/docs` to see the interactive API documentation and test the `/api/detect` endpoint directly.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env       # then edit .env if needed
npm run dev
```

Visit `http://localhost:5173`.

### Quick smoke test

```bash
cd ml/scripts
python generate_test_image.py
```

This creates `ml/dataset/sample_frame.jpg`. **Note:** this synthetic image won't trigger real detections — YOLOv8 is trained on real photographs. For an actual demo, upload a real photo containing people and/or vehicles outdoors (any photo from your phone works).

---

## 5. Deployment (GitHub + Render + Vercel)

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for full step-by-step instructions, including:
- Pushing to GitHub
- Deploying the backend to Render (free tier)
- Deploying the frontend to Vercel (free tier)
- Connecting the two together

---

## 6. Possible extensions (good "future work" section for your report)

- Fine-tune YOLOv8 on a real aerial/surveillance dataset (e.g. **VisDrone**) instead of using the generic COCO-pretrained model.
- Add video support (frame-by-frame analysis of a video feed, not just single images).
- Add multiple configurable restricted zones per camera, with zone coordinates set via the UI instead of hardcoded.
- Add user authentication so different "operators" can log in and review alerts.
- Add real-time WebSocket updates so the alert log updates live across multiple browser tabs.
- Deploy on edge hardware (e.g. Jetson Nano) for a more realistic "deployed at the border post" demonstration.

---

## 7. Tech stack summary

**ML/AI:** Python, YOLOv8 (Ultralytics), OpenCV
**Backend:** FastAPI, SQLAlchemy, SQLite, Uvicorn
**Frontend:** React, Vite, Tailwind CSS, Axios
**Deployment:** Docker, Render (backend), Vercel (frontend), GitHub
