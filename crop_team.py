import os
from PIL import Image

# Setup paths
raw_dir = "team/raw"
output_dir = "team"

# Ensure output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Define team members and their raw filenames (save them with these names in team/raw)
# Format: { "save_name": "original_filename_in_raw_folder" }
team_files = {
    "yuvraj.jpg": "yuvraj_raw.jpg",
    "sanyam.jpg": "sanyam_raw.jpg",
    "tanishik.jpg": "tanishik_raw.jpg",
    "anshika.jpg": "anshika_raw.jpg",
    "rijul.jpg": "rijul_raw.jpg",
    "naitik.jpg": "naitik_raw.jpg",
    "devansh.jpg": "devansh_raw.jpg",
    "shishir.jpg": "shishir_raw.jpg",
    "pratibha.jpg": "pratibha_raw.jpg",
    "rachit.jpg": "rachit_raw.jpg",
    "anima.jpg": "anima_raw.jpg"
}

def crop_face(input_path, output_path):
    try:
        with Image.open(input_path) as img:
            width, height = img.size
            
            # Based on the "Meet the Team" layout:
            # Person is inside the Polaroid frame on the left.
            # We want a square crop of the face.
            
            # These are approximate percentages for the "Polaroid" area in your graphics
            left = width * 0.08    # Start of frame
            top = height * 0.28    # Top of frame
            right = width * 0.45   # End of frame
            bottom = height * 0.70 # Bottom of frame
            
            # Crop to the frame area first
            face_img = img.crop((left, top, right, bottom))
            
            # Make it a perfect square
            w, h = face_img.size
            size = min(w, h)
            left_s = (w - size) / 2
            top_s = (h - size) / 2
            face_img = face_img.crop((left_s, top_s, left_s + size, top_s + size))
            
            # Save it
            face_img.save(output_path, "JPEG", quality=95)
            print(f"✅ Cropped: {output_path}")
            
    except Exception as e:
        print(f"❌ Error processing {input_path}: {e}")

print("🚀 Starting image processing...")

# Process each file found in the raw directory
for target_name, raw_name in team_files.items():
    raw_path = os.path.join(raw_dir, raw_name)
    if os.path.exists(raw_path):
        crop_face(raw_path, os.path.join(output_dir, target_name))
    else:
        # Check if they just saved it with the target name in the raw folder
        alt_raw_path = os.path.join(raw_dir, target_name)
        if os.path.exists(alt_raw_path):
            crop_face(alt_raw_path, os.path.join(output_dir, target_name))
        else:
            print(f"⚠️ Missing: {raw_name} not found in {raw_dir}")

print("✨ Done!")
