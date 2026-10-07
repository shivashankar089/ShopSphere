import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductModal from '../components/ProductModal.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import api from '../api.js'

// Clean category definitions (Flipkart style with clean icons)
const CATEGORY_TABS = [
  { id: null, label: 'For You', icon: '✦' },
  { id: 1, label: 'Electronics', icon: '💻' },
  { id: 3, label: 'Fashion', icon: '👔' },
  { id: 4, label: 'Home & Kitchen', icon: '🏠' },
  { id: 5, label: 'Beauty & Personal Care', icon: '✨' },
  { id: 2, label: 'Groceries & Essentials', icon: '🛍️' },
]

export default function Home() {
  const { city } = useCurrency()
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDistance, setSelectedDistance] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'stores'
  const [currentSlide, setCurrentSlide] = useState(0)

  // Clean professional promotional banners (Flipkart style)
  const promoBanners = [
    {
      id: 1,
      badge: 'TOP OFFERS & DEALS',
      title: 'Mega Electronics & Gadgets Fest',
      subtitle: 'Up to 40% off on Noise-Canceling Audio, Keyboards & Laptops',
      cta: 'Explore Deals',
      category: 1,
      bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
    },
    {
      id: 2,
      badge: 'VERIFIED LOCAL STORES',
      title: 'Direct Dispatch Across Hyderabad',
      subtitle: 'Genuine products sourced from Banjara Hills, Jubilee Hills, and Hitec City',
      cta: 'View Nearby Stores',
      tab: 'stores',
      bgGradient: 'linear-gradient(135deg, #065f46 0%, #0f172a 100%)',
    },
    {
      id: 3,
      badge: 'SELLER ONBOARDING',
      title: 'Grow Your Business on ShopSphere',
      subtitle: 'Join hundreds of merchants in Greater Hyderabad with instant verification',
      cta: 'Become a Seller',
      bgGradient: 'linear-gradient(135deg, #431407 0%, #0f172a 100%)',
    },
  ]

  useEffect(() => {
    fetchInitialData()
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoBanners.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, selectedDistance, searchQuery])

  async function fetchInitialData() {
    setLoading(true)
    try {
      const [catRes, storeRes, prodRes] = await Promise.all([
        api.get('/categories').catch(() => ({ data: [] })),
        api.get('/stores').catch(() => ({ data: [] })),
        api.get('/products').catch(() => ({ data: [] })),
      ])
      setCategories(catRes.data || [])
      setStores(storeRes.data || [])
      setProducts(prodRes.data || [])
    } catch (err) {
      console.error('Failed to load marketplace data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchProducts() {
    try {
      const params = {}
      if (selectedCategory) params.categoryId = selectedCategory
      if (selectedDistance) params.maxDistance = selectedDistance
      if (searchQuery.trim()) params.search = searchQuery.trim()

      const res = await api.get('/products', { params })
      setProducts(res.data || [])
    } catch (err) {
      console.error('Failed to filter products:', err)
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'distance') {
      const distA = a.store?.distanceKm || 99
      const distB = b.store?.distanceKm || 99
      return distA - distB
    }
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <div className="fk-page-wrapper">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDistance={selectedDistance}
        setSelectedDistance={setSelectedDistance}
      />

      {/* Flipkart Style Clean Category Navigation Bar */}
      <nav className="fk-category-nav" aria-label="Product categories">
        <div className="fk-category-container">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.label}
              className={`fk-cat-item ${selectedCategory === tab.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(tab.id)
                setActiveTab('all')
              }}
            >
              <span className="fk-cat-icon">{tab.icon}</span>
              <span className="fk-cat-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="fk-main-body">
        {/* Modern Promotional Hero Carousel Banner */}
        <section className="fk-hero-carousel" style={{ background: promoBanners[currentSlide].bgGradient }}>
          <div className="fk-carousel-content">
            <span className="fk-carousel-badge">{promoBanners[currentSlide].badge}</span>
            <h1 className="fk-carousel-title">{promoBanners[currentSlide].title}</h1>
            <p className="fk-carousel-sub">{promoBanners[currentSlide].subtitle}</p>
            <button
              className="fk-carousel-cta"
              onClick={() => {
                if (promoBanners[currentSlide].tab) {
                  setActiveTab(promoBanners[currentSlide].tab)
                } else if (promoBanners[currentSlide].category) {
                  setSelectedCategory(promoBanners[currentSlide].category)
                }
              }}
            >
              {promoBanners[currentSlide].cta} →
            </button>
          </div>

          <div className="fk-carousel-dots">
            {promoBanners.map((b, idx) => (
              <button
                key={b.id}
                className={`fk-dot ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Content Header & Filter Controls */}
        <div className="fk-section-header-row">
          <div className="fk-view-tabs">
            <button
              className={`fk-view-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Suggested For You ({products.length})
            </button>
            <button
              className={`fk-view-tab ${activeTab === 'stores' ? 'active' : ''}`}
              onClick={() => setActiveTab('stores')}
            >
              Verified Stores in {city} ({stores.length})
            </button>
          </div>

          <div className="fk-sort-container">
            <label htmlFor="fk-sort-select">Sort by:</label>
            <select
              id="fk-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="fk-sort-select"
            >
              <option value="featured">Featured & Best Offers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="distance">Nearest Store</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        {(selectedCategory !== null || searchQuery) && (
          <div className="fk-active-filters">
            <span>Filtered by:</span>
            {selectedCategory !== null && (
              <span className="fk-filter-pill">
                Category: {CATEGORY_TABS.find((c) => c.id === selectedCategory)?.label || 'Custom'}
                <button onClick={() => setSelectedCategory(null)}>✕</button>
              </span>
            )}
            {searchQuery && (
              <span className="fk-filter-pill">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}>✕</button>
              </span>
            )}
            <button
              className="fk-reset-btn"
              onClick={() => {
                setSelectedCategory(null)
                setSearchQuery('')
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Stores Tab View */}
        {activeTab === 'stores' ? (
          <section className="fk-stores-section">
            <div className="fk-sub-header">
              <h2>Verified Hyderabad Merchant Stores</h2>
              <p className="muted">Visit merchant shops to browse their direct warehouse catalog</p>
            </div>
            <div className="stores-grid">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Main Products Grid */}
            <section className="fk-products-section">
              {loading ? (
                <div className="fk-loading-card">
                  <div className="spinner" />
                  <p>Loading verified items from Hyderabad merchant catalog…</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="fk-empty-card">
                  <h3>No items found matching your filter</h3>
                  <p className="muted">Try adjusting your search terms or category selection.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedCategory(null)
                      setSearchQuery('')
                    }}
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                <div className="fk-products-grid">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Verified Merchant Stores Strip at Bottom */}
            <section className="fk-merchant-strip-section">
              <div className="fk-merchant-strip-header">
                <div>
                  <h3>Direct Hyderabad Merchant Stores</h3>
                  <p className="muted">Authorized independent retailers fulfilling split orders</p>
                </div>
                <button className="fk-view-all-link" onClick={() => setActiveTab('stores')}>
                  View all stores ({stores.length}) →
                </button>
              </div>

              <div className="fk-merchant-chips-row">
                {stores.map((store) => (
                  <Link to={`/store/${store.id}`} key={store.id} className="fk-merchant-chip">
                    <div className="chip-dist-badge">📍 {store.distanceKm} km</div>
                    <h4>{store.name}</h4>
                    <p className="chip-meta">★ {store.rating ? store.rating.toFixed(1) : '4.8'} • {store.city}</p>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
