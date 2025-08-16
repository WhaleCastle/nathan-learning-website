<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = uniqid();
}

if (!isset($_SESSION['stars'])) {
    $_SESSION['stars'] = 0;
}

$activities = [
    'clock-display' => 'Clock Practice',
    'compare-time' => 'Compare Times Quiz',
    'add-subtract' => 'Math Quiz',
    'set-clock' => 'Set Clock Quiz',
    'tell-time-quiz' => 'Tell Time Quiz',
    'quiz' => 'Time Quiz'
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Learn to Tell Time!</title>
    <?php 
    // Cache busting - use file modification time for better cache management
    $jsTimestamp = file_exists('js/main.js') ? filemtime('js/main.js') : time();
    $cssTimestamp = file_exists('css/style.css') ? filemtime('css/style.css') : time();
    ?>
    <link rel="stylesheet" href="css/style.css?v=<?php echo $cssTimestamp; ?>">
</head>
<body>
    <div id="app">
        <header>
            <h1>🕐 Time Learning Fun! 🕐</h1>
            <div class="nav-links">
                <a href="../index.php" class="nav-link">🏠 Home</a>
            </div>
            <div class="score-display">
                <span class="star-count">⭐ <span id="star-count"><?php echo $_SESSION['stars']; ?></span></span>
            </div>
        </header>

        <nav class="activity-nav">
            <?php foreach ($activities as $key => $label): ?>
                <button class="nav-btn" data-activity="<?php echo $key; ?>">
                    <?php echo $label; ?>
                </button>
            <?php endforeach; ?>
        </nav>

        <main id="activity-container">
            <div id="clock-display" class="activity-panel active">
                <h2>Practice Reading Time</h2>
                <div class="clock-container">
                    <div class="analog-clock-wrapper">
                        <canvas id="analog-clock" width="300" height="300"></canvas>
                        <div class="clock-controls">
                            <button id="toggle-drag" class="btn-primary">Enable Drag Mode</button>
                        </div>
                    </div>
                    <div class="digital-clock-wrapper">
                        <div id="digital-clock" class="digital-display">00:00:00</div>
                        <div class="time-format">
                            <button id="toggle-format" class="btn-secondary">12/24 Hour</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="compare-time" class="activity-panel">
                <h2>Compare Times Quiz!</h2>
                <div class="quiz-container">
                    <div class="quiz-header">
                        <div class="question-counter">Question <span id="compare-current-question">1</span> of 10</div>
                        <div class="quiz-timer">Time: <span id="compare-quiz-time">0</span>s</div>
                    </div>
                    <div id="compare-quiz-question" class="quiz-question">
                        <h3 id="compare-question">Loading...</h3>
                        <div class="compare-container">
                            <div class="time-card" id="time-card-1">
                                <canvas class="small-clock" width="150" height="150"></canvas>
                                <div class="time-label"></div>
                            </div>
                            <div class="vs-symbol">VS</div>
                            <div class="time-card" id="time-card-2">
                                <canvas class="small-clock" width="150" height="150"></canvas>
                                <div class="time-label"></div>
                            </div>
                        </div>

                    </div>
                    <div id="compare-feedback" class="feedback"></div>
                    <button id="compare-next-question" class="btn-primary" style="display:none;">Next Question</button>
                    <div id="compare-quiz-results" class="quiz-results" style="display:none;">
                        <h3>Quiz Complete!</h3>
                        <div class="score-display">
                            <p>Score: <span id="compare-quiz-score"></span>/10</p>
                            <p>Time: <span id="compare-total-time"></span> seconds</p>
                            <div id="compare-earned-stars" class="stars"></div>
                        </div>
                        <button id="compare-restart-quiz" class="btn-primary">Try Again</button>
                    </div>
                </div>
            </div>

            <div id="add-subtract" class="activity-panel">
                <h2>Add & Subtract Time Quiz!</h2>
                <div class="quiz-container">
                    <div class="quiz-header">
                        <div class="question-counter">Question <span id="math-current-question">1</span> of 10</div>
                        <div class="quiz-timer">Time: <span id="math-quiz-time">0</span>s</div>
                    </div>
                    <div id="math-quiz-question" class="quiz-question">
                        <div id="problem-display" class="problem-text"></div>
                    </div>
                    <div id="math-quiz-options" class="quiz-options"></div>
                    <div id="math-feedback" class="feedback"></div>
                    <button id="math-next-question" class="btn-primary" style="display:none;">Next Question</button>
                    <div id="math-quiz-results" class="quiz-results" style="display:none;">
                        <h3>Quiz Complete!</h3>
                        <div class="score-display">
                            <p>Score: <span id="math-quiz-score"></span>/10</p>
                            <p>Time: <span id="math-total-time"></span> seconds</p>
                            <div id="math-earned-stars" class="stars"></div>
                        </div>
                        <button id="math-restart-quiz" class="btn-primary">Try Again</button>
                    </div>
                </div>
            </div>

            <div id="set-clock" class="activity-panel">
                <h2>Set the Clock Quiz!</h2>
                <div class="quiz-container">
                    <div class="quiz-header">
                        <div class="question-counter">Question <span id="clock-current-question">1</span> of 10</div>
                        <div class="quiz-timer">Time: <span id="clock-quiz-time">0</span>s</div>
                    </div>
                    <div id="clock-quiz-question" class="quiz-question">
                        <div class="set-clock-container">
                            <div class="target-time">
                                <h3>Set the clock to:</h3>
                                <div id="target-time-display" class="target-display"></div>
                            </div>
                            <div class="interactive-clock">
                                <canvas id="set-clock-canvas" width="300" height="300"></canvas>
                            </div>
                            <button id="check-clock" class="btn-primary">Check My Answer</button>
                        </div>
                    </div>
                    <div id="clock-feedback" class="feedback"></div>
                    <button id="clock-next-question" class="btn-primary" style="display:none;">Next Question</button>
                    <div id="clock-quiz-results" class="quiz-results" style="display:none;">
                        <h3>Quiz Complete!</h3>
                        <div class="score-display">
                            <p>Score: <span id="clock-quiz-score"></span>/10</p>
                            <p>Time: <span id="clock-total-time"></span> seconds</p>
                            <div id="clock-earned-stars" class="stars"></div>
                        </div>
                        <button id="clock-restart-quiz" class="btn-primary">Try Again</button>
                    </div>
                </div>
            </div>

            <div id="quiz" class="activity-panel">
                <h2>Time Quiz!</h2>
                <div class="quiz-container">
                    <div class="quiz-header">
                        <div class="question-counter">Question <span id="current-question">1</span> of 10</div>
                        <div class="quiz-timer">Time: <span id="quiz-time">0</span>s</div>
                    </div>
                    <div id="quiz-question" class="quiz-question"></div>
                    <div id="quiz-options" class="quiz-options"></div>
                    <div id="quiz-feedback" class="feedback"></div>
                    <button id="next-question" class="btn-primary" style="display:none;">Next Question</button>
                    <div id="quiz-results" class="quiz-results" style="display:none;">
                        <h3>Quiz Complete!</h3>
                        <div class="score-display">
                            <p>Score: <span id="quiz-score"></span>/10</p>
                            <p>Time: <span id="total-time"></span> seconds</p>
                            <div id="earned-stars" class="stars"></div>
                        </div>
                        <button id="restart-quiz" class="btn-primary">Try Again</button>
                    </div>
                </div>
            </div>

            <div id="tell-time-quiz" class="activity-panel">
                <h2>Tell the Time!</h2>
                <div class="quiz-container">
                    <div class="quiz-header">
                        <div class="question-counter">Question <span id="tell-time-current-question">1</span> of 10</div>
                        <div class="quiz-timer">Time: <span id="tell-time-quiz-time">0</span>s</div>
                    </div>
                    <div id="tell-time-quiz-question" class="quiz-question"></div>
                    <div id="tell-time-quiz-options" class="quiz-options"></div>
                    <div id="tell-time-quiz-feedback" class="feedback"></div>
                    <button id="tell-time-next-question" class="btn-primary" style="display:none;">Next Question</button>
                    <div id="tell-time-quiz-results" class="quiz-results" style="display:none;">
                        <h3>Quiz Complete!</h3>
                        <div class="score-display">
                            <p>Score: <span id="tell-time-quiz-score"></span>/10</p>
                            <p>Time: <span id="tell-time-total-time"></span> seconds</p>
                            <div id="tell-time-earned-stars" class="stars"></div>
                        </div>
                        <button id="tell-time-restart-quiz" class="btn-primary">Try Again</button>
                    </div>
                </div>
            </div>
        </main>

        <div id="celebration" class="celebration-overlay" style="display:none;">
            <div class="celebration-content">
                <h2>🎉 Great Job! 🎉</h2>
                <div class="celebration-stars">⭐⭐⭐</div>
                <button class="btn-primary" onclick="closeCelebration()">Continue</button>
            </div>
        </div>
    </div>

    <?php 
    // Cache busting - add timestamp to force reload of JS files
    $timestamp = time(); 
    ?>
    <script src="js/clock.js?v=<?php echo $jsTimestamp; ?>"></script>
    <script src="js/activities.js?v=<?php echo $jsTimestamp; ?>"></script>
    <script src="js/quiz.js?v=<?php echo $jsTimestamp; ?>"></script>
    <script src="js/main.js?v=<?php echo $jsTimestamp; ?>"></script>
</body>
</html>