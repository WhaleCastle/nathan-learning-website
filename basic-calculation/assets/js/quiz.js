window.CalcApp = window.CalcApp || {};

CalcApp.quiz = {
    questions: [],
    currentIndex: 0,
    score: 0,
    startTime: null,
    questionStartTime: null,
    timerInterval: null,
    idleTimer: null,
    isActive: false,
    
    init: function() {
        this.questions = CalcApp.generator.generateQuestions(
            quizConfig.mode,
            quizConfig.level,
            quizConfig.table,
            20
        );
        
        this.currentIndex = 0;
        this.score = 0;
        this.startTime = null;
        this.isActive = true;
        
        CalcApp.keypad.init({
            onOk: (value) => this.checkAnswer(value)
        });
        
        this.showQuestion();
        this.startTimer();
        this.resetIdleTimer();
    },
    
    showQuestion: function() {
        if (this.currentIndex >= this.questions.length) {
            this.endQuiz();
            return;
        }
        
        const question = this.questions[this.currentIndex];
        const questionDisplay = document.getElementById('question-display');
        const currentQuestionSpan = document.getElementById('current-question');
        const progressFill = document.getElementById('progress-fill');
        
        if (questionDisplay) {
            questionDisplay.textContent = question.display;
        }
        
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = this.currentIndex + 1;
        }
        
        if (progressFill) {
            const progress = ((this.currentIndex + 1) / 20) * 100;
            progressFill.style.width = progress + '%';
            progressFill.textContent = Math.round(progress) + '%';
        }
        
        CalcApp.keypad.clear();
        CalcApp.keypad.enable();
        
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.style.display = 'none';
            feedback.className = 'feedback';
        }
        
        this.questionStartTime = Date.now();
        this.resetIdleTimer();
    },
    
    checkAnswer: function(userAnswer) {
        if (!this.isActive) return;
        
        const question = this.questions[this.currentIndex];
        const isCorrect = userAnswer === question.answer;
        
        if (isCorrect) {
            this.score++;
            this.showFeedback(true, 'Correct! Well done!');
            CalcApp.utils.playSound('correct');
        } else {
            this.showFeedback(false, `Incorrect. The answer is ${question.answer}`);
            CalcApp.utils.playSound('incorrect');
        }
        
        CalcApp.keypad.disable();
        
        setTimeout(() => {
            this.currentIndex++;
            this.showQuestion();
        }, isCorrect ? 1000 : 2000);
    },
    
    showFeedback: function(isCorrect, message) {
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
            feedback.style.display = 'block';
        }
    },
    
    startTimer: function() {
        this.startTime = Date.now();
        const timerSpan = document.getElementById('quiz-time');
        
        this.timerInterval = setInterval(() => {
            if (this.isActive && timerSpan) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                timerSpan.textContent = elapsed;
            }
        }, 1000);
    },
    
    stopTimer: function() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },
    
    resetIdleTimer: function() {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }
        
        this.idleTimer = setTimeout(() => {
            this.showIdlePrompt();
        }, 60000);
    },
    
    showIdlePrompt: function() {
        const prompt = document.getElementById('idle-prompt');
        if (prompt) {
            prompt.classList.add('active');
        }
    },
    
    endQuiz: function() {
        this.isActive = false;
        this.stopTimer();
        
        const duration = Math.floor((Date.now() - this.startTime) / 1000);
        const accuracy = Math.round((this.score / 20) * 100);
        
        document.getElementById('quiz-active').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'block';
        
        document.getElementById('quiz-score').textContent = this.score;
        document.getElementById('total-time').textContent = duration;
        document.getElementById('accuracy').textContent = accuracy;
        
        const historyEntry = {
            date: new Date().toISOString(),
            mode: quizConfig.mode,
            level: quizConfig.level || null,
            table: quizConfig.table || null,
            score: this.score,
            duration: duration
        };
        
        CalcApp.storage.saveHistory(historyEntry);
    }
};

function retryQuiz() {
    window.location.reload();
}

function continueQuiz() {
    const prompt = document.getElementById('idle-prompt');
    if (prompt) {
        prompt.classList.remove('active');
    }
    CalcApp.quiz.resetIdleTimer();
}

document.addEventListener('DOMContentLoaded', function() {
    CalcApp.quiz.init();
});