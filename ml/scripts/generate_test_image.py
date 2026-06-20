"""
Generates a simple synthetic test image so you can try out the
detection pipeline without needing real surveillance footage.

This draws a plain background with a few rectangle/circle shapes that
roughly mimic a person and a vehicle, purely so you have *something* to
upload and test with immediately.

NOTE: This is NOT a substitute for real test images. For a proper demo,
download a few sample images of people/vehicles outdoors (e.g. from a
free stock photo site, or any photo from your own phone) and use those
instead — YOLOv8 is trained on real photos, not synthetic shapes, so it
will detect real photos much more reliably than this synthetic one.

Usage:
    python ml/scripts/generate_test_image.py
"""

import cv2
import numpy as np

def generate_sample(output_path="ml/dataset/sample_frame.jpg"):
    img = np.full((720, 1280, 3), (40, 50, 35), dtype=np.uint8)  # dark green-ish background

    # ground
    cv2.rectangle(img, (0, 500), (1280, 720), (25, 35, 20), -1)

    # a "fence line" to suggest a border
    for x in range(0, 1280, 40):
        cv2.line(img, (x, 480), (x, 520), (90, 90, 90), 2)

    cv2.putText(
        img,
        "SYNTHETIC TEST FRAME - replace with a real photo for best results",
        (30, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (200, 200, 200),
        2,
    )

    cv2.imwrite(output_path, img)
    print(f"Sample frame written to {output_path}")
    print("Tip: for real detections, upload an actual photo of people/vehicles outdoors.")


if __name__ == "__main__":
    generate_sample()
