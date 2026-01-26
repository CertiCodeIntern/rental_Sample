/* =====================================================
   CertiCode Rental Dashboard - Application Logic
   ===================================================== */

// =====================================================
// DOM ELEMENTS
// =====================================================
const elements = {
    // Auth Elements
    authSection: document.getElementById('auth-section'),
    appContainer: document.getElementById('app-container'),
    loginBtn: document.getElementById('login-btn'),
    registerBtn: document.getElementById('register-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    authMessage: document.getElementById('auth-message'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    registerEmailInput: document.getElementById('register-email'),
    registerPasswordInput: document.getElementById('register-password'),
    loginTab: document.getElementById('login-tab'),
    registerTab: document.getElementById('register-tab'),
    loginFormContainer: document.getElementById('login-form-container'),
    registerFormContainer: document.getElementById('register-form-container'),
    
    // Mobile
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    
    // User display
    userAvatar: document.getElementById('user-avatar'),
    userName: document.getElementById('user-name'),
    userRole: document.getElementById('user-role'),
    topbarTitle: document.getElementById('topbar-title')
};

// =====================================================
// AUTH TAB SWITCHING
// =====================================================
function initAuthTabs() {
    if (elements.loginTab) {
        elements.loginTab.addEventListener('click', () => {
            elements.loginTab.classList.add('active');
            elements.registerTab.classList.remove('active');
            elements.loginFormContainer.classList.remove('hidden');
            elements.registerFormContainer.classList.add('hidden');
            if (elements.authMessage) elements.authMessage.classList.add('hidden');
        });
    }
    
    if (elements.registerTab) {
        elements.registerTab.addEventListener('click', () => {
            elements.registerTab.classList.add('active');
            elements.loginTab.classList.remove('active');
            elements.registerFormContainer.classList.remove('hidden');
            elements.loginFormContainer.classList.add('hidden');
            if (elements.authMessage) elements.authMessage.classList.add('hidden');
        });
    }
}

// =====================================================
// SIDEBAR NAVIGATION
// =====================================================
function initSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            const tabTitle = item.textContent.trim();
            
            // Update active sidebar item
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
            
            // Update topbar title
            if (elements.topbarTitle) {
                elements.topbarTitle.textContent = tabTitle;
            }
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
}

// =====================================================
// MOBILE MENU
// =====================================================
function initMobileMenu() {
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener('click', toggleSidebar);
    }
    
    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.addEventListener('click', closeSidebar);
    }
}

function toggleSidebar() {
    if (elements.sidebar) {
        elements.sidebar.classList.toggle('open');
    }
    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.classList.toggle('active');
    }
}

function closeSidebar() {
    if (elements.sidebar) {
        elements.sidebar.classList.remove('open');
    }
    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.classList.remove('active');
    }
}

// =====================================================
// AUTH MESSAGE DISPLAY
// =====================================================
function showAuthMessage(message, type) {
    if (elements.authMessage) {
        elements.authMessage.textContent = message;
        elements.authMessage.classList.remove('hidden', 'success', 'error');
        elements.authMessage.classList.add(type);
    }
}

// =====================================================
// USER DISPLAY UPDATE
// =====================================================
function updateUserDisplay(email, role = 'Customer') {
    if (elements.userAvatar) {
        elements.userAvatar.textContent = email ? email.charAt(0).toUpperCase() : 'U';
    }
    if (elements.userName) {
        elements.userName.textContent = email ? email.split('@')[0] : 'User';
    }
    if (elements.userRole) {
        elements.userRole.textContent = role;
    }
}

// =====================================================
// SUBTOTAL CALCULATION
// =====================================================
function initSubtotalCalculation() {
    const hourlyRateInput = document.getElementById('detail-hourly-rate');
    const hoursInput = document.getElementById('detail-hours');
    
    if (hourlyRateInput) {
        hourlyRateInput.addEventListener('input', calculateSubtotal);
    }
    if (hoursInput) {
        hoursInput.addEventListener('input', calculateSubtotal);
    }
}

function calculateSubtotal() {
    const hourlyRate = parseFloat(document.getElementById('detail-hourly-rate')?.value) || 0;
    const hours = parseInt(document.getElementById('detail-hours')?.value) || 0;
    const subtotal = hourlyRate * hours;
    const subtotalInput = document.getElementById('detail-subtotal');
    if (subtotalInput) {
        subtotalInput.value = subtotal.toFixed(2);
    }
}

