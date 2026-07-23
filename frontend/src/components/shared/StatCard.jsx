export default function StatCard({ label, value, tone = 'neutral', sublabel }) {
  const toneColor = {
    positive: 'var(--color-positive)',
    negative: 'var(--color-negative)',
    neutral: 'var(--color-text)',
  }[tone]

  return (
    <div className="panel panel-padded">
      <div className="text-label">{label}</div>
      <div className="text-mono-num" style={{ fontSize: 25, fontWeight: 800, marginTop: 8, color: toneColor, letterSpacing: '-0.01em' }}>
        {value}
      </div>
      {sublabel && <div className="text-muted mt-1" style={{ fontSize: 12.5 }}>{sublabel}</div>}
    </div>
  )
}
