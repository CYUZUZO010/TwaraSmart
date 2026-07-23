import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { Plus, Trash2, Sparkles, Route as RouteIcon } from 'lucide-react'
import BackButton from '../components/shared/BackButton'

import api from '../api/axios'

const KIGALI_CENTER = [-1.9441, 30.0619]

function numberedIcon(n) {
  return L.divIcon({
    className: '',
    html: `<div style="width:22px;height:22px;border-radius:4px;background:#2B4C8C;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid #fff;box-shadow:0 0 0 1px #2B4C8C;">${n}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

const EMPTY_STOP = { name: '', lat: '', lng: '' }

export default function RoutePlanning() {
  const [stops, setStops] = useState([{ ...EMPTY_STOP }, { ...EMPTY_STOP }])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateStop = (index, field, value) => {
    setStops((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  const addStop = () => setStops((prev) => [...prev, { ...EMPTY_STOP }])
  const removeStop = (index) => setStops((prev) => prev.filter((_, i) => i !== index))

  const optimize = async () => {
    setError(null)
    const parsed = stops.map((s) => ({ name: s.name.trim() || 'Stop', lat: Number(s.lat), lng: Number(s.lng) }))
    if (parsed.some((s) => Number.isNaN(s.lat) || Number.isNaN(s.lng))) {
      setError('Every stop needs a valid latitude and longitude.')
      return
    }
    if (parsed.length < 2) {
      setError('Add at least two stops to plan a route.')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/routes/optimize', { stops: parsed })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not optimize this route.')
    } finally {
      setLoading(false)
    }
  }

  const routePositions = result ? result.optimizedOrder.map((s) => [s.lat, s.lng]) : []
  const mapCenter = routePositions.length > 0 ? routePositions[0] : KIGALI_CENTER

  return (
    <div>
      <BackButton />
      <div className="mb-5">
        <h1 className="text-display">Route Planning</h1>
        <p className="text-muted mt-1">AI-optimized stop ordering — enter delivery stops and get the shortest visiting order.</p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="panel panel-padded">
          <h2 className="text-heading mb-4">Delivery stops</h2>
          <div className="flex-col gap-3">
            {stops.map((stop, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-muted text-mono-num" style={{ width: 18, fontSize: 12 }}>{i + 1}</span>
                <input className="input" placeholder="Stop name" value={stop.name} onChange={(e) => updateStop(i, 'name', e.target.value)} style={{ flex: 2 }} />
                <input className="input" type="number" step="0.0001" placeholder="lat" value={stop.lat} onChange={(e) => updateStop(i, 'lat', e.target.value)} style={{ flex: 1 }} />
                <input className="input" type="number" step="0.0001" placeholder="lng" value={stop.lng} onChange={(e) => updateStop(i, 'lng', e.target.value)} style={{ flex: 1 }} />
                {stops.length > 2 && (
                  <button className="btn btn-danger-text btn-sm" style={{ padding: 6 }} onClick={() => removeStop(i)}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="btn btn-secondary btn-sm mt-3" onClick={addStop}>
            <Plus size={14} /> Add stop
          </button>

          {error && (
            <div className="mt-3" style={{ background: 'var(--color-negative-tint)', color: 'var(--color-negative)', padding: '10px 12px', borderRadius: 4, fontSize: 13 }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary btn-block mt-4" onClick={optimize} disabled={loading}>
            <Sparkles size={15} /> {loading ? 'Optimizing…' : 'Optimize route'}
          </button>
        </div>

        <div className="panel" style={{ overflow: 'hidden' }}>
          <div style={{ height: 360 }}>
            <MapContainer center={mapCenter} zoom={routePositions.length > 0 ? 12 : 11} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {result?.optimizedOrder.map((s, i) => (
                <Marker key={i} position={[s.lat, s.lng]} icon={numberedIcon(i + 1)}>
                  <Popup>{s.name}</Popup>
                </Marker>
              ))}
              {routePositions.length > 1 && <Polyline positions={routePositions} pathOptions={{ color: '#2B4C8C', weight: 3 }} />}
            </MapContainer>
          </div>

          {result && (
            <div className="panel-padded" style={{ borderTop: '1px solid var(--color-border)' }}>
              <div className="grid-3">
                <div>
                  <div className="text-label">Optimized distance</div>
                  <div className="text-mono-num" style={{ fontSize: 18, fontWeight: 800 }}>{result.optimizedDistanceKm} km</div>
                </div>
                <div>
                  <div className="text-label">Unoptimized distance</div>
                  <div className="text-mono-num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-muted)' }}>{result.naiveDistanceKm} km</div>
                </div>
                <div>
                  <div className="text-label">Distance saved</div>
                  <div className="text-mono-num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-positive)' }}>{result.distanceSavedKm} km</div>
                </div>
              </div>
            </div>
          )}

          {!result && (
            <div className="panel-padded text-muted" style={{ borderTop: '1px solid var(--color-border)', fontSize: 13 }}>
              <RouteIcon size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
              Enter stops and optimize to see the suggested route here.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
