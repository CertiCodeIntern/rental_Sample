/**
 * =====================================================
 * DASHBOARD PAGE JAVASCRIPT
 * Handles Dashboard functionality with mobile drawer
 * =====================================================
 */

(function() {
    // DOM Elements
    const body = document.body;
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');

    /**
     * Open the mobile drawer
     */
    function openDrawer() {
        body.classList.add('drawer-open');
        drawer.setAttribute('aria-hidden', 'false');
        hamburger.setAttribute('aria-expanded', 'true');
        backdrop.setAttribute('aria-hidden', 'false');
        
        // Focus first link in drawer for accessibility
        const firstLink = drawer.querySelector('a');
        if (firstLink) firstLink.focus();
    }

    /**
     * Close the mobile drawer
     */
    function closeDrawer() {
        body.classList.remove('drawer-open');
        drawer.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        backdrop.setAttribute('aria-hidden', 'true');
        hamburger.focus();
    }

    // Event Listeners
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (body.classList.contains('drawer-open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeDrawer);
    }

    // Close drawer on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && body.classList.contains('drawer-open')) {
            closeDrawer();
        }
    });

    // Close drawer when a link is clicked
    if (drawer) {
        drawer.addEventListener('click', function(e) {
            const target = e.target.closest('a');
            if (target) {
                closeDrawer();
            }
        });
    }

    // Expose Dashboard object for potential future use
    window.Dashboard = {
        openDrawer,
        closeDrawer
    };
})();
