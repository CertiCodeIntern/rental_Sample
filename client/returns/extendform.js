/**
 * ===============================================
 * EXTEND FORM JAVASCRIPT
 * Client-side extension request form functionality
 * ===============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initExtendForm();
});

/**
 * Initialize all extend form functionality
 */
function initExtendForm() {
    // Inject components
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'myrentals', 'client');
        Components.injectTopbar('topbarContainer', 'Extend Rental');
        Components.injectFooter('footerContainer');
    }

    // Initialize form handlers
    initDurationOptions();
    initCustomDaysInput();
    initFormSubmission();
    initAvailabilityCheck();
    
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
    // For now, using mock data
    if (rentalId) {
        console.log('Loading rental:', rentalId);
        // Simulate loading rental data
        // updateRentalDisplay(rentalData);
    }
}

/**
 * Initialize duration option selection
 */
function initDurationOptions() {
    const options = document.querySelectorAll('.duration-option input');
    const customInput = document.getElementById('customDaysInput');
    
    options.forEach(option => {
        option.addEventListener('change', function() {
            // Hide custom input if not custom option
            if (this.value === 'custom') {
                customInput.classList.add('active');
            } else {
                customInput.classList.remove('active');
            }
            
            // Update summary
            updateSummary();
            
            // Check availability
            checkAvailability();
        });
    });
}

/**
 * Initialize custom days input controls
 */
