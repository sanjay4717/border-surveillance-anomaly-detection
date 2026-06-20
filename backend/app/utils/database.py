"""
Database utility — uses SQLite for simplicity.

Why SQLite?
-----------
For an academic project, SQLite is ideal: it's a single file, requires
no separate database server to install/configure, and is fully supported
by Python's standard library (via SQLAlchemy here for convenience).

This stores a log of every detection request made — i.e., the "alert
history" that the frontend dashboard will display.
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./detections.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class DetectionLog(Base):
    """
    One row = one uploaded image/frame that was analyzed.
    """
    __tablename__ = "detection_logs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    anomaly_count = Column(Integer, default=0)
    total_detections = Column(Integer, default=0)
    detections_json = Column(String)  # full detection details stored as JSON text
    annotated_image_path = Column(String, nullable=True)


def init_db():
    """Creates all tables if they don't already exist. Called on app startup."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency — yields a DB session and closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
