<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/rental_Sample/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt - Checkout">
    <title>RentIt - Checkout</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="shared/css/theme.css">
    <link rel="stylesheet" href="shared/css/globals.css">
    <link rel="stylesheet" href="client/dashboard/dashboard.css">
    <link rel="stylesheet" href="client/checkout/checkout.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/rIT_logo_tp.png">
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
            <div class="content-area fade-in-up" id="contentArea">
                <!-- Page Header -->
                <div class="page-header-dashboard">
                    <div class="page-header-info">
                        <h1 class="page-title">Checkout</h1>
                        <p class="page-subtitle">Complete your rental booking</p>
                    </div>
                </div>

                <!-- Checkout Layout -->
                <div class="checkout-layout">
                    <!-- Left Column - Customer Info & Order Details -->
                    <div class="checkout-main">
                        <!-- Receipt ID Card -->
                        <div class="checkout-card receipt-card">
                            <div class="receipt-header">
                                <div class="receipt-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                        <polyline points="10 9 9 9 8 9"/>
                                    </svg>
                                </div>
                                <div class="receipt-info">
                                    <span class="receipt-label">Order Reference</span>
                                    <span class="receipt-id" id="receiptId">RIT-2026-XXXXXX</span>
                                </div>
                            </div>
                            <div class="receipt-status">
                                <span class="status-badge pending">Pending Confirmation</span>
                            </div>
                        </div>

                        <!-- Customer Information -->
                        <div class="checkout-card">
                            <div class="card-header">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                <h2>Customer Information</h2>
                                <button class="btn-edit-info" id="btnEditInfo" title="Edit information">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                    Edit
                                </button>
                            </div>
                            <div class="customer-details">
                                <div class="detail-row">
                                    <span class="detail-label">Full Name</span>
                                    <span class="detail-value" id="customerName">John Doe</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Email</span>
                                    <span class="detail-value" id="customerEmail">john.doe@email.com</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Phone</span>
                                    <span class="detail-value" id="customerPhone">+63 912 345 6789</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Address</span>
                                    <span class="detail-value" id="customerAddress">123 Main Street, Barangay Sample, Makati City, Metro Manila</span>
                                </div>
                            </div>
                        </div>

                        <!-- Delivery Options -->
                        <div class="checkout-card">
                            <div class="card-header">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="1" y="3" width="15" height="13"/>
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                                    <circle cx="5.5" cy="18.5" r="2.5"/>
                                    <circle cx="18.5" cy="18.5" r="2.5"/>
                                </svg>
                                <h2>Delivery Options</h2>
                            </div>
                            <div class="delivery-options">
                                <label class="delivery-option selected">
                                    <input type="radio" name="delivery" value="standard" checked>
                                    <div class="option-content">
                                        <div class="option-info">
                                            <span class="option-name">Standard Delivery</span>
                                            <span class="option-desc">Delivered on rental start date</span>
                                        </div>
                                        <span class="option-price">₱150</span>
                                    </div>
                                </label>
                                <label class="delivery-option">
                                    <input type="radio" name="delivery" value="express">
                                    <div class="option-content">
                                        <div class="option-info">
                                            <span class="option-name">Express Delivery</span>
                                            <span class="option-desc">Delivered 1 day before rental</span>
                                        </div>
                                        <span class="option-price">₱300</span>
                                    </div>
                                </label>
                                <label class="delivery-option">
                                    <input type="radio" name="delivery" value="pickup">
                                    <div class="option-content">
                                        <div class="option-info">
                                            <span class="option-name">Store Pickup</span>
                                            <span class="option-desc">Pick up at RentIt Store</span>
                                        </div>
                                        <span class="option-price">Free</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Order Items -->
                        <div class="checkout-card">
                            <div class="card-header">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="9" cy="21" r="1"/>
                                    <circle cx="20" cy="21" r="1"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                </svg>
                                <h2>Order Items</h2>
                                <span class="item-count" id="itemCount">2 items</span>
                            </div>
                            <div class="order-items" id="orderItems">
                                <!-- Order Item 1 -->
                                <div class="order-item">
                                    <div class="order-item-image">
                                        <img src="assets/images/platinumpro.webp" alt="Karaoke King Pro v2"
                                             onerror="this.onerror=null; this.src='assets/images/brokenimg.svg'">
                                    </div>
                                    <div class="order-item-details">
                                        <h4 class="order-item-name">Karaoke King Pro v2</h4>
                                        <span class="order-item-category">Premium</span>
                                        <div class="order-item-rental">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                                <line x1="3" y1="10" x2="21" y2="10"/>
                                            </svg>
                                            <span>Feb 5 - Feb 9, 2026</span>
                                            <span class="days-badge">5 days</span>
                                        </div>
                                        <!-- Future Rentals Warning -->
                                        <div class="future-rentals-notice" id="futureRentals1" style="display: none;">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" y1="8" x2="12" y2="12"/>
                                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                                            </svg>
                                            <span>This item has future bookings: Mar 10-15, Apr 1-5</span>
                                        </div>
                                    </div>
                                    <div class="order-item-pricing">
                                        <span class="item-rate">₱120/day</span>
                                        <span class="item-subtotal">₱600</span>
                                    </div>
                                </div>

                                <!-- Order Item 2 -->
                                <div class="order-item">
                                    <div class="order-item-image">
                                        <img src="assets/images/ministar.jpg" alt="MiniSing Pocket"
                                             onerror="this.onerror=null; this.src='assets/images/brokenimg.svg'">
                                    </div>
                                    <div class="order-item-details">
                                        <h4 class="order-item-name">MiniSing Pocket</h4>
                                        <span class="order-item-category">Portable</span>
                                        <div class="order-item-rental">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                                <line x1="3" y1="10" x2="21" y2="10"/>
                                            </svg>
                                            <span>Feb 10 - Feb 12, 2026</span>
                                            <span class="days-badge">3 days</span>
                                        </div>
                                    </div>
                                    <div class="order-item-pricing">
                                        <span class="item-rate">₱120/day</span>
                                        <span class="item-subtotal">₱360</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Order Summary -->
                    <div class="checkout-sidebar">
                        <div class="checkout-card order-summary-card">
                            <div class="card-header">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="1" x2="12" y2="23"/>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                </svg>
                                <h2>Order Summary</h2>
                            </div>
                            
                            <div class="summary-breakdown">
                                <div class="summary-row">
                                    <span>Subtotal (2 items)</span>
                                    <span id="summarySubtotal">₱960</span>
                                </div>
                                <div class="summary-row">
                                    <span>Delivery Fee</span>
                                    <span id="summaryDelivery">₱150</span>
                                </div>
                                <div class="summary-row">
                                    <span>Service Fee</span>
                                    <span id="summaryService">₱50</span>
                                </div>
                                <div class="summary-row discount" style="display: none;" id="discountRow">
                                    <span>Discount</span>
                                    <span class="discount-amount" id="summaryDiscount">-₱0</span>
                                </div>
                            </div>

                            <div class="promo-section">
                                <div class="promo-input-wrap">
                                    <input type="text" class="promo-input" id="promoCode" placeholder="Enter promo code" title="Enter promotional code">
                                    <button class="btn-apply-promo" id="btnApplyPromo" title="Apply promotional code">Apply</button>
                                </div>
                            </div>

                            <div class="summary-total">
                                <span>Total</span>
                                <span class="total-amount" id="summaryTotal">₱1,160</span>
                            </div>

                            <div class="payment-section">
                                <h3>Payment Method</h3>
                                <div class="payment-options">
                                    <label class="payment-option selected">
                                        <input type="radio" name="payment" value="cod" checked>
                                        <div class="payment-content">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                                <line x1="1" y1="10" x2="23" y2="10"/>
                                            </svg>
                                            <span>Cash on Delivery</span>
                                        </div>
                                    </label>
                                    <label class="payment-option">
                                        <input type="radio" name="payment" value="gcash">
                                        <div class="payment-content">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
                                                <path d="M12 6v6l4 2"/>
                                            </svg>
                                            <span>GCash</span>
                                        </div>
                                    </label>
                                    <label class="payment-option">
                                        <input type="radio" name="payment" value="bank">
                                        <div class="payment-content">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M3 21h18"/>
                                                <path d="M3 10h18"/>
                                                <path d="M12 3L3 10h18L12 3z"/>
                                                <path d="M5 10v11"/>
                                                <path d="M19 10v11"/>
                                                <path d="M9 10v11"/>
                                                <path d="M15 10v11"/>
                                            </svg>
                                            <span>Bank Transfer</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button class="btn-confirm-order" id="btnConfirmOrder" title="Confirm and place order">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Confirm Order
                            </button>

                            <p class="terms-note">
                                By confirming, you agree to our 
                                <a href="pages/terms.php">Terms of Service</a> and 
                                <a href="pages/privacy.php">Privacy Policy</a>.
                            </p>
                        </div>

                        <!-- Back to Cart -->
                        <a href="client/cart/cart.php" class="btn-back-cart" title="Go back to cart">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="19" y1="12" x2="5" y2="12"/>
                                <polyline points="12 19 5 12 12 5"/>
                            </svg>
                            Back to Cart
                        </a>
                    </div>
                </div>
            </div>

            <!-- Footer Container (Injected by JS) -->
            <div id="footerContainer"></div>
        </main>
    </div>
    
    <!-- Scripts -->
    <script src="shared/js/components.js"></script>
    <script src="client/checkout/checkout.js"></script>
</body>
</html>





