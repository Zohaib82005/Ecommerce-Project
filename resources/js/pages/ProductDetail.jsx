import React, { useState, useEffect, use } from "react";
import { usePage, Link, useForm } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import Footer from "../components/Footer";
import FlashMessage from "../components/FlashMessage";

const ProductDetail = () => {
  const { product, productImages, deliveryDate, auth } = usePage().props;
  const cart = useForm({
    product_id: product?.id || null,
    quantity: 1,
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [productRating, setProductRating] = useState({ average_rating: 0, total_reviews: 0 });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const reviewForm = useForm({
    product_id: product?.id || null,
    rating: 5,
    comment: "",
  });

  // Build images array from main image and product images
  const buildImages = () => {
    const images = [];
    
    // Add main product image
    if (product?.image) {
      images.push(`/storage/${product.image}`);
    }
    
    // Add additional product images
    if (productImages && productImages.length > 0) {
      productImages.forEach((img) => {
        images.push(`/storage/${img.image}`);
      });
    }
    
    return images.length > 0 ? images : ["/storage/placeholder.jpg"];
  };

  // Fetch reviews and rating
  useEffect(() => {
    fetchReviews();
    fetchProductRating();
  }, [product?.id]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`/api/reviews/product/${product?.id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchProductRating = async () => {
    try {
      const response = await fetch(`/api/reviews/product/${product?.id}/average`);
      if (response.ok) {
        const data = await response.json();
        setProductRating(data);
      }
    } catch (error) {
      console.error('Error fetching product rating:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.user) {
      alert('Please login to write a review');
      return;
    }

    try {
      reviewForm.post('/reviews/submit', {
        onSuccess: () => {
          setShowReviewModal(false);
          reviewForm.setData({ rating: 5, comment: "" });
        },
        onError: (errors) => {
          alert(errors.message);
        },
      }
      );

      const data = await response.json();

      if (response.ok) {
        setShowReviewModal(false);
        reviewForm.setData({ rating: 5, comment: "" });
        fetchReviews();
        fetchProductRating();
        alert('Review submitted successfully!');
      } else {
        
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  function fetchAverageRating() {
    fetch(`/api/reviews/product/${product?.id}/average`)
      .then(response => response.json())
      .then(data => setAverageRating(data.average_rating))
      .catch(error => console.error('Error fetching product rating:', error));
  }
  // Format delivery date
  const formatDeliveryDate = () => {
    const date = new Date(deliveryDate);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  useEffect(() => {
    fetchAverageRating();
  }, [product?.id]);

  // Calculate pricing based on discount percentage
  const calculatePricing = () => {
    const originalPrice = product?.price || 0;
    const discountPercentage = product?.discount_price || 0; // discount_price is a percentage
    const savings = originalPrice * (discountPercentage / 100);
    const discountedPrice = originalPrice - savings;
    return {
      originalPrice: originalPrice,
      discountedPrice: discountedPrice,
      savings: savings,
      discountPercentage: discountPercentage
    };
  };

  const pricing = calculatePricing();

  const productData = {
    name: product?.name || "Product Name",
    price: parseFloat(pricing.discountedPrice),
    discount_price: product?.discount_price || null,
    originalPrice: parseFloat(pricing.originalPrice),
    rating: averageRating,
    reviewCount: productRating.total_reviews || reviews.length || 0,
    inStock: product?.instock > 0,
    stockCount: product?.instock || 50,
    brand: "Generic",
    seller: "OurShopee",
    deliveryDate: formatDeliveryDate(),
    discount: parseInt(pricing.discountPercentage),
    savings: parseFloat(pricing.savings),
    description: product?.description || "No description available.",
    category: "Mobiles & Tablets",
    subcategory: "Mobile Phones",
    images: buildImages(),
    coupon: {
      code: "WLC10",
      discount: 2,
      minCartValue: 10,
    },
    cashback: 1.5,
  };

  function handleCartAdd(e) {
    e.preventDefault();
    cart.setData('quantity', cart.data.quantity);
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

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productData.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productData.images.length) % productData.images.length);
  };

  return (
    <>
      <FlashMessage />
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
            <nav className="flex text-xs sm:text-sm overflow-x-auto gap-1 sm:gap-2">
              <Link href="/" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">Home</Link>
              <span className="text-gray-400 flex-shrink-0">/</span>
              <Link href="/products" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">{productData.category}</Link>
              <span className="text-gray-400 flex-shrink-0">/</span>
              <span className="text-gray-600 whitespace-nowrap hidden sm:inline">{productData.subcategory}</span>
              <span className="text-gray-400 flex-shrink-0 hidden sm:inline">/</span>
              <span className="text-indigo-700 font-medium truncate">{productData.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
            {/* Left: Product Images */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4">
                {/* Main Image */}
                <div className="relative aspect-square mb-4">
                  <img
                    src={productData.images[selectedImage]}
                    alt={productData.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                  {productData.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden transition-all ${
                        selectedImage === index ? 'border-indigo-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6">
                {/* Brand */}
                <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{productData.brand}</div>

                {/* Product Name */}
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                  {productData.name}
                </h1>

                {/* Seller */}
                <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Sold by <span className="font-medium text-gray-900">{productData.seller}</span>
                </div>

                {/* Price Section */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 mb-2">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">RM {productData.price}</span>
                  <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    You saved RM {productData.savings}
                  </span>
                </div>

                {/* Original Price and Discount */}
                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-gray-400 line-through text-sm sm:text-base">RM {productData.originalPrice}</span>
                  <span className="text-green-600 font-semibold text-sm sm:text-base">{productData.discount}% OFF</span>
                  <span className="text-gray-400 text-xs sm:text-sm">(Inc. of VAT)</span>
                </div>

                {/* Delivery Info */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <span className="text-green-600 font-medium">Delivery Expected By {productData.deliveryDate}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-700">Shipped by <span className="font-medium">{productData.seller}</span></span>
                  </div>
                </div>

                {/* Available Coupons */}
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Available Coupons</h3>
                  <div className="border border-gray-200 rounded-lg p-2 sm:p-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between bg-gradient-to-r from-orange-50 to-white">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-xs transform -rotate-90">DISCOUNT</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">Flat RM {productData.coupon.discount} OFF*</div>
                        <div className="text-xs text-gray-600 line-clamp-1">{productData.coupon.code} <span className="text-gray-400">(Min: RM {productData.coupon.minCartValue})</span></div>
                      </div>
                    </div>
                    <button className="w-8 h-8 flex-shrink-0 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Cashback Info */}
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-700">
                    Enjoy Additional <span className="font-semibold text-indigo-700">{productData.cashback}% Cashback</span> on Orders Placed Today*
                  </span>
                </div>

                {/* Quantity and Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300 rounded-lg flex-shrink-0">
                    <button
                      onClick={decrementQuantity}
                      disabled={cart.data.quantity <= 1}
                      className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg text-lg"
                    >
                      −
                    </button>
                    <span className="px-3 sm:px-4 py-2 sm:py-3 font-semibold text-gray-900 border-x border-gray-300 min-w-[2.5rem] sm:min-w-[3rem] text-center">
                      {cart.data.quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={cart.data.quantity >= productData.stockCount}
                      className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleCartAdd}
                    className="flex-1 bg-indigo-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-indigo-800 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    ADD TO CART
                  </button>

                  {/* Buy Now */}
                  <button className="flex-1 bg-yellow-400 text-gray-900 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    BUY NOW
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={toggleWishlist}
                    className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      isWishlisted ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-400 hover:border-gray-400'
                    }`}
                  >
                    <svg className="w-5 sm:w-6 h-5 sm:h-6" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* App Promotion Banner */}
                <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 rounded-lg p-3 sm:p-4 text-white relative overflow-hidden">
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold mb-1">Order via App & Get Extra</h3>
                      <div className="text-2xl sm:text-3xl font-bold text-yellow-400">3% Discount</div>
                    </div>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-20 rounded-full flex-shrink-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mb-1">3%</div>
                        <div className="text-xs font-bold">OFF</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute left-0 bottom-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-6 sm:mt-8 bg-white rounded-lg">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex gap-3 sm:gap-8 px-3 sm:px-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    activeTab === "description"
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Description
                </button>
               
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    activeTab === "reviews"
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reviews ({productData.reviewCount})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-6">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Product Description</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">{productData.description}</p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">Display</div>
                      <div className="text-sm sm:text-base font-medium text-gray-900">Small External Display</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">SIM Type</div>
                      <div className="text-sm sm:text-base font-medium text-gray-900">Dual SIM</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">Network</div>
                      <div className="text-sm sm:text-base font-medium text-gray-900">Unlocked</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">Color</div>
                      <div className="text-sm sm:text-base font-medium text-gray-900">Purple</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-3xl sm:text-4xl font-bold text-gray-900">{productData.rating}</div>
                      <div>
                        <div className="flex text-yellow-400 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 sm:w-5 h-4 sm:h-5" fill={i < Math.floor(productData.rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ))}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Based on {productData.reviewCount} reviews</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowReviewModal(true)}
                      className="bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-indigo-800 transition-colors whitespace-nowrap"
                    >
                      Write a Review
                    </button>
                  </div>

                  {loadingReviews ? (
                    <div className="text-center py-6 sm:py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <p className="text-gray-600 mt-2 text-sm">Loading reviews...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 sm:pb-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm sm:text-base text-indigo-600">
                                {review.user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm sm:text-base text-gray-900 truncate">{review.user.name}</div>
                                <div className="text-xs sm:text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="flex text-yellow-400 flex-shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-3 sm:w-4 h-3 sm:h-4" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-sm text-gray-600">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Write a Review</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleReviewSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="flex gap-2 sm:gap-3">
                  <img 
                    src={productData.images[0]} 
                    alt={productData.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2">{productData.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">Review this product</p>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => reviewForm.setData('rating', star)}
                      className="transition-transform hover:scale-110"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= reviewForm.data.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  {reviewForm.data.rating === 1 && 'Poor'}
                  {reviewForm.data.rating === 2 && 'Fair'}
                  {reviewForm.data.rating === 3 && 'Good'}
                  {reviewForm.data.rating === 4 && 'Very Good'}
                  {reviewForm.data.rating === 5 && 'Excellent'}
                </p>
              </div>

              {/* Comment Section */}
              <div>
                <label htmlFor="comment" className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  value={reviewForm.data.comment}
                  onChange={(e) => reviewForm.setData('comment', e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows="4"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  required
                  minLength="3"
                  maxLength="1000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {reviewForm.data.comment.length}/1000 characters
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reviewForm.data.comment.trim() || reviewForm.processing}
                  className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {reviewForm.processing ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProductDetail;