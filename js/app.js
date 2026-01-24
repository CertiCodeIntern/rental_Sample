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
window.AppUtils = {
    showAuthMessage,
    updateUserDisplay,
    calculateSubtotal,
    setDefaultDates,
    closeSidebar
};
