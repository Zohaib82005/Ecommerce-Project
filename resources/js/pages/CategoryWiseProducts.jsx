import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import FlashMessage from '../components/FlashMessage';
import { useCurrency } from '../contexts/CurrencyContext';


const CategoryWiseProducts = ({ categoryId }) => {
  const { formatCurrencyFromMYR } = useCurrency();
  const formatMoney = (value, options = {}) => formatCurrencyFromMYR(value, options);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [addingToCart, setAddingToCart] = useState({});
  const [cartErrors, setCartErrors] = useState({});

  // Fetch category and products
  useEffect(() => {
    fetchProducts(1);
  }, [categoryId]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/category/${categoryId}?page=${page}`);
      const data = await response.json();

      console.log('API Response:', data); // Debug log

      if (data.success && data.products) {
        setCategory(data.category);
        setProducts(Array.isArray(data.products) ? data.products : []);
        setCurrentPage(data.pagination?.current_page || 1);
        setTotalPages(data.pagination?.last_page || 1);
      } else {
        console.error('Invalid response format:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatProduct = (product) => {
    // Use final_price and other pricing data from backend database (calculated by PriceCalculator)
    const finalPrice = parseFloat(product.final_price) || parseFloat(product.price) || 0;
    const originalPrice = parseFloat(product.price) || 0;
    const discountPercentage = product.discount_percentage || 0;
    const savings = product.savings || 0;

    return {
      id: product.id,
      name: product.name,
      price: formatMoney(finalPrice),
      originalPrice: formatMoney(originalPrice),
      discount: `${discountPercentage}%`,
      image: product.image,
      savings: savings,
      finalPrice: finalPrice,
      isDiscounted: product.is_discounted || false,
    };
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (productId) => {
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    setCartErrors(prev => ({ ...prev, [productId]: null }));

    router.post('/cart/add', {
      product_id: productId,
      quantity: 1,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setAddingToCart(prev => ({ ...prev, [productId]: false }));
      },
      onError: (errors) => {
        setAddingToCart(prev => ({ ...prev, [productId]: false }));
        setCartErrors(prev => ({
          ...prev,
          [productId]: errors?.product_id || errors?.quantity || 'Failed to add to cart.',
        }));
      },
    });
  };

  return (
    <>
      <LoadingScreen isVisible={true} duration={2000} />
      <Navbar />
      <FlashMessage  />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header Section */}
          <div className="mb-12">
            {category && (
              <div className="flex items-center justify-between mb-8">
                <div>
                  <Link href="/" className="text-purple-600 hover:text-purple-700 text-sm font-semibold mb-3 inline-block">
                    ← Back to Home
                  </Link>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-800">{category.name}</h1>
                  <p className="text-gray-600 mt-2">Showing all products in this category</p>
                </div>
                
                {/* Sort Dropdown */}
                <div className="flex flex-col items-end">
                  <label className="text-sm font-semibold text-gray-600 mb-2">Sort By:</label>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Category Banner Card */}
          {category && category.image && (
            <div className="mb-12 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              <div className="flex flex-col md:flex-row items-center justify-between p-8 text-white">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black mb-3">{category.name}</h2>
                  <p className="text-white/80 text-lg">Explore our complete collection of {category.name.toLowerCase()} products</p>
                </div>
                <div className="mt-6 md:mt-0 text-6xl">🛍️</div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
              </div>
              <p className="text-gray-500 mt-4">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600 text-sm">
                  Showing <span className="font-bold text-gray-800">{products.length}</span> of products
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-12">
                {products.map((product, i) => (
                  <div key={product.id} style={{ animation: `fadeInUp 0.5s ease ${i * 50}ms` }}>
                    <Link href={`/product/details/${product.id}`} className="no-underline text-decoration-none">
                      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col relative group">
                        {/* Product Image */}
                        <div className="relative w-full h-32 sm:h-40 bg-gray-100 overflow-hidden group">
                          {product.image ? (
                            <img
                              src={`/storage/${product.image}`}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <span>No Image</span>
                            </div>
                          )}
                          
                          {/* Discount Badge */}
                          {product.discount_price > 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                              {product.discount_price}% OFF
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="p-3 flex-1 flex flex-col">
                          {/* Product Name */}
                          <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
                            {product.name}
                          </p>

                          {/* Price Section */}
                          <div className="mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-bold text-gray-900">
                                {formatMoney(Math.round(product.price - (product.price * (product.discount_price || 0) / 100)), { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                              {product.discount_price > 0 && (
                                <span className="text-xs text-gray-500 line-through">
                                  {formatMoney(Math.round(product.price), { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Add to Cart Button - Hidden until hover */}
                          <div className="mt-auto flex flex-col gap-1">
                            <div className="relative overflow-hidden h-10">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddToCart(product.id);
                                }}
                                disabled={addingToCart[product.id]}
                                className="absolute bottom-0 left-0 right-0 w-full bg-yellow-400 text-gray-900 py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-yellow-500 transition-all duration-300 transform translate-y-full group-hover:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed"
                              >
                                {addingToCart[product.id] ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900" />
                                    Adding...
                                  </span>
                                ) : (
                                  '🛒 Add to Cart'
                                )}
                              </button>
                            </div>
                            {cartErrors[product.id] && (
                              <p className="text-xs text-red-500 font-semibold">
                                {cartErrors[product.id]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mb-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        currentPage === page
                          ? 'bg-purple-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No products available in this category</p>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default CategoryWiseProducts;
