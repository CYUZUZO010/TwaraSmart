import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/layout/Sidebar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Fleet from './pages/Fleet'
import LiveTracking from './pages/LiveTracking'
import Warehouse from './pages/Warehouse'
import Deliveries from './pages/Deliveries'
import RoutePlanning from './pages/RoutePlanning'

function ProtectedLayout({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-panel">
        <div className="content">{children}</div>
      </div>
    </div>
  )
}

function PublicOnly({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicOnly><Auth /></PublicOnly>} />
            <Route path="/register" element={<PublicOnly><Auth /></PublicOnly>} />
            <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
            <Route path="/fleet" element={<ProtectedLayout><Fleet /></ProtectedLayout>} />
            <Route path="/live-tracking" element={<ProtectedLayout><LiveTracking /></ProtectedLayout>} />
            <Route path="/warehouse" element={<ProtectedLayout><Warehouse /></ProtectedLayout>} />
            <Route path="/deliveries" element={<ProtectedLayout><Deliveries /></ProtectedLayout>} />
            <Route path="/route-planning" element={<ProtectedLayout><RoutePlanning /></ProtectedLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}