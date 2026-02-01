/**
 * =====================================================
 * CATALOG PAGE FUNCTIONALITY
 * Filtering, Search, and Product Interactions
 * =====================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize sidebar, topbar, and footer
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'catalog', 'client');
        Components.injectTopbar('topbarContainer', 'Browse Catalog');
        Components.injectFooter();
    }

    // Initialize catalog functionality
    initCatalog();
});

/**
 * Initialize all catalog features
 */
function initCatalog() {
    initCatalogTabs();
    initCategoryFilters();
    initStatusFilters();
    initPriceSlider();
    initCalendar();
    initSearch();
    initSortSelect();
    initProductCards();
    initProductModal();
    initPagination();
}

/**
 * Catalog Tabs (Catalog / Top Promos)
 */
function initCatalogTabs() {
    const tabs = document.querySelectorAll('.tab-link');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter products based on tab
            const tabType = tab.dataset.tab;
            filterByTab(tabType);
        });
    });
}

function filterByTab(tabType) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (tabType === 'all') {
            product.style.display = '';
        } else if (tabType === 'promos') {
            // Show only promo items (you can add a data-promo attribute)
            const isPromo = product.dataset.promo === 'true';
            product.style.display = isPromo ? '' : 'none';
        }
    });
    
    updateProductCount();
}

/**
 * Category Filters
 */
function initCategoryFilters() {
    const checkboxes = document.querySelectorAll('.category-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            filterProducts();
        });
    });
    
    // Reset filters button
    const resetBtn = document.querySelector('.reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            checkboxes.forEach(cb => cb.checked = false);
            
            // Reset status filters
            document.querySelectorAll('.status-checkbox').forEach(cb => {
                cb.checked = cb.value === 'available';
            });
            
            // Reset price slider
            const priceSlider = document.getElementById('priceSlider');
            if (priceSlider) {
                priceSlider.value = priceSlider.max;
                updatePriceDisplay(priceSlider.value);
            }
            
            filterProducts();
        });
    }
}

/**
 * Status Filters (Available, Booked, Maintenance)
 */
function initStatusFilters() {
    const checkboxes = document.querySelectorAll('.status-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            filterProducts();
        });
    });
}

/**
 * Price Range Slider
 */
function initPriceSlider() {
    const slider = document.getElementById('priceSlider');
    const priceValue = document.getElementById('priceValue');
    
    if (slider) {
        slider.addEventListener('input', (e) => {
            updatePriceDisplay(e.target.value);
            filterProducts();
        });
    }
}

function updatePriceDisplay(value) {
    const priceValue = document.getElementById('priceValue');
    if (priceValue) {
        priceValue.textContent = `₱${parseInt(value).toLocaleString()}`;
    }
}

/**
 * Filter products based on all criteria
 */
function filterProducts() {
    const products = document.querySelectorAll('.product-card');
    const activeCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(cb => cb.value);
    const activeStatuses = Array.from(document.querySelectorAll('.status-checkbox:checked'))
        .map(cb => cb.value);
    const maxPrice = parseInt(document.getElementById('priceSlider')?.value || 9999);
    const searchQuery = document.getElementById('catalogSearch')?.value.toLowerCase() || '';
    
    products.forEach(product => {
        const category = product.dataset.category;
        const price = parseInt(product.dataset.price);
        const name = product.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const description = product.querySelector('.product-description')?.textContent.toLowerCase() || '';
        
        // Get product status from badge
        const badge = product.querySelector('.product-badge');
        let status = 'available';
        if (badge) {
            if (badge.classList.contains('booked') || badge.textContent.toLowerCase().includes('booked')) {
                status = 'booked';
            } else if (badge.classList.contains('maintenance') || badge.textContent.toLowerCase().includes('maintenance')) {
                status = 'maintenance';
            }
        }
        
        let show = true;
        
        // Category filter
        if (activeCategories.length > 0 && !activeCategories.includes(category)) {
            show = false;
        }
        
        // Status filter
        if (activeStatuses.length > 0 && !activeStatuses.includes(status)) {
            show = false;
        }
        
        // Price filter
        if (price > maxPrice) {
            show = false;
        }
        
        // Search filter
        if (searchQuery && !name.includes(searchQuery) && !description.includes(searchQuery)) {
            show = false;
        }
        
        product.style.display = show ? '' : 'none';
    });
    
    updateProductCount();
}

