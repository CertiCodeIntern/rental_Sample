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
                window.location.href = 'admin/auth/login.php';
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

        // Notification dropdown
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationDropdown = document.getElementById('notificationDropdown');
        const markReadBtn = document.getElementById('markReadBtn');

        notificationBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close profile dropdown if open
            const profileDropdown = document.getElementById('profileDropdown');
            profileDropdown?.classList.remove('open');
            // Toggle notification dropdown
            notificationDropdown?.classList.toggle('open');
        });

        // Mark all as read
        markReadBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            // Remove unread class from all items
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            // Update badge
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });

        // Profile dropdown
        const profileBtn = document.getElementById('profileBtn');
        const profileDropdown = document.getElementById('profileDropdown');

        profileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close notification dropdown if open
            notificationDropdown?.classList.remove('open');
            // Toggle profile dropdown
            profileDropdown?.classList.toggle('open');
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationDropdown?.contains(e.target) && !notificationBtn?.contains(e.target)) {
                notificationDropdown?.classList.remove('open');
            }
            if (!profileDropdown?.contains(e.target) && !profileBtn?.contains(e.target)) {
                profileDropdown?.classList.remove('open');
            }
        });

        // Close dropdowns on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                notificationDropdown?.classList.remove('open');
                profileDropdown?.classList.remove('open');
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
            window.location.href = 'admin/auth/login.php';
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

