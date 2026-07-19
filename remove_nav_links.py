import os
import glob

html_files = glob.glob('c:/Users/ASUS/Desktop/E CELL MIET/E CELL MIET/*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if '<li><a href="#collaborations">Collaborations</a></li>' in line or \
           '<li><a href="#spotlights">Spotlights</a></li>' in line or \
           '<li><a href="index.html#collaborations">Collaborations</a></li>' in line or \
           '<li><a href="index.html#spotlights">Spotlights</a></li>' in line:
            continue
        new_lines.append(line)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

print("Navbar updated in all HTML files.")
