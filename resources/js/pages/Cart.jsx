import React, { useState } from "react";
import "../css/cart.css";
import Footer from '../components/Footer';
import Navbar from '../Components/Navbar';
import { Link, usePage } from "@inertiajs/react";
import FlashMessage from "../components/FlashMessage";
const Cart = () => {
  const products = usePage().props.products;
  console.log(products);
  // State management
 

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [savedForLater, setSavedForLater] = useState([]);

  // Calculate totals
  const subtotal = products.reduce((total, item) => total + item.price * item.quantity, 0);
  const savings = products.reduce(
    (total, item) => total + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 99 ? 0 : 5;
  const tax = subtotal * 0.08; // 8% tax
  const discount = appliedPromo ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + shipping + tax - discount;

  // Functions
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(products.map(item => 
      item.id === id ? { ...item, qty: newQty } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const saveForLater = (id) => {
    const item = products.find(item => item.id === id);
    setSavedForLater([...savedForLater, item]);
    removeItem(id);
  };

  const moveToCart = (id) => {
    const item = savedForLater.find(item => item.id === id);
    setCartItems([...products, item]);
    setSavedForLater(savedForLater.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo({ code: "SAVE10", discount: 10 });
    } else {
      alert("Invalid promo code");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };

  return (
    <>
      <FlashMessage />
      {/* <Navbar /> */}
      <div className="cart-page">
        <div className="container py-4 py-lg-5">
          {/* Page Header */}
          <div className="cart-header">
            <div className="header-content">
              <h1 className="cart-title">
                <i className="bi bi-cart3 me-3"></i>
                Shopping Cart
              </h1>
              <p className="cart-subtitle">{products.length} items in your cart</p>
            </div>
            <Link href="/products" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>
          </div>

          {products.length === 0 ? (
            /* Empty Cart */
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <i className="bi bi-cart-x"></i>
              </div>
              <h3>Your Cart is Empty</h3>
              <p>Looks like you haven't added anything to your cart yet</p>
              <Link href="/products" className="btn btn-primary btn-lg">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {/* LEFT: Cart Items */}
              <div className="col-lg-8">
                {/* Progress Bar */}
                <div className="shipping-progress">
                  <div className="progress-content">
                    {shipping === 0 ? (
                      <>
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <span className="progress-text">
                          Congratulations! You've qualified for <strong>FREE SHIPPING</strong>
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-truck"></i>
                        <span className="progress-text">
                          Add <strong>${(99 - subtotal).toFixed(2)}</strong> more to get <strong>FREE SHIPPING</strong>
                        </span>
                      </>
                    )}
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${Math.min((subtotal / 99) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="cart-items-list">
                  {products.map((item) => (
                    <div key={item.id} className={`cart-item-card ${!(item.instock > 0) ? 'out-of-stock' : ''}`}>
                      <div className="cart-item-content">
                        {/* Image */}
                        <div className="item-image">
                          <Link href="/product/details">
                            <img src={`/storage/${item.image}`} alt={item.name} />
                          </Link>
                          {!item.instock && (
                            <div className="out-of-stock-badge">Out of Stock</div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="item-details">
                          <div className="item-info">
                            <Link href="/product/details" className="item-name">
                              {item.name}
                            </Link>
                            <div className="item-meta">
                              <span className="item-brand">{item.brand}</span>
                              <span className="item-separator">•</span>
                              <span className="item-category">{item.category}</span>
                            </div>
                            
                            {item.originalPrice > item.price && (
                              <div className="item-savings">
                                <span className="saved-amount">
                                  You save ${((item.originalPrice - item.price) * item.qty).toFixed(2)}
                                </span>
                              </div>
                            )}

                            {/* Mobile Actions */}
                            <div className="item-actions-mobile d-md-none">
                              <button 
                                className="btn-action"
                                onClick={() => saveForLater(item.id)}
                              >
                                <i className="bi bi-heart"></i>
                                Save for Later
                              </button>
                              <Link 
                                className="btn-action text-danger"
                                href={`/cart/remove/${item.id}`}
                              >
                                <i className="bi bi-trash"></i>
                                Remove
                              </Link>
                            </div>
                          </div>

                          {/* Quantity & Price */}
                          <div className="item-controls">
                            {/* Quantity Selector */}
                            <div className="quantity-selector">
                              <button
                                className="qty-btn"
                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                disabled={item.qty <= 1}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <input
                                type="number"
                                className="qty-input"
                                value={item.quantity}
                                readOnly
                              />
                              <button
                                className="qty-btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={!item.instock}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>

                            {/* Price */}
                            <div className="item-price">
                              <div className="price-current">${(item.price * item.quantity).toFixed(2)}</div>
                              {item.originalPrice > item.price && (
                                <div className="price-original">${(item.originalPrice * item.quantity).toFixed(2)}</div>
                              )}
                            </div>

                            {/* Desktop Actions */}
                            <div className="item-actions d-none d-md-flex">
                              <button
                                className="btn-icon"
                                onClick={() => saveForLater(item.id)}
                                title="Save for Later"
                              >
                                <i className="bi bi-heart"></i>
                              </button>
                              <Link
                                className="btn-icon btn-remove"
                                href={`/cart/remove/${item.cartitem_id}`}
                                title="Remove"
                              >
                                <i className="bi bi-trash"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Saved for Later */}
                {savedForLater.length > 0 && (
                  <div className="saved-for-later-section">
                    <h5 className="section-title">
                      <i className="bi bi-heart me-2"></i>
                      Saved for Later ({savedForLater.length})
                    </h5>
                    <div className="saved-items-grid">
                      {savedForLater.map((item) => (
                        <div key={item.id} className="saved-item-card">
                          <img src={`/storage/${item.image}`} alt={item.name} />
                          <div className="saved-item-info">
                            <h6>{item.name}</h6>
                            <p className="price">${item.price}</p>
                          </div>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => moveToCart(item.id)}
                          >
                            Move to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Promo Banner */}
                <div className="promo-banner">
                  <div className="promo-icon">🔥</div>
                  <div className="promo-content">
                    <h5>Limited Time Offer!</h5>
                    <p>Get <strong>10% OFF</strong> on orders above $150. Use code: <strong>SAVE10</strong></p>
                  </div>
                  <Link href="/products" className="btn btn-light">
                    Shop More
                  </Link>
                </div>
              </div>

              {/* RIGHT: Order Summary */}
              <div className="col-lg-4">
                <div className="order-summary-sticky">
                  {/* Promo Code */}
                  <div className="promo-code-section">
                    <h6 className="section-title">Have a Promo Code?</h6>
                    {appliedPromo ? (
                      <div className="applied-promo">
                        <div className="promo-info">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Code <strong>{appliedPromo.code}</strong> applied!</span>
                        </div>
                        <button className="btn-remove-promo" onClick={removePromoCode}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="promo-input-group">
                        <input
                          type="text"
                          className="promo-input"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        />
                        <button className="btn-apply-promo" onClick={applyPromoCode}>
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="order-summary-card">
                    <h5 className="summary-title">Order Summary</h5>

                    <div className="summary-row">
                      <span>Subtotal ({products.length} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    {savings > 0 && (
                      <div className="summary-row savings">
                        <span>Total Savings</span>
                        <span>-${savings.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-success' : ''}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="summary-row">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>

                    {appliedPromo && (
                      <div className="summary-row discount">
                        <span>Discount ({appliedPromo.discount}%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="summary-divider"></div>

                    <div className="summary-row total">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    {/* Checkout Button */}
                    <Link href="/checkout" className="btn btn-primary btn-checkout">
                      <i className="bi bi-lock-fill me-2"></i>
                      Proceed to Checkout
                    </Link>

                    {/* Payment Methods */}
                    <div className="payment-methods">
                      <span className="payment-label">We Accept:</span>
                      <div className="payment-icons">
                        <i className="bi bi-credit-card-2-front"></i>
                        <i className="bi bi-paypal"></i>
                        <i className="bi bi-google"></i>
                        <i className="bi bi-apple"></i>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="benefits-section">
                    <div className="benefit-item">
                      <i className="bi bi-truck"></i>
                      <div className="benefit-text">
                        <strong>Free Shipping</strong>
                        <span>On orders over $99</span>
                      </div>
                    </div>
                    <div className="benefit-item">
                      <i className="bi bi-arrow-repeat"></i>
                      <div className="benefit-text">
                        <strong>Easy Returns</strong>
                        <span>30-day return policy</span>
                      </div>
                    </div>
                    <div className="benefit-item">
                      <i className="bi bi-shield-check"></i>
                      <div className="benefit-text">
                        <strong>Secure Payment</strong>
                        <span>100% secure checkout</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="security-badge">
                    <i className="bi bi-shield-fill-check"></i>
                    <span>Safe & Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;