function initCustomDaysInput() {
    const decreaseBtn = document.getElementById('decreaseDays');
    const increaseBtn = document.getElementById('increaseDays');
    const daysNumber = document.getElementById('customDaysNumber');
    const minDays = 8;  // Minimum custom days
    const maxDays = 30; // Maximum custom days
    
    if (decreaseBtn && increaseBtn && daysNumber) {
        let currentDays = parseInt(daysNumber.textContent) || minDays;
        
        decreaseBtn.addEventListener('click', function() {
            if (currentDays > minDays) {
                currentDays--;
                daysNumber.textContent = currentDays;
                updateSummary();
                checkAvailability();
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            if (currentDays < maxDays) {
                currentDays++;
                daysNumber.textContent = currentDays;
                updateSummary();
                checkAvailability();
            }
        });
    }
}

/**
 * Get selected extension duration
 */
function getSelectedDuration() {
    const selectedOption = document.querySelector('.duration-option input:checked');
    
    if (!selectedOption) return 1;
    
    if (selectedOption.value === 'custom') {
        const customDays = document.getElementById('customDaysNumber');
        return parseInt(customDays?.textContent) || 8;
    }
    
    return parseInt(selectedOption.value) || 1;
}

/**
 * Calculate extension pricing
 */
function calculateExtensionPrice(days) {
    // Mock pricing - in real app, this would come from API
    const dailyRate = 300; // ₱300 per day
    const subtotal = days * dailyRate;
    const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
    const total = subtotal + serviceFee;
    
    return {
        dailyRate,
        days,
        subtotal,
        serviceFee,
        total
    };
}

/**
 * Update the summary sidebar
 */
function updateSummary() {
    const days = getSelectedDuration();
    const pricing = calculateExtensionPrice(days);
    
    // Update summary values
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryDailyRate = document.getElementById('summaryDailyRate');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryServiceFee = document.getElementById('summaryServiceFee');
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryNewEndDate = document.getElementById('summaryNewEndDate');
    
    if (summaryDuration) {
        summaryDuration.textContent = `${days} day${days > 1 ? 's' : ''}`;
    }
    
    if (summaryDailyRate) {
        summaryDailyRate.textContent = `₱${pricing.dailyRate.toLocaleString()}/day`;
    }
    
    if (summarySubtotal) {
        summarySubtotal.textContent = `₱${pricing.subtotal.toLocaleString()}`;
    }
    
    if (summaryServiceFee) {
        summaryServiceFee.textContent = `₱${pricing.serviceFee.toLocaleString()}`;
    }
    
    if (summaryTotal) {
        summaryTotal.textContent = `₱${pricing.total.toLocaleString()}`;
    }
    
    // Calculate new end date
    if (summaryNewEndDate) {
        const newEndDate = new Date(currentRentalEndDate);
        newEndDate.setDate(newEndDate.getDate() + days);
        
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        summaryNewEndDate.textContent = newEndDate.toLocaleDateString('en-US', options);
    }
}

// Mock data for future reservations by other customers
// In a real app, this would come from the backend API
const futureReservations = [
    {
        itemId: 'VDK-8921',
        startDate: '2026-02-08',
        endDate: '2026-02-15',
        customerName: 'Another Customer'
    },
    {
        itemId: 'VDK-8921',
        startDate: '2026-02-20',
        endDate: '2026-02-25',
        customerName: 'John Smith'
    }
];

// Current rental end date (would come from rental data)
let currentRentalEndDate = new Date('2026-01-31');
let currentItemId = 'VDK-8921';

/**
 * Check availability for extension dates
 * Validates against future reservations by other customers
 */
function checkAvailability() {
    const availabilityCheck = document.getElementById('availabilityCheck');
    if (!availabilityCheck) return;
    
    const days = getSelectedDuration();
    
    // Calculate new end date based on extension
    const newEndDate = new Date(currentRentalEndDate);
    newEndDate.setDate(newEndDate.getDate() + days);
    
    // Check if extension period conflicts with future reservations
    const conflictingReservation = checkForConflicts(currentItemId, currentRentalEndDate, newEndDate);
    
    const statusEl = availabilityCheck.querySelector('.availability-status');
    const iconEl = availabilityCheck.querySelector('.availability-icon');
    const datesEl = availabilityCheck.querySelector('.availability-dates');
    
    if (!conflictingReservation) {
        // Available - no conflicts
        availabilityCheck.classList.remove('unavailable');
        statusEl.textContent = 'Available for Extension';
        iconEl.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;
        
        const options = { month: 'short', day: 'numeric' };
        datesEl.textContent = 
            `New return date: ${newEndDate.toLocaleDateString('en-US', options)}, ${newEndDate.getFullYear()}`;
    } else {
        // Not available - conflicts with future reservation
        availabilityCheck.classList.add('unavailable');
        statusEl.textContent = 'Not Available - Reserved';
        iconEl.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        `;
        
        // Show when the next reservation starts
        const conflictStart = new Date(conflictingReservation.startDate);
        const options = { month: 'short', day: 'numeric' };
        datesEl.textContent = 
            `Item is reserved by another customer starting ${conflictStart.toLocaleDateString('en-US', options)}`;
        
        // Calculate maximum available extension days
        const maxDays = calculateMaxExtensionDays(currentRentalEndDate, conflictStart);
        if (maxDays > 0) {
            datesEl.textContent += `. Max extension: ${maxDays} day${maxDays > 1 ? 's' : ''}.`;
        }
    }
}

/**
 * Check for conflicts with future reservations
 * @param {string} itemId - ID of the item
 * @param {Date} currentEnd - Current rental end date
 * @param {Date} newEnd - Proposed new end date after extension
 * @returns {Object|null} Conflicting reservation or null if available
 */
function checkForConflicts(itemId, currentEnd, newEnd) {
    // Filter reservations for this item
    const itemReservations = futureReservations.filter(r => r.itemId === itemId);
    
    // Find any reservation that starts before the new end date
    for (const reservation of itemReservations) {
        const reservationStart = new Date(reservation.startDate);
        
        // If the reservation starts before our proposed end date, there's a conflict
        // We need at least 1 day gap for equipment return and preparation
        const bufferDate = new Date(reservationStart);
        bufferDate.setDate(bufferDate.getDate() - 1); // 1 day buffer for return
        
        if (newEnd > bufferDate) {
            return reservation;
        }
    }
    
    return null; // No conflicts
}

/**
 * Calculate maximum extension days before next reservation
 * @param {Date} currentEnd - Current rental end date
 * @param {Date} nextReservationStart - Start date of next reservation
 * @returns {number} Maximum available extension days
 */
function calculateMaxExtensionDays(currentEnd, nextReservationStart) {
    // Subtract 1 day buffer for return/preparation
    const availableUntil = new Date(nextReservationStart);
    availableUntil.setDate(availableUntil.getDate() - 1);
    
    const diffTime = availableUntil - currentEnd;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
}

/**
 * Initialize availability check display
 */
function initAvailabilityCheck() {
    // Initial check
    checkAvailability();
}

/**
 * Initialize form submission
 */
function initFormSubmission() {
    const form = document.getElementById('extendForm');
    const submitBtn = document.getElementById('submitExtension');
    
    if (form) {
        form.addEventListener('submit', handleExtendFormSubmit);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleExtendFormSubmit(e);
        });
    }
}

/**
 * Handle extend form submission
 */
function handleExtendFormSubmit(e) {
    e.preventDefault();
    
    const days = getSelectedDuration();
    const pricing = calculateExtensionPrice(days);
    const availabilityCheck = document.getElementById('availabilityCheck');
    
    // Check if available
    if (availabilityCheck && availabilityCheck.classList.contains('unavailable')) {
        showNotification('This extension period is not available. Please choose different dates.', 'error');
        return;
    }
    
    // Simulate submission
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        showSuccessModal(days, pricing);
    }, 1500);
}

/**
 * Show loading state
 */
function showLoadingState() {
    const submitBtn = document.getElementById('submitExtension');
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
    const submitBtn = document.getElementById('submitExtension');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            Confirm Extension
        `;
    }
}

/**
 * Show success modal
 */
function showSuccessModal(days, pricing) {
    const modal = document.getElementById('successModal');
    
    if (modal) {
        // Update modal details
        const modalExtId = document.getElementById('modalExtensionId');
        const modalDuration = document.getElementById('modalDuration');
        const modalTotal = document.getElementById('modalTotal');
        const modalNewDate = document.getElementById('modalNewEndDate');
        
        if (modalExtId) {
            modalExtId.textContent = `#EXT-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        }
        
        if (modalDuration) {
            modalDuration.textContent = `${days} day${days > 1 ? 's' : ''}`;
        }
        
        if (modalTotal) {
            modalTotal.textContent = `₱${pricing.total.toLocaleString()}`;
        }
        
        if (modalNewDate) {
            const currentEndDate = new Date('2026-01-31');
            const newEndDate = new Date(currentEndDate);
            newEndDate.setDate(newEndDate.getDate() + days);
            
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            modalNewDate.textContent = newEndDate.toLocaleDateString('en-US', options);
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
