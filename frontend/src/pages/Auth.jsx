import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext.jsx'
import api from '../api.js'

export default function Auth({ mode }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const { updateLocation } = useCurrency()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    country: 'India',
    city: 'Hyderabad',
    pincode: '500081',
    phone: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  async function submit(e) {
    if (e) e.preventDefault()
    setError('')
    setBusy(true)

    try {
      if (isRegister) {
        // Registering creates a standard customer account first
        const { data } = await api.post('/auth/register', {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          country: form.country,
          city: form.city,
          pincode: form.pincode,
          phone: form.phone,
          role: 'CUSTOMER',
        })

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data))
        updateLocation(data.country || 'India', data.city || 'Hyderabad', data.pincode || '500081')
        navigate('/home')
      } else {
        // Single unified login form for all roles (Customer, Seller, Admin)
        const { data } = await api.post('/auth/login', {
          email: form.email.trim(),
          password: form.password,
        })

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data))
        updateLocation(data.country || 'India', data.city || 'Hyderabad', data.pincode || '500081')

        // Automatically route based on authenticated role
        if (data.role === 'SELLER') {
          navigate('/seller')
        } else if (data.role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/home')
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-split-layout">
      {/* Left Panel - Dark Premium Brand Showcase (Inspired by QueueLess Campus reference) */}
      <div className="auth-hero-panel">
        <div className="auth-hero-content">
          <Link to="/" className="auth-brand-logo">
            <span className="brand-badge-box">S</span>
            <span className="brand-name-light">ShopSphere</span>
          </Link>

          <div className="auth-hero-headings">
            <span className="auth-kicker">NEXT-GEN LOCAL & GLOBAL COMMERCE</span>
            <h1>Less waiting.<br />More doing.</h1>
            <p className="auth-hero-desc">
              Access Hyderabad's verified merchant stores, split multi-vendor cart dispatches, and track real-time delivery timelines to your doorstep.
            </p>
          </div>

          <div className="auth-feature-pills">
            <div className="feature-pill-card">
              <span className="pill-tag">LIVE</span>
              <span className="pill-title">Store Dispatch</span>
            </div>
            <div className="feature-pill-card">
              <span className="pill-tag">VERIFIED</span>
              <span className="pill-title">100% Genuine</span>
            </div>
            <div className="feature-pill-card">
              <span className="pill-tag">FAST</span>
              <span className="pill-title">3-4 Day Delivery</span>
            </div>
          </div>
        </div>

        <div className="auth-hero-footer">
          <span>ShopSphere Commerce Platform © {new Date().getFullYear()}</span>
          <span>Secured with Enterprise Encryption</span>
        </div>
      </div>

      {/* Right Panel - Clean White Minimalist Form */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-card-header">
            <span className="auth-section-tag">ACCOUNT ACCESS</span>
            <h2>{isRegister ? 'Create your account' : 'Welcome back.'}</h2>
            <p className="auth-subtext">
              {isRegister
                ? 'Sign up to shop from nearby stores or register as a merchant.'
                : 'Sign in to continue to ShopSphere.'}
            </p>
          </div>

          <form onSubmit={submit} className="auth-pure-form">
            {isRegister && (
              <>
                <div className="form-group">
                  <label htmlFor="reg-name">Full name</label>
                  <input
                    id="reg-name"
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    required
                    placeholder="e.g. Shivashankar"
                    autoComplete="name"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="reg-country">Country / Citizenship</label>
                    <select
                      id="reg-country"
                      value={form.country}
                      onChange={set('country')}
                    >
                      <option value="India">India (₹ INR)</option>
                      <option value="USA">United States ($ USD)</option>
                      <option value="International">Other / International</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-city">City / Region</label>
                    <input
                      id="reg-city"
                      type="text"
                      value={form.city}
                      onChange={set('city')}
                      required
                      placeholder="e.g. Hyderabad"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="reg-pincode">PIN Code / Postal Code</label>
                    <input
                      id="reg-pincode"
                      type="text"
                      value={form.pincode}
                      onChange={set('pincode')}
                      required
                      placeholder="e.g. 500081"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-phone">Phone Number</label>
                    <input
                      id="reg-phone"
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+91 98490 12345"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="you@shopsphere.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                value={form.password}
                onChange={set('password')}
                minLength={6}
                required
                placeholder="Enter your password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            </div>

            {error && <div className="auth-error-alert">{error}</div>}

            <button type="submit" className="auth-submit-btn" disabled={busy}>
              {busy ? 'Verifying credentials…' : isRegister ? 'Create account →' : 'Sign in →'}
            </button>

            <div className="auth-bottom-switch">
              <span>{isRegister ? 'Already have an account? ' : 'New to ShopSphere? '}</span>
              <Link to={isRegister ? '/login' : '/register'} className="auth-switch-link">
                {isRegister ? 'Sign in' : 'Create an account'}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
