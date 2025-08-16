# Cache Busting Guide - After Server Upload

## What I've Added:

1. **Cache-busting parameters**: JavaScript and CSS files now have version numbers based on file modification time
2. **Meta tags**: Added cache prevention headers to the HTML
3. **.htaccess file**: Added server-level cache control for development

## Files Modified:
- `index.php` - Added cache-busting parameters and meta tags
- `.htaccess` - New file with cache control headers

## After Uploading to Your Server:

### Method 1: Hard Refresh (Recommended)
1. Upload all the modified files to your server
2. Open your website in the browser
3. Press `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (Mac) for a hard refresh
4. This should force the browser to download the new files

### Method 2: Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Method 3: Incognito/Private Mode
1. Open a new incognito/private browser window
2. Visit your website
3. This ensures no cached files are used

### Method 4: Developer Tools Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Refresh the page

## How Cache-Busting Works:
- JavaScript files now load as: `js/activities.js?v=1692123456`
- The version number changes whenever the file is modified
- Browsers see this as a "new" file and download it fresh

## Testing:
After uploading, you should see:
- "Compare Times" no longer shows "Loading..."
- Questions alternate between "Which is later?" and "Which is earlier?"
- Clock drawings appear correctly

## If Still Not Working:
1. Check that ALL files were uploaded (especially index.php)
2. Verify your server supports PHP
3. Check server error logs
4. Try accessing the files directly (e.g., yoursite.com/js/activities.js)
