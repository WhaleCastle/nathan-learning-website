<?php
// Load learning topics configuration
$topicsConfig = require_once 'config/topics.php';

// Filter only active topics and verify directories exist
$activeTopics = [];
foreach ($topicsConfig as $directory => $config) {
    if ($config['active'] && is_dir($directory)) {
        $activeTopics[$directory] = $config;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nathan's Learning Corner</title>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap" rel="stylesheet">
    <?php
    // Cache busting for CSS files
    $baseTimestamp = filemtime('assets/css/base.css');
    $componentsTimestamp = filemtime('assets/css/components.css');
    $themesTimestamp = filemtime('assets/css/themes.css');
    ?>
    <link rel="stylesheet" href="assets/css/base.css?v=<?php echo $baseTimestamp; ?>">
    <link rel="stylesheet" href="assets/css/components.css?v=<?php echo $componentsTimestamp; ?>">
    <link rel="stylesheet" href="assets/css/themes.css?v=<?php echo $themesTimestamp; ?>">
    <style>
        /* Override font for main site only */
        body {
            font-family: 'Fredoka', 'Trebuchet MS', 'Arial Rounded MT Bold', Arial, sans-serif;
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
    
    <div class="main-site-container">
        <h1 class="main-site-title">🌟 Nathan's Learning Corner 🌟</h1>
        
        <div class="welcome-message">
            Welcome to your amazing learning adventure! Pick a topic below to start exploring! 🚀
        </div>
        
        <?php if (empty($activeTopics)): ?>
            <div class="no-topics">
                🎈 No learning topics available yet! Come back soon for exciting adventures! 🎈
            </div>
        <?php else: ?>
            <ul class="topic-list">
                <?php foreach ($activeTopics as $directory => $config): ?>
                    <li class="topic-item">
                        <a href="<?php echo htmlspecialchars($directory); ?>/" class="topic-link">
                            <span class="topic-icon"><?php echo htmlspecialchars($config['icon']); ?></span>
                            <?php echo htmlspecialchars($config['name']); ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>
</body>
</html>