import sys
import re

file_path = "style.css"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# 1. Fix the `h/* --- VISION SECTION --- */ ... }6 {` mess
# We want to replace the inserted block with just `h6 {`
# The inserted block starts with `h/* --- VISION SECTION --- */` and ends with `}6 {`
pattern = r"h/\* --- VISION SECTION --- \*/.*?\}6 \{"
content = re.sub(pattern, "h6 {", content, flags=re.DOTALL)

# 2. Trim the corrupted powershell append
# The good content ends after `.mobile-nav-panel.open li:nth-child(5) { transition-delay: 0.3s; }`
good_end_marker = ".mobile-nav-panel.open li:nth-child(5) { transition-delay: 0.3s; }"
idx = content.find(good_end_marker)
if idx != -1:
    content = content[:idx + len(good_end_marker)]

# 3. Append the new CSS correctly
new_css = """

/* --- VISION SECTION --- */
#vision { padding: 6rem 5%; }
.vision-container {
  display: flex;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
.vision-left { flex: 1; }
.vision-heading {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  color: white;
}
.vision-text {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 2.5rem;
}
.outline-gradient-btn {
  display: inline-block;
  padding: 0.8rem 2.5rem;
  background: black;
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  border: 2px solid var(--primary);
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(244, 31, 72, 0.2);
}
.outline-gradient-btn:hover {
  background: var(--primary);
  box-shadow: 0 0 20px rgba(244, 31, 72, 0.5);
  transform: translateY(-2px);
}
.vision-right {
  flex: 1;
  position: relative;
  min-height: 400px;
}
.vision-img {
  position: absolute;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  transition: transform 0.4s ease;
}
.vision-img.img-back {
  width: 75%;
  height: 320px;
  top: 0;
  left: 0;
  z-index: 1;
}
.vision-img.img-front {
  width: 75%;
  height: 320px;
  bottom: 0;
  right: 0;
  z-index: 2;
  transform: translateY(20%);
  border: 2px solid rgba(255,255,255,0.1);
}
.vision-right:hover .img-back { transform: translate(-10px, -10px); }
.vision-right:hover .img-front { transform: translate(10px, 20%) scale(1.02); }

@media (max-width: 768px) {
  .vision-container { flex-direction: column; }
  .vision-right { width: 100%; min-height: 350px; margin-top: 2rem; }
  .vision-img.img-front { transform: translateY(15%); }
  .vision-right:hover .img-front { transform: translateY(15%) scale(1.02); }
}

/* --- TEAM PREVIEW CARD --- */
#team-preview { padding: 2rem 5%; }
.team-card {
  background: #111116;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 5rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.team-card-left { flex: 1; max-width: 600px; }
.team-card-heading {
  font-family: "Space Grotesk", sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, var(--primary), #ff758c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.team-card-text {
  color: #aaa;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
  line-height: 1.6;
}
.team-card-right {
  flex: 0 0 250px;
  display: flex;
  justify-content: center;
}
.team-art {
  width: 100%;
  max-width: 250px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.1);
  filter: drop-shadow(0 15px 30px rgba(244, 31, 72, 0.2));
}
@media (max-width: 768px) {
  .team-card { flex-direction: column; padding: 3rem 2rem; text-align: center; }
  .team-card-right { margin-top: 3rem; }
}

/* --- GALLERY FAN --- */
#gallery-preview { padding: 4rem 5%; text-align: center; overflow: hidden; }
.gallery-preview-header { margin-bottom: 4rem; }
.gallery-preview-header h2 { font-size: 2.5rem; margin-bottom: 1rem; }
.gallery-preview-header p { color: var(--text-muted); font-size: 1.1rem; max-width: 600px; margin: 0 auto; }
.gallery-fan {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}
.fan-img {
  width: 220px;
  height: 280px;
  object-fit: cover;
  border-radius: 16px;
  border: 3px solid;
  position: absolute;
  transform: rotate(var(--r)) translateY(0);
  transform-origin: bottom center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 15px 35px rgba(0,0,0,0.6);
  cursor: pointer;
  background: #111;
}
.fan-img:hover {
  transform: rotate(var(--r)) translateY(-40px) scale(1.1);
  z-index: 10;
  box-shadow: 0 25px 50px rgba(0,0,0,0.8);
}
@media (max-width: 768px) {
  .fan-img { width: 140px; height: 180px; }
  .gallery-fan { height: 250px; }
}
"""

content += new_css

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
