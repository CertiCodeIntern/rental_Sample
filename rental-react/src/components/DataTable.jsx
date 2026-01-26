import styles from './DataTable.module.css'

export default function DataTable({ columns, data, loading, error, renderRow, skeletonCount = 3 }) {
  const containerClass = [
    styles.tableContainer,
    loading && styles.loading,
    error && styles.failed
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClass}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            [...Array(skeletonCount)].map((_, i) => (
              <tr key={`skeleton-${i}`} className={styles.skeletonRow} aria-hidden="true">
                {columns.map(col => (
                  <td key={col.key}>
                    <div 
                      className={styles.skeleton} 
                      style={{ width: col.width || '100px', height: '14px' }} 
                    />
                  </td>
                ))}
              </tr>
            ))
          )}
          
          {!loading && !error && data.map((row, index) => renderRow(row, index))}
        </tbody>
      </table>
      
      {!loading && !error && data.length === 0 && (
        <div className={styles.empty}>No data available</div>
      )}
    </div>
  )
}
