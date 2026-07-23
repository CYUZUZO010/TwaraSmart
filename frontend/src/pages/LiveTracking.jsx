import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { RefreshCw, MapPin } from 'lucide-react'
import api from '../api/axios'
import EmptyState from '../components/shared/EmptyState'
import BackButton from '../components/shared/BackButton'
const KIGALI_CENTER = [-1.9441, 30.0619]

const STATUS_COLOR = { ACTIVE: '#2F7A4F', MAINTENANCE: '#B0433C', IDLE: '#8A8A86' }

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export default function LiveTracking() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    api.get('/vehicles').then(({ data }) => setVehicles(data)).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const located = vehicles.filter((v) => v.currentLat != null && v.currentLng != null)
  const unlocated = vehicles.filter((v) => v.currentLat == null || v.currentLng == null)

  // Demo helper: since there's no live GPS hardware feeding this app, "Simulate GPS ping"
  // nudges each active vehicle's position slightly — exercising the same PATCH endpoint
  // a real telematics device would call.
  const simulate = async () => {
    setSimulating(true)
    try {
      const active = vehicles.filter((v) => v.status === 'ACTIVE')
      await Promise.all(active.map((v) => {
        const baseLat = v.currentLat ?? KIGALI_CENTER[0]
        const baseLng = v.currentLng ?? KIGALI_CENTER[1]
        const lat = baseLat + (Math.random() - 0.5) * 0.01
        const lng = baseLng + (Math.random() - 0.5) * 0.01
        return api.patch(`/vehicles/${v.id}/location`, { lat, lng })
      }))
      load()
    } finally {
      setSimulating(false)
    }
  }

  return (
    <div>
      <BackButton />
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-display">Live Tracking</h1>
          <p className="text-muted mt-1">Real-time vehicle positions across your fleet.</p>
        </div>
        <button className="btn btn-primary" onClick={simulate} disabled={simulating}>
          <RefreshCw size={15} />
          {simulating ? 'Updating…' : 'Simulate GPS ping'}
        </button>
      </div>

      {loading ? (
        <div className="text-muted" style={{ padding: 40 }}>Loading…</div>
      ) : (
        <div className="panel" style={{ overflow: 'hidden' }}>
          <div style={{ height: 520 }}>
            <MapContainer center={KIGALI_CENTER} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {located.map((v) => (
                <Marker key={v.id} position={[v.currentLat, v.currentLng]} icon={makeIcon(STATUS_COLOR[v.status])}>
                  <Popup>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13 }}>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{v.plateNumber}</div>
                      <div style={{ color: 'var(--color-text-muted)' }}>{v.type} · {v.status}</div>
                      {v.driverName && <div style={{ color: 'var(--color-text-muted)' }}>Driver: {v.driverName}</div>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {located.length === 0 && (
            <EmptyState
              icon={MapPin}
              title="No vehicle positions yet"
              description="Click 'Simulate GPS ping' to place your active vehicles on the map, or set positions via the API."
            />
          )}
        </div>
      )}

      {unlocated.length > 0 && (
        <div className="panel panel-padded mt-4">
          <h2 className="text-heading mb-3" style={{ fontSize: 14 }}>Vehicles without a known position</h2>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {unlocated.map((v) => (
              <span key={v.id} className="badge badge-neutral">{v.plateNumber}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
