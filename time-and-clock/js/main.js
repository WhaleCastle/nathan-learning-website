document.addEventListener('DOMContentLoaded', function() {
    let clockManager = null;
    let activitiesManager = null;
    let quizManager = null;
    let tellTimeQuizManager = null;
    let compareTimeQuizManager = null;
    let mathQuizManager = null;
    let clockQuizManager = null;
    
    const navButtons = document.querySelectorAll('.nav-btn');
    const activityPanels = document.querySelectorAll('.activity-panel');
    
    // Wait for all scripts to load before initializing activities manager
    setTimeout(() => {
        activitiesManager = new ActivitiesManager();
    }, 50);
    
    function switchActivity(activityId) {
        activityPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const targetPanel = document.getElementById(activityId);
        const targetButton = document.querySelector(`[data-activity="${activityId}"]`);
        
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
        
        if (targetButton) {
            targetButton.classList.add('active');
        }
        
        if (activityId === 'clock-display' && !clockManager) {
            clockManager = new ClockManager();
        } else if (activityId === 'compare-time') {
            if (!compareTimeQuizManager) {
                compareTimeQuizManager = new CompareTimeQuizManager();
            }
            compareTimeQuizManager.startQuiz();
        } else if (activityId === 'add-subtract') {
            if (!mathQuizManager) {
                mathQuizManager = new MathQuizManager();
            }
            mathQuizManager.startQuiz();
        } else if (activityId === 'set-clock') {
            if (!clockQuizManager) {
                clockQuizManager = new ClockQuizManager();
            }
            clockQuizManager.startQuiz();
        } else if (activityId === 'quiz') {
            if (!quizManager) {
                quizManager = new QuizManager();
            }
            quizManager.startQuiz();
        } else if (activityId === 'tell-time-quiz') {
            if (!tellTimeQuizManager) {
                tellTimeQuizManager = new TellTimeQuizManager();
            }
            tellTimeQuizManager.startQuiz();
        }
    }
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activityId = this.dataset.activity;
            switchActivity(activityId);
        });
    });
    
    switchActivity('clock-display');
    
    window.closeCelebration = function() {
        const celebration = document.getElementById('celebration');
        if (celebration) {
            celebration.style.display = 'none';
        }
    };
    
    const touchDevice = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
    
    if (touchDevice) {
        document.body.classList.add('touch-device');
    }
    
    function saveProgress() {
        const starCount = document.getElementById('star-count');
        if (starCount) {
            localStorage.setItem('userStars', starCount.textContent);
        }
    }
    
    function loadProgress() {
        const savedStars = localStorage.getItem('userStars');
        if (savedStars) {
            const starCount = document.getElementById('star-count');
            if (starCount) {
                starCount.textContent = savedStars;
            }
        }
    }
    
    loadProgress();
    
    window.addEventListener('beforeunload', saveProgress);
    
    setInterval(saveProgress, 30000);
    
    const starCount = document.getElementById('star-count');
    if (starCount) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const count = parseInt(starCount.textContent);
                    if (count > 0 && count % 10 === 0) {
                        showMilestone(count);
                    }
                }
            });
        });
        
        observer.observe(starCount, { 
            childList: true, 
            characterData: true, 
            subtree: true 
        });
    }
    
    function showMilestone(stars) {
        const messages = {
            10: "🎉 Great start! You've earned 10 stars!",
            20: "🌟 Amazing! 20 stars already!",
            30: "🏆 Wow! 30 stars - you're a time expert!",
            40: "💫 Incredible! 40 stars earned!",
            50: "🎊 SUPER! You've reached 50 stars!",
            100: "🌈 LEGENDARY! 100 stars - you're a TIME MASTER!"
        };
        
        if (messages[stars]) {
            const celebration = document.getElementById('celebration');
            if (celebration) {
                const content = celebration.querySelector('.celebration-content h2');
                if (content) {
                    content.textContent = messages[stars];
                }
                celebration.style.display = 'flex';
                setTimeout(() => {
                    celebration.style.display = 'none';
                }, 4000);
            }
        }
    }
    
    console.log('Clock Learning Website initialized!');
});