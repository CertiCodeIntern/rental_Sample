<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/rental_Sample/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RentIt - Contact Us. Get in touch with our support team.">
    <title>Contact Us - RentIt</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/rIT_logo_tp.png">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="shared/css/theme.css">
    <link rel="stylesheet" href="shared/css/globals.css">
    <link rel="stylesheet" href="client/dashboard/dashboard.css">
    <link rel="stylesheet" href="client/contactus/contactuslogin.css">
    
    <!-- Page Loader (prevents flash of unstyled content) -->
    <script src="shared/js/page-loader.js"></script>
    
    <!-- Theme Script -->
    <script src="shared/js/theme.js"></script>
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
                        <h1 class="page-title">Contact Us</h1>
                        <p class="page-subtitle">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
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

                <!-- Contact Content -->
                <div class="contact-content-wrapper">
                    <div class="contact-grid">
                        <!-- Contact Form Card -->
                        <section class="contact-form-card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="card-title">Send us a Message</h2>
                                    <p class="card-subtitle">Fill out the form below and we'll get back to you shortly</p>
                                </div>
                            </div>
                            <div class="card-body">
                                <form class="contact-form" id="contactForm">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="fullName" class="form-label">Full Name</label>
                                            <input type="text" id="fullName" name="fullName" class="form-input" placeholder="Enter your full name" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="email" class="form-label">Email Address</label>
                                            <input type="email" id="email" name="email" class="form-input" placeholder="your.email@example.com" required>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="subject" class="form-label">Subject</label>
                                        <select id="subject" name="subject" class="form-select" required>
                                            <option value="">Select a topic</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="rental">Rental Question</option>
                                            <option value="billing">Billing Question</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="complaint">Complaint</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="orderNumber" class="form-label">
                                            Order Number 
                                            <span class="optional-label">(Optional)</span>
                                        </label>
                                        <input type="text" id="orderNumber" name="orderNumber" class="form-input" placeholder="e.g., #VDK-8921">
                                    </div>

                                    <div class="form-group">
                                        <label for="message" class="form-label">Message</label>
                                        <textarea id="message" name="message" class="form-textarea" rows="5" placeholder="Tell us how we can help..." required></textarea>
                                        <span class="form-hint">Please provide as much detail as possible</span>
                                    </div>

                                    <div class="form-actions">
                                        <button type="submit" class="btn-primary btn-submit" id="submitBtn">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                                <line x1="22" y1="2" x2="11" y2="13"/>
                                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                            </svg>
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>

                        <!-- Contact Info Cards -->
                        <div class="contact-info-section">
                            <div class="info-card">
                                <div class="info-icon email-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                                <div class="info-content">
                                    <h3 class="info-title">Email Us</h3>
                                    <p class="info-description">For general inquiries and support</p>
                                    <a href="mailto:support@rentit.ph" class="info-link">support@rentit.ph</a>
                                </div>
                            </div>

                            <div class="info-card">
                                <div class="info-icon phone-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                </div>
                                <div class="info-content">
                                    <h3 class="info-title">Call Us</h3>
                                    <p class="info-description">Mon-Fri from 8am to 5pm</p>
                                    <a href="tel:+639123456789" class="info-link">+63 912 345 6789</a>
                                </div>
                            </div>

                            <div class="info-card">
                                <div class="info-icon location-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                </div>
                                <div class="info-content">
                                    <h3 class="info-title">Visit Us</h3>
                                    <p class="info-description">Come say hello at our office</p>
                                    <address class="info-address">
                                        123 Business Center<br>
                                        Manila, Philippines
                                    </address>
                                </div>
                            </div>

                            <div class="info-card">
                                <div class="info-icon chat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    </svg>
                                </div>
                                <div class="info-content">
                                    <h3 class="info-title">Live Chat</h3>
                                    <p class="info-description">Available 24/7 for premium users</p>
                                    <button class="btn-chat" id="startChatBtn">Start Chat</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- FAQ Section -->
                    <section class="faq-section">
                        <div class="section-header">
                            <h2 class="section-title">Frequently Asked Questions</h2>
                            <p class="section-subtitle">Quick answers to common questions</p>
                        </div>
                        <div class="faq-grid">
                            <article class="faq-card">
                                <div class="faq-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                                    </svg>
                                </div>
                                <h4 class="faq-title">How do I extend my rental?</h4>
                                <p class="faq-answer">You can extend your rental from the "My Rentals" section. Click the "Extend" button on any active rental card.</p>
                            </article>

                            <article class="faq-card">
                                <div class="faq-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                        <line x1="1" y1="10" x2="23" y2="10"/>
                                    </svg>
                                </div>
                                <h4 class="faq-title">What payment methods do you accept?</h4>
                                <p class="faq-answer">We accept all major credit cards, GCash, Maya, and bank transfers for your convenience.</p>
                            </article>

                            <article class="faq-card">
                                <div class="faq-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                                    </svg>
                                </div>
                                <h4 class="faq-title">How does delivery work?</h4>
                                <p class="faq-answer">We offer free delivery within Metro Manila. Our team will deliver and set up the equipment at your location.</p>
                            </article>

                            <article class="faq-card">
                                <div class="faq-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                </div>
                                <h4 class="faq-title">What if something gets damaged?</h4>
                                <p class="faq-answer">Don't worry! Normal wear is covered. For significant damage, our support team will assess and provide fair solutions.</p>
                            </article>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Footer Container (Injected by JS) -->
            <div id="footerContainer"></div>
        </main>
    </div>

    <!-- Success Modal -->
    <div class="modal-overlay" id="successModal">
        <div class="modal-content">
            <div class="modal-icon success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            </div>
            <h3 class="modal-title">Message Sent!</h3>
            <p class="modal-message">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
            <button class="btn-primary btn-modal-close" id="closeModalBtn">Got it!</button>
        </div>
    </div>

    <!-- Components JS -->
    <script src="shared/js/components.js"></script>
    <script src="client/contactus/contactuslogin.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            Components.injectSidebar('sidebarContainer', 'contact', 'client');
            Components.injectTopbar('topbarContainer', 'Contact Us');
            Components.injectFooter('footerContainer');
        });
    </script>
</body>
</html>
