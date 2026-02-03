/**
 * =====================================================
 * CLIENT PROFILE SETTINGS - JavaScript
 * Handles profile editing and password change
 * =====================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    initComponents();
    initProfilePicture();
    initPasswordToggles();
    initProfileForm();
    initPasswordForm();
    loadUserData();
});

/**
 * Initialize sidebar and topbar components
 */
function initComponents() {
    if (typeof Components !== 'undefined') {
        Components.injectSidebar('sidebarContainer', 'profile', 'client');
        Components.injectTopbar('topbarContainer');
        Components.injectFooter('footerContainer');
    }
}

/**
 * Load user data from localStorage
 */
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Set name fields
    if (user.firstName) {
        document.getElementById('firstName').value = user.firstName;
    }
    if (user.lastName) {
        document.getElementById('lastName').value = user.lastName;
    }
    if (user.email) {
        document.getElementById('email').value = user.email;
    }
    if (user.phone) {
        document.getElementById('phone').value = user.phone;
    }
    
    // Set profile initial
    const initial = (user.firstName || user.name || 'U').charAt(0).toUpperCase();
    document.getElementById('profileInitial').textContent = initial;
    
    // Load profile picture if exists
    if (user.profilePicture) {
        const img = document.getElementById('profileImage');
        const initialEl = document.getElementById('profileInitial');
        img.src = user.profilePicture;
        img.style.display = 'block';
        initialEl.style.display = 'none';
    }
}

/**
 * Initialize profile picture upload
 */
function initProfilePicture() {
    const editBtn = document.getElementById('editPictureBtn');
    const fileInput = document.getElementById('profilePictureInput');
    const profilePicture = document.getElementById('profilePicture');

    if (!editBtn || !fileInput) return;

    // Click to upload
    editBtn.addEventListener('click', () => fileInput.click());
    profilePicture.addEventListener('click', () => fileInput.click());

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('Image size must be less than 2MB', 'error');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select an image file', 'error');
            return;
        }

        // Read and display
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById('profileImage');
            const initial = document.getElementById('profileInitial');
            
            img.src = e.target.result;
            img.style.display = 'block';
            initial.style.display = 'none';

            // Save to localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.profilePicture = e.target.result;
            localStorage.setItem('user', JSON.stringify(user));

            showNotification('Profile picture updated!', 'success');
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Initialize password visibility toggles
 */
function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.dataset.target;
            const input = document.getElementById(targetId);
            const eyeOpen = toggle.querySelector('.eye-open');
            const eyeClosed = toggle.querySelector('.eye-closed');

            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        });
    });
}

/**
 * Initialize profile form submission
 */
function initProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();

        if (!firstName || !lastName) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Show loading state
        const btn = document.getElementById('saveProfileBtn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Saving...
        `;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Save to localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.firstName = firstName;
        user.lastName = lastName;
        user.name = `${firstName} ${lastName}`;
        localStorage.setItem('user', JSON.stringify(user));

        // Update initial
        document.getElementById('profileInitial').textContent = firstName.charAt(0).toUpperCase();

        // Reset button
        btn.disabled = false;
        btn.innerHTML = originalText;

        showNotification('Profile updated successfully!', 'success');
    });
}

/**
 * Initialize password form submission
 */
function initPasswordForm() {
    const form = document.getElementById('passwordForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('Please fill in all password fields', 'error');
            return;
        }

        if (newPassword.length < 8) {
            showNotification('New password must be at least 8 characters', 'error');
            return;
        }

        if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            showNotification('Password must contain letters and numbers', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        // Show loading state
        const btn = document.getElementById('updatePasswordBtn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Updating...
        `;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Reset button and form
        btn.disabled = false;
        btn.innerHTML = originalText;
        form.reset();

        showNotification('Password updated successfully!', 'success');
    });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 14px 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
