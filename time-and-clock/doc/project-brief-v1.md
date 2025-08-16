You're a web developer creating an educational website for a child (around 8 years old) to practice understanding time, using **PHP and JavaScript**, hosted on a **simple Linux webserver** (LAMP stack or similar, no frameworks).

**Primary Device:** Android tablet with touchscreen (landscape and portrait modes)

**Goal:** Build a playful but simple website for time-related learning, suitable for touchscreen interaction and easy deployment.

**Visual Style:** 
- Friendly and playful (for young kids)
- Use colorful but clean UI
- Large buttons, big fonts, easy tap areas
- Fully touch-friendly — no hover effects, avoid small inputs

**Key Features to Include:**

1. **Analog Clock Display**
   - Real-time animated clock
   - Option to move hands by dragging (touch support)

2. **Digital Clock Display**
   - Real-time digital clock
   - Activities where child matches analog and digital time

3. **Compare Time**
   - Interactive exercises like "Which time is later?"
   - Simple multiple choice or draggable answers (touch-compatible)

4. **Add/Subtract Time**
   - Activities like "Add 45 minutes to 2:15 PM"
   - Tap-based inputs or onscreen keypad

5. **Set the Clock**
   - Show a target time
   - User sets analog clock to match (drag hands)
   - Provide instant feedback if correct

6. **Mini Quizzes**
   - 5-question timed rounds with feedback
   - Score tracking with fun visuals (stars, emojis)

7. **Progress Feedback**
   - Simple reward system (e.g., stars, badges)
   - Store progress with session or text file (no full DB)

**Platform Constraints:**
- Touch-first design (no mouse/keyboard assumptions)
- No complex JS frameworks
- Pure PHP/JS/HTML/CSS
- Minimal dependencies, must run on basic Linux server

**Request:** 
Please provide clean, modular code (PHP and JS) with comments. You can combine all features into a prototype, or separate them logically (e.g., one file per activity). Ensure every interaction works well on a touchscreen Android tablet.
