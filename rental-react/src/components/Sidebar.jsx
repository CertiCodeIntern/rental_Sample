import styles from './Sidebar.module.css'

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose, user, onLogout }) {
  const tabs = [
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'rentals', icon: '📋', label: 'Rentals' },
    { id: 'items', icon: '🎤', label: 'Items' },
    { id: 'payments', icon: '💳', label: 'Payments' },
  ]

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>❝</div>
          <span className={styles.logoText}>CertiCode</span>
        </div>
      </div>
      
      <nav className={styles.nav}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => {
              onTabChange(tab.id)
              onClose()
            }}
          >
            <span className={styles.navIcon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      
      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.userAvatar}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'User'}</span>
            <span className={styles.userRole}>{user?.role || 'Customer'}</span>
          </div>
        </div>
        <button className={styles.logout} onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  )
}
