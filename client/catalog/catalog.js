/**
 * =====================================================
 * CATALOG PAGE FUNCTIONALITY
 * Filtering, Search, and Product Interactions
 * =====================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize sidebar and topbar
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'catalog', 'client');
        Components.injectTopbar('topbarContainer', 'Browse Catalog');
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
    initPriceSlider();
    initCalendar();
    initSearch();
    initSortSelect();
    initProductCards();
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
    const maxPrice = parseInt(document.getElementById('priceSlider')?.value || 9999);
    const searchQuery = document.getElementById('catalogSearch')?.value.toLowerCase() || '';
    
    products.forEach(product => {
        const category = product.dataset.category;
        const price = parseInt(product.dataset.price);
        const name = product.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const description = product.querySelector('.product-description')?.textContent.toLowerCase() || '';
        
        let show = true;
        
        // Category filter
        if (activeCategories.length > 0 && !activeCategories.includes(category)) {
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
