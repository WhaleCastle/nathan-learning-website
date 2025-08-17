# Implementation Plan

- [ ] 1. Setup baseline documentation and shared structure


  - Create comprehensive screenshots of all existing pages and states for comparison
  - Create backup of current codebase for rollback capability
  - Create `/assets` directory structure without modifying existing files
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 2. Extract and analyze existing CSS for shared components
- [ ] 2.1 Analyze time-and-clock CSS structure and create component inventory
  - Read and document all CSS rules from `time-and-clock/css/style.css`
  - Identify reusable components (buttons, cards, navigation, etc.)
  - Create mapping of CSS classes to visual components
  - _Requirements: 1.1, 3.1, 4.1_

- [ ] 2.2 Analyze basic-calculation CSS structure and identify commonalities
  - Read and document CSS rules from `basic-calculation/assets/css/base.css` and `calc.css`
  - Compare with time-and-clock styles to identify shared patterns
  - Document differences that need to be preserved as topic-specific styles
  - _Requirements: 1.1, 3.1, 4.2_

- [ ] 2.3 Analyze main site inline CSS and extract reusable patterns
  - Extract inline CSS from `index.php` and document all styles
  - Identify common patterns that can be shared across all sites
  - Create inventory of colors, fonts, and layout patterns used
  - _Requirements: 1.1, 3.1_

- [ ] 3. Create shared CSS foundation with exact style replication
- [ ] 3.1 Create base CSS file with core styles and CSS custom properties
  - Write `assets/css/base.css` with reset, typography, and layout utilities
  - Define CSS custom properties that match existing color values exactly
  - Implement responsive breakpoints that match current behavior exactly
  - _Requirements: 1.1, 1.2, 3.1, 4.1, 4.2_

- [ ] 3.2 Create components CSS file with standardized UI elements
  - Write `assets/css/components.css` with button, card, and navigation components
  - Ensure each component produces identical visual output to existing implementations
  - Include all state variations (hover, active, disabled, selected)
  - _Requirements: 1.1, 3.1, 6.1_

- [ ] 3.3 Create themes CSS file with consistent color system
  - Write `assets/css/themes.css` with color variables and theming system
  - Ensure color values match existing implementations exactly
  - Include all feedback colors (success, error, warning) used across sites
  - _Requirements: 1.1, 3.1, 3.2_

- [ ] 4. Refactor main site to use shared CSS architecture
- [ ] 4.1 Extract inline CSS from index.php to shared files
  - Move all inline CSS from `index.php` to appropriate shared CSS files
  - Update `index.php` to include shared CSS files with cache busting
  - Verify visual output matches original exactly using browser dev tools
  - _Requirements: 1.1, 1.2, 4.1_

- [ ] 4.2 Test main site functionality and visual consistency
  - Compare screenshots before and after refactoring
  - Test responsive behavior across all breakpoints
  - Verify all animations and hover effects work identically
  - _Requirements: 3.1, 3.2, 4.1_

- [ ] 5. Refactor time-and-clock to use shared resources
- [ ] 5.1 Create topic-specific CSS file for time-and-clock unique styles
  - Write `time-and-clock/css/topic-specific.css` with only unique styles
  - Include clock-specific styling, canvas elements, and quiz layouts
  - Ensure all existing visual elements are preserved exactly
  - _Requirements: 6.1, 6.2, 4.1_

- [ ] 5.2 Update time-and-clock HTML to use shared CSS files
  - Modify `time-and-clock/index.php` to include shared CSS files first
  - Add topic-specific CSS file last to enable proper overrides
  - Implement cache busting for all CSS files
  - _Requirements: 1.1, 1.2, 4.1_

- [ ] 5.3 Test time-and-clock functionality preservation
  - Test all clock interactions, drag functionality, and animations
  - Verify all quiz types work identically to original implementation
  - Test responsive behavior and ensure no layout shifts occur
  - Compare screenshots pixel-by-pixel with original
  - _Requirements: 3.1, 3.2, 4.1_

- [ ] 6. Refactor basic-calculation to use shared resources
- [ ] 6.1 Create topic-specific CSS file for basic-calculation unique styles
  - Write `basic-calculation/css/topic-specific.css` with calculation-specific styles
  - Include keypad styling, mode cards, and progress indicators
  - Preserve all existing visual styling exactly
  - _Requirements: 6.1, 6.2, 4.2_

- [ ] 6.2 Update basic-calculation HTML and asset paths
  - Modify `basic-calculation/index.php` to use shared CSS architecture
  - Update asset paths to use shared resources where appropriate
  - Maintain topic-specific assets in dedicated directory
  - _Requirements: 1.1, 2.1, 2.2, 4.2_

- [ ] 6.3 Test basic-calculation functionality preservation
  - Test all quiz modes, keypad interactions, and progress tracking
  - Verify history functionality and navigation work identically
  - Test responsive behavior across all device sizes
  - Compare visual output with original implementation
  - _Requirements: 3.1, 3.2, 4.2_

- [ ] 7. Create comprehensive layout design guide
- [ ] 7.1 Write layout guide documentation in doc folder
  - Create `doc/layout-guide.md` with comprehensive design guidelines
  - Include HTML structure templates for common components
  - Document CSS class usage examples and best practices
  - _Requirements: 7.1, 7.2, 5.1_

- [ ] 7.2 Document shared CSS component library
  - Create documentation for all shared CSS classes and components
  - Include visual examples and code snippets for each component
  - Document responsive behavior and breakpoint usage
  - _Requirements: 7.3, 5.2, 5.3_

- [ ] 8. Final validation and testing
- [ ] 8.1 Perform comprehensive cross-browser testing
  - Test all refactored sites in Chrome, Firefox, Safari, and Edge
  - Verify identical appearance and functionality across browsers
  - Test on multiple device sizes and orientations
  - _Requirements: 3.1, 3.2, 4.1, 4.2_

- [ ] 8.2 Validate performance and accessibility
  - Measure CSS load times and ensure no performance degradation
  - Verify accessibility standards are maintained across all sites
  - Test keyboard navigation and screen reader compatibility
  - _Requirements: 3.1, 4.1, 4.2_

- [ ] 8.3 Create templates and guidelines for future mini-websites
  - Create HTML template files for new mini-websites
  - Document the process for adding new learning topics
  - Establish coding standards and conventions for future development
  - _Requirements: 5.1, 5.3, 7.4_