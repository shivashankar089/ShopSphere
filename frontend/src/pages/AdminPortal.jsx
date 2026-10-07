import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import api from '../api.js'

export default function AdminPortal() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const { formatPrice } = useCurrency()

  const [overview, setOverview] = useState(null)
  const [pendingSellers, setPendingSellers] = useState([])
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending-sellers') // 'pending-sellers', 'moderation', 'stores'
  const [actionNotice, setActionNotice] = useState('')

  useEffect(() => {
    fetchAdminData()
  }, [])

  async function fetchAdminData() {
    setLoading(true)
    try {
      const [overviewRes, pendingRes, prodRes, storeRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/pending-sellers'),
        api.get('/admin/moderation/products'),
        api.get('/stores'),
      ])
      setOverview(overviewRes.data)
      setPendingSellers(pendingRes.data || [])
      setProducts(prodRes.data || [])
      setStores(storeRes.data || [])
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleApproveSeller(userId) {
    try {
      await api.post(`/admin/approve-seller/${userId}`)
      setActionNotice('✓ Merchant account and store approved successfully!')
      setTimeout(() => setActionNotice(''), 4000)
      fetchAdminData()
    } catch (err) {
      alert('Failed to approve seller.')
    }
  }

  async function handleRejectSeller(userId) {
    const reason = prompt('Enter rejection reason for vendor:', 'Catalog safety non-compliance or incomplete business documentation.')
    if (!reason) return
    try {
      await api.post(`/admin/reject-seller/${userId}`, { reason })
      setActionNotice('Seller application rejected.')
      setTimeout(() => setActionNotice(''), 4000)
      fetchAdminData()
    } catch (err) {
      alert('Failed to reject seller.')
    }
  }

  async function handleModerateProduct(productId, status, notes) {
    try {
      await api.post(`/admin/moderate-product/${productId}`, { status, notes })
      setActionNotice(`Product marked as ${status}.`)
      setTimeout(() => setActionNotice(''), 3000)
      fetchAdminData()
    } catch (err) {
      alert('Failed to update product moderation.')
    }
  }

  if (loading) {
    return (
      <div className="fk-page-wrapper">
        <Navbar />
        <div className="fk-loading-card">
          <div className="spinner" />
          <p>Loading Admin Governance Center…</p>
        </div>
      </div>
    )
  }

  const flaggedProducts = products.filter((p) => p.restrictedItem || p.status === 'PENDING_REVIEW')

  return (
    <div className="fk-page-wrapper">
      <Navbar />

      <main className="fk-main-body">
        <div className="fk-admin-hero">
          <div>
            <span className="admin-badge">🛡️ PLATFORM GOVERNANCE CENTER</span>
            <h2>Administrator Control & Quality Oversight</h2>
            <p className="admin-subhead">
              Review seller onboarding applications, moderate prohibited products, prevent malpractices, and ensure authentic commerce across Hyderabad.
            </p>
          </div>
          <button className="btn btn-outline" onClick={fetchAdminData}>
            🔄 Refresh Data
          </button>
        </div>

        {actionNotice && <div className="action-success-notice">{actionNotice}</div>}

        {/* Stats Grid */}
        <div className="fk-admin-stats">
          <div className="admin-stat-card warning">
            <span className="stat-label">Pending Verification</span>
            <strong className="stat-value">{overview?.pendingSellers || pendingSellers.length}</strong>
            <span className="stat-sub">New merchant queues</span>
          </div>

          <div className="admin-stat-card danger">
            <span className="stat-label">Safety Alerts</span>
            <strong className="stat-value">{overview?.flaggedProducts || 0}</strong>
            <span className="stat-sub">Flagged contraband/drugs</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-label">Active Stores</span>
            <strong className="stat-value">{overview?.totalStores || stores.length}</strong>
            <span className="stat-sub">Verified Hyderabad shops</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-label">Total Catalog</span>
            <strong className="stat-value">{overview?.totalProducts || products.length}</strong>
            <span className="stat-sub">Listed items</span>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="fk-admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'pending-sellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending-sellers')}
          >
            📋 Seller Applications ({pendingSellers.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'moderation' ? 'active' : ''}`}
            onClick={() => setActiveTab('moderation')}
          >
            🔍 Product Safety & Compliance ({flaggedProducts.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            🏪 Platform Stores ({stores.length})
          </button>
        </div>

        {/* Pending Sellers Tab */}
        {activeTab === 'pending-sellers' && (
          <div className="fk-admin-content-panel">
            <div className="panel-header">
              <h3>Merchant Verification Queue</h3>
              <p className="muted">Verify business documents and store address before approving public listings.</p>
            </div>

            {pendingSellers.length === 0 ? (
              <div className="fk-empty-card">
                <h3>No pending seller applications</h3>
                <p className="muted">All registered merchants have been verified and approved.</p>
              </div>
            ) : (
              <div className="pending-sellers-grid">
                {pendingSellers.map((item) => (
                  <div key={item.user.id} className="pending-seller-card">
                    <div className="seller-meta-row">
                      <div className="seller-avatar-large">{item.user.name.charAt(0)}</div>
                      <div>
                        <h4>{item.user.name}</h4>
                        <span className="email-text">{item.user.email}</span>
                      </div>
                    </div>

                    <div className="store-meta-box">
                      <strong>Store: {item.store?.name || 'Store Pending'}</strong>
                      <span>📍 {item.store?.address || 'Address'}, {item.store?.city || 'Hyderabad'}</span>
                      <span>📞 {item.store?.phone || item.user.phone || 'No phone'}</span>
                    </div>

                    <div className="card-actions-row">
                      <button
                        className="btn btn-primary approve-btn"
                        onClick={() => handleApproveSeller(item.user.id)}
                      >
                        ✓ Approve Seller
                      </button>
                      <button
                        className="btn btn-outline reject-btn"
                        onClick={() => handleRejectSeller(item.user.id)}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Safety & Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="fk-admin-content-panel">
            <div className="panel-header">
              <h3>Automated Safety & Anti-Contraband Scanner</h3>
              <p className="muted">Items containing prohibited keywords or unapproved vendors require administrator clearance.</p>
            </div>

            <div className="table-responsive">
              <table className="fk-inventory-table">
                <thead>
                  <tr>
                    <th>Product & Store</th>
                    <th>Safety Status</th>
                    <th>Price</th>
                    <th>Moderation Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className={p.restrictedItem ? 'flagged-row' : ''}>
                      <td className="prod-name-cell">
                        <img src={p.imageUrl} alt={p.name} className="table-thumb" />
                        <div>
                          <strong>{p.name}</strong>
                          <span className="brand-muted">Store: {p.store?.name} (Seller: {p.seller?.name})</span>
                        </div>
                      </td>
                      <td>
                        {p.restrictedItem ? (
                          <span className="flag-pill">⚠️ RESTRICTED/FLAGGED</span>
                        ) : (
                          <span className={`status-pill ${p.status?.toLowerCase()}`}>{p.status}</span>
                        )}
                      </td>
                      <td className="price-cell"><strong>{formatPrice(p.price)}</strong></td>
                      <td>{p.moderationNotes || 'Clean check'}</td>
                      <td>
                        <div className="mod-actions-row">
                          {p.status !== 'APPROVED' || p.restrictedItem ? (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleModerateProduct(p.id, 'APPROVED', 'Approved by administrator')}
                            >
                              Approve
                            </button>
                          ) : null}
                          {p.status !== 'REJECTED' ? (
                            <button
                              className="btn btn-sm btn-outline reject-btn"
                              onClick={() => handleModerateProduct(p.id, 'REJECTED', 'Prohibited item policy')}
                            >
                              Reject
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <div className="fk-admin-content-panel">
            <div className="panel-header">
              <h3>All Platform Stores in Hyderabad</h3>
            </div>
            <div className="stores-grid">
              {stores.map((s) => (
                <div key={s.id} className="store-card">
                  <div className="store-card-body">
                    <h4>{s.name}</h4>
                    <p className="store-desc">{s.description}</p>
                    <div className="store-meta-lines">
                      <span>📍 {s.address}, {s.city} ({s.distanceKm} km)</span>
                      <span>⭐ {s.rating ? s.rating.toFixed(1) : '4.8'} rating</span>
                    </div>
                    <Link to={`/store/${s.id}`} className="btn btn-outline btn-sm btn-block mt-12">
                      View Storefront →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
