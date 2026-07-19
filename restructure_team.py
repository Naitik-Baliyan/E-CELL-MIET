import re

html_content = """        
        <div class="team-tier tier-1">
          <!-- Member 1: Yuvraj -->
          <div class="team-member-card">
            <div class="member-img-wrap">
              <img src="assets/team/Yuvraj.jpeg" alt="Yuvraj Singh" class="member-img">
              <div class="member-socials">
                <a href="#" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">Yuvraj Singh</h3>
              <p class="member-role">Overall Coordinator</p>
              <p class="member-motive">"I believe leadership begins where comfort ends. For me, this role is about setting direction, strengthening systems, and ensuring that every initiative moves with clarity and purpose. As Overall Coordinator, my responsibility is simple: build structure, drive performance..."</p>
            </div>
          </div>
        </div>

        <div class="team-tier tier-2">
          <!-- Member 7: Rachit -->
          <div class="team-member-card">
            <div class="member-img-wrap">
              <img src="assets/team/Rachit.jpeg" alt="Rachit Jain" class="member-img">
              <div class="member-socials">
                <a href="#" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">Rachit Jain</h3>
              <p class="member-role">Jr. Technical Head</p>
              <p class="member-motive">"My focus remains on Artificial Intelligence and Machine Learning, with a specific emphasis on helping student founders translate technical complexity into commercial success. I am committed to building the infrastructure that turns visionary concepts into scalable reality."</p>
            </div>
          </div>

          <!-- Member 9: Naitik -->
          <div class="team-member-card">
            <div class="member-img-wrap">
              <img src="assets/team/Naitik.jpeg" alt="Naitik Baliyan" class="member-img">
              <div class="member-socials">
                <a href="#" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">Naitik Baliyan</h3>
              <p class="member-role">Jr. Technical Head</p>
              <p class="member-motive">"Aspiring Engineer and B.Tech student with a focus on AI and Full-Stack Web Development. Proven interest in building real-world tech solutions through technical innovation and strategic execution. Committed to continuous learning, I aim to translate high-level concepts into impactful experiences."</p>
            </div>
          </div>
        </div>

        <div class="team-tier tier-3">
          <!-- Member 2: Shishir -->
          <div class="team-member-card">
            <div class="member-img-wrap">
              <img src="assets/team/Shishir.jpeg" alt="Shishir Rastogi" class="member-img">
              <div class="member-socials">
                <a href="#" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">Shishir Rastogi</h3>
              <p class="member-role">Jr. Graphic Design Head</p>
              <p class="member-motive">"I'm Shishir Rastogi, a creative professional with expertise in UX/UI design, video editing, graphics design, and front-end development. With a strong work ethic and attention to detail, I deliver exceptional results. I'm a lifelong learner and thrive in fast-paced environments."</p>
            </div>
          </div>
          
          <!-- Member 3: Rijul -->
          <div class="team-member-card">
            <div class="member-img-wrap">
              <img src="assets/team/Rijul.jpeg" alt="Rijul Chaudhary" class="member-img">
              <div class="member-socials">
                <a href="#" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">Rijul Chaudhary</h3>
              <p class="member-role">Jr. Content/Editor Head</p>
              <p class="member-motive">"I believe greatness is a byproduct of curation. Working at the intersection of visual storytelling and strategic growth, I transform raw concepts into high-impact digital experiences. For me, creativity is about more than aesthetics—it's the intellectual rigour required to engineer perspectives."</p>
            </div>
          </div>

          <!-- Member 4: Anima -->
          <div class="team-member-card">
            <div class="member-img-wrap">
              <img src="assets/team/anima.jpeg" alt="Anima Gupta" class="member-img">
              <div class="member-socials">
                <a href="#" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">Anima Gupta</h3>
              <p class="member-role">Jr. Event Head</p>
              <p class="member-motive">"I'm Anima Gupta, a curious and growth-driven individual passionate about creativity, design, and exploring new ideas. I enjoy learning, building skills, and contributing to meaningful projects that challenge me and help me grow both personally and professionally."</p>
            </div>
          </div>

          <!-- Member 5: Anshika -->
          <div class="team-member-card">
            <div class="member-img-wrap">
              <img src="assets/team/Anshika.jpeg" alt="Anshika Baliyan" class="member-img">
              <div class="member-socials">
                <a href="#" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">Anshika Baliyan</h3>
              <p class="member-role">PR Head & Jr. Event Member</p>
              <p class="member-motive">"With strong communication and networking skills, I focus on building impactful outreach and ensuring clear, strategic messaging across platforms. I actively contribute to planning events that add value to our ecosystem, and aim to combine leadership, creativity, and effective communication."</p>
            </div>
          </div>

          <!-- Member 6: Tanishq -->
          <div class="team-member-card">
            <div class="member-img-wrap">
              <img src="assets/team/Tanishq.jpeg" alt="Tanishik Premi" class="member-img">
              <div class="member-socials">
                <a href="#" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">Tanishik Premi</h3>
              <p class="member-role">Jr. Creativity Head</p>
              <p class="member-motive">"I love turning wild ideas into reality, whether designing with a retro art style or soldering a new electronics project. You will usually find me blasting rock music or tinkering with hardware. I am naturally curious and love diving down rabbit holes to learn new skills."</p>
            </div>
          </div>

          <!-- Member 8: Sanyam -->
          <div class="team-member-card">
            <div class="member-img-wrap">
              <img src="assets/team/Sanyam.jpeg" alt="Sanyam Jain" class="member-img">
              <div class="member-socials">
                <a href="#" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">Sanyam Jain</h3>
              <p class="member-role">Jr. PR Head</p>
              <p class="member-motive">"As a Core Member of E-Cell and Founder of Just Build, I am dedicated to building ecosystems that empower students and entrepreneurs. My journey in business has taught me that true leadership is about impact and intentional growth. I'm focused on helping others level up their mindset."</p>
            </div>
          </div>

          <!-- Member 10: Pratibha -->
          <div class="team-member-card">
            <div class="member-img-wrap">
              <img src="assets/team/Pratibha.jpeg" alt="Pratibha" class="member-img">
              <div class="member-socials">
                <a href="#" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">Pratibha</h3>
              <p class="member-role">Team Member</p>
              <p class="member-motive">"Dedicated to continuous learning and contributing to the success of our entrepreneurial initiatives at E-Cell MIET."</p>
            </div>
          </div>
        </div>"""

with open('c:/Users/ASUS/Desktop/E CELL MIET/E CELL MIET/team.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the inner content of <div class="team-page-grid" id="teamGrid">
# We can use regex to find <div class="team-page-grid" id="teamGrid"> ... </div>
import re
new_text = re.sub(
    r'(<div class="team-page-grid" id="teamGrid">).*?(</section>)',
    r'\1\n' + html_content + r'\n      </div>\n    \2',
    text,
    flags=re.DOTALL
)

with open('c:/Users/ASUS/Desktop/E CELL MIET/E CELL MIET/team.html', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("HTML rewritten successfully!")
