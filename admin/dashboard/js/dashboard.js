/**
 * Admin Dashboard Module
 * Handles dashboard functionality, theme switching, and data display
 * 
 * @fileoverview Admin dashboard JavaScript functionality
 */

// =====================================================
// THEME MANAGEMENT
// =====================================================
const ThemeManager = {
    STORAGE_KEY: 'certicode_admin_theme',
    
    /**
     * Initialize theme from storage or system preference
     */
    init() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'dark'); // Default to dark
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    /**
     * Set theme and update DOM
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.STORAGE_KEY, theme);
    },

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    /**
     * Get current theme
     */
    get() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }
};

// =====================================================
// DASHBOARD CONTROLLER
// =====================================================
const Dashboard = {
    /**
     * Initialize dashboard
     */
    init() {
        // Check authentication
        if (!this.checkAuth()) {
            return;
        }

        // Initialize theme
        ThemeManager.init();

        // Setup event listeners
        this.setupEventListeners();

        // Load admin info
        this.loadAdminInfo();
    },

    /**
     * Check if user is authenticated
     */
    checkAuth() {
        // Only check if AdminSession is available
        if (typeof AdminSession === 'undefined') {
            return true; // Allow dashboard to load, auth will be checked when session is available
        }
        
        if (!AdminSession.isAuthenticated()) {
            // Prevent redirect loop by checking if we're already on login page
            if (!window.location.pathname.includes('/admin/auth/')) {
                window.location.href = '/admin/auth/login.html';
            }
            return false;
        }
        return true;
    },

    /**
     * Load admin info into UI
     */
    loadAdminInfo() {
        if (typeof AdminSession === 'undefined') return;

        const session = AdminSession.get();
        if (!session) return;

        // Update profile button
        const profileAvatar = document.querySelector('.profile-avatar span');
        if (profileAvatar && session.fullName) {
            profileAvatar.textContent = session.fullName.charAt(0).toUpperCase();
        }

        // Update dropdown info
        const adminName = document.getElementById('adminName');
        const adminRole = document.getElementById('adminRole');
        const dropdownAvatar = document.querySelector('.dropdown-avatar');

        if (adminName) adminName.textContent = session.fullName || session.username;
        if (adminRole) adminRole.textContent = this.formatRole(session.role);
        if (dropdownAvatar) dropdownAvatar.textContent = session.fullName?.charAt(0).toUpperCase() || 'A';
    },

    /**
     * Format role for display
     */
    formatRole(role) {
        const roles = {
            'super_admin': 'Super Admin',
            'admin': 'Administrator',
            'manager': 'Manager',
            'staff': 'Staff'
        };
        return roles[role] || role;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => {
            ThemeManager.toggle();
        });

        // Profile dropdown
        const profileBtn = document.getElementById('profileBtn');
        const profileDropdown = document.getElementById('profileDropdown');

        profileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown?.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileDropdown?.contains(e.target) && !profileBtn?.contains(e.target)) {
                profileDropdown?.classList.remove('show');
            }
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn?.addEventListener('click', () => {
            this.handleLogout();
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput?.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Action buttons in table
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showActionMenu(e.target);
            });
        });
    },

    /**
     * Handle logout
     */
    handleLogout() {
        if (typeof AdminAuth !== 'undefined') {
            AdminAuth.logout();
        } else {
            localStorage.removeItem('certicode_admin_session');
            sessionStorage.removeItem('certicode_admin_session');
            window.location.href = '/admin/auth/login.html';
        }
    },

    /**
     * Handle search
     */
    handleSearch(query) {
        const tableBody = document.getElementById('bookingsTableBody');
        if (!tableBody) return;

        const rows = tableBody.querySelectorAll('tr');
        const searchTerm = query.toLowerCase().trim();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    },

    /**
     * Show action menu (placeholder)
     */
    showActionMenu(button) {
        // In a full implementation, this would show a dropdown menu
        console.log('[Dashboard] Action menu clicked');
        alert('Action menu coming soon!');
    }
};

// =====================================================
// MOCK DATA (For demonstration)
// =====================================================
const MockData = {
    bookings: [
        {
            id: 'BK001',
            customer: 'John Doe',
            machine: 'Grand Videoke Symphony',
            duration: '3 Days (Dec 12 - 15)',
            status: 'confirmed'
        },
        {
            id: 'BK002',
            customer: 'Alice Smith',
            machine: 'Platinum Karaoke P90',
            duration: '1 Day (Dec 12)',
            status: 'in-transit'
        },
        {
            id: 'BK003',
            customer: 'Bob Johnson',
            machine: 'Symphony 3 Pro Max',
            duration: '2 Days (Dec 11 - 13)',
            status: 'completed'
        },
        {
            id: 'BK004',
            customer: 'Charlie Brown',
            machine: 'Grand Videoke Rhapsody',
            duration: '5 Days (Dec 14 - 19)',
            status: 'pending'
        },
        {
            id: 'BK005',
            customer: 'Diana Prince',
            machine: 'Platinum Alpha Next',
            duration: '2 Days (Dec 12 - 14)',
            status: 'confirmed'
        }
    ],

    stats: {
        revenue: 12450,
        revenueChange: 12.1,
        activeRentals: 18,
        rentalsChange: 5.2,
        pendingDeliveries: 7,
        machinesAvailable: 24,
        totalMachines: 42
    },

    schedule: [
        { time: '09:00 AM', type: 'drop-off', customer: 'Alice Smith', machine: 'Platinum Karaoke', location: 'Makati City' },
        { time: '11:30 AM', type: 'drop-off', customer: 'Diana Prince', machine: 'Platinum Alpha', location: 'Taguig' },
        { time: '02:00 PM', type: 'pick-up', customer: 'Bob Johnson', machine: 'Symphony 3 Pro', location: 'Quezon City' },
        { time: '04:30 PM', type: 'drop-off', customer: 'Future Booking', machine: 'Grand Videoke', location: 'Pasig' }
    ]
};

// =====================================================
// INITIALIZE ON DOM READY
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});

// Export for potential module use
window.Dashboard = Dashboard;
window.ThemeManager = ThemeManager;
