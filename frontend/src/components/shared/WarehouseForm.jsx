import { useState } from 'react'

export default function WarehouseForm({ onSubmit, onCancel, submitting }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [capacityUnits, setCapacityUnits] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !location.trim()) { setError('Name and location are required.'); return }
    try {
      await onSubmit({
        name: name.trim(), location: location.trim(),
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        capacityUnits: capacityUnits ? Number(capacityUnits) : 0,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this warehouse.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-4">
      <div className="field">
        <label>Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Kigali Central Hub" autoFocus />
      </div>
      <div className="field">
        <label>Location</label>
        <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kicukiro, Kigali" />
      </div>
      <div className="grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label>Latitude (optional)</label>
          <input className="input" type="number" step="0.0001" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="-1.9536" />
        </div>
        <div className="field">
          <label>Longitude (optional)</label>
          <input className="input" type="number" step="0.0001" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="30.1044" />
        </div>
      </div>
      <div className="field">
        <label>Capacity (units)</label>
        <input className="input" type="number" min="0" value={capacityUnits} onChange={(e) => setCapacityUnits(e.target.value)} placeholder="5000" />
      </div>
      {error && <div style={{ background: 'var(--color-negative-tint)', color: 'var(--color-negative)', padding: '10px 12px', borderRadius: 4, fontSize: 13 }}>{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  )
}
