import { useState, useEffect } from 'react'
import DataTable from '../DataTable'
import { useLoadWithLoader } from '../../hooks/useAnimation'
import { usersService } from '../../services/api'
import styles from '../shared.module.css'

const COLUMNS = [
  { key: 'id', label: 'ID', width: '50px' },
  { key: 'name', label: 'Name', width: '140px' },
  { key: 'email', label: 'Email', width: '200px' },
  { key: 'role', label: 'Role', width: '90px' },
  { key: 'status', label: 'Status', width: '90px' },
  { key: 'created', label: 'Created', width: '120px' },
  { key: 'actions', label: 'Actions', width: '80px' },
]

export default function UsersTab() {
  const [users, setUsers] = useState([])
  const { loading, error, loadWithLoader } = useLoadWithLoader()

  useEffect(() => {
    loadWithLoader(usersService.getAll())
      .then(setUsers)
      .catch(() => {})
  }, [])

  const getStatusClass = (status) => {
    const statusMap = {
      active: styles.statusActive,
      inactive: styles.statusInactive,
      pending: styles.statusPending,
    }
    return `${styles.status} ${statusMap[status?.toLowerCase()] || ''}`
  }

  const getBadgeClass = (role) => {
    const badgeMap = {
      admin: styles.badgeAdmin,
      customer: styles.badgeCustomer,
      staff: styles.badgeStaff,
    }
    return `${styles.badge} ${badgeMap[role?.toLowerCase()] || ''}`
  }

  const renderRow = (user) => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td><span className={getBadgeClass(user.role)}>{user.role}</span></td>
      <td><span className={getStatusClass(user.status)}>{user.status}</span></td>
      <td>{user.created}</td>
      <td><button className={`${styles.btn} ${styles.btnSm}`}>Edit</button></td>
    </tr>
  )

  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>User Management</h3>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>+ Add User</button>
        </div>
        <div className={styles.cardBody}>
          <DataTable 
            columns={COLUMNS}
            data={users}
            loading={loading}
            error={error}
            renderRow={renderRow}
          />
        </div>
      </div>
    </div>
  )
}
