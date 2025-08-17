# Design Document

## Overview

This design outlines the refactoring of the Nathan Learning Website to implement a shared resources architecture. The current structure has each mini-website (time-and-clock, basic-calculation) maintaining separate CSS files and assets, leading to code duplication and inconsistent styling. The new architecture will consolidate shared resources while maintaining the flexibility for topic-specific customizations.

## Architecture

### Current Structure Analysis
- **time-and-clock**: Uses `css/style.css` (single large file ~15KB)
- **basic-calculation**: Uses `assets/css/base.css` + `assets/css/calc.css` (modular approach)
- **Main site**: Inline CSS in `index.php`

### Proposed New Structure
```
/
├── assets/                    # Shared resources directory
│   ├── css/
│   │   ├── base.css          # Core styles (reset, typography, layout)
│   │   ├── components.css    # Reusable UI components
│   │   └── themes.css        # Color schemes and theming
│   ├── js/
│   │   └── common.js         # Shared JavaScript utilities
│   ├── images/
│   │   └── icons/            # Shared icons and images
│   └── fonts/                # Web fonts (if needed)
├── doc/
│   └── layout-guide.md       # Comprehensive layout design guide
├── time-and-clock/
│   ├── css/
│   │   └── topic-specific.css # Topic-specific overrides only
│   └── ...
├── basic-calculation/
│   ├── css/
│   │   └── topic-specific.css # Topic-specific overrides only
│   └── ...
└── index.php                 # Updated to use shared CSS
```

## Components and Interfaces

### CSS Architecture

#### 1. Base Styles (`assets/css/base.css`)
- CSS reset and normalization
- Typography system (font families, sizes, line heights)
- Layout utilities (containers, grids, flexbox helpers)
- Responsive breakpoints and media queries
- Core color variables and CSS custom properties

#### 2. Component Library (`assets/css/components.css`)
Based on analysis of existing styles, the following components will be standardized:

**Navigation Components:**
- `.nav-link` - Standard navigation links
- `.nav-btn` - Activity/section navigation buttons
- `.nav-links` - Navigation container

**Button System:**
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-disabled` - Disabled state styling

**Card System:**
- `.card` - Basic card container
- `.mode-card` - Selection/mode cards
- `.time-card` - Specialized cards for time activities

**Quiz Components:**
- `.quiz-container` - Quiz layout container
- `.quiz-header` - Quiz progress and timer
- `.quiz-question` - Question display area
- `.quiz-options` - Answer options container
- `.quiz-results` - Results display
- `.feedback` - Feedback messages (correct/incorrect)

**Interactive Elements:**
- `.keypad` - Number pad layout
- `.keypad-btn` - Keypad button styling
- `.progress-bar` - Progress indicators

#### 3. Theme System (`assets/css/themes.css`)
- CSS custom properties for colors
- Consistent color palette across all topics
- Dark/light theme support (future enhancement)

### CSS Custom Properties (Variables)
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
  
  /* Background */
  --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --card-bg: white;
  
  /* Typography */
  --font-family: 'Comic Sans MS', 'Arial', sans-serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.2rem;
  --font-size-xl: 1.5rem;
  
  /* Spacing */
  --spacing-xs: 5px;
  --spacing-sm: 10px;
  --spacing-md: 20px;
  --spacing-lg: 30px;
  --spacing-xl: 40px;
  
  /* Border Radius */
  --border-radius-sm: 10px;
  --border-radius-md: 15px;
  --border-radius-lg: 20px;
  
  /* Shadows */
  --shadow-sm: 0 2px 5px rgba(0,0,0,0.1);
  --shadow-md: 0 5px 15px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.2);
}
```

### File Loading Strategy

#### PHP Include System
Each mini-website will include shared CSS files using PHP to enable cache busting:

```php
<?php
$cssTimestamp = filemtime('../assets/css/base.css');
$componentsTimestamp = filemtime('../assets/css/components.css');
$themesTimestamp = filemtime('../assets/css/themes.css');
?>
<link rel="stylesheet" href="../assets/css/base.css?v=<?php echo $cssTimestamp; ?>">
<link rel="stylesheet" href="../assets/css/components.css?v=<?php echo $componentsTimestamp; ?>">
<link rel="stylesheet" href="../assets/css/themes.css?v=<?php echo $themesTimestamp; ?>">
<!-- Topic-specific CSS loaded last for overrides -->
<link rel="stylesheet" href="css/topic-specific.css?v=<?php echo filemtime('css/topic-specific.css'); ?>">
```

## Data Models

### CSS Class Naming Convention
Following BEM (Block Element Modifier) methodology where appropriate:

- **Blocks**: `.nav`, `.card`, `.quiz`, `.keypad`
- **Elements**: `.nav__link`, `.card__title`, `.quiz__question`
- **Modifiers**: `.btn--primary`, `.card--selected`, `.feedback--correct`

### Asset Organization
```
assets/
├── images/
│   ├── icons/
│   │   ├── home.svg
│   │   ├── star.svg
│   │   └── clock.svg
│   └── backgrounds/
│       └── celebration.png
└── fonts/
    └── (future web fonts)
```

## Error Handling

### CSS Fallbacks
- Graceful degradation for older browsers
- Fallback fonts in font-family declarations
- Fallback colors for CSS custom properties
- Progressive enhancement for advanced CSS features

### Asset Loading
- Fallback mechanisms for missing CSS files
- Error handling in PHP file existence checks
- Default styling when shared resources fail to load

