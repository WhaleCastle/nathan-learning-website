<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Practice History</title>
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
            <h1>📊 Practice History</h1>
        </header>

        <main class="card">
            <h2>Your Last 10 Sessions</h2>
            
            <div class="history-container">
                <div id="history-content">
                    <p>Loading history...</p>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <button class="btn-secondary" onclick="clearHistory()">Clear History</button>
                    <button class="btn-primary" onclick="window.location.href='index.php'">Back to Practice</button>
                </div>
            </div>
        </main>
    </div>

    <script>
        function loadHistory() {
            const history = localStorage.getItem('calcHistory');
            const historyContent = document.getElementById('history-content');
            
            if (!history) {
                historyContent.innerHTML = '<p>No practice history yet. Start practicing to see your progress!</p>';
                return;
            }
            
            const sessions = JSON.parse(history);
            
            if (sessions.length === 0) {
                historyContent.innerHTML = '<p>No practice history yet. Start practicing to see your progress!</p>';
                return;
            }
            
            let html = '<table class="history-table">';
            html += '<thead><tr>';
            html += '<th>Date & Time</th>';
            html += '<th>Mode</th>';
            html += '<th>Difficulty</th>';
            html += '<th>Score</th>';
            html += '<th>Time</th>';
            html += '<th>Accuracy</th>';
            html += '</tr></thead>';
            html += '<tbody>';
            
            sessions.forEach(session => {
                const date = new Date(session.date);
                const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                
                let difficulty = '';
                if (session.level) {
                    const levels = ['Single Digit', '2 Digits', '3 Digits'];
                    difficulty = levels[session.level - 1] || 'Level ' + session.level;
                } else if (session.table) {
                    difficulty = 'Table ' + session.table;
                }
                
                const accuracy = Math.round((session.score / 20) * 100);
                
                html += '<tr>';
                html += `<td>${dateStr}</td>`;
                html += `<td>${session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}</td>`;
                html += `<td>${difficulty}</td>`;
                html += `<td>${session.score}/20</td>`;
                html += `<td>${session.duration}s</td>`;
                html += `<td>${accuracy}%</td>`;
                html += '</tr>';
            });
            
            html += '</tbody></table>';
            
            historyContent.innerHTML = html;
        }
        
        function clearHistory() {
            if (confirm('Are you sure you want to clear all history?')) {
                localStorage.removeItem('calcHistory');
                loadHistory();
            }
        }
        
        document.addEventListener('DOMContentLoaded', loadHistory);
    </script>
</body>
</html>