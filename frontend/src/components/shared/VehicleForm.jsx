import { useState } from 'react'

export default function VehicleForm({ drivers, initial, onSubmit, onCancel, submitting }) {
  const [plateNumber, setPlateNumber] = useState(initial?.plateNumber ?? '')
  const [type, setType] = useState(initial?.type ?? 'VAN')
  const [capacityKg, setCapacityKg] = useState(initial?.capacityKg ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'IDLE')
  const [driverId, setDriverId] = useState(initial?.driverId ?? '')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!plateNumber.trim()) { setError('Enter a plate number.'); return }
    try {
      await onSubmit({
        plateNumber: plateNumber.trim(),
        type,
        capacityKg: capacityKg ? Number(capacityKg) : 0,
        status,
        driverId: driverId ? Number(driverId) : null,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this vehicle.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-4">
      <div className="field">
        <label>Plate number</label>
        <input className="input" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} placeholder="RAB 123 A" autoFocus />
      </div>
      <div className="grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label>Type</label>
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="TRUCK">Truck</option>
            <option value="VAN">Van</option>
            <option value="BIKE">Bike</option>
          </select>
        </div>
        <div className="field">
          <label>Capacity (kg)</label>
          <input className="input" type="number" min="0" value={capacityKg} onChange={(e) => setCapacityKg(e.target.value)} placeholder="1000" />
        </div>
      </div>
      <div className="grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label>Status</label>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">Active</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="IDLE">Idle</option>
          </select>
        </div>
        <div className="field">
          <label>Driver</label>
          <select className="select" value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            <option value="">Unassigned</option>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>
      {error && <div style={{ background: 'var(--color-negative-tint)', color: 'var(--color-negative)', padding: '10px 12px', borderRadius: 4, fontSize: 13 }}>{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  )
}