// =====================================================
// DEFAULT DATES
// =====================================================
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const rentalDate = document.getElementById('rental-date');
    const paymentDate = document.getElementById('payment-date');
    
    if (rentalDate) rentalDate.value = today;
    if (paymentDate) paymentDate.value = today;
    
    // Set current time rounded to nearest hour
    const startTime = document.getElementById('start-time');
    if (startTime) {
        const now = new Date();
        now.setMinutes(0);
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
        startTime.value = currentTime;
    }
}

// =====================================================
// CLEAR FORMS
// =====================================================
function initClearButtons() {
    // Users
    document.getElementById('clear-user')?.addEventListener('click', () => {
        document.getElementById('users-form')?.reset();
        document.getElementById('user-id').value = '';
    });
    
    // Rentals
    document.getElementById('clear-rental')?.addEventListener('click', () => {
        document.getElementById('rentals-form')?.reset();
        document.getElementById('rental-id').value = '';
        setDefaultDates();
    });
    
    // Categories
    document.getElementById('clear-category')?.addEventListener('click', () => {
        document.getElementById('categories-form')?.reset();
        document.getElementById('category-id').value = '';
    });
    
    // Rental Items
    document.getElementById('clear-item')?.addEventListener('click', () => {
        document.getElementById('rental-items-form')?.reset();
        document.getElementById('item-id').value = '';
    });
    
    // Rental Details
    document.getElementById('clear-rental-detail')?.addEventListener('click', () => {
        document.getElementById('rental-details-form')?.reset();
        document.getElementById('rental-detail-id').value = '';
        document.getElementById('detail-subtotal').value = '';
    });
    
    // Deliveries
    document.getElementById('clear-delivery')?.addEventListener('click', () => {
        document.getElementById('deliveries-form')?.reset();
        document.getElementById('delivery-id').value = '';
    });
    
    // Payments
    document.getElementById('clear-payment')?.addEventListener('click', () => {
        document.getElementById('payments-form')?.reset();
        document.getElementById('payment-id').value = '';
        setDefaultDates();
    });
}

// =====================================================
// WINDOW RESIZE HANDLER
// =====================================================
function initResizeHandler() {
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
}

// =====================================================
// INITIALIZE APP
// =====================================================
function initApp() {
    initAuthTabs();
    initSidebarNavigation();
    initMobileMenu();
    initSubtotalCalculation();
    initClearButtons();
    initResizeHandler();
    setDefaultDates();
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for use in Firebase module
// Minimal animation/loading helpers
/**
 * showLoader / loadWithLoader
 * - el: container element to toggle `.is-loading`
 * - fetchPromise: promise resolving when content/data is ready
 * - options: { minVisible (ms), fallback (ms) }
 */
function loadWithLoader(el, fetchPromise, { minVisible = 120, fallback = 30000 } = {}){
    if (!el) return fetchPromise;
    el.classList.add('is-loading');
    const start = Date.now();

    let fallbackTimer = setTimeout(() => {
        el.classList.remove('is-loading');
        el.classList.add('is-failed');
    }, fallback);

    return Promise.resolve(fetchPromise)
        .then(res => {
            const elapsed = Date.now() - start;
            const wait = Math.max(0, minVisible - elapsed);
            return new Promise(resolve => setTimeout(() => resolve(res), wait));
        })
        .then(res => {
            clearTimeout(fallbackTimer);
            el.classList.remove('is-loading');
            el.classList.add('is-loaded');
            return res;
        })
        .catch(err => {
            clearTimeout(fallbackTimer);
            el.classList.remove('is-loading');
            el.classList.add('is-failed');
            throw err;
        });
}

/**
 * Apply staggered entrance to a container's direct children.
 * JS sets `--index` on each child; CSS uses that for delay.
 */
function staggerEntrance(container, options = {}){
    if (!container) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const children = Array.from(container.children || []);
    const max = options.max || 50;
    children.slice(0, max).forEach((child, i) => {
        child.style.setProperty('--index', i);
        child.classList.add('stagger-child');
    });
}

// Try to enable motion by default if not reduced
if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    document.documentElement.classList.add('motion-enabled');
}

