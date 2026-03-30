import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
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
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const [ref, visible] = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
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
  { id: 1, name: 'Home & Kitchen', icon: '🏠', color: '#FF6B6B' },
  { id: 2, name: 'Fashion', icon: '👔', color: '#4ECDC4' },
  { id: 3, name: 'Health & Beauty', icon: '💄', color: '#45B7D1' },
  { id: 4, name: 'Toys & Games', icon: '🎮', color: '#96CEB4' },
  { id: 5, name: 'Sports & Fitness', icon: '🚴', color: '#DDA0DD' },
  { id: 6, name: 'Baby & Mother Care', icon: '🍼', color: '#98D8C8' },
  { id: 7, name: 'Tools & Hardware', icon: '🔧', color: '#F7DC6F' },
  { id: 8, name: 'Pet Supplies', icon: '🐾', color: '#BB8FCE' },
  { id: 9, name: 'Home Furnishing', icon: '🛋️', color: '#85C1E2' },
  { id: 10, name: 'Stationery', icon: '📚', color: '#F8B739' },
  { id: 11, name: 'Automotive', icon: '🚗', color: '#52BE80' },
  { id: 12, name: 'School Essentials', icon: '🎒', color: '#AF7AC5' },
  { id: 13, name: 'Mobile Phones', icon: '📱', color: '#EC7063' },
  { id: 14, name: 'Laptops', icon: '💻', color: '#5DADE2' },
  { id: 15, name: 'Gaming', icon: '🕹️', color: '#82E0AA' },
];

