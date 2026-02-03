<?php
/**
 * Admin Dashboard
 * Displays KPIs, recent bookings, and today's schedule
 */
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <base href="/rental_Sample/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt Admin Dashboard - Manage your videoke rental business">
    <title>Dashboard - RentIt Admin</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/rIT_logo_tp.png">
    <link rel="apple-touch-icon" href="assets/images/rIT_logo_tp.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Admin Stylesheets -->
    <link rel="stylesheet" href="admin/shared/css/admin-theme.css">
    <link rel="stylesheet" href="admin/shared/css/admin-globals.css">
    <link rel="stylesheet" href="admin/shared/css/admin-components.css">
    <link rel="stylesheet" href="admin/dashboard/css/dashboard-new.css">
    
    <!-- Page Loader (prevents flash of unstyled content) -->
    <script src="shared/js/page-loader.js"></script>
</head>
<body>
    <div class="admin-wrapper">
        <!-- Sidebar Container -->
        <div id="sidebarContainer"></div>
        
        <!-- Main Content -->
        <main class="admin-main">
            <!-- Header Container -->
            <div id="headerContainer"></div>
            
            <!-- Content Area -->
            <div class="admin-content">
                <!-- Page Header -->
                <div class="admin-page-header">
                    <div>
                        <h1 class="admin-page-title">Dashboard</h1>
                        <p class="admin-page-subtitle">Welcome back! Here's an overview of your rental business.</p>
                    </div>
                    <div class="admin-page-actions">
                        <button class="btn btn-secondary" title="Export dashboard data as PDF">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export Report
                        </button>
                        <a href="admin/calendar/calendar.php" class="btn btn-primary" title="View booking calendar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            View Calendar
                        </a>
                    </div>
                </div>

                <!-- KPI Cards -->
                <section class="kpi-grid" title="Key Performance Indicators">
                    <div class="kpi-card animate-fadeInUp stagger-1">
                        <div class="kpi-icon accent" title="Total revenue this month">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="1" x2="12" y2="23"/>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-label">Total Revenue</div>
                            <div class="kpi-value" id="kpi-revenue">₱0</div>
                            <span class="kpi-change positive" id="kpi-revenue-change" title="Compared to last month">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                                </svg>
                                0%
                            </span>
                        </div>
                    </div>

                    <div class="kpi-card animate-fadeInUp stagger-2">
                        <div class="kpi-icon info" title="Currently active rentals">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-label">Active Rentals</div>
                            <div class="kpi-value" id="kpi-active-rentals">0</div>
                            <span class="kpi-change positive" id="kpi-active-change" title="Compared to last week">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                                </svg>
                                0%
                            </span>
                        </div>
                    </div>

                    <div class="kpi-card animate-fadeInUp stagger-3">
                        <div class="kpi-icon warning" title="Pending deliveries scheduled">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="1" y="3" width="15" height="13"/>
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                                <circle cx="5.5" cy="18.5" r="2.5"/>
                                <circle cx="18.5" cy="18.5" r="2.5"/>
                            </svg>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-label">Pending Deliveries</div>
                            <div class="kpi-value" id="kpi-pending">0</div>
                            <span class="kpi-change neutral" id="kpi-pending-info" title="Deliveries scheduled">
                                0 days scheduled
                            </span>
                        </div>
                    </div>

                    <div class="kpi-card animate-fadeInUp stagger-4">
                        <div class="kpi-icon success" title="Machines ready for rental">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-label">Machines Available</div>
                            <div class="kpi-value" id="kpi-available">0</div>
                            <span class="kpi-change positive" id="kpi-available-info" title="All units ready to rent">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                    <circle cx="12" cy="12" r="4"/>
                                </svg>
                                Ready to rent
                            </span>
                        </div>
                    </div>
                </section>

                <!-- Main Grid -->
                <div class="dashboard-grid">
                    <!-- Recent Bookings -->
                    <section class="admin-card bookings-section animate-fadeInUp">
                        <div class="admin-card-header">
                            <h2 class="admin-card-title">Recent Bookings</h2>
                            <a href="admin/calendar/calendar.php" class="btn btn-ghost btn-sm" title="View all bookings in calendar">
                                View All
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="9 18 15 12 9 6"/>
                                </svg>
                            </a>
                        </div>
                        <div class="admin-card-body" style="padding: 0;">
                            <div class="admin-table-wrapper" style="border: none; border-radius: 0;">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th title="Customer who made the booking">Customer</th>
                                            <th title="Equipment model rented">Machine</th>
                                            <th title="Rental period">Duration</th>
                                            <th title="Current booking status">Status</th>
                                            <th title="Available actions">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="recent-bookings-tbody">
                                        <tr class="loading-row">
                                            <td colspan="5" style="text-align: center; padding: 2rem;">
                                                <div class="loading-spinner"></div>
                                                <p style="margin-top: 0.5rem; color: var(--admin-text-muted);">Loading bookings...</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <!-- Right Column -->
                    <div class="dashboard-sidebar">
                        <!-- Delivery Schedule -->
                        <section class="admin-card schedule-card animate-fadeInUp">
                            <div class="admin-card-header">
                                <h2 class="admin-card-title">Today's Schedule</h2>
                                <span class="status-badge status-info" id="schedule-date" title="Current date">--</span>
                            </div>
                            <div class="admin-card-body">
                                <div class="schedule-timeline" id="schedule-timeline">
                                    <div class="loading-placeholder" style="text-align: center; padding: 1rem;">
                                        <div class="loading-spinner"></div>
                                        <p style="margin-top: 0.5rem; color: var(--admin-text-muted);">Loading schedule...</p>
                                    </div>
                                </div>
                                <a href="admin/dispatch/dispatch.php" class="btn btn-secondary btn-sm" style="width: 100%; margin-top: var(--admin-spacing-lg);" title="View full dispatch schedule">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="10" r="3"/>
                                        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                                    </svg>
                                    View Route Map
                                </a>
                            </div>
                        </section>

                        <!-- Inventory Health -->
                        <section class="admin-card inventory-card animate-fadeInUp">
                            <div class="admin-card-header">
                                <h2 class="admin-card-title">Inventory Health</h2>
                                <a href="admin/repairs/repairs.php" class="btn btn-ghost btn-sm" title="Manage inventory and repairs">
                                    Manage
                                </a>
                            </div>
                            <div class="admin-card-body">
                                <div class="inventory-item" id="inventory-rented-item">
                                    <div class="inventory-label">
                                        <span>Units Rented</span>
                                        <span class="inventory-value" id="inventory-rented">0 / 0</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill rented" id="inventory-rented-bar" style="width: 0%;"></div>
                                    </div>
                                </div>
                                <div class="inventory-item" id="inventory-repair-item">
                                    <div class="inventory-label">
                                        <span>In Repair</span>
                                        <span class="inventory-value warning" id="inventory-repair">0 Units</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill repair" id="inventory-repair-bar" style="width: 0%;"></div>
                                    </div>
                                </div>
                                <div class="inventory-item" id="inventory-available-item">
                                    <div class="inventory-label">
                                        <span>Available</span>
                                        <span class="inventory-value success" id="inventory-available">0 Units</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill available" id="inventory-available-bar" style="width: 0%;"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Quick Actions -->
                        <section class="admin-card quick-actions animate-fadeInUp">
                            <div class="admin-card-header">
                                <h2 class="admin-card-title">Quick Actions</h2>
                            </div>
                            <div class="admin-card-body">
                                <div class="quick-actions-grid">
                                    <a href="admin/calendar/calendar.php" class="quick-action-btn" title="View calendar master view">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        <span>Calendar</span>
                                    </a>
                                    <a href="admin/repairs/repairs.php" class="quick-action-btn" title="Manage repairs and maintenance">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                                        </svg>
                                        <span>Repairs</span>
                                    </a>
                                    <a href="admin/latefees/latefees.php" class="quick-action-btn" title="Track late fees and penalties">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="12" y1="1" x2="12" y2="23"/>
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                        </svg>
                                        <span>Late Fees</span>
                                    </a>
                                    <a href="admin/customers/customers.php" class="quick-action-btn" title="Manage customer database">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                        </svg>
                                        <span>Customers</span>
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            
            <!-- Footer Container -->
            <div id="footerContainer"></div>
        </main>
    </div>

    <!-- Scripts -->
    <script src="admin/shared/js/admin-components.js"></script>
    <script src="admin/dashboard/js/dashboard.js"></script>
    <script>
        // Initialize page with sidebar, header, footer
        document.addEventListener('DOMContentLoaded', () => {
            AdminComponents.initPage('dashboard');
            // Load dashboard data
            if (typeof DashboardData !== 'undefined') {
                DashboardData.load();
            }
        });
    </script>
</body>
</html>



