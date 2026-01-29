/**
 * =====================================================
 * AUTH PAGE JAVASCRIPT
 * Handles Login and Registration functionality
 * =====================================================
 */

const Auth = {
    // State
    activeTab: 'login',
    isTransitioning: false,
    loading: false,

    /**
     * Initialize the auth page
     */
    init() {
        // Check if already logged in
        if (Components.isAuthenticated()) {
            window.location.href = '/client/dashboard/';
            return;
        }

        // Handle URL hash for deep linking
        this.handleUrlHash();

        // Setup event listeners
        this.setupTabListeners();
        this.setupFormListeners();
        this.setupPasswordToggles();

        // Initialize animations
        Components.initStaggerAnimation('.auth-card');

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleUrlHash());
    },

    /**
     * Handle URL hash for deep linking (#login or #register)
     */
    handleUrlHash() {
        const hash = window.location.hash;
        if (hash === '#register') {
            this.switchTab('register', false);
        } else if (hash === '#login') {
            this.switchTab('login', false);
        }
    },

    /**
     * Setup tab switching listeners
     */
    setupTabListeners() {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');

        loginTab?.addEventListener('click', () => this.switchTab('login'));
        registerTab?.addEventListener('click', () => this.switchTab('register'));
    },

    /**
     * Switch between login and register tabs
     * @param {string} tab - 'login' or 'register'
     * @param {boolean} updateHash - Whether to update URL hash
     */
    switchTab(tab, updateHash = true) {
        if (tab === this.activeTab || this.isTransitioning) return;

        this.isTransitioning = true;
        this.activeTab = tab;

        // Update URL hash
        if (updateHash) {
            window.history.pushState(null, '', `#${tab}`);
        }

        // Update tab buttons
        document.getElementById('loginTab')?.classList.toggle('active', tab === 'login');
        document.getElementById('registerTab')?.classList.toggle('active', tab === 'register');

        // Update tab indicator
        const indicator = document.getElementById('tabIndicator');
        if (indicator) {
            indicator.classList.toggle('register', tab === 'register');
        }

        // Fade out current form
        const formWrapper = document.getElementById('formWrapper');
        if (formWrapper) {
            formWrapper.classList.remove('fade-in');
            formWrapper.classList.add('fade-out');
        }

        // After transition, switch content
        setTimeout(() => {
            document.getElementById('loginForm')?.classList.toggle('hidden', tab !== 'login');
            document.getElementById('registerForm')?.classList.toggle('hidden', tab !== 'register');

            // Fade in new form
            if (formWrapper) {
                formWrapper.classList.remove('fade-out');
                formWrapper.classList.add('fade-in');
            }

            this.isTransitioning = false;
        }, 200);
    },

    /**
     * Setup form submission listeners
     */
    setupFormListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        registerForm?.addEventListener('submit', (e) => this.handleRegister(e));

        // Social login buttons (redirect to WIP)
        document.querySelectorAll('.auth-social-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = '/wip.html';
            });
        });
    },

    /**
     * Setup password visibility toggles
     */
    setupPasswordToggles() {
        document.querySelectorAll('.eye-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.currentTarget.parentElement.querySelector('input');
                if (input) {
                    Components.togglePasswordVisibility(input, e.currentTarget);
                }
            });
        });
    },

    /**
     * Handle login form submission
     * @param {Event} e - Form submit event
     */
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Clear previous errors
        this.hideError();

        // Validate
        if (!email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        // Show loading state
        this.setLoading(true, submitBtn, 'Signing in...');

        try {
            // Simulate API call (replace with actual API integration)
            await this.simulateApiCall();

            // Mock successful login - store user data
            const userData = {
                name: email.split('@')[0],
                email: email,
                role: 'Customer'
            };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', 'mock-jwt-token');

            // Redirect to dashboard
            window.location.href = '/client/dashboard/';
        } catch (error) {
            this.showError(error.message || 'Login failed. Please try again.');
        } finally {
            this.setLoading(false, submitBtn, 'Sign In  →');
        }
    },

    /**
     * Handle registration form submission
     * @param {Event} e - Form submit event
     */
    async handleRegister(e) {
        e.preventDefault();

        const fullName = document.getElementById('registerFullname')?.value;
        const phone = document.getElementById('registerPhone')?.value;
        const email = document.getElementById('registerEmail')?.value;
        const password = document.getElementById('registerPassword')?.value;
        const confirmPassword = document.getElementById('registerConfirmPassword')?.value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Clear previous errors
        this.hideError();

        // Validate
        if (!email || !password || !confirmPassword) {
            this.showError('Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        // Show loading state
        this.setLoading(true, submitBtn, 'Creating account...');

        try {
            // Simulate API call (replace with actual API integration)
            await this.simulateApiCall();

            // Mock successful registration - store user data
            const userData = {
                name: fullName || email.split('@')[0],
                email: email,
                phone: phone,
                role: 'Customer'
            };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', 'mock-jwt-token');

            // Redirect to dashboard
            window.location.href = '/client/dashboard/';
        } catch (error) {
            this.showError(error.message || 'Registration failed. Please try again.');
        } finally {
            this.setLoading(false, submitBtn, 'Get Started  →');
        }
    },

    /**
     * Simulate API call with delay
     * @returns {Promise}
     */
    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    },

    /**
     * Set loading state on button
     * @param {boolean} loading - Loading state
     * @param {HTMLButtonElement} button - Submit button
     * @param {string} text - Button text
     */
    setLoading(loading, button, text) {
        this.loading = loading;
        if (button) {
            button.disabled = loading;
            button.textContent = text;
        }
    },

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const errorEl = document.getElementById('authError');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    },

    /**
     * Hide error message
     */
    hideError() {
        const errorEl = document.getElementById('authError');
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
