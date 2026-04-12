import React, { useState, useMemo, useEffect } from "react";
import '../css/Product.css';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import { Link, usePage, router } from "@inertiajs/react";
import FlashMessage from "../components/FlashMessage";
import { useCurrency } from '../contexts/CurrencyContext';

// ─── Star rating ─────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`w-3 h-3 ${s <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h5.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h5.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// ─── Product Card ─────────────────────────────────────────────────────────────
// Matches the reference design:
// • Fixed height — NEVER grows on hover
// • hover state via useState (not Tailwind group) for precise inline transition control
// • "You saved" fades + slides UP and OUT on hover
// • Add to Cart fades + slides UP and IN on hover (from inside the card bottom)
// • overflow:hidden on card clips both transitions cleanly
const ProductCard = ({ product, currentPrice, savings, discountPercent, isOutOfStock, isAdding, cartError, onAddToCart, formatMoney }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        boxShadow: hovered
          ? '0 20px 40px rgba(109,40,217,0.13)'
          : '0 2px 8px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
    >
      {/* ── Discount badge ── */}
      {discountPercent > 0 && (
        <div style={{
          position: 'absolute', top: '8px', left: '8px', zIndex: 10,
          background: '#ef4444', color: '#fff', fontWeight: 700,
          padding: '2px 8px', borderRadius: '999px', fontSize: '10px',
        }}>
          -{discountPercent}% OFF
        </div>
      )}

      {/* ── Wishlist button — fades in on hover ── */}
      <Link
        href={`/addtowishlist/${product.id}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: '8px', right: '8px', zIndex: 10,
          width: '28px', height: '28px', background: '#fff',
          borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          textDecoration: 'none',
        }}
      >
        <svg style={{ width: '14px', height: '14px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </Link>

      {/* ── Product image (scales on hover) ── */}
      <Link href={`/product/details/${product.id}`} style={{ textDecoration: 'none', display: 'block', flexShrink: 0 }}>
        <div style={{
          height: '150px',
          width: '100%',
          background: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}>
          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.65)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 5,
            }}>
              <span style={{
                background: '#1f2937', color: '#fff',
                fontSize: '11px', fontWeight: 600,
                padding: '4px 12px', borderRadius: '999px',
              }}>Out of Stock</span>
            </div>
          )}
          <img
            src={product.image ? `/storage/${product.image}` : "/storage/images/default-product.png"}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
          />
        </div>
      </Link>

      {/* ── Info section ── */}
      <Link
        href={`/product/details/${product.id}`}
        style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Name */}
          <p style={{
            color: '#1f2937', fontWeight: 500, fontSize: '11px',
            lineHeight: '1.4', margin: '0 0 6px 0',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            minHeight: '30px',
          }}>
            {product.name}
          </p>

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <Stars rating={Math.round(product.rating || 0)} />
            <span style={{ color: '#9ca3af', fontSize: '11px' }}>({product.reviews || 0})</span>
          </div>

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '12px', color: '#059669' }}>
              {formatMoney(currentPrice)}
            </span>
            {discountPercent > 0 && (
              <span style={{ color: '#9ca3af', fontSize: '11px', textDecoration: 'line-through' }}>
                {formatMoney(Math.round(currentPrice / (1 - discountPercent / 100)))}
              </span>
            )}
          </div>

          {/*
            ── SWAP ZONE ────────────────────────────────────────────────────
            Fixed-height container (28px). Both children are absolute inside.
            On hover:
              "You saved" fades out + slides up           → disappears
              "Add to Cart" fades in  + slides up into place → appears
            No height change ever — both stay within this 28px box.
            overflow:hidden on the card clips any overflow cleanly.
          */}
          <div style={{ marginTop: 'auto', position: 'relative', height: '28px' }}>

            {/* "You saved" */}
            {savings > 0 && (
              <p style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                margin: 0, color: '#7c3aed', fontSize: '11px', fontWeight: 600,
                opacity: hovered ? 0 : 1,
                transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
                transition: hovered
                  ? 'opacity 0.15s ease, transform 0.15s ease'
                  : 'opacity 0.25s ease 0.1s, transform 0.25s ease 0.1s',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}>
                You saved {formatMoney(Math.round(savings))}
              </p>
            )}

            {/* Add to Cart button */}
            {!isOutOfStock && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(product.id);
                }}
                disabled={isAdding}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  width: '100%', padding: '5px 0',
                  background: '#f8e537', border: 'none', borderRadius: '8px',
                  color: '#1f2937', fontSize: '11px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  cursor: isAdding ? 'not-allowed' : 'pointer',
                  opacity: hovered ? 1 : 0,
                  transform: hovered ? 'translateY(0)' : 'translateY(14px)',
                  transition: hovered
                    ? 'opacity 0.25s ease 0.05s, transform 0.25s ease 0.05s'
                    : 'opacity 0.15s ease, transform 0.15s ease',
                  pointerEvents: hovered ? 'auto' : 'none',
                }}
              >
                {isAdding ? (
                  <>
                    <svg
                      style={{ width: '12px', height: '12px', animation: 'atc-spin 1s linear infinite' }}
                      fill="none" viewBox="0 0 24 24"
                    >
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M17 21a1 1 0 100-2 1 1 0 000 2zm-10 0a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            )}
          </div>

          {/* Cart error */}
          {cartError && (
            <p style={{ color: '#dc2626', fontSize: '10px', marginTop: '4px' }}>{cartError}</p>
          )}

        </div>
      </Link>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Product = () => {
  const props = usePage().props;
  const allProducts = props.products || [];
  const { formatCurrencyFromMYR } = useCurrency();
  const formatMoney = (value, options = {}) => formatCurrencyFromMYR(value, options);

  const [addingToCart, setAddingToCart] = useState({});
  const [cartErrors, setCartErrors]     = useState({});

  const handleAddToCart = (productId) => {
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    setCartErrors(prev => ({ ...prev, [productId]: null }));
    router.post('/cart/add', { product_id: productId, quantity: 1 }, {
      preserveScroll: true,
      onSuccess: () => setAddingToCart(prev => ({ ...prev, [productId]: false })),
      onError: (errors) => {
        setAddingToCart(prev => ({ ...prev, [productId]: false }));
        setCartErrors(prev => ({
          ...prev,
          [productId]: errors?.product_id || errors?.quantity || 'Failed to add to cart.',
        }));
      },
    });
  };

  const maxProductPrice = useMemo(() => {
    if (allProducts.length === 0) return 1000;
    return Math.ceil(Math.max(...allProducts.map(p => p.price || 0)) / 100) * 100;
  }, [allProducts]);

  const [selectedCategories, setSelectedCategories]           = useState([]);
  const [selectedBrands, setSelectedBrands]                   = useState([]);
  const [priceRange, setPriceRange]                           = useState([0, maxProductPrice]);
  const [minRating, setMinRating]                             = useState(0);
  const [showInStockOnly, setShowInStockOnly]                 = useState(false);
  const [searchQuery, setSearchQuery]                         = useState("");
  const [sortBy, setSortBy]                                   = useState("newest");
  const [showFilters, setShowFilters]                         = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions]     = useState(false);
  const [expandedSections, setExpandedSections]               = useState({ category: true, brands: true, price: true, rating: false });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sp = params.get('search');
    if (sp) setSearchQuery(decodeURIComponent(sp));
  }, []);

  useEffect(() => { setPriceRange([0, maxProductPrice]); }, [maxProductPrice]);

  const categories = [...new Set(props.categories?.map(c => c.category) || [])];
  const brands     = [...new Set(allProducts.map(p => p.brand).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let f = allProducts.filter(p => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand))             return false;
      if (p.price < priceRange[0] || p.price > priceRange[1])                          return false;
      if (p.rating < minRating)                                                          return false;
      if (showInStockOnly && p.instock <= 0)                                             return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()))      return false;
      return true;
    });
    switch (sortBy) {
      case "price-low":  f.sort((a, b) => a.price - b.price); break;
      case "price-high": f.sort((a, b) => b.price - a.price); break;
      case "rating":     f.sort((a, b) => b.rating - a.rating); break;
      case "name":       f.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:           f.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)); break;
    }
    return f;
  }, [selectedCategories, selectedBrands, priceRange, minRating, showInStockOnly, searchQuery, sortBy, allProducts]);

  const toggleCategory = (cat)   => setSelectedCategories(prev => prev.includes(cat)   ? prev.filter(c => c !== cat)   : [...prev, cat]);
  const toggleBrand    = (brand) => setSelectedBrands(prev     => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  const toggleSection  = (s)     => setExpandedSections(prev   => ({ ...prev, [s]: !prev[s] }));

  const clearAllFilters = () => {
    setSelectedCategories([]); setSelectedBrands([]);
    setPriceRange([0, maxProductPrice]); setMinRating(0);
    setShowInStockOnly(false); setSearchQuery("");
  };

  const activeFiltersCount =
    selectedCategories.length + selectedBrands.length +
    (priceRange[0] !== 0 || priceRange[1] !== maxProductPrice ? 1 : 0) +
    (minRating > 0 ? 1 : 0) + (showInStockOnly ? 1 : 0);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8);
  }, [searchQuery, allProducts]);

  const getProductPrices = (product) => {
    const currentPrice    = product.price || 0;
    const discountPercent = product.discount || 0;
    const originalPrice   = discountPercent > 0 ? currentPrice / (1 - discountPercent / 100) : currentPrice;
    return { currentPrice, savings: originalPrice - currentPrice, discountPercent };
  };

  const Chevron = ({ open }) => (
    <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const StarFilter = ({ rating }) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h5.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h5.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <>
      {/* Spinner keyframe injected once */}
      <style>{`@keyframes atc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <FlashMessage />
      <Navbar />

      <div className="min-h-screen bg-gray-50">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-indigo-700 font-medium">Phones</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ══ SIDEBAR ══════════════════════════════════════════════════ */}
            <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-4">

                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">{activeFiltersCount}</span>
                  )}
                </div>

                {/* Category */}
                <div className="mb-4">
                  <button onClick={() => toggleSection('category')} className="w-full flex justify-between items-center py-2 font-semibold text-gray-900 hover:text-indigo-700 transition-colors">
                    <span>Category</span><Chevron open={expandedSections.category} />
                  </button>
                  {expandedSections.category && (
                    <div className="space-y-1 mt-2">
                      {categories.map(category => (
                        <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 px-1 py-1.5 rounded transition-colors">
                          <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                          <span className="ml-2 text-sm text-gray-700 flex-1">{category}</span>
                          <span className="text-xs text-gray-400">({allProducts.filter(p => p.category === category).length})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brands */}
                <div className="mb-4 border-t border-gray-100 pt-4">
                  <button onClick={() => toggleSection('brands')} className="w-full flex justify-between items-center py-2 font-semibold text-gray-900 hover:text-indigo-700 transition-colors">
                    <span>Brands</span><Chevron open={expandedSections.brands} />
                  </button>
                  {expandedSections.brands && (
                    <div className="space-y-1 mt-2 max-h-48 overflow-y-auto">
                      {brands.map(brand => (
                        <label key={brand} className="flex items-center cursor-pointer hover:bg-gray-50 px-1 py-1.5 rounded transition-colors">
                          <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                          <span className="ml-2 text-sm text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-4 border-t border-gray-100 pt-4">
                  <button onClick={() => toggleSection('price')} className="w-full flex justify-between items-center py-2 font-semibold text-gray-900 hover:text-indigo-700 transition-colors">
                    <span>Price Range</span><Chevron open={expandedSections.price} />
                  </button>
                  {expandedSections.price && (
                    <div className="mt-3">
                      <div className="flex gap-2 mb-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Min</label>
                          <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500" min="0" max={priceRange[1]} />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Max</label>
                          <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxProductPrice])} className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500" min={priceRange[0]} />
                        </div>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full mb-2">
                        <div className="absolute h-full bg-indigo-600 rounded-full" style={{ left: `${(priceRange[0] / maxProductPrice) * 100}%`, right: `${100 - (priceRange[1] / maxProductPrice) * 100}%` }} />
                        <input type="range" min="0" max={maxProductPrice} value={priceRange[0]} onChange={(e) => { const v = parseInt(e.target.value); if (v < priceRange[1]) setPriceRange([v, priceRange[1]]); }} className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: 10 }} />
                        <input type="range" min="0" max={maxProductPrice} value={priceRange[1]} onChange={(e) => { const v = parseInt(e.target.value); if (v > priceRange[0]) setPriceRange([priceRange[0], v]); }} className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: 10 }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="mb-4 border-t border-gray-100 pt-4">
                  <button onClick={() => toggleSection('rating')} className="w-full flex justify-between items-center py-2 font-semibold text-gray-900 hover:text-indigo-700 transition-colors">
                    <span>Min Rating</span><Chevron open={expandedSections.rating} />
                  </button>
                  {expandedSections.rating && (
                    <div className="mt-2 space-y-1">
                      {[0,1,2,3,4].map(r => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-1 py-1.5 rounded transition-colors">
                          <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="w-4 h-4 text-indigo-600" />
                          {r === 0 ? <span className="text-sm text-gray-600">All ratings</span> : <StarFilter rating={r} />}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* In Stock */}
                <div className="mb-4 border-t border-gray-100 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showInStockOnly} onChange={() => setShowInStockOnly(p => !p)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <span className="text-sm font-semibold text-gray-900">In Stock Only</span>
                  </label>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button onClick={clearAllFilters} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Clear All</button>
                  <button onClick={() => setShowFilters(false)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors">Apply</button>
                </div>
              </div>
            </div>

            {/* ══ MAIN CONTENT ═════════════════════════════════════════════ */}
            <div className="flex-1">

              {/* Search Bar */}
              <div className="mb-6 relative">
                <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                  <svg className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSearchSuggestions(true); }}
                    onFocus={() => searchQuery && setShowSearchSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    className="flex-1 px-3 py-3 text-sm focus:outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(""); setShowSearchSuggestions(false); }} className="px-3 text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                      </svg>
                    </button>
                  )}
                </div>
                {showSearchSuggestions && searchQuery && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl mt-1 max-h-96 overflow-y-auto">
                    <div className="py-2">
                      {searchSuggestions.map(product => (
                        <button key={product.id} onClick={() => { setSearchQuery(product.name); setShowSearchSuggestions(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                          <span className="text-xs text-indigo-600 font-semibold flex-shrink-0">{formatMoney(product.price)}</span>
                        </button>
                      ))}
                      <div className="px-4 py-2 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500">{searchSuggestions.length} result{searchSuggestions.length !== 1 ? 's' : ''} for "{searchQuery}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {searchQuery
                    ? <>Results for <span className="text-indigo-700">"{searchQuery}"</span> <span className="text-gray-400 font-normal text-base">({filteredProducts.length})</span></>
                    : <>All Products <span className="text-gray-400 font-normal text-base">({filteredProducts.length})</span></>
                  }
                </h3>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors">
                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </button>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Sort by</span>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer">
                      <option value="newest">New Arrivals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => {
                    const { currentPrice, savings, discountPercent } = getProductPrices(product);
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        currentPrice={currentPrice}
                        savings={savings}
                        discountPercent={discountPercent}
                        isOutOfStock={product.instock <= 0}
                        isAdding={!!addingToCart[product.id]}
                        cartError={cartErrors[product.id]}
                        onAddToCart={handleAddToCart}
                        formatMoney={formatMoney}
                      />
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
                  <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
                  <button onClick={clearAllFilters} className="px-6 py-2 bg-indigo-700 text-white rounded-lg font-medium hover:bg-indigo-800 transition-colors">
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