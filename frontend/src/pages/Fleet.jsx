import { useEffect, useState, useCallback } from 'react'
import { Plus, Truck, Users, Fuel, Trash2, Pencil, AlertTriangle } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/shared/Modal'
import VehicleForm from '../components/shared/VehicleForm'
import DriverForm from '../components/shared/DriverForm'
import FuelLogForm from '../components/shared/FuelLogForm'
import BackButton from '../components/shared/BackButton'
import EmptyState from '../components/shared/EmptyState'

const VEHICLE_BADGE = { ACTIVE: 'badge-positive', MAINTENANCE: 'badge-negative', IDLE: 'badge-neutral' }
const DRIVER_BADGE = { AVAILABLE: 'badge-positive', ON_DUTY: 'badge-warning', OFF_DUTY: 'badge-neutral' }

export default function Fleet() {
  const [tab, setTab] = useState('vehicles')
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [efficiency, setEfficiency] = useState([])
  const [loading, setLoading] = useState(true)

  const [vehicleModal, setVehicleModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [driverModal, setDriverModal] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [fuelModal, setFuelModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get('/vehicles'),
      api.get('/drivers'),
      api.get('/fuel/efficiency'),
    ]).then(([v, d, f]) => {
      setVehicles(v.data)
      setDrivers(d.data)
      setEfficiency(f.data)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const efficiencyByVehicle = Object.fromEntries(efficiency.map((e) => [e.vehicleId, e]))

  const handleVehicleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (editingVehicle) await api.put(`/vehicles/${editingVehicle.id}`, payload)
      else await api.post('/vehicles', payload)
      setVehicleModal(false)
      load()
    } finally { setSubmitting(false) }
  }

  const handleDriverSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (editingDriver) await api.put(`/drivers/${editingDriver.id}`, payload)
      else await api.post('/drivers', payload)
      setDriverModal(false)
      load()
    } finally { setSubmitting(false) }
  }

  const handleFuelSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await api.post('/fuel/logs', payload)
      setFuelModal(false)
      load()
    } finally { setSubmitting(false) }
  }

  const deleteVehicle = async (id) => { if (confirm('Remove this vehicle?')) { await api.delete(`/vehicles/${id}`); load() } }
  const deleteDriver = async (id) => { if (confirm('Remove this driver?')) { await api.delete(`/drivers/${id}`); load() } }

  return (
    <div>
      <BackButton />
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-display">Fleet</h1>
          <p className="text-muted mt-1">Vehicles, drivers, and fuel efficiency.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => setFuelModal(true)}><Fuel size={15} /> Log fuel</button>
          {tab === 'vehicles'
            ? <button className="btn btn-primary" onClick={() => { setEditingVehicle(null); setVehicleModal(true) }}><Plus size={15} /> Add vehicle</button>
            : <button className="btn btn-primary" onClick={() => { setEditingDriver(null); setDriverModal(true) }}><Plus size={15} /> Add driver</button>}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <TabButton active={tab === 'vehicles'} onClick={() => setTab('vehicles')} icon={Truck} label="Vehicles" />
        <TabButton active={tab === 'drivers'} onClick={() => setTab('drivers')} icon={Users} label="Drivers" />
      </div>

      <div className="panel">
        {loading ? (
          <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
        ) : tab === 'vehicles' ? (
          vehicles.length === 0 ? (
            <EmptyState icon={Truck} title="No vehicles yet" description="Add your first vehicle to start building your fleet." />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Plate</th><th>Type</th><th>Driver</th><th>Status</th><th>Efficiency</th><th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => {
                  const eff = efficiencyByVehicle[v.id]
                  return (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 700 }}>{v.plateNumber}</td>
                      <td className="text-muted">{v.type}</td>
                      <td className="text-muted">{v.driverName || 'Unassigned'}</td>
                      <td><span className={`badge ${VEHICLE_BADGE[v.status]}`}>{v.status}</span></td>
                      <td>
                        {eff ? (
                          <span className="flex items-center gap-1" style={{ color: eff.belowFleetAverage ? 'var(--color-negative)' : 'var(--color-positive)', fontWeight: 700, fontSize: 13 }}>
                            {eff.belowFleetAverage && <AlertTriangle size={13} />}
                            {eff.kmPerLiter} km/L
                          </span>
                        ) : <span className="text-muted">—</span>}
                      </td>
                      <td>
                        <div className="flex gap-1" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-sm" style={{ padding: 6 }} onClick={() => { setEditingVehicle(v); setVehicleModal(true) }}><Pencil size={14} /></button>
                          <button className="btn btn-danger-text btn-sm" style={{ padding: 6 }} onClick={() => deleteVehicle(v.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        ) : (
          drivers.length === 0 ? (
            <EmptyState icon={Users} title="No drivers yet" description="Add your first driver to start assigning vehicles." />
          ) : (
            <table className="table">
              <thead>
                <tr><th>Name</th><th>License</th><th>Phone</th><th>Status</th><th style={{ width: 80 }}></th></tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700 }}>{d.name}</td>
                    <td className="text-muted">{d.licenseNumber}</td>
                    <td className="text-muted">{d.phone || '—'}</td>
                    <td><span className={`badge ${DRIVER_BADGE[d.status]}`}>{d.status.replace('_', ' ')}</span></td>
                    <td>
                      <div className="flex gap-1" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: 6 }} onClick={() => { setEditingDriver(d); setDriverModal(true) }}><Pencil size={14} /></button>
                        <button className="btn btn-danger-text btn-sm" style={{ padding: 6 }} onClick={() => deleteDriver(d.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      {vehicleModal && (
        <Modal title={editingVehicle ? 'Edit vehicle' : 'Add vehicle'} onClose={() => setVehicleModal(false)}>
          <VehicleForm drivers={drivers} initial={editingVehicle} onSubmit={handleVehicleSubmit} onCancel={() => setVehicleModal(false)} submitting={submitting} />
        </Modal>
      )}
      {driverModal && (
        <Modal title={editingDriver ? 'Edit driver' : 'Add driver'} onClose={() => setDriverModal(false)}>
          <DriverForm initial={editingDriver} onSubmit={handleDriverSubmit} onCancel={() => setDriverModal(false)} submitting={submitting} />
        </Modal>
      )}
      {fuelModal && (
        <Modal title="Log fuel purchase" onClose={() => setFuelModal(false)}>
          <FuelLogForm vehicles={vehicles} onSubmit={handleFuelSubmit} onCancel={() => setFuelModal(false)} submitting={submitting} />
        </Modal>
      )}
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className="btn btn-sm"
      style={{
        background: active ? 'var(--color-accent-tint)' : 'var(--color-surface)',
        color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
        border: '1px solid ' + (active ? 'var(--color-accent)' : 'var(--color-border-strong)'),
      }}
    >
      <Icon size={14} /> {label}
    </button>
  )
}
