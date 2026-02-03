/**
 * =====================================================
 * PAGE LOADER
 * Injects and manages page transition loader
 * Include this in the <head> for best results
 * =====================================================
 */

// Inject loader immediately
(function() {
    // Apply saved theme first to prevent flash
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Only inject if not already present
    if (document.getElementById('pageLoader')) return;

    // Create loader element
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="page-loader-content">
            <div class="page-loader-logo">
                <img src="/rental_Sample/assets/images/rIT_logo_tp.png" alt="RentIt" onerror="this.style.display='none'">
            </div>
            <div class="page-loader-spinner"></div>
            <div class="page-loader-text">
                Loading<span class="page-loader-dots"><span></span><span></span><span></span></span>
            </div>
        </div>
    `;

    // Insert loader
    function insertLoader() {
        if (document.body && !document.getElementById('pageLoader')) {
            document.body.insertBefore(loader, document.body.firstChild);
        }
    }

    // Try inserting immediately or wait for body
    if (document.body) {
        insertLoader();
    } else {
        // Use MutationObserver to catch body creation
        const observer = new MutationObserver(function(mutations, obs) {
            if (document.body) {
                insertLoader();
                obs.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }

    // Hide loader when page is ready
    function hideLoader() {
        const pageLoader = document.getElementById('pageLoader');
        if (pageLoader) {
            // Small delay for smooth transition
            setTimeout(function() {
                pageLoader.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(function() {
                    if (pageLoader.parentNode) {
                        pageLoader.parentNode.removeChild(pageLoader);
                    }
                }, 300);
            }, 150);
        }
    }

    // Hide on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideLoader);
    } else {
        hideLoader();
    }

    // Fallback: hide on window load
    window.addEventListener('load', hideLoader);
})();
