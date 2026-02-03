/**
 * 404 Handler Script
 * Handles navigation errors and redirects to 404 page
 * Include this script in pages or use it for fetch/navigation error handling
 */

const ErrorHandler = {
    /**
     * Initialize error handling
     */
    init() {
        // Handle fetch errors for navigation
        this.interceptLinks();
        
        // Handle page load errors (for iframes, images, etc.)
        window.addEventListener('error', (e) => {
            // Only handle resource errors, not JS errors
            if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT')) {
                console.warn('Resource failed to load:', e.target.src);
            }
        }, true);
    },

    /**
     * Intercept link clicks to check if destination exists
     */
    interceptLinks() {
        document.addEventListener('click', async (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Skip external links, hash links, and special protocols
            if (!href || 
                href.startsWith('#') || 
                href.startsWith('http') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:') ||
                href.startsWith('javascript:')) {
                return;
            }
            
            // For local links, we can optionally check if they exist
            // This is disabled by default as it adds latency
            // Enable by setting ErrorHandler.precheck = true
            if (this.precheck) {
                e.preventDefault();
                const exists = await this.checkPageExists(href);
                if (exists) {
                    window.location.href = href;
                } else {
                    this.redirectTo404(href);
                }
            }
        });
    },

    /**
     * Check if a page exists via HEAD request
     * @param {string} url - URL to check
     * @returns {Promise<boolean>}
     */
    async checkPageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    /**
     * Redirect to 404 page with original path
     * @param {string} originalPath - The path that was not found
     */
    redirectTo404(originalPath) {
        // Store the original path for the 404 page to display
        sessionStorage.setItem('404_original_path', originalPath || window.location.pathname);
        window.location.href = 'pages/404.php';
    },

    /**
     * Get the original path that caused the 404
     * @returns {string}
     */
    getOriginalPath() {
        return sessionStorage.getItem('404_original_path') || window.location.pathname;
    },

    /**
     * Create a simple redirect page content
     * Use this when you need to redirect old URLs to new ones
     * @param {string} newUrl - The new URL to redirect to
     * @returns {string} HTML content
     */
    createRedirectPage(newUrl) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=${newUrl}">
    <title>Redirecting...</title>
    <script>window.location.replace('${newUrl}');</script>
</head>
<body>
    <p>Redirecting to <a href="${newUrl}">${newUrl}</a>...</p>
</body>
</html>`;
    },

    // Enable pre-checking links before navigation (adds latency)
    precheck: false
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ErrorHandler.init());
} else {
    ErrorHandler.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
