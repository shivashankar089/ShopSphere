import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'

export default function ProductModal({ product, onClose }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()
  const [qty, setQty] = useState(1)
  const [addedNotice, setAddedNotice] = useState(false)

  if (!product) return null

  function handleAddToCart() {
    addToCart(product, qty)
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 2000)
  }

  function handleBuyNow() {
    addToCart(product, qty)
    onClose()
    navigate('/cart')
  }

  const savings =
    product.originalPrice > product.price
      ? product.originalPrice - product.price
      : null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="product-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          ✕
        </button>

        <div className="modal-grid">
          {/* Left Column: Product Image */}
          <div className="modal-image-col">
            <div className="modal-image-wrap">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="modal-product-img"
              />
            </div>
            <div className="modal-tags">
              {product.tags &&
                product.tags.split(',').map((t, idx) => (
                  <span key={idx} className="tag-pill">
                    #{t.trim()}
                  </span>
                ))}
            </div>
          </div>

          {/* Right Column: Product & Merchant Details */}
          <div className="modal-details-col">
            <div className="modal-brand-row">
              <span className="modal-brand">{product.brand || 'ShopSphere Verified'}</span>
              {product.category && (
                <span className="modal-cat-badge">{product.category.name}</span>
              )}
            </div>

            <h2 className="modal-title">{product.name}</h2>

            <div className="modal-rating-row">
              <span className="stars-badge">★ {product.rating ? product.rating.toFixed(1) : '4.8'}</span>
              <span className="modal-reviews">{product.reviewCount || 68} Verified Ratings</span>
              <span className="stock-status in-stock">✓ In Stock ({product.stock} units available)</span>
            </div>

            <div className="modal-price-card">
              <div className="modal-pricing">
                <span className="current-price">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="modal-orig-price">{formatPrice(product.originalPrice)}</span>
                )}
                {savings && (
                  <span className="modal-savings-tag">Save {formatPrice(savings)}</span>
                )}
              </div>
              <p className="price-inclusive">Inclusive of all local GST and taxes</p>
            </div>

            <div className="modal-desc-box">
              <h4>Product Description</h4>
              <p>{product.description}</p>
            </div>

            {/* Merchant / Store Origin Transparency Card */}
            {product.store && (
              <div className="merchant-transparency-card">
                <div className="merchant-header">
                  <div className="merchant-icon">🏪</div>
                  <div>
                    <h4 className="merchant-name">{product.store.name}</h4>
                    <p className="merchant-address">
                      📍 {product.store.address}, {product.store.city} • <strong className="dist-highlight">{product.store.distanceKm} km away</strong>
                    </p>
                  </div>
                  <span className="verified-badge">✓ Verified Merchant</span>
                </div>

                <div className="merchant-delivery-info">
                  <span className="delivery-icon">🚚</span>
                  <div>
                    <strong>Express 3-4 Day Delivery to Hyderabad</strong>
                    <p className="delivery-sub">Dispatched directly from {product.store.name}'s verified inventory</p>
                  </div>
                </div>

                <Link
                  to={`/store/${product.store.id}`}
                  className="browse-store-btn"
                  onClick={onClose}
                >
                  Browse all items from {product.store.name} →
                </Link>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="modal-action-box">
              <div className="qty-picker">
                <label>Qty:</label>
                <div className="qty-controls">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                  >
                    -
                  </button>
                  <span className="qty-val">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="modal-buttons">
                <button
                  className="btn btn-outline btn-lg modal-add-btn"
                  onClick={handleAddToCart}
                >
                  {addedNotice ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
                <button
                  className="btn btn-primary btn-lg modal-buy-btn"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
