import { useState, useEffect } from 'react'
import styles from './WorkInProgress.module.css'

export default function WorkInProgress() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>C</div>
            <span className={styles.logoText}>CertiCode</span>
          </div>
          <h1>Still Working On It...</h1>
          <p>We are crafting something amazing for you!</p>
        </div>

        <div className={styles.timeDisplay}>
          <div className={styles.clock}>🕒</div>
          <div className={styles.time}>{formatTime(currentTime)}</div>
        </div>

        <div className={styles.notes}>
          <h2>Development Notes</h2>
          
          <div className={styles.noteSection}>
            <h3>Current Progress</h3>
            <ul>
              <li className={styles.completed}>React project setup with Vite</li>
              <li className={styles.completed}>Authentication pages with smooth transitions</li>
              <li className={styles.completed}>CSS Modules implementation</li>
              <li className={styles.completed}>Mobile responsive design</li>
              <li className={styles.completed}>URL hash support for deep linking</li>
              <li className={styles.completed}>Show/Hide password toggle with eye icon</li>
            </ul>
          </div>

          <div className={styles.noteSection}>
            <h3>Login and Register Page - TODO Items</h3>
            <ul>
              <li className={styles.pending}>
                <strong>Favicon</strong> - Custom CertiCode favicon for browser tab
              </li>
              <li className={styles.pending}>
                <strong>Left side background image</strong> - Professional karaoke/entertainment image
              </li>
              <li className={styles.pending}>
                <strong>Custom CertiCode logo icon</strong> - Replace placeholder with custom designed logo
              </li>
              <li className={styles.pending}>
                <strong>Real-time Tracking icon</strong> - Custom icon for Real-time Tracking feature
              </li>
              <li className={styles.pending}>
                <strong>Automated Billing icon</strong> - Custom icon for Automated Billing feature
              </li>
            </ul>
          </div>

          <div className={styles.noteSection}>
            <h3>Features Not Yet Implemented</h3>
            <ul>
              <li className={styles.pending}>
                <strong>Forgot Password</strong> - Password reset functionality via email
              </li>
              <li className={styles.pending}>
                <strong>Sign In / Get Started</strong> - Backend authentication with Firebase
              </li>
              <li className={styles.pending}>
                <strong>Facebook Login</strong> - OAuth integration with Facebook
              </li>
              <li className={styles.pending}>
                <strong>Google Login</strong> - OAuth integration with Google
              </li>
              <li className={styles.pending}>
                <strong>Terms of Service</strong> - Legal terms page
              </li>
              <li className={styles.pending}>
                <strong>Privacy Policy</strong> - Privacy policy page
              </li>
            </ul>
          </div>

          <div className={styles.noteSection}>
            <h3>Next Steps</h3>
            <ul>
              <li className={styles.pending}>Dashboard functionality</li>
              <li className={styles.pending}>Firebase backend integration</li>
              <li className={styles.pending}>User management system</li>
              <li className={styles.pending}>Rental tracking features</li>
              <li className={styles.pending}>Payment processing</li>
            </ul>
          </div>

          <div className={styles.noteSection}>
            <h3>Design Assets Needed</h3>
            <ul>
              <li className={styles.pending}>Logo variations (dark/light theme)</li>
              <li className={styles.pending}>Feature icons (32x32, 64x64)</li>
              <li className={styles.pending}>Background images/patterns</li>
              <li className={styles.pending}>Loading animations</li>
            </ul>
          </div>
        </div>

        <div className={styles.actions}>
          <a href="/auth" className={styles.backBtn}>Back to Auth</a>
          <a href="/auth#register" className={styles.testBtn}>Test Register Link</a>
        </div>
      </div>
    </div>
  )
}
