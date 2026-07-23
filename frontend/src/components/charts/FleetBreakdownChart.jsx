const STATUS_LABEL = { ACTIVE: 'Active', MAINTENANCE: 'Maintenance', IDLE: 'Idle' }
const STATUS_COLOR = { ACTIVE: 'var(--color-positive)', MAINTENANCE: 'var(--color-negative)', IDLE: 'var(--color-text-faint)' }

export default function FleetBreakdownChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0)

  if (total === 0) {
    return <div className="text-muted" style={{ padding: '32px 0', textAlign: 'center', fontSize: 13 }}>No vehicles registered yet.</div>
  }

  return (
    <div className="flex-col gap-4">
      {data.map((row) => {
        const pct = total > 0 ? Math.round((row.count / total) * 100) : 0
        return (
          <div key={row.status}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span style={{ width: 8, height: 8, borderRadius: 2, background: STATUS_COLOR[row.status] }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{STATUS_LABEL[row.status]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-mono-num" style={{ fontSize: 13, fontWeight: 700 }}>{row.count}</span>
                <span className="text-muted text-mono-num" style={{ fontSize: 12, width: 34, textAlign: 'right' }}>{pct}%</span>
              </div>
            </div>
            <div style={{ height: 6, background: 'var(--color-surface-sunken)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: STATUS_COLOR[row.status], borderRadius: 2 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
