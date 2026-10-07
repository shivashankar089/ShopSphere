import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import BecomeSellerModal from './BecomeSellerModal.jsx'

export default function Navbar({ searchQuery, setSearchQuery, selectedDistance, setSelectedDistance }) {
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { country, setCountry, city, pincode, currency, setCity, setPincode } = useCurrency()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showSellerModal, setShowSellerModal] = useState(false)

  const [tempCity, setTempCity] = useState(city || 'Hyderabad')
  const [tempPin, setTempPin] = useState(pincode || '500081')

  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (window.location.pathname !== '/home') {
      navigate('/home')
    }
  }

  function handleSaveLocation(e) {
    e.preventDefault()
    setCity(tempCity)
    setPincode(tempPin)
    setShowLocationModal(false)
  }

  const firstName = user?.name ? user.name.split(' ')[0].toUpperCase() : 'ACCOUNT'

  return (
    <>
      <header className="fk-navbar">
        <div className="fk-nav-container">
          {/* Logo & Brand */}
          <Link to="/home" className="fk-brand">
            <div className="fk-logo-box">
              <span className="fk-logo-s">S</span>
            </div>
            <div className="fk-brand-text">
              <span className="fk-brand-name">ShopSphere</span>
              <span className="fk-brand-tagline">Explore <em>Direct</em></span>
            </div>
          </Link>

          {/* Search Bar (Flipkart Style with 🔍 Icon) */}
          <form className="fk-search-form" onSubmit={handleSearchSubmit}>
            <button type="submit" className="fk-search-icon-btn" title="Search">
              <span className="search-symbol">🔍</span>
            </button>
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="fk-search-input"
            />
          </form>

          {/* Location Delivery Selector */}
          <button
            className="fk-loc-badge"
            onClick={() => setShowLocationModal(true)}
            title="Change Delivery Location"
          >
            <span className="loc-pin-icon">📍</span>
            <div className="loc-info">
              <span className="loc-title">Deliver to</span>
              <span className="loc-val">{city} {pincode}</span>
            </div>
          </button>

          {/* Currency / Country Switcher */}
          <div className="fk-currency-toggle">
            <button
              type="button"
              className={`curr-btn ${country === 'India' ? 'active' : ''}`}
              onClick={() => setCountry('India')}
              title="Set Currency to Indian Rupees (₹)"
            >
              ₹ INR
            </button>
            <button
              type="button"
              className={`curr-btn ${country === 'USA' ? 'active' : ''}`}
              onClick={() => setCountry('USA')}
              title="Set Currency to US Dollars ($)"
            >
              $ USD
            </button>
          </div>

          {/* User Account Dropdown (Flipkart style with User's Name ONLY - NO "CUSTOMER" badge) */}
          {user ? (
            <div className="fk-dropdown-wrap">
              <button
                className="fk-account-btn"
                onClick={() => {
                  setShowUserMenu(!showUserMenu)
                  setShowMoreMenu(false)
                }}
                aria-expanded={showUserMenu}
              >
                <span className="user-icon">👤</span>
                <span className="user-name-label">{firstName}</span>
                <span className="arrow-down">▾</span>
              </button>

              {showUserMenu && (
                <div className="fk-dropdown-menu user-menu">
                  <div className="fk-dropdown-header">
                    <strong>{user.name}</strong>
                    <span className="fk-user-email">{user.email}</span>
                  </div>
                  <hr className="fk-menu-divider" />

                  <Link to="/orders" className="fk-menu-item" onClick={() => setShowUserMenu(false)}>
                    <span>📦</span> My Orders
                  </Link>

                  {user.role !== 'SELLER' && (
                    <button
                      className="fk-menu-item highlight-item"
                      onClick={() => {
                        setShowUserMenu(false)
                        setShowSellerModal(true)
                      }}
                    >
                      <span>🏪</span> Become a Seller
                    </button>
                  )}

                  {(user.role === 'SELLER' || user.role === 'ADMIN') && (
                    <Link to="/seller" className="fk-menu-item seller-link" onClick={() => setShowUserMenu(false)}>
                      <span>🏪</span> Seller Merchant Hub
                    </Link>
                  )}

                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="fk-menu-item admin-link" onClick={() => setShowUserMenu(false)}>
                      <span>🛡️</span> Admin Portal
                    </Link>
                  )}

                  <hr className="fk-menu-divider" />

                  <button className="fk-menu-item logout-link" onClick={handleLogout}>
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="fk-auth-buttons">
              <Link to="/login" className="fk-login-btn">Sign In</Link>
            </div>
          )}

          {/* Flipkart Style 'More' Dropdown */}
          <div className="fk-dropdown-wrap">
            <button
              className="fk-more-btn"
              onClick={() => {
                setShowMoreMenu(!showMoreMenu)
                setShowUserMenu(false)
              }}
              aria-expanded={showMoreMenu}
            >
              <span>More</span>
              <span className="arrow-down">▾</span>
            </button>

            {showMoreMenu && (
              <div className="fk-dropdown-menu more-menu">
                <button
                  className="fk-menu-item"
                  onClick={() => {
                    setShowMoreMenu(false)
                    setShowSellerModal(true)
                  }}
                >
                  <span className="menu-ico">🏪</span> Become a Seller
                </button>
                <div className="fk-menu-item">
                  <span className="menu-ico">🔔</span> Notification Settings
                </div>
                <div className="fk-menu-item">
                  <span className="menu-ico">🎧</span> 24x7 Customer Care
                </div>
                <div className="fk-menu-item">
                  <span className="menu-ico">📈</span> Advertise on ShopSphere
                </div>
              </div>
            )}
          </div>

          {/* Flipkart Style Cart Button (with 🛒 Cart icon and Badge) */}
          <Link to="/cart" className="fk-cart-btn" aria-label="Shopping Cart">
            <div className="fk-cart-icon-wrap">
              <span className="fk-cart-emoji">🛒</span>
              {totalItems > 0 && <span className="fk-cart-badge">{totalItems}</span>}
            </div>
            <span className="fk-cart-text">Cart</span>
          </Link>
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="modal-backdrop" onClick={() => setShowLocationModal(false)}>
          <div className="location-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Delivery Location</h3>
              <button className="modal-close-btn" onClick={() => setShowLocationModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveLocation} className="location-edit-form">
              <p className="muted">
                ShopSphere delivers to all zones across Greater Hyderabad & Cyberabad Metro with express 3-4 day delivery.
              </p>

              <div className="form-group">
                <label>City / Zone</label>
                <select
                  value={tempCity}
                  onChange={(e) => setTempCity(e.target.value)}
                  className="location-select"
                >
                  <option value="Hyderabad">Hyderabad (All Zones)</option>
                  <option value="Secunderabad">Secunderabad</option>
                  <option value="Hitec City, Hyderabad">Hitec City / Madhapur</option>
                  <option value="Gachibowli, Hyderabad">Gachibowli / Financial Dist</option>
                  <option value="Banjara Hills, Hyderabad">Banjara Hills / Jubilee Hills</option>
                  <option value="Kukatpally, Hyderabad">Kukatpally / Miyapur</option>
                </select>
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={tempPin}
                  onChange={(e) => setTempPin(e.target.value)}
                  placeholder="500081"
                  required
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-outline" onClick={() => setShowLocationModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Delivery Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Become a Seller Modal */}
      {showSellerModal && (
        <BecomeSellerModal
          onClose={() => setShowSellerModal(false)}
          onSellerRegistered={() => {
            setShowSellerModal(false)
            navigate('/seller')
          }}
        />
      )}
    </>
  )
}
