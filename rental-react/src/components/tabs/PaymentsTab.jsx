import { useState, useEffect } from 'react'
import DataTable from '../DataTable'
import { useLoadWithLoader } from '../../hooks/useAnimation'
import { paymentsService } from '../../services/api'
import styles from '../shared.module.css'

const COLUMNS = [
  { key: 'id', label: 'ID', width: '50px' },
  { key: 'rental', label: 'Rental', width: '90px' },
  { key: 'customer', label: 'Customer', width: '130px' },
  { key: 'amount', label: 'Amount', width: '100px' },
  { key: 'method', label: 'Method', width: '100px' },
  { key: 'status', label: 'Status', width: '90px' },
  { key: 'date', label: 'Date', width: '120px' },
  { key: 'actions', label: 'Actions', width: '80px' },
]

export default function PaymentsTab() {
  const [payments, setPayments] = useState([])
  const { loading, error, loadWithLoader } = useLoadWithLoader()

  useEffect(() => {
    loadWithLoader(paymentsService.getAll())
      .then(setPayments)
      .catch(() => {})
  }, [])

  const getStatusClass = (status) => {
    const statusMap = {
      paid: styles.statusActive,
      pending: styles.statusPending,
      failed: styles.statusInactive,
    }
    return `${styles.status} ${statusMap[status?.toLowerCase()] || ''}`
  }

  const renderRow = (payment) => (
    <tr key={payment.id}>
      <td>{payment.id}</td>
      <td>{payment.rental}</td>
      <td>{payment.customer}</td>
      <td>{payment.amount}</td>
      <td>{payment.method}</td>
      <td><span className={getStatusClass(payment.status)}>{payment.status}</span></td>
      <td>{payment.date}</td>
      <td><button className={`${styles.btn} ${styles.btnSm}`}>View</button></td>
    </tr>
  )

  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Payment History</h3>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>+ Record Payment</button>
        </div>
        <div className={styles.cardBody}>
          <DataTable 
            columns={COLUMNS}
            data={payments}
            loading={loading}
            error={error}
            renderRow={renderRow}
          />
        </div>
      </div>
    </div>
  )
}
