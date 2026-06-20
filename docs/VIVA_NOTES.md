# Viva / Presentation Notes

Likely questions an evaluator might ask, with concise answers you can adapt in your own words. **Don't memorize these word-for-word — understand the reasoning so you can answer follow-ups.**

---

### Q: What problem does this project solve?
It demonstrates how AI-based object detection can be applied to a border/perimeter surveillance use case: automatically flagging when a person or vehicle enters a restricted zone, instead of requiring a human operator to watch camera feeds continuously.

### Q: What is YOLO and why did you use it?
YOLO ("You Only Look Once") is a real-time object detection algorithm. Unlike older approaches that scan an image region-by-region, YOLO looks at the whole image once and predicts all bounding boxes and class labels in a single pass — that's why it's fast enough for real-time/near-real-time use. I used YOLOv8, the latest stable version from Ultralytics, pretrained on the COCO dataset (80 common object classes including person, car, truck, etc).

### Q: Did you train your own model?
No — I used a pretrained YOLOv8 model. Training a detection model from scratch requires a large labeled dataset (thousands of annotated images) and significant compute/time, which isn't practical for this project's scope. Instead, the AI/ML contribution is in **how I use** the model's output: defining a restricted zone and checking for overlap to convert generic object detection into context-aware anomaly detection. *(If asked "what would you do with more time/resources" — mention fine-tuning on a real surveillance dataset like VisDrone.)*

### Q: How does the "anomaly detection" logic actually work?
1. YOLOv8 detects objects and returns bounding boxes (x1,y1,x2,y2 coordinates) for each.
2. I define a restricted zone as a rectangle in the frame (in a real system, this would be calibrated to actual terrain/camera geometry).
3. For each detected person/vehicle, I check whether its bounding box overlaps the restricted zone's rectangle, using simple 2D rectangle-intersection logic.
4. If it overlaps, it's flagged as an anomaly and shown in red on the dashboard; otherwise it's shown in green as a normal detection.

### Q: Why FastAPI instead of Flask/Django?
FastAPI is async-native, has built-in request validation, and auto-generates interactive API documentation (Swagger UI) at `/docs` — useful for testing and for demonstrating the API during evaluation. It's also commonly used in production ML-serving systems, so it's a relevant skill to show.

### Q: Why SQLite instead of a "real" database like PostgreSQL/MySQL?
For this project's scale, SQLite is sufficient — it's a single file with no separate server process to manage, which keeps the project simple to set up and deploy. The code uses SQLAlchemy as the database layer, so switching to PostgreSQL later would only require changing the connection string, not rewriting the data access logic.

### Q: How would this scale to a real deployment?
Several things would need to change:
- Use video stream input (RTSP camera feeds) instead of single image uploads.
- Run on more capable hardware (GPU) for real-time frame rates.
- Calibrate restricted zones to real GPS/terrain coordinates per camera, not arbitrary rectangles.
- Use a more robust database (PostgreSQL) and add authentication for operators.
- Add a fine-tuned model trained on actual surveillance footage rather than generic COCO classes.

### Q: What was the hardest part / what would you improve?
(Answer this honestly based on your own experience building/running it — e.g. "getting the frontend and backend to communicate correctly across different deployment platforms," or "understanding how bounding box coordinates work and translating that into the zone-overlap logic.")

### Q: Is this related to any real DRDO system?
No — this is an independent academic project inspired by the *general problem space* of border surveillance and AI-assisted threat detection, which is relevant to defense R&D organizations like DRDO. It does not use any DRDO data, systems, or proprietary methods. Be upfront that this is a learning project built with publicly available tools (YOLOv8, FastAPI, React) and a synthetic "restricted zone" concept, not a real operational system.

---

## Suggested 2-minute demo script

1. "This is SENTRY, a border surveillance anomaly detection dashboard."
2. Show the empty dashboard — explain the stats cards and alert log are empty because no scans have run yet.
3. Upload a photo containing a person.
4. Click "RUN ANOMALY SCAN" — narrate: "this sends the image to our FastAPI backend, where a YOLOv8 model detects objects and checks if any fall inside the restricted zone."
5. Point out the result: bounding boxes, the yellow restricted zone outline, and the anomaly flag if the person overlaps it.
6. Scroll to the Alert Log — "every scan gets logged here, like a real surveillance system's incident history."
7. Mention the deployment: "the frontend is on Vercel, the backend with the ML model is on Render, and the code is all on GitHub" — show the live link if possible.
