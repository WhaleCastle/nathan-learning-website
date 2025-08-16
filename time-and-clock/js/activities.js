class CompareTimeQuizManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = null;
        this.questionStartTime = null;
        this.totalTime = 0;
        this.init();
    }

    init() {
        this.setupQuizControls();
    }

    setupQuizControls() {
        const nextBtn = document.getElementById('compare-next-question');
        const restartBtn = document.getElementById('compare-restart-quiz');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.startQuiz());
        }
    }

    startQuiz() {
        this.questions = this.generateQuestions();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.totalTime = 0;
        
        this.hideResults();
        this.showQuestion();
        this.startTimer();
    }

    generateQuestions() {
        const questions = [];
        
        for (let i = 0; i < 10; i++) {
            questions.push(this.generateCompareQuestion());
        }
        
        return questions;
    }

    generateCompareQuestion() {
        // Randomly decide if asking for later or earlier
        const isAskingLater = Math.random() < 0.5;
        
        // Generate two different random times
        let time1, time2;
        do {
            time1 = this.generateRandomTime();
            time2 = this.generateRandomTime();
        } while (time1.hours === time2.hours && time1.minutes === time2.minutes);
        
        // Calculate correct answer
        const totalMinutes1 = time1.hours * 60 + time1.minutes;
        const totalMinutes2 = time2.hours * 60 + time2.minutes;
        
        let correctAnswer;
        if (isAskingLater) {
            correctAnswer = totalMinutes1 > totalMinutes2 ? 1 : 2;
        } else {
            correctAnswer = totalMinutes1 < totalMinutes2 ? 1 : 2;
        }
        
        return {
            time1: time1,
            time2: time2,
            question: isAskingLater ? 'Which Time is Later?' : 'Which Time is Earlier?',
            correctAnswer: correctAnswer,
            isAskingLater: isAskingLater
        };
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        const questionEl = document.getElementById('compare-question');
        const counterEl = document.getElementById('compare-current-question');
        const nextBtn = document.getElementById('compare-next-question');
        const timeCard1 = document.getElementById('time-card-1');
        const timeCard2 = document.getElementById('time-card-2');
        
        if (counterEl) {
            counterEl.textContent = this.currentQuestionIndex + 1;
        }
        
        if (questionEl) {
            questionEl.textContent = question.question;
        }
        
        // Draw the clocks
        const canvas1 = document.querySelector('#time-card-1 canvas');
        const canvas2 = document.querySelector('#time-card-2 canvas');
        const label1 = document.querySelector('#time-card-1 .time-label');
        const label2 = document.querySelector('#time-card-2 .time-label');
        
        if (canvas1 && typeof window.drawSmallClock === 'function') {
            window.drawSmallClock(canvas1, question.time1.hours, question.time1.minutes);
        }
        if (canvas2 && typeof window.drawSmallClock === 'function') {
            window.drawSmallClock(canvas2, question.time2.hours, question.time2.minutes);
        }
        
        if (label1) label1.textContent = this.formatTime(question.time1);
        if (label2) label2.textContent = this.formatTime(question.time2);
        
        // Reset time card states and add click handlers
        if (timeCard1) {
            timeCard1.classList.remove('correct', 'incorrect', 'selected');
            timeCard1.onclick = () => this.selectAnswer(1, timeCard1);
            timeCard1.style.pointerEvents = 'auto';
        }
        if (timeCard2) {
            timeCard2.classList.remove('correct', 'incorrect', 'selected');
            timeCard2.onclick = () => this.selectAnswer(2, timeCard2);
            timeCard2.style.pointerEvents = 'auto';
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
        this.questionStartTime = Date.now();
        this.clearFeedback();
    }

    selectAnswer(answer, timeCardEl) {
        const question = this.questions[this.currentQuestionIndex];
        const feedbackEl = document.getElementById('compare-feedback');
        const nextBtn = document.getElementById('compare-next-question');
        const timeCard1 = document.getElementById('time-card-1');
        const timeCard2 = document.getElementById('time-card-2');
        
        // Disable time card clicks
        if (timeCard1) timeCard1.style.pointerEvents = 'none';
        if (timeCard2) timeCard2.style.pointerEvents = 'none';
        
        // Show selected state
        timeCardEl.classList.add('selected');
        
        // Show correct answer
        if (question.correctAnswer === 1 && timeCard1) {
            timeCard1.classList.add('correct');
        } else if (question.correctAnswer === 2 && timeCard2) {
            timeCard2.classList.add('correct');
        }
        
        if (answer === question.correctAnswer) {
            this.score++;
            if (feedbackEl) {
                feedbackEl.textContent = '✅ Correct! Well done!';
                feedbackEl.className = 'feedback correct';
            }
            this.addStars(1);
        } else {
            timeCardEl.classList.add('incorrect');
            if (feedbackEl) {
                const hint = question.isAskingLater ? 
                    'Remember: later means the time that comes after!' :
                    'Remember: earlier means the time that comes before!';
                feedbackEl.textContent = `❌ Not quite! ${hint}`;
                feedbackEl.className = 'feedback incorrect';
            }
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    clearFeedback() {
        const feedbackEl = document.getElementById('compare-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }
    }

    showResults() {
        this.stopTimer();
        
        const questionEl = document.getElementById('compare-quiz-question');
        const feedbackEl = document.getElementById('compare-feedback');
        const nextBtn = document.getElementById('compare-next-question');
        const resultsEl = document.getElementById('compare-quiz-results');
        const scoreEl = document.getElementById('compare-quiz-score');
        const timeEl = document.getElementById('compare-total-time');
        const starsEl = document.getElementById('compare-earned-stars');
        
        if (questionEl) questionEl.style.display = 'none';
        if (feedbackEl) feedbackEl.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        
        if (resultsEl) {
            resultsEl.style.display = 'block';
            
            if (scoreEl) {
                scoreEl.textContent = this.score;
            }
            
            if (timeEl) {
                timeEl.textContent = Math.floor(this.totalTime / 1000);
            }
            
            if (starsEl) {
                let stars = '';
                const starCount = Math.min(3, Math.floor(this.score / 4) + 1);
                for (let i = 0; i < starCount; i++) {
                    stars += '⭐';
                }
                starsEl.textContent = stars;
                
                if (this.score === 10) {
                    this.showCelebration();
                }
            }
        }
    }

    hideResults() {
        const questionEl = document.getElementById('compare-quiz-question');
        const resultsEl = document.getElementById('compare-quiz-results');
        
        if (questionEl) questionEl.style.display = 'block';
        if (resultsEl) resultsEl.style.display = 'none';
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const timerEl = document.getElementById('compare-quiz-time');
            if (timerEl) {
                timerEl.textContent = elapsed;
            }
            this.totalTime = Date.now() - this.startTime;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    showCelebration() {
        const celebration = document.getElementById('celebration');
        if (celebration) {
            celebration.style.display = 'flex';
            setTimeout(() => {
                celebration.style.display = 'none';
            }, 3000);
        }
    }

    generateRandomTime() {
        return {
            hours: Math.floor(Math.random() * 12) + 1,
            minutes: Math.floor(Math.random() * 12) * 5
        };
    }

    formatTime(time) {
        const hours = String(time.hours).padStart(2, '0');
        const minutes = String(time.minutes).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    addStars(count) {
        const starCount = document.getElementById('star-count');
        if (starCount) {
            const current = parseInt(starCount.textContent) || 0;
            starCount.textContent = current + count;
        }
    }
}

class ActivitiesManager {
    constructor() {
        this.init();
    }

    init() {
        // Legacy method for backward compatibility
    }

    // Legacy methods kept for compatibility - actual functionality moved to separate quiz managers
    setupCompareActivity() {
        // This is now handled by CompareTimeQuizManager
    }
    
    setupMathActivity() {
        // This is now handled by MathQuizManager
    }
    
    setupSetClockActivity() {
        // This is now handled by ClockQuizManager
    }
}

class MathQuizManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = null;
        this.questionStartTime = null;
        this.totalTime = 0;
        this.init();
    }

    init() {
        this.setupQuizControls();
    }

    setupQuizControls() {
        const nextBtn = document.getElementById('math-next-question');
        const restartBtn = document.getElementById('math-restart-quiz');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.startQuiz());
        }
    }

    startQuiz() {
        this.questions = this.generateQuestions();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.totalTime = 0;
        
        this.hideResults();
        this.showQuestion();
        this.startTimer();
    }

    generateQuestions() {
        const questions = [];
        
        for (let i = 0; i < 10; i++) {
            questions.push(this.generateMathQuestion());
        }
        
        return questions;
    }

    generateMathQuestion() {
        const operations = ['add', 'subtract'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        const startTime = this.generateRandomTime();
        const changeHours = Math.floor(Math.random() * 3);
        const changeMinutes = Math.floor(Math.random() * 60);
        
        let resultTime;
        let problemText;
        
        if (operation === 'add') {
            problemText = `What time is ${changeHours} hours and ${changeMinutes} minutes after ${this.formatTime(startTime)}?`;
            
            let totalMinutes = startTime.hours * 60 + startTime.minutes + changeHours * 60 + changeMinutes;
            resultTime = {
                hours: Math.floor(totalMinutes / 60) % 12 || 12,
                minutes: totalMinutes % 60
            };
        } else {
            problemText = `What time is ${changeHours} hours and ${changeMinutes} minutes before ${this.formatTime(startTime)}?`;
            
            let totalMinutes = startTime.hours * 60 + startTime.minutes - changeHours * 60 - changeMinutes;
            if (totalMinutes < 0) totalMinutes += 12 * 60;
            resultTime = {
                hours: Math.floor(totalMinutes / 60) || 12,
                minutes: totalMinutes % 60
            };
        }
        
        // Generate multiple choice options
        const correctAnswer = this.formatTime(resultTime);
        const options = this.generateTimeOptions(correctAnswer);
        
        return {
            problemText: problemText,
            correctAnswer: correctAnswer,
            options: options
        };
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        const displayEl = document.getElementById('problem-display');
        const optionsEl = document.getElementById('math-quiz-options');
        const counterEl = document.getElementById('math-current-question');
        const nextBtn = document.getElementById('math-next-question');
        
        if (counterEl) {
            counterEl.textContent = this.currentQuestionIndex + 1;
        }
        
        if (displayEl) {
            displayEl.textContent = question.problemText;
        }
        
        if (optionsEl) {
            optionsEl.innerHTML = '';
            question.options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.textContent = option;
                btn.addEventListener('click', () => this.selectAnswer(option, btn));
                optionsEl.appendChild(btn);
            });
        }
        
        this.clearFeedback();
        
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
        this.questionStartTime = Date.now();
    }

    selectAnswer(answer, buttonEl) {
        const question = this.questions[this.currentQuestionIndex];
        const optionsEl = document.getElementById('math-quiz-options');
        const feedbackEl = document.getElementById('math-feedback');
        const nextBtn = document.getElementById('math-next-question');
        
        const buttons = optionsEl.querySelectorAll('.quiz-option');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === question.correctAnswer) {
                btn.classList.add('correct');
            } else if (btn === buttonEl) {
                btn.classList.add('incorrect');
            }
        });
        
        if (answer === question.correctAnswer) {
            this.score++;
            if (feedbackEl) {
                feedbackEl.textContent = '✅ Excellent! You got it right!';
                feedbackEl.className = 'feedback correct';
            }
            this.addStars(1);
        } else {
            if (feedbackEl) {
                feedbackEl.textContent = `❌ Not quite. The correct answer is: ${question.correctAnswer}`;
                feedbackEl.className = 'feedback incorrect';
            }
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuestion();
    }



    clearFeedback() {
        const feedbackEl = document.getElementById('math-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }
    }

    showResults() {
        this.stopTimer();
        
        const questionEl = document.getElementById('math-quiz-question');
        const optionsEl = document.getElementById('math-quiz-options');
        const feedbackEl = document.getElementById('math-feedback');
        const nextBtn = document.getElementById('math-next-question');
        const resultsEl = document.getElementById('math-quiz-results');
        const scoreEl = document.getElementById('math-quiz-score');
        const timeEl = document.getElementById('math-total-time');
        const starsEl = document.getElementById('math-earned-stars');
        
        if (questionEl) questionEl.style.display = 'none';
        if (optionsEl) optionsEl.style.display = 'none';
        if (feedbackEl) feedbackEl.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        
        if (resultsEl) {
            resultsEl.style.display = 'block';
            
            if (scoreEl) {
                scoreEl.textContent = this.score;
            }
            
            if (timeEl) {
                timeEl.textContent = Math.floor(this.totalTime / 1000);
            }
            
            if (starsEl) {
                let stars = '';
                const starCount = Math.min(3, Math.floor(this.score / 4) + 1);
                for (let i = 0; i < starCount; i++) {
                    stars += '⭐';
                }
                starsEl.textContent = stars;
                
                if (this.score === 10) {
                    this.showCelebration();
                }
            }
        }
    }

    hideResults() {
        const questionEl = document.getElementById('math-quiz-question');
        const optionsEl = document.getElementById('math-quiz-options');
        const resultsEl = document.getElementById('math-quiz-results');
        
        if (questionEl) questionEl.style.display = 'block';
        if (optionsEl) optionsEl.style.display = 'grid';
        if (resultsEl) resultsEl.style.display = 'none';
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const timerEl = document.getElementById('math-quiz-time');
            if (timerEl) {
                timerEl.textContent = elapsed;
            }
            this.totalTime = Date.now() - this.startTime;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    showCelebration() {
        const celebration = document.getElementById('celebration');
        if (celebration) {
            celebration.style.display = 'flex';
            setTimeout(() => {
                celebration.style.display = 'none';
            }, 3000);
        }
    }

    generateRandomTime() {
        return {
            hours: Math.floor(Math.random() * 12) + 1,
            minutes: Math.floor(Math.random() * 12) * 5
        };
    }

    generateTimeOptions(correct) {
        const options = [correct];
        const time = this.parseTime(correct);
        
        while (options.length < 4) {
            const variation = {
                hours: time.hours + Math.floor(Math.random() * 3) - 1,
                minutes: time.minutes + (Math.floor(Math.random() * 3) - 1) * 15
            };
            
            if (variation.hours <= 0) variation.hours = 12;
            if (variation.hours > 12) variation.hours = 1;
            if (variation.minutes < 0) variation.minutes = 45;
            if (variation.minutes >= 60) variation.minutes = 0;
            
            const option = this.formatTime(variation);
            if (!options.includes(option)) {
                options.push(option);
            }
        }
        
        return this.shuffleArray(options);
    }

    parseTime(timeStr) {
        const parts = timeStr.split(':');
        return {
            hours: parseInt(parts[0]),
            minutes: parseInt(parts[1])
        };
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    formatTime(time) {
        const hours = String(time.hours).padStart(2, '0');
        const minutes = String(time.minutes).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    addStars(count) {
        const starCount = document.getElementById('star-count');
        if (starCount) {
            const current = parseInt(starCount.textContent) || 0;
            starCount.textContent = current + count;
        }
    }
}

class ClockQuizManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = null;
        this.questionStartTime = null;
        this.totalTime = 0;
        this.setClockTime = { hours: 12, minutes: 0 };
        this.drawSetClock = null;
        this.init();
    }

    init() {
        this.setupQuizControls();
        this.setupInteractiveClock();
    }

    setupQuizControls() {
        const nextBtn = document.getElementById('clock-next-question');
        const restartBtn = document.getElementById('clock-restart-quiz');
        const checkBtn = document.getElementById('check-clock');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.startQuiz());
        }
        
        if (checkBtn) {
            checkBtn.addEventListener('click', () => this.checkAnswer());
        }
    }

    startQuiz() {
        this.questions = this.generateQuestions();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.totalTime = 0;
        
        this.hideResults();
        this.showQuestion();
        this.startTimer();
    }

    generateQuestions() {
        const questions = [];
        
        for (let i = 0; i < 10; i++) {
            questions.push({
                targetTime: this.generateRandomTime()
            });
        }
        
        return questions;
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        const displayEl = document.getElementById('target-time-display');
        const counterEl = document.getElementById('clock-current-question');
        const nextBtn = document.getElementById('clock-next-question');
        
        if (counterEl) {
            counterEl.textContent = this.currentQuestionIndex + 1;
        }
        
        if (displayEl) {
            displayEl.textContent = this.formatTime(question.targetTime);
        }
        
        // Reset clock to default position
        this.setClockTime = { hours: 12, minutes: 0 };
        if (this.drawSetClock) {
            this.drawSetClock();
        }
        
        this.clearFeedback();
        
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
        this.questionStartTime = Date.now();
    }

    checkAnswer() {
        const question = this.questions[this.currentQuestionIndex];
        const feedbackEl = document.getElementById('clock-feedback');
        const nextBtn = document.getElementById('clock-next-question');
        
        if (!feedbackEl || !question) return;
        
        const tolerance = 5; // 5 minute tolerance
        const targetMinutes = question.targetTime.hours * 60 + question.targetTime.minutes;
        const userMinutes = this.setClockTime.hours * 60 + this.setClockTime.minutes;
        const minuteDiff = Math.abs(targetMinutes - userMinutes);
        
        if (minuteDiff <= tolerance) {
            this.score++;
            feedbackEl.textContent = '✅ Perfect! You set the clock correctly!';
            feedbackEl.className = 'feedback correct';
            this.addStars(1);
        } else {
            feedbackEl.textContent = `❌ Not quite right. Try to get closer to ${this.formatTime(question.targetTime)}`;
            feedbackEl.className = 'feedback incorrect';
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    clearFeedback() {
        const feedbackEl = document.getElementById('clock-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }
    }

    setupInteractiveClock() {
        const canvas = document.getElementById('set-clock-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        const drawClock = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw clock face
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = '#5e72e4';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw hour marks
            for (let i = 0; i < 60; i++) {
                const angle = (i * 6 - 90) * Math.PI / 180;
                const x1 = centerX + Math.cos(angle) * (radius - 5);
                const y1 = centerY + Math.sin(angle) * (radius - 5);
                const x2 = centerX + Math.cos(angle) * (radius - (i % 5 === 0 ? 15 : 10));
                const y2 = centerY + Math.sin(angle) * (radius - (i % 5 === 0 ? 15 : 10));
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = i % 5 === 0 ? '#5e72e4' : '#ddd';
                ctx.lineWidth = i % 5 === 0 ? 2 : 1;
                ctx.stroke();
            }
            
            // Draw numbers
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#5e72e4';
            
            for (let num = 1; num <= 12; num++) {
                const angle = (num * 30 - 90) * Math.PI / 180;
                const x = centerX + Math.cos(angle) * (radius - 30);
                const y = centerY + Math.sin(angle) * (radius - 30);
                ctx.fillText(num.toString(), x, y);
            }
            
            // Draw hour hand
            const hourAngle = ((this.setClockTime.hours % 12 + this.setClockTime.minutes / 60) * 30 - 90) * Math.PI / 180;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(hourAngle) * (radius * 0.5),
                centerY + Math.sin(hourAngle) * (radius * 0.5)
            );
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            // Draw minute hand
            const minuteAngle = (this.setClockTime.minutes * 6 - 90) * Math.PI / 180;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(minuteAngle) * (radius * 0.7),
                centerY + Math.sin(minuteAngle) * (radius * 0.7)
            );
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            // Draw center dot
            ctx.beginPath();
            ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
            ctx.fillStyle = '#5e72e4';
            ctx.fill();
        };
        
        let isDragging = false;
        let dragTarget = null;
        
        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left - centerX,
                y: e.clientY - rect.top - centerY
            };
        };
        
        const getTouchPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            return {
                x: touch.clientX - rect.left - centerX,
                y: touch.clientY - rect.top - centerY
            };
        };
        
        const startDrag = (pos) => {
            const distance = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
            
            if (distance < radius * 0.5) {
                dragTarget = 'hour';
                isDragging = true;
            } else if (distance < radius * 0.7) {
                dragTarget = 'minute';
                isDragging = true;
            }
        };
        
        const updateDrag = (pos) => {
            if (!isDragging) return;
            
            const angle = Math.atan2(pos.y, pos.x);
            const degrees = (angle * 180 / Math.PI + 90 + 360) % 360;
            
            if (dragTarget === 'hour') {
                this.setClockTime.hours = Math.round(degrees / 30) % 12 || 12;
            } else if (dragTarget === 'minute') {
                this.setClockTime.minutes = Math.round(degrees / 6) % 60;
            }
            
            drawClock();
        };
        
        canvas.addEventListener('mousedown', (e) => {
            startDrag(getMousePos(e));
        });
        
        canvas.addEventListener('mousemove', (e) => {
            updateDrag(getMousePos(e));
        });
        
        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            dragTarget = null;
        });
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrag(getTouchPos(e));
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            updateDrag(getTouchPos(e));
        });
        
        canvas.addEventListener('touchend', () => {
            isDragging = false;
            dragTarget = null;
        });
        
        this.drawSetClock = drawClock;
        drawClock();
    }

    showResults() {
        this.stopTimer();
        
        const questionEl = document.getElementById('clock-quiz-question');
        const feedbackEl = document.getElementById('clock-feedback');
        const nextBtn = document.getElementById('clock-next-question');
        const resultsEl = document.getElementById('clock-quiz-results');
        const scoreEl = document.getElementById('clock-quiz-score');
        const timeEl = document.getElementById('clock-total-time');
        const starsEl = document.getElementById('clock-earned-stars');
        
        if (questionEl) questionEl.style.display = 'none';
        if (feedbackEl) feedbackEl.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        
        if (resultsEl) {
            resultsEl.style.display = 'block';
            
            if (scoreEl) {
                scoreEl.textContent = this.score;
            }
            
            if (timeEl) {
                timeEl.textContent = Math.floor(this.totalTime / 1000);
            }
            
            if (starsEl) {
                let stars = '';
                const starCount = Math.min(3, Math.floor(this.score / 4) + 1);
                for (let i = 0; i < starCount; i++) {
                    stars += '⭐';
                }
                starsEl.textContent = stars;
                
                if (this.score === 10) {
                    this.showCelebration();
                }
            }
        }
    }

    hideResults() {
        const questionEl = document.getElementById('clock-quiz-question');
        const resultsEl = document.getElementById('clock-quiz-results');
        
        if (questionEl) questionEl.style.display = 'block';
        if (resultsEl) resultsEl.style.display = 'none';
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const timerEl = document.getElementById('clock-quiz-time');
            if (timerEl) {
                timerEl.textContent = elapsed;
            }
            this.totalTime = Date.now() - this.startTime;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    showCelebration() {
        const celebration = document.getElementById('celebration');
        if (celebration) {
            celebration.style.display = 'flex';
            setTimeout(() => {
                celebration.style.display = 'none';
            }, 3000);
        }
    }

    generateRandomTime() {
        return {
            hours: Math.floor(Math.random() * 12) + 1,
            minutes: Math.floor(Math.random() * 12) * 5
        };
    }

    formatTime(time) {
        const hours = String(time.hours).padStart(2, '0');
        const minutes = String(time.minutes).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    addStars(count) {
        const starCount = document.getElementById('star-count');
        if (starCount) {
            const current = parseInt(starCount.textContent) || 0;
            starCount.textContent = current + count;
        }
    }
}

window.ActivitiesManager = ActivitiesManager;
window.CompareTimeQuizManager = CompareTimeQuizManager;
window.MathQuizManager = MathQuizManager;
window.ClockQuizManager = ClockQuizManager;