/**
 * ===============================================
 * RETURN FORM JAVASCRIPT
 * Client-side return request form functionality
 * ===============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initReturnForm();
});

/**
 * Initialize all return form functionality
 */
function initReturnForm() {
    // Inject components
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'myrentals', 'client');
        Components.injectTopbar('topbarContainer', 'Return Request');
        Components.injectFooter('footerContainer');
    }

    // Initialize form handlers
    initTimeSlotOptions();
    initAddressOptions();
    initConditionOptions();
    initDatePicker();
    initFormSubmission();
    
    // Load rental data from URL params
    loadRentalData();
    
    // Update summary on load
    updateSummary();
}

/**
 * Load rental data from URL parameters
 */
function loadRentalData() {
    const params = new URLSearchParams(window.location.search);
    const rentalId = params.get('id');
    
    // In a real app, fetch rental details from API
    if (rentalId) {
        console.log('Loading rental:', rentalId);
        // Simulate loading rental data
        // updateRentalDisplay(rentalData);
    }
}

/**
 * Initialize time slot selection
 */
function initTimeSlotOptions() {
    const options = document.querySelectorAll('input[name="timeSlot"]');
    
    options.forEach(option => {
        option.addEventListener('change', function() {
            updateSummary();
        });
    });
}

/**
 * Initialize address options
 */
function initAddressOptions() {
    const options = document.querySelectorAll('input[name="addressType"]');
    const differentAddressForm = document.getElementById('differentAddressForm');
    
    options.forEach(option => {
        option.addEventListener('change', function() {
            // Update selected state
            document.querySelectorAll('.address-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.closest('.address-option').classList.add('selected');
            
            // Show/hide different address form
            if (this.value === 'different' && differentAddressForm) {
                differentAddressForm.style.display = 'block';
            } else if (differentAddressForm) {
                differentAddressForm.style.display = 'none';
            }
            
            updateSummary();
        });
    });
}

/**
 * Initialize condition options
 */
function initConditionOptions() {
    const options = document.querySelectorAll('input[name="condition"]');
    const damageNotesGroup = document.getElementById('damageNotesGroup');
    
    options.forEach(option => {
        option.addEventListener('change', function() {
            // Show/hide damage notes
            if (this.value === 'damaged' && damageNotesGroup) {
                damageNotesGroup.style.display = 'block';
            } else if (damageNotesGroup) {
                damageNotesGroup.style.display = 'none';
            }
            
            updateSummary();
        });
    });
}

/**
 * Initialize date picker
 */
function initDatePicker() {
    const datePicker = document.getElementById('pickupDate');
    
    if (datePicker) {
        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        datePicker.min = tomorrow.toISOString().split('T')[0];
        
        // Set maximum date to 7 days from now
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        datePicker.max = maxDate.toISOString().split('T')[0];
        
        datePicker.addEventListener('change', function() {
            updateSummary();
        });
    }
}

/**
 * Get form data
 */
function getFormData() {
    const pickupDate = document.getElementById('pickupDate')?.value;
    const timeSlot = document.querySelector('input[name="timeSlot"]:checked')?.value;
    const addressType = document.querySelector('input[name="addressType"]:checked')?.value;
    const condition = document.querySelector('input[name="condition"]:checked')?.value;
    const damageNotes = document.getElementById('damageNotes')?.value;
    const additionalNotes = document.getElementById('additionalNotes')?.value;
    
    let address = document.getElementById('savedAddress')?.textContent;
    if (addressType === 'different') {
        address = document.getElementById('newAddress')?.value;
    }
    
    return {
        pickupDate,
        timeSlot,
        addressType,
        address,
        condition,
        damageNotes,
        additionalNotes
    };
}

/**
 * Get time slot label
 */
function getTimeSlotLabel(slot) {
    const labels = {
        'morning': 'Morning (8AM-12PM)',
        'afternoon': 'Afternoon (1PM-5PM)',
        'evening': 'Evening (6PM-8PM)'
    };
    return labels[slot] || slot;
}

/**
 * Get condition label
 */
function getConditionLabel(condition) {
    const labels = {
        'excellent': 'Excellent',
        'good': 'Good',
        'damaged': 'Damaged'
    };
    return labels[condition] || condition;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return 'Select date';
    
    const date = new Date(dateString + 'T00:00:00');
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Update summary sidebar
 */
function updateSummary() {
    const formData = getFormData();
    
    // Update pickup date
    const summaryPickupDate = document.getElementById('summaryPickupDate');
    if (summaryPickupDate) {
        summaryPickupDate.textContent = formatDate(formData.pickupDate);
    }
    
    // Update time slot
    const summaryTimeSlot = document.getElementById('summaryTimeSlot');
    if (summaryTimeSlot) {
        summaryTimeSlot.textContent = getTimeSlotLabel(formData.timeSlot);
    }
    
    // Update condition
    const summaryCondition = document.getElementById('summaryCondition');
    if (summaryCondition) {
        summaryCondition.textContent = getConditionLabel(formData.condition);
    }
    
    // Update address
    const summaryAddress = document.getElementById('summaryAddress');
    if (summaryAddress) {
        if (formData.addressType === 'different' && formData.address) {
            summaryAddress.textContent = formData.address;
        } else {
            summaryAddress.textContent = document.getElementById('savedAddress')?.textContent || 'Not specified';
        }
    }
}

/**
 * Initialize form submission
 */
function initFormSubmission() {
    const form = document.getElementById('returnForm');
    const submitBtn = document.getElementById('submitReturn');
    
    if (form) {
        form.addEventListener('submit', handleReturnFormSubmit);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleReturnFormSubmit(e);
        });
    }
}

/**
 * Validate form
 */
function validateForm() {
    const formData = getFormData();
    const errors = [];
    
    if (!formData.pickupDate) {
        errors.push('Please select a pickup date');
    }
    
    if (!formData.timeSlot) {
        errors.push('Please select a time slot');
    }
    
    if (formData.addressType === 'different' && !formData.address?.trim()) {
        errors.push('Please enter a pickup address');
    }
    
    if (formData.condition === 'damaged' && !formData.damageNotes?.trim()) {
        errors.push('Please describe the damage');
    }
    
    return errors;
}

/**
 * Handle return form submission
 */
function handleReturnFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return;
    }
    
    const formData = getFormData();
    
    // Simulate submission
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        showSuccessModal(formData);
    }, 1500);
}

/**
 * Show loading state
 */
function showLoadingState() {
    const submitBtn = document.getElementById('submitReturn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/>
            </svg>
            Processing...
        `;
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const submitBtn = document.getElementById('submitReturn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            Schedule Pickup
        `;
    }
}

/**
 * Show success modal
 */
function showSuccessModal(formData) {
    const modal = document.getElementById('successModal');
    
    if (modal) {
        // Update modal details
        const modalReturnId = document.getElementById('modalReturnId');
        const modalPickupDate = document.getElementById('modalPickupDate');
        const modalTimeSlot = document.getElementById('modalTimeSlot');
        
        if (modalReturnId) {
            modalReturnId.textContent = `#RET-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        }
        
        if (modalPickupDate) {
            modalPickupDate.textContent = formatDate(formData.pickupDate);
        }
        
        if (modalTimeSlot) {
            modalTimeSlot.textContent = getTimeSlotLabel(formData.timeSlot);
        }
        
        modal.classList.add('active');
    }
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Use global notification system if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback to alert
    alert(message);
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
