import { useState } from 'react'

export default function FuelLogForm({ vehicles, onSubmit, onCancel, submitting }) {
  const [vehicleId, setVehicleId] = useState('')
  const [liters, setLiters] = useState('')
  const [cost, setCost] = useState('')
  const [odometerKm, setOdometerKm] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!vehicleId || !liters || !cost || !odometerKm) { setError('All fields are required.'); return }
    try {
      await onSubmit({ vehicleId: Number(vehicleId), liters: Number(liters), cost: Number(cost), odometerKm: Number(odometerKm) })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not log this fuel entry.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-4">
      <div className="field">
        <label>Vehicle</label>
        <select className="select" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} autoFocus>
          <option value="">Choose a vehicle</option>
          {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plateNumber}</option>)}
        </select>
      </div>
      <div className="grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label>Liters</label>
          <input className="input" type="number" step="0.01" min="0" value={liters} onChange={(e) => setLiters(e.target.value)} />
        </div>
        <div className="field">
          <label>Cost</label>
          <input className="input" type="number" step="0.01" min="0" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>Odometer reading (km)</label>
        <input className="input" type="number" step="0.1" min="0" value={odometerKm} onChange={(e) => setOdometerKm(e.target.value)} />
      </div>
      {error && <div style={{ background: 'var(--color-negative-tint)', color: 'var(--color-negative)', padding: '10px 12px', borderRadius: 4, fontSize: 13 }}>{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>{submitting ? 'Logging…' : 'Log fuel'}</button>
      </div>
    </form>
  )
}
