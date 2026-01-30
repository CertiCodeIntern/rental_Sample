/**
 * =====================================================
 * LANDING PAGE JAVASCRIPT
 * Homepage interactivity
 * =====================================================
 */

const Landing = {
    /**
     * Initialize landing page
     */
    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupThemeToggle();
        this.setupScrollAnimations();
    },

    /**
     * Setup mobile menu toggle
     */
    setupMobileMenu() {
        const toggle = document.getElementById('mobileToggle');
        const menu = document.getElementById('mobileMenu');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
            });

            // Close menu when clicking a link
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                });
            });
        }
    },

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    /**
     * Setup theme toggle functionality
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        // Get saved theme or default to dark
        const savedTheme = localStorage.getItem('rentit_theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('rentit_theme', newTheme);
            });
        }
    },

    /**
     * Setup scroll-triggered animations
     */
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .info-card, .faq-item');
        
        if (animatedElements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Landing.init();
});