### Responsive Design
- Mobile-first approach with progressive enhancement
- Consistent breakpoints across all mini-websites:
  - Mobile: `max-width: 768px`
  - Tablet: `max-width: 1024px and min-width: 769px`
  - Desktop: `min-width: 1025px`

## Testing Strategy

### Zero-Impact Requirement
**CRITICAL**: Users must not notice any visual or functional differences after the refactoring. Every pixel, animation, interaction, and behavior must remain identical.

### Visual Regression Testing
1. **Pixel-Perfect Screenshots**: Capture high-resolution screenshots of every page and state before refactoring
2. **Side-by-Side Comparison**: Use automated visual diff tools to compare before/after screenshots
3. **Interactive State Testing**: Capture hover states, focus states, active states, and animations
4. **Cross-Browser Consistency**: Verify identical appearance across Chrome, Firefox, Safari, Edge
5. **Device-Specific Testing**: Test exact same appearance on mobile, tablet, and desktop viewports
6. **Component State Testing**: Test all component variations (selected, disabled, error, success states)

### Functionality Preservation Testing
1. **Interactive Elements**: Every button, input, and clickable element must behave identically
2. **Navigation Flow**: All navigation paths and user journeys must work exactly the same
3. **Quiz Functionality**: All quiz logic, scoring, and feedback must remain unchanged
4. **Animations and Transitions**: All CSS animations and transitions must be preserved
5. **Responsive Behavior**: Breakpoints and responsive layouts must match exactly
6. **Performance**: Page load times and interaction responsiveness must not degrade

### CSS Extraction Validation
1. **Style Computation**: Use browser dev tools to verify computed styles match exactly
2. **CSS Cascade Testing**: Ensure new CSS architecture produces identical final styles
3. **Specificity Preservation**: Maintain exact CSS specificity to prevent style conflicts
4. **Media Query Matching**: Verify responsive breakpoints trigger at identical viewport sizes

### Integration Testing
1. **Asset Loading**: Test that all shared resources load correctly without visual flicker
2. **Cache Busting**: Verify timestamp-based cache busting doesn't affect appearance
3. **Fallback Mechanisms**: Test graceful degradation when shared resources fail to load
4. **Topic-Specific Overrides**: Ensure topic-specific styles override shared styles correctly

### Automated Testing
1. **CSS Regression Tests**: Implement automated visual regression testing
2. **Functional Tests**: Create automated tests for all interactive features
3. **Performance Benchmarks**: Establish baseline performance metrics to maintain

## Migration Strategy

### Zero-Disruption Approach
The migration will be executed with extreme care to ensure no visual or functional changes occur. Each phase includes comprehensive before/after validation.

### Phase 1: Baseline Documentation and Setup
1. **Capture Current State**: Take comprehensive screenshots and document all existing functionality
2. **Create Backup**: Full backup of current codebase
3. **Setup Shared Structure**: Create `/assets` directory structure without affecting existing files
4. **Extract Styles Carefully**: Analyze existing CSS and create shared files that produce identical output

### Phase 2: Shared CSS Creation with Exact Replication
1. **Pixel-Perfect Extraction**: Extract common styles ensuring exact visual replication
2. **CSS Custom Properties**: Implement variables that match existing color values exactly
3. **Component Library**: Create components that render identically to current implementations
4. **Validation**: Use browser dev tools to verify computed styles match exactly

### Phase 3: Main Site Refactor with Zero Visual Impact
1. **Inline CSS Extraction**: Move inline CSS to shared files while maintaining exact appearance
2. **Progressive Implementation**: Update one section at a time with immediate validation
3. **Side-by-Side Testing**: Compare original vs. refactored versions pixel-by-pixel
4. **Rollback Plan**: Maintain ability to instantly revert if any issues are detected

### Phase 4: time-and-clock Refactor with Preservation Guarantee
1. **Style Analysis**: Map every CSS rule to ensure nothing is lost in translation
2. **Gradual Migration**: Replace CSS includes incrementally with validation at each step
3. **Functionality Testing**: Test every interactive feature to ensure identical behavior
4. **Performance Validation**: Ensure no performance degradation occurs

### Phase 5: basic-calculation Refactor with Exact Replication
1. **Asset Path Updates**: Update paths while maintaining exact same resource loading
2. **CSS Consolidation**: Merge existing CSS into shared system without any visual changes
3. **Interactive Testing**: Verify all quiz functionality works identically
4. **Cross-Reference Validation**: Compare with original implementation at every step

### Phase 6: Final Validation and Documentation
1. **Comprehensive Testing**: Full regression test suite across all browsers and devices
2. **Performance Benchmarking**: Ensure performance matches or exceeds original
3. **Documentation Creation**: Create layout guide and developer guidelines
4. **Future-Proofing**: Establish processes to maintain consistency for new mini-websites

### Rollback Strategy
- Maintain original files as backups throughout the process
- Implement feature flags to quickly switch between old and new implementations
- Create automated tests that can quickly validate the refactored version matches the original

## Performance Considerations

### CSS Optimization
- Minimize CSS file sizes through efficient selectors
- Use CSS custom properties to reduce redundancy
- Implement critical CSS loading for above-the-fold content
- Consider CSS minification for production

### Caching Strategy
- Implement timestamp-based cache busting for development
- Use versioned assets for production deployments
- Leverage browser caching for shared resources

### Loading Performance
- Load shared CSS files first for consistent base styling
- Load topic-specific CSS last to enable proper overrides
- Consider preloading critical shared resources