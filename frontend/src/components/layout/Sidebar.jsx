import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutGrid, Truck, MapPin, Warehouse as WarehouseIcon, Package, Route, LogOut, Sun, Moon, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/fleet', label: 'Fleet', icon: Truck },
  { to: '/live-tracking', label: 'Live Tracking', icon: MapPin },
  { to: '/warehouse', label: 'Warehouse', icon: WarehouseIcon },
  { to: '/deliveries', label: 'Deliveries', icon: Package },
  { to: '/route-planning', label: 'Route Planning', icon: Route },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = (user?.fullName || '?')
    .split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {/* Hamburger — only visible on small screens (see theme.css) */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
        <Menu size={18} strokeWidth={1.8} />
      </button>

      {/* Backdrop behind the sidebar when open on mobile */}
      <div className={`sidebar-backdrop ${mobileOpen ? 'visible' : ''}`} onClick={closeMobile} />

      <aside className={`app-sidebar ${mobileOpen ? 'sidebar-open' : ''}`} style={styles.sidebar}>
        <div className="flex items-center justify-between" style={{ padding: '4px 8px 22px 8px' }}>
          <div style={styles.brand}>
            <div style={styles.brandMark}>T</div>
            <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em', color: 'var(--sidebar-text)' }}>TwaraSmart</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} style={styles.themeToggle} title="Toggle theme" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={15} strokeWidth={1.8} /> : <Sun size={15} strokeWidth={1.8} />}
            </button>
            {/* Close button — only shown on mobile via CSS */}
            <button className="mobile-close-btn" onClick={closeMobile} style={styles.themeToggle} aria-label="Close menu">
              <X size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <nav style={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMobile}
              style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) })}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.footer}>
          <div style={styles.userRow}>
            <div style={styles.avatar}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={styles.userName}>{user?.fullName}</div>
              <div style={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          <button style={styles.signOutBtn} onClick={logout}>
            <LogOut size={15} strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

const styles = {
  sidebar: {
    width: 236,
    flexShrink: 0,
    background: 'var(--sidebar-bg)',
    borderRight: '1px solid var(--sidebar-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 14px',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 9 },
  brandMark: {
    width: 26, height: 26, borderRadius: 4, background: 'var(--color-accent)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13,
  },
  themeToggle: {
    width: 26, height: 26, borderRadius: 4, border: '1px solid var(--sidebar-border)',
    background: 'var(--sidebar-bg-hover)', color: 'var(--sidebar-text-muted)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  nav: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 4,
    fontSize: 13.5, fontWeight: 600, color: 'var(--sidebar-text-muted)',
  },
  navItemActive: {
    background: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active-text)', fontWeight: 700,
  },
  footer: {
    borderTop: '1px solid var(--sidebar-border)', paddingTop: 14,
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  userRow: { display: 'flex', alignItems: 'center', gap: 9, padding: '0 8px' },
  avatar: {
    width: 30, height: 30, borderRadius: 4, background: 'var(--sidebar-bg-hover)',
    border: '1px solid var(--sidebar-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 800, color: 'var(--sidebar-active-text)', flexShrink: 0,
  },
  userName: {
    fontSize: 13, fontWeight: 700, color: 'var(--sidebar-text)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: 11.5, color: 'var(--sidebar-text-muted)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  signOutBtn: {
    display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'flex-start',
    background: 'transparent', border: 'none', color: 'var(--sidebar-text-muted)',
    padding: '8px 10px', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
}