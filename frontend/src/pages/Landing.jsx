import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Truck, MapPin, Warehouse as WarehouseIcon, Route as RouteIcon,
  Check, Star, LayoutGrid, Package
} from 'lucide-react'
import ThemeToggleButton from '../components/shared/ThemeToggleButton'

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`landing-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const FEATURES = [
  { icon: Truck, title: 'Fleet management', text: 'Register vehicles and drivers, assign them to each other, and track status across your whole fleet.' },
  { icon: MapPin, title: 'Live tracking', text: 'See every active vehicle on a real map, color-coded by status, updated as positions change.' },
  { icon: WarehouseIcon, title: 'Warehouse & inventory', text: 'Track stock per warehouse with automatic low-stock alerts before you run out.' },
  { icon: RouteIcon, title: 'AI route planning', text: 'Enter delivery stops and get an optimized route with distance saved vs. the unoptimized order.' },
]

const PRICING = [
  { name: 'Starter', price: '$0', period: '/forever', features: ['Up to 3 vehicles', 'Live tracking', 'Basic dashboard', '1 warehouse'], cta: 'Get started', highlight: false },
  { name: 'Operations', price: '$29', period: '/month', features: ['Unlimited vehicles', 'AI route planning', 'Fuel optimization', 'Unlimited warehouses'], cta: 'Get started', highlight: true },
  { name: 'Enterprise', price: '$79', period: '/month', features: ['Everything in Operations', 'Multi-team accounts', 'Priority support', 'API access'], cta: 'Get started', highlight: false },
]

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="landing">
      {/* ---------- Nav ---------- */}
      <header className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <div className="landing-brand-mark"><Truck size={13} strokeWidth={2.4} color="#fff" /></div>
            <span>TwaraSmart</span>
          </div>
          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonial">Testimonials</a>
          </nav>
<div className="flex items-center gap-3">
  <ThemeToggleButton />
  <Link to="/login" className="btn btn-primary btn-sm">Get Started</Link>
</div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="landing-hero">
        <div className="landing-hero-glow" />
        <Reveal delay={80}>
          <h1 className="landing-h1">Run your fleet like<br />it's software.</h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="landing-sub">
            TwaraSmart tracks every vehicle, predicts delivery ETAs, flags fuel waste, and
            optimizes routes — so dispatch stops running on spreadsheets and guesswork.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="landing-hero-actions">
            <Link to="/login" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 14 }}>
              Get Started <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: 14 }}>
              See features
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="landing-mockup">
            <div className="landing-mockup-bar">
              <span /> <span /> <span />
            </div>
            <div className="landing-mockup-body">
              <div className="landing-mockup-sidebar">
                <div className="landing-mockup-pill active"><LayoutGrid size={13} /> Dashboard</div>
                <div className="landing-mockup-pill"><Truck size={13} /> Fleet</div>
                <div className="landing-mockup-pill"><Package size={13} /> Deliveries</div>
              </div>
              <div className="landing-mockup-main">
                <div className="landing-mockup-stats">
                  <div className="landing-mockup-stat">
                    <div className="landing-mockup-label">Active vehicles</div>
                    <div className="landing-mockup-value positive">18 / 22</div>
                  </div>
                  <div className="landing-mockup-stat">
                    <div className="landing-mockup-label">In transit</div>
                    <div className="landing-mockup-value">7</div>
                  </div>
                  <div className="landing-mockup-stat">
                    <div className="landing-mockup-label">On-time rate</div>
                    <div className="landing-mockup-value positive">94%</div>
                  </div>
                </div>
                <div className="landing-mockup-chart">
                  <MapPin size={16} color="var(--color-accent)" />
                  <div className="landing-mockup-chart-line" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="landing-section">
        <Reveal><div className="landing-section-head">
          <div className="text-label">Features</div>
          <h2 className="landing-h2">Everything dispatch needs. Nothing it doesn't.</h2>
        </div></Reveal>

        <div className="landing-feature-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <div className="landing-feature-card">
                <div className="landing-feature-icon"><f.icon size={18} strokeWidth={1.8} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section id="pricing" className="landing-section landing-section-sunken">
        <Reveal><div className="landing-section-head">
          <div className="text-label">Pricing</div>
          <h2 className="landing-h2">Simple, transparent pricing. No hidden fees.</h2>
        </div></Reveal>

        <div className="landing-pricing-grid">
          {PRICING.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 100}>
              <div className={`landing-pricing-card ${tier.highlight ? 'highlight' : ''}`}>
                {tier.highlight && <div className="landing-pricing-badge">Most popular</div>}
                <div className="landing-pricing-name">{tier.name}</div>
                <div className="landing-pricing-price">{tier.price}<span>{tier.period}</span></div>
                <ul className="landing-pricing-list">
                  {tier.features.map((f) => (
                    <li key={f}><Check size={14} color="var(--color-positive)" /> {f}</li>
                  ))}
                </ul>
                <Link to="/login" className={`btn ${tier.highlight ? 'btn-primary' : 'btn-secondary'} btn-block`}>
                  {tier.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Testimonial ---------- */}
      <section id="testimonial" className="landing-section">
        <Reveal>
          <div className="landing-testimonial">
            <div className="landing-stars">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="var(--color-warning)" color="var(--color-warning)" />)}
            </div>
            <p>
              "We cut late deliveries by half in the first month. Seeing every truck live on
              one map, instead of ten phone calls, changed how our whole team works."
            </p>
            <div className="landing-testimonial-author">
              <div className="landing-testimonial-avatar">MU</div>
              <div>
                <div className="landing-testimonial-name">Mugisha Uwase</div>
                <div className="landing-testimonial-role">Operations Manager</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="landing-cta">
        <Reveal>
          <h2 className="landing-h2">Ready to see your fleet clearly?</h2>
          <p className="landing-sub" style={{ margin: '10px auto 24px' }}>Free to start. No credit card required.</p>
          <Link to="/login" className="btn btn-primary" style={{ padding: '12px 26px', fontSize: 14 }}>
            Get Started <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="landing-footer">
        <div className="landing-brand">
          <div className="landing-brand-mark"><Truck size={13} strokeWidth={2.4} color="#fff" /></div>
          <span>TwaraSmart</span>
        </div>
        <div className="text-muted" style={{ fontSize: 12.5 }}>© {new Date().getFullYear()} TwaraSmart. All rights reserved.</div>
      </footer>
    </div>
  )
}
