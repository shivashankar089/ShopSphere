import { Link } from 'react-router-dom'

export default function StoreCard({ store }) {
  return (
    <div className="store-card">
      <div className="store-banner-wrap">
        <img
          src={store.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80'}
          alt={store.name}
          className="store-banner-img"
        />
        <div className="store-distance-tag">
          📍 {store.distanceKm} km away
        </div>
      </div>

      <div className="store-card-body">
        <div className="store-title-row">
          <h3 className="store-name">{store.name}</h3>
          <span className="store-rating-badge">★ {store.rating ? store.rating.toFixed(1) : '4.8'}</span>
        </div>

        <p className="store-desc">{store.description || 'Verified local marketplace partner with curated product catalog.'}</p>

        <div className="store-address-row">
          <span className="address-pin">🏢</span>
          <span className="store-addr-text">{store.address}, {store.city}</span>
        </div>

        <div className="store-card-footer">
          <span className="verified-store-tag">✓ Verified Merchant</span>
          <Link to={`/store/${store.id}`} className="btn btn-outline btn-sm visit-store-btn">
            Visit Store →
          </Link>
        </div>
      </div>
    </div>
  )
}
