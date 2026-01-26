import { useState, useEffect } from 'react'
import DataTable from '../DataTable'
import { useLoadWithLoader } from '../../hooks/useAnimation'
import { rentalsService } from '../../services/api'
import styles from '../shared.module.css'

const COLUMNS = [
  { key: 'id', label: 'ID', width: '50px' },
  { key: 'user', label: 'Customer', width: '130px' },
  { key: 'date', label: 'Date', width: '110px' },
  { key: 'hours', label: 'Hours', width: '70px' },
  { key: 'total', label: 'Total', width: '100px' },
  { key: 'status', label: 'Status', width: '90px' },
  { key: 'created', label: 'Created', width: '120px' },
  { key: 'actions', label: 'Actions', width: '80px' },
]

export default function RentalsTab() {
  const [rentals, setRentals] = useState([])
  const { loading, error, loadWithLoader } = useLoadWithLoader()

  useEffect(() => {
    loadWithLoader(rentalsService.getAll())
      .then(setRentals)
      .catch(() => {})
  }, [])

  const getStatusClass = (status) => {
    const statusMap = {
      active: styles.statusActive,
      completed: styles.statusCompleted,
      pending: styles.statusPending,
      cancelled: styles.statusCancelled,
    }
    return `${styles.status} ${statusMap[status?.toLowerCase()] || ''}`
  }

  const renderRow = (rental) => (
    <tr key={rental.id}>
      <td>{rental.id}</td>
      <td>{rental.user}</td>
      <td>{rental.date}</td>
      <td>{rental.hours}h</td>
      <td>{rental.total}</td>
      <td><span className={getStatusClass(rental.status)}>{rental.status}</span></td>
      <td>{rental.created}</td>
      <td><button className={`${styles.btn} ${styles.btnSm}`}>View</button></td>
    </tr>
  )

  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Rental Management</h3>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>+ New Rental</button>
        </div>
        <div className={styles.cardBody}>
          <DataTable 
            columns={COLUMNS}
            data={rentals}
            loading={loading}
            error={error}
            renderRow={renderRow}
          />
        </div>
      </div>
    </div>
  )
}
