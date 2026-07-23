import { useEffect, useState, useCallback } from 'react'
import { Plus, Package, Trash2 } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/shared/Modal'
import ShipmentForm from '../components/shared/ShipmentForm'
import EmptyState from '../components/shared/EmptyState'
import BackButton from '../components/shared/BackButton'

const STATUS_BADGE = { PENDING: 'badge-neutral', IN_TRANSIT: 'badge-warning', DELIVERED: 'badge-positive', DELAYED: 'badge-negative' }
const STATUS_OPTIONS = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'DELAYED']

function formatEta(eta) {
  if (!eta) return '—'
  return new Date(eta).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Deliveries() {
  const [shipments, setShipments] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([api.get('/shipments'), api.get('/vehicles'), api.get('/drivers')])
      .then(([s, v, d]) => { setShipments(s.data); setVehicles(v.data); setDrivers(d.data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try { await api.post('/shipments', payload); setModalOpen(false); load() }
    finally { setSubmitting(false) }
  }

  const updateStatus = async (id, status) => {
    await api.patch(`/shipments/${id}/status`, { status })
    load()
  }

  const deleteShipment = async (id) => { if (confirm('Delete this shipment?')) { await api.delete(`/shipments/${id}`); load() } }

  return (
    <div>
      <BackButton />
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-display">Deliveries</h1>
          <p className="text-muted mt-1">Shipments, ETA prediction, and status tracking.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}><Plus size={15} /> New shipment</button>
      </div>

      <div className="panel">
        {loading ? (
          <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
        ) : shipments.length === 0 ? (
          <EmptyState icon={Package} title="No shipments yet" description="Create your first shipment to start tracking deliveries." />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Route</th><th>Vehicle / Driver</th><th style={{ textAlign: 'right' }}>Distance</th>
                <th>ETA</th><th>Status</th><th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.origin} → {s.destination}</div>
                  </td>
                  <td className="text-muted">{s.vehiclePlate || '—'} {s.driverName ? `· ${s.driverName}` : ''}</td>
                  <td className="text-mono-num text-muted" style={{ textAlign: 'right' }}>{s.distanceKm ? `${s.distanceKm} km` : '—'}</td>
                  <td className="text-muted">{formatEta(s.eta)}</td>
                  <td>
                    <select
                      className="select"
                      style={{ width: 130, padding: '4px 8px', fontSize: 12 }}
                      value={s.status}
                      onChange={(e) => updateStatus(s.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                  <td><button className="btn btn-danger-text btn-sm" style={{ padding: 6 }} onClick={() => deleteShipment(s.id)}><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title="New shipment" onClose={() => setModalOpen(false)} width={520}>
          <ShipmentForm vehicles={vehicles} drivers={drivers} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} submitting={submitting} />
        </Modal>
      )}
    </div>
  )
}
