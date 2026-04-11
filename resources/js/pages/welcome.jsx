import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import FlashMessage from '../components/FlashMessage';
// ─── Scroll Animation Hook ───────────────────────────────────────────────────
const useScrollAnimation = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

// ─── Animated Section Wrapper ────────────────────────────────────────────────
const AnimatedSection = ({ children, className = '', delay = 0, style = {} }) => {
  const [ref, visible] = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── Data ────────────────────────────────────────────────────────────────────
const carouselBanners = [
  {
    id: 1, badge: 'EXCLUSIVE DEALS', badgeStyle: { background: '#f59e0b', color: '#1a0533' },
    title: 'GET UP TO 40% OFF', subtitle: 'On Pre-Owned Products',
    desc: 'Certified Quality & Smart Savings',
    gradient: 'linear-gradient(135deg, #1a0533 0%, #4c1d95 60%, #7c3aed 100%)',
    btnStyle: { background: '#f59e0b', color: '#1a0533' }, emoji: '🛍️',
  },
  {
    id: 2, badge: 'FLASH SALE', badgeStyle: { background: '#ef4444', color: '#fff' },
    title: 'FLASH SALE LIVE NOW', subtitle: 'Limited time only',
    desc: 'Up to 70% discount on trending items',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 60%, #ef4444 100%)',
    btnStyle: { background: '#f59e0b', color: '#7f1d1d' }, emoji: '⚡',
  },
  {
    id: 3, badge: 'SEASONAL OFFER', badgeStyle: { background: '#10b981', color: '#fff' },
    title: 'SEASONAL BONANZA', subtitle: 'Biggest sale of the year',
    desc: 'Limited time offers on all categories',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 60%, #10b981 100%)',
    btnStyle: { background: '#f59e0b', color: '#064e3b' }, emoji: '🎉',
  },
  {
    id: 4, badge: '3% CASHBACK', badgeStyle: { background: '#3b82f6', color: '#fff' },
    title: 'MEGA CLEARANCE', subtitle: 'Stock clearance sale',
    desc: 'Up to 80% off — while stocks last',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #3b82f6 100%)',
    btnStyle: { background: '#f59e0b', color: '#1e3a5f' }, emoji: '🔥',
  },
];

const categories = [
  { id: 1,  name: 'Home & Kitchen',    icon: '🏠', color: '#FF6B6B' },
  { id: 2,  name: 'Fashion',           icon: '👔', color: '#4ECDC4' },
  { id: 3,  name: 'Health & Beauty',   icon: '💄', color: '#45B7D1' },
  { id: 4,  name: 'Toys & Games',      icon: '🎮', color: '#96CEB4' },
  { id: 5,  name: 'Sports & Fitness',  icon: '🚴', color: '#DDA0DD' },
  { id: 6,  name: 'Baby & Mother Care',icon: '🍼', color: '#98D8C8' },
  { id: 7,  name: 'Tools & Hardware',  icon: '🔧', color: '#F7DC6F' },
  { id: 8,  name: 'Pet Supplies',      icon: '🐾', color: '#BB8FCE' },
  { id: 9,  name: 'Home Furnishing',   icon: '🛋️', color: '#85C1E2' },
  { id: 10, name: 'Stationery',        icon: '📚', color: '#F8B739' },
  { id: 11, name: 'Automotive',        icon: '🚗', color: '#52BE80' },
  { id: 12, name: 'School Essentials', icon: '🎒', color: '#AF7AC5' },
  { id: 13, name: 'Mobile Phones',     icon: '📱', color: '#EC7063' },
  { id: 14, name: 'Laptops',           icon: '💻', color: '#5DADE2' },
  { id: 15, name: 'Gaming',            icon: '🕹️', color: '#82E0AA' },
];

const promoBadges = [
  { id: 1, text: 'TIME TO PARTY',       gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  { id: 2, text: 'GRAB IT CLEARANCE',   gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
  { id: 3, text: 'PRE-OWNED PRODUCTS',  gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
  { id: 4, text: 'Saver ZONE',          gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
  { id: 5, text: 'Deal of the Day',     gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 6, text: 'PRO GADGETS',         gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  { id: 7, text: 'Perfume Fiesta',      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
];

const makeProducts = (names) => names.map((name, i) => {
  const price = (Math.floor(Math.random() * 50) + 1) * 999;
  const originalPrice = (Math.floor(Math.random() * 70) + 30) * 999;
  const discount = Math.floor(Math.random() * 25) + 15;
  const savings = Math.round(originalPrice * discount / 100);
  return {
    id: i + 1,
    name,
    price: `RM ${price}`,
    originalPrice: `RM ${originalPrice}`,
    discount: `${discount}%`,
    savings,
  };
});

const topPicks        = makeProducts(['Wireless Mouse', 'Mechanical Keyboard', 'Webcam HD 1080p', 'USB Hub 7-Port', 'Monitor Stand', 'Laptop Cooling Pad']);
const dealsOfTheDay   = makeProducts(['Smart Watch Pro', 'Fitness Tracker', 'Power Bank 20000mAh', 'Phone Case Premium', 'Screen Protector', 'Charging Cable']);
const dealsYouMightLike = makeProducts(['Gaming Mouse Pad XL', 'LED Desk Lamp', 'Phone Holder Stand', 'Cable Organizer', 'Laptop Sleeve 15"', 'Wireless Charger']);

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, delay = 0, onAddToCart, rating = 0, totalReviews = 0 }) => {
  const [ref, visible] = useScrollAnimation();
  const [hovered, setHovered] = useState(false);

  // Generate star array based on rating
  const renderStars = (ratingValue) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className="w-3 h-3"
        fill={i < Math.floor(ratingValue) ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ color: i < Math.floor(ratingValue) ? "#fbbf24" : "#d1d5db" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ));
  };

  return (
    <Link className="text-decoration-none" href={`/product/details/${product.id}`}>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-white rounded-xl cursor-pointer relative overflow-hidden"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
          transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
          boxShadow: hovered ? '0 20px 40px rgba(109,40,217,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
          width: '100%',
          height: '290px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Discount badge */}
        {product.discount && (
          <div
            className="absolute top-2 left-2 z-10 text-white font-bold px-2 py-0.5 rounded-full"
            style={{ background: '#ef4444', fontSize: '10px' }}
          >
            {product.discount} OFF
          </div>
        )}

        {/* Wishlist button */}
        <button
          className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center transition-all"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0.8)' }}
          onClick={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Product image */}
        <div
          className="bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden transition-transform duration-300"
          style={{ height: '140px', width: '100%', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        >
          {product.image ? (
            <img
              src={`/storage/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl opacity-30">📷</span>
          )}
        </div>

        <div className="p-3 flex-1 flex flex-col">
          <p className="text-gray-800 font-medium mb-1 line-clamp-2" style={{ minHeight: '32px', fontSize: '11px' }}>
            {product.name}
          </p>
          <div className="flex flex-wrap items-center gap-1 mb-1">
            <div className="flex text-yellow-400 text-xs gap-0.5">
              {renderStars(rating)}
            </div>
            <span className="text-gray-400 text-xs">({rating.toFixed(1)})</span>
            {totalReviews > 0 && (
              <span className="text-gray-400 text-xs">{totalReviews} reviews</span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-xs" style={{ color: '#059669' }}>{product.price}</span>
            <span className="text-gray-400 line-through text-xs">{product.originalPrice}</span>
          </div>

          {/* You saved — hidden on hover */}
          <p
            className="mb-2 transition-all"
            style={{
              color: '#7c3aed',
              fontSize: '13px',
              fontWeight: '600',
              opacity: hovered ? 0 : 1,
              transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
              transition: hovered
                ? 'opacity 0.2s ease, transform 0.2s ease'
                : 'opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s',
              height: hovered ? '0' : 'auto',
              overflow: 'hidden',
            }}
          >
            You saved RM {product.savings}
          </p>

          {/* Add to Cart — shown on hover */}
          <button 
            className="w-full py-1.5 rounded-lg text-gray-800 text-xs font-semibold transition-all mt-auto flex items-center justify-center gap-2"
            style={{
              background: '#f8e537',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(20px)',
              transition: hovered
                ? 'opacity 0.3s ease, transform 0.3s ease'
                : 'opacity 0.2s ease, transform 0.2s ease',
              pointerEvents: hovered ? 'auto' : 'none',
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onAddToCart) {
                onAddToCart(product.id);
              }
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10-9l2 9m-6 0h6" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

const CategorySkeleton = ({ count = 12 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`category-skeleton-${index}`}
        className="flex-shrink-0 flex flex-col items-center gap-1"
        style={{ minWidth: '70px' }}
      >
        <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
      </div>
    ))}
  </>
);

const ProductCardSkeleton = ({ count = 6 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`product-skeleton-${index}`}
        className="bg-white rounded-xl overflow-hidden"
        style={{
          width: '100%',
          height: '290px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <div className="h-[140px] bg-gray-200 animate-pulse" />
        <div className="p-3 space-y-2">
          <div className="h-3 w-4/5 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-3/5 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
          <div className="h-7 w-full rounded bg-gray-200 animate-pulse mt-5" />
        </div>
      </div>
    ))}
  </>
);

// ─── Section with Side Image Card ────────────────────────────────────────────
const ProductSection = ({
  title,
  products,
  sideColor = '#7c3aed',
  sideEmoji = '🛒',
  sideLabel = 'UP TO 60% OFF',
  onAddToCart,
  productRatings = {},
}) => {
  const [ref, visible] = useScrollAnimation();
  return (
    <div
      ref={ref}
      className="mb-12"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.6s ease',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        <button className="flex items-center gap-1 text-sm font-semibold transition" style={{ color: '#7c3aed' }}>
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Side promo card */}
        <div
          className="hidden lg:flex flex-col items-center justify-center rounded-xl text-white p-4 text-center"
          style={{ background: sideColor, minHeight: '220px' }}
        >
          <div className="text-4xl mb-3">{sideEmoji}</div>
          <p className="font-black text-lg leading-tight">{sideLabel}</p>
        </div>
        {products.map((p, i) => {
          const rating = productRatings[p.id] || { average_rating: 0, total_reviews: 0 };
          return (
            <ProductCard 
              key={p.id} 
              product={p} 
              delay={i * 60} 
              onAddToCart={onAddToCart}
              rating={rating.average_rating}
              totalReviews={rating.total_reviews}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Welcome Component ───────────────────────────────────────────────────
const Welcome = ({
  categories: dbCategories = [],
  topPicks: dbTopPicks = [],
  dealsOfTheDay: dbDealsOfTheDay = [],
}) => {
  // Initialize form for add to cart
 const { post, processing, reset, setData } = useForm({
  product_id: null,
  quantity: 1,
});

const handleAddToCart = (productId) => {
  // console.log('Adding to cart:', productId);
  
  // Use router.post to send data directly
  router.post('/cart/add', {
    product_id: productId,
    quantity: 1,
  }, {
    onSuccess: () => {
      // console.log('Item added to cart successfully');
    },
    onError: (errors) => console.error('Error adding to cart:', errors),
  });
};
  

  // Prepare categories — use DB data or fallback to mock
  const displayCategories =
    dbCategories.length > 0
      ? dbCategories.map((cat, idx) => ({
          id: cat.id,
          name: cat.category || cat.name,
          icon: categories[idx]?.icon || '🏷️',
          color: categories[idx]?.color || '#7c3aed',
          image: cat.image,
        }))
      : categories;

  const lowCategoryCount = displayCategories.length > 0 && displayCategories.length <= 6;
  const categoryGapClass = lowCategoryCount ? 'gap-0' : 'gap-3';
  const categoryItemWidth = lowCategoryCount ? 70 : 82;
  const categoryRepeatCount = displayCategories.length > 0
    ? Math.max(2, Math.ceil(16 / displayCategories.length))
    : 2;
  const repeatedCategories = Array.from({ length: categoryRepeatCount }, (_, repeatIndex) =>
    displayCategories.map((category) => ({
      ...category,
      repeatKey: `${category.id}-${repeatIndex}`,
    }))
  ).flat();

  const parseNumericValue = (value) => {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }

    if (typeof value !== 'string') {
      return 0;
    }

    const cleaned = value.replace(/,/g, '').replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatCurrency = (value, decimals = 0) => `RM ${parseNumericValue(value).toFixed(decimals)}`;

  const formatPercentage = (value) => `${Math.round(parseNumericValue(value))}%`;

  const calculateDiscount = (basePrice, discountValue = 0, discountType = 'percentage') => {
    const price = parseNumericValue(basePrice);
    const value = parseNumericValue(discountValue);

    if (price <= 0 || value <= 0) {
      return { finalPrice: price, savings: 0 };
    }

    const normalizedType = String(discountType || 'percentage').toLowerCase();
    const savings = normalizedType === 'fixed'
      ? value
      : (price * value) / 100;

    const clampedSavings = Math.min(price, Math.max(0, savings));
    return {
      finalPrice: Math.max(0, price - clampedSavings),
      savings: clampedSavings,
    };
  };

  const getDealProductPricing = (product) => {
    const originalPrice = parseNumericValue(product.price);

    const hasDealPercentage = parseNumericValue(product.discount_percentage_deal) > 0;
    const dealType = hasDealPercentage ? 'percentage' : 'fixed';
    const dealValue = hasDealPercentage
      ? parseNumericValue(product.discount_percentage_deal)
      : parseNumericValue(product.discount_amount);

    // Deal products should use only deal discount (do not stack product discount)
    const dealDiscount = calculateDiscount(originalPrice, dealValue, dealType);
    const finalPrice = dealDiscount.finalPrice;
    const totalSavings = dealDiscount.savings;
    const totalDiscountPercentage = originalPrice > 0 ? (totalSavings / originalPrice) * 100 : 0;

    return {
      originalPrice,
      finalPrice,
      totalSavings,
      totalDiscountPercentage,
    };
  };

  // Helper to map a raw DB product to display shape
  const mapProduct = (p, fallbackDiscount = 20) => {
    const originalPrice = parseNumericValue(p.price);
    const discountValue = p.discount_price ?? fallbackDiscount;
    const discountType = p.discount_type || 'percentage';
    const { finalPrice, savings } = calculateDiscount(originalPrice, discountValue, discountType);
    const discountPercentage = originalPrice > 0 ? (savings / originalPrice) * 100 : 0;

    return {
      id: p.id,
      name: p.name,
      price: formatCurrency(finalPrice),
      originalPrice: formatCurrency(originalPrice),
      discount: formatPercentage(discountPercentage),
      image: p.image,
      savings: Math.round(savings),
    };
  };

  const displayTopPicks      = dbTopPicks.length > 0      ? dbTopPicks.map((p) => mapProduct(p))      : topPicks;
  const displayDealsOfTheDay = dbDealsOfTheDay.length > 0 ? dbDealsOfTheDay.map((p) => mapProduct(p)) : dealsOfTheDay;

  // ── State ──
  const [currentSlide, setCurrentSlide]             = useState(0);
  const [categoryScrollPosition, setCategoryScrollPosition] = useState(0);
  const [deals, setDeals]                           = useState([]);
  const [loadingDeals, setLoadingDeals]             = useState(false);
  const [hoveredDealProductId, setHoveredDealProductId]   = useState(null);
  const [selectedDealTabId, setSelectedDealTabId]   = useState(null);
  const [countdown, setCountdown]                   = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [upcomingDeal, setUpcomingDeal]             = useState(null);
  const [dynamicCategories, setDynamicCategories]   = useState([]);
  const [loadingCategories, setLoadingCategories]   = useState(false);
  const [productRatings, setProductRatings]         = useState({}); // Store ratings by product ID
  const [isCategoryTickerPaused, setIsCategoryTickerPaused] = useState(false);

  const categoryScrollRef = useRef(null);
  const promoScrollRef    = useRef(null);

  // Fetch ratings for a batch of products
  const fetchProductRatings = useCallback(async (productIds) => {
    if (!productIds || productIds.length === 0) return;
    
    try {
      const ratingPromises = productIds.map(id =>
        fetch(`/api/reviews/product/${id}/average`)
          .then(res => res.ok ? res.json() : { average_rating: 0, total_reviews: 0 })
          .catch(() => ({ average_rating: 0, total_reviews: 0 }))
      );

      const ratings = await Promise.all(ratingPromises);
      const ratingMap = {};
      
      productIds.forEach((id, index) => {
        ratingMap[id] = ratings[index] || { average_rating: 0, total_reviews: 0 };
      });

      setProductRatings(prev => ({ ...prev, ...ratingMap }));
    } catch (error) {
      console.error('Error fetching product ratings:', error);
    }
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % carouselBanners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  // Fetch ratings for initial products
  useEffect(() => {
    const initialProductIds = [
      ...displayTopPicks.map(p => p.id),
      ...displayDealsOfTheDay.map(p => p.id),
      ...dealsYouMightLike.map(p => p.id),
    ].filter((id, idx, arr) => arr.indexOf(id) === idx);
    
    if (initialProductIds.length > 0) {
      fetchProductRatings(initialProductIds);
    }
  }, [fetchProductRatings]);

  // Fetch active deals
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoadingDeals(true);
        const response = await fetch('/api/deals/active');
        const data = await response.json();
        if (data.success && data.deals) {
          const availableDeals = data.deals.filter((deal) => deal.end_date);
          setDeals(availableDeals);
          if (availableDeals.length > 0) setSelectedDealTabId(availableDeals[0].id);
          
          // Fetch ratings for all deal products
          const dealProductIds = availableDeals
            .flatMap(deal => deal.products?.map(p => p.id) || [])
            .filter((id, idx, arr) => arr.indexOf(id) === idx);
          if (dealProductIds.length > 0) {
            fetchProductRatings(dealProductIds);
          }
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        setDeals([]);
      } finally {
        setLoadingDeals(false);
      }
    };
    fetchDeals();
  }, [fetchProductRatings]);

  // Fetch categories with products
  useEffect(() => {
    const fetchCategoriesWithProducts = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch('/api/products/categories-with-products');
        const data = await response.json();
        if (data.success && data.categories) {
          setDynamicCategories(data.categories);
          
          // Fetch ratings for all category products
          const categoryProductIds = data.categories
            .flatMap(cat => cat.products?.map(p => p.id) || [])
            .filter((id, idx, arr) => arr.indexOf(id) === idx);
          if (categoryProductIds.length > 0) {
            fetchProductRatings(categoryProductIds);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setDynamicCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategoriesWithProducts();
  }, [fetchProductRatings]);

  // Format product helper (for dynamic categories)
  const formatProduct = (product) => {
    const originalPrice = parseNumericValue(product.price);
    const { finalPrice, savings } = calculateDiscount(
      originalPrice,
      product.discount_price || 0,
      product.discount_type || 'percentage'
    );
    const discountPercentage = originalPrice > 0 ? (savings / originalPrice) * 100 : 0;

    return {
      id: product.id,
      name: product.name,
      price: formatCurrency(finalPrice),
      originalPrice: formatCurrency(originalPrice),
      discount: formatPercentage(discountPercentage),
      image: product.image,
      savings: Math.round(savings),
    };
  };

  // Seamless category scroll animation
  useEffect(() => {
    let animationFrameId;
    const totalWidth = displayCategories.length * categoryItemWidth;

    if (totalWidth <= 0) {
      setCategoryScrollPosition(0);
      return undefined;
    }

    if (isCategoryTickerPaused) {
      return undefined;
    }

    const animate = () => {
      setCategoryScrollPosition((prev) => {
        const next = prev + 0.5;
        return next >= totalWidth ? 0 : next; // seamless reset at exact boundary
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [displayCategories.length, categoryItemWidth, isCategoryTickerPaused]);

  // Countdown timer — tracks deal ending soonest
  useEffect(() => {
    if (deals.length === 0) return;

    const updateCountdown = () => {
      const now = new Date();
      let soonestDeal = null;
      let minTimeLeft = Infinity;

      deals.forEach((deal) => {
        const timeLeft = new Date(deal.end_date) - now;
        if (timeLeft > 0 && timeLeft < minTimeLeft) {
          minTimeLeft = timeLeft;
          soonestDeal = deal;
        }
      });

      if (soonestDeal) {
        setUpcomingDeal(soonestDeal);
        const timeRemaining = Math.max(0, new Date(soonestDeal.end_date) - now);
        const days    = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        setCountdown({
          days:    String(days).padStart(2, '0'),
          hours:   String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [deals]);

  return (
    <>

      <LoadingScreen isVisible={true} duration={2500} />
      <Navbar />
      <FlashMessage />
      <div className="min-h-screen" style={{ background: '#f8f7fa', fontFamily: "'Poppins', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
          .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes pulse-badge  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
          @keyframes ticker       { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          .ticker-track           { animation: ticker 30s linear infinite; display: flex; }
          .ticker-track:hover     { animation-play-state: paused; }
          @keyframes fadeInDown   { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
          .fade-in-down           { animation: fadeInDown 0.6s ease forwards; }
          @keyframes countdownPulse { 0%,100%{color:#ef4444} 50%{color:#f97316} }
        `}</style>

        <div className="px-4 py-4">

          {/* ── Scrolling Categories ── */}
          <div className="bg-white rounded-xl p-3 mb-6 overflow-hidden">
            <div className="flex gap-6">
              {/* Left: Promo Badges (slow parallax scroll) */}
              <div className="hidden lg:block flex-shrink-0 w-48 bg-gray-100 overflow-hidden rounded-lg">
                <div
                  ref={promoScrollRef}
                  className="flex gap-3 p-2"
                  style={{ transform: `translateX(-${categoryScrollPosition * 0.3}px)` }}
                >
                  {[...promoBadges, ...promoBadges].map((badge, index) => (
                    <div
                      key={`${badge.id}-${index}`}
                      className="rounded-xl p-3 flex-shrink-0 w-32 h-24 flex items-center justify-center text-center font-bold text-xs text-white shadow-md"
                      style={{ background: badge.gradient }}
                    >
                      {badge.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-gray-300 self-stretch"></div>

              {/* Right: Category Icons (scroll right-to-left) */}
              <div
                className="flex-1 overflow-hidden"
                onMouseEnter={() => setIsCategoryTickerPaused(true)}
                onMouseLeave={() => setIsCategoryTickerPaused(false)}
              >
                <div
                  ref={categoryScrollRef}
                  className={`flex ${categoryGapClass}`}
                  style={{ transform: `translateX(-${categoryScrollPosition}px)` }}
                >
                  {loadingCategories ? (
                    <CategorySkeleton count={14} />
                  ) : (
                    repeatedCategories.map((category, index) => (
                      <Link
                        key={category.repeatKey || `${category.id}-${index}`}
                        href={`/category/${category.id}`}
                        className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group text-decoration-none"
                        style={{ minWidth: '70px' }}
                      >
                        <div
                          className="w-14 h-14 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-md flex items-center justify-center text-xl"
                          style={{
                            background: (category.color || '#7c3aed') + '22',
                            border: `2px solid ${(category.color || '#7c3aed')}44`,
                          }}
                        >
                          {category.image ? (
                            <img
                              src={`/storage/${category.image}`}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{category.icon}</span>
                          )}
                        </div>
                        <span
                          className="text-xs text-center text-gray-700 font-medium line-clamp-2"
                          style={{ maxWidth: '80px' }}
                        >
                          {category.name}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Hero Carousel + Cashback Card ── */}
          <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Carousel — 2 cols */}
            <div
              className="md:col-span-2 relative rounded-2xl overflow-hidden"
              style={{ height: '300px', boxShadow: '0 10px 40px rgba(109,40,217,0.2)' }}
            >
              {carouselBanners.map((banner, i) => (
                <div
                  key={banner.id}
                  className="absolute inset-0 flex items-center"
                  style={{
                    background: banner.gradient,
                    opacity: i === currentSlide ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                    padding: '2rem',
                  }}
                >
                  <div className="relative z-10">
                    <span
                      className="inline-block px-3 py-1 rounded-full font-black mb-3"
                      style={{ ...banner.badgeStyle, fontSize: '11px' }}
                    >
                      {banner.badge}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                      {banner.title}
                    </h1>
                    <p className="text-white/80 text-sm mb-1">{banner.subtitle}</p>
                    <p className="text-white/60 text-xs mb-5">{banner.desc}</p>
                    <button
                      className="px-6 py-2.5 rounded-xl font-bold text-sm transition hover:scale-105 hover:shadow-lg"
                      style={banner.btnStyle}
                    >
                      Shop Now →
                    </button>
                  </div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl opacity-20 select-none">
                    {banner.emoji}
                  </div>
                </div>
              ))}

              {/* Prev / Next arrows */}
              {[
                { dir: 'prev', icon: 'M15 19l-7-7 7-7', pos: 'left-3'  },
                { dir: 'next', icon: 'M9 5l7 7-7 7',    pos: 'right-3' },
              ].map((btn) => (
                <button
                  key={btn.dir}
                  onClick={() =>
                    setCurrentSlide((p) =>
                      btn.dir === 'next'
                        ? (p + 1) % carouselBanners.length
                        : (p - 1 + carouselBanners.length) % carouselBanners.length
                    )
                  }
                  className={`absolute ${btn.pos} top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition`}
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.icon} />
                  </svg>
                </button>
              ))}

              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {carouselBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: i === currentSlide ? '24px' : '8px',
                      background: i === currentSlide ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Cashback card */}
            <div className="flex flex-col gap-4">
              <div
                className="flex-1 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-center cursor-pointer hover:scale-[1.02] transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
                  boxShadow: '0 10px 30px rgba(249,115,22,0.3)',
                }}
              >
                <h2 className="text-3xl font-black mb-1" style={{ color: '#1a0533' }}>3% Cashback</h2>
                <p className="text-sm mb-1" style={{ color: '#1a0533', opacity: 0.8 }}>On every Purchase</p>
                <p className="text-xs mb-4" style={{ color: '#1a0533', opacity: 0.7 }}>
                  On all purchases above RM 5000
                </p>
                <button
                  className="px-5 py-2 rounded-xl font-bold text-sm w-fit transition hover:opacity-90"
                  style={{ background: '#1a0533', color: '#f59e0b' }}
                >
                  Get up to 3% Cashback on your First Order
                </button>
                <div className="absolute -right-4 -bottom-4 text-7xl opacity-20 select-none">💰</div>
              </div>
            </div>
          </AnimatedSection>

          {/* ── Trending Deals Row ── */}
          {(loadingDeals || deals.length > 0) && (
          <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Trending Deals */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-sm text-gray-800">Trending Deals</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full text-white font-semibold"
                  style={{ background: '#ef4444', fontSize: '10px' }}
                >
                  ⚡ Active Now
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {loadingDeals ? (
                  [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3 bg-gray-200 animate-pulse"
                      style={{ minHeight: '80px' }}
                    />
                  ))
                ) : deals.length > 0 ? (
                  deals.slice(0, 4).map((deal, i) => (
                    <div
                      key={deal.id}
                      className="rounded-xl p-3 cursor-pointer hover:scale-105 transition-transform text-center"
                      style={{ background: '#8b5cf615', border: '1px solid #8b5cf633' }}
                    >
                      <div className="text-2xl mb-1">⚡</div>
                      <p className="text-xs font-semibold text-gray-700 line-clamp-2">{deal.title}</p>
                    </div>
                  ))
                ) : null}
              </div>
            </div>

            {/* Special Deals */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-gray-800">Top Picks For You</span>
                <span className="text-xs cursor-pointer" style={{ color: '#7c3aed' }}>View All ›</span>
              </div>
              <div className="space-y-3">
                {loadingDeals ? (
                  [1, 2].map((i) => (
                    <div key={i} className="flex gap-3 p-2 rounded-xl">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-4/5 rounded bg-gray-200 animate-pulse" />
                        <div className="h-3 w-2/5 rounded bg-gray-200 animate-pulse" />
                        <div className="h-3 w-3/5 rounded bg-gray-200 animate-pulse" />
                      </div>
                    </div>
                  ))
                ) : (
                displayTopPicks.slice(0, 2).map((p, i) => {
                  const rating = productRatings[p.id] || { average_rating: 0, total_reviews: 0 };
                  return (
                    <Link key={p.id} className="text-decoration-none" href={`/product/details/${p.id}`}>
                      <div className="flex gap-3 p-2 rounded-xl hover:bg-purple-50 transition cursor-pointer">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {p.image ? (
                            <img
                              src={`/storage/${p.image}`}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">📷</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 line-clamp-2 font-medium">{p.name}</p>
                          <div className="flex text-yellow-400 text-xs mt-0.5 gap-0.5">
                            {[...Array(5)].map((_, idx) => (
                              <svg
                                key={idx}
                                className="w-3 h-3"
                                fill={idx < Math.floor(rating.average_rating) ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({rating.average_rating.toFixed(1)})</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold" style={{ color: '#059669' }}>{p.price}</span>
                            <span className="line-through text-gray-400 text-xs">{p.originalPrice}</span>
                          </div>
                          <p className="text-xs font-semibold mt-0.5" style={{ color: '#7c3aed' }}>
                            You saved RM {p.savings}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                }))}
              </div>
            </div>

            {/* iPhone / Best Electronics */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="grid grid-cols-2 gap-3 h-full">
                <div
                  className="rounded-xl p-3 flex flex-col justify-between"
                  style={{ background: 'linear-gradient(135deg, #f8f7fa, #e5e7eb)' }}
                >
                  <div>
                    <p className="font-black text-gray-800 text-sm">iPhone</p>
                    <p className="text-xs text-gray-500 mt-1">LOWEST PRICE GUARANTEED</p>
                    <p className="text-xs text-gray-500">
                      Get Assured Cashback up to{' '}
                      <span className="font-bold text-orange-500">3%</span>
                    </p>
                  </div>
                  <div className="text-4xl text-center">📱</div>
                </div>
                <div
                  className="rounded-xl p-3 flex flex-col justify-between"
                  style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}
                >
                  <div>
                    <p className="font-black text-gray-800 text-sm">Best Electronics</p>
                    <p className="text-xs text-gray-500 mt-1">Top brands at best prices</p>
                  </div>
                  <div className="text-4xl text-center">💻</div>
                </div>
                <div
                  className="col-span-2 rounded-xl p-3"
                  style={{ background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' }}
                >
                  <p className="font-black text-sm text-pink-800">Fragrance Deals</p>
                  <p className="text-xs text-pink-600 mt-1">Up to 60% off on all perfumes</p>
                  <div className="flex gap-1 mt-2">
                    {['🌸', '🌺', '🌻'].map((e, i) => (
                      <span key={i} className="text-xl">{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
          )}

          {/* ── Deals of the Day with Tabs ── */}
          {(loadingDeals || deals.length > 0) && (
            <AnimatedSection className="mb-12">
              {/* Tabs */}
              <div className="mb-6">
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {loadingDeals
                    ? [1, 2, 3].map((skeletonTab) => (
                        <div
                          key={`tab-skeleton-${skeletonTab}`}
                          className="h-10 w-32 rounded-xl bg-gray-200 animate-pulse flex-shrink-0"
                        />
                      ))
                    : deals.map((deal) => (
                    <button
                      key={deal.id}
                      onClick={() => setSelectedDealTabId(deal.id)}
                      className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={
                        selectedDealTabId === deal.id
                          ? {
                              background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                              color: '#fff',
                              borderBottom: '3px solid #f59e0b',
                            }
                          : {
                              background: '#fff',
                              color: '#6b7280',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            }
                      }
                    >
                      {deal.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products for selected tab */}
              <div
                key={selectedDealTabId}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
                style={{ transition: 'opacity 0.4s ease' }}
              >
                {loadingDeals ? (
                  <ProductCardSkeleton count={5} />
                ) : selectedDealTabId &&
                deals.find((d) => d.id === selectedDealTabId)?.products ? (
                  deals
                    .find((d) => d.id === selectedDealTabId)
                    .products.slice(0, 6)
                    .map((product, i) => {
                      const isDealHovered = hoveredDealProductId === product.id;
                      const pricing = getDealProductPricing(product);
                      return (
                        <Link
                          key={`${product.id}-${i}`}
                          className="text-decoration-none"
                          href={`/product/details/${product.id}`}
                        >
                          <div
                            className="bg-white rounded-xl cursor-pointer relative overflow-hidden"
                            onMouseEnter={() => setHoveredDealProductId(product.id)}
                            onMouseLeave={() => setHoveredDealProductId(null)}
                            style={{
                              boxShadow: isDealHovered
                                ? '0 20px 40px rgba(109,40,217,0.15)'
                                : '0 2px 8px rgba(0,0,0,0.08)',
                              transition: 'all 0.3s ease',
                              width: '100%',
                              height: '290px',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            {pricing.totalDiscountPercentage > 0 && (
                              <div
                                className="absolute top-2 left-2 z-10 text-white font-bold px-2 py-0.5 rounded-full"
                                style={{ background: '#ef4444', fontSize: '10px' }}
                              >
                                {pricing.totalDiscountPercentage.toFixed(0)}% OFF
                              </div>
                            )}

                            <div
                              className="bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden"
                              style={{ height: '140px', width: '100%' }}
                            >
                              {product.image ? (
                                <img
                                  src={`/storage/${product.image}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-5xl opacity-30">📷</span>
                              )}
                            </div>

                            <div className="p-3 flex-1 flex flex-col">
                              <p
                                className="text-gray-800 font-medium mb-1 line-clamp-2"
                                style={{ minHeight: '32px', fontSize: '11px' }}
                              >
                                {product.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-1 mb-1">
                                <div className="flex text-yellow-400 text-xs gap-0.5">
                                  {[...Array(5)].map((_, idx) => {
                                    const rating = productRatings[product.id] || { average_rating: 0, total_reviews: 0 };
                                    return (
                                      <svg
                                        key={idx}
                                        className="w-3 h-3"
                                        fill={idx < Math.floor(rating.average_rating) ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                      </svg>
                                    );
                                  })}
                                </div>
                                <span className="text-gray-400 text-xs">({(productRatings[product.id]?.average_rating || 0).toFixed(1)})</span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-xs" style={{ color: '#059669' }}>
                                  RM {pricing.finalPrice.toFixed(2)}
                                </span>
                                <span className="text-gray-400 line-through text-xs">
                                  RM {Math.round(pricing.originalPrice)}
                                </span>
                              </div>

                              {/* You saved — hidden on hover */}
                              <p
                                className="mb-2 transition-all"
                                style={{
                                  color: '#7c3aed',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  opacity: isDealHovered ? 0 : 1,
                                  transform: isDealHovered ? 'translateY(-10px)' : 'translateY(0)',
                                  transition: isDealHovered
                                    ? 'opacity 0.2s ease, transform 0.2s ease'
                                    : 'opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s',
                                  height: isDealHovered ? '0' : 'auto',
                                  overflow: 'hidden',
                                }}
                              >
                                You saved RM {pricing.totalSavings.toFixed(2)}
                              </p>

                              {/* Add to Cart — shown on hover */}
                              <button
                                className="w-full py-1.5 rounded-lg text-gray-800 text-xs font-semibold transition-all mt-auto flex items-center justify-center gap-2"
                                style={{
                                  background: '#f8e537',
                                  opacity: isDealHovered ? 1 : 0,
                                  transform: isDealHovered ? 'translateY(0)' : 'translateY(20px)',
                                  transition: isDealHovered
                                    ? 'opacity 0.3s ease, transform 0.3s ease'
                                    : 'opacity 0.2s ease, transform 0.2s ease',
                                  pointerEvents: isDealHovered ? 'auto' : 'none',
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddToCart(product.id);
                                }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10-9l2 9m-6 0h6"
                                  />
                                </svg>
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500 text-sm">No products available for this deal</p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          )}

          {/* ── Deals You Might Like ── */}
          {(loadingDeals || deals.length > 0) && (
          <AnimatedSection className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Deals You Might Like</h2>
              <button className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#7c3aed' }}>
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Deal promo cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              {loadingDeals ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={`deal-card-skeleton-${i}`}
                    className="rounded-xl p-4 bg-gray-200 animate-pulse"
                    style={{ minHeight: '120px' }}
                  />
                ))
              ) : deals.length > 0 ? (
                deals.map((deal, i) => {
                  // Deterministic gradient colors derived from index (avoids random re-renders)
                  const gradientPairs = [
                    ['#4f46e5', '#7c3aed'], ['#0891b2', '#0284c7'],
                    ['#059669', '#10b981'], ['#dc2626', '#ef4444'],
                    ['#d97706', '#f59e0b'], ['#7c3aed', '#a855f7'],
                  ];
                  const [c1, c2] = gradientPairs[i % gradientPairs.length];
                  return (
                    <AnimatedSection
                      key={deal.id}
                      delay={i * 60}
                      className="rounded-xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center text-center"
                      style={{
                        minHeight: '120px',
                        background: `linear-gradient(135deg, ${c1}, ${c2})`,
                      }}
                    >
                      <div>
                        <p className="text-white font-bold text-sm line-clamp-2">{deal.title}</p>
                        <p className="text-white/80 text-xs mt-1">
                          Ends: {new Date(deal.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </AnimatedSection>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p>No active deals available</p>
                </div>
              )}
            </div>

            {/* Limited time deals countdown banner */}
            <div
              className="rounded-2xl p-4 mb-4 flex flex-col md:flex-row gap-4 items-center"
              style={{ background: 'linear-gradient(135deg, #1a0533, #4c1d95)' }}
            >
              <div className="flex-1">
                <span className="text-white font-black text-lg">Limited Time Deals</span>
                <div className="flex gap-2 mt-2 items-center">
                  {[countdown.days, countdown.hours, countdown.minutes, countdown.seconds].map((time, i) => (
                    <React.Fragment key={i}>
                      <span
                        className="bg-red-500 text-white font-black text-lg px-2 py-1 rounded-lg"
                        style={{ animation: 'countdownPulse 1s ease infinite' }}
                      >
                        {time}
                      </span>
                      {i < 3 && <span className="text-yellow-400 font-black">:</span>}
                    </React.Fragment>
                  ))}
                </div>
                {!loadingDeals && upcomingDeal && (
                  <p className="text-white/80 text-sm mt-2 font-semibold">{upcomingDeal.title}</p>
                )}
              </div>

              <div className="flex gap-3">
                {upcomingDeal && upcomingDeal.products && upcomingDeal.products.length > 0 ? (
                  (() => {
                    const maxDiscount = Math.max(
                      ...upcomingDeal.products.map((p) => {
                        return getDealProductPricing(p).totalDiscountPercentage;
                      })
                    );
                    return (
                      <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-white/20 transition min-w-[80px]">
                        <span className="font-black text-yellow-400 text-lg">UP TO</span>
                        <span className="font-black text-2xl">{Math.round(maxDiscount)}%</span>
                        <span className="text-xs opacity-80">OFF</span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-white/20 transition min-w-[80px]">
                    <span className="font-black text-yellow-400 text-lg">UP TO</span>
                    <span className="font-black text-2xl">60%</span>
                    <span className="text-xs opacity-80">OFF</span>
                  </div>
                )}
              </div>

              {!loadingDeals && upcomingDeal && (
                <div
                  className="rounded-xl overflow-hidden relative"
                  style={{
                    minWidth: '150px',
                    background: 'linear-gradient(135deg, #831843, #ec4899)',
                  }}
                >
                  <div className="p-3 text-white">
                    <p className="font-black">{upcomingDeal.title.substring(0, 15)}</p>
                    <p className="text-sm">
                      {upcomingDeal.products && upcomingDeal.products.length > 0
                        ? `${upcomingDeal.products.length} Products`
                        : 'Special Deal'}
                    </p>
                    <p className="text-xs opacity-80">Ending Soon!</p>
                  </div>
                  <div className="absolute right-2 bottom-2 text-3xl">⏰</div>
                </div>
              )}
            </div>
          </AnimatedSection>
          )}

          {/* ── Dynamic Categories with Products ── */}
          {loadingCategories ? (
            <AnimatedSection className="mb-12">
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, sectionIndex) => (
                  <div key={`dynamic-category-skeleton-${sectionIndex}`} className="space-y-4">
                    <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="w-full lg:w-64 h-64 rounded-2xl bg-gray-200 animate-pulse" />
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        <ProductCardSkeleton count={4} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          ) : (
            dynamicCategories.length > 0 && (
              dynamicCategories.map((cat, idx) => {
              const gradientStarts = ['#831843', '#065f46', '#1e3a5f', '#333', '#7c2d12', '#1a0533'];
              const gradientEnds   = ['#ec4899', '#10b981', '#2563eb', '#666', '#ea580c', '#4c1d95'];
              const g1 = gradientStarts[idx % gradientStarts.length];
              const g2 = gradientEnds[idx % gradientEnds.length];

              return (
                <AnimatedSection key={cat.id} className="mb-12" delay={idx * 100}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{cat.name}</h2>
                    <Link href={`/category/${cat.id}`} className="no-underline">
                      <button className="group relative px-6 py-2 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50" 
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                        <span className="relative z-10 flex items-center gap-2">
                          View All
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </button>
                    </Link>
                  </div>

                  {/* Category card + Products layout */}
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Category card - Left side */}
                    <div className="w-full h-full lg:w-64 flex-shrink-0" style={{height: '400px !important'}}>
                      <div
                        className="relative rounded-2xl p-6 text-white lg:h-73 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-transform overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${g1}, ${g2})`,
                          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        }}
                      >
                        {cat.image && (
                          <div className="absolute inset-0 opacity-10">
                            <img
                              src={`/storage/${cat.image}`}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className=" h-40 z-10 text-center" >
                          <p className="text-sm font-semibold opacity-90 mb-2">Browse Category</p>
                          <p className="text-3xl font-black mb-3">{cat.name}</p>
                          <div className="inline-block bg-white/20 px-4 py-2 rounded-full">
                            <span className="text-sm font-bold">{cat.productCount} Products</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Products grid - Right side */}
                    <div className="flex-1 w-full">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {cat.products && cat.products.length > 0 ? (
                          cat.products.map((product, i) => {
                            const rating = productRatings[product.id] || { average_rating: 0, total_reviews: 0 };
                            return (
                              <ProductCard
                                key={product.id}
                                product={formatProduct(product)}
                                delay={i * 60}
                                onAddToCart={handleAddToCart}
                                rating={rating.average_rating}
                                totalReviews={rating.total_reviews}
                              />
                            );
                          })
                        ) : (
                          <div className="col-span-full text-center py-8 text-gray-500">
                            <p>No products available in this category</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })
            )
          )}

          {/* ── Brand of the Week ── */}
          <AnimatedSection className="mb-12">
            <div
              className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #7c2d12, #ea580c, #f97316)',
                boxShadow: '0 20px 60px rgba(234,88,12,0.4)',
              }}
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 pointer-events-none" />
              <div className="relative z-10 text-center mb-6">
                <h2 className="text-3xl md:text-5xl font-black text-white">
                  BRAND <span style={{ color: '#f59e0b' }}>OF THE</span> WEEK
                </h2>
                <p className="text-orange-100 text-lg mt-2">Apple Products — Up to 20% Off</p>
                <button
                  className="mt-3 px-6 py-2 rounded-full font-bold text-sm"
                  style={{ background: '#f59e0b', color: '#7c2d12' }}
                >
                  More From Apple →
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
                {/* Products injected here by parent */}
              </div>
            </div>
          </AnimatedSection>

          {/* ── LIVE Update Banner ── */}
          <AnimatedSection className="mb-8">
            <div
              className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1a0533, #2d0a4e, #4c1d95)' }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-black mb-3"
                    style={{ background: '#f59e0b', color: '#1a0533' }}
                  >
                    NEW UPDATE
                  </span>
                  <h2
                    className="text-5xl font-black text-white mb-2"
                    style={{ textShadow: '0 0 40px rgba(139,92,246,0.5)' }}
                  >
                    LIVE
                  </h2>
                  <p className="text-purple-200 text-lg mb-4">Shopping Made Simple</p>
                  <button
                    className="px-8 py-3 rounded-xl font-bold"
                    style={{ background: '#f59e0b', color: '#1a0533' }}
                  >
                    Shop Now
                  </button>
                </div>
                <div className="flex gap-4">
                  <div
                    className="rounded-2xl p-5 text-center text-white"
                    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                  >
                    <div className="text-4xl mb-2">📱</div>
                    <p className="text-sm font-semibold">SCAN HERE</p>
                    <p className="text-xs opacity-70">To Update on Mobile</p>
                    <p className="text-xs opacity-50 mt-1">Download the App Now</p>
                  </div>
                  <div
                    className="rounded-2xl p-5 text-center text-white"
                    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                  >
                    <div className="text-4xl mb-2">💻</div>
                    <p className="text-sm font-semibold">Desktop</p>
                    <p className="text-xs opacity-70">Version Available</p>
                    <div className="flex gap-1 mt-2 justify-center">
                      <div className="bg-white rounded-md px-2 py-0.5 text-xs font-bold text-black">Android</div>
                      <div className="bg-white rounded-md px-2 py-0.5 text-xs font-bold text-black">iOS</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 text-9xl opacity-5 select-none pointer-events-none">🛒</div>
            </div>
          </AnimatedSection>

          {/* ── 4 Category Cards ── */}
          <AnimatedSection className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
            {[
              { icon: '📱', name: 'Mobile Phones', sub: 'Up to 30% off', color: '#10b981' },
              { icon: '💻', name: 'Laptops',       sub: 'Special Offers', color: '#8b5cf6' },
              { icon: '🎮', name: 'Gaming',        sub: 'New Arrivals',   color: '#ec4899' },
              { icon: '🎧', name: 'Audio',         sub: 'Best Deals',     color: '#3b82f6' },
            ].map((cat, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 text-white cursor-pointer hover:scale-105 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${cat.color}dd, ${cat.color})`,
                  boxShadow: `0 8px 24px ${cat.color}40`,
                }}
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h5 className="font-bold text-base">{cat.name}</h5>
                <p className="text-sm opacity-80">{cat.sub}</p>
              </div>
            ))}
          </AnimatedSection>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Welcome;