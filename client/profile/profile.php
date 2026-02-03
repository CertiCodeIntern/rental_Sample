<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/rental_Sample/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt Profile Settings - Manage your account">
    <title>RentIt - Profile Settings</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="shared/css/theme.css">
    <link rel="stylesheet" href="shared/css/globals.css">
    <link rel="stylesheet" href="client/dashboard/dashboard.css">
    <link rel="stylesheet" href="client/profile/profile.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/rIT_logo_tp.png">
</head>
<body>
    <div class="app-container">
        <!-- Sidebar Container (Injected by JS) -->
        <div id="sidebarContainer"></div>
        
        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar Container (Injected by JS) -->
            <div id="topbarContainer"></div>
            
            <!-- Content Area -->
            <div class="content-area" id="contentArea">
                <!-- Page Header -->
                <div class="page-header-dashboard">
                    <div class="page-header-info">
                        <h1 class="page-title">Profile Settings</h1>
                        <p class="page-subtitle">Manage your account information and security settings</p>
                    </div>
                    <div class="page-header-actions">
                        <a href="client/dashboard/dashboard.php" class="btn-secondary" title="Go back to dashboard">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="19" y1="12" x2="5" y2="12"/>
                                <polyline points="12 19 5 12 12 5"/>
                            </svg>
                            Back to Dashboard
                        </a>
                    </div>
                </div>

                <!-- Profile Settings Container -->
                <div class="profile-settings-container">
                    <!-- Profile Information Card -->
                    <section class="settings-card">
                        <div class="settings-card-header">
                            <div class="settings-card-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="settings-card-title">Profile Information</h2>
                                <p class="settings-card-subtitle">Update your personal details</p>
                            </div>
                        </div>
                        <div class="settings-card-body">
                            <form id="profileForm">
                                <!-- Profile Picture -->
                                <div class="profile-picture-section">
                                    <div class="profile-picture-wrapper">
                                        <div class="profile-picture" id="profilePicture">
                                            <span class="profile-initial" id="profileInitial">U</span>
                                            <img id="profileImage" src="" alt="Profile" style="display: none;">
                                        </div>
                                        <button type="button" class="profile-picture-edit" id="editPictureBtn" title="Change profile picture">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                                <circle cx="12" cy="13" r="4"/>
                                            </svg>
                                        </button>
                                        <input type="file" id="profilePictureInput" accept="image/*" class="hidden-input">
                                    </div>
                                    <div class="profile-picture-info">
                                        <p class="picture-hint">Click to upload a new photo</p>
                                        <p class="picture-format">JPG, PNG or GIF. Max 2MB</p>
                                    </div>
                                </div>

                                <!-- Name Fields -->
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="firstName" class="form-label">First Name</label>
                                        <input type="text" id="firstName" name="firstName" class="form-input" placeholder="Enter your first name" value="Juan">
                                    </div>
                                    <div class="form-group">
                                        <label for="lastName" class="form-label">Last Name</label>
                                        <input type="text" id="lastName" name="lastName" class="form-input" placeholder="Enter your last name" value="Dela Cruz">
                                    </div>
                                </div>

                                <!-- Read-only Fields -->
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="email" class="form-label">
                                            Email Address
                                            <span class="readonly-badge">Cannot be changed</span>
                                        </label>
                                        <input type="email" id="email" name="email" class="form-input readonly" value="juan.delacruz@email.com" readonly disabled>
                                    </div>
                                    <div class="form-group">
                                        <label for="phone" class="form-label">
                                            Phone Number
                                            <span class="readonly-badge">Cannot be changed</span>
                                        </label>
                                        <input type="tel" id="phone" name="phone" class="form-input readonly" value="+63 912 345 6789" readonly disabled>
                                    </div>
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn-primary" id="saveProfileBtn">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                            <polyline points="17 21 17 13 7 13 7 21"/>
                                            <polyline points="7 3 7 8 15 8"/>
                                        </svg>
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <!-- Change Password Card -->
                    <section class="settings-card">
                        <div class="settings-card-header">
                            <div class="settings-card-icon warning">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="settings-card-title">Change Password</h2>
                                <p class="settings-card-subtitle">Update your account password securely</p>
                            </div>
                        </div>
                        <div class="settings-card-body">
                            <form id="passwordForm">
                                <div class="form-group">
                                    <label for="currentPassword" class="form-label">Current Password</label>
                                    <div class="password-input-wrapper">
                                        <input type="password" id="currentPassword" name="currentPassword" class="form-input" placeholder="Enter current password">
                                        <button type="button" class="password-toggle" data-target="currentPassword" title="Show password">
                                            <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                            <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="newPassword" class="form-label">New Password</label>
                                    <div class="password-input-wrapper">
                                        <input type="password" id="newPassword" name="newPassword" class="form-input" placeholder="Enter new password">
                                        <button type="button" class="password-toggle" data-target="newPassword" title="Show password">
                                            <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                            <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <span class="form-hint">Min 8 characters, letters & numbers</span>
                                </div>

                                <div class="form-group">
                                    <label for="confirmPassword" class="form-label">Confirm New Password</label>
                                    <div class="password-input-wrapper">
                                        <input type="password" id="confirmPassword" name="confirmPassword" class="form-input" placeholder="Confirm new password">
                                        <button type="button" class="password-toggle" data-target="confirmPassword" title="Show password">
                                            <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                            <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn-primary" id="updatePasswordBtn">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
            
            <!-- Footer Container (Injected by JS) -->
            <div id="footerContainer"></div>
        </main>
    </div>
    
    <!-- Scripts -->
    <script src="shared/js/components.js"></script>
    <script src="client/profile/profile.js"></script>
</body>
</html>





