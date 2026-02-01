/**
 * RentIt - Cart Page JavaScript
 * Manages shopping cart functionality with localStorage persistence
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inject shared components
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('client');
        Components.injectTopbar('My Cart');
        Components.injectFooter();
    }

    // Initialize cart functionality
    initCart();
    initDatePickers();
    initRemoveButtons();
    initCheckout();
});

/**
 * Cart data management
 */
const CART_STORAGE_KEY = 'rentit_cart';
const DELIVERY_FEE = 150;
const SERVICE_FEE = 50;

// Sample product database (in real app, would fetch from API)
const productDatabase = {
    1: { name: 'Karaoke King Pro v2', category: 'Premium', price: 120 },
    2: { name: 'Karaoke King Pro', category: 'Premium', price: 100 },
    3: { name: 'Karaoke Standard', category: 'Standard', price: 80 },
    4: { name: 'Karaoke Starter', category: 'Basic', price: 50 },
    5: { name: 'MiniSing Pocket', category: 'Portable', price: 120 },
    6: { name: 'Party Box Deluxe', category: 'Premium', price: 150 }
};

function getCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Initialize cart display
 */
function initCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    if (cartItems.length === 0) {
        showEmptyCart();
        return;
    }

    updateAllSubtotals();
    updateOrderSummary();
}

/**
 * Initialize date pickers with change handlers
 */
function initDatePickers() {
    const dateInputs = document.querySelectorAll('.cart-date-input');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });

    // Add change listeners
    dateInputs.forEach(input => {
        input.addEventListener('change', () => {
            const itemId = input.closest('.cart-item')?.dataset.id;
            if (itemId) {
                updateItemDays(itemId);
                updateOrderSummary();
            }
        });
    });
}

/**
 * Calculate and update days count for an item
 */
function updateItemDays(itemId) {
    const startInput = document.getElementById(`startDate${itemId === '1' ? '1' : '2'}`);
    const endInput = document.getElementById(`endDate${itemId === '1' ? '1' : '2'}`);
    const daysCountEl = document.getElementById(`daysCount${itemId === '1' ? '1' : '2'}`);
    const subtotalEl = document.getElementById(`subtotal${itemId === '1' ? '1' : '2'}`);
    
    if (!startInput || !endInput || !daysCountEl || !subtotalEl) return;
    
    const startDate = new Date(startInput.value);
    const endDate = new Date(endInput.value);
    
    // Validate end date is after start date
    if (endDate < startDate) {
        endInput.value = startInput.value;
        endDate.setTime(startDate.getTime());
    }
    
    // Calculate days difference (inclusive)
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Update days display
    daysCountEl.textContent = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    
    // Get price from the item
    const priceEl = document.querySelector(`.cart-item[data-id="${itemId}"] .cart-item-price`);
    if (priceEl) {
        const priceMatch = priceEl.textContent.match(/₱(\d+)/);
        if (priceMatch) {
            const dailyPrice = parseInt(priceMatch[1]);
            const subtotal = dailyPrice * diffDays;
            subtotalEl.textContent = `₱${subtotal.toLocaleString()}`;
        }
    }
}

/**
 * Update all item subtotals
 */
function updateAllSubtotals() {
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        updateItemDays(item.dataset.id);
    });
}

/**
 * Update order summary totals
 */
function updateOrderSummary() {
    const subtotalEls = document.querySelectorAll('.cart-item-subtotal');
    let cartSubtotal = 0;
    
    subtotalEls.forEach(el => {
        const match = el.textContent.match(/₱([\d,]+)/);
        if (match) {
            cartSubtotal += parseInt(match[1].replace(',', ''));
        }
    });
    
    const itemCount = document.querySelectorAll('.cart-item:not(.removing)').length;
    
    // Update summary
    const summaryRows = document.querySelector('.summary-rows');
    if (summaryRows) {
        const subtotalRow = summaryRows.querySelector('.summary-row:first-child span:first-child');
        if (subtotalRow) {
            subtotalRow.textContent = `Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})`;
        }
    }
    
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (cartSubtotalEl) {
        cartSubtotalEl.textContent = `₱${cartSubtotal.toLocaleString()}`;
    }
    
    if (cartTotalEl) {
        const total = cartSubtotal + DELIVERY_FEE + SERVICE_FEE;
        cartTotalEl.textContent = `₱${total.toLocaleString()}`;
    }
}

/**
 * Initialize remove buttons
 */
function initRemoveButtons() {
    document.querySelectorAll('.btn-remove-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.id;
            removeFromCart(itemId);
        });
    });
}

/**
 * Remove item from cart with animation
 */
function removeFromCart(itemId) {
    const item = document.querySelector(`.cart-item[data-id="${itemId}"]`);
    if (!item) return;
    
    item.classList.add('removing');
    
    setTimeout(() => {
        item.remove();
        
        // Update localStorage
        let cart = getCart();
        cart = cart.filter(item => item.id !== itemId);
        saveCart(cart);
        
        // Check if cart is empty
        const remainingItems = document.querySelectorAll('.cart-item');
        if (remainingItems.length === 0) {
            showEmptyCart();
        } else {
            updateOrderSummary();
        }
        
        showToast('Item removed from cart', 'success');
    }, 400);
}

/**
 * Show empty cart state
 */
function showEmptyCart() {
    const cartSection = document.querySelector('.cart-layout');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cartSection) cartSection.style.display = 'none';
    if (emptyCart) emptyCart.style.display = 'block';
}

/**
 * Initialize checkout button
 */
function initCheckout() {
    const btnCheckout = document.getElementById('btnCheckout');
    
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            // In real app, would redirect to checkout page or show checkout modal
            showToast('Redirecting to checkout...', 'success');
            
            // Simulate checkout process
            btnCheckout.disabled = true;
            btnCheckout.innerHTML = `
                <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"/>
                </svg>
                Processing...
            `;
            
            // Add spinner animation
            const spinner = btnCheckout.querySelector('.spinner');
            if (spinner) {
                spinner.style.animation = 'spin 1s linear infinite';
            }
            
            setTimeout(() => {
                btnCheckout.disabled = false;
                btnCheckout.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Proceed to Checkout
                `;
                // In real app, would redirect to checkout or payment page
            }, 2000);
        });
    }
}

/**
 * Toast notification helper
 */
function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconSvg = type === 'success' 
        ? '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        : '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    
    toast.innerHTML = `
        ${iconSvg}
        <span class="toast-message">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add spinner keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
