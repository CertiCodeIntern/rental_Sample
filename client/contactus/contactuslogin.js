/**
 * =====================================================
 * CONTACT US LOGIN PAGE SCRIPTS
 * Client-side contact page functionality
 * =====================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initModal();
    initLiveChat();
    prefillUserData();
});

/**
 * Pre-fill form with user data from localStorage
 */
function prefillUserData() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            
            // Pre-fill name if available
            const fullNameInput = document.getElementById('fullName');
            if (fullNameInput && user.name) {
                fullNameInput.value = user.name;
            }
            
            // Pre-fill email if available
            const emailInput = document.getElementById('email');
            if (emailInput && user.email) {
                emailInput.value = user.email;
            }
        } catch (e) {
            console.log('Could not parse user data');
        }
    }
}

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" width="16" height="16">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="30 70"/>
            </svg>
            Sending...
        `;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(function() {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Send Message
            `;
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            contactForm.reset();
            
            // Re-prefill user data after reset
            prefillUserData();
        }, 1500);
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error state on input
            this.classList.remove('error');
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
}

/**
 * Validate the entire form
 * @returns {boolean} Whether the form is valid
 */
function validateForm() {
    const requiredFields = document.querySelectorAll('#contactForm [required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate a single field
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} Whether the field is valid
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.textContent = errorMessage;
        field.parentElement.appendChild(errorEl);
    }
    
    return isValid;
}

/**
 * Initialize modal functionality
 */
function initModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeModalBtn');
    
    if (!modal || !closeBtn) return;
    
    closeBtn.addEventListener('click', function() {
        hideSuccessModal();
    });
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideSuccessModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideSuccessModal();
        }
    });
}

/**
 * Show success modal
 */
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide success modal
 */
function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize live chat button
 */
function initLiveChat() {
    const chatBtn = document.getElementById('startChatBtn');
    
    if (!chatBtn) return;
    
    chatBtn.addEventListener('click', function() {
        // Check if user is premium (this would be replaced with actual check)
        const userStr = localStorage.getItem('user');
        let isPremium = false;
        
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                isPremium = user.memberStatus === 'Gold' || user.memberStatus === 'Platinum';
            } catch (e) {
                // Handle error
            }
        }
        
        if (isPremium) {
            // Open live chat (placeholder - would integrate with chat service)
            alert('Live chat feature coming soon! For now, please use the contact form.');
        } else {
            // Redirect to work in progress page or show upgrade prompt
            alert('Live chat is available for premium members. Upgrade your membership to access 24/7 support!');
        }
    });
}

/**
 * Add spinner animation styles
 */
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .spinner {
        animation: spin 1s linear infinite;
    }
    
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: #ef4444;
    }
    
    .form-input.error:focus,
    .form-select.error:focus,
    .form-textarea.error:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    }
    
    .error-message {
        font-size: 0.75rem;
        color: #ef4444;
        margin-top: 0.25rem;
    }
`;
document.head.appendChild(spinnerStyles);
