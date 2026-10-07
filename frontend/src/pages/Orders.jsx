import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import api from '../api.js'

export default function Orders() {
  const { formatPrice } = useCurrency()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    try {
      const res = await api.get('/orders/my-orders')
      setOrders(res.data || [])
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fk-page-wrapper">
      <Navbar />

      <main className="fk-main-body">
        <div className="fk-orders-header-row">
          <div>
            <h2>My Orders & Delivery Tracking</h2>
            <p className="muted">Track parcel dispatches and delivery timelines directly from merchant stores.</p>
          </div>
          <Link to="/home" className="btn btn-outline btn-sm">
            ← Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="fk-loading-card">
            <div className="spinner" />
            <p>Loading your orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="fk-empty-card">
            <span className="empty-ico">📦</span>
            <h3>No Orders Placed Yet</h3>
            <p className="muted">You haven't placed any orders yet. Discover items from verified Hyderabad merchants!</p>
            <Link to="/home" className="btn btn-primary">
              Explore Products →
            </Link>
          </div>
        ) : (
          <div className="fk-orders-list">
            {orders.map((order) => (
              <div key={order.id} className="fk-order-card">
                {/* Order Top Bar */}
                <div className="fk-order-card-top">
                  <div className="fk-order-info-left">
                    <span className="order-id-label">ORDER #{order.id}</span>
                    <span className="order-date-text">
                      Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="fk-order-info-right">
                    <span className="order-total-amount">{formatPrice(order.totalAmount)}</span>
                    <span className="order-pay-pill">{order.paymentMethod}</span>
                    <span className="order-confirmed-pill">✓ {order.status}</span>
                  </div>
                </div>

                {/* Shipping Location Bar */}
                <div className="fk-order-shipping-bar">
                  <span>📍 <strong>Delivering to:</strong> {order.shippingAddress}</span>
                  <span>📞 <strong>Contact:</strong> {order.contactPhone}</span>
                  <span className="delivery-window-badge">⏱ Delivery within 3-4 days</span>
                </div>

                {/* Items and Parcels Breakdown */}
                <div className="fk-order-items-grid">
                  {order.items &&
                    order.items.map((item, idx) => (
                      <div key={item.id || idx} className="fk-order-parcel-item">
                        <img
                          src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'}
                          alt={item.product?.name}
                          className="fk-order-thumb"
                        />

                        <div className="fk-order-item-desc">
                          <h4>{item.product?.name}</h4>
                          <div className="store-dispatch-meta">
                            <span>🏪 Dispatched by: <strong>{item.store?.name || 'Verified Store'}</strong></span>
                            {item.store?.distanceKm && (
                              <span className="dist-tag">📍 {item.store.distanceKm} km</span>
                            )}
                          </div>
                          <span className="item-price-calc">
                            Qty: {item.quantity} × {formatPrice(item.price)} = <strong>{formatPrice(item.quantity * item.price)}</strong>
                          </span>
                        </div>

                        {/* Parcel Progress Tracker */}
                        <div className="fk-parcel-tracker">
                          <span className="tracker-title">Parcel Status</span>
                          <span className="status-pill active">{item.parcelStatus || 'DISPATCH READY'}</span>
                          <div className="tracker-steps">
                            <span className="step-point active" title="Order Confirmed" />
                            <span className="step-bar active" />
                            <span className="step-point active" title="Packed by Store" />
                            <span className="step-bar" />
                            <span className="step-point" title="Out for Delivery" />
                            <span className="step-bar" />
                            <span className="step-point" title="Delivered" />
                          </div>
                          <span className="agent-notice">Our delivery agent will reach you soon</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
