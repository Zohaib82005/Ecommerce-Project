import React, { useState, useMemo, useEffect } from "react";
import '../css/Product.css';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import { Link, usePage, router } from "@inertiajs/react";
import FlashMessage from "../components/FlashMessage";

const Product = () => {
  const props = usePage().props;
  const allProducts = props.products || [];
  
  // Calculate maximum price from products
  const maxProductPrice = useMemo(() => {
    if (allProducts.length === 0) return 1000;
    return Math.ceil(Math.max(...allProducts.map(p => p.price || 0)) / 100) * 100;
  }, [allProducts]);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, maxProductPrice]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  
  // Expandable filter sections
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brands: true,
    price: true,
    colors: false,
    rating: false
  });

  // Get search parameter from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }
  }, []);

  // Update priceRange when maxProductPrice changes
  useEffect(() => {
    setPriceRange([0, maxProductPrice]);
  }, [maxProductPrice]);

  // Get unique categories and brands
  const categories = [...new Set(props.categories?.map(c => c.category) || [])];
  const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))];

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
      if (showInStockOnly && product.instock <= 0) {
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
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
    }

    return filtered;
  }, [selectedCategories, selectedBrands, priceRange, minRating, showInStockOnly, searchQuery, sortBy, allProducts]);

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

  // Toggle section expand/collapse
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, maxProductPrice]);
    setMinRating(0);
    setShowInStockOnly(false);
    setSearchQuery("");
  };

  // Apply filters (for mobile)
  const applyFilters = () => {
    setShowFilters(false);
  };

  // Count active filters
  const activeFiltersCount = selectedCategories.length + selectedBrands.length +
    (priceRange[0] !== 0 || priceRange[1] !== maxProductPrice ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (showInStockOnly ? 1 : 0);

  // Get search suggestions
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return [];
    
    const suggestions = allProducts
      .filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 suggestions
    
    return suggestions;
  };

  const searchSuggestions = getSearchSuggestions();

  // Calculate original price and savings
  const getProductPrices = (product) => {
    const currentPrice = product.price || 0;
    const discountPercent = product.discount || 0;
    const originalPrice = discountPercent > 0 ? (currentPrice / (1 - discountPercent / 100)) : currentPrice;
    const savings = originalPrice - currentPrice;
    
    return {
      currentPrice,
      originalPrice: discountPercent > 0 ? originalPrice : null,
      savings,
      discountPercent
    };
  };

  return (
    <>
      <FlashMessage />
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-indigo-700 font-medium">phones</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters - Desktop */}
            <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <button 
                    onClick={() => toggleSection('category')}
                    className="w-full flex justify-between items-center py-2 font-semibold text-gray-900 hover:text-indigo-700"
                  >
                    <span>Category</span>
                    <svg className={`w-5 h-5 transform transition-transform ${expandedSections.category ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedSections.category && (
                    <div className="space-y-2 mt-2">
                      {categories.map(category => (
                        <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 flex-1">{category}</span>
                          <span className="text-xs text-gray-500">
                            ({allProducts.filter(p => p.category === category).length})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brands Filter */}
                <div className="mb-4 border-t border-gray-200 pt-4">
                  <button 
                    onClick={() => toggleSection('brands')}
                    className="w-full flex justify-between items-center py-2 font-semibold text-gray-900 hover:text-indigo-700"
                  >
                    <span>Brands</span>
                    <svg className={`w-5 h-5 transform transition-transform ${expandedSections.brands ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedSections.brands && (
                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                      {brands.map(brand => (
                        <label key={brand} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 flex-1">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="mb-4 border-t border-gray-200 pt-4">
                  <button 
                    onClick={() => toggleSection('price')}
                    className="w-full flex justify-between items-center py-2 font-semibold text-gray-900 hover:text-indigo-700"
                  >
                    <span>Price Range</span>
                    <svg className={`w-5 h-5 transform transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedSections.price && (
                    <div className="mt-4">
                      <div className="flex gap-2 mb-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">Min</label>
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            min="0"
                            max={priceRange[1]}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">Max</label>
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxProductPrice])}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            min={priceRange[0]}
                          />
                        </div>
                      </div>
                      
                      {/* Dual Range Slider */}
                      <div className="relative h-2 bg-gray-200 rounded-full mb-4">
                        <div 
                          className="absolute h-full bg-indigo-600 rounded-full"
                          style={{
                            left: `${(priceRange[0] / maxProductPrice) * 100}%`,
                            right: `${100 - (priceRange[1] / maxProductPrice) * 100}%`
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max={maxProductPrice}
                          value={priceRange[0]}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val < priceRange[1]) {
                              setPriceRange([val, priceRange[1]]);
                            }
                          }}
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                          style={{ zIndex: 10 }}
                        />
                        <input
                          type="range"
                          min="0"
                          max={maxProductPrice}
                          value={priceRange[1]}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val > priceRange[0]) {
                              setPriceRange([priceRange[0], val]);
                            }
                          }}
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                          style={{ zIndex: 10 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Colors Filter */}
                <div className="mb-4 border-t border-gray-200 pt-4">
                  <button 
                    onClick={() => toggleSection('colors')}
                    className="w-full flex justify-between items-center py-2 font-semibold text-gray-900 hover:text-indigo-700"
                  >
                    <span>Colors</span>
                    <svg className={`w-5 h-5 transform transition-transform ${expandedSections.colors ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Clear All and Apply Buttons */}
                <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search Bar with Suggestions */}
              <div className="mb-6 relative">
                <div className="relative">
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                    <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search products by name..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchSuggestions(true);
                      }}
                      onFocus={() => searchQuery && setShowSearchSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                      className="flex-1 px-3 py-3 text-sm focus:outline-none bg-white"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearchSuggestions(false);
                        }}
                        className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Search Suggestions Dropdown */}
                  {showSearchSuggestions && searchQuery && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto">
                      <div className="py-2">
                        {searchSuggestions.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              setSearchQuery(product.name);
                              setShowSearchSuggestions(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-start gap-3"
                          >
                            <svg className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <div className="flex-1 text-sm">
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                            <span className="text-xs text-indigo-600 font-semibold flex-shrink-0">
                              PKR {product.price?.toLocaleString() || 'N/A'}
                            </span>
                          </button>
                        ))}
                        {searchSuggestions.length > 0 && (
                          <div className="px-4 py-2 border-t border-gray-200 text-center">
                            <p className="text-xs text-gray-500">
                              {searchSuggestions.length} result{searchSuggestions.length !== 1 ? 's' : ''} for "{searchQuery}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {searchQuery && (<>Showing Results for <span className="text-indigo-700">{searchQuery}</span> ({filteredProducts.length})</>)}
                  </h3>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-700 rounded-lg hover:bg-indigo-50"
                  >
                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </button>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-gray-600">Sort By</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="newest">New Arrivals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => {
                    const { currentPrice, originalPrice, savings, discountPercent } = getProductPrices(product);
                    
                    return (
                      <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                        {/* Product Image */}
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={product.image ? `/storage/${product.image}` : "http://127.0.0.1:8000/storage/images/default-product.png"}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Wishlist Button */}
                          <Link 
                            href={`/addtowishlist/${product.id}`}
                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </Link>
                        </div>

                        {/* Product Info */}
                        <div className="p-3">
                          <h5 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 h-10">
                            {product.name}
                          </h5>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h5.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h5.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs text-gray-600">{product.rating}</span>
                            <span className="text-xs text-gray-400">({product.reviews || 0})</span>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-lg font-bold text-gray-900">
                              PKR {currentPrice}
                            </span>
                            {discountPercent > 0 && (
                              <span className="text-xs font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          {/* Savings */}
                          {savings > 0 && (
                            <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded mb-3">
                              You saved PKR {savings.toFixed(0)}
                            </div>
                          )}

                          {/* Add to Cart Button */}
                          <Link
                            href={`/product/details/${product.id}`}
                            className={`w-full py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors ${
                              product.instock > 0 
                                ? 'bg-indigo-700 text-white hover:bg-indigo-800' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {product.instock > 0 ? 'View Details' : 'Out of Stock'}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h5>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 bg-indigo-700 text-white rounded-lg font-medium hover:bg-indigo-800 transition-colors"
                  >
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