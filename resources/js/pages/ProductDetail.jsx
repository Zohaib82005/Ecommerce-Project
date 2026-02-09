import React, { useState } from "react";
import "../css/productDetail.css";
import { usePage, Link, useForm } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import Footer from "../components/Footer";
import FlashMessage from "../components/FlashMessage";
const ProductDetail = () => {
  const { product } = usePage().props;
  const cart = useForm({
    product_id: product?.id || null,
    quantity: 1,

  });
  // State management
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
 
  // Sample data (replace with actual product data)
  const productData = {
    name: product?.name || "Wireless Noise Cancelling Headphones",
    price: product?.price || 129.00,
    originalPrice:  product?.price  * 2,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: product?.instock,
    description: "Experience premium sound quality with active noise cancellation, long battery life, and a comfortable over-ear design perfect for daily use.",
    category: "Electronics",
    brand: "Premium Audio",
    sku: "WH-1000XM5",
    images: [
      product?.image ? `/storage/${product.image}` : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944",
      "https://images.unsplash.com/photo-1545127398-14699f92334b",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a",
    ],
    features: [
      { icon: "🎧", title: "Active Noise Cancellation", desc: "Advanced ANC technology" },
      { icon: "🔋", title: "40 Hours Battery Life", desc: "All-day listening" },
      { icon: "📡", title: "Bluetooth 5.3", desc: "Stable connection" },
      { icon: "⚡", title: "Fast Charging", desc: "3 hours in 10 minutes" },
    ],
    specifications: [
      { label: "Driver Size", value: "40mm" },
      { label: "Frequency Response", value: "20Hz - 20kHz" },
      { label: "Impedance", value: "32 Ohms" },
      { label: "Weight", value: "250g" },
      { label: "Connectivity", value: "Bluetooth 5.3 / 3.5mm" },
      { label: "Battery", value: "40 hours (ANC on)" },
    ],
    reviews: [
      {
        id: 1,
        author: "John Doe",
        rating: 5,
        date: "2 days ago",
        comment: "Amazing sound quality and very comfortable! The noise cancellation works perfectly.",
        helpful: 24,
        verified: true,
      },
      {
        id: 2,
        author: "Sarah Smith",
        rating: 4,
        date: "1 week ago",
        comment: "Battery life is excellent, totally worth it. Only minor issue is they're a bit tight at first.",
        helpful: 18,
        verified: true,
      },
      {
        id: 3,
        author: "Mike Johnson",
        rating: 5,
        date: "2 weeks ago",
        comment: "Best headphones I've ever owned. The bass is incredible and they're so comfortable.",
        helpful: 31,
        verified: false,
      },
    ],
  };

  // Functions

   function handleCartAdd(e){
    e.preventDefault();
    cart.setData('quantity', quantity);
    console.log(cart.data.quantity);
    // return;
    cart.post('/cart/add');
  }
  const incrementQuantity = () => {
    if (cart.data.quantity < productData.stockCount) {
      cart.setData('quantity', cart.data.quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (cart.data.quantity > 1) {
      cart.setData('quantity', cart.data.quantity - 1);
    }
  };
// console.log(cart.data.quantity);
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bi bi-star${index < Math.floor(rating) ? '-fill' : ''}`}
      ></i>
    ));
  };

  const discountPercentage = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);

  return (
    <>
      {/* <Navbar /> */}
      <FlashMessage />
      <div className="product-detail-page">
        <div className="container py-4 py-lg-5">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="breadcrumb-nav">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/products">{productData.category}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {productData.name}
              </li>
            </ol>
          </nav>

          <div className="row g-4 g-lg-5">
            {/* LEFT: Product Images */}
            <div className="col-lg-6">
              <div className="product-images-section">
                {/* Main Image */}
                <div className="main-image-container">
                  {discountPercentage > 0 && (
                    <div className="discount-badge">-{discountPercentage}%</div>
                  )}
                  {productData.inStock && (
                    <div className="stock-badge">In Stock</div>
                  )}
                  <img
                    src={productData.images[selectedImage]}
                    alt={productData.name}
                    className="main-product-image"
                  />
                  <button className="btn-zoom">
                    <i className="bi bi-zoom-in"></i>
                  </button>
                </div>

                {/* Thumbnail Gallery */}
                <div className="thumbnail-gallery">
                  {/* {productData.images.map((img, index) => (
                    <div
                      key={index}
                      className={`thumbnail-item ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={img} alt={`View ${index + 1}`} />
                    </div>
                  ))} */}
                </div>
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div className="col-lg-6">
              <div className="product-info-section">
                {/* Brand & SKU */}
                <div className="product-meta">
                  <span className="product-brand">{productData.brand}</span>
                  <span className="product-sku">SKU: {productData.sku}</span>
                </div>

                {/* Product Name */}
                <h1 className="product-title">{productData.name}</h1>

                {/* Rating */}
                <div className="product-rating-section">
                  <div className="rating-stars">
                    {renderStars(productData.rating)}
                  </div>
                  <span className="rating-value">{productData.rating}</span>
                  <span className="rating-count">({productData.reviewCount} reviews)</span>
                  <a href="#reviews" className="write-review">Write a review</a>
                </div>

                {/* Price */}
                <div className="product-pricing">
                  <div className="price-main">$</div>
                  {productData.originalPrice > productData.price && (
                    <>
                      <div className="price-original">${productData.originalPrice.toFixed(2)}</div>
                      <div className="price-save">Save ${(productData.originalPrice - productData.price).toFixed(2)}</div>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="stock-info">
                  {productData.inStock ? (
                    <>
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span className="text-success">In Stock ({productData.stockCount} available)</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-x-circle-fill text-danger"></i>
                      <span className="text-danger">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="product-description">{productData.description}</p>

                {/* Features Grid */}
                <div className="features-grid">
                  {productData.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-icon">{feature.icon}</div>
                      <div className="feature-content">
                        <div className="feature-title">{feature.title}</div>
                        <div className="feature-desc">{feature.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity Selector */}
                {/* {cart.data.quantity} */}
                <div className="quantity-section">
                  <label className="quantity-label">Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      className="btn-quantity"
                      onClick={decrementQuantity}
                      disabled={cart.data.quantity <= 1}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={cart.data.quantity}
                      readOnly
                    />
                    <button
                      className="btn-quantity"
                      onClick={incrementQuantity}
                      disabled={cart.data.quantity >= productData.stockCount}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  <div className="quantity-stock">
                    Only {productData.stockCount} left!
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  {(productData.stockCount > 0) && (<button onClick={handleCartAdd}  className="btn btn-primary btn-add-to-cart">
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </button>)}
                  
                  <Link href="/cart" className="btn-view-cart" style={{textDecoration: "none"}}>View Cart</Link>
                  <button
                    className={`btn btn-wishlist ${isWishlisted ? 'active' : ''}`}
                    onClick={toggleWishlist}
                  >
                    <i className={`bi bi-heart${isWishlisted ? '-fill' : ''}`}></i>
                  </button>
                </div>

                {/* Delivery & Services */}
                <div className="services-section">
                  <div className="service-item">
                    <i className="bi bi-truck"></i>
                    <div className="service-content">
                      <div className="service-title">Free Delivery</div>
                      <div className="service-desc">On orders over $50. Arrives in 2-3 days</div>
                    </div>
                  </div>
                  <div className="service-item">
                    <i className="bi bi-arrow-repeat"></i>
                    <div className="service-content">
                      <div className="service-title">Easy Returns</div>
                      <div className="service-desc">30-day return policy for your peace of mind</div>
                    </div>
                  </div>
                  <div className="service-item">
                    <i className="bi bi-shield-check"></i>
                    <div className="service-content">
                      <div className="service-title">Warranty</div>
                      <div className="service-desc">2-year manufacturer warranty included</div>
                    </div>
                  </div>
                </div>

                {/* Share */}
                <div className="share-section">
                  <span className="share-label">Share:</span>
                  <div className="share-buttons">
                    <button className="btn-share facebook">
                      <i className="bi bi-facebook"></i>
                    </button>
                    <button className="btn-share twitter">
                      <i className="bi bi-twitter"></i>
                    </button>
                    <button className="btn-share pinterest">
                      <i className="bi bi-pinterest"></i>
                    </button>
                    <button className="btn-share whatsapp">
                      <i className="bi bi-whatsapp"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="product-tabs-section">
                {/* Tab Navigation */}
                <ul className="tab-navigation">
                  <li
                    className={activeTab === "description" ? "active" : ""}
                    onClick={() => setActiveTab("description")}
                  >
                    Description
                  </li>
                  <li
                    className={activeTab === "specifications" ? "active" : ""}
                    onClick={() => setActiveTab("specifications")}
                  >
                    Specifications
                  </li>
                  <li
                    className={activeTab === "reviews" ? "active" : ""}
                    onClick={() => setActiveTab("reviews")}
                  >
                    Reviews ({productData.reviewCount})
                  </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content-area">
                  {/* Description Tab */}
                  {activeTab === "description" && (
                    <div className="tab-pane active">
                      <h3 className="tab-title">Product Description</h3>
                      <p className="tab-text">
                        These wireless headphones are designed for users who value comfort and sound clarity.
                        With premium materials, intelligent noise cancellation, and long-lasting battery
                        performance, they're perfect for work, travel, and entertainment.
                      </p>
                      <p className="tab-text">
                        The advanced active noise cancellation technology adapts to your environment,
                        ensuring you enjoy crystal-clear audio whether you're on a busy street or in a
                        quiet office. The ergonomic design with memory foam ear cushions provides all-day
                        comfort, while the premium materials ensure durability.
                      </p>
                      <h4 className="tab-subtitle">Key Highlights:</h4>
                      <ul className="highlight-list">
                        <li>Premium 40mm drivers for exceptional audio quality</li>
                        <li>Adaptive noise cancellation that adjusts to your environment</li>
                        <li>Up to 40 hours of continuous playback with ANC enabled</li>
                        <li>Quick charge feature: 3 hours of playback in just 10 minutes</li>
                        <li>Multi-device connectivity for seamless switching</li>
                        <li>Foldable design with premium carrying case included</li>
                      </ul>
                    </div>
                  )}

                  {/* Specifications Tab */}
                  {activeTab === "specifications" && (
                    <div className="tab-pane active">
                      <h3 className="tab-title">Technical Specifications</h3>
                      <div className="specifications-table">
                        {productData.specifications.map((spec, index) => (
                          <div key={index} className="spec-row">
                            <div className="spec-label">{spec.label}</div>
                            <div className="spec-value">{spec.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === "reviews" && (
                    <div className="tab-pane active" id="reviews">
                      <div className="reviews-header">
                        <div className="reviews-summary">
                          <div className="average-rating">
                            <div className="rating-number">{productData.rating}</div>
                            <div className="rating-stars-large">
                              {renderStars(productData.rating)}
                            </div>
                            <div className="rating-text">Based on {productData.reviewCount} reviews</div>
                          </div>
                        </div>
                        <button className="btn btn-primary btn-write-review">
                          <i className="bi bi-pencil-square me-2"></i>
                          Write a Review
                        </button>
                      </div>

                      <div className="reviews-list">
                        {productData.reviews.map((review) => (
                          <div key={review.id} className="review-item">
                            <div className="review-header">
                              <div className="reviewer-info">
                                <div className="reviewer-avatar">
                                  {review.author.charAt(0)}
                                </div>
                                <div className="reviewer-details">
                                  <div className="reviewer-name">
                                    {review.author}
                                    {review.verified && (
                                      <span className="verified-badge">
                                        <i className="bi bi-patch-check-fill"></i> Verified Purchase
                                      </span>
                                    )}
                                  </div>
                                  <div className="review-date">{review.date}</div>
                                </div>
                              </div>
                              <div className="review-rating">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <div className="review-footer">
                              <button className="btn-helpful">
                                <i className="bi bi-hand-thumbs-up"></i>
                                Helpful ({review.helpful})
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

export default ProductDetail;