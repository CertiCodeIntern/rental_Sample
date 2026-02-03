<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/rental_Sample/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt - Notifications. View all your rental notifications and updates.">
    <title>Notifications - RentIt</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/rIT_logo_tp.png">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="shared/css/theme.css">
    <link rel="stylesheet" href="shared/css/globals.css">
    <link rel="stylesheet" href="client/dashboard/dashboard.css">
    <link rel="stylesheet" href="client/notification/notification.css">
    
    <!-- Page Loader (prevents flash of unstyled content) -->
    <script src="shared/js/page-loader.js"></script>
    
    <!-- Theme Script -->
    <script src="shared/js/theme.js"></script>
</head>
<body>
    <div class="app-container">
        <!-- Sidebar Container (Injected by JS) -->
        <div id="sidebarContainer"></div>
        
        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar Container (Injected by JS) -->
            <div id="topbarContainer"></div>
            
            <!-- Content Area -->
            <div class="content-area" id="contentArea">
                <!-- Page Header -->
                <div class="page-header-dashboard">
                    <div class="page-header-info">
                        <h1 class="page-title">Notifications</h1>
                        <p class="page-subtitle">Stay updated with your rental activities and alerts.</p>
                    </div>
                    <div class="page-header-actions">
                        <button class="btn-mark-all" id="markAllReadBtn" title="Mark all as read">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <polyline points="9 11 12 14 22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                            </svg>
                            Mark All Read
                        </button>
                        <button class="btn-clear" id="clearAllBtn" title="Clear all notifications">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Clear All
                        </button>
                    </div>
                </div>

                <!-- Notification Filters -->
                <div class="notification-filters">
                    <button class="filter-tab active" data-filter="all">
                        All
                        <span class="filter-count" id="allCount">8</span>
                    </button>
                    <button class="filter-tab" data-filter="unread">
                        Unread
                        <span class="filter-count unread" id="unreadCount">3</span>
                    </button>
                    <button class="filter-tab" data-filter="orders">
                        Orders
                        <span class="filter-count">4</span>
                    </button>
                    <button class="filter-tab" data-filter="returns">
                        Returns
                        <span class="filter-count">2</span>
                    </button>
                    <button class="filter-tab" data-filter="promos">
                        Promos
                        <span class="filter-count">2</span>
                    </button>
                </div>

                <!-- Notifications List -->
                <div class="notifications-list" id="notificationsList">
                    <!-- Today Section -->
                    <div class="notification-group">
                        <h3 class="group-title">Today</h3>
                        
                        <!-- Notification Item - Unread -->
                        <article class="notification-item unread" data-id="1" data-type="orders">
                            <div class="notification-icon order">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                </svg>
                            </div>
                            <div class="notification-content">
                                <div class="notification-header">
                                    <h4 class="notification-title">Order Confirmed</h4>
                                    <span class="notification-time">10 mins ago</span>
                                </div>
                                <p class="notification-message">Your rental for <strong>Karaoke King Pro v2</strong> has been confirmed. Delivery scheduled for Feb 5, 2026.</p>
                                <div class="notification-actions">
                                    <button class="btn-notification-action primary" data-action="view-order" data-order-id="VDK-9921">View Order</button>
                                    <button class="btn-notification-action" data-action="dismiss">Dismiss</button>
                                </div>
                            </div>
                            <button class="btn-notification-menu" title="More options">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <circle cx="12" cy="6" r="2"/>
                                    <circle cx="12" cy="12" r="2"/>
                                    <circle cx="12" cy="18" r="2"/>
                                </svg>
                            </button>
                        </article>

                        <!-- Notification Item - Unread -->
                        <article class="notification-item unread" data-id="2" data-type="returns">
                            <div class="notification-icon return">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="1 4 1 10 7 10"/>
                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                                </svg>
                            </div>
                            <div class="notification-content">
                                <div class="notification-header">
                                    <h4 class="notification-title">Return Reminder</h4>
                                    <span class="notification-time">2 hours ago</span>
                                </div>
                                <p class="notification-message">Your rental for <strong>Party Box Master V2</strong> is due tomorrow. Schedule a return pickup now.</p>
                                <div class="notification-actions">
                                    <button class="btn-notification-action primary" data-action="schedule-return" data-rental-id="VDK-7742">Schedule Return</button>
                                    <button class="btn-notification-action" data-action="extend">Extend Rental</button>
                                </div>
                            </div>
                            <button class="btn-notification-menu" title="More options">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <circle cx="12" cy="6" r="2"/>
                                    <circle cx="12" cy="12" r="2"/>
                                    <circle cx="12" cy="18" r="2"/>
                                </svg>
                            </button>
                        </article>

                        <!-- Notification Item - Read -->
                        <article class="notification-item" data-id="3" data-type="promos">
                            <div class="notification-icon promo">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="8" r="7"/>
                                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                                </svg>
                            </div>
                            <div class="notification-content">
                                <div class="notification-header">
                                    <h4 class="notification-title">Special Offer! 🎉</h4>
                                    <span class="notification-time">5 hours ago</span>
                                </div>
                                <p class="notification-message">Get <strong>20% off</strong> your next rental! Use code <code>RENTIT20</code> at checkout. Valid until Feb 10.</p>
                                <div class="notification-actions">
                                    <button class="btn-notification-action primary" data-action="browse-catalog">Browse Catalog</button>
                                </div>
                            </div>
                            <button class="btn-notification-menu" title="More options">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <circle cx="12" cy="6" r="2"/>
                                    <circle cx="12" cy="12" r="2"/>
                                    <circle cx="12" cy="18" r="2"/>
                                </svg>
                            </button>
                        </article>
                    </div>

                    <!-- Yesterday Section -->
                    <div class="notification-group">
                        <h3 class="group-title">Yesterday</h3>
                        
                        <article class="notification-item" data-id="4" data-type="orders">
                            <div class="notification-icon delivery">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="1" y="3" width="15" height="13"/>
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                                    <circle cx="5.5" cy="18.5" r="2.5"/>
                                    <circle cx="18.5" cy="18.5" r="2.5"/>
                                </svg>
                            </div>
                            <div class="notification-content">
                                <div class="notification-header">
                                    <h4 class="notification-title">Item Delivered</h4>
                                    <span class="notification-time">Yesterday, 3:45 PM</span>
                                </div>
                                <p class="notification-message">Your <strong>MiniSing Pocket</strong> has been successfully delivered. Enjoy your rental!</p>
                                <div class="notification-actions">
                                    <button class="btn-notification-action" data-action="rate">Rate Experience</button>
                                </div>
                            </div>
                            <button class="btn-notification-menu" title="More options">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <circle cx="12" cy="6" r="2"/>
                                    <circle cx="12" cy="12" r="2"/>
                                    <circle cx="12" cy="18" r="2"/>
                                </svg>
                            </button>
                        </article>

                        <article class="notification-item unread" data-id="5" data-type="orders">
                            <div class="notification-icon payment">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                    <line x1="1" y1="10" x2="23" y2="10"/>
                                </svg>
                            </div>
                            <div class="notification-content">
                                <div class="notification-header">
                                    <h4 class="notification-title">Payment Received</h4>
                                    <span class="notification-time">Yesterday, 10:20 AM</span>
                                </div>
                                <p class="notification-message">Payment of <strong>₱720.00</strong> received for Order #VDK-9921. Thank you!</p>
                                <div class="notification-actions">
                                    <button class="btn-notification-action" data-action="view-receipt">View Receipt</button>
                                </div>
                            </div>
                            <button class="btn-notification-menu" title="More options">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <circle cx="12" cy="6" r="2"/>
                                    <circle cx="12" cy="12" r="2"/>
                                    <circle cx="12" cy="18" r="2"/>
                                </svg>
                            </button>
                        </article>
                    </div>

                    <!-- Earlier Section -->
                    <div class="notification-group">
                        <h3 class="group-title">Earlier This Week</h3>
                        
                        <article class="notification-item" data-id="6" data-type="returns">
                            <div class="notification-icon success">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                            </div>
                            <div class="notification-content">
                                <div class="notification-header">
                                    <h4 class="notification-title">Return Completed</h4>
                                    <span class="notification-time">Jan 30, 2026</span>
                                </div>
                                <p class="notification-message">Your return for <strong>VocalStar 5000</strong> has been processed. Deposit refunded to your account.</p>
                            </div>
                            <button class="btn-notification-menu" title="More options">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <circle cx="12" cy="6" r="2"/>
                                    <circle cx="12" cy="12" r="2"/>
                                    <circle cx="12" cy="18" r="2"/>
                                </svg>
                            </button>
                        </article>

                        <article class="notification-item" data-id="7" data-type="promos">
                            <div class="notification-icon info">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                </svg>
                            </div>
                            <div class="notification-content">
                                <div class="notification-header">
                                    <h4 class="notification-title">New Equipment Available</h4>
                                    <span class="notification-time">Jan 28, 2026</span>
                                </div>
                                <p class="notification-message">Check out our new <strong>VenueMaster X-1</strong> professional karaoke system! Perfect for large events.</p>
                                <div class="notification-actions">
                                    <button class="btn-notification-action" data-action="view-item">View Details</button>
                                </div>
                            </div>
                            <button class="btn-notification-menu" title="More options">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <circle cx="12" cy="6" r="2"/>
                                    <circle cx="12" cy="12" r="2"/>
                                    <circle cx="12" cy="18" r="2"/>
                                </svg>
                            </button>
                        </article>

                        <article class="notification-item" data-id="8" data-type="orders">
                            <div class="notification-icon order">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                </svg>
                            </div>
                            <div class="notification-content">
                                <div class="notification-header">
                                    <h4 class="notification-title">Booking Confirmed</h4>
                                    <span class="notification-time">Jan 25, 2026</span>
                                </div>
                                <p class="notification-message">Your rental for <strong>HomeParty Ultra</strong> was confirmed. Hope you enjoyed your event!</p>
                            </div>
                            <button class="btn-notification-menu" title="More options">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <circle cx="12" cy="6" r="2"/>
                                    <circle cx="12" cy="12" r="2"/>
                                    <circle cx="12" cy="18" r="2"/>
                                </svg>
                            </button>
                        </article>
                    </div>
                </div>

                <!-- Empty State (hidden by default) -->
                <div class="empty-state" id="emptyState" style="display: none;">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                    </div>
                    <h3 class="empty-title">All Caught Up!</h3>
                    <p class="empty-message">You have no new notifications at this time.</p>
                </div>
            </div>

            <!-- Footer Container (Injected by JS) -->
            <div id="footerContainer"></div>
        </main>
    </div>

    <!-- Components JS -->
    <script src="shared/js/components.js"></script>
    <script src="client/notification/notification.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            Components.injectSidebar('sidebarContainer', 'notifications', 'client');
            Components.injectTopbar('topbarContainer', 'Notifications');
            Components.injectFooter('footerContainer');
        });
    </script>
</body>
</html>





