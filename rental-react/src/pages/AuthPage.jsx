import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStaggerEntrance } from '../hooks/useAnimation'
import styles from './AuthPage.module.css'

export default function AuthPage() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('login')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayTab, setDisplayTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const cardRef = useStaggerEntrance()

  // Handle URL hash for deep linking
  useEffect(() => {
    const hash = location.hash
    if (hash === '#register') {
      setActiveTab('register')
      setDisplayTab('register')
    } else if (hash === '#login') {
      setActiveTab('login')
      setDisplayTab('login')
    }
  }, [location.hash])

  // Smooth tab transition handler
  const handleTabChange = (tab) => {
    if (tab === activeTab) return
    setIsTransitioning(true)
    setActiveTab(tab)
    
    // Update URL hash
    window.history.pushState(null, '', `#${tab}`)
    
    // After fade out, switch content and fade in
    setTimeout(() => {
      setDisplayTab(tab)
      setIsTransitioning(false)
    }, 200) // Half of transition duration
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register(email, password, fullName, phone)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authSection}>
      {/* Left Panel - Branding */}
      <div className={styles.authLeft}>
        <div className={styles.authLeftContent}>
          <div className={styles.authLogo}>
            <div className={styles.authLogoIcon}>❝</div>
            <div className={styles.authLogoText}>CertiCode</div>
          </div>
          <h1>Manage Your<br />Videoke Beats.</h1>
          <p>The all-in-one platform for your Videoke rental business. Track equipment, manage bookings, and grow your revenue effortlessly.</p>
          <div className={styles.authFeatures}>
            <div className={styles.authFeature}>
              <div className={styles.authFeatureIcon}>◉</div>
              <span>Real-time Tracking</span>
            </div>
            <div className={styles.authFeature}>
              <div className={styles.authFeatureIcon}>◉</div>
              <span>Automated Billing</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Form */}
      <div className={styles.authRight}>
        {/* Mobile Logo - Only shows when left panel is hidden */}
        <div className={`${styles.mobileLogo} stagger-child`}>
          <div className={styles.mobileLogoIcon}>❝</div>
          <div className={styles.mobileLogoText}>CertiCode</div>
        </div>
        
        <div className={styles.authCard} ref={cardRef}>
          <div className={`${styles.authHeader} stagger-child`}>
            <h2>Welcome Back</h2>
            <p>Please enter your details to access your dashboard.</p>
          </div>
          
          <div className={`${styles.authTabs} stagger-child`}>
            <div 
              className={styles.tabIndicator} 
              style={{ transform: `translateX(${activeTab === 'login' ? '0%' : '100%'})` }}
            />
            <button 
              type="button" 
              className={`${styles.authTab} ${activeTab === 'login' ? styles.active : ''}`}
              onClick={() => handleTabChange('login')}
            >
              Login
            </button>
            <button 
              type="button" 
              className={`${styles.authTab} ${activeTab === 'register' ? styles.active : ''}`}
              onClick={() => handleTabChange('register')}
            >
              Register
            </button>
          </div>
          
          <div className={`${styles.formWrapper} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
          {displayTab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className={`${styles.authFormGroup} stagger-child`}>
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={`${styles.authFormGroup} stagger-child`}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordWrapper}>
                  <input 
                    type={showLoginPassword ? 'text' : 'password'}
                    id="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className={styles.eyeBtn}
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className={`${styles.authRemember} stagger-child`}>
                <label>
                  <input type="checkbox" id="remember-me" />
                  Remember me
                </label>
                <a href="/wip">Forgot password?</a>
              </div>
              <button type="submit" className={`${styles.authBtn} stagger-child`} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In  →'}
              </button>
              
              <div className={`${styles.authDivider} stagger-child`}>
                <span>Or continue with</span>
              </div>
              
              <div className={`${styles.authSocial} stagger-child`}>
                <button type="button" className={`${styles.authSocialBtn} ${styles.facebookBtn}`} onClick={() => navigate('/wip')}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
                <button type="button" className={styles.authSocialBtn} onClick={() => navigate('/wip')}>
                  <svg viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/><path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/></svg>
                  Google
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className={`${styles.formRow} stagger-child`}>
                <div className={styles.authFormGroup}>
                  <label htmlFor="register-fullname">Full Name</label>
                  <input 
                    type="text" 
                    id="register-fullname" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className={styles.authFormGroup}>
                  <label htmlFor="register-phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="register-phone" 
                    placeholder="+63 912 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className={`${styles.authFormGroup} stagger-child`}>
                <label htmlFor="register-email">Email Address</label>
                <input 
                  type="email" 
                  id="register-email" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={`${styles.formRow} stagger-child`}>
                <div className={styles.authFormGroup}>
                  <label htmlFor="register-password">Password</label>
                  <div className={styles.passwordWrapper}>
                    <input 
                      type={showRegisterPassword ? 'text' : 'password'}
                      id="register-password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className={styles.eyeBtn}
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegisterPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className={styles.authFormGroup}>
                  <label htmlFor="register-confirm-password">Confirm Password</label>
                  <div className={styles.passwordWrapper}>
                    <input 
                      type={showRegisterPassword ? 'text' : 'password'}
                      id="register-confirm-password" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className={styles.eyeBtn}
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegisterPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" className={`${styles.authBtn} stagger-child`} disabled={loading}>
                {loading ? 'Creating account...' : 'Get Started  →'}
              </button>
              
              <div className={`${styles.authDivider} stagger-child`}>
                <span>Or continue with</span>
              </div>
              
              <div className={`${styles.authSocial} stagger-child`}>
                <button type="button" className={`${styles.authSocialBtn} ${styles.facebookBtn}`} onClick={() => navigate('/wip')}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
                <button type="button" className={styles.authSocialBtn} onClick={() => navigate('/wip')}>
                  <svg viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/><path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/></svg>
                  Google
                </button>
              </div>
            </form>
          )}
          </div>
          
          {error && <div className={`${styles.authMessage} ${styles.error}`}>{error}</div>}
          
          <div className={`${styles.authFooter} stagger-child`}>
            <div className={styles.authFooterIcon}>🔒</div>
            <div className={styles.authFooterText}>
              <span className={styles.authFooterLabel}>Secure sign-in • Your data stays private</span>
              <span className={styles.authFooterLinks}>
                By continuing, you agree to our
                <a href="/wip"> Terms</a> and <a href="/wip">Privacy Policy</a>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
