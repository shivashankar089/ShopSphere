import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="fk-page-wrapper">
      <header className="fk-navbar">
        <div className="fk-nav-container">
          <Link to="/" className="fk-brand">
            <div className="fk-logo-box">
              <span className="fk-logo-s">S</span>
            </div>
            <div className="fk-brand-text">
              <span className="fk-brand-name">ShopSphere</span>
              <span className="fk-brand-tagline">Explore <em>Direct</em></span>
            </div>
          </Link>
          <div className="fk-auth-buttons" style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Create Account</Link>
          </div>
        </div>
      </header>

      <main className="fk-main-body" style={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}>
          <span className="fk-carousel-badge" style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', marginBottom: '16px' }}>
            DIRECT LOCAL COMMERCE PLATFORM
          </span>
          <h1 style={{ fontSize: '46px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: '18px', color: '#0f172a' }}>
            Thousands of products from verified Hyderabad merchants.
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.6, marginBottom: '32px', maxWidth: '640px', margin: '0 auto 32px' }}>
            Experience seamless multi-vendor shopping. Browse stores in Hitec City, Jubilee Hills, and Banjara Hills with split parcels and express 3-4 day delivery.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary btn-lg">
              Explore Marketplace →
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Register as Merchant
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
