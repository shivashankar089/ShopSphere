import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductModal from '../components/ProductModal.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import api from '../api.js'

export default function StoreDetail() {
  const { id } = useParams()
  const { city } = useCurrency()
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchStoreDetails()
  }, [id])

  async function fetchStoreDetails() {
    setLoading(true)
    try {
      const [storeRes, prodRes] = await Promise.all([
        api.get(`/stores/${id}`),
        api.get(`/stores/${id}/products`),
      ])
      setStore(storeRes.data)
      setProducts(prodRes.data || [])
    } catch (err) {
      console.error('Failed to load store profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.tags && p.tags.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  if (loading) {
    return (
      <div className="fk-page-wrapper">
        <Navbar />
        <div className="fk-loading-card">
          <div className="spinner" />
          <p>Loading merchant storefront…</p>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="fk-page-wrapper">
        <Navbar />
        <div className="fk-empty-card">
          <h2>Store Not Found</h2>
          <p className="muted">The requested merchant store could not be found.</p>
          <Link to="/home" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fk-page-wrapper">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="fk-main-body">
        <div className="fk-breadcrumb-row">
          <Link to="/home">Home</Link> <span>/</span> <span>Stores</span> <span>/</span> <strong>{store.name}</strong>
        </div>

        {/* Store Profile Card */}
        <div className="fk-store-hero-card">
          <div className="store-banner-box">
            <img
              src={store.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80'}
              alt={store.name}
              className="store-banner-img"
            />
            <div className="store-dist-float">
              📍 {store.distanceKm} km away in {store.city}
            </div>
          </div>

          <div className="store-meta-box">
            <div className="store-avatar">{store.name.charAt(0)}</div>
            <div className="store-details">
              <div className="store-title-badge-row">
                <h2>{store.name}</h2>
                <span className="verified-badge">✓ Verified Hyderabad Merchant</span>
              </div>
              <p className="store-desc-text">{store.description}</p>
              <div className="store-specs-bar">
                <span>🏢 {store.address}, {store.city}</span>
                <span>⭐ {store.rating ? store.rating.toFixed(1) : '4.8'} rating ({store.reviewCount || 120} reviews)</span>
                <span>📦 {products.length} Products Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Products */}
        <section className="fk-store-products-section">
          <div className="fk-section-header-row">
            <h3>Inventory Catalog from {store.name}</h3>
            <span className="count-label">{filteredProducts.length} items ready for immediate dispatch</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="fk-empty-card">
              <p className="muted">No products found matching your search within this store.</p>
              <button className="btn btn-outline btn-sm" onClick={() => setSearchQuery('')}>
                Clear Search
              </button>
            </div>
          ) : (
            <div className="fk-products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
