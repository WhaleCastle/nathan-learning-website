# Prompt for Claude Code: Build “basic-calculation” practice site

You are my coding agent. Build a small PHP + JavaScript web app for basic calculation practice, placed in a new folder named `basic-calculation`. Match the layout and training flow of my existing time practice site in the sibling folder `time-and-clock`.

I will run this on a Linux web server with PHP. Keep it simple and touch friendly for an Android tablet.

---

## Objectives

* Create a standalone practice website in `basic-calculation/` that reuses the same layout style and training mode UX from `time-and-clock/`.
* Provide four practice categories with configurable difficulty:

  1. Addition – single digit, 2 digits, 3 digits
  2. Subtraction – single digit, 2 digits, 3 digits
  3. Multiplication – per times table (1 to 12)
  4. Division – matched to the selected times table (1 to 12), difficulty suitable for Year 3-4
* Each quiz always asks 20 questions per session.
* Questions show on the left. A large on-screen number pad appears on the right with buttons 0-9, Clear, Backspace, and OK.

  * Input examples: `9 + OK` equals 9, `2 + 3 + OK` equals 23, `1 + 1 + 5 + OK` equals 115.
* Minimal dependencies. Vanilla PHP for serving pages, Vanilla JS for logic.

---

## Inspect and mirror from `time-and-clock`

1. Look at `time-and-clock/` sibling folder.

   * Reuse the same header, footer, typography, spacing, color scheme, and card layout if present.
   * Replicate the same “training mode” flow: choose mode, start, 20 questions, progress indicator, score summary, restart.
   * Copy or adapt shared CSS, fonts, and any utility JS into `basic-calculation/assets/` while keeping names consistent.
2. Keep navigation consistent. If `time-and-clock` has a home or menu, add a link back and forward for cross-navigation.

---

## Features and UX details

### Modes and difficulty

* **Addition**

  * Single digit: operands 0-9
  * 2 digits: operands 10-99
  * 3 digits: operands 100-999
* **Subtraction**

  * Single digit: 0-9
  * 2 digits: 10-99
  * 3 digits: 100-999
  * Do not produce negative results. Auto-generate questions where minuend ≥ subtrahend.
* **Multiplication**

  * User selects one table from 1 to 12.
  * Generate factors like \[selected table] × \[1..12] in random order.
* **Division**

  * User selects a divisor table from 1 to 12.
  * Questions are of the form \[multiple of divisor up to 12×divisor] ÷ \[divisor].
  * Answers are whole numbers only. Keep within Year 3-4 ability.

### Session and scoring

* 20 questions per session.
* Show a progress bar or counter like “Question 7 of 20”.
* After each answer:

  * Immediate correctness feedback (green for correct, red for incorrect).
  * If incorrect, show the correct answer briefly before moving to the next question.
* At the end:

  * Show total score, time used, and a simple accuracy summary.
  * Provide “Retry same mode” and “Choose another mode”.

### Input UI

* Left pane: the current question in large text.
* Right pane: large touch friendly keypad with 0-9, Backspace, Clear, OK.
* Allow physical keyboard entry too, but primary design is touch.
* Disable OK until there is at least one digit.
* Enter key triggers OK. Backspace key works. Escape clears.

### Accessibility and device fit

* Responsive layout for an 8 to 11 inch Android tablet in landscape.
* Large hit targets. Minimum 48px touch targets.
* High contrast text. Avoid tiny fonts.

### Data and persistence

* Keep all logic client side.
* Store last used mode and difficulty in `localStorage`.
* Store simple history of the last 10 sessions with date, mode, difficulty, score, and duration. Add a “History” view in a tab or modal.

### Optional small details

* Soft tick/cross sound with mute toggle, default muted if the time site is muted.
* Simple timer that starts on first question and stops at completion.
* If the student idles for 60 seconds, show a gentle prompt.

---

## Tech and structure

* Vanilla PHP templates for pages.
* Vanilla JS (no frameworks), modular files.
* One CSS file, plus any base CSS copied from `time-and-clock`.

**Proposed structure**

```
basic-calculation/
  index.php                 # Mode selection hub
  quiz.php                  # Quiz screen (question + keypad)
  history.php               # Optional history page or render as modal
  assets/
    css/
      base.css              # Copied or adapted from time-and-clock
      calc.css              # Styles specific to this app
    js/
      utils.js
      generator.js          # Question generators per mode
      keypad.js             # Number pad component
      quiz.js               # Session flow, scoring, storage
      storage.js            # localStorage helpers
    img/
      icons/                # Any icons if needed
```

---

## Logic outline

* `generator.js`

  * `generateAddition(level)` where level ∈ {1,2,3}, pick ranges as above.
  * `generateSubtraction(level)` with non-negative result guarantee.
  * `generateMultiplication(table)` where table ∈ \[1..12].
  * `generateDivision(table)` as whole-number problems.
  * Each returns `{ a, op, b, answer }`.
* `quiz.js`

  * Reads mode and options from query string or POST:

    * `mode=add|sub|mul|div`
    * `level=1|2|3` for add/sub
    * `table=1..12` for mul/div
  * Pre-generate 20 questions and shuffle when appropriate.
  * Manage state: current index, input buffer, correct count, start time.
  * Handle keypad events and keyboard events.
  * On OK: evaluate, show feedback, move to next after short delay.
  * On finish: show summary, write to `localStorage` history.
* `keypad.js`

  * Render keypad. Expose callbacks for number, backspace, clear, ok.
* `storage.js`

  * `savePreferences()`, `loadPreferences()`, `saveHistory(entry)`, `loadHistory()`.

---

## Pages and flows

### `index.php`

* Title, short description, four cards for modes.
* For Addition and Subtraction: radio for 1, 2, 3 digits.
* For Multiplication and Division: dropdown for table 1..12.
* Start button navigates to `quiz.php?mode=...&level=...` or `&table=...`.
* Link to History.
* Link to `time-and-clock` home for consistency.

### `quiz.php`

* Left pane: big question text, progress, small timer.
* Right pane: keypad.
* Bottom: Clear, Submit (OK), and Exit.
* End screen: score, duration, breakdown, buttons to retry or change mode.

### `history.php` or modal

* Show a simple table of last 10 sessions from `localStorage`.
* Allow clearing history.

---

## Visual requirements

* Match fonts, colors, and card style from `time-and-clock`.
* Keep a clean look. No heavy animations.
* Ensure buttons have clear pressed states.
* Use CSS only. No external UI libraries.

---

## Non functional requirements

* No build step. Just PHP files plus static assets.
* Code must be readable and commented where logic is not obvious.
* All JS must be namespaced to avoid collisions with `time-and-clock` if hosted side by side.

---

## Acceptance checklist

* [ ] `basic-calculation/` folder created with files as listed.
* [ ] Layout and training flow feel the same as `time-and-clock`.
* [ ] All four categories work and generate valid questions.
* [ ] Exactly 20 questions per session.
* [ ] On-screen keypad works with touch and keyboard.
* [ ] No negative answers in subtraction.
* [ ] Division produces whole number answers only.
* [ ] End summary shows score and time.
* [ ] Preferences and history persist in `localStorage`.
* [ ] Works in mobile Chrome on an Android tablet in landscape.

---

## How to run locally

* I will run `php -S 0.0.0.0:8000` from the project root or point the virtual host to `basic-calculation/`.
* Do not rely on `.htaccess` unless needed.
* Avoid absolute paths. Use relative links.

---

## Deliverables

* All source files under `basic-calculation/`.
* Any notes in `README.md` inside that folder if something needs explaining.
* Do not add heavy dependencies.

Build it now.