// =====================================================
// DASHBOARD DATA MODULE
// Handles fetching and displaying real data from API
// =====================================================
const DashboardData = {
    API_URL: 'backend/admin/dashboard/get-stats.php',

    /**
     * Load all dashboard data
     */
    async load() {
        try {
            const response = await fetch(this.API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.updateKPIs(data.kpi);
                this.updateRecentBookings(data.recent_bookings);
                this.updateTodaysSchedule(data.todays_schedule, data.schedule_date_formatted);
                this.updateInventory(data.inventory);
            } else {
                console.error('[Dashboard] API error:', data.message);
                this.showError('Failed to load dashboard data');
            }
        } catch (error) {
            console.error('[Dashboard] Fetch error:', error);
            this.showError('Unable to connect to server');
        }
    },

    /**
     * Update KPI cards with real data
     */
    updateKPIs(kpi) {
        if (!kpi) return;

        // Revenue
        const revenueEl = document.getElementById('kpi-revenue');
        const revenueChangeEl = document.getElementById('kpi-revenue-change');
        if (revenueEl && kpi.revenue) {
            revenueEl.textContent = kpi.revenue.formatted;
            if (revenueChangeEl) {
                const change = kpi.revenue.change;
                revenueChangeEl.innerHTML = this.getChangeHTML(change);
                revenueChangeEl.className = `kpi-change ${change >= 0 ? 'positive' : 'negative'}`;
            }
        }

        // Active Rentals
        const activeEl = document.getElementById('kpi-active-rentals');
        const activeChangeEl = document.getElementById('kpi-active-change');
        if (activeEl && kpi.active_rentals) {
            activeEl.textContent = kpi.active_rentals.value;
            if (activeChangeEl) {
                const change = kpi.active_rentals.change;
                activeChangeEl.innerHTML = this.getChangeHTML(change);
                activeChangeEl.className = `kpi-change ${change >= 0 ? 'positive' : 'negative'}`;
            }
        }

        // Pending Deliveries
        const pendingEl = document.getElementById('kpi-pending');
        const pendingInfoEl = document.getElementById('kpi-pending-info');
        if (pendingEl && kpi.pending_deliveries) {
            pendingEl.textContent = kpi.pending_deliveries.value;
            if (pendingInfoEl) {
                const days = kpi.pending_deliveries.scheduled_days;
                pendingInfoEl.textContent = `${days} day${days !== 1 ? 's' : ''} scheduled`;
            }
        }

        // Machines Available
        const availableEl = document.getElementById('kpi-available');
        const availableInfoEl = document.getElementById('kpi-available-info');
        if (availableEl && kpi.machines_available) {
            availableEl.textContent = kpi.machines_available.value;
            if (availableInfoEl && kpi.machines_available.total) {
                availableInfoEl.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg> of ${kpi.machines_available.total} total`;
            }
        }
    },

    /**
     * Generate change indicator HTML
     */
    getChangeHTML(change) {
        const icon = change >= 0 
            ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>'
            : '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg>';
        return `${icon} ${change >= 0 ? '+' : ''}${change}%`;
    },

    /**
     * Update recent bookings table
     */
    updateRecentBookings(bookings) {
        const tbody = document.getElementById('recent-bookings-tbody');
        if (!tbody) return;

        if (!bookings || bookings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--admin-text-muted);">
                        No recent bookings found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = bookings.map(booking => this.createBookingRow(booking)).join('');
    },

    /**
     * Create a booking table row
     */
    createBookingRow(booking) {
        const statusClass = this.getStatusClass(booking.status);
        const statusLabel = this.getStatusLabel(booking.status);
        const dateRange = this.formatDateRange(booking.rental_start, booking.rental_end, booking.rental_days);

        return `
            <tr data-order-id="${booking.id}">
                <td>
                    <div class="customer-cell">
                        <div class="customer-avatar">${booking.customer_initial}</div>
                        <span>${this.escapeHtml(booking.customer_name)}</span>
                    </div>
                </td>
                <td>${this.escapeHtml(booking.product_sku)} ${this.escapeHtml(booking.product_name)}</td>
                <td title="${booking.rental_start} to ${booking.rental_end}">${dateRange}</td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td>
                    <div class="table-action-btns">
                        <button class="btn-icon" title="View booking details" onclick="DashboardData.viewOrder(${booking.id})">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        <button class="btn-icon" title="Edit booking" onclick="DashboardData.editOrder(${booking.id})">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    /**
     * Get status badge class
     */
    getStatusClass(status) {
        const classes = {
            'pending': 'status-pending',
            'confirmed': 'status-success',
            'processing': 'status-info',
            'dispatched': 'status-transit',
            'delivered': 'status-transit',
            'rented': 'status-booked',
            'returning': 'status-warning',
            'returned': 'status-info',
            'completed': 'status-success',
            'cancelled': 'status-danger'
        };
        return classes[status] || 'status-pending';
    },

    /**
     * Get human-readable status label
     */
    getStatusLabel(status) {
        const labels = {
            'pending': 'Pending',
            'confirmed': 'Confirmed',
            'processing': 'Processing',
            'dispatched': 'In Transit',
            'delivered': 'Delivered',
            'rented': 'Rented',
            'returning': 'Returning',
            'returned': 'Returned',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return labels[status] || status;
    },

    /**
     * Format date range for display
     */
    formatDateRange(start, end, days) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const startMonth = months[startDate.getMonth()];
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        
        if (startDate.getMonth() === endDate.getMonth()) {
            return `${startMonth} ${startDay}-${endDay} (${days} day${days > 1 ? 's' : ''})`;
        }
        
        const endMonth = months[endDate.getMonth()];
        return `${startMonth} ${startDay} - ${endMonth} ${endDay} (${days} day${days > 1 ? 's' : ''})`;
    },

    /**
     * Update today's schedule
     */
    updateTodaysSchedule(schedule, dateFormatted) {
        const timeline = document.getElementById('schedule-timeline');
        const dateEl = document.getElementById('schedule-date');
        
        if (dateEl) {
            dateEl.textContent = dateFormatted || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        if (!timeline) return;

        if (!schedule || schedule.length === 0) {
            timeline.innerHTML = `
                <div class="empty-schedule" style="text-align: center; padding: 2rem; color: var(--admin-text-muted);">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <p>No deliveries or pickups scheduled for today</p>
                </div>
            `;
            return;
        }

        timeline.innerHTML = schedule.map(item => this.createScheduleItem(item)).join('');
    },

    /**
     * Create a schedule timeline item
     */
    createScheduleItem(item) {
        const timeSlotDisplay = this.getTimeSlotDisplay(item.time_slot);
        const statusClass = this.getScheduleStatusClass(item.status);

        return `
            <div class="timeline-item" title="${item.type} to ${item.customer_name}">
                <div class="timeline-time ${statusClass}">${timeSlotDisplay}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${item.type}: ${this.escapeHtml(item.customer_name)}</div>
                    <div class="timeline-subtitle">${this.escapeHtml(item.product_sku)} • ${this.escapeHtml(item.location)}</div>
                </div>
                <span class="timeline-status ${statusClass}"></span>
            </div>
        `;
    },

    /**
     * Get time slot display text
     */
    getTimeSlotDisplay(slot) {
        const times = {
            'morning': '09:00 AM',
            'afternoon': '02:00 PM',
            'evening': '06:00 PM',
            'TBD': 'TBD'
        };
        return times[slot] || slot || 'TBD';
    },

    /**
     * Get schedule status class
     */
    getScheduleStatusClass(status) {
        const classes = {
            'confirmed': 'pending',
            'processing': 'pending',
            'dispatched': 'warning',
            'scheduled': 'pending',
            'in_transit': 'warning',
            'delivered': 'success',
            'picked_up': 'success'
        };
        return classes[status] || '';
    },

    /**
     * Update inventory health section
     */
    updateInventory(inventory) {
        if (!inventory) return;

        // Rented units
        const rentedEl = document.getElementById('inventory-rented');
        const rentedBar = document.getElementById('inventory-rented-bar');
        if (rentedEl && inventory.total) {
            rentedEl.textContent = `${inventory.rented} / ${inventory.total}`;
        }
        if (rentedBar) {
            rentedBar.style.width = `${inventory.rented_percentage}%`;
        }

        // Repair units
        const repairEl = document.getElementById('inventory-repair');
        const repairBar = document.getElementById('inventory-repair-bar');
        if (repairEl) {
            repairEl.textContent = `${inventory.repair} Units`;
        }
        if (repairBar) {
            repairBar.style.width = `${inventory.repair_percentage}%`;
        }

        // Available units
        const availableEl = document.getElementById('inventory-available');
        const availableBar = document.getElementById('inventory-available-bar');
        if (availableEl) {
            availableEl.textContent = `${inventory.available} Units`;
        }
        if (availableBar) {
            availableBar.style.width = `${inventory.available_percentage}%`;
        }
    },

    /**
     * Show error message
     */
    showError(message) {
        const tbody = document.getElementById('recent-bookings-tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--admin-danger);">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 0.5rem;">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p>${message}</p>
                        <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="DashboardData.load()">
                            Retry
                        </button>
                    </td>
                </tr>
            `;
        }
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * View order details
     */
    viewOrder(orderId) {
        window.location.href = `admin/orders/orderdetail.php?id=${orderId}`;
    },

    /**
     * Edit order
     */
    editOrder(orderId) {
        window.location.href = `admin/orders/orderdetail.php?id=${orderId}&edit=1`;
    }
};

// Export for global access
window.DashboardData = DashboardData;