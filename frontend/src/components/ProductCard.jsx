import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart, cart } = useCart()
  const { formatPrice, currencySymbol } = useCurrency()

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  const cartItem = cart.find((i) => i.product.id === product.id)
  const qtyInCart = cartItem ? cartItem.quantity : 0

  return (
    <article className="fk-product-card">
      {/* Product Image Clickable to Open Detail Modal */}
      <div
        className="fk-image-container"
        onClick={() => onSelectProduct && onSelectProduct(product)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="fk-product-img"
          loading="lazy"
        />
        {discountPercent && (
          <span className="fk-discount-badge">{discountPercent}% OFF</span>
        )}
        <div className="fk-quick-view-overlay">
          <span>Quick View</span>
        </div>
      </div>

      <div className="fk-card-body">
        {/* Brand & Category */}
        <div className="fk-meta-line">
          <span className="fk-brand-tag">{product.brand || 'ShopSphere'}</span>
          {product.store && (
            <Link
              to={`/store/${product.store.id}`}
              className="fk-store-link"
              onClick={(e) => e.stopPropagation()}
              title={`Dispatched by ${product.store.name}`}
            >
              {product.store.name} ({product.store.distanceKm} km)
            </Link>
          )}
        </div>

        {/* Product Title */}
        <h3
          className="fk-card-title"
          onClick={() => onSelectProduct && onSelectProduct(product)}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Rating Badge (Flipkart Green Style) */}
        <div className="fk-rating-row">
          <span className="fk-rating-badge">
            {product.rating ? product.rating.toFixed(1) : '4.8'} ★
          </span>
          <span className="fk-rating-count">({product.reviewCount || 68})</span>
          <span className="fk-assured-tag">✓ Verified Store</span>
        </div>

        {/* Pricing & Offers */}
        <div className="fk-pricing-block">
          <div className="fk-price-main-row">
            <span className="fk-final-price">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="fk-mrp-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="fk-offer-subtext">
            <span className="offer-highlight">{discountPercent ? `${discountPercent}% off` : 'Special deal'}</span>
            <span className="bank-offer">with Bank Offer +</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="fk-delivery-line">
          <span>Delivery in 3-4 days to Hyderabad</span>
        </div>

        {/* Add to Cart Actions */}
        <div className="fk-action-row">
          <button
            type="button"
            className="fk-add-cart-btn"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.stock <= 0 ? 'Out of Stock' : qtyInCart > 0 ? `In Cart (${qtyInCart}) +` : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