// Small example: stagger auth-card children on auth page
document.addEventListener('DOMContentLoaded', () => {
    const authCard = document.querySelector('.auth-card');
    if (authCard) staggerEntrance(authCard);
});

// =====================================================
// Data fetching + render helpers (wired to loader)
// =====================================================
function safeFetchJSON(url, simulateDataFn = null) {
    return fetch(url)
        .then(res => res.ok ? res.json() : Promise.reject())
        .catch(() => {
            // Fallback to simulated data if provided, otherwise empty array
            if (typeof simulateDataFn === 'function') {
                return new Promise(resolve => setTimeout(() => resolve(simulateDataFn()), 800));
            }
            return [];
        });
}

function renderUsers(rows = []){
    const tbody = document.getElementById('users-list');
    if (!tbody) return;
    // remove any existing non-skeleton rows
    tbody.querySelectorAll('tr.data-row').forEach(n => n.remove());
    rows.forEach(u => {
        const tr = document.createElement('tr');
        tr.classList.add('data-row');
        tr.innerHTML = `
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>${u.status}</td>
            <td>${u.created}</td>
            <td><button class="btn btn-sm">Edit</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderRentals(rows = []){
    const tbody = document.getElementById('rentals-list');
    if (!tbody) return;
    tbody.querySelectorAll('tr.data-row').forEach(n => n.remove());
    rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.classList.add('data-row');
        tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.user}</td>
            <td>${r.date}</td>
            <td>${r.hours}</td>
            <td>${r.total}</td>
            <td>${r.status}</td>
            <td>${r.created}</td>
            <td><button class="btn btn-sm">View</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderItems(rows = []){
    const tbody = document.getElementById('items-list');
    if (!tbody) return;
    tbody.querySelectorAll('tr.data-row').forEach(n => n.remove());
    rows.forEach(it => {
        const tr = document.createElement('tr');
        tr.classList.add('data-row');
        tr.innerHTML = `
            <td>${it.id}</td>
            <td>${it.name}</td>
            <td>${it.category}</td>
            <td>${it.rate}</td>
            <td>${it.status}</td>
            <td>${it.created}</td>
            <td><button class="btn btn-sm">Edit</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// sample data generators (used as fallback)
function sampleUsers(){
    return [
        {id: 'U1', name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'Active', created: '2025-11-01'},
        {id: 'U2', name: 'Bob', email: 'bob@example.com', role: 'Customer', status: 'Active', created: '2025-12-10'}
    ];
}

function sampleRentals(){
    return [
        {id: 'R1', user: 'Alice', date: '2026-01-20', hours: 4, total: '₱1200', status: 'Pending', created: '2026-01-20'},
    ];
}

function sampleItems(){
    return [
        {id: 'I1', name: 'Videoke Pro', category: 'Audio', rate: '₱500/hr', status: 'Available', created: '2025-10-01'}
    ];
}

function fetchAndRenderUsers(){
    const container = document.querySelector('.table-container');
    const table = document.querySelector('#users-list')?.closest('.table-container');
    const promise = safeFetchJSON('/api/users', sampleUsers);
    return loadWithLoader(table || container, promise).then(data => renderUsers(Array.isArray(data) ? data : sampleUsers()));
}

function fetchAndRenderRentals(){
    const table = document.querySelector('#rentals-list')?.closest('.table-container');
    const promise = safeFetchJSON('/api/rentals', sampleRentals);
    return loadWithLoader(table, promise).then(data => renderRentals(Array.isArray(data) ? data : sampleRentals()));
}

function fetchAndRenderItems(){
    const table = document.querySelector('#items-list')?.closest('.table-container');
    const promise = safeFetchJSON('/api/items', sampleItems);
    return loadWithLoader(table, promise).then(data => renderItems(Array.isArray(data) ? data : sampleItems()));
}

// Trigger initial loads after app init
document.addEventListener('DOMContentLoaded', () => {
    // Slightly stagger which tables load first to show UX
    fetchAndRenderUsers();
    setTimeout(fetchAndRenderRentals, 250);
    setTimeout(fetchAndRenderItems, 400);
});

// Export helpers
window.AppUtils = {
    showAuthMessage,
    updateUserDisplay,
    calculateSubtotal,
    setDefaultDates,
    closeSidebar,
    loadWithLoader,
    staggerEntrance
};