function updateProductCount() {
    const visibleProducts = document.querySelectorAll('.product-card:not([style*="display: none"])').length;
    const countEl = document.querySelector('.products-count');
    if (countEl) {
        countEl.textContent = `(${visibleProducts} models found)`;
    }
}

/**
 * Calendar Picker
 */
function initCalendar() {
    const prevBtn = document.getElementById('calendarPrev');
    const nextBtn = document.getElementById('calendarNext');
    const monthDisplay = document.getElementById('calendarMonth');
    const calendarGrid = document.getElementById('calendarGrid');
    
    if (!calendarGrid) return;
    
    let currentDate = new Date();
    let selectedDate = null;
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        if (monthDisplay) {
            monthDisplay.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Clear grid (keep day headers)
        const dayHeaders = calendarGrid.querySelectorAll('.calendar-day-header');
        calendarGrid.innerHTML = '';
        dayHeaders.forEach(header => calendarGrid.appendChild(header.cloneNode(true)));
        
        // Add day headers if they don't exist
        if (calendarGrid.children.length === 0) {
            const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            days.forEach(day => {
                const header = document.createElement('span');
                header.className = 'calendar-day-header';
                header.textContent = day;
                calendarGrid.appendChild(header);
            });
        }
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        // Add empty cells for days before the first
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('span');
            empty.className = 'calendar-day disabled';
            calendarGrid.appendChild(empty);
        }
        
        // Add day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('span');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            
            const cellDate = new Date(year, month, day);
            
            // Mark today
            if (cellDate.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }
            
            // Mark past dates as disabled
            if (cellDate < today && cellDate.toDateString() !== today.toDateString()) {
                dayEl.classList.add('disabled');
            } else {
                dayEl.addEventListener('click', () => {
                    calendarGrid.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                    dayEl.classList.add('selected');
                    selectedDate = cellDate;
                    // You could filter products by availability here
                });
            }
            
            // Mark selected date
            if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
                dayEl.classList.add('selected');
            }
            
            calendarGrid.appendChild(dayEl);
        }
    }
    
    // Navigation
    prevBtn?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextBtn?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Initial render
    renderCalendar();
}

/**
 * Search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('catalogSearch');
    
    if (searchInput) {
        // Debounce search
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterProducts();
            }, 300);
        });
    }
}

/**
 * Sort Select
 */
function initSortSelect() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortProducts(sortSelect.value);
        });
    }
}

function sortProducts(sortBy) {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    
    const products = Array.from(grid.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'name':
                return a.querySelector('.product-name').textContent
                    .localeCompare(b.querySelector('.product-name').textContent);
            case 'popular':
            default:
                return parseInt(b.dataset.popularity || 0) - parseInt(a.dataset.popularity || 0);
        }
    });
    
    // Re-append in sorted order
    products.forEach(product => grid.appendChild(product));
}

/**
 * Product Card Interactions
 */
function initProductCards() {
    const ctaButtons = document.querySelectorAll('.product-cta');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productName = card.querySelector('.product-name')?.textContent;
            const isNotify = btn.classList.contains('notify');
            
            if (isNotify) {
                // Handle notify when ready
                alert(`You'll be notified when "${productName}" becomes available!`);
            } else {
                // Handle rent now - redirect to booking
                const productId = card.dataset.id;
                window.location.href = `/client/booking/new.html?product=${productId}`;
            }
        });
    });

    // Initialize review buttons
    initReviewButtons();
    
    // Initialize mock rental history for testing
    if (typeof Components !== 'undefined') {
        Components.initMockRentalHistory();
    }
}

/**
 * Initialize Review Buttons on Product Cards
 */
function initReviewButtons() {
    document.querySelectorAll('.btn-write-review').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const card = e.target.closest('.product-card');
            if (!card) return;
            
            const productId = card.dataset.id;
            const productName = card.querySelector('.product-name')?.textContent || 'Product';
            const productImage = card.querySelector('.product-image img')?.src || '';
            const productCategory = card.querySelector('.badge')?.textContent || 'Equipment';
            
            // Open review modal
            if (typeof Components !== 'undefined') {
                Components.openReviewModal({
                    id: productId,
                    name: productName,
                    image: productImage,
                    category: productCategory
                });
            }
        });
    });
}

