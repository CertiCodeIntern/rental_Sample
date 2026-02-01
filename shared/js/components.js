/**
 * =====================================================
 * REUSABLE COMPONENTS
 * Vanilla JS module for injecting common UI elements
 * =====================================================
 */

const Components = {
    /**
     * Navigation tabs configuration for the sidebar (Admin)
     */
    navTabs: [
        { id: 'users', icon: '👥', label: 'Users' },
        { id: 'rentals', icon: '📋', label: 'Rentals' },
        { id: 'items', icon: '🎤', label: 'Items' },
        { id: 'payments', icon: '💳', label: 'Payments' },
    ],

    /**
     * Navigation tabs for client dashboard
     */
    clientNavTabs: [
        { id: 'dashboard', icon: '🏠', label: 'Dashboard', href: '/client/dashboard.html' },
        { id: 'catalog', icon: '📦', label: 'Browse Catalog', href: '/client/catalog/catalog.html' },
        { id: 'myrentals', icon: '🎤', label: 'My Rentals', href: '/client/myrentals/myrentals.html' },
        { id: 'bookinghistory', icon: '📅', label: 'Booking History', href: '/client/bookinghistory/bookinghistory.html' },
        { id: 'contact', icon: '💬', label: 'Contact Us', href: '/pages/contact.html' },
    ],

    /**
     * Get current user from localStorage
     * @returns {Object} User object with name and role
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return { name: 'User', role: 'Customer' };
            }
        }
        return { name: 'User', role: 'Customer' };
    },

    /**
     * Get user's initial for avatar
     * @param {string} name - User's name
     * @returns {string} First character uppercase
     */
    getUserInitial(name) {
        return name?.charAt(0)?.toUpperCase() || 'U';
    },

    /**
     * Inject Sidebar into the DOM
     * @param {string} containerId - ID of the container element
     * @param {string} activeTab - Currently active tab ID
     * @param {string} context - Context type ('admin' or 'client')
     */
    injectSidebar(containerId, activeTab = 'users', context = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const user = this.getCurrentUser();
        const initial = this.getUserInitial(user.name);
        
        // Determine context based on URL if not provided
        const isClient = context === 'client' || window.location.pathname.includes('/client/');
        const tabs = isClient ? this.clientNavTabs : this.navTabs;

        const navItems = tabs.map(tab => {
            const isActive = activeTab === tab.id;
            if (tab.href) {
                // Client nav uses links with tooltip data attribute
                return `
                    <a class="nav-item ${isActive ? 'active' : ''}" href="${tab.href}" data-tooltip="${tab.label}">
                        <span class="nav-icon">${tab.icon}</span>
                        <span class="nav-label">${tab.label}</span>
                    </a>
                `;
            } else {
                // Admin nav uses buttons for SPA-style navigation
                return `
                    <button class="nav-item ${isActive ? 'active' : ''}" data-tab="${tab.id}" data-tooltip="${tab.label}">
                        <span class="nav-icon">${tab.icon}</span>
                        <span class="nav-label">${tab.label}</span>
                    </button>
                `;
            }
        }).join('');

        // Check localStorage for collapsed state
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

        container.innerHTML = `
            <aside class="sidebar${isCollapsed ? ' collapsed' : ''}" id="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-logo">
                        <img src="/assets/images/rIT_logo_tp.png" alt="RentIt Logo" class="sidebar-logo-icon">
                        <span class="sidebar-logo-text">RentIt</span>
                    </div>
                    <!-- Collapse Toggle Button -->
                    <button class="sidebar-collapse-btn" id="sidebarCollapseBtn" aria-label="Toggle sidebar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                    </button>
                </div>
                
                <nav class="sidebar-nav">
                    ${navItems}
                </nav>
                
                <div class="sidebar-footer">
                    <div class="sidebar-user">
                        <div class="sidebar-user-avatar">${initial}</div>
                        <div class="sidebar-user-info">
                            <span class="sidebar-user-name">${user.name || 'User'}</span>
                            <span class="sidebar-user-role">${user.role || 'Customer'}</span>
                        </div>
                    </div>
                    <button class="logout-btn" id="logoutBtn">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span class="logout-text">Logout</span>
                    </button>
                </div>
            </aside>
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
        `;

        // Apply collapsed state to app container
        if (isCollapsed) {
            document.querySelector('.app-container')?.classList.add('sidebar-collapsed');
        }

        // Attach event listeners
        this.attachSidebarEvents();
    },

    /**
     * Attach event listeners to sidebar elements
     */
    attachSidebarEvents() {
        // Nav item clicks
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                this.handleTabChange(tabId);
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Overlay click to close sidebar
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Sidebar collapse toggle
        const collapseBtn = document.getElementById('sidebarCollapseBtn');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => this.toggleSidebarCollapse());
        }
    },

    /**
     * Toggle sidebar collapsed state
     */
    toggleSidebarCollapse() {
        const sidebar = document.getElementById('sidebar');
        const appContainer = document.querySelector('.app-container');
        
        if (sidebar) {
            const isCollapsed = sidebar.classList.toggle('collapsed');
            appContainer?.classList.toggle('sidebar-collapsed', isCollapsed);
            
            // Persist to localStorage
            localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
        }
    },

    /**
     * Handle tab change
     * @param {string} tabId - ID of the tab to switch to
     */
    handleTabChange(tabId) {
        // Update active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabId);
        });

        // Update topbar title
        const tab = this.navTabs.find(t => t.id === tabId);
        const titleEl = document.getElementById('pageTitle');
        if (titleEl && tab) {
            titleEl.textContent = tab.label;
        }

        // Update content
        this.loadTabContent(tabId);
        
        // Close sidebar on mobile
        this.closeSidebar();

        // Save active tab to localStorage
        localStorage.setItem('activeTab', tabId);
    },

    /**
     * Load content for a specific tab
     * @param {string} tabId - ID of the tab
     */
    loadTabContent(tabId) {
        const contentArea = document.getElementById('contentArea');
        if (!contentArea) return;

        const tab = this.navTabs.find(t => t.id === tabId);
        
        // Generate sample content for each tab
        contentArea.innerHTML = `
            <div class="data-table-container">
                <div class="data-table-header">
                    <h2 class="data-table-title">${tab?.label || 'Content'} Management</h2>
                    <div class="data-table-actions">
                        <button class="btn-primary">+ Add New</button>
                    </div>
                </div>
                ${this.generateTableContent(tabId)}
            </div>
        `;
    },

    /**
     * Generate table content based on tab
     * @param {string} tabId - ID of the tab
     * @returns {string} HTML string of table content
     */
    generateTableContent(tabId) {
        const tableConfigs = {
            users: {
                headers: ['Name', 'Email', 'Role', 'Status'],
                rows: [
                    ['John Doe', 'john@example.com', 'Admin', 'active'],
                    ['Jane Smith', 'jane@example.com', 'Customer', 'active'],
                    ['Bob Wilson', 'bob@example.com', 'Customer', 'pending'],
                ]
            },
            rentals: {
                headers: ['ID', 'Customer', 'Item', 'Start Date', 'Status'],
                rows: [
                    ['#001', 'John Doe', 'Karaoke System A', '2026-01-15', 'active'],
                    ['#002', 'Jane Smith', 'Karaoke System B', '2026-01-20', 'pending'],
                    ['#003', 'Bob Wilson', 'Speakers Set', '2026-01-18', 'inactive'],
                ]
            },
            items: {
                headers: ['Name', 'Category', 'Price/Day', 'Availability'],
                rows: [
                    ['Karaoke System A', 'Equipment', '₱500', 'active'],
                    ['Karaoke System B', 'Equipment', '₱450', 'active'],
                    ['Speakers Set', 'Audio', '₱200', 'inactive'],
                ]
            },
            payments: {
                headers: ['ID', 'Customer', 'Amount', 'Date', 'Status'],
                rows: [
                    ['PAY-001', 'John Doe', '₱1,500', '2026-01-15', 'active'],
                    ['PAY-002', 'Jane Smith', '₱900', '2026-01-20', 'pending'],
                    ['PAY-003', 'Bob Wilson', '₱600', '2026-01-18', 'active'],
                ]
            }
        };

        const config = tableConfigs[tabId];
        if (!config) return this.generateEmptyState();

        const headerHtml = config.headers.map(h => `<th>${h}</th>`).join('');
        const rowsHtml = config.rows.map(row => {
            const cells = row.map((cell, i) => {
                if (i === row.length - 1) {
                    return `<td><span class="status-badge ${cell}">${cell.charAt(0).toUpperCase() + cell.slice(1)}</span></td>`;
                }
                return `<td>${cell}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');

        return `
            <table class="data-table">
                <thead>
                    <tr>${headerHtml}</tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        `;
    },

    /**
     * Generate empty state HTML
     * @returns {string} HTML string
     */
    generateEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3 class="empty-state-title">No data found</h3>
                <p class="empty-state-text">Add your first item to get started.</p>
            </div>
        `;
    },

    /**
     * Handle logout
     */
    handleLogout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('activeTab');
        window.location.href = '/client/auth/login.html';
    },

    /**
     * Open sidebar (mobile)
     */
    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
    },

    /**
     * Close sidebar (mobile)
     */
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    },

    /**
     * Inject Topbar into the DOM
     * @param {string} containerId - ID of the container element
     * @param {string} title - Page title
     */
    injectTopbar(containerId, title = 'Dashboard') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const user = this.getCurrentUser();
        const initial = this.getUserInitial(user.name);

        container.innerHTML = `
            <header class="topbar">
                <button class="menu-btn" id="menuBtn">☰</button>
                <h1 class="topbar-title" id="pageTitle">${title}</h1>
                <div class="topbar-actions">
                    <!-- Notification Bell -->
                    <div class="notification-wrapper">
                        <button class="btn-icon notification-btn" id="notificationBtn" aria-label="Notifications">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                            <span class="notification-badge">3</span>
                        </button>
                        
                        <!-- Notification Dropdown -->
                        <div class="notification-dropdown" id="notificationDropdown">
                            <div class="notification-header">
                                <h4>Notifications</h4>
                                <span class="mark-read" id="markReadBtn">Mark all read</span>
                            </div>
                            <div class="notification-list">
                                <div class="notification-item unread">
                                    <div class="notification-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                            <polyline points="22 4 12 14.01 9 11.01"/>
                                        </svg>
                                    </div>
                                    <div class="notification-content">
                                        <div class="notification-title">Booking Confirmed!</div>
                                        <div class="notification-text">Your Platinum Pro rental is confirmed for Feb 14.</div>
                                        <div class="notification-time">2 hours ago</div>
                                    </div>
                                </div>
                                <div class="notification-item unread">
                                    <div class="notification-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"/>
                                            <polyline points="12 6 12 12 16 14"/>
                                        </svg>
                                    </div>
                                    <div class="notification-content">
                                        <div class="notification-title">Delivery Scheduled</div>
                                        <div class="notification-text">Driver assigned. ETA: 2:30 PM tomorrow.</div>
                                        <div class="notification-time">5 hours ago</div>
                                    </div>
                                </div>
                                <div class="notification-item unread">
                                    <div class="notification-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                    </div>
                                    <div class="notification-content">
                                        <div class="notification-title">Rate Your Experience</div>
                                        <div class="notification-text">How was your last rental? Leave a review!</div>
                                        <div class="notification-time">1 day ago</div>
                                    </div>
                                </div>
                            </div>
                            <div class="notification-footer">
                                <a href="#">View All Notifications</a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Theme Toggle -->
                    <button class="btn-icon theme-toggle" id="themeToggle" aria-label="Toggle theme">
                        <svg class="theme-icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="5"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                        <svg class="theme-icon-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    </button>
                    
                    <!-- User Profile -->
                    <div class="topbar-user profile-wrapper">
                        <button class="btn-icon profile-btn" id="profileBtn" aria-label="User menu">
                            <div class="topbar-user-avatar">${initial}</div>
                        </button>
                        
                        <!-- Profile Dropdown -->
                        <div class="profile-dropdown" id="profileDropdown">
                            <div class="profile-header">
                                <div class="profile-info">
                                    <div class="name">${user.name || 'User'}</div>
                                    <div class="email">${user.email || 'user@example.com'}</div>
                                </div>
                            </div>
                            <nav class="profile-menu">
                                <a href="/client/dashboard.html" class="profile-menu-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="3" width="7" height="9"/>
                                        <rect x="14" y="3" width="7" height="5"/>
                                        <rect x="14" y="12" width="7" height="9"/>
                                        <rect x="3" y="16" width="7" height="5"/>
                                    </svg>
                                    Dashboard
                                </a>
                                <a href="#" class="profile-menu-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    My Profile
                                </a>
                                <a href="#" class="profile-menu-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="3"/>
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                    </svg>
                                    Settings
                                </a>
                                <div class="profile-divider"></div>
                                <a href="/client/auth/login.html" class="profile-menu-item danger">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                        <polyline points="16 17 21 12 16 7"/>
                                        <line x1="21" y1="12" x2="9" y2="12"/>
                                    </svg>
                                    Sign Out
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        `;

        // Attach menu button event
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.openSidebar());
        }

        // Initialize dropdown functionality
        this.initDropdowns();
        
        // Initialize theme toggle
        this.initThemeToggle();
    },

    /**
     * Initialize theme toggle functionality
     */
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            // Update button visibility based on current theme
            const updateToggleIcon = () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                themeToggle.setAttribute('data-theme', isDark ? 'dark' : 'light');
            };
            
            // Initial update
            updateToggleIcon();
            
            // Toggle theme on click
            themeToggle.addEventListener('click', () => {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateToggleIcon();
            });
        }
    },

    /**
     * Initialize notification and profile dropdowns
     */
    initDropdowns() {
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationDropdown = document.getElementById('notificationDropdown');
        const profileBtn = document.getElementById('profileBtn');
        const profileDropdown = document.getElementById('profileDropdown');
        const markReadBtn = document.getElementById('markReadBtn');

        // Notification toggle
        notificationBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown?.classList.remove('open');
            notificationDropdown?.classList.toggle('open');
        });

        // Profile toggle
        profileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown?.classList.remove('open');
            profileDropdown?.classList.toggle('open');
        });

        // Mark all as read
        markReadBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            const badge = document.querySelector('.notification-badge');
            if (badge) badge.style.display = 'none';
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!notificationDropdown?.contains(e.target) && !notificationBtn?.contains(e.target)) {
                notificationDropdown?.classList.remove('open');
            }
            if (!profileDropdown?.contains(e.target) && !profileBtn?.contains(e.target)) {
                profileDropdown?.classList.remove('open');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                notificationDropdown?.classList.remove('open');
                profileDropdown?.classList.remove('open');
            }
        });
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!localStorage.getItem('user');
    },

    /**
     * Redirect to login if not authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/client/auth/login.html';
            return false;
        }
        return true;
    },

    /**
     * Initialize stagger animation for elements
     * @param {string} containerSelector - CSS selector for container
     */
    initStaggerAnimation(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.classList.add('motion-enabled');
        const children = container.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
            child.style.setProperty('--index', index);
        });
    },

    /**
     * Show eye icon SVG (password visible)
     */
    eyeOpenSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>`,

    /**
     * Show eye-off icon SVG (password hidden)
     */
    eyeClosedSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`,

    /**
     * Toggle password visibility
     * @param {HTMLInputElement} input - Password input element
     * @param {HTMLButtonElement} button - Eye button element
     */
    togglePasswordVisibility(input, button) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        button.innerHTML = isPassword ? this.eyeClosedSvg : this.eyeOpenSvg;
        button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Components;
}
