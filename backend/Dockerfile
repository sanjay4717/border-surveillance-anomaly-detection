# Backend Dockerfile — used by Render (or any Docker-based host) to
# build and run the FastAPI + YOLOv8 service.

FROM python:3.11-slim

# OpenCV and YOLOv8 need a few system libraries to work correctly.
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY ml/ /ml/

# Render provides the PORT environment variable at runtime.
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
