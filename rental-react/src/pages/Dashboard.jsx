import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import UsersTab from '../components/tabs/UsersTab'
import RentalsTab from '../components/tabs/RentalsTab'
import ItemsTab from '../components/tabs/ItemsTab'
import PaymentsTab from '../components/tabs/PaymentsTab'
import styles from './Dashboard.module.css'

const TABS = {
  users: { title: 'Users', component: UsersTab },
  rentals: { title: 'Rentals', component: RentalsTab },
  items: { title: 'Items', component: ItemsTab },
  payments: { title: 'Payments', component: PaymentsTab },
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  const ActiveTabComponent = TABS[activeTab]?.component || UsersTab

  return (
    <div className={styles.appContainer}>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={logout}
      />
      
      <div 
        className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.active : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <main className={styles.mainContent}>
        <Topbar 
          title={TABS[activeTab]?.title || 'Dashboard'}
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        
        <div className={styles.contentArea}>
          <ActiveTabComponent />
        </div>
      </main>
    </div>
  )
}
