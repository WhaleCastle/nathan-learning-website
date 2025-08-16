<?php
// Get the current directory path
$currentDir = __DIR__;
$directories = [];

// Scan the current directory
if ($handle = opendir($currentDir)) {
    while (false !== ($entry = readdir($handle))) {
        // Check if it's a directory and not . or .. or cgi-bin
        if (is_dir($entry) && $entry != '.' && $entry != '..' && $entry != 'cgi-bin') {
            $directories[] = $entry;
        }
    }
    closedir($handle);
}

// Sort directories alphabetically
sort($directories);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nathan's Learning Corner</title>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Fredoka', 'Trebuchet MS', 'Arial Rounded MT Bold', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            background: linear-gradient(145deg, #ffffff 0%, #f8fbff 100%);
            padding: 40px;
            border-radius: 25px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            max-width: 900px;
            margin: 0 auto;
            border: 3px solid #ffeb3b;
        }
        
        h1 {
            color: #ff6b6b;
            text-align: center;
            margin-bottom: 40px;
            font-size: 3em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        .topic-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .topic-item {
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
            border-radius: 20px;
            padding: 25px;
            transition: all 0.3s ease;
            border: 3px solid #fff;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .topic-item:nth-child(even) {
            background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
        }
        
        .topic-item:nth-child(3n) {
            background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
        }
        
        .topic-item:nth-child(4n) {
            background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
        }
        
        .topic-item:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }
        
        .topic-link {
            text-decoration: none;
            color: white;
            font-weight: bold;
            font-size: 1.4em;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            min-height: 60px;
        }
        
        .topic-icon {
            margin-right: 15px;
            font-size: 2em;
            animation: wiggle 1s ease-in-out infinite alternate;
        }
        
        @keyframes wiggle {
            0% { transform: rotate(-3deg); }
            100% { transform: rotate(3deg); }
        }
        
        .no-topics {
            text-align: center;
            color: #666;
            font-size: 1.5em;
            padding: 40px;
            background: #fff3cd;
            border-radius: 15px;
            border: 2px dashed #ffc107;
        }
        
        .welcome-message {
            text-align: center;
            color: #555;
            font-size: 1.3em;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(255,255,255,0.8);
            border-radius: 15px;
            border: 2px solid #74b9ff;
        }
        
        .stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        }
        
        .star {
            position: absolute;
            background: #ffeb3b;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            animation: twinkle 2s infinite;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
    </style>
</head>
<body>
    <div class="stars">
        <div class="star" style="top: 10%; left: 10%; width: 20px; height: 20px; animation-delay: 0s;"></div>
        <div class="star" style="top: 20%; left: 80%; width: 15px; height: 15px; animation-delay: 0.5s;"></div>
        <div class="star" style="top: 60%; left: 15%; width: 25px; height: 25px; animation-delay: 1s;"></div>
        <div class="star" style="top: 80%; left: 70%; width: 18px; height: 18px; animation-delay: 1.5s;"></div>
        <div class="star" style="top: 30%; left: 60%; width: 22px; height: 22px; animation-delay: 2s;"></div>
    </div>
    
    <div class="container">
        <h1>🌟 Nathan's Learning Corner 🌟</h1>
        
        <div class="welcome-message">
            Welcome to your amazing learning adventure! Pick a topic below to start exploring! 🚀
        </div>
        
        <?php if (empty($directories)): ?>
            <div class="no-topics">
                🎈 No learning topics available yet! Come back soon for exciting adventures! 🎈
            </div>
        <?php else: ?>
            <ul class="topic-list">
                <?php 
                $icons = ['🎯', '🎨', '🔬', '📚', '🎮', '🎪', '🌈', '⭐', '🎭', '🎵'];
                $iconIndex = 0;
                foreach ($directories as $dir): 
                ?>
                    <li class="topic-item">
                        <a href="<?php echo htmlspecialchars($dir); ?>/" class="topic-link">
                            <span class="topic-icon"><?php echo $icons[$iconIndex % count($icons)]; ?></span>
                            <?php echo htmlspecialchars(ucwords(str_replace(['_', '-'], ' ', $dir))); ?>
                        </a>
                    </li>
                <?php 
                $iconIndex++;
                endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>
</body>
</html>