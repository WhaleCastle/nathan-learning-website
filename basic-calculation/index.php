<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Basic Calculation Practice</title>
    <link rel="stylesheet" href="assets/css/base.css">
    <link rel="stylesheet" href="assets/css/calc.css">
</head>
<body>
    <div id="app">
        <header>
            <h1>➕ Basic Calculation Practice ➕</h1>
            <div class="nav-links">
                <a href="../index.php" class="nav-link">🏠 Home</a>
                <a href="history.php" class="nav-link">📊 History</a>
            </div>
        </header>

        <main class="card">
            <h2>Choose Your Practice Mode</h2>
            
            <div class="mode-selection">
                <div class="mode-card" data-mode="add">
                    <div class="icon">➕</div>
                    <h3>Addition</h3>
                    <div class="difficulty-options">
                        <label>
                            <input type="radio" name="add-level" value="1" checked>
                            Single Digit (0-9)
                        </label>
                        <label>
                            <input type="radio" name="add-level" value="2">
                            2 Digits (10-99)
                        </label>
                        <label>
                            <input type="radio" name="add-level" value="3">
                            3 Digits (100-999)
                        </label>
                    </div>
                    <button class="btn-primary start-btn" data-mode="add">Start Practice</button>
                </div>

                <div class="mode-card" data-mode="sub">
                    <div class="icon">➖</div>
                    <h3>Subtraction</h3>
                    <div class="difficulty-options">
                        <label>
                            <input type="radio" name="sub-level" value="1" checked>
                            Single Digit (0-9)
                        </label>
                        <label>
                            <input type="radio" name="sub-level" value="2">
                            2 Digits (10-99)
                        </label>
                        <label>
                            <input type="radio" name="sub-level" value="3">
                            3 Digits (100-999)
                        </label>
                    </div>
                    <button class="btn-primary start-btn" data-mode="sub">Start Practice</button>
                </div>

                <div class="mode-card" data-mode="mul">
                    <div class="icon">✖️</div>
                    <h3>Multiplication</h3>
                    <div class="difficulty-options">
                        <label>Times Table:</label>
                        <select name="mul-table">
                            <?php for($i = 1; $i <= 12; $i++): ?>
                                <option value="<?php echo $i; ?>"><?php echo $i; ?> Times Table</option>
                            <?php endfor; ?>
                        </select>
                    </div>
                    <button class="btn-primary start-btn" data-mode="mul">Start Practice</button>
                </div>

                <div class="mode-card" data-mode="div">
                    <div class="icon">➗</div>
                    <h3>Division</h3>
                    <div class="difficulty-options">
                        <label>Division Table:</label>
                        <select name="div-table">
                            <?php for($i = 1; $i <= 12; $i++): ?>
                                <option value="<?php echo $i; ?>">Divide by <?php echo $i; ?></option>
                            <?php endfor; ?>
                        </select>
                    </div>
                    <button class="btn-primary start-btn" data-mode="div">Start Practice</button>
                </div>
            </div>
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const CalcApp = window.CalcApp || {};
            
            const preferences = localStorage.getItem('calcPreferences');
            if (preferences) {
                const prefs = JSON.parse(preferences);
                if (prefs.lastMode) {
                    const modeCard = document.querySelector(`.mode-card[data-mode="${prefs.lastMode}"]`);
                    if (modeCard) {
                        if (prefs.lastLevel && (prefs.lastMode === 'add' || prefs.lastMode === 'sub')) {
                            const radio = modeCard.querySelector(`input[value="${prefs.lastLevel}"]`);
                            if (radio) radio.checked = true;
                        } else if (prefs.lastTable && (prefs.lastMode === 'mul' || prefs.lastMode === 'div')) {
                            const select = modeCard.querySelector('select');
                            if (select) select.value = prefs.lastTable;
                        }
                    }
                }
            }

            document.querySelectorAll('.start-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const mode = this.dataset.mode;
                    const modeCard = this.closest('.mode-card');
                    let params = `mode=${mode}`;
                    
                    if (mode === 'add' || mode === 'sub') {
                        const level = modeCard.querySelector('input[type="radio"]:checked').value;
                        params += `&level=${level}`;
                        
                        localStorage.setItem('calcPreferences', JSON.stringify({
                            lastMode: mode,
                            lastLevel: level
                        }));
                    } else if (mode === 'mul' || mode === 'div') {
                        const table = modeCard.querySelector('select').value;
                        params += `&table=${table}`;
                        
                        localStorage.setItem('calcPreferences', JSON.stringify({
                            lastMode: mode,
                            lastTable: table
                        }));
                    }
                    
                    window.location.href = `quiz.php?${params}`;
                });
            });
        });
    </script>
</body>
</html>