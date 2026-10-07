import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import api from '../api.js'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, groupedByStore } = useCart()
  const { formatPrice, isDeliverable, city: defaultCity, pincode: defaultPincode } = useCurrency()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const [checkoutStep, setCheckoutStep] = useState(1) // 1: Cart Review, 2: Address & Pincode, 3: Payment
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || 'Shivashankar',
    phone: user?.phone || '+91 98490 12345',
    street: 'Flat 402, Cyber Heights, Road No. 36, Jubilee Hills',
    city: defaultCity || 'Hyderabad',
    state: 'Telangana',
    pincode: defaultPincode || '500033',
    landmark: 'Near Cyber Towers',
  })

  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const serviceable = isDeliverable(addressForm.city, addressForm.pincode)

  const updateAddr = (k) => (e) => setAddressForm({ ...addressForm, [k]: e.target.value })

  async function handlePlaceOrder(e) {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (!serviceable) {
      setError('Please provide a deliverable address within Hyderabad & Cyberabad Metro boundaries.')
      return
    }
    if (cart.length === 0) return

    setSubmitting(true)
    setError('')
    try {
      const fullShippingAddress = `${addressForm.fullName}, ${addressForm.street}, ${addressForm.landmark ? addressForm.landmark + ', ' : ''}${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}`
      const items = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))

      await api.post('/orders', {
        shippingAddress: fullShippingAddress,
        contactPhone: addressForm.phone,
        paymentMethod,
        items,
      })

      clearCart()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="fk-page-wrapper">
        <Navbar />
        <main className="fk-cart-empty-container">
          <div className="fk-empty-cart-card">
            <span className="fk-empty-cart-ico">🛒</span>
            <h2>Your Shopping Cart is Empty</h2>
            <p className="muted">Explore verified merchants and add exciting products to your cart.</p>
            <Link to="/home" className="btn btn-primary btn-lg">
              Shop Now →
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="fk-page-wrapper">
      <Navbar />

      <main className="fk-cart-container">
        {/* Flipkart / Amazon Style Checkout Steps Header */}
        <div className="fk-checkout-progress-bar">
          <div className={`checkout-step-node ${checkoutStep >= 1 ? 'active' : ''}`}>
            <span className="step-circle">{checkoutStep > 1 ? '✓' : '1'}</span>
            <span className="step-label">My Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </div>
          <div className={`progress-line ${checkoutStep >= 2 ? 'active' : ''}`} />
          <div className={`checkout-step-node ${checkoutStep >= 2 ? 'active' : ''}`}>
            <span className="step-circle">{checkoutStep > 2 ? '✓' : '2'}</span>
            <span className="step-label">Delivery Address & Pincode</span>
          </div>
          <div className={`progress-line ${checkoutStep >= 3 ? 'active' : ''}`} />
          <div className={`checkout-step-node ${checkoutStep >= 3 ? 'active' : ''}`}>
            <span className="step-circle">3</span>
            <span className="step-label">Payment & Confirmation</span>
          </div>
        </div>

        <div className="fk-cart-grid">
          {/* Left Column: Multi-Vendor Parcels / Address Form / Payment */}
          <div className="fk-cart-main-col">
            {checkoutStep === 1 && (
              <div className="cart-step-panel">
                <div className="cart-header-row">
                  <h2>Shopping Cart ({cart.length} item{cart.length > 1 ? 's' : ''})</h2>
                  <span className="deliver-to-summary">
                    📍 Delivering to: <strong>{addressForm.city} {addressForm.pincode}</strong>
                  </span>
                </div>

                {groupedByStore.map((group, gIdx) => (
                  <div key={group.storeId || gIdx} className="fk-parcel-card">
                    <div className="fk-parcel-header">
                      <div className="fk-store-dispatch-meta">
                        <span className="parcel-tag">Parcel {gIdx + 1} of {groupedByStore.length}</span>
                        <h4>Dispatched directly from: <strong>{group.storeName}</strong></h4>
                        <span className="store-dist-badge">📍 {group.distanceKm} km away</span>
                      </div>
                      <Link to={`/store/${group.storeId}`} className="fk-view-store">
                        View Store Catalog →
                      </Link>
                    </div>

                    <div className="fk-parcel-items">
                      {group.items.map((item) => (
                        <div key={item.product.id} className="fk-cart-item-row">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="fk-item-thumb"
                          />

                          <div className="fk-item-details">
                            <h3 className="fk-item-name">{item.product.name}</h3>
                            <span className="fk-item-brand">{item.product.brand || 'ShopSphere'}</span>
                            <div className="fk-item-delivery">
                              <span>🚚 Express Delivery in 3-4 days to Hyderabad</span>
                            </div>
                            <div className="fk-item-price-mobile">
                              {formatPrice(item.product.price * item.quantity)}
                            </div>
                          </div>

                          <div className="fk-item-qty-block">
                            <div className="qty-controls">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="qty-val">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className="fk-remove-link"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              Remove
                            </button>
                          </div>

                          <div className="fk-item-price-desktop">
                            <strong className="final-price">{formatPrice(item.product.price * item.quantity)}</strong>
                            <span className="unit-price">{formatPrice(item.product.price)} each</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="cart-step-actions">
                  <Link to="/home" className="btn btn-outline">
                    ← Continue Shopping
                  </Link>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setCheckoutStep(2)}
                  >
                    Proceed to Delivery Address →
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="cart-step-panel">
                <div className="cart-header-row">
                  <h2>Select Delivery Address & Verify Location</h2>
                  <span className="badge-hyderabad">📍 Hyderabad Metro Zone</span>
                </div>

                {/* Serviceability / Boundary Feedback Banner */}
                {serviceable ? (
                  <div className="fk-serviceable-alert success">
                    <div className="alert-icon">✓</div>
                    <div className="alert-body">
                      <strong>Deliverable Zone Confirmed!</strong>
                      <p>
                        Your address in <strong>{addressForm.city} ({addressForm.pincode})</strong> is within our active delivery zone.
                        Your order will be packed by local stores and delivered within <strong>3-4 days</strong>. Our delivery agent will reach your address safely.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="fk-serviceable-alert warning">
                    <div className="alert-icon">⚠️</div>
                    <div className="alert-body">
                      <strong>Address Outside Active Delivery Boundary</strong>
                      <p>
                        ShopSphere currently delivers exclusively within <strong>Greater Hyderabad & Cyberabad Metro boundaries (Pincodes 500001 - 500099)</strong>.
                        Please enter an address within Hyderabad to confirm your order.
                      </p>
                    </div>
                  </div>
                )}

                <div className="address-form-grid">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Recipient Full Name *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={updateAddr('fullName')}
                        placeholder="e.g. Shivashankar"
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={updateAddr('phone')}
                        placeholder="+91 98490 12345"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Flat, House No., Building, Street Address *</label>
                    <textarea
                      rows={2}
                      required
                      value={addressForm.street}
                      onChange={updateAddr('street')}
                      placeholder="e.g. Flat 402, Cyber Heights, Road No. 36"
                    />
                  </div>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label>City / Zone *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={updateAddr('city')}
                        placeholder="Hyderabad"
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={updateAddr('state')}
                        placeholder="Telangana"
                      />
                    </div>
                    <div className="form-group">
                      <label>PIN Code (Hyderabad 500xxx) *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.pincode}
                        onChange={updateAddr('pincode')}
                        placeholder="500033"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Landmark (Optional)</label>
                    <input
                      type="text"
                      value={addressForm.landmark}
                      onChange={updateAddr('landmark')}
                      placeholder="e.g. Near Cyber Towers / Mindspace IT Park"
                    />
                  </div>
                </div>

                <div className="cart-step-actions">
                  <button className="btn btn-outline" onClick={() => setCheckoutStep(1)}>
                    ← Back to Cart
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    disabled={!serviceable}
                    onClick={() => setCheckoutStep(3)}
                  >
                    Proceed to Payment Method →
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="cart-step-panel">
                <div className="cart-header-row">
                  <h2>Select Payment Option</h2>
                  <span className="order-secure-tag">🔒 100% Secure Checkout</span>
                </div>

                {/* Delivery Address Summary Recap */}
                <div className="selected-address-recap">
                  <div className="recap-header">
                    <strong>Deliver to: {addressForm.fullName}</strong>
                    <button className="change-btn" onClick={() => setCheckoutStep(2)}>Change</button>
                  </div>
                  <p className="recap-text">
                    {addressForm.street}, {addressForm.landmark ? addressForm.landmark + ', ' : ''}{addressForm.city}, {addressForm.state} - {addressForm.pincode}
                  </p>
                  <span className="phone-line">📞 {addressForm.phone}</span>
                </div>

                {/* Payment Options */}
                <div className="payment-options-list">
                  <label className={`payment-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                    />
                    <div className="payment-label-info">
                      <strong>📱 UPI (Google Pay / PhonePe / Paytm / BHIM)</strong>
                      <span className="muted">Instant verified payment with 0% extra fees</span>
                    </div>
                  </label>

                  <label className={`payment-card ${paymentMethod === 'CARD' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                    />
                    <div className="payment-label-info">
                      <strong>💳 Credit / Debit Card (Visa, MasterCard, RuPay)</strong>
                      <span className="muted">Bank offers and EMI available on select cards</span>
                    </div>
                  </label>

                  <label className={`payment-card ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <div className="payment-label-info">
                      <strong>💵 Cash on Delivery (COD)</strong>
                      <span className="muted">Pay safely in cash or digital scan when our delivery partner arrives</span>
                    </div>
                  </label>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <div className="cart-step-actions">
                  <button className="btn btn-outline" onClick={() => setCheckoutStep(2)}>
                    ← Back to Address
                  </button>
                  <button
                    className="btn btn-primary btn-lg place-order-btn"
                    disabled={submitting}
                    onClick={handlePlaceOrder}
                  >
                    {submitting ? 'Confirming Order…' : `Confirm Order (${formatPrice(totalPrice)})`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Flipkart / Amazon Style Price Summary Card */}
          <div className="fk-cart-sidebar-col">
            <div className="fk-price-details-card">
              <h3 className="price-details-title">PRICE DETAILS</h3>
              <hr className="divider" />

              <div className="price-row">
                <span>Price ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="price-row">
                <span>Delivery Charges</span>
                <span className="free-text">FREE</span>
              </div>

              <div className="price-row">
                <span>Packaging & Platform Handling</span>
                <span className="free-text">FREE</span>
              </div>

              <div className="price-row">
                <span>Direct Store Dispatches</span>
                <span>{groupedByStore.length} Parcels</span>
              </div>

              <hr className="divider" />

              <div className="price-total-row">
                <strong>Total Amount Payable</strong>
                <strong className="grand-total">{formatPrice(totalPrice)}</strong>
              </div>

              <div className="savings-highlight-banner">
                <span>✓ You are saving on FREE express local delivery across Hyderabad!</span>
              </div>

              <div className="trust-badges-list">
                <div className="trust-item">
                  <span>🛡️</span>
                  <div>
                    <strong>100% Safe Payments</strong>
                    <p>All major cards, UPI and COD accepted</p>
                  </div>
                </div>
                <div className="trust-item">
                  <span>🚚</span>
                  <div>
                    <strong>Express 3-4 Day Delivery</strong>
                    <p>Direct from verified merchant warehouses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
