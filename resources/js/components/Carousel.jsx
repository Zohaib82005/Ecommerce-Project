import { Link } from "@inertiajs/react";
import React from "react";
import "../css/carousel.css";

const Carousel = () => {
  return (
    <div className="hero-carousel-wrapper">
      <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">

        {/* Indicators */}
        <div className="carousel-indicators">
          <button 
            type="button" 
            data-bs-target="#heroCarousel" 
            data-bs-slide-to="0" 
            className="active" 
            aria-current="true" 
            aria-label="Slide 1"
          ></button>
          <button 
            type="button" 
            data-bs-target="#heroCarousel" 
            data-bs-slide-to="1" 
            aria-label="Slide 2"
          ></button>
          <button 
            type="button" 
            data-bs-target="#heroCarousel" 
            data-bs-slide-to="2" 
            aria-label="Slide 3"
          ></button>
        </div>

        {/* Slides */}
        <div className="carousel-inner">

          {/* Slide 1 - Electronics */}
          <div className="carousel-item active">
            <div className="carousel-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
                className="d-block w-100"
                alt="Premium Electronics"
              />
              <div className="carousel-overlay"></div>
            </div>
            <div className="carousel-caption-custom">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="caption-content">
                      <span className="caption-badge animate-badge">
                        <i className="bi bi-lightning-charge-fill me-2"></i>
                        New Arrivals
                      </span>
                      <h1 className="caption-title animate-title">
                        Premium Wireless
                        <span className="highlight">Headphones</span>
                      </h1>
                      <p className="caption-description animate-description">
                        Experience crystal-clear sound with our latest collection of wireless headphones. 
                        Noise cancellation, 30-hour battery life, and premium comfort.
                      </p>
                      <div className="caption-features animate-features">
                        <div className="feature-item">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>30-Hour Battery</span>
                        </div>
                        <div className="feature-item">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Noise Cancellation</span>
                        </div>
                        <div className="feature-item">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Premium Sound</span>
                        </div>
                      </div>
                      <div className="caption-price animate-price">
                        <span className="price-label">Starting at</span>
                        <span className="price-value">$59.99</span>
                        <span className="price-original">$89.99</span>
                      </div>
                      <div className="caption-actions animate-actions">
                        <Link href="/products" className="btn btn-hero-primary">
                          <i className="bi bi-cart-plus me-2"></i>
                          Shop Now
                        </Link>
                        <Link href="/products" className="btn btn-hero-secondary">
                          <i className="bi bi-arrow-right me-2"></i>
                          View Collection
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2 - Smart Watches */}
          <div className="carousel-item">
            <div className="carousel-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                className="d-block w-100"
                alt="Smart Watches"
              />
              <div className="carousel-overlay"></div>
            </div>
            <div className="carousel-caption-custom">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6 offset-lg-6 text-end">
                    <div className="caption-content">
                      <span className="caption-badge animate-badge">
                        <i className="bi bi-star-fill me-2"></i>
                        Best Seller
                      </span>
                      <h1 className="caption-title animate-title">
                        Smart Watches
                        <span className="highlight">For Every Lifestyle</span>
                      </h1>
                      <p className="caption-description animate-description">
                        Track your fitness, stay connected, and look stylish. Our smart watches 
                        combine cutting-edge technology with elegant design.
                      </p>
                      <div className="caption-features animate-features justify-content-end">
                        <div className="feature-item">
                          <i className="bi bi-heart-pulse-fill"></i>
                          <span>Health Tracking</span>
                        </div>
                        <div className="feature-item">
                          <i className="bi bi-phone-fill"></i>
                          <span>Stay Connected</span>
                        </div>
                        <div className="feature-item">
                          <i className="bi bi-droplet-fill"></i>
                          <span>Water Resistant</span>
                        </div>
                      </div>
                      <div className="caption-price animate-price">
                        <span className="price-label">From</span>
                        <span className="price-value">$89.99</span>
                        <span className="discount-badge">Save 30%</span>
                      </div>
                      <div className="caption-actions animate-actions">
                        <Link href="/products" className="btn btn-hero-primary">
                          <i className="bi bi-bag-check me-2"></i>
                          Buy Now
                        </Link>
                        <Link href="/products" className="btn btn-hero-secondary">
                          <i className="bi bi-info-circle me-2"></i>
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3 - Tech Gadgets */}
          <div className="carousel-item">
            <div className="carousel-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661"
                className="d-block w-100"
                alt="Tech Gadgets"
              />
              <div className="carousel-overlay"></div>
            </div>
            <div className="carousel-caption-custom">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="caption-content">
                      <span className="caption-badge animate-badge">
                        <i className="bi bi-fire me-2"></i>
                        Hot Deal
                      </span>
                      <h1 className="caption-title animate-title">
                        Tech Gadgets
                        <span className="highlight">Up to 50% Off</span>
                      </h1>
                      <p className="caption-description animate-description">
                        Explore our exclusive collection of cutting-edge tech gadgets. 
                        Limited time offers on laptops, tablets, and accessories.
                      </p>
                      <div className="caption-features animate-features">
                        <div className="feature-item">
                          <i className="bi bi-truck"></i>
                          <span>Free Shipping</span>
                        </div>
                        <div className="feature-item">
                          <i className="bi bi-shield-check"></i>
                          <span>2-Year Warranty</span>
                        </div>
                        <div className="feature-item">
                          <i className="bi bi-arrow-repeat"></i>
                          <span>Easy Returns</span>
                        </div>
                      </div>
                      <div className="countdown-timer animate-price">
                        <span className="timer-label">Offer Ends In:</span>
                        <div className="timer-boxes">
                          <div className="timer-box">
                            <span className="timer-value">12</span>
                            <span className="timer-unit">Hours</span>
                          </div>
                          <div className="timer-box">
                            <span className="timer-value">34</span>
                            <span className="timer-unit">Mins</span>
                          </div>
                          <div className="timer-box">
                            <span className="timer-value">56</span>
                            <span className="timer-unit">Secs</span>
                          </div>
                        </div>
                      </div>
                      <div className="caption-actions animate-actions">
                        <Link href="/products" className="btn btn-hero-primary">
                          <i className="bi bi-lightning-charge-fill me-2"></i>
                          Grab Deal
                        </Link>
                        <Link href="/products" className="btn btn-hero-secondary">
                          <i className="bi bi-grid me-2"></i>
                          Browse All
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Custom Controls */}
        <button 
          className="carousel-control-prev carousel-control-custom" 
          type="button" 
          data-bs-target="#heroCarousel" 
          data-bs-slide="prev"
        >
          <div className="control-button">
            <i className="bi bi-chevron-left"></i>
          </div>
          <span className="visually-hidden">Previous</span>
        </button>

        <button 
          className="carousel-control-next carousel-control-custom" 
          type="button" 
          data-bs-target="#heroCarousel" 
          data-bs-slide="next"
        >
          <div className="control-button">
            <i className="bi bi-chevron-right"></i>
          </div>
          <span className="visually-hidden">Next</span>
        </button>

      </div>

      {/* Floating Features */}
      <div className="floating-features">
        <div className="container">
          <div className="features-row">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-truck"></i>
              </div>
              <div className="feature-content">
                <h6>Free Shipping</h6>
                <p>On orders over $99</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-arrow-repeat"></i>
              </div>
              <div className="feature-content">
                <h6>Easy Returns</h6>
                <p>30-day return policy</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div className="feature-content">
                <h6>Secure Payment</h6>
                <p>100% protected</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-headset"></i>
              </div>
              <div className="feature-content">
                <h6>24/7 Support</h6>
                <p>Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;