/**
 * Pagination
 */
function initPagination() {
    const pageButtons = document.querySelectorAll('.page-btn:not(:disabled)');
    
    pageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            
            if (page === 'prev') {
                // Go to previous page
                const currentActive = document.querySelector('.page-btn.active');
                const currentPage = parseInt(currentActive?.dataset.page || 1);
                if (currentPage > 1) {
                    goToPage(currentPage - 1);
                }
            } else if (page === 'next') {
                // Go to next page
                const currentActive = document.querySelector('.page-btn.active');
                const currentPage = parseInt(currentActive?.dataset.page || 1);
                const totalPages = document.querySelectorAll('.page-btn[data-page]:not([data-page="prev"]):not([data-page="next"])').length;
                if (currentPage < totalPages) {
                    goToPage(currentPage + 1);
                }
            } else {
                goToPage(parseInt(page));
            }
        });
    });
}

function goToPage(pageNum) {
    // Update active state
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.page) === pageNum);
    });
    
    // In a real app, this would fetch products for that page
    // For now, just scroll to top of products
    document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Product Details Modal
 */
function initProductModal() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.getElementById('closeProductModal');
    
    if (!modal) return;
    
    // Close modal handlers
    closeBtn?.addEventListener('click', closeProductModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProductModal();
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProductModal();
        }
    });
    
    // Add click handlers to product cards (make whole card clickable)
    document.querySelectorAll('.product-card').forEach(card => {
        // Make the card clickable for viewing details
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking on action buttons
            if (e.target.closest('.product-actions') || e.target.closest('button')) {
                return;
            }
            openProductModal(card);
        });
    });
    
    // Modal action buttons
    const favoriteBtn = document.getElementById('modalFavoriteBtn');
    const cartBtn = document.getElementById('modalCartBtn');
    
    favoriteBtn?.addEventListener('click', () => {
        favoriteBtn.classList.toggle('active');
        const isActive = favoriteBtn.classList.contains('active');
        favoriteBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="${isActive ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            ${isActive ? 'In Favorites' : 'Add to Favorites'}
        `;
    });
    
    cartBtn?.addEventListener('click', () => {
        cartBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            Added to Cart
        `;
        setTimeout(() => {
            cartBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Add to Cart
            `;
        }, 2000);
    });
}

/**
 * Open Product Modal with product data
 */
function openProductModal(card) {
    const modal = document.getElementById('productModal');
    if (!modal || !card) return;
    
    // Get product data from card
    const productId = card.dataset.id;
    const productName = card.querySelector('.product-name')?.textContent || 'Product';
    const productImage = card.querySelector('.product-image')?.src || '';
    const productPrice = card.querySelector('.product-price')?.textContent || '₱0';
    const productDescription = card.querySelector('.product-description')?.textContent || '';
    const badge = card.querySelector('.product-badge');
    const badgeText = badge?.textContent || 'Available';
    const badgeClass = badge?.classList.contains('booked') ? 'booked' : 
                       badge?.classList.contains('maintenance') ? 'maintenance' : '';
    
    // Get rating data
    const ratingScore = card.querySelector('.rating-score')?.textContent || '0.0';
    const ratingCount = card.querySelector('.rating-count')?.textContent || '(0 reviews)';
    const filledStars = card.querySelectorAll('.rating-stars .filled').length;
    
    // Get tags
    const tags = Array.from(card.querySelectorAll('.product-tag')).map(t => t.textContent);
    
    // Populate modal
    document.getElementById('modalProductImage').src = productImage;
    document.getElementById('modalProductImage').alt = productName;
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').innerHTML = productPrice;
    document.getElementById('modalProductDescription').textContent = productDescription;
    
    const modalBadge = document.getElementById('modalProductBadge');
    modalBadge.textContent = badgeText;
    modalBadge.className = 'modal-product-badge ' + badgeClass;
    
    // Populate rating
    document.getElementById('modalRatingScore').textContent = ratingScore;
    document.getElementById('modalRatingCount').textContent = ratingCount;
    
    const starsContainer = document.getElementById('modalRatingStars');
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const starClass = i <= filledStars ? 'filled' : 'empty';
        starsContainer.innerHTML += `
            <svg viewBox="0 0 24 24" class="${starClass}">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `;
    }
    
    // Populate tags
    const tagsContainer = document.getElementById('modalProductTags');
    tagsContainer.innerHTML = tags.map(tag => `<span class="product-tag">${tag}</span>`).join('');
    
    // Populate availability (mock data)
    const availabilityList = document.getElementById('modalAvailabilityList');
    const mockBookings = getProductBookings(productId);
    
    if (mockBookings.length > 0) {
        availabilityList.innerHTML = mockBookings.map(booking => `
            <div class="availability-item">
                <span class="availability-dates">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    ${booking.start} → ${booking.end}
                </span>
                <span class="availability-status">Booked</span>
            </div>
        `).join('');
    } else {
        availabilityList.innerHTML = '<p class="availability-empty">No upcoming bookings. Available anytime!</p>';
    }
    
    // Populate reviews (mock data)
    const reviewsList = document.getElementById('modalReviewsList');
    const mockReviews = getProductReviews(productId);
    const reviewsCount = document.getElementById('modalReviewsCount');
    reviewsCount.textContent = `(${mockReviews.length})`;
    
    if (mockReviews.length > 0) {
        reviewsList.innerHTML = mockReviews.map(review => `
            <div class="review-item">
                <div class="review-avatar">${review.author.charAt(0).toUpperCase()}</div>
                <div class="review-content">
                    <div class="review-header">
                        <span class="review-author">${review.author}</span>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <div class="review-stars">
                        ${Array(5).fill(0).map((_, i) => 
                            `<svg viewBox="0 0 24 24" class="${i < review.rating ? 'filled' : 'empty'}">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>`
                        ).join('')}
                    </div>
                    <p class="review-text">${review.text}</p>
                </div>
            </div>
        `).join('');
    } else {
        reviewsList.innerHTML = `
            <div class="review-empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p>No reviews yet. Be the first to share your experience!</p>
            </div>
        `;
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close Product Modal
 */
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Get mock bookings for a product
 */
function getProductBookings(productId) {
    // Mock booking data - in real app, this would come from an API
    const bookings = {
        '1': [
            { start: 'Feb 15, 2026', end: 'Feb 17, 2026' },
            { start: 'Mar 5, 2026', end: 'Mar 7, 2026' }
        ],
        '2': [],
        '3': [
            { start: 'Feb 20, 2026', end: 'Feb 22, 2026' }
        ],
        '4': [],
        '5': [],
        '6': [
            { start: 'Feb 12, 2026', end: 'Feb 12, 2026' }
        ]
    };
    return bookings[productId] || [];
}

/**
 * Get mock reviews for a product
 */
function getProductReviews(productId) {
    // Mock review data - in real app, this would come from an API
    const reviews = {
        '1': [
            { author: 'Maria Santos', rating: 5, date: 'Jan 28, 2026', text: 'Amazing sound quality! The dual-mic setup was perfect for our family reunion. Highly recommend!' },
            { author: 'Juan Dela Cruz', rating: 4, date: 'Jan 20, 2026', text: 'Great machine, lots of songs. Only wish it had more OPM classics.' },
            { author: 'Anna Reyes', rating: 5, date: 'Jan 15, 2026', text: 'Professional quality! Made our birthday party unforgettable.' }
        ],
        '2': [
            { author: 'Pedro Garcia', rating: 5, date: 'Jan 25, 2026', text: 'Perfect for small gatherings. Easy to carry and set up!' }
        ],
        '3': [
            { author: 'Rosa Mendoza', rating: 4, date: 'Jan 22, 2026', text: 'Good value for money. Kids loved it!' }
        ],
        '4': [],
        '5': [
            { author: 'Carlos Tan', rating: 5, date: 'Jan 18, 2026', text: 'Concert-level sound! Worth every peso.' },
            { author: 'Liza Aquino', rating: 5, date: 'Jan 10, 2026', text: 'Used for our wedding reception. Absolutely perfect!' }
        ],
        '6': [
            { author: 'Miguel Santos', rating: 4, date: 'Jan 5, 2026', text: 'Industrial quality, great for large venues.' }
        ]
    };
    return reviews[productId] || [];
}
