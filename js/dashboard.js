/**
 * =====================================================
 * DASHBOARD PAGE JAVASCRIPT
 * Handles Dashboard functionality
 * =====================================================
 */

const Dashboard = {
    activeTab: 'users',

    /**
     * Initialize the dashboard
     */
    init() {
        // Check authentication
        if (!Components.requireAuth()) {
            return;
        }

        // Get saved active tab or default to 'users'
        this.activeTab = localStorage.getItem('activeTab') || 'users';

        // Find the tab label for the topbar title
        const tab = Components.navTabs.find(t => t.id === this.activeTab);
        const title = tab?.label || 'Users';

        // Inject reusable components
        Components.injectSidebar('sidebarContainer', this.activeTab);
        Components.injectTopbar('topbarContainer', title);

        // Load initial content
        Components.loadTabContent(this.activeTab);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});