const promoBadges = [
  { id: 1, text: 'TIME TO PARTY', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  { id: 2, text: 'GRAB IT CLEARANCE', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
  { id: 3, text: 'PRE-OWNED PRODUCTS', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
  { id: 4, text: 'Saver ZONE', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
  { id: 5, text: 'Deal of the Day', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 6, text: 'PRO GADGETS', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  { id: 7, text: 'Perfume Fiesta', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
];

const makeProducts = (names) => names.map((name, i) => ({
  id: i + 1, name,
  price: `PKR ${(Math.floor(Math.random() * 50) + 1) * 999}`,
  originalPrice: `PKR ${(Math.floor(Math.random() * 70) + 30) * 999}`,
  discount: `${Math.floor(Math.random() * 25) + 15}%`,
}));

const topPicks = makeProducts(['Wireless Mouse', 'Mechanical Keyboard', 'Webcam HD 1080p', 'USB Hub 7-Port', 'Monitor Stand', 'Laptop Cooling Pad']);
const dealsOfTheDay = makeProducts(['Smart Watch Pro', 'Fitness Tracker', 'Power Bank 20000mAh', 'Phone Case Premium', 'Screen Protector', 'Charging Cable']);
const dealsYouMightLike = makeProducts(['Gaming Mouse Pad XL', 'LED Desk Lamp', 'Phone Holder Stand', 'Cable Organizer', 'Laptop Sleeve 15"', 'Wireless Charger']);
const perfumes = makeProducts(['Creed Aventus 100ml', 'La Perla Fragrance', 'La Perla Oud 100ml', 'Hugo Boss Bottled', 'Hugo Boss Black', 'Gift Set']);
const games = makeProducts(['PlayStation 5', 'Xbox Series X', 'Gaming Controller', 'VR Headset', 'Gaming Headset Pro', 'Gaming Keyboard RGB']);
const mobilePhones = makeProducts(['Xiaomi Mobile', 'New Unlck Design Flip', 'Apple iPhone 15 Pro', 'Samsung Galaxy A26', 'Dell 2IN1 Mixed', 'Apple iPhone 15 Pro Max']);
const brandOfWeek = makeProducts(['Apple Pencil Pro 2nd', 'Apple MXL82LL/A USB-C', 'Apple MXL82LL/A USB-C', 'Apple MXL82LL/A USB-C 4.5W']);
const laptops = makeProducts(['Apple MacBook Pro M5', 'Apple MacBook Pro M5 18"', 'Dell Pro 24 All-in-One', 'Dell Pro 24 All-in-One', 'Dell Pro 24 All-in-One 60', 'Dell Pro 24 All-in-One']);
const healthCare = makeProducts(['Oharmonic Digital Personal Scale', 'Belur Lumbar Black Relief Pad', 'KANPHO Digital Mattress', 'KANPHO Portable Travel Scale', 'KANPHO Smart Scale', 'Oharmonic Digital Scale']);
const gamingChairs = makeProducts(['Next Level Dedicated Height...', 'Max Strength Ergonomic...', 'Max Strength Office Gaming...', 'Max Strength Gaming Chair...', 'Max Strength Gaming...', 'Max Strength Ergonomic...']);
const speakers = makeProducts(['Xiaomi DeskTop Speaker', 'Tango Nainino Mini Smart', 'JBL Portable Bluetooth Speaker', 'Impex 8-inch Portable', 'Xiaomi Sound Outdoor Speaker', 'Other Speaker']);

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, delay = 0 }) => {
  const [ref, visible] = useScrollAnimation();
  const [hovered, setHovered] = useState(false);

  return (
    <Link className='text-decoration-none' href={`/product/details/${product.id}`}>
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
        }}
      >
        {/* Discount badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 z-10 text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#ef4444', fontSize: '10px' }}>
            {product.discount} OFF
          </div>
        )}
        {/* Wishlist */}
        <button
          className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center transition-all"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0.8)' }}
          onClick={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        {/* Image placeholder */}
        <div
          className="bg-gray-50 flex items-center justify-center transition-transform duration-300"
          style={{ height: '140px', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        >
          {product.image ? (
            <img 
              src={`/storage/${product.image}`} 
              alt={product.name} 
              className="w-full h-full"
            />
          ) : (
            <span className="text-5xl opacity-30">📷</span>
          )}
        </div>

        <div className="p-3">
          <p className="text-gray-800 text-xs font-medium mb-1 line-clamp-2" style={{ minHeight: '32px', fontSize: '11px' }}>{product.name}</p>
          <div className="flex flex-wrap items-center gap-1 mb-1">
            <div className="flex text-yellow-400 text-xs">{'★★★★★'}</div>
            <span className="text-gray-400 text-xs">(4.2)</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-xs" style={{ color: '#059669' }}>{product.price}</span>
            <span className="text-gray-400 line-through text-xs">{product.originalPrice}</span>
          </div>
          <p className="text-xs mb-2" style={{ color: '#7c3aed' }}>You saved </p>
          <Link href={`/product/details/${product.id}`} className="text-decoration-none">
           <button
            className="w-full py-1.5 rounded-lg text-white text-xs font-semibold transition-all"
            style={{
              background: hovered ? 'linear-gradient(135deg, #7c3aed, #4c1d95)' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
            }}
            
          >
            View Details
          </button>
          </Link>
          
        </div>
      </div>
    </Link>
  );
};

// ─── Section with Side Image Card ────────────────────────────────────────────
const ProductSection = ({ title, products, sideColor = '#7c3aed', sideEmoji = '🛒', sideLabel = 'UP TO 60% OFF' }) => {
  const [ref, visible] = useScrollAnimation();
  return (
    <div ref={ref} className="mb-12" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        <button className="flex items-center gap-1 text-sm font-semibold transition" style={{ color: '#7c3aed' }}>
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Side card */}
        <div className="hidden lg:flex flex-col items-center justify-center rounded-xl text-white p-4 text-center" style={{ background: sideColor, minHeight: '220px' }}>
          <div className="text-4xl mb-3">{sideEmoji}</div>
          <p className="font-black text-lg leading-tight">{sideLabel}</p>
        </div>
        {/* Products */}
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={i * 60} />
        ))}
      </div>
    </div>
  );
};

// ─── Main Welcome Component ───────────────────────────────────────────────────
const Welcome = ({ categories: dbCategories = [], topPicks: dbTopPicks = [], dealsOfTheDay: dbDealsOfTheDay = [] }) => {
  // Prepare categories for display - use database categories or fallback to mock
  const displayCategories = dbCategories.length > 0 
    ? dbCategories.map((cat, idx) => ({ 
        id: cat.id, 
        name: cat.name, 
        icon: categories[idx]?.icon || '🏷️', 
        color: categories[idx]?.color || '#7c3aed',
        image: cat.image 
      })) 
    : categories;

  // Prepare products - use database or fallback to mock
  const displayTopPicks = dbTopPicks.length > 0 
    ? dbTopPicks.map(p => ({
        id: p.id,
        name: p.name,
        price: `PKR ${p.price || 0}`,
        originalPrice: p.discount_price ? `PKR ${p.discount_price}` : `PKR ${(p.price * 1.2).toFixed(0)}`,
        discount: p.discount_price ? `${Math.round((1 - p.discount_price / p.price) * 100)}%` : '0%',
        image: p.image,
      }))
    : topPicks;

  const displayDealsOfTheDay = dbDealsOfTheDay.length > 0
    ? dbDealsOfTheDay.map(p => ({
        id: p.id,
        name: p.name,
        price: `PKR ${p.price || 0}`,
        originalPrice: `PKR ${(p.price * 1.2).toFixed(0)}`,
        discount: '20%',
        image: p.image,
      }))
    : dealsOfTheDay;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [categoryScrollPosition, setCategoryScrollPosition] = useState(0);
  const categoryScrollRef = useRef(null);
  const promoScrollRef = useRef(null);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % carouselBanners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  // Smooth scrolling animation with seamless looping
  useEffect(() => {
    let animationFrameId;
    let scrollPos = 0;
    const itemWidth = 120; // approximate width of each category item (w-20 + gap)
    const totalWidth = displayCategories.length * itemWidth; // one set of categories
    
    const animate = () => {
      scrollPos += 1;
      // Reset to 0 after reaching the end of one full scroll cycle
      setCategoryScrollPosition(scrollPos % totalWidth);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <>
    <Navbar />
    <div className="min-h-screen" style={{ background: '#f8f7fa', fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse-badge { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-track { animation: ticker 30s linear infinite; display: flex; }
        .ticker-track:hover { animation-play-state: paused; }
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        .fade-in-down { animation: fadeInDown 0.6s ease forwards; }
        @keyframes countdownPulse { 0%,100%{color:#ef4444} 50%{color:#f97316} }
      `}</style>

      <div className="px-1  py">

        {/* ── Scrolling Categories Section - Previous Design ── */}
        <div className="bg-white rounded-xl p-1 mb-6 overflow-hidden">
          <div className="flex gap-6">
            {/* Left Side - Promotional Badges (Scrolling) */}
            <div className="hidden lg:flex flex-shrink-0 w-48 bg-gray-100 overflow-hidden rounded-lg">
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
            <div className="hidden lg:block w-px bg-gray-300"></div>

            {/* Right Side - Category Icons (Scrolling Right to Left) */}
            <div className="flex-1 overflow-hidden">
              <div 
                ref={categoryScrollRef}
                className="flex gap-3"
                style={{ transform: `translateX(-${categoryScrollPosition}px)` }}
              >
                {[...displayCategories, ...displayCategories].map((category, index) => (
                  <div 
                    key={`${category.id}-${index}`}
                    className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group min-w-[70px]"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-md flex items-center justify-center text-xl"
                      style={{ background: category.color + '22', border: `2px solid ${category.color}44` }}
                    >
                      <img src={`/storage/${category.image}`} alt={category.name} />
                    </div>
                    <span className="text-xs text-center text-gray-700 font-medium line-clamp-2 max-w-[70px]">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Hero Carousel + Cashback Card ── */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Carousel — 2 cols */}
          <div className="md:col-span-2 relative rounded-2xl overflow-hidden" style={{ height: '300px', boxShadow: '0 10px 40px rgba(109,40,217,0.2)' }}>
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
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-black mb-3" style={{ ...banner.badgeStyle, fontSize: '11px' }}>
                    {banner.badge}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">{banner.title}</h1>
                  <p className="text-white/80 text-sm mb-1">{banner.subtitle}</p>
                  <p className="text-white/60 text-xs mb-5">{banner.desc}</p>
                  <button className="px-6 py-2.5 rounded-xl font-bold text-sm transition hover:scale-105 hover:shadow-lg" style={banner.btnStyle}>
                    Shop Now →
                  </button>
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl opacity-20 select-none">{banner.emoji}</div>
              </div>
            ))}

            {/* Arrows */}
            {[
              { dir: 'prev', icon: 'M15 19l-7-7 7-7', pos: 'left-3' },
              { dir: 'next', icon: 'M9 5l7 7-7 7', pos: 'right-3' },
            ].map(btn => (
              <button
                key={btn.dir}
                onClick={() => setCurrentSlide(p => btn.dir === 'next' ? (p + 1) % carouselBanners.length : (p - 1 + carouselBanners.length) % carouselBanners.length)}
                className={`absolute ${btn.pos} top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition`}
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.icon}/></svg>
              </button>
            ))}

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {carouselBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className="h-2 rounded-full transition-all"
                  style={{ width: i === currentSlide ? '24px' : '8px', background: i === currentSlide ? '#f59e0b' : 'rgba(255,255,255,0.5)' }}
                />
              ))}
            </div>
          </div>

          {/* Cashback + App Cards */}
          <div className="flex flex-col gap-4">
            <div
              className="flex-1 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-center cursor-pointer hover:scale-[1.02] transition-transform"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)', boxShadow: '0 10px 30px rgba(249,115,22,0.3)' }}
            >
              <h2 className="text-3xl font-black mb-1" style={{ color: '#1a0533' }}>3% Cashback</h2>
              <p className="text-sm mb-1" style={{ color: '#1a0533', opacity: 0.8 }}>On every Purchase</p>
              <p className="text-xs mb-4" style={{ color: '#1a0533', opacity: 0.7 }}>On all purchases above PKR 5000</p>
              <button className="px-5 py-2 rounded-xl font-bold text-sm w-fit transition hover:opacity-90" style={{ background: '#1a0533', color: '#f59e0b' }}>
                Get up to 3% Cashback on your First Order
              </button>
              <div className="absolute -right-4 -bottom-4 text-7xl opacity-20 select-none">💰</div>
            </div>
          </div>
        </AnimatedSection>

        {/* ── Trending Deals Row (Image 1 center section) ── */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Trending Deals */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-sm text-gray-800">Trending Deals</span>
              <span className="text-xs px-2 py-0.5 rounded-full text-white font-semibold" style={{ background: '#ef4444', fontSize: '10px' }}>● Offline for you</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[{ icon: '🏠', label: 'Home Appliances', color: '#8b5cf6' }, { icon: '🎧', label: 'Accessories', color: '#3b82f6' }, { icon: '💻', label: 'Pre-owned Laptops', color: '#10b981' }, { icon: '📱', label: 'Pre-owned Mobiles', color: '#f59e0b' }].map((item, i) => (
                <div key={i} className="rounded-xl p-3 cursor-pointer hover:scale-105 transition-transform text-center" style={{ background: item.color + '15', border: `1px solid ${item.color}33` }}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Special Deals */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-gray-800">Special Deals</span>
              <span className="text-xs" style={{ color: '#7c3aed', cursor: 'pointer' }}>View All ›</span>
            </div>
            <div className="space-y-3">
              {displayTopPicks.slice(0, 2).map((p, i) => (
                <Link key={i} className='text-decoration-none' href={`/product/details/${p.id}`}>
                  <div className="flex gap-3 p-2 rounded-xl hover:bg-purple-50 transition cursor-pointer">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-3xl 
                     overflow-hidden">
                      {p.image ? (
                        <img 
                          src={`/storage/${p.image}`} 
                          alt={p.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>📷</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-700 line-clamp-2 font-medium">{p.name}</p>
                      <div className="flex text-yellow-400 text-xs mt-0.5">★★★★☆</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold" style={{ color: '#059669' }}>{p.price}</span>
                        <span className="line-through text-gray-400 text-xs">{p.originalPrice}</span>
                      </div>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: '#7c3aed' }}>You saved ₨ 
                        20
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* iPhone / Best Electronics */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div className="grid grid-cols-2 gap-3 h-full">
              <div className="rounded-xl p-3 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #f8f7fa, #e5e7eb)' }}>
                <div>
                  <p className="font-black text-gray-800 text-sm">iPhone</p>
                  <p className="text-xs text-gray-500 mt-1">LOWEST PRICE GUARANTEED</p>
                  <p className="text-xs text-gray-500">Get Assured Cashback up to <span className="font-bold text-orange-500">3%</span></p>
                </div>
                <div className="text-4xl text-center">📱</div>
              </div>
              <div className="rounded-xl p-3 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                <div>
                  <p className="font-black text-gray-800 text-sm">Best Electronics</p>
                  <p className="text-xs text-gray-500 mt-1">Top brands at best prices</p>
                </div>
                <div className="text-4xl text-center">💻</div>
              </div>
              <div className="col-span-2 rounded-xl p-3" style={{ background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' }}>
                <p className="font-black text-sm text-pink-800">Fragrance Deals</p>
                <p className="text-xs text-pink-600 mt-1">Up to 60% off on all perfumes</p>
                <div className="flex gap-1 mt-2">
                  {['🌸', '🌺', '🌻'].map((e, i) => <span key={i} className="text-xl">{e}</span>)}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ── Tab Section (Deals of the Day tabs) ── */}
        <AnimatedSection className="mb-8">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {['Deals Of The Day', 'Bundle Deals', 'Exciting Offers', 'Top Selling', 'Saver Zone', 'Clearance Deals'].map((tab, i) => (
              <button
                key={i}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={i === 0 ? { background: 'linear-gradient(135deg, #7c3aed, #4c1d95)', color: '#fff' } : { background: '#fff', color: '#6b7280', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* ── Top Picks ── */}
        <ProductSection title="Top Picks" products={displayTopPicks} sideColor="linear-gradient(135deg, #7c3aed, #4c1d95)" sideEmoji="🏆" sideLabel="TOP PICKS" />

        {/* ── Deals of the Day ── */}
        <ProductSection title="Deals Of The Day" products={displayDealsOfTheDay} sideColor="linear-gradient(135deg, #dc2626, #991b1b)" sideEmoji="⏰" sideLabel="UP TO 70% OFF" />

        {/* ── Deals You Might Like ── */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Deals You Might Like</h2>
            <button className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#7c3aed' }}>View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg></button>
          </div>
          {/* Promo banner cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Skin Care', sub: 'Up to 60% off', color: '#10b981', emoji: '🧴' },
              { label: 'My List', sub: 'Saved Items', color: '#8b5cf6', emoji: '📋' },
              { label: 'Sports-Fitness', sub: 'Up to 50% off', color: '#f59e0b', emoji: '🏋️' },
              { label: 'Gaming Accessories', sub: 'Up to 60% off', color: '#3b82f6', emoji: '🎮' },
            ].map((item, i) => (
              <AnimatedSection
                key={i} delay={i * 80}
                className="rounded-xl p-4 cursor-pointer hover:scale-105 transition-transform text-white flex items-center gap-3"
                style={{ background: `linear-gradient(135deg, ${item.color}cc, ${item.color})` }}
              >
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-xs opacity-80">{item.sub}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          {/* Limited time deals banner */}
          <div className="rounded-2xl p-4 mb-4 flex flex-col md:flex-row gap-4" style={{ background: 'linear-gradient(135deg, #1a0533, #4c1d95)' }}>
            <div className="flex-1">
              <span className="text-white font-black text-lg">Limited Time Deals</span>
              <div className="flex gap-2 mt-2">
                {['00', '24', '44', '11'].map((t, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="bg-red-500 text-white font-black text-lg px-2 py-1 rounded-lg">{t}</span>
                    {i < 3 && <span className="text-yellow-400 font-black">:</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              {[{ d: '50%', label: 'Speakers' }, { d: '70%', label: 'Watches' }, { d: '40%', label: 'Perfumes' }].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-white/20 transition min-w-[80px]">
                  <span className="font-black text-yellow-400 text-lg">UP TO</span>
                  <span className="font-black text-2xl">{item.d}</span>
                  <span className="text-xs opacity-80">{item.label}</span>
                </div>
              ))}
            </div>
            {/* Perfume */}
            <div className="rounded-xl overflow-hidden min-w-[150px] relative" style={{ background: 'linear-gradient(135deg, #831843, #ec4899)' }}>
              <div className="p-3 text-white">
                <p className="font-black">PERFUME</p>
                <p className="text-sm">Up to 40% OFF</p>
                <p className="text-xs opacity-80">HEALTH-BEAUTY Up to 50% off</p>
              </div>
              <div className="absolute right-2 bottom-2 text-3xl">🌸</div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {dealsYouMightLike.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 60} />)}
          </div>
        </AnimatedSection>

        {/* ── Perfumes ── */}
        <ProductSection title="Perfumes" products={perfumes} sideColor="linear-gradient(135deg, #831843, #db2777)" sideEmoji="🌸" sideLabel="UP TO 70% OFF" />

        {/* ── Games ── */}
        <ProductSection title="Games" products={games} sideColor="linear-gradient(135deg, #065f46, #10b981)" sideEmoji="🎮" sideLabel="UP TO 60% OFF" />

        {/* ── Mobile Phones ── */}
        <ProductSection title="Mobile Phones" products={mobilePhones} sideColor="linear-gradient(135deg, #1e3a5f, #2563eb)" sideEmoji="📱" sideLabel="UP TO 60% OFF" />

        {/* ── Brand of the Week ── */}
        <AnimatedSection className="mb-12">
          <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c2d12, #ea580c, #f97316)', boxShadow: '0 20px 60px rgba(234,88,12,0.4)' }}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
            <div className="relative z-10 text-center mb-6">
              <h2 className="text-3xl md:text-5xl font-black text-white">
                BRAND <span style={{ color: '#f59e0b' }}>OF THE</span> WEEK
              </h2>
              <p className="text-orange-100 text-lg mt-2">Apple Products — Up to 20% Off</p>
              <button className="mt-3 px-6 py-2 rounded-full font-bold text-sm" style={{ background: '#f59e0b', color: '#7c2d12' }}>
                More From Apple →
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
              {brandOfWeek.map((p, i) => (
                <Link key={p.id} className='text-decoration-none' href={`/products/${p.id}`}>
                  <AnimatedSection delay={i * 100} className="bg-white rounded-2xl p-3 hover:scale-105 transition-transform cursor-pointer">
                    <div className="bg-gray-50 rounded-xl h-36 flex items-center justify-center mb-3 text-5xl opacity-30 overflow-hidden">
                      {p.image ? (
                        <img 
                          src={`/storage/${p.image}`} 
                          alt={p.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>📷</span>
                      )}
                    </div>
                    <p className="text-gray-800 text-xs font-semibold line-clamp-2 mb-2">{p.name}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs font-bold" style={{ color: '#059669' }}>{p.price}</span>
                      <span className="line-through text-gray-400 text-xs">{p.originalPrice}</span>
                    </div>
                    <button className="w-full py-2 rounded-xl text-white text-xs font-bold mb-2" style={{ background: '#10b981' }} onClick={(e) => e.preventDefault()}>View Details</button>
                    <button className="w-full py-2 rounded-xl text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95)' }} onClick={(e) => e.preventDefault()}>Add to Cart</button>
                  </AnimatedSection>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ── Laptops ── */}
        <ProductSection title="Laptops" products={laptops} sideColor="linear-gradient(135deg, #1e3a5f, #1d4ed8)" sideEmoji="💻" sideLabel="UP TO 60% OFF" />

        {/* ── Health Care ── */}
        <ProductSection title="Health Care Products" products={healthCare} sideColor="linear-gradient(135deg, #14532d, #16a34a)" sideEmoji="❤️" sideLabel="UP TO 60% OFF" />

        {/* ── LIVE Update Banner ── */}
        <AnimatedSection className="mb-8">
          <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0533, #2d0a4e, #4c1d95)' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black mb-3" style={{ background: '#f59e0b', color: '#1a0533' }}>NEW UPDATE</span>
                <h2 className="text-5xl font-black text-white mb-2" style={{ textShadow: '0 0 40px rgba(139,92,246,0.5)' }}>LIVE</h2>
                <p className="text-purple-200 text-lg mb-4">Shopping Made Simple</p>
                <button className="px-8 py-3 rounded-xl font-bold" style={{ background: '#f59e0b', color: '#1a0533' }}>Shop Now</button>
              </div>
              <div className="flex gap-4">
                <div className="rounded-2xl p-5 text-center text-white" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-sm font-semibold">SCAN HERE</p>
                  <p className="text-xs opacity-70">To Update on Mobile</p>
                  <p className="text-xs opacity-50 mt-1">Download the App Now</p>
                </div>
                <div className="rounded-2xl p-5 text-center text-white" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
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
            <div className="absolute top-0 right-0 text-9xl opacity-5 select-none">🛒</div>
          </div>
        </AnimatedSection>

        {/* ── Gaming Chairs & Desks ── */}
        <ProductSection title="Gaming Chairs & Desks" products={gamingChairs} sideColor="linear-gradient(135deg, #1a0533, #4c1d95)" sideEmoji="🪑" sideLabel="UP TO 60% OFF" />

        {/* ── Speakers & Audio Devices ── */}
        <ProductSection title="Speakers & Audio Devices" products={speakers} sideColor="linear-gradient(135deg, #7c2d12, #ea580c)" sideEmoji="🔊" sideLabel="UP TO 70% OFF" />

        {/* ── 4 Category Cards ── */}
        <AnimatedSection className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {[
            { icon: '📱', name: 'Mobile Phones', sub: 'Up to 30% off', color: '#10b981' },
            { icon: '💻', name: 'Laptops', sub: 'Special Offers', color: '#8b5cf6' },
            { icon: '🎮', name: 'Gaming', sub: 'New Arrivals', color: '#ec4899' },
            { icon: '🎧', name: 'Audio', sub: 'Best Deals', color: '#3b82f6' },
          ].map((cat, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 text-white cursor-pointer hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${cat.color}dd, ${cat.color})`, boxShadow: `0 8px 24px ${cat.color}40` }}
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