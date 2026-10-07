import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import api from '../api.js'

export default function SellerPortal() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const { formatPrice, currencySymbol } = useCurrency()

  const [storeData, setStoreData] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('inventory') // 'inventory', 'orders', 'profile'
  const [showAddModal, setShowAddModal] = useState(false)

  // Product Form
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: 10,
    imageUrl: '',
    brand: '',
    categoryId: '',
    deliveryTimeEstimate: 'Delivery in 3-4 days across Hyderabad',
    tags: '',
  })
  const [safetyWarning, setSafetyWarning] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Store Profile Form
  const [profileForm, setProfileForm] = useState({
    name: '',
    description: '',
    address: '',
    city: 'Hyderabad',
    distanceKm: 2.3,
    phone: '',
  })
  const [profileSavedNotice, setProfileSavedNotice] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchSellerData()
  }, [])

  async function fetchSellerData() {
    setLoading(true)
    try {
      const [storeRes, prodRes, catRes, orderRes] = await Promise.all([
        api.get('/seller/store'),
        api.get('/seller/products'),
        api.get('/categories').catch(() => ({ data: [] })),
        api.get('/seller/orders').catch(() => ({ data: [] })),
      ])

      setStoreData(storeRes.data)
      setProducts(prodRes.data || [])
      setCategories(catRes.data || [])
      setOrders(orderRes.data || [])

      if (storeRes.data.store) {
        setProfileForm({
          name: storeRes.data.store.name || '',
          description: storeRes.data.store.description || '',
          address: storeRes.data.store.address || '',
          city: storeRes.data.store.city || 'Hyderabad',
          distanceKm: storeRes.data.store.distanceKm || 2.3,
          phone: storeRes.data.store.phone || '',
        })
      }
    } catch (err) {
      console.error('Failed to load seller data:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleProductInputChange(field, value) {
    setProdForm({ ...prodForm, [field]: value })

    // Safety scanner for prohibited drugs, contraband, weapons
    const prohibited = ['drug', 'narcotic', 'weed', 'cannabis', 'opioid', 'contraband', 'weapon', 'prescription pill', 'steroid']
    const text = (value + ' ' + prodForm.name + ' ' + prodForm.description).toLowerCase()
    const detected = prohibited.find((p) => text.includes(p))
    if (detected) {
      setSafetyWarning(`⚠️ Safety Compliance Warning: "${detected}" detected. This item will be flagged for Admin Review before it can be listed.`)
    } else {
      setSafetyWarning('')
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/seller/products', {
        name: prodForm.name,
        description: prodForm.description,
        price: parseFloat(prodForm.price) || 999.0,
        originalPrice: parseFloat(prodForm.originalPrice) || (parseFloat(prodForm.price) * 1.25) || 1299.0,
        stock: parseInt(prodForm.stock) || 10,
        imageUrl: prodForm.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        brand: prodForm.brand || storeData?.store?.name || 'Local Seller',
        categoryId: prodForm.categoryId ? parseInt(prodForm.categoryId) : (categories[0]?.id || 1),
        deliveryTimeEstimate: prodForm.deliveryTimeEstimate || 'Delivery in 3-4 days across Hyderabad',
        tags: prodForm.tags,
      })

      setShowAddModal(false)
      setProdForm({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: 10,
        imageUrl: '',
        brand: '',
        categoryId: '',
        deliveryTimeEstimate: 'Delivery in 3-4 days across Hyderabad',
        tags: '',
      })
      fetchSellerData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Are you sure you want to remove this item from your store inventory?')) return
    try {
      await api.delete(`/seller/products/${id}`)
      setProducts(products.filter((p) => p.id !== id))
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  async function handleUpdateParcelStatus(orderItemId, status) {
    try {
      await api.patch(`/seller/orders/${orderItemId}/status`, { status })
      fetchSellerData()
    } catch (err) {
      alert('Failed to update parcel status')
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    try {
      await api.post('/seller/store', profileForm)
      setProfileSavedNotice(true)
      setTimeout(() => setProfileSavedNotice(false), 3000)
      fetchSellerData()
    } catch (err) {
      alert('Failed to update store profile')
    }
  }

  if (loading) {
    return (
      <div className="fk-page-wrapper">
        <Navbar />
        <div className="fk-loading-card">
          <div className="spinner" />
          <p>Loading seller merchant hub…</p>
        </div>
      </div>
    )
  }

  const isApproved = storeData?.isApproved

  return (
    <div className="fk-page-wrapper">
      <Navbar />

      <main className="fk-main-body">
        <div className="fk-seller-hero">
          <div className="seller-meta-text">
            <span className="seller-hub-badge">🏪 VERIFIED MERCHANT PORTAL</span>
            <h2>Welcome, {user.name}!</h2>
            <p className="seller-subhead">
              Manage your store inventory, list new products, and track customer parcel dispatches across Hyderabad.
            </p>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => setShowAddModal(true)}
          >
            + Add New Product to Store
          </button>
        </div>

        {/* Stats Grid */}
        <div className="fk-seller-stats">
          <div className="stat-card">
            <span className="stat-lbl">Store Name</span>
            <strong className="stat-num">{storeData?.store?.name || 'My Shop'}</strong>
            <span className="stat-desc">📍 {storeData?.store?.city || 'Hyderabad'}</span>
          </div>

          <div className="stat-card">
            <span className="stat-lbl">Total Products</span>
            <strong className="stat-num">{products.length} Items</strong>
            <span className="stat-desc">{products.filter((p) => p.status === 'APPROVED').length} active in catalog</span>
          </div>

          <div className="stat-card">
            <span className="stat-lbl">Customer Orders</span>
            <strong className="stat-num">{orders.length} Parcels</strong>
            <span className="stat-desc">Direct warehouse dispatches</span>
          </div>

          <div className="stat-card">
            <span className="stat-lbl">Compliance Status</span>
            <strong className={`stat-num ${isApproved ? 'text-success' : 'text-warning'}`}>
              {isApproved ? '✓ Verified Merchant' : '⏳ Compliance Review'}
            </strong>
            <span className="stat-desc">Admin anti-malpractice check</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="fk-seller-tabs">
          <button
            className={`seller-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            📦 Store Inventory ({products.length})
          </button>
          <button
            className={`seller-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🚚 Customer Dispatches ({orders.length})
          </button>
          <button
            className={`seller-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            ⚙️ Store Profile & Settings
          </button>
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="fk-seller-content-panel">
            <div className="panel-header">
              <h3>Store Inventory Catalog</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
                + Add Item
              </button>
            </div>

            {products.length === 0 ? (
              <div className="fk-empty-card">
                <h3>No products listed in your inventory yet</h3>
                <p className="muted">Click "Add New Product" to list items for shoppers in Hyderabad.</p>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  Add First Product
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="fk-inventory-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Delivery Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="prod-name-cell">
                          <img src={p.imageUrl} alt={p.name} className="table-thumb" />
                          <div>
                            <strong>{p.name}</strong>
                            <span className="brand-muted">{p.brand}</span>
                          </div>
                        </td>
                        <td>{p.category?.name || 'General'}</td>
                        <td className="price-cell"><strong>{formatPrice(p.price)}</strong></td>
                        <td>
                          <span className={`stock-pill ${p.stock > 0 ? 'in' : 'out'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${p.status?.toLowerCase()}`}>
                            {p.status}
                          </span>
                          {p.restrictedItem && (
                            <span className="flag-pill" title={p.moderationNotes}>⚠️ Flagged Safety</span>
                          )}
                        </td>
                        <td>{p.deliveryTimeEstimate}</td>
                        <td>
                          <button
                            className="btn btn-outline btn-sm delete-btn"
                            onClick={() => handleDeleteProduct(p.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="fk-seller-content-panel">
            <div className="panel-header">
              <h3>Customer Orders & Dispatches</h3>
              <p className="muted">Update parcel fulfillment status for items ordered from your store.</p>
            </div>

            {orders.length === 0 ? (
              <div className="fk-empty-card">
                <h3>No customer orders yet</h3>
                <p className="muted">When customers order items from your catalog, they will appear here.</p>
              </div>
            ) : (
              <div className="fk-seller-orders-list">
                {orders.map((item) => (
                  <div key={item.id} className="seller-order-card">
                    <img src={item.product?.imageUrl} alt={item.product?.name} className="order-thumb" />
                    <div className="order-details">
                      <h4>{item.product?.name}</h4>
                      <p className="muted">
                        Quantity: <strong>{item.quantity}</strong> • Total: <strong>{formatPrice(item.price * item.quantity)}</strong>
                      </p>
                      <span className="current-status">Status: <strong>{item.parcelStatus}</strong></span>
                    </div>

                    <div className="status-action-btns">
                      <span>Update:</span>
                      <button
                        className={`btn btn-sm ${item.parcelStatus === 'PACKED' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleUpdateParcelStatus(item.id, 'PACKED')}
                      >
                        Packed
                      </button>
                      <button
                        className={`btn btn-sm ${item.parcelStatus === 'SHIPPED' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleUpdateParcelStatus(item.id, 'SHIPPED')}
                      >
                        Shipped
                      </button>
                      <button
                        className={`btn btn-sm ${item.parcelStatus === 'DELIVERED' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleUpdateParcelStatus(item.id, 'DELIVERED')}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Store Profile Tab */}
        {activeTab === 'profile' && (
          <div className="fk-seller-content-panel">
            <form onSubmit={handleSaveProfile} className="profile-edit-form">
              <h3>Store Information & Location Settings</h3>
              {profileSavedNotice && <div className="success-banner">✓ Store profile updated successfully!</div>}

              <div className="form-row-2">
                <div className="form-group">
                  <label>Store Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Distance to Metro Hub (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileForm.distanceKm}
                    onChange={(e) => setProfileForm({ ...profileForm, distanceKm: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Store Pickup Street Address</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City / Service Zone</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Store Description</label>
                <textarea
                  rows={3}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Save Store Settings
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="add-product-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Product to Store Catalog</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="add-prod-form">
              {safetyWarning && <div className="safety-warning-box">{safetyWarning}</div>}

              <div className="form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sony Wireless Headphones"
                  value={prodForm.name}
                  onChange={(e) => handleProductInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={prodForm.categoryId}
                    onChange={(e) => handleProductInputChange('categoryId', e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sony, Apple, Nike"
                    value={prodForm.brand}
                    onChange={(e) => handleProductInputChange('brand', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Selling Price (₹ / INR) *</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="999"
                    value={prodForm.price}
                    onChange={(e) => handleProductInputChange('price', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Original MRP (₹ / INR)</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="1499"
                    value={prodForm.originalPrice}
                    onChange={(e) => handleProductInputChange('originalPrice', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => handleProductInputChange('stock', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={prodForm.imageUrl}
                  onChange={(e) => handleProductInputChange('imageUrl', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Estimated Delivery Speed</label>
                <input
                  type="text"
                  placeholder="e.g. Delivery in 3-4 days to Hyderabad"
                  value={prodForm.deliveryTimeEstimate}
                  onChange={(e) => handleProductInputChange('deliveryTimeEstimate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Product Description *</label>
                <textarea
                  rows={3}
                  placeholder="Provide specifications, features, and package contents..."
                  value={prodForm.description}
                  onChange={(e) => handleProductInputChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding to Catalog…' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
