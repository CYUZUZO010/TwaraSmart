import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '10px 12px', fontSize: 12.5 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2" style={{ marginBottom: 2 }}>
          <span style={{ width: 7, height: 7, borderRadius: 2, background: p.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{p.dataKey}:</span>
          <span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function DeliveryTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="0" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" tick={{ fontSize: 11.5, fill: 'var(--color-text-muted)' }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} />
        <YAxis tick={{ fontSize: 11.5, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-sunken)' }} />
        <Bar dataKey="delivered" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
        <Bar dataKey="delayed" fill="var(--chart-4)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
