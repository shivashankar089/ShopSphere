import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function BecomeSellerModal({ onClose, onSellerRegistered }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const [step, setStep] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    storeName: user?.name ? `${user.name}'s Official Store` : '',
    category: 'Electronics & Gadgets',
    gstin: '36AAAAA0000A1Z5',
    phone: user?.phone || '+91 98490 12345',
    description: 'Specializing in verified authentic products with direct local warehouse dispatch.',
    address: 'Road No. 36, Jubilee Hills',
    city: 'Hyderabad',
    pincode: '500033',
    distanceKm: 2.5,
    bankAccountNumber: '9182736450192',
    ifscCode: 'HDFC0001234',
    termsAccepted: true,
  })

  const updateField = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.termsAccepted) {
      setError('Please accept the seller terms and anti-malpractice policy.')
      return
    }

    setBusy(true)
    setError('')
    try {
      const res = await api.post('/seller/become-seller', {
        storeName: form.storeName,
        description: form.description,
        address: `${form.address}, ${form.pincode}`,
        city: form.city,
        distanceKm: parseFloat(form.distanceKm) || 2.5,
        phone: form.phone,
        gstin: form.gstin,
        category: form.category,
      })

      // Update local storage user role
      if (user) {
        user.role = 'SELLER'
        localStorage.setItem('user', JSON.stringify(user))
      }

      setSuccess(true)
      if (onSellerRegistered) onSellerRegistered(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit seller application. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  function handleGoToSellerHub() {
    onClose()
    navigate('/seller')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="become-seller-modal" onClick={(e) => e.stopPropagation()}>
        <div className="seller-modal-header">
          <div className="modal-title-wrap">
            <span className="seller-kicker">SHOPPHERE SELLER HUB</span>
            <h2>Register as a Verified Merchant</h2>
            <p className="muted">
              Expand your business to thousands of customers in Hyderabad with split parcels & direct store dispatch.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        {/* Step Indicator */}
        {!success && (
          <div className="seller-steps-bar">
            <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-num">{step > 1 ? '✓' : '1'}</div>
              <span>Store Details</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-num">{step > 2 ? '✓' : '2'}</div>
              <span>Location & Dispatch</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
              <div className="step-num">3</div>
              <span>Verification & Payout</span>
            </div>
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        {success ? (
          <div className="seller-success-card">
            <div className="success-icon-badge">✓</div>
            <h3>Seller Onboarding Application Submitted!</h3>
            <p className="success-msg">
              Congratulations <strong>{user?.name || 'Seller'}</strong>! Your store (<strong>{form.storeName}</strong>) has been registered. You now have instant access to your Seller Merchant Hub to manage inventory and view customer dispatches.
            </p>
            <div className="seller-success-actions">
              <button className="btn btn-primary btn-lg" onClick={handleGoToSellerHub}>
                Open Seller Merchant Hub →
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1) }}>
            {step === 1 && (
              <div className="step-fields">
                <div className="form-group">
                  <label>Store / Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Tech & Electronics"
                    value={form.storeName}
                    onChange={updateField('storeName')}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Primary Business Category *</label>
                    <select value={form.category} onChange={updateField('category')}>
                      <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Groceries & Essentials">Groceries & Essentials</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>GSTIN / Business Tax ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 36AAAAA0000A1Z5"
                      value={form.gstin}
                      onChange={updateField('gstin')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Store Description & Specialties</label>
                  <textarea
                    rows={2}
                    placeholder="Describe the products you sell and your store highlights..."
                    value={form.description}
                    onChange={updateField('description')}
                  />
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn btn-outline" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Next: Location & Dispatch →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step-fields">
                <div className="form-group">
                  <label>Store / Warehouse Pickup Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 402, Cyber Towers, Madhapur"
                    value={form.address}
                    onChange={updateField('address')}
                  />
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>City / Service Zone *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={updateField('city')}
                    />
                  </div>

                  <div className="form-group">
                    <label>PIN Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="500081"
                      value={form.pincode}
                      onChange={updateField('pincode')}
                    />
                  </div>

                  <div className="form-group">
                    <label>Distance to Hub (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.distanceKm}
                      onChange={updateField('distanceKm')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Merchant Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98490 12345"
                    value={form.phone}
                    onChange={updateField('phone')}
                  />
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Next: Payout & Compliance →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step-fields">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Bank Account Number (For Payouts) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9182736450192"
                      value={form.bankAccountNumber}
                      onChange={updateField('bankAccountNumber')}
                    />
                  </div>

                  <div className="form-group">
                    <label>IFSC Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HDFC0001234"
                      value={form.ifscCode}
                      onChange={updateField('ifscCode')}
                    />
                  </div>
                </div>

                <div className="compliance-box">
                  <h4>🛡️ Seller Quality & Anti-Malpractice Agreement</h4>
                  <ul>
                    <li>100% Genuine and authentic merchandise only. No counterfeit goods.</li>
                    <li>Strict prohibition against illegal drugs, narcotics, prescription medicines, or contraband.</li>
                    <li>All products are subject to automated safety scanning and Admin compliance verification.</li>
                    <li>Commitment to dispatch orders within 24 hours of customer confirmation.</li>
                  </ul>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.termsAccepted}
                      onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })}
                      required
                    />
                    <span>I declare that all business details are accurate and agree to platform seller standards.</span>
                  </label>
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={busy}>
                    {busy ? 'Submitting Application…' : 'Submit & Become a Seller ✓'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
