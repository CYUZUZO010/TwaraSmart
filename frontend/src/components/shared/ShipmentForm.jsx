import { useState } from 'react'

export default function ShipmentForm({ vehicles, drivers, onSubmit, onCancel, submitting }) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [originLat, setOriginLat] = useState('')
  const [originLng, setOriginLng] = useState('')
  const [destinationLat, setDestinationLat] = useState('')
  const [destinationLng, setDestinationLng] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [avgSpeedKmh, setAvgSpeedKmh] = useState('40')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!origin.trim() || !destination.trim()) { setError('Origin and destination are required.'); return }
    try {
      await onSubmit({
        origin: origin.trim(), destination: destination.trim(),
        originLat: originLat ? Number(originLat) : null, originLng: originLng ? Number(originLng) : null,
        destinationLat: destinationLat ? Number(destinationLat) : null, destinationLng: destinationLng ? Number(destinationLng) : null,
        vehicleId: vehicleId ? Number(vehicleId) : null, driverId: driverId ? Number(driverId) : null,
        avgSpeedKmh: avgSpeedKmh ? Number(avgSpeedKmh) : 40,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create this shipment.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-4">
      <div className="grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label>Origin</label>
          <input className="input" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Kigali Central Hub" autoFocus />
        </div>
        <div className="field">
          <label>Destination</label>
          <input className="input" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Musanze" />
        </div>
      </div>
      <div className="grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label>Origin lat/lng (optional)</label>
          <div className="flex gap-2">
            <input className="input" type="number" step="0.0001" value={originLat} onChange={(e) => setOriginLat(e.target.value)} placeholder="lat" />
            <input className="input" type="number" step="0.0001" value={originLng} onChange={(e) => setOriginLng(e.target.value)} placeholder="lng" />
          </div>
        </div>
        <div className="field">
          <label>Destination lat/lng (optional)</label>
          <div className="flex gap-2">
            <input className="input" type="number" step="0.0001" value={destinationLat} onChange={(e) => setDestinationLat(e.target.value)} placeholder="lat" />
            <input className="input" type="number" step="0.0001" value={destinationLng} onChange={(e) => setDestinationLng(e.target.value)} placeholder="lng" />
          </div>
        </div>
      </div>
      <div className="grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label>Vehicle</label>
          <select className="select" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            <option value="">Unassigned</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plateNumber}</option>)}
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
      <div className="field">
        <label>Average speed (km/h) — used for ETA prediction</label>
        <input className="input" type="number" min="1" value={avgSpeedKmh} onChange={(e) => setAvgSpeedKmh(e.target.value)} />
      </div>
      {error && <div style={{ background: 'var(--color-negative-tint)', color: 'var(--color-negative)', padding: '10px 12px', borderRadius: 4, fontSize: 13 }}>{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>{submitting ? 'Creating…' : 'Create shipment'}</button>
      </div>
    </form>
  )
}
