/**
 * RentIt - Cart Page JavaScript
 * Manages shopping cart functionality with localStorage persistence
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inject shared components
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'cart', 'client');
        Components.injectTopbar('topbarContainer', 'My Cart');
        Components.injectFooter('footerContainer');
    }

    // Initialize cart functionality
    initCart();
    initDatePickers();
    initRemoveButtons();
    initCheckout();
    initSelection();
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
    const cartItems = document.querySelectorAll('.cart-item, .cart-item-card');
    
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
            const cartItem = input.closest('.cart-item, .cart-item-card');
            const itemId = cartItem?.dataset.id;
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
    const cartItem = document.querySelector(`.cart-item[data-id="${itemId}"], .cart-item-card[data-id="${itemId}"]`);
    if (!cartItem) return;
    
    const startInput = cartItem.querySelector('.cart-date-input[id^="startDate"]');
    const endInput = cartItem.querySelector('.cart-date-input[id^="endDate"]');
    const daysCountEl = cartItem.querySelector('.days-count');
    const subtotalEl = cartItem.querySelector('.cart-item-subtotal');
    
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
    const priceEl = cartItem.querySelector('.cart-item-price');
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
    const cartItems = document.querySelectorAll('.cart-item, .cart-item-card');
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
    
    const itemCount = document.querySelectorAll('.cart-item:not(.removing), .cart-item-card:not(.removing)').length;
    
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
            const cartItem = document.querySelector(`.cart-item[data-id="${itemId}"], .cart-item-card[data-id="${itemId}"]`);
            const itemName = cartItem?.querySelector('.cart-item-name')?.textContent || 'this item';
            
            showConfirmDialog(
                'Remove Item',
                `Are you sure you want to remove "${itemName}" from your cart?`,
                () => removeFromCart(itemId)
            );
        });
    });
}

/**
 * Remove item from cart with animation
 */
function removeFromCart(itemId) {
    const item = document.querySelector(`.cart-item[data-id="${itemId}"], .cart-item-card[data-id="${itemId}"]`);
    if (!item) return;
    
    item.classList.add('removing');
    
    setTimeout(() => {
        item.remove();
        
        // Update localStorage
        let cart = getCart();
        cart = cart.filter(item => item.id !== itemId);
        saveCart(cart);
        
        // Check if cart is empty
        const remainingItems = document.querySelectorAll('.cart-item, .cart-item-card');
        if (remainingItems.length === 0) {
            showEmptyCart();
        } else {
            updateOrderSummary();
            updateSelectAllState();
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
            const cartItems = document.querySelectorAll('.cart-item:not(.removing), .cart-item-card:not(.removing)');
            
            if (cartItems.length === 0) {
                showToast('Your cart is empty', 'error');
                return;
            }
            
            // Show processing state
            btnCheckout.disabled = true;
            btnCheckout.innerHTML = `
                <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"/>
                </svg>
                Redirecting...
            `;
            
            // Add spinner animation
            const spinner = btnCheckout.querySelector('.spinner');
            if (spinner) {
                spinner.style.animation = 'spin 1s linear infinite';
            }
            
            // Redirect to checkout page
            setTimeout(() => {
                window.location.href = 'client/checkout/checkout.php';
            }, 500);
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

/**
 * Initialize selection functionality
 */
function initSelection() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const removeSelectedBtn = document.getElementById('btnRemoveSelected');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    
    if (!selectAllCheckbox || !removeSelectedBtn) return;
    
    // Select all functionality
    selectAllCheckbox.addEventListener('change', () => {
        const isChecked = selectAllCheckbox.checked;
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            toggleItemSelected(checkbox);
        });
        updateRemoveSelectedButton();
    });
    
    // Individual checkbox handlers
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            toggleItemSelected(checkbox);
            updateSelectAllState();
            updateRemoveSelectedButton();
        });
    });
    
    // Remove selected button handler
    removeSelectedBtn.addEventListener('click', () => {
        const selectedCount = document.querySelectorAll('.item-checkbox:checked').length;
        if (selectedCount === 0) return;
        
        showConfirmDialog(
            'Remove Selected Items',
            `Are you sure you want to remove ${selectedCount} item${selectedCount > 1 ? 's' : ''} from your cart?`,
            removeSelectedItems
        );
    });
}

