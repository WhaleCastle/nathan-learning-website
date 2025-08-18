<?php
$mode = isset($_GET['mode']) ? $_GET['mode'] : 'add';
$level = isset($_GET['level']) ? $_GET['level'] : '1';
$table = isset($_GET['table']) ? $_GET['table'] : '2';

$modeNames = [
    'add' => 'Addition',
    'sub' => 'Subtraction',
    'mul' => 'Multiplication',
    'div' => 'Division'
];

$modeName = isset($modeNames[$mode]) ? $modeNames[$mode] : 'Practice';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title><?php echo $modeName; ?> Practice</title>
    <?php
    // Cache busting for CSS files
    $baseTimestamp = file_exists('../assets/css/base.css') ? filemtime('../assets/css/base.css') : time();
    $componentsTimestamp = file_exists('../assets/css/components.css') ? filemtime('../assets/css/components.css') : time();
    $themesTimestamp = file_exists('../assets/css/themes.css') ? filemtime('../assets/css/themes.css') : time();
    $topicTimestamp = file_exists('css/topic-specific.css') ? filemtime('css/topic-specific.css') : time();
    ?>
    <link rel="stylesheet" href="../assets/css/base.css?v=<?php echo $baseTimestamp; ?>">
    <link rel="stylesheet" href="../assets/css/components.css?v=<?php echo $componentsTimestamp; ?>">
    <link rel="stylesheet" href="../assets/css/themes.css?v=<?php echo $themesTimestamp; ?>">
    <link rel="stylesheet" href="css/topic-specific.css?v=<?php echo $topicTimestamp; ?>">
</head>
<body>
    <div id="app">
        <header>
            <h1><?php echo $modeName; ?> Practice</h1>
            <div class="nav-links">
                <a href="index.php" class="nav-link">⬅️ Back</a>
                <a href="history.php" class="nav-link">📊 History</a>
            </div>
        </header>

        <main class="card">
            <div class="quiz-header">
                <div class="question-counter">Question <span id="current-question">1</span> of 20</div>
                <div class="quiz-timer">Time: <span id="quiz-time">0</span>s</div>
            </div>

            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill" style="width: 5%">5%</div>
            </div>

            <div id="quiz-active" class="quiz-container">
                <div class="question-panel">
                    <div class="question-display" id="question-display">Loading...</div>
                    <div class="answer-display" id="answer-display"></div>
                    <div id="feedback" class="feedback"></div>
                </div>

                <div class="keypad-panel">
                    <div class="keypad" id="keypad">
                        <button class="keypad-btn" data-value="1">1</button>
                        <button class="keypad-btn" data-value="2">2</button>
                        <button class="keypad-btn" data-value="3">3</button>
                        <button class="keypad-btn" data-value="4">4</button>
                        <button class="keypad-btn" data-value="5">5</button>
                        <button class="keypad-btn" data-value="6">6</button>
                        <button class="keypad-btn" data-value="7">7</button>
                        <button class="keypad-btn" data-value="8">8</button>
                        <button class="keypad-btn" data-value="9">9</button>
                        <button class="keypad-btn zero" data-value="0">0</button>
                        <button class="keypad-btn clear" data-action="clear">Clear</button>
                        <button class="keypad-btn backspace" data-action="backspace">⌫</button>
                        <button class="keypad-btn ok" data-action="ok" disabled>OK</button>
                    </div>
                </div>
            </div>

            <div id="quiz-results" class="quiz-results" style="display: none;">
                <h3>Quiz Complete!</h3>
                <div class="score-display">
                    <p>Score: <span id="quiz-score">0</span>/20</p>
                    <p>Time: <span id="total-time">0</span> seconds</p>
                    <p>Accuracy: <span id="accuracy">0</span>%</p>
                </div>
                <button class="btn-primary" onclick="retryQuiz()">Retry Same Mode</button>
                <button class="btn-secondary" onclick="window.location.href='index.php'">Choose Another Mode</button>
            </div>

            <div class="idle-prompt" id="idle-prompt">
                <h3>Are you still there?</h3>
                <p>You've been idle for a while. Click continue to keep practicing!</p>
                <button class="btn-primary" onclick="continueQuiz()">Continue</button>
            </div>
        </main>
    </div>

    <script>
        const quizConfig = {
            mode: '<?php echo $mode; ?>',
            level: '<?php echo $level; ?>',
            table: '<?php echo $table; ?>'
        };
    </script>
    <script src="assets/js/utils.js"></script>
    <script src="assets/js/storage.js"></script>
    <script src="assets/js/generator.js"></script>
    <script src="assets/js/keypad.js"></script>
    <script src="assets/js/quiz.js"></script>
</body>
</html>