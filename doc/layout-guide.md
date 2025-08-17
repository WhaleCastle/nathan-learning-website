# Layout Design Guide

## Overview

This guide provides comprehensive documentation for the Nathan Learning Website's shared CSS framework and layout patterns. All mini-websites should follow these guidelines to ensure consistency across the platform.

## Shared CSS Architecture

The shared CSS framework consists of three main files located in `/assets/css/`:

1. **base.css** - Core styles, reset, typography, and layout utilities
2. **components.css** - Reusable UI components library
3. **themes.css** - Color schemes, animations, and theming system

Each mini-website should include these files in order, followed by its own `topic-specific.css` for any unique styling needs.

## CSS Variable System

The framework uses CSS custom properties for consistent styling:

```css
:root {
    /* Primary Colors */
    --primary-color: #5e72e4;
    --primary-hover: #4c63d2;
    --secondary-color: #f5f5f5;
    
    /* Feedback Colors */
    --success-color: #28a745;
    --error-color: #dc3545;
    --warning-color: #ffc107;
    
    /* Typography */
    --font-family: 'Comic Sans MS', 'Arial', sans-serif;
    --font-size-base: 1rem;
    --font-size-lg: 1.2em;
    --font-size-xl: 1.5em;
    --font-size-2xl: 2em;
    --font-size-3xl: 2.5em;
    --font-size-4xl: 3em;
    
    /* Spacing */
    --spacing-xs: 5px;
    --spacing-sm: 10px;
    --spacing-md: 20px;
    --spacing-lg: 30px;
    --spacing-xl: 40px;
    
    /* Border Radius */
    --border-radius-sm: 8px;
    --border-radius-md: 10px;
    --border-radius-lg: 15px;
    --border-radius-xl: 20px;
    --border-radius-round: 25px;
}
```

## Standard Page Layout

### Basic HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Page Title</title>
    <?php
    // Cache busting for CSS files
    $baseTimestamp = filemtime('../assets/css/base.css');
    $componentsTimestamp = filemtime('../assets/css/components.css');
    $themesTimestamp = filemtime('../assets/css/themes.css');
    $topicTimestamp = filemtime('css/topic-specific.css');
    ?>
    <link rel="stylesheet" href="../assets/css/base.css?v=<?php echo $baseTimestamp; ?>">
    <link rel="stylesheet" href="../assets/css/components.css?v=<?php echo $componentsTimestamp; ?>">
    <link rel="stylesheet" href="../assets/css/themes.css?v=<?php echo $themesTimestamp; ?>">
    <link rel="stylesheet" href="css/topic-specific.css?v=<?php echo $topicTimestamp; ?>">
</head>
<body>
    <div id="app">
        <!-- Page content here -->
    </div>
</body>
</html>
```

### Header Component

The standard header includes the title, navigation links, and optional score display:

```html
<header>
    <h1>🎯 Page Title</h1>
    <div class="nav-links">
        <a href="../index.php" class="nav-link">🏠 Home</a>
        <a href="other-page.php" class="nav-link">📊 Other</a>
    </div>
    <div class="score-display">
        <span>⭐ Score: 100</span>
    </div>
</header>
```

## Component Library

### Buttons

```html
<!-- Primary Button -->
<button class="btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn-secondary">Secondary Action</button>

<!-- Disabled State -->
<button class="btn-primary" disabled>Disabled</button>
```

### Cards

```html
<!-- Basic Card -->
<div class="card">
    <h2>Card Title</h2>
    <p>Card content goes here...</p>
</div>

<!-- Mode Selection Card -->
<div class="mode-card" data-mode="example">
    <div class="icon">🎯</div>
    <h3>Mode Title</h3>
    <p>Mode description</p>
</div>
```

### Navigation

```html
<!-- Activity Navigation -->
<nav class="activity-nav">
    <button class="nav-btn active">Activity 1</button>
    <button class="nav-btn">Activity 2</button>
    <button class="nav-btn">Activity 3</button>