/**
 * Toggle selected state on cart item card
 */
function toggleItemSelected(checkbox) {
    const cartItem = checkbox.closest('.cart-item-card');
    if (cartItem) {
        cartItem.classList.toggle('selected', checkbox.checked);
    }
}

/**
 * Update select all checkbox state based on individual checkboxes
 */
function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const checkedCount = document.querySelectorAll('.item-checkbox:checked').length;
    
    if (!selectAllCheckbox) return;
    
    if (itemCheckboxes.length === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === itemCheckboxes.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

/**
 * Update remove selected button state
 */
function updateRemoveSelectedButton() {
    const removeSelectedBtn = document.getElementById('btnRemoveSelected');
    const checkedCheckboxes = document.querySelectorAll('.item-checkbox:checked');
    const checkedCount = checkedCheckboxes.length;
    
    if (!removeSelectedBtn) return;
    
    if (checkedCount > 0) {
        // Calculate total of selected items
        let selectedTotal = 0;
        checkedCheckboxes.forEach(checkbox => {
            const cartItem = checkbox.closest('.cart-item-card');
            if (cartItem) {
                const subtotalEl = cartItem.querySelector('.cart-item-subtotal');
                if (subtotalEl) {
                    const match = subtotalEl.textContent.match(/₱([\d,]+)/);
                    if (match) {
                        selectedTotal += parseInt(match[1].replace(',', ''));
                    }
                }
            }
        });
        
        removeSelectedBtn.classList.add('active');
        removeSelectedBtn.disabled = false;
        removeSelectedBtn.querySelector('span').textContent = `Remove Selected (${checkedCount}) - ₱${selectedTotal.toLocaleString()}`;
    } else {
        removeSelectedBtn.classList.remove('active');
        removeSelectedBtn.disabled = true;
        removeSelectedBtn.querySelector('span').textContent = 'Remove Selected';
    }
}

/**
 * Remove all selected items
 */
function removeSelectedItems() {
    const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked');
    const itemIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
    
    if (itemIds.length === 0) return;
    
    // Animate all selected items
    itemIds.forEach(id => {
        const item = document.querySelector(`.cart-item-card[data-id="${id}"]`);
        if (item) {
            item.classList.add('removing');
        }
    });
    
    setTimeout(() => {
        // Remove all selected items from DOM
        itemIds.forEach(id => {
            const item = document.querySelector(`.cart-item-card[data-id="${id}"]`);
            if (item) item.remove();
        });
        
        // Update localStorage
        let cart = getCart();
        cart = cart.filter(item => !itemIds.includes(item.id));
        saveCart(cart);
        
        // Check if cart is empty
        const remainingItems = document.querySelectorAll('.cart-item, .cart-item-card');
        if (remainingItems.length === 0) {
            showEmptyCart();
        } else {
            updateOrderSummary();
            updateSelectAllState();
            updateRemoveSelectedButton();
        }
        
        showToast(`${itemIds.length} item${itemIds.length > 1 ? 's' : ''} removed from cart`, 'success');
    }, 400);
}

/**
 * Show confirmation dialog
 */
function showConfirmDialog(title, message, onConfirm) {
    // Remove existing dialogs
    document.querySelectorAll('.confirm-dialog-overlay').forEach(d => d.remove());
    
    const overlay = document.createElement('div');
    overlay.className = 'confirm-dialog-overlay';
    
    overlay.innerHTML = `
        <div class="confirm-dialog">
            <div class="confirm-dialog-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>${title}</h3>
            </div>
            <p class="confirm-dialog-message">${message}</p>
            <div class="confirm-dialog-actions">
                <button class="btn-cancel">Cancel</button>
                <button class="btn-confirm">Remove</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animate in
    requestAnimationFrame(() => {
        overlay.classList.add('show');
    });
    
    // Event handlers
    const closeDialog = () => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 200);
    };
    
    overlay.querySelector('.btn-cancel').addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDialog();
    });
    
    overlay.querySelector('.btn-confirm').addEventListener('click', () => {
        closeDialog();
        if (onConfirm) onConfirm();
    });
    
    // Focus trap
    overlay.querySelector('.btn-cancel').focus();
}
