import { Link } from "@inertiajs/react";
import React, { useState } from "react";
import "../css/Navbar.css"; // Import custom styles

const Navbar = ({ cartItemCount = 0, user = null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="top-bar-left">
              <a href="tel:+1234567890" className="top-bar-link">
                <i className="bi bi-telephone-fill me-1"></i>
                +123 456 7890
              </a>
              <span className="separator">|</span>
              <a href="mailto:support@corebuy.com" className="top-bar-link">
                <i className="bi bi-envelope-fill me-1"></i>
                support@corebuy.com
              </a>
            </div>
            <div className="top-bar-right">
              <a href="/track-order" className="top-bar-link">
                <i className="bi bi-truck me-1"></i>
                Track Order
              </a>
              <span className="separator">|</span>
              <a href="/help" className="top-bar-link">
                <i className="bi bi-question-circle me-1"></i>
                Help
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="main-navbar" aria-label="Main navigation">
        <a className="visually-hidden-focusable" href="#main-content">
          Skip to content
        </a>
        <div className="container">
          <div className="navbar-wrapper">
            
            {/* Brand Logo */}
            <Link className="brand-logo" href="/">
              <div className="logo-icon">
                <i className="bi bi-bag-check-fill"></i>
              </div>
              <span className="logo-text">CoreBuy</span>
            </Link>

            {/* Categories Mega Menu */}
            <div className="categories-dropdown">
              <button
                className="categories-btn"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-grid-3x3-gap"></i>
                <span>All Categories</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </button>
              <div className="dropdown-menu mega-menu">
                <div className="mega-menu-content">
                  <div className="mega-menu-column">
                    <h6 className="mega-menu-title">Electronics</h6>
                    <Link href="/category/mobiles" className="mega-menu-item">
                      <i className="bi bi-phone"></i>
                      Mobile Phones
                    </Link>
                    <Link href="/category/laptops" className="mega-menu-item">
                      <i className="bi bi-laptop"></i>
                      Laptops
                    </Link>
                    <Link href="/category/headphones" className="mega-menu-item">
                      <i className="bi bi-headphones"></i>
                      Headphones
                    </Link>
                    <Link href="/category/cameras" className="mega-menu-item">
                      <i className="bi bi-camera"></i>
                      Cameras
                    </Link>
                  </div>
                  <div className="mega-menu-column">
                    <h6 className="mega-menu-title">Fashion</h6>
                    <Link href="/category/mens-wear" className="mega-menu-item">
                      <i className="bi bi-person"></i>
                      Men's Wear
                    </Link>
                    <Link href="/category/womens-wear" className="mega-menu-item">
                      <i className="bi bi-person-dress"></i>
                      Women's Wear
                    </Link>
                    <Link href="/category/shoes" className="mega-menu-item">
                      <i className="bi bi-stars"></i>
                      Footwear
                    </Link>
                    <Link href="/category/accessories" className="mega-menu-item">
                      <i className="bi bi-watch"></i>
                      Accessories
                    </Link>
                  </div>
                  <div className="mega-menu-column">
                    <h6 className="mega-menu-title">Home & Living</h6>
                    <Link href="/category/furniture" className="mega-menu-item">
                      <i className="bi bi-house-door"></i>
                      Furniture
                    </Link>
                    <Link href="/category/decor" className="mega-menu-item">
                      <i className="bi bi-lamp"></i>
                      Home Decor
                    </Link>
                    <Link href="/category/kitchen" className="mega-menu-item">
                      <i className="bi bi-cup-hot"></i>
                      Kitchen
                    </Link>
                    <Link href="/category/bedding" className="mega-menu-item">
                      <i className="bi bi-moon-stars"></i>
                      Bedding
                    </Link>
                  </div>
                  <div className="mega-menu-column featured-column">
                    <div className="featured-banner">
                      <div className="featured-content">
                        <span className="featured-tag">NEW</span>
                        <h6>Summer Collection</h6>
                        <p>Up to 50% OFF</p>
                        <Link href="/deals" className="featured-link">
                          Shop Now <i className="bi bi-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <form
              className={`search-form ${isSearchFocused ? 'focused' : ''}`}
              onSubmit={handleSearch}
              role="search"
            >
              <div className="search-input-wrapper">
                <i className="bi bi-search search-icon"></i>
                <input
                  className="search-input"
                  type="search"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearchQuery("")}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
              <button type="submit" className="search-btn">
                Search
              </button>
            </form>

            {/* Navigation Actions */}
            <div className="nav-actions">
              
              {/* Deals Badge */}
              <Link href="/deals" className="nav-action-item deals-badge">
                <i className="bi bi-lightning-charge-fill"></i>
                <span className="action-text">Deals</span>
                <span className="pulse-badge"></span>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="nav-action-item">
                <i className="bi bi-heart"></i>
                <span className="action-text">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="nav-action-item cart-item">
                <div className="cart-icon-wrapper">
                  <i className="bi bi-cart3"></i>
                  {cartItemCount > 0 && (
                    <span className="cart-badge">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </div>
                <span className="action-text">Cart</span>
              </Link>

              {/* User Account */}
              {user ? (
                <div className="dropdown user-dropdown">
                  <button
                    className="nav-action-item user-btn"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <div className="user-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <i className="bi bi-person-circle"></i>
                      )}
                    </div>
                    <span className="action-text">{user.name.split(' ')[0]}</span>
                    <i className="bi bi-chevron-down ms-1"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end user-menu">
                    <li className="user-menu-header">
                      <div className="user-info">
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </div>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" href="/account/profile">
                        <i className="bi bi-person"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/account/orders">
                        <i className="bi bi-box-seam"></i>
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/wishlist">
                        <i className="bi bi-heart"></i>
                        Wishlist
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/account/addresses">
                        <i className="bi bi-geo-alt"></i>
                        Saved Addresses
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/account/settings">
                        <i className="bi bi-gear"></i>
                        Settings
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link
                        className="dropdown-item logout-item"
                        href="/logout"
                        method="post"
                        as="button"
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link href="/login" className="btn-login">
                    Login
                  </Link>
                  <Link href="/register" className="btn-register">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Quick Links Bar */}
      <div className="quick-links-bar">
        <div className="container">
          <div className="quick-links">
            <Link href="/new-arrivals" className="quick-link">
              <i className="bi bi-stars"></i>
              New Arrivals
            </Link>
            <Link href="/bestsellers" className="quick-link">
              <i className="bi bi-trophy"></i>
              Bestsellers
            </Link>
            <Link href="/brands" className="quick-link">
              <i className="bi bi-award"></i>
              Top Brands
            </Link>
            <Link href="/gift-cards" className="quick-link">
              <i className="bi bi-gift"></i>
              Gift Cards
            </Link>
            <Link href="/customer-service" className="quick-link">
              <i className="bi bi-headset"></i>
              Customer Service
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Offcanvas Menu */}
      <div className="offcanvas offcanvas-start mobile-offcanvas" tabIndex="-1" id="mobileMenu">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          {/* Mobile menu content */}
          <div className="mobile-menu-content">
            {!user && (
              <div className="mobile-auth">
                <Link href="/login" className="btn btn-primary w-100 mb-2">Login</Link>
                <Link href="/register" className="btn btn-outline-primary w-100">Sign Up</Link>
              </div>
            )}
            {/* Add mobile navigation items here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;