</nav>
```

### Quiz Components

```html
<!-- Quiz Container -->
<div class="quiz-container">
    <!-- Quiz Header -->
    <div class="quiz-header">
        <div class="question-counter">Question 1 of 10</div>
        <div class="quiz-timer">Time: 30s</div>
    </div>
    
    <!-- Quiz Question -->
    <div class="quiz-question">
        What is 2 + 2?
    </div>
    
    <!-- Quiz Options -->
    <div class="quiz-options">
        <button class="quiz-option">3</button>
        <button class="quiz-option">4</button>
        <button class="quiz-option">5</button>
        <button class="quiz-option">6</button>
    </div>
</div>
```

### Feedback Messages

```html
<!-- Success Feedback -->
<div class="feedback correct">
    Great job! That's correct!
</div>

<!-- Error Feedback -->
<div class="feedback incorrect">
    Not quite. Try again!
</div>
```

### Keypad Component

```html
<div class="keypad">
    <button class="keypad-btn">1</button>
    <button class="keypad-btn">2</button>
    <button class="keypad-btn">3</button>
    <button class="keypad-btn">4</button>
    <button class="keypad-btn">5</button>
    <button class="keypad-btn">6</button>
    <button class="keypad-btn">7</button>
    <button class="keypad-btn">8</button>
    <button class="keypad-btn">9</button>
    <button class="keypad-btn zero">0</button>
    <button class="keypad-btn clear">Clear</button>
    <button class="keypad-btn backspace">⌫</button>
    <button class="keypad-btn ok">OK</button>
</div>
```

### Progress Bar

```html
<div class="progress-bar">
    <div class="progress-fill" style="width: 60%">60%</div>
</div>
```

## Responsive Design

The framework includes three breakpoints:

1. **Desktop**: Default styles (min-width: 1025px)
2. **Tablet**: `@media (max-width: 1024px) and (min-width: 769px)`
3. **Mobile**: `@media (max-width: 768px)`

### Responsive Guidelines

- **Touch Targets**: Minimum 44px height for all interactive elements on mobile
- **Font Sizes**: Automatically scale down on smaller screens
- **Layout**: Flex containers switch to column direction on mobile
- **Grid**: Responsive grid columns that stack on smaller screens
- **Spacing**: Reduced padding and margins on mobile devices

## Utility Classes

### Layout Utilities

```html
<!-- Flexbox -->
<div class="flex">Flex container</div>
<div class="flex-center">Centered flex container</div>
<div class="flex-between">Space-between flex container</div>
<div class="flex-column">Column flex container</div>

<!-- Grid -->
<div class="grid">Grid container</div>

<!-- Text Alignment -->
<div class="text-center">Centered text</div>
```

### Spacing Utilities

```html
<!-- Margins -->
<div class="m-md">Medium margin all sides</div>
<div class="mt-lg">Large margin top</div>
<div class="mb-sm">Small margin bottom</div>

<!-- Padding -->
<div class="p-lg">Large padding all sides</div>
<div class="p-0">No padding</div>
```

### Display Utilities

```html
<div class="hidden">Hidden element</div>
<div class="block">Block element</div>
<div class="inline-block">Inline-block element</div>
```

## Animation Classes

```html
<!-- Bounce Animation -->
<h1 class="animate-bounce">Bouncing Title</h1>

<!-- Wiggle Animation -->
<span class="animate-wiggle">Wiggling Icon</span>

<!-- Pulse Animation -->
<div class="animate-pulse">Pulsing Element</div>

<!-- Twinkle Animation -->
<div class="animate-twinkle">Twinkling Star</div>
```

## Creating a New Mini-Website

### Step 1: Directory Structure

```
new-topic/
├── index.php
├── css/
│   └── topic-specific.css
├── js/
│   └── main.js
└── assets/
    └── (topic-specific assets)
```

### Step 2: Base Template

Use this template for new pages:

```php
<?php
// Any PHP logic here
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Your Topic Title</title>
    <?php
    $baseTimestamp = filemtime('../assets/css/base.css');
    $componentsTimestamp = filemtime('../assets/css/components.css');
    $themesTimestamp = filemtime('../assets/css/themes.css');
    $topicTimestamp = filemtime('css/topic-specific.css');
    ?>
    <link rel="stylesheet" href="../assets/css/base.css?v=<?php echo $baseTimestamp; ?>">
    <link rel="stylesheet" href="../assets/css/components.css?v=<?php echo $componentsTimestamp; ?>">
    <link rel="stylesheet" href="../assets/css/themes.css?v=<?php echo $themesTimestamp; ?>">
    <link rel="stylesheet" href="css/topic-specific.css?v=<?php echo $topicTimestamp; ?>">
