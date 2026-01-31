import React, { useState, useMemo } from "react";
import '../css/Product.css'
import Navbar from "../Components/Navbar"
import Footer from '../components/Footer'
import { Link, usePage } from "@inertiajs/react";

const allProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 59,
    category: "Electronics",
    brand: "Sony",
    rating: 4.5,
    inStock: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    tags: ["audio", "wireless"]
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 89,
    category: "Electronics",
    brand: "Apple",
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    tags: ["wearable", "smart"]
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 39,
    category: "Electronics",
    brand: "JBL",
    rating: 4.3,
    inStock: true,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
    tags: ["audio", "portable"]
  },
  {
    id: 4,
    name: "Gaming Mouse",
    price: 25,
    category: "Gaming",
    brand: "Logitech",
    rating: 4.6,
    inStock: false,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    tags: ["gaming", "accessories"]
  },
  {
    id: 5,
    name: "Laptop Stand",
    price: 30,
    category: "Accessories",
    brand: "Generic",
    rating: 4.2,
    inStock: true,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
    tags: ["desk", "accessories"]
  },
  {
    id: 6,
    name: "USB-C Hub",
    price: 45,
    category: "Accessories",
    brand: "Anker",
    rating: 4.7,
    inStock: true,
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f",
    tags: ["connectivity", "accessories"]
  },
  {
    id: 7,
    name: "Mechanical Keyboard",
    price: 120,
    category: "Gaming",
    brand: "Corsair",
    rating: 4.9,
    inStock: true,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    tags: ["gaming", "typing"]
  },
  {
    id: 8,
    name: "Webcam HD",
    price: 55,
    category: "Electronics",
    brand: "Logitech",
    rating: 4.4,
    inStock: true,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
    tags: ["video", "streaming"]
  },
  {
    id: 9,
    name: "Phone Case",
    price: 15,
    category: "Accessories",
    brand: "Spigen",
    rating: 4.1,
    inStock: true,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb",
    tags: ["mobile", "protection"]
  },
  {
    id: 10,
    name: "Portable Charger",
    price: 35,
    category: "Electronics",
    brand: "Anker",
    rating: 4.6,
    inStock: false,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
    tags: ["power", "portable"]
  },
  {
    id: 11,
    name: "Gaming Headset",
    price: 75,
    category: "Gaming",
    brand: "Razer",
    rating: 4.7,
    inStock: true,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440",
    tags: ["gaming", "audio"]
  },
  {
    id: 12,
    name: "Monitor 27 inch",
    price: 250,
    category: "Electronics",
    brand: "Dell",
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
    tags: ["display", "productivity"]
  },
];

