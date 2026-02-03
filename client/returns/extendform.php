<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/rental_Sample/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt - Extend Your Rental. Request additional rental days for your equipment.">
    <title>Extend Rental - RentIt</title>
    
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
    <link rel="stylesheet" href="client/returns/returns.css">
    <link rel="stylesheet" href="client/returns/extendform.css">
    
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
                        <h1 class="page-title">Extend Rental</h1>
                        <p class="page-subtitle">Request additional days for your current rental.</p>
                    </div>
                    <div class="page-header-actions">
                        <a href="client/myrentals/myrentals.php" class="btn-secondary" title="Back to My Rentals">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="19" y1="12" x2="5" y2="12"/>
                                <polyline points="12 19 5 12 12 5"/>
                            </svg>
                            Back to Rentals
                        </a>
                    </div>
                </div>

                <!-- Extension Form Layout -->
                <div class="form-layout">
                    <!-- Left: Form -->
                    <div class="form-main">
                        <!-- Current Rental Info Card -->
                        <section class="form-card">
                            <div class="form-card-header">
                                <div class="form-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="form-card-title">Current Rental</h2>
                                    <p class="form-card-subtitle">Review your rental details before extending</p>
                                </div>
                            </div>
                            <div class="form-card-body">
                                <div class="rental-preview" id="rentalPreview">
                                    <div class="rental-preview-image">
                                        <img src="assets/images/ministar.jpg" alt="Rental Item" id="rentalImage" onerror="this.onerror=null; this.src='assets/images/brokenimg.svg'">
                                    </div>
                                    <div class="rental-preview-info">
                                        <h3 class="rental-preview-name" id="rentalName">Karaoke Pro System X-100</h3>
                                        <div class="rental-preview-meta">
                                            <span class="rental-id-badge" id="rentalId">#VDK-8921</span>
                                            <span class="rental-status status-rented">Rented</span>
                                        </div>
                                        <div class="rental-dates">
                                            <div class="date-item">
                                                <span class="date-label">Start Date</span>
                                                <span class="date-value" id="startDate">Jan 28, 2026</span>
                                            </div>
                                            <div class="date-item">
                                                <span class="date-label">Current End Date</span>
                                                <span class="date-value" id="currentEndDate">Jan 31, 2026</span>
                                            </div>
                                            <div class="date-item highlight">
                                                <span class="date-label">Days Remaining</span>
                                                <span class="date-value" id="daysRemaining">3 days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Extension Options Card -->
                        <section class="form-card">
                            <div class="form-card-header">
                                <div class="form-card-icon blue">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                        <line x1="12" y1="14" x2="12" y2="18"/>
                                        <line x1="10" y1="16" x2="14" y2="16"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="form-card-title">Extension Options</h2>
                                    <p class="form-card-subtitle">Select how many days you want to extend</p>
                                </div>
                            </div>
                            <div class="form-card-body">
                                <form id="extendForm">
                                    <!-- Extension Duration -->
                                    <div class="form-group">
                                        <label class="form-label">Select Extension Duration</label>
                                        <div class="duration-options" id="durationOptions">
                                            <label class="duration-option">
                                                <input type="radio" name="duration" value="1" checked>
                                                <div class="duration-content">
                                                    <span class="duration-days">1 Day</span>
                                                    <span class="duration-price">₱25.00</span>
                                                </div>
                                            </label>
                                            <label class="duration-option">
                                                <input type="radio" name="duration" value="2">
                                                <div class="duration-content">
                                                    <span class="duration-days">2 Days</span>
                                                    <span class="duration-price">₱50.00</span>
                                                </div>
                                            </label>
                                            <label class="duration-option popular">
                                                <span class="popular-badge">Popular</span>
                                                <input type="radio" name="duration" value="3">
                                                <div class="duration-content">
                                                    <span class="duration-days">3 Days</span>
                                                    <span class="duration-price">₱75.00</span>
                                                </div>
                                            </label>
                                            <label class="duration-option">
                                                <input type="radio" name="duration" value="5">
                                                <div class="duration-content">
                                                    <span class="duration-days">5 Days</span>
                                                    <span class="duration-price">₱120.00</span>
                                                </div>
                                            </label>
                                            <label class="duration-option">
                                                <input type="radio" name="duration" value="7">
                                                <div class="duration-content">
                                                    <span class="duration-days">7 Days</span>
                                                    <span class="duration-price">₱160.00</span>
                                                </div>
                                            </label>
                                            <label class="duration-option custom-option">
                                                <input type="radio" name="duration" value="custom">
                                                <div class="duration-content">
                                                    <span class="duration-days">Custom</span>
                                                    <span class="duration-price">Specify days</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Custom Days Input (hidden by default) -->
                                    <div class="form-group custom-days-group" id="customDaysGroup" style="display: none;">
                                        <label class="form-label" for="customDays">Enter Number of Days</label>
                                        <div class="custom-days-input">
                                            <button type="button" class="qty-btn" id="decreaseDays">−</button>
                                            <input type="number" id="customDays" name="customDays" min="1" max="30" value="1" class="form-input">
                                            <button type="button" class="qty-btn" id="increaseDays">+</button>
                                        </div>
                                        <span class="form-hint">Maximum extension: 30 days</span>
                                    </div>

                                    <!-- New End Date Display -->
                                    <div class="new-date-display">
                                        <div class="new-date-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6"/>
                                                <line x1="8" y1="2" x2="8" y2="6"/>
                                                <line x1="3" y1="10" x2="21" y2="10"/>
                                            </svg>
                                        </div>
                                        <div class="new-date-info">
                                            <span class="new-date-label">New Return Date</span>
                                            <span class="new-date-value" id="newEndDate">Feb 03, 2026</span>
                                        </div>
                                    </div>

                                    <!-- Availability Check -->
                                    <div class="availability-check" id="availabilityCheck">
                                        <div class="availability-status available">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                                <polyline points="22 4 12 14.01 9 11.01"/>
                                            </svg>
                                            <span>Item is available for this extension period</span>
                                        </div>
                                    </div>

                                    <!-- Reason for Extension -->
                                    <div class="form-group">
                                        <label class="form-label" for="extensionReason">
                                            Reason for Extension 
                                            <span class="optional-label">(Optional)</span>
                                        </label>
                                        <textarea id="extensionReason" name="extensionReason" class="form-textarea" rows="3" placeholder="Let us know why you need more time..."></textarea>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </div>

                    <!-- Right: Summary -->
                    <div class="form-sidebar">
                        <div class="summary-card">
                            <h3 class="summary-title">Extension Summary</h3>
                            
                            <div class="summary-item-preview">
                                <img src="assets/images/ministar.jpg" alt="Item" id="summaryImage" onerror="this.onerror=null; this.src='assets/images/brokenimg.svg'">
                                <div class="summary-item-info">
                                    <span class="summary-item-name" id="summaryItemName">Karaoke Pro System X-100</span>
                                    <span class="summary-item-id" id="summaryItemId">#VDK-8921</span>
                                </div>
                            </div>

                            <div class="summary-dates">
                                <div class="summary-date-row">
                                    <span class="summary-date-label">Current End</span>
                                    <span class="summary-date-value" id="summaryCurrentEnd">Jan 31, 2026</span>
                                </div>
                                <div class="summary-date-row highlight">
                                    <span class="summary-date-label">New End</span>
                                    <span class="summary-date-value" id="summaryNewEnd">Feb 03, 2026</span>
                                </div>
                                <div class="summary-date-row">
                                    <span class="summary-date-label">Extension</span>
                                    <span class="summary-date-value" id="summaryDuration">+3 days</span>
                                </div>
                            </div>

                            <div class="summary-divider"></div>

                            <div class="summary-pricing">
                                <div class="pricing-row">
                                    <span>Daily Rate</span>
                                    <span id="dailyRate">₱25.00/day</span>
                                </div>
                                <div class="pricing-row">
                                    <span>Extension Days</span>
                                    <span id="extensionDays">× 3</span>
                                </div>
                                <div class="pricing-row total">
                                    <span>Extension Fee</span>
                                    <span id="extensionFee">₱75.00</span>
                                </div>
                            </div>

                            <div class="summary-actions">
                                <button type="submit" form="extendForm" class="btn-primary btn-submit" id="submitExtension">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                        <polyline points="22 4 12 14.01 9 11.01"/>
                                    </svg>
                                    Confirm Extension
                                </button>
                                <a href="client/myrentals/myrentals.php" class="btn-secondary btn-cancel">Cancel</a>
                            </div>

                            <div class="summary-note">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                </svg>
                                <span>Extension fee will be added to your account. Payment required before new end date.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Container -->
            <div id="footerContainer"></div>
        </main>
    </div>

    <!-- Success Modal -->
    <div class="modal-overlay" id="successModal">
        <div class="modal-content">
            <div class="modal-icon success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            </div>
            <h3 class="modal-title">Extension Requested!</h3>
            <p class="modal-message">Your rental extension has been submitted. You'll receive a confirmation email shortly.</p>
            <div class="modal-details">
                <div class="modal-detail-row">
                    <span>Extension ID</span>
                    <span id="modalExtensionId">#EXT-2026-XXX</span>
                </div>
                <div class="modal-detail-row">
                    <span>New End Date</span>
                    <span id="modalNewDate">Feb 03, 2026</span>
                </div>
                <div class="modal-detail-row">
                    <span>Amount Due</span>
                    <span id="modalAmount">₱75.00</span>
                </div>
            </div>
            <div class="modal-actions">
                <a href="client/returns/returns.php" class="btn-primary">View Extensions</a>
                <a href="client/myrentals/myrentals.php" class="btn-secondary">Back to Rentals</a>
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="shared/js/components.js"></script>
    <script src="client/returns/extendform.js"></script>
</body>
</html>
