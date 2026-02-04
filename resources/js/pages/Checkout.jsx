import React, { useState } from "react";
import "../css/checkout.css";
import { Link, useForm, usePage } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import Footer from "../components/Footer";
import FlashMessage from "../components/FlashMessage";
const Checkout = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const props = usePage().props;
  // console.log(props);
  const formData = useForm({
    // Shipping Info
    firstName: props.auth.user.name,
    lastName: "",
    email: props.auth.user.email,
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    // Payment Info
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
    // Additional
    shippingMethod: "standard",
    sameAsBilling: true,
    orderNotes: "",
  });
  function submitData() {
    formData.post('/success');
  }
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");

  // Sample order items
  const orderItems = props.cartItems;
  console.log(props);
  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = formData.data.shippingMethod === "express" ? 15 : formData.data.shippingMethod === "standard" ? 5 : 0;
  const tax = subtotal * 0.08;
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost + tax - discount;

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    formData.setData({
      ...formData.data,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Apply coupon
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      setAppliedCoupon({ code: "WELCOME10", discount: 10 });
    } else {
      alert("Invalid coupon code");
    }
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Steps configuration
  const steps = [
    { number: 1, title: "Shipping", icon: "bi-truck" },
    { number: 2, title: "Payment", icon: "bi-credit-card" },
    { number: 3, title: "Review", icon: "bi-check-circle" },
  ];




  return (
    <>
      <FlashMessage />
      <div className="checkout-page">
        <div className="container py-4 py-lg-5">
          {/* Page Header */}
          <div className="checkout-header">
            <h1 className="checkout-title">
              <i className="bi bi-lock-fill me-3"></i>
              Secure Checkout
            </h1>
            <Link href="/cart" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Cart
            </Link>
          </div>
          {/* {props.errors} */}
          {/* Progress Steps */}
          <div className="checkout-steps">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`step-item ${currentStep >= step.number ? "active" : ""} ${currentStep > step.number ? "completed" : ""
                  }`}
              >
                <div className="step-number">
                  {currentStep > step.number ? (
                    <i className="bi bi-check-lg"></i>
                  ) : (
                    <i className={step.icon}></i>
                  )}
                </div>
                <div className="step-label">{step.title}</div>
                {step.number < steps.length && <div className="step-line"></div>}
              </div>
            ))}
          </div>
          {Object.keys(formData.errors).length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {Object.values(formData.errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="row g-4">
            {/* LEFT: Forms */}
            <div className="col-lg-8">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="checkout-section animate-slide">
                  <div className="section-card">
                    <div className="section-header">
                      <h4>
                        <i className="bi bi-geo-alt-fill me-2"></i>
                        Shipping Information
                      </h4>
                      <p className="section-subtitle">Where should we deliver your order?</p>
                    </div>

                    <div className="section-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={formData.data.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            required
                          />
                        </div>
                        <div className="col-md-6">

                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.data.email}
                            onChange={handleInputChange}
                            placeholder="john.doe@example.com"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone Number *</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.data.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Street Address *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={formData.data.address}
                            onChange={handleInputChange}
                            placeholder="123 Main Street"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Apartment, suite, etc. (optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            name="apartment"
                            value={formData.data.apartment}
                            onChange={handleInputChange}
                            placeholder="Apt 4B"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">City *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={formData.data.city}
                            onChange={handleInputChange}
                            placeholder="New York"
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">State *</label>
                          <select
                            className="form-select"
                            name="state"
                            value={formData.data.state}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select State</option>
                            <option value="NY">New York</option>
                            <option value="CA">California</option>
                            <option value="TX">Texas</option>
                            <option value="FL">Florida</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">ZIP Code *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="zipCode"
                            value={formData.data.zipCode}
                            onChange={handleInputChange}
                            placeholder="10001"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="section-card mt-4">
                    <div className="section-header">
                      <h4>
                        <i className="bi bi-truck me-2"></i>
                        Shipping Method
                      </h4>
                    </div>

                    <div className="section-body">
                      <div className="shipping-options">
                        <label className="shipping-option">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="standard"
                            checked={formData.data.shippingMethod === "standard"}
                            onChange={handleInputChange}
                          />
                          <div className="option-content">
                            <div className="option-info">
                              <div className="option-title">Standard Shipping</div>
                              <div className="option-desc">Delivery in 5-7 business days</div>
                            </div>
                            <div className="option-price">$5.00</div>
                          </div>
                        </label>

                        <label className="shipping-option">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={formData.data.shippingMethod === "express"}
                            onChange={handleInputChange}
                          />
                          <div className="option-content">
                            <div className="option-info">
                              <div className="option-title">Express Shipping</div>
                              <div className="option-desc">Delivery in 2-3 business days</div>
                            </div>
                            <div className="option-price">$15.00</div>
                          </div>
                        </label>

                        <label className="shipping-option">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="pickup"
                            checked={formData.data.shippingMethod === "pickup"}
                            onChange={handleInputChange}
                          />
                          <div className="option-content">
                            <div className="option-info">
                              <div className="option-title">Store Pickup</div>
                              <div className="option-desc">Available in 2 hours</div>
                            </div>
                            <div className="option-price">FREE</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="checkout-section animate-slide">
                  <div className="section-card">
                    <div className="section-header">
                      <h4>
                        <i className="bi bi-credit-card-fill me-2"></i>
                        Payment Method
                      </h4>
                      <p className="section-subtitle">All transactions are secure and encrypted</p>
                    </div>

                    <div className="section-body">
                      {/* Payment Options */}
                      <div className="payment-methods">
                        <label className="payment-method-option">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.data.paymentMethod === "card"}
                            onChange={handleInputChange}
                          />
                          <div className="payment-method-content">
                            <i className="bi bi-credit-card"></i>
                            <span>Credit / Debit Card</span>
                          </div>
                        </label>

                        <label className="payment-method-option">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={formData.data.paymentMethod === "paypal"}
                            onChange={handleInputChange}
                          />
                          <div className="payment-method-content">
                            <i className="bi bi-paypal"></i>
                            <span>PayPal</span>
                          </div>
                        </label>

                        <label className="payment-method-option">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.data.paymentMethod === "cod"}
                            onChange={handleInputChange}
                          />
                          <div className="payment-method-content">
                            <i className="bi bi-cash"></i>
                            <span>Cash on Delivery</span>
                          </div>
                        </label>
                      </div>

                      {/* Card Details (only show if card is selected) */}
                      {formData.data.paymentMethod === "card" && (
                        <div className="card-details mt-4">
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label">Card Number *</label>
                              <div className="input-with-icon">
                                <i className="bi bi-credit-card"></i>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="cardNumber"
                                  value={formData.data.cardNumber}
                                  onChange={handleInputChange}
                                  placeholder="1234 5678 9012 3456"
                                  maxLength="19"
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <label className="form-label">Cardholder Name *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="cardName"
                                value={formData.data.cardName}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Expiry Date *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="expiryDate"
                                value={formData.data.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                maxLength="5"
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">CVV *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="cvv"
                                value={formData.data.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                maxLength="4"
                              />
                            </div>
                            <div className="col-12">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="saveCard"
                                  id="saveCard"
                                  checked={formData.data.saveCard}
                                  onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="saveCard">
                                  Save card for future purchases
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="section-card mt-4">
                    <div className="section-body">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="sameAsBilling"
                          id="sameAsBilling"
                          checked={formData.data.sameAsBilling}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="sameAsBilling">
                          Billing address is same as shipping address
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div className="checkout-section animate-slide">
                  <div className="section-card">
                    <div className="section-header">
                      <h4>
                        <i className="bi bi-clipboard-check-fill me-2"></i>
                        Review Your Order
                      </h4>
                      <p className="section-subtitle">Please review your order before placing it</p>
                    </div>

                    <div className="section-body">
                      {/* Order Items */}
                      <div className="review-section">
                        <h6 className="review-title">Order Items</h6>
                        <div className="review-items">
                          {orderItems.map((item) => (
                            <div key={item.id} className="review-item">
                              <img src={`/storage/${item.image}`} alt={item.name} />
                              <div className="item-details">
                                <div className="item-name">{item.name}</div>
                                <div className="item-qty">Qty: {item.quantity}</div>
                              </div>
                              <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="review-section">
                        <div className="review-header">
                          <h6 className="review-title">Shipping Information</h6>
                          <button className="btn-edit" onClick={() => setCurrentStep(1)}>
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                        </div>
                        <div className="review-info">
                          <p>
                            <strong>{formData.data.firstName} {formData.data.lastName}</strong>
                          </p>
                          <p>{formData.data.address}</p>
                          {formData.data.apartment && <p>{formData.data.apartment}</p>}
                          <p>{formData.data.city}, {formData.data.state} {formData.data.zipCode}</p>
                          <p>{formData.data.email}</p>
                          <p>{formData.phone}</p>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="review-section">
                        <div className="review-header">
                          <h6 className="review-title">Payment Method</h6>
                          <button className="btn-edit" onClick={() => setCurrentStep(2)}>
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                        </div>
                        <div className="review-info">
                          <p>
                            {formData.data.paymentMethod === "card" && (
                              <>
                                <i className="bi bi-credit-card me-2"></i>
                                Credit/Debit Card ending in ****
                              </>
                            )}
                            {formData.data.paymentMethod === "paypal" && (
                              <>
                                <i className="bi bi-paypal me-2"></i>
                                PayPal
                              </>
                            )}
                            {formData.data.paymentMethod === "cod" && (
                              <>
                                <i className="bi bi-cash me-2"></i>
                                Cash on Delivery
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Order Notes */}
                      <div className="review-section">
                        <h6 className="review-title">Order Notes (Optional)</h6>
                        <textarea
                          className="form-control"
                          name="orderNotes"
                          value={formData.data.orderNotes}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Any special instructions for your order?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="checkout-navigation">
                {currentStep > 1 && (
                  <button className="btn btn-outline-secondary btn-nav" onClick={prevStep}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Back
                  </button>
                )}
                {currentStep < 3 ? (
                  <button className="btn btn-primary btn-nav ms-auto" onClick={nextStep}>
                    Continue
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button onClick={submitData} className="btn btn-success btn-nav ms-auto">
                    <i className="bi bi-check-circle me-2"></i>
                    Place Order
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="col-lg-4">
              <div className="order-summary-sticky">
                {/* Order Summary Card */}
                <div className="summary-card">
                  <h5 className="summary-title">Order Summary</h5>

                  {/* Order Items Preview */}
                  <div className="summary-items">
                    {orderItems.map((item) => (
                      <div key={item.id} className="summary-item">
                        <img src={`/storage/${item.image}`} alt={item.name} />
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-qty">Qty: {item.quantity}</div>
                        </div>
                        <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code */}
                  <div className="coupon-section">
                    {appliedCoupon ? (
                      <div className="applied-coupon">
                        <div className="coupon-info">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Coupon <strong>{appliedCoupon.code}</strong> applied!</span>
                        </div>
                        <button className="btn-remove" onClick={() => setAppliedCoupon(null)}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="coupon-input-group">
                        <input
                          type="text"
                          className="coupon-input"
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        />
                        <button className="btn-apply" onClick={applyCoupon}>
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="summary-breakdown">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? "text-success" : ""}>
                        {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="summary-row discount">
                        <span>Discount ({appliedCoupon.discount}%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="trust-badge">
                    <i className="bi bi-shield-fill-check"></i>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="trust-badge">
                    <i className="bi bi-truck"></i>
                    <span>Fast Delivery</span>
                  </div>
                  <div className="trust-badge">
                    <i className="bi bi-arrow-repeat"></i>
                    <span>Easy Returns</span>
                  </div>
                </div>

                {/* Payment Icons */}
                <div className="payment-icons">
                  <span className="payment-label">We Accept:</span>
                  <div className="icons">
                    <i className="bi bi-credit-card"></i>
                    <i className="bi bi-paypal"></i>
                    <i className="bi bi-google"></i>
                    <i className="bi bi-apple"></i>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="security-notice">
                  <i className="bi bi-lock-fill"></i>
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;