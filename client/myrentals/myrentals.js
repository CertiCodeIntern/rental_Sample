/* =====================================================
   MY RENTALS PAGE JAVASCRIPT
   RentIt - Client Portal
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components using Components module
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'myrentals', 'client');
        Components.injectTopbar('topbarContainer', 'My Rentals');
        Components.injectFooter('footerContainer');
    }
    
    initRentalActions();
});

/**
 * Initialize rental card actions
 */
function initRentalActions() {
    // Extend buttons - Navigate to extend form
    document.querySelectorAll('.btn-extend').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.rental-card');
            const rentalId = card?.dataset?.rentalId || getRentalIdFromCard(card);
            
            // Navigate to extend form
            window.location.href = `client/returns/extendform.php?id=${encodeURIComponent(rentalId)}`;
        });
    });

    // Return buttons - Navigate to return form
    document.querySelectorAll('.btn-return').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.rental-card');
            const rentalId = card?.dataset?.rentalId || getRentalIdFromCard(card);
            
            // Navigate to return form
            window.location.href = `client/returns/returnform.php?id=${encodeURIComponent(rentalId)}`;
        });
    });

    // Receipt download buttons
    document.querySelectorAll('.action-btn:not(.action-muted)').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.textContent.includes('Receipt')) {
                e.preventDefault();
                alert('Downloading receipt...\n\nThis would download the PDF receipt.');
            }
        });
    });
}

/**
 * Extract rental ID from card element
 */
function getRentalIdFromCard(card) {
    // Try to get from badge or other element
    const badge = card?.querySelector('.rental-id-badge, .card-badge');
    if (badge) {
        return badge.textContent.trim();
    }
    // Fallback to generated ID
    return 'VDK-' + Math.floor(Math.random() * 10000);
}

/**
 * Update active rentals count
 */
function updateActiveRentalsCount() {
    const cards = document.querySelectorAll('.rental-card');
    const badge = document.getElementById('unitsBadge');
    
    if (badge) {
        const count = cards.length;
        badge.textContent = `${count} Unit${count !== 1 ? 's' : ''} Active`;
    }
}
