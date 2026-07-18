import cv2
import numpy as np
import os
import glob

def process_image(filepath):
    print(f"Processing {filepath}...")
    img = cv2.imread(filepath)
    if img is None:
        print("Failed to load")
        return
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # The polaroid frame is white. The background is dark blue.
    # We can threshold for bright pixels to find the white frame.
    _, thresh = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY)
    
    # Morphological operations to remove text on the right and connect the frame
    kernel = np.ones((15, 15), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find the largest contour on the left side
    valid_contours = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        if w > 200 and h > 300 and x < img.shape[1] // 2:
            valid_contours.append(c)
            
    if not valid_contours:
        print("No valid frame found, trying different threshold")
        _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            if w > 200 and h > 300 and x < img.shape[1] // 2:
                valid_contours.append(c)

    if not valid_contours:
        print("Still no valid frame found.")
        return
        
    largest_contour = max(valid_contours, key=cv2.contourArea)
    rect = cv2.minAreaRect(largest_contour)
    
    center, size, angle = rect
    width, height = int(size[0]), int(size[1])
    
    # If the width > height, it means the rectangle was detected in landscape orientation
    if width > height:
        width, height = height, width
        angle -= 90
        
    # We want to keep the angle between -45 and 45
    if angle < -45:
        angle += 90
    elif angle > 45:
        angle -= 90
        
    # Rotate the image
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(img, M, (img.shape[1], img.shape[0]), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    
    # Crop the rotated image
    x = int(center[0] - width / 2)
    y = int(center[1] - height / 2)
    
    # Ensure within bounds
    x = max(0, x)
    y = max(0, y)
    width = min(rotated.shape[1] - x, width)
    height = min(rotated.shape[0] - y, height)
    
    cropped = rotated[y:y+height, x:x+width]
    
    # Crop an additional 6% from each side to remove the white border and focus on the person
    border_x = int(width * 0.06)
    border_y = int(height * 0.06)
    final_crop = cropped[border_y:height-border_y, border_x:width-border_x]
    
    out_path = filepath.replace(".jpg", "-cropped.jpg")
    cv2.imwrite(out_path, final_crop)
    print(f"Saved {out_path}")

files = glob.glob('assets/team/*.jpg')
for f in files:
    if '-cropped' not in f:
        process_image(f)