</head>
<body>
    <div id="app">
        <header>
            <h1>🎯 Your Topic Title</h1>
            <div class="nav-links">
                <a href="../index.php" class="nav-link">🏠 Home</a>
            </div>
        </header>
        
        <main class="card">
            <!-- Your content here -->
        </main>
    </div>
    
    <script src="js/main.js"></script>
</body>
</html>
```

### Step 3: Topic-Specific Styles

Create `css/topic-specific.css` only for unique styles that aren't covered by the shared framework:

```css
/* Topic-Specific Styles */

/* Only add styles that are unique to this topic */
.special-feature {
    /* Unique styling */
}

/* Override shared styles if needed */
.card {
    /* Topic-specific override */
}
```

### Step 4: Update Main Menu Configuration

**⚠️ IMPORTANT**: Your new learning topic will not appear on the main menu until you update the topics configuration file.

Add your new topic to `config/topics.php` to make it appear on the main page:

```php
<?php
return [
    'basic-calculation' => [
        'name' => 'Basic Calculation',
        'description' => 'Practice addition, subtraction, multiplication, and division',
        'icon' => '➕',
        'active' => true
    ],
    'time-and-clock' => [
        'name' => 'Time And Clock',
        'description' => 'Learn to tell time and work with clocks',
        'icon' => '🕐',
        'active' => true
    ],
    'your-new-topic' => [    // Must match your directory name exactly
        'name' => 'Your Topic Display Name',
        'description' => 'Brief description of what users will learn',
        'icon' => '🎯',       // Emoji icon for the main menu
        'active' => true      // Set to false to temporarily hide the topic
    ]
];
```

**Configuration Notes:**
- The array key (`'your-new-topic'`) must **exactly match** your directory name
- The `name` field is displayed as the topic title on the main page
- The `description` appears as subtitle text under the topic name
- The `icon` should be a single emoji that represents your topic
- Set `active` to `false` to hide the topic without deleting the directory
- The main page only displays topics where `active` is `true` and the directory exists

## Best Practices

1. **Always use shared components first** - Only create custom styles when absolutely necessary
2. **Follow the CSS variable system** - Use variables for colors, spacing, and sizes
3. **Maintain responsive behavior** - Test on all device sizes
4. **Keep accessibility in mind** - Ensure proper contrast and touch targets
5. **Use semantic HTML** - Proper heading hierarchy and ARIA labels where needed
6. **Cache busting** - Always implement timestamp-based cache busting for CSS files
7. **Progressive enhancement** - Ensure functionality works without JavaScript
8. **Performance** - Minimize custom CSS and leverage shared styles
9. **Don't forget topics configuration** - Always update `config/topics.php` when creating new learning topics, or they won't appear on the main menu

## Component States

Most interactive components support these states:

- **Default**: Normal appearance
- **Hover**: Mouse hover state (desktop only)
- **Active**: Currently selected or pressed
- **Disabled**: Non-interactive state
- **Success**: Positive feedback (green)
- **Error**: Negative feedback (red)

## Accessibility Guidelines

1. **Color Contrast**: Maintain WCAG AA compliance (4.5:1 for normal text)
2. **Touch Targets**: Minimum 44x44px on mobile devices
3. **Keyboard Navigation**: All interactive elements must be keyboard accessible
4. **Focus Indicators**: Clear visual focus states for keyboard users
5. **Screen Readers**: Proper ARIA labels and semantic HTML

## Migration Checklist

When migrating existing mini-websites to use shared CSS:

- [ ] Backup existing CSS files
- [ ] Include shared CSS files with cache busting
- [ ] Create topic-specific.css for unique styles
- [ ] Update HTML to use shared component classes
- [ ] Test all functionality remains identical
- [ ] Verify responsive behavior on all devices
- [ ] Check for visual regressions
- [ ] Update any JavaScript that relies on CSS classes
- [ ] **Ensure topic is properly configured in `config/topics.php`**

## Support and Updates

- Always test changes across all mini-websites when updating shared CSS
- Document any new components or utilities added to the framework
- Maintain backward compatibility when possible
- Use feature flags for experimental changes