class QuizManager {
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
        const nextBtn = document.getElementById('next-question');
        const restartBtn = document.getElementById('restart-quiz');
        
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
        const types = ['read-analog', 'read-digital', 'compare', 'add-subtract', 'word-problem'];
        
        for (let i = 0; i < 10; i++) {
            const type = types[i % types.length];
            questions.push(this.generateQuestion(type));
        }
        
        return this.shuffleArray(questions);
    }

    generateQuestion(type) {
        switch(type) {
            case 'read-analog':
                return this.generateAnalogQuestion();
            case 'read-digital':
                return this.generateDigitalQuestion();
            case 'compare':
                return this.generateCompareQuestion();
            case 'add-subtract':
                return this.generateMathQuestion();
            case 'word-problem':
                return this.generateWordProblem();
            default:
                return this.generateAnalogQuestion();
        }
    }

    generateAnalogQuestion() {
        const time = this.generateRandomTime();
        const correctAnswer = this.formatTime(time);
        const options = this.generateTimeOptions(correctAnswer);
        
        return {
            type: 'analog',
            question: 'What time does the clock show?',
            time: time,
            correctAnswer: correctAnswer,
            options: options,
            requiresClock: true
        };
    }

    generateDigitalQuestion() {
        const time = this.generateQuarterTime();
        const correctAnswer = this.formatTimeInWords(time);
        
        // Generate wrong options by creating variations of the time
        const wrongOptions = [];
        
        // Option 1: Wrong hour with same minute description
        const wrongHour1 = time.hours === 12 ? 1 : time.hours + 1;
        wrongOptions.push(this.formatTimeInWords({ hours: wrongHour1, minutes: time.minutes }));
        
        // Option 2: Different minute description with same hour
        const quarterMinutes = [0, 15, 30, 45];
        const currentIndex = quarterMinutes.indexOf(time.minutes);
        const alternativeMinutes = quarterMinutes[(currentIndex + 1) % 4];
        wrongOptions.push(this.formatTimeInWords({ hours: time.hours, minutes: alternativeMinutes }));
        
        // Option 3: Different hour and different quarter time
        const wrongHour3 = time.hours <= 6 ? time.hours + 6 : time.hours - 6;
        const wrongMinutes3 = quarterMinutes[(currentIndex + 2) % 4];
        wrongOptions.push(this.formatTimeInWords({ hours: wrongHour3, minutes: wrongMinutes3 }));
        
        // Filter out duplicates and ensure we have unique options
        const uniqueOptions = [correctAnswer];
        for (const option of wrongOptions) {
            if (!uniqueOptions.includes(option) && uniqueOptions.length < 4) {
                uniqueOptions.push(option);
            }
        }
        
        // Fill remaining slots if needed with quarter times
        while (uniqueOptions.length < 4) {
            const randomTime = this.generateQuarterTime();
            const option = this.formatTimeInWords(randomTime);
            if (!uniqueOptions.includes(option)) {
                uniqueOptions.push(option);
            }
        }
        
        return {
            type: 'digital',
            question: `How would you say ${this.formatTime(time)}?`,
            correctAnswer: correctAnswer,
            options: this.shuffleArray(uniqueOptions)
        };
    }

    generateCompareQuestion() {
        const time1 = this.generateRandomTime();
        const time2 = this.generateRandomTime();
        
        const minutes1 = time1.hours * 60 + time1.minutes;
        const minutes2 = time2.hours * 60 + time2.minutes;
        
        let correctAnswer;
        if (minutes1 > minutes2) {
            correctAnswer = this.formatTime(time1);
        } else if (minutes2 > minutes1) {
            correctAnswer = this.formatTime(time2);
        } else {
            correctAnswer = 'Same time';
        }
        
        return {
            type: 'compare',
            question: `Which time is later: ${this.formatTime(time1)} or ${this.formatTime(time2)}?`,
            correctAnswer: correctAnswer,
            options: [this.formatTime(time1), this.formatTime(time2), 'Same time']
        };
    }

    generateMathQuestion() {
        const startTime = this.generateRandomTime();
        const changeHours = Math.floor(Math.random() * 2) + 1;
        const changeMinutes = Math.floor(Math.random() * 4) * 15;
        const operation = Math.random() > 0.5 ? 'add' : 'subtract';
        
        let resultTime;
        let question;
        
        if (operation === 'add') {
            question = `What time is ${changeHours} hour${changeHours > 1 ? 's' : ''} and ${changeMinutes} minutes after ${this.formatTime(startTime)}?`;
            let totalMinutes = startTime.hours * 60 + startTime.minutes + changeHours * 60 + changeMinutes;
            resultTime = {
                hours: Math.floor(totalMinutes / 60) % 12 || 12,
                minutes: totalMinutes % 60
            };
        } else {
            question = `What time is ${changeHours} hour${changeHours > 1 ? 's' : ''} and ${changeMinutes} minutes before ${this.formatTime(startTime)}?`;
            let totalMinutes = startTime.hours * 60 + startTime.minutes - changeHours * 60 - changeMinutes;
            if (totalMinutes < 0) totalMinutes += 12 * 60;
            resultTime = {
                hours: Math.floor(totalMinutes / 60) || 12,
                minutes: totalMinutes % 60
            };
        }
        
        const correctAnswer = this.formatTime(resultTime);
        const options = this.generateTimeOptions(correctAnswer);
        
        return {
            type: 'math',
            question: question,
            correctAnswer: correctAnswer,
            options: options
        };
    }

    generateWordProblem() {
        const scenarios = [
            {
                template: 'School starts at {time1}. If you wake up at {time2}, how much time do you have to get ready?',
                type: 'duration'
            },
            {
                template: 'The movie starts at {time1}. If it lasts 2 hours, what time does it end?',
                type: 'add'
            },
            {
                template: 'Lunch is at {time1}. If you eat for 30 minutes, what time do you finish?',
                type: 'add-fixed'
            },
            {
                template: 'Bedtime is at {time1}. If you need to brush your teeth 15 minutes before, what time should you start?',
                type: 'subtract-fixed'
            }
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const time1 = this.generateRandomTime();
        const time2 = this.generateRandomTime();
        
        let question = scenario.template.replace('{time1}', this.formatTime(time1));
        question = question.replace('{time2}', this.formatTime(time2));
        
        let correctAnswer;
        
        switch(scenario.type) {
            case 'duration':
                const diff = Math.abs((time1.hours * 60 + time1.minutes) - (time2.hours * 60 + time2.minutes));
                const hours = Math.floor(diff / 60);
                const minutes = diff % 60;
                correctAnswer = `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minutes`;
                break;
            case 'add':
                const endTime = {
                    hours: (time1.hours + 2) % 12 || 12,
                    minutes: time1.minutes
                };
                correctAnswer = this.formatTime(endTime);
                break;
            case 'add-fixed':
                let totalMin = time1.hours * 60 + time1.minutes + 30;
                correctAnswer = this.formatTime({
                    hours: Math.floor(totalMin / 60) % 12 || 12,
                    minutes: totalMin % 60
                });
                break;
            case 'subtract-fixed':
                let startMin = time1.hours * 60 + time1.minutes - 15;
                if (startMin < 0) startMin += 12 * 60;
                correctAnswer = this.formatTime({
                    hours: Math.floor(startMin / 60) || 12,
                    minutes: startMin % 60
                });
                break;
        }
        
        const options = scenario.type === 'duration' 
            ? this.generateDurationOptions(correctAnswer)
            : this.generateTimeOptions(correctAnswer);
        
        return {
            type: 'word',
            question: question,
            correctAnswer: correctAnswer,
            options: options
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

    generateDurationOptions(correct) {
        const options = [correct];
        const variations = [
            '1 hour and 30 minutes',
            '2 hours and 0 minutes',
            '45 minutes',
            '1 hour and 15 minutes',
            '2 hours and 30 minutes'
        ];
        
        for (const variation of variations) {
            if (!options.includes(variation) && options.length < 4) {
                options.push(variation);
            }
        }
        
        return this.shuffleArray(options.slice(0, 4));
    }

    parseTime(timeStr) {
        const parts = timeStr.split(':');
        return {
            hours: parseInt(parts[0]),
            minutes: parseInt(parts[1])
        };
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        const questionEl = document.getElementById('quiz-question');
        const optionsEl = document.getElementById('quiz-options');
        const counterEl = document.getElementById('current-question');
        const nextBtn = document.getElementById('next-question');
        
        if (counterEl) {
            counterEl.textContent = this.currentQuestionIndex + 1;
        }
        
        if (questionEl) {
            questionEl.innerHTML = '';
            
            if (question.requiresClock) {
                const canvas = document.createElement('canvas');
                canvas.width = 150;
                canvas.height = 150;
                questionEl.appendChild(canvas);
                drawSmallClock(canvas, question.time.hours, question.time.minutes);
                
                const text = document.createElement('div');
                text.textContent = question.question;
                text.style.marginTop = '15px';
                questionEl.appendChild(text);
            } else {
                questionEl.textContent = question.question;
            }
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
        
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
        this.questionStartTime = Date.now();
        this.clearFeedback();
    }

    selectAnswer(answer, buttonEl) {
        const question = this.questions[this.currentQuestionIndex];
        const optionsEl = document.getElementById('quiz-options');
        const feedbackEl = document.getElementById('quiz-feedback');
        const nextBtn = document.getElementById('next-question');
        
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
                feedbackEl.textContent = '✅ Correct! Well done!';
                feedbackEl.className = 'feedback correct';
            }
            this.addStars(1);
        } else {
            if (feedbackEl) {
                feedbackEl.textContent = `❌ The correct answer is: ${question.correctAnswer}`;
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
        const feedbackEl = document.getElementById('quiz-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }
    }

    showResults() {
        this.stopTimer();
        
        const questionEl = document.getElementById('quiz-question');
        const optionsEl = document.getElementById('quiz-options');
        const feedbackEl = document.getElementById('quiz-feedback');
        const nextBtn = document.getElementById('next-question');
        const resultsEl = document.getElementById('quiz-results');
        const scoreEl = document.getElementById('quiz-score');
        const timeEl = document.getElementById('total-time');
        const starsEl = document.getElementById('earned-stars');
        
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
        const questionEl = document.getElementById('quiz-question');
        const optionsEl = document.getElementById('quiz-options');
        const resultsEl = document.getElementById('quiz-results');
        
        if (questionEl) questionEl.style.display = 'block';
        if (optionsEl) optionsEl.style.display = 'grid';
        if (resultsEl) resultsEl.style.display = 'none';
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const timerEl = document.getElementById('quiz-time');
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

    formatTimeInWords(time) {
        const hour = time.hours;
        const minutes = time.minutes;
        
        // Convert hour to word form
        const hourWords = {
            1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six',
            7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve'
        };
        
        const currentHour = hourWords[hour];
        const nextHour = hourWords[hour === 12 ? 1 : hour + 1];
        
        // Handle the four quarter-hour cases
        switch (minutes) {
            case 0:
                return `${currentHour} o'clock`;
            case 15:
                return `a quarter past ${currentHour}`;
            case 30:
                return `half past ${currentHour}`;
            case 45:
                return `a quarter to ${nextHour}`;
            default:
                // This should not happen with our quarter time generator
                return `${currentHour} o'clock`;
        }
    }

    generateQuarterTime() {
        const quarterMinutes = [0, 15, 30, 45];
        return {
            hours: Math.floor(Math.random() * 12) + 1,
            minutes: quarterMinutes[Math.floor(Math.random() * quarterMinutes.length)]
        };
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

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    addStars(count) {
        const starCount = document.getElementById('star-count');
        if (starCount) {
            const current = parseInt(starCount.textContent) || 0;
            starCount.textContent = current + count;
        }
    }
}

class TellTimeQuizManager {
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
        const nextBtn = document.getElementById('tell-time-next-question');
        const restartBtn = document.getElementById('tell-time-restart-quiz');
        
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
            questions.push(this.generateTellTimeQuestion());
        }
        
        return questions;
    }

    generateTellTimeQuestion() {
        const time = this.generateQuarterTime();
        const isAnalog = Math.random() < 0.5; // 50% chance for analog, 50% for digital
        const correctAnswer = this.formatTimeInWords(time);
        const options = this.generateTimeWordOptions(correctAnswer, time);
        
        return {
            type: isAnalog ? 'tell-time-analog' : 'tell-time-digital',
            question: 'How would you say this time?',
            time: time,
            correctAnswer: correctAnswer,
            options: options,
            requiresClock: isAnalog
        };
    }

    generateTimeWordOptions(correct, time) {
        const options = [correct];
        const quarterMinutes = [0, 15, 30, 45];
        
        // Generate wrong options by creating variations
        while (options.length < 4) {
            // Generate a different quarter time
            const wrongTime = {
                hours: Math.floor(Math.random() * 12) + 1,
                minutes: quarterMinutes[Math.floor(Math.random() * quarterMinutes.length)]
            };
            
            // Make sure it's different from the correct time
            if (wrongTime.hours !== time.hours || wrongTime.minutes !== time.minutes) {
                const option = this.formatTimeInWords(wrongTime);
                if (!options.includes(option)) {
                    options.push(option);
                }
            }
        }
        
        return this.shuffleArray(options);
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        const questionEl = document.getElementById('tell-time-quiz-question');
        const optionsEl = document.getElementById('tell-time-quiz-options');
        const counterEl = document.getElementById('tell-time-current-question');
        const nextBtn = document.getElementById('tell-time-next-question');
        
        if (counterEl) {
            counterEl.textContent = this.currentQuestionIndex + 1;
        }
        
        if (questionEl) {
            questionEl.innerHTML = '';
            
            if (question.requiresClock) {
                // Show analog clock
                const canvas = document.createElement('canvas');
                canvas.width = 150;
                canvas.height = 150;
                questionEl.appendChild(canvas);
                drawSmallClock(canvas, question.time.hours, question.time.minutes);
                
                const text = document.createElement('div');
                text.textContent = question.question;
                text.style.marginTop = '15px';
                questionEl.appendChild(text);
            } else {
                // Show digital time
                const digitalTimeDiv = document.createElement('div');
                digitalTimeDiv.style.fontSize = '2.5em';
                digitalTimeDiv.style.fontWeight = 'bold';
                digitalTimeDiv.style.color = '#5e72e4';
                digitalTimeDiv.style.margin = '20px 0';
                digitalTimeDiv.style.padding = '20px';
                digitalTimeDiv.style.backgroundColor = '#f8f9fa';
                digitalTimeDiv.style.borderRadius = '10px';
                digitalTimeDiv.style.border = '3px solid #5e72e4';
                digitalTimeDiv.textContent = this.formatTime(question.time);
                questionEl.appendChild(digitalTimeDiv);
                
                const text = document.createElement('div');
                text.textContent = question.question;
                text.style.marginTop = '15px';
                questionEl.appendChild(text);
            }
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
        
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
        this.questionStartTime = Date.now();
        this.clearFeedback();
    }

    selectAnswer(answer, buttonEl) {
        const question = this.questions[this.currentQuestionIndex];
        const optionsEl = document.getElementById('tell-time-quiz-options');
        const feedbackEl = document.getElementById('tell-time-quiz-feedback');
        const nextBtn = document.getElementById('tell-time-next-question');
        
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
                feedbackEl.textContent = '✅ Correct! Well done!';
                feedbackEl.className = 'feedback correct';
            }
            this.addStars(1);
        } else {
            if (feedbackEl) {
                feedbackEl.textContent = `❌ The correct answer is: ${question.correctAnswer}`;
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
        const feedbackEl = document.getElementById('tell-time-quiz-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }
    }

    showResults() {
        this.stopTimer();
        
        const questionEl = document.getElementById('tell-time-quiz-question');
        const optionsEl = document.getElementById('tell-time-quiz-options');
        const feedbackEl = document.getElementById('tell-time-quiz-feedback');
        const nextBtn = document.getElementById('tell-time-next-question');
        const resultsEl = document.getElementById('tell-time-quiz-results');
        const scoreEl = document.getElementById('tell-time-quiz-score');
        const timeEl = document.getElementById('tell-time-total-time');
        const starsEl = document.getElementById('tell-time-earned-stars');
        
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
        const questionEl = document.getElementById('tell-time-quiz-question');
        const optionsEl = document.getElementById('tell-time-quiz-options');
        const resultsEl = document.getElementById('tell-time-quiz-results');
        
        if (questionEl) questionEl.style.display = 'block';
        if (optionsEl) optionsEl.style.display = 'grid';
        if (resultsEl) resultsEl.style.display = 'none';
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const timerEl = document.getElementById('tell-time-quiz-time');
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

    formatTimeInWords(time) {
        const hour = time.hours;
        const minutes = time.minutes;
        
        // Convert hour to word form
        const hourWords = {
            1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six',
            7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve'
        };
        
        const currentHour = hourWords[hour];
        const nextHour = hourWords[hour === 12 ? 1 : hour + 1];
        
        // Handle the four quarter-hour cases
        switch (minutes) {
            case 0:
                return `${currentHour} o'clock`;
            case 15:
                return `a quarter past ${currentHour}`;
            case 30:
                return `half past ${currentHour}`;
            case 45:
                return `a quarter to ${nextHour}`;
            default:
                // This should not happen with our quarter time generator
                return `${currentHour} o'clock`;
        }
    }

    generateQuarterTime() {
        const quarterMinutes = [0, 15, 30, 45];
        return {
            hours: Math.floor(Math.random() * 12) + 1,
            minutes: quarterMinutes[Math.floor(Math.random() * quarterMinutes.length)]
        };
    }

    formatTime(time) {
        const hours = String(time.hours).padStart(2, '0');
        const minutes = String(time.minutes).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    addStars(count) {
        const starCount = document.getElementById('star-count');
        if (starCount) {
            const current = parseInt(starCount.textContent) || 0;
            starCount.textContent = current + count;
        }
    }
}

window.QuizManager = QuizManager;
window.TellTimeQuizManager = TellTimeQuizManager;