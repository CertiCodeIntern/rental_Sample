<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/rental_Sample/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt - Return Request. Schedule a pickup for your rental equipment.">
    <title>Return Request - RentIt</title>
    
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
    <link rel="stylesheet" href="client/returns/returnform.css">
    
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
                        <h1 class="page-title">Return Request</h1>
                        <p class="page-subtitle">Schedule a pickup for your rental equipment.</p>
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

                <!-- Return Form Layout -->
                <div class="form-layout">
                    <!-- Left: Form -->
                    <div class="form-main">
                        <!-- Current Rental Info Card -->
                        <section class="form-card">
                            <div class="form-card-header">
                                <div class="form-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="form-card-title">Item to Return</h2>
                                    <p class="form-card-subtitle">Review the rental details before requesting return</p>
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
                                                <span class="date-label">Rental Period</span>
                                                <span class="date-value" id="rentalPeriod">Jan 28 - Jan 31, 2026</span>
                                            </div>
                                            <div class="date-item">
                                                <span class="date-label">Duration</span>
                                                <span class="date-value" id="rentalDuration">3 days</span>
                                            </div>
                                            <div class="date-item highlight">
                                                <span class="date-label">Return Due</span>
                                                <span class="date-value" id="returnDue">Jan 31, 2026</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Pickup Schedule Card -->
                        <section class="form-card">
                            <div class="form-card-header">
                                <div class="form-card-icon blue">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="form-card-title">Schedule Pickup</h2>
                                    <p class="form-card-subtitle">Choose your preferred pickup date and time</p>
                                </div>
                            </div>
                            <div class="form-card-body">
                                <form id="returnForm">
                                    <!-- Pickup Date -->
                                    <div class="form-group">
                                        <label class="form-label" for="pickupDate">Pickup Date</label>
                                        <input type="date" id="pickupDate" name="pickupDate" class="form-input" required>
                                        <span class="form-hint">Select a date for our team to collect the equipment</span>
                                    </div>

                                    <!-- Pickup Time Slot -->
                                    <div class="form-group">
                                        <label class="form-label">Preferred Time Slot</label>
                                        <div class="time-slot-options" id="timeSlotOptions">
                                            <label class="time-slot-option">
                                                <input type="radio" name="timeSlot" value="morning" checked>
                                                <div class="time-slot-content">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                                                    <span class="time-slot-label">Morning</span>
                                                    <span class="time-slot-range">8:00 AM - 12:00 PM</span>
                                                </div>
                                            </label>
                                            <label class="time-slot-option">
                                                <input type="radio" name="timeSlot" value="afternoon">
                                                <div class="time-slot-content">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <circle cx="12" cy="12" r="5"/>
                                                        <line x1="12" y1="1" x2="12" y2="3"/>
                                                    </svg>
                                                    <span class="time-slot-label">Afternoon</span>
                                                    <span class="time-slot-range">1:00 PM - 5:00 PM</span>
                                                </div>
                                            </label>
                                            <label class="time-slot-option">
                                                <input type="radio" name="timeSlot" value="evening">
                                                <div class="time-slot-content">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                                    </svg>
                                                    <span class="time-slot-label">Evening</span>
                                                    <span class="time-slot-range">6:00 PM - 8:00 PM</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Pickup Address -->
                                    <div class="form-group">
                                        <label class="form-label">Pickup Address</label>
                                        <div class="address-options">
                                            <label class="address-option selected">
                                                <input type="radio" name="addressType" value="saved" checked>
                                                <div class="address-content">
                                                    <div class="address-icon">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                                            <polyline points="9 22 9 12 15 12 15 22"/>
                                                        </svg>
                                                    </div>
                                                    <div class="address-details">
                                                        <span class="address-type">Saved Address</span>
                                                        <span class="address-text" id="savedAddress">123 Main Street, Barangay Sample, Makati City, Metro Manila</span>
                                                    </div>
                                                </div>
                                            </label>
                                            <label class="address-option">
                                                <input type="radio" name="addressType" value="different">
                                                <div class="address-content">
                                                    <div class="address-icon">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                                            <circle cx="12" cy="10" r="3"/>
                                                        </svg>
                                                    </div>
                                                    <div class="address-details">
                                                        <span class="address-type">Different Address</span>
                                                        <span class="address-text">Use a different pickup location</span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Different Address Form (hidden by default) -->
                                    <div class="different-address-form" id="differentAddressForm" style="display: none;">
                                        <div class="form-group">
                                            <label class="form-label" for="newAddress">Complete Address</label>
                                            <textarea id="newAddress" name="newAddress" class="form-textarea" rows="3" placeholder="Enter complete pickup address..."></textarea>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label class="form-label" for="landmark">Landmark</label>
                                                <input type="text" id="landmark" name="landmark" class="form-input" placeholder="Near landmark...">
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label" for="contactPerson">Contact Person</label>
                                                <input type="text" id="contactPerson" name="contactPerson" class="form-input" placeholder="Name of person to meet">
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Equipment Condition -->
                                    <div class="form-group">
                                        <label class="form-label">Equipment Condition</label>
                                        <div class="condition-options">
                                            <label class="condition-option">
                                                <input type="radio" name="condition" value="excellent" checked>
                                                <div class="condition-content">
                                                    <span class="condition-icon">✨</span>
                                                    <span class="condition-label">Excellent</span>
                                                    <span class="condition-desc">Like new, no issues</span>
                                                </div>
                                            </label>
                                            <label class="condition-option">
                                                <input type="radio" name="condition" value="good">
                                                <div class="condition-content">
                                                    <span class="condition-icon">👍</span>
                                                    <span class="condition-label">Good</span>
                                                    <span class="condition-desc">Normal wear</span>
                                                </div>
                                            </label>
                                            <label class="condition-option">
                                                <input type="radio" name="condition" value="damaged">
                                                <div class="condition-content">
                                                    <span class="condition-icon">⚠️</span>
                                                    <span class="condition-label">Damaged</span>
                                                    <span class="condition-desc">Has issues</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Damage Notes (shown when damaged is selected) -->
                                    <div class="form-group damage-notes-group" id="damageNotesGroup" style="display: none;">
                                        <label class="form-label" for="damageNotes">Describe the Damage</label>
                                        <textarea id="damageNotes" name="damageNotes" class="form-textarea" rows="3" placeholder="Please describe what happened and the extent of damage..."></textarea>
                                        <span class="form-hint warning">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" y1="8" x2="12" y2="12"/>
                                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                                            </svg>
                                            Damage assessment will be done during pickup. Additional fees may apply.
                                        </span>
                                    </div>

                                    <!-- Additional Notes -->
                                    <div class="form-group">
                                        <label class="form-label" for="additionalNotes">
                                            Additional Notes 
                                            <span class="optional-label">(Optional)</span>
                                        </label>
                                        <textarea id="additionalNotes" name="additionalNotes" class="form-textarea" rows="2" placeholder="Any special instructions for pickup..."></textarea>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </div>

                    <!-- Right: Summary -->
                    <div class="form-sidebar">
                        <div class="summary-card">
                            <h3 class="summary-title">Return Summary</h3>
                            
                            <div class="summary-item-preview">
                                <img src="assets/images/ministar.jpg" alt="Item" id="summaryImage" onerror="this.onerror=null; this.src='assets/images/brokenimg.svg'">
                                <div class="summary-item-info">
                                    <span class="summary-item-name" id="summaryItemName">Karaoke Pro System X-100</span>
                                    <span class="summary-item-id" id="summaryItemId">#VDK-8921</span>
                                </div>
                            </div>

                            <div class="summary-dates">
                                <div class="summary-date-row">
                                    <span class="summary-date-label">Pickup Date</span>
                                    <span class="summary-date-value" id="summaryPickupDate">Select date</span>
                                </div>
                                <div class="summary-date-row">
                                    <span class="summary-date-label">Time Slot</span>
                                    <span class="summary-date-value" id="summaryTimeSlot">Morning (8AM-12PM)</span>
                                </div>
                                <div class="summary-date-row">
                                    <span class="summary-date-label">Condition</span>
                                    <span class="summary-date-value" id="summaryCondition">Excellent</span>
                                </div>
                            </div>

                            <div class="summary-divider"></div>

                            <div class="summary-address">
                                <span class="summary-address-label">Pickup Location</span>
                                <p class="summary-address-text" id="summaryAddress">123 Main Street, Barangay Sample, Makati City, Metro Manila</p>
                            </div>

                            <div class="summary-divider"></div>

                            <div class="summary-checklist">
                                <h4 class="checklist-title">Before Pickup</h4>
                                <ul class="checklist-items">
                                    <li>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        Pack all accessories
                                    </li>
                                    <li>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        Check for damage
                                    </li>
                                    <li>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        Ensure someone is home
                                    </li>
                                </ul>
                            </div>

                            <div class="summary-actions">
                                <button type="submit" form="returnForm" class="btn-primary btn-submit" id="submitReturn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                        <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                                        <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                                        <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                                    </svg>
                                    Schedule Pickup
                                </button>
                                <a href="client/myrentals/myrentals.php" class="btn-secondary btn-cancel">Cancel</a>
                            </div>

                            <div class="summary-note">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                </svg>
                                <span>Our team will contact you 30 minutes before arrival. Please ensure the equipment is ready.</span>
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
            <h3 class="modal-title">Pickup Scheduled!</h3>
            <p class="modal-message">Your return request has been submitted. We'll send you a confirmation shortly.</p>
            <div class="modal-details">
                <div class="modal-detail-row">
                    <span>Return ID</span>
                    <span id="modalReturnId">#RET-2026-XXX</span>
                </div>
                <div class="modal-detail-row">
                    <span>Pickup Date</span>
                    <span id="modalPickupDate">Feb 01, 2026</span>
                </div>
                <div class="modal-detail-row">
                    <span>Time Slot</span>
                    <span id="modalTimeSlot">Morning (8AM-12PM)</span>
                </div>
            </div>
            <div class="modal-actions">
                <a href="client/returns/returns.php" class="btn-primary">View Returns</a>
                <a href="client/myrentals/myrentals.php" class="btn-secondary">Back to Rentals</a>
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="shared/js/components.js"></script>
    <script src="client/returns/returnform.js"></script>
</body>
</html>
