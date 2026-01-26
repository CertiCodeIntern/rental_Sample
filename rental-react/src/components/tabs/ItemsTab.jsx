import { useState, useEffect } from 'react'
import DataTable from '../DataTable'
import { useLoadWithLoader } from '../../hooks/useAnimation'
import { itemsService } from '../../services/api'
import styles from '../shared.module.css'

const COLUMNS = [
  { key: 'id', label: 'ID', width: '50px' },
  { key: 'name', label: 'Item Name', width: '150px' },
  { key: 'category', label: 'Category', width: '110px' },
  { key: 'rate', label: 'Hourly Rate', width: '100px' },
  { key: 'status', label: 'Status', width: '100px' },
  { key: 'created', label: 'Created', width: '120px' },
  { key: 'actions', label: 'Actions', width: '80px' },
]

export default function ItemsTab() {
  const [items, setItems] = useState([])
  const { loading, error, loadWithLoader } = useLoadWithLoader()

  useEffect(() => {
    loadWithLoader(itemsService.getAll())
      .then(setItems)
      .catch(() => {})
  }, [])

  const getStatusClass = (status) => {
    const statusMap = {
      available: styles.statusActive,
      rented: styles.statusPending,
      maintenance: styles.statusInactive,
    }
    const key = status?.toLowerCase().replace(' ', '')
    return `${styles.status} ${statusMap[key] || ''}`
  }

  const renderRow = (item) => (
    <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.category}</td>
      <td>{item.rate}</td>
      <td><span className={getStatusClass(item.status)}>{item.status}</span></td>
      <td>{item.created}</td>
      <td><button className={`${styles.btn} ${styles.btnSm}`}>Edit</button></td>
    </tr>
  )

  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Item Inventory</h3>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>+ Add Item</button>
        </div>
        <div className={styles.cardBody}>
          <DataTable 
            columns={COLUMNS}
            data={items}
            loading={loading}
            error={error}
            renderRow={renderRow}
          />
        </div>
      </div>
    </div>
  )
}
