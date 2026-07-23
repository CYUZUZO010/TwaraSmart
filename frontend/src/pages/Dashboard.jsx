import { useEffect, useState } from 'react'
import { PackageX } from 'lucide-react'
import api from '../api/axios'
import BackButton from '../components/shared/BackButton'
import StatCard from '../components/shared/StatCard'
import DeliveryTrendChart from '../components/charts/DeliveryTrendChart'
import FleetBreakdownChart from '../components/charts/FleetBreakdownChart'
import EmptyState from '../components/shared/EmptyState'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    api.get('/analytics/dashboard')
      .then(({ data }) => { if (!cancelled) setSummary(data) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <div>
      <BackButton />
      <div className="mb-5">
        <h1 className="text-display">Dashboard</h1>
        <p className="text-muted mt-1">Your fleet, deliveries, and warehouses at a glance.</p>
      </div>

      {loading || !summary ? (
        <div className="text-muted" style={{ padding: 40 }}>Loading…</div>
      ) : (
        <>
          <div className="grid-4 mb-5">
            <StatCard label="Active vehicles" value={`${summary.activeVehicles} / ${summary.totalVehicles}`} />
            <StatCard label="In-transit deliveries" value={summary.inTransitShipments} />
            <StatCard label="On-time rate" value={`${summary.onTimeDeliveryRate}%`}
              tone={summary.onTimeDeliveryRate >= 80 ? 'positive' : summary.onTimeDeliveryRate > 0 ? 'negative' : 'neutral'} />
            <StatCard label="Avg fuel efficiency" value={summary.avgFuelEfficiency > 0 ? `${summary.avgFuelEfficiency} km/L` : '—'} />
          </div>

          <div className="grid-2 mb-5">
            <div className="panel panel-padded">
              <h2 className="text-heading mb-4">Deliveries — last 7 days</h2>
              <DeliveryTrendChart data={summary.deliveryTrend} />
            </div>
            <div className="panel panel-padded">
              <h2 className="text-heading mb-4">Fleet status breakdown</h2>
              <FleetBreakdownChart data={summary.fleetBreakdown} />
            </div>
          </div>

          <div className="panel panel-padded">
            <h2 className="text-heading mb-4">Low-stock inventory</h2>
            {summary.lowStockItems.length === 0 ? (
              <EmptyState
                icon={PackageX}
                title="Nothing running low"
                description="All inventory items are above their reorder threshold."
              />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Item</th>
                    <th>Warehouse</th>
                    <th style={{ textAlign: 'right' }}>Quantity</th>
                    <th style={{ textAlign: 'right' }}>Reorder at</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.lowStockItems.map((item) => (
                    <tr key={item.id}>
                      <td className="text-muted">{item.sku}</td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td className="text-muted">{item.warehouseName}</td>
                      <td className="text-mono-num" style={{ textAlign: 'right', color: 'var(--color-negative)', fontWeight: 700 }}>{item.quantity}</td>
                      <td className="text-mono-num text-muted" style={{ textAlign: 'right' }}>{item.reorderThreshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