const Product = () => {
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const props = usePage().props;
  // console.log(props.products);
  // Get unique categories and brands
  const categories = [...new Set(props.categories.map(c => c.category))];
  const brands = [...new Set(allProducts.map(p => p.brand))];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Rating filter
      if (product.rating < minRating) {
        return false;
      }

      // Stock filter
      if (showInStockOnly && !product.inStock) {
        return false;
      }

      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [selectedCategories, selectedBrands, priceRange, minRating, showInStockOnly, searchQuery, sortBy]);

  // Toggle category filter
  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle brand filter
  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 300]);
    setMinRating(0);
    setShowInStockOnly(false);
    setSearchQuery("");
    setSortBy("featured");
  };

  // Count active filters
  const activeFiltersCount = selectedCategories.length + selectedBrands.length +
    (priceRange[0] !== 0 || priceRange[1] !== 300 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (showInStockOnly ? 1 : 0);

  return (
    <>

      <div className="products-page">
        <div className="container-fluid px-3 px-lg-4 py-4">
          {/* Page Header */}
          <div className="page-header mb-4">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2 className="page-title">Our Products</h2>
                <p className="page-subtitle">
                  Discover amazing products hand-picked just for you
                </p>
              </div>
              <div className="col-lg-6">
                {/* Search Bar */}
                <div className="search-bar">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                    className="btn-clear"
                      onClick={() => setSearchQuery("")}
                      >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                      
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Sidebar Filters */}
            <div className={`col-lg-3 mb-4 ${showFilters ? 'show-mobile-filters' : ''}`}>
              <div className="filters-sidebar">
                <div className="filters-header">
                  <h5>
                    <i className="bi bi-funnel me-2"></i>
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="filter-count">{activeFiltersCount}</span>
                    )}
                  </h5>
                  <button
                    className="btn-close-filters d-lg-none"
                    onClick={() => setShowFilters(false)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    className="btn btn-sm btn-outline-danger w-100 mb-3"
                    onClick={clearAllFilters}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Clear All Filters
                  </button>
                )}

                {/* Category Filter */}
                <div className="filter-section">
                  <h6 className="filter-title">Category</h6>
                  <div className="filter-options">
                    {categories.map(category => (
                      <div key={category} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`cat-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                        />
                        <label className="form-check-label" htmlFor={`cat-${category}`}>
                          {category}
                          <span className="item-count">
                            ({props.products.filter(p => p.category === category).length})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="filter-section">
                  <h6 className="filter-title">Brand</h6>
                  <div className="filter-options">
                    {brands.map(brand => (
                      <div key={brand} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                        />
                        <label className="form-check-label" htmlFor={`brand-${brand}`}>
                          {brand}
                          <span className="item-count">
                            ({allProducts.filter(p => p.brand === brand).length})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="filter-section">
                  <h6 className="filter-title">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </h6>
                  <div className="price-inputs">
                    <div className="price-input-group">
                      <label>Min</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        min="0"
                        max={priceRange[1]}
                      />
                    </div>
                    <div className="price-input-group">
                      <label>Max</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 300])}
                        min={priceRange[0]}
                        max="300"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    className="form-range mt-2"
                    min="0"
                    max="300"
                    step="5"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  />
                </div>

                {/* Rating Filter */}
                <div className="filter-section">
                  <h6 className="filter-title">Minimum Rating</h6>
                  <div className="rating-filter">
                    {[4, 3, 2, 1].map(rating => (
                      <div
                        key={rating}
                        className={`rating-option ${minRating === rating ? 'active' : ''}`}
                        onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      >
                        <div className="stars">
                          {[...Array(rating)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill"></i>
                          ))}
                          {[...Array(5 - rating)].map((_, i) => (
                            <i key={i} className="bi bi-star"></i>
                          ))}
                        </div>
                        <span>& Up</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Filter */}
                <div className="filter-section">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="stockFilter"
                      checked={showInStockOnly}
                      onChange={(e) => setShowInStockOnly(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="stockFilter">
                      Show In Stock Only
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              {/* Toolbar */}
              
              <div className="products-toolbar">
                <div className="toolbar-left">
                  <button
                    className="btn btn-outline-primary btn-sm d-lg-none me-2"
                    onClick={() => setShowFilters(true)}
                  >
                    <i className="bi bi-funnel me-2"></i>
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="badge bg-primary ms-2">{activeFiltersCount}</span>
                    )}
                  </button>
                  <span className="results-count">
                    <strong>{props.products.length}</strong> Products Found
                  </span>
                </div>
                <Link href="/cart" className="btn btn-primary">View Cart</Link>
                <div className="toolbar-right">
                  {/* View Mode Toggle */}
                  <div className="view-mode-toggle">
                    <button
                      className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <i className="bi bi-grid-3x3-gap"></i>
                    </button>
                    <button
                      className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <i className="bi bi-list"></i>
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Tags */}
              {activeFiltersCount > 0 && (
                <div className="active-filters">
                  {selectedCategories.map(cat => (
                    <span key={cat} className="filter-tag">
                      {cat}
                      <button onClick={() => toggleCategory(cat)}>
                        <i className="bi bi-x"></i>
                      </button>
                    </span>
                  ))}
                  {selectedBrands.map(brand => (
                    <span key={brand} className="filter-tag">
                      {brand}
                      <button onClick={() => toggleBrand(brand)}>
                        <i className="bi bi-x"></i>
                      </button>
                    </span>
                  ))}
                  {(priceRange[0] !== 0 || priceRange[1] !== 300) && (
                    <span className="filter-tag">
                      ${priceRange[0]} - ${priceRange[1]}
                      <button onClick={() => setPriceRange([0, 300])}>
                        <i className="bi bi-x"></i>
                      </button>
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="filter-tag">
                      {minRating}★ & Up
                      <button onClick={() => setMinRating(0)}>
                        <i className="bi bi-x"></i>
                      </button>
                    </span>
                  )}
                  {showInStockOnly && (
                    <span className="filter-tag">
                      In Stock Only
                      <button onClick={() => setShowInStockOnly(false)}>
                        <i className="bi bi-x"></i>
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Products Grid/List */}
              {filteredProducts.length > 0 ? (
                <div className={`products-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
                  <div className="row g-3">
                    {props.products.map((product) => (
                      <div
                        key={product.id}
                        className={viewMode === 'list' ? 'col-12' : 'col-6 col-md-4 col-xl-3'}
                      >
                        <div className={`product-card ${!(product.instock > 0) ? 'out-of-stock' : ''}`}>
                          {/* Product Image */}
                          <div className="product-image">
                            <Link href={`/product/details/${product.id}`}>
                              <img
                                src={product.image ? `/storage/${product.image}` : "http://127.0.0.1:8000/storage/images/default-product.png"}
                                alt={product.name}
                              />
                            </Link>
                            {!(product.instock > 0) && (
                              <div className="stock-badge out">Out of Stock</div>
                            )}
                            {(product.instock > 0) && (
                              <div className="stock-badge in">In Stock</div>
                            )}
                            <button className="btn-wishlist">
                              <i className="bi bi-heart"></i>
                            </button>
                          </div>

                          {/* Card Body */}
                          <div className="product-body">
                            <div className="product-category">{product.category}</div>
                            <Link href={'/product/details/' + product.id}
                              className="product-name">
                              {product.name}
                            </Link>
                            <div className="product-brand">{product.brand}</div>

                            <div className="product-rating">
                              <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}`}
                                  ></i>
                                ))}
                              </div>
                              <span className="rating-value">{product.rating}</span>
                            </div>

                            <div className="product-footer">
                              <div className="product-price">${product.price}</div>
                              <Link
                                href={'/product/details/' + product.id}
                                className={`btn btn-sm ${product.instock > 0 ? 'btn-primary' : 'btn-secondary disabled'}`}
                              >
                                <i className="bi bi-cart-plus me-1"></i>
                                {product.instock > 0 ? 'View' : 'Unavailable'}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-products">
                  <div className="no-products-icon">
                    <i className="bi bi-inbox"></i>
                  </div>
                  <h4>No Products Found</h4>
                  <p>Try adjusting your filters or search query</p>
                  <button className="btn btn-primary" onClick={clearAllFilters}>
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;