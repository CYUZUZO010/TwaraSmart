import { useState } from 'react'

export default function DriverForm({ initial, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [licenseNumber, setLicenseNumber] = useState(initial?.licenseNumber ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'AVAILABLE')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !licenseNumber.trim()) { setError('Name and license number are required.'); return }
    try {
      await onSubmit({ name: name.trim(), licenseNumber: licenseNumber.trim(), phone: phone || null, status })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this driver.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-4">
      <div className="field">
        <label>Full name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </div>
      <div className="field">
        <label>License number</label>
        <input className="input" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
      </div>
      <div className="field">
        <label>Phone (optional)</label>
        <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="field">
        <label>Status</label>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="AVAILABLE">Available</option>
          <option value="ON_DUTY">On duty</option>
          <option value="OFF_DUTY">Off duty</option>
        </select>
      </div>
      {error && <div style={{ background: 'var(--color-negative-tint)', color: 'var(--color-negative)', padding: '10px 12px', borderRadius: 4, fontSize: 13 }}>{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  )
}
