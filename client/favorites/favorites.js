/**
 * Favorites Page JavaScript
 * Handles favorites management - add, remove, move to cart
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'favorites', 'client');
        Components.injectTopbar('topbarContainer', 'My Favorites');
        Components.injectFooter();
    }

    initFavorites();
});

/**
 * Initialize favorites functionality
 */
function initFavorites() {
    // Get favorites from localStorage (mock data)
    let favorites = getFavorites();

    // Attach event listeners
    attachRemoveListeners();
    attachMoveToCartListeners();

    // Update count display
    updateFavoritesCount();
}

/**
 * Get favorites from localStorage
 * @returns {Array} Array of favorite item IDs
 */
function getFavorites() {
    const stored = localStorage.getItem('rentit_favorites');
    return stored ? JSON.parse(stored) : [1, 3, 4]; // Default mock data
}

/**
 * Save favorites to localStorage
 * @param {Array} favorites - Array of favorite item IDs
 */
function saveFavorites(favorites) {
    localStorage.setItem('rentit_favorites', JSON.stringify(favorites));
}

/**
 * Attach remove button listeners
 */
function attachRemoveListeners() {
    document.querySelectorAll('.btn-remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(btn.dataset.id);
            removeFavorite(itemId);
        });
    });
}

/**
 * Remove item from favorites
 * @param {number} itemId - Product ID to remove
 */
function removeFavorite(itemId) {
    const card = document.querySelector(`.favorite-card[data-id="${itemId}"]`);
    
    if (card) {
        // Animate out
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            card.remove();
            
            // Update localStorage
            let favorites = getFavorites();
            favorites = favorites.filter(id => id !== itemId);
            saveFavorites(favorites);
            
            // Update count
            updateFavoritesCount();
            
            // Show empty state if no favorites left
            checkEmptyState();
        }, 300);
    }
}

/**
 * Attach move to cart button listeners
 */
function attachMoveToCartListeners() {
    document.querySelectorAll('.btn-move-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(btn.dataset.id);
            moveToCart(itemId);
        });
    });
}

/**
 * Move item from favorites to cart
 * @param {number} itemId - Product ID to move
 */
function moveToCart(itemId) {
    // Add to cart (localStorage)
    let cart = getCart();
    if (!cart.find(item => item.id === itemId)) {
        cart.push({ id: itemId, quantity: 1 });
        saveCart(cart);
    }
    
    // Remove from favorites
    removeFavorite(itemId);
    
    // Show toast notification
    showToast('Item moved to cart!', 'success');
}

/**
 * Get cart from localStorage
 * @returns {Array} Cart items
 */
function getCart() {
    const stored = localStorage.getItem('rentit_cart');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Save cart to localStorage
 * @param {Array} cart - Cart items
 */
function saveCart(cart) {
    localStorage.setItem('rentit_cart', JSON.stringify(cart));
}

/**
 * Update favorites count display
 */
function updateFavoritesCount() {
    const countEl = document.getElementById('favoritesCount');
    const grid = document.getElementById('favoritesGrid');
    const count = grid ? grid.querySelectorAll('.favorite-card').length : 0;
    
    if (countEl) {
        countEl.textContent = count;
    }
}

/**
 * Check if favorites is empty and show empty state
 */
function checkEmptyState() {
    const grid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('emptyFavorites');
    const count = grid ? grid.querySelectorAll('.favorite-card').length : 0;
    
    if (count === 0) {
        if (grid) grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success' | 'error' | 'info'
 */
function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
    `;
    
    // Add styles if not already in CSS
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 14px 24px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
