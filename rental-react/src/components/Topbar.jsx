import styles from './Topbar.module.css'

export default function Topbar({ title, onMenuClick, user }) {
  return (
    <header className={styles.topbar}>
      <button className={styles.menuBtn} onClick={onMenuClick}>
        ☰
      </button>
      
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.actions}>
        <div className={styles.user}>
          <div className={styles.userAvatar}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'User'}</span>
            <span className={styles.userRole}>{user?.role || 'Customer'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
