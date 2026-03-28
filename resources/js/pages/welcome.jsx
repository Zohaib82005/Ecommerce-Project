import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categoryScrollPosition, setCategoryScrollPosition] = useState(0);
  const categoryScrollRef = useRef(null);
  const promoScrollRef = useRef(null);

  // Carousel Banners
  const carouselBanners = [
    {
      id: 1,
      badge: "EXCLUSIVE DEALS",
      badgeColor: "bg-yellow-400 text-purple-900",
      title: "GET EXCLUSIVE DEALS",
      description: "Up to 50% off on selected items",
      gradient: "from-purple-900 to-purple-700",
      buttonColor: "bg-yellow-400 text-purple-900",
      emoji: "🛍️",
    },
    {
      id: 2,
      badge: "FLASH SALE",
      badgeColor: "bg-red-400 text-white",
      title: "FLASH SALE LIVE NOW",
      description: "Up to 70% discount on trending items",
      gradient: "from-red-800 to-red-600",
      buttonColor: "bg-yellow-400 text-red-800",
      emoji: "⚡",
    },
    {
      id: 3,
      badge: "SEASONAL OFFER",
      badgeColor: "bg-green-400 text-green-900",
      title: "SEASONAL BONANZA",
      description: "Limited time offers on all categories",
      gradient: "from-green-800 to-green-600",
      buttonColor: "bg-yellow-400 text-green-800",
      emoji: "🎉",
    },
    {
      id: 4,
      badge: "LIMITED TIME",
      badgeColor: "bg-blue-400 text-blue-900",
      title: "MEGA CLEARANCE SALE",
      description: "Stock clearance - Up to 80% off",
      gradient: "from-blue-800 to-blue-600",
      buttonColor: "bg-yellow-400 text-blue-800",
      emoji: "🔥",
    },
  ];

  // Category Data with Images
  const categories = [
    { id: 1, name: "Home & Kitchen Appliances", icon: "🏠", image: "https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=Home" },
    { id: 2, name: "Fashion", icon: "👔", image: "https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=Fashion" },
    { id: 3, name: "Health & Beauty", icon: "💄", image: "https://via.placeholder.com/80x80/45B7D1/FFFFFF?text=Beauty" },
    { id: 4, name: "Toys & Games", icon: "🎮", image: "https://via.placeholder.com/80x80/96CEB4/FFFFFF?text=Toys" },
    { id: 5, name: "Sports, Fitness & Cycling", icon: "🚴", image: "https://via.placeholder.com/80x80/DDA0DD/FFFFFF?text=Sports" },
    { id: 6, name: "Baby & Mother care", icon: "🍼", image: "https://via.placeholder.com/80x80/98D8C8/FFFFFF?text=Baby" },
    { id: 7, name: "Tools & Hardware Equipments", icon: "🔧", image: "https://via.placeholder.com/80x80/F7DC6F/FFFFFF?text=Tools" },
    { id: 8, name: "Pet Supplies", icon: "🐾", image: "https://via.placeholder.com/80x80/BB8FCE/FFFFFF?text=Pets" },
    { id: 9, name: "Home Furnishing & Accessories", icon: "🛋️", image: "https://via.placeholder.com/80x80/85C1E2/FFFFFF?text=Furniture" },
    { id: 10, name: "Stationery & Office Supplies", icon: "📚", image: "https://via.placeholder.com/80x80/F8B739/FFFFFF?text=Office" },
    { id: 11, name: "Automotive", icon: "🚗", image: "https://via.placeholder.com/80x80/52BE80/FFFFFF?text=Auto" },
    { id: 12, name: "School Essentials", icon: "🎒", image: "https://via.placeholder.com/80x80/AF7AC5/FFFFFF?text=School" },
    { id: 13, name: "Mobile Phones", icon: "📱", image: "https://via.placeholder.com/80x80/EC7063/FFFFFF?text=Mobile" },
    { id: 14, name: "Laptops", icon: "💻", image: "https://via.placeholder.com/80x80/5DADE2/FFFFFF?text=Laptop" },
    { id: 15, name: "Gaming", icon: "🎮", image: "https://via.placeholder.com/80x80/82E0AA/FFFFFF?text=Gaming" },
  ];

  // Promotional Badges
  const promoBadges = [
    { id: 1, text: "TIME TO PARTY", color: "bg-gradient-to-br from-red-400 to-red-600", textColor: "text-white" },
    { id: 2, text: "GRAB IT CLEARANCE", color: "bg-gradient-to-br from-yellow-400 to-orange-500", textColor: "text-white" },
    { id: 3, text: "PRE-OWNED PRODUCTS", color: "bg-gradient-to-br from-red-500 to-pink-600", textColor: "text-white" },
    { id: 4, text: "Saver ZONE", color: "bg-gradient-to-br from-yellow-300 to-yellow-500", textColor: "text-purple-900" },
    { id: 5, text: "Deal of the Day", color: "bg-gradient-to-br from-green-400 to-green-600", textColor: "text-white" },
    { id: 6, text: "PRO GADGETS", color: "bg-gradient-to-br from-purple-500 to-purple-700", textColor: "text-white" },
    { id: 7, text: "Perfume Fiesta", color: "bg-gradient-to-br from-blue-400 to-blue-600", textColor: "text-white" },
  ];

  // Auto-scroll categories
  useEffect(() => {
    const interval = setInterval(() => {
      if (categoryScrollRef.current) {
        const scrollWidth = categoryScrollRef.current.scrollWidth;
        const clientWidth = categoryScrollRef.current.clientWidth;
        const newPosition = categoryScrollPosition + 1;
        
        if (newPosition >= scrollWidth - clientWidth) {
          setCategoryScrollPosition(0);
        } else {
          setCategoryScrollPosition(newPosition);
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [categoryScrollPosition]);

  // Auto-scroll promo badges
  useEffect(() => {
    const interval = setInterval(() => {
      if (promoScrollRef.current) {
        const scrollWidth = promoScrollRef.current.scrollWidth;
        const clientWidth = promoScrollRef.current.clientWidth;
        const newPosition = categoryScrollPosition * 0.5; // Slower speed for promo badges
        
        if (newPosition >= scrollWidth - clientWidth) {
          promoScrollRef.current.scrollLeft = 0;
        } else {
          promoScrollRef.current.scrollLeft = newPosition;
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [categoryScrollPosition]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselBanners.length) % carouselBanners.length);
  };

  // Mock product data
  const gamingChairs = [
    { id: 1, name: "Gaming Chair Pro X1", price: "PKR 25,999", originalPrice: "PKR 35,999", discount: "28%", image: "chair1" },
    { id: 2, name: "Ergonomic Gaming Chair", price: "PKR 18,499", originalPrice: "PKR 24,999", discount: "26%", image: "chair2" },
    { id: 3, name: "RGB Gaming Chair Elite", price: "PKR 32,999", originalPrice: "PKR 42,999", discount: "23%", image: "chair3" },
    { id: 4, name: "Racing Style Chair", price: "PKR 21,999", originalPrice: "PKR 29,999", discount: "27%", image: "chair4" },
    { id: 5, name: "Executive Gaming Desk", price: "PKR 15,999", originalPrice: "PKR 22,999", discount: "30%", image: "desk1" },
    { id: 6, name: "L-Shaped Gaming Desk", price: "PKR 28,999", originalPrice: "PKR 38,999", discount: "26%", image: "desk2" },
  ];

  const speakers = [
    { id: 1, name: "RGB Gaming Speaker", price: "PKR 8,999", originalPrice: "PKR 12,999", discount: "31%", image: "speaker1" },
    { id: 2, name: "Bluetooth Speaker Pro", price: "PKR 5,499", originalPrice: "PKR 7,999", discount: "31%", image: "speaker2" },
    { id: 3, name: "Wireless Earbuds", price: "PKR 3,999", originalPrice: "PKR 5,999", discount: "33%", image: "earbuds1" },
    { id: 4, name: "Gaming Headset RGB", price: "PKR 6,999", originalPrice: "PKR 9,999", discount: "30%", image: "headset1" },
    { id: 5, name: "Soundbar System", price: "PKR 12,999", originalPrice: "PKR 17,999", discount: "28%", image: "soundbar1" },
    { id: 6, name: "Portable Speaker Mini", price: "PKR 2,499", originalPrice: "PKR 3,999", discount: "38%", image: "speaker3" },
  ];

  const topPicks = [
    { id: 1, name: "Wireless Mouse", price: "PKR 1,299", originalPrice: "PKR 1,999", discount: "35%", image: "mouse1" },
    { id: 2, name: "Mechanical Keyboard", price: "PKR 4,999", originalPrice: "PKR 6,999", discount: "29%", image: "keyboard1" },
    { id: 3, name: "Webcam HD 1080p", price: "PKR 3,499", originalPrice: "PKR 4,999", discount: "30%", image: "webcam1" },
    { id: 4, name: "USB Hub 7-Port", price: "PKR 1,899", originalPrice: "PKR 2,799", discount: "32%", image: "usbhub1" },
    { id: 5, name: "Monitor Stand", price: "PKR 2,299", originalPrice: "PKR 3,299", discount: "30%", image: "stand1" },
    { id: 6, name: "Laptop Cooling Pad", price: "PKR 1,599", originalPrice: "PKR 2,399", discount: "33%", image: "cooling1" },
  ];

  const dealsOfTheDay = [
    { id: 1, name: "Smart Watch Pro", price: "PKR 8,999", originalPrice: "PKR 12,999", discount: "31%", image: "watch1" },
    { id: 2, name: "Fitness Tracker", price: "PKR 3,499", originalPrice: "PKR 4,999", discount: "30%", image: "fitness1" },
    { id: 3, name: "Power Bank 20000mAh", price: "PKR 2,999", originalPrice: "PKR 4,499", discount: "33%", image: "powerbank1" },
    { id: 4, name: "Phone Case Premium", price: "PKR 599", originalPrice: "PKR 999", discount: "40%", image: "case1" },
    { id: 5, name: "Screen Protector", price: "PKR 399", originalPrice: "PKR 699", discount: "43%", image: "screen1" },
    { id: 6, name: "Charging Cable", price: "PKR 499", originalPrice: "PKR 899", discount: "44%", image: "cable1" },
  ];

  const dealsYouMightLike = [
    { id: 1, name: "Gaming Mouse Pad XL", price: "PKR 899", originalPrice: "PKR 1,499", discount: "40%", image: "mousepad1", badge: "40% OFF" },
    { id: 2, name: "LED Desk Lamp", price: "PKR 1,299", originalPrice: "PKR 1,999", discount: "35%", image: "lamp1", badge: "35% OFF" },
    { id: 3, name: "Phone Holder Stand", price: "PKR 599", originalPrice: "PKR 999", discount: "40%", image: "holder1", badge: "40% OFF" },
    { id: 4, name: "Cable Organizer", price: "PKR 399", originalPrice: "PKR 799", discount: "50%", image: "organizer1", badge: "50% OFF" },
    { id: 5, name: "Laptop Sleeve 15 inch", price: "PKR 1,199", originalPrice: "PKR 1,899", discount: "37%", image: "sleeve1", badge: "37% OFF" },
    { id: 6, name: "Wireless Charger", price: "PKR 1,599", originalPrice: "PKR 2,499", discount: "36%", image: "charger1", badge: "36% OFF" },
  ];

  const perfumes = [
    { id: 1, name: "Luxury Perfume 100ml", price: "PKR 4,999", originalPrice: "PKR 6,999", discount: "29%", image: "perfume1" },
    { id: 2, name: "Designer Fragrance", price: "PKR 5,999", originalPrice: "PKR 7,999", discount: "25%", image: "perfume2" },
    { id: 3, name: "Eau de Parfum", price: "PKR 3,999", originalPrice: "PKR 5,499", discount: "27%", image: "perfume3" },
    { id: 4, name: "Body Spray Premium", price: "PKR 1,299", originalPrice: "PKR 1,899", discount: "32%", image: "spray1" },
    { id: 5, name: "Attar Collection", price: "PKR 2,499", originalPrice: "PKR 3,499", discount: "29%", image: "attar1" },
    { id: 6, name: "Gift Set Perfume", price: "PKR 6,999", originalPrice: "PKR 9,999", discount: "30%", image: "giftset1" },
  ];

  const games = [
    { id: 1, name: "PlayStation 5 Console", price: "PKR 125,999", originalPrice: "PKR 145,999", discount: "14%", image: "ps5" },
    { id: 2, name: "Xbox Series X", price: "PKR 115,999", originalPrice: "PKR 135,999", discount: "15%", image: "xbox" },
    { id: 3, name: "Gaming Controller", price: "PKR 8,999", originalPrice: "PKR 11,999", discount: "25%", image: "controller1" },
    { id: 4, name: "VR Headset", price: "PKR 65,999", originalPrice: "PKR 85,999", discount: "23%", image: "vr1" },
    { id: 5, name: "Gaming Headset Pro", price: "PKR 9,999", originalPrice: "PKR 13,999", discount: "29%", image: "headset2" },
    { id: 6, name: "Gaming Keyboard RGB", price: "PKR 7,999", originalPrice: "PKR 10,999", discount: "27%", image: "keyboard2" },
  ];

  const mobilePhones = [
    { id: 1, name: "iPhone 15 Pro Max", price: "PKR 385,999", originalPrice: "PKR 425,999", discount: "9%", image: "iphone15" },
    { id: 2, name: "Samsung Galaxy S24", price: "PKR 285,999", originalPrice: "PKR 325,999", discount: "12%", image: "s24" },
    { id: 3, name: "OnePlus 12", price: "PKR 185,999", originalPrice: "PKR 215,999", discount: "14%", image: "oneplus12" },
    { id: 4, name: "Google Pixel 8 Pro", price: "PKR 225,999", originalPrice: "PKR 265,999", discount: "15%", image: "pixel8" },
    { id: 5, name: "Xiaomi 14 Ultra", price: "PKR 195,999", originalPrice: "PKR 235,999", discount: "17%", image: "xiaomi14" },
    { id: 6, name: "OPPO Find X7", price: "PKR 165,999", originalPrice: "PKR 195,999", discount: "15%", image: "oppo1" },
  ];

  const brandOfWeek = [
    { id: 1, name: "iPhone 15 Pro", price: "PKR 325,999", originalPrice: "PKR 365,999", discount: "11%", image: "iphone15pro" },
    { id: 2, name: "Apple Watch Ultra 2", price: "PKR 185,999", originalPrice: "PKR 215,999", discount: "14%", image: "watchultra" },
    { id: 3, name: "AirPods Pro 2", price: "PKR 55,999", originalPrice: "PKR 65,999", discount: "15%", image: "airpodspro" },
    { id: 4, name: "iPad Pro M2", price: "PKR 225,999", originalPrice: "PKR 265,999", discount: "15%", image: "ipadpro" },
  ];

  const laptops = [
    { id: 1, name: "MacBook Pro 16 M3", price: "PKR 685,999", originalPrice: "PKR 765,999", discount: "10%", image: "macbookpro" },
    { id: 2, name: "Dell XPS 15", price: "PKR 385,999", originalPrice: "PKR 445,999", discount: "13%", image: "dellxps" },
    { id: 3, name: "HP Spectre x360", price: "PKR 325,999", originalPrice: "PKR 385,999", discount: "16%", image: "hpspectre" },
    { id: 4, name: "Lenovo ThinkPad X1", price: "PKR 365,999", originalPrice: "PKR 425,999", discount: "14%", image: "thinkpad" },
    { id: 5, name: "ASUS ROG Zephyrus", price: "PKR 425,999", originalPrice: "PKR 495,999", discount: "14%", image: "asusrog" },
    { id: 6, name: "MSI Gaming Laptop", price: "PKR 385,999", originalPrice: "PKR 455,999", discount: "15%", image: "msi" },
  ];

  const healthCare = [
    { id: 1, name: "Blood Pressure Monitor", price: "PKR 8,999", originalPrice: "PKR 11,999", discount: "25%", image: "bp1" },
    { id: 2, name: "Digital Thermometer", price: "PKR 1,299", originalPrice: "PKR 1,899", discount: "32%", image: "thermo1" },
    { id: 3, name: "Pulse Oximeter", price: "PKR 2,499", originalPrice: "PKR 3,499", discount: "29%", image: "oximeter1" },
    { id: 4, name: "First Aid Kit", price: "PKR 3,999", originalPrice: "PKR 5,499", discount: "27%", image: "firstaid1" },
    { id: 5, name: "Vitamin Supplements", price: "PKR 2,999", originalPrice: "PKR 3,999", discount: "25%", image: "vitamins1" },
    { id: 6, name: "Face Mask Pack", price: "PKR 899", originalPrice: "PKR 1,399", discount: "36%", image: "mask1" },
  ];

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-2 sm:p-4 group cursor-pointer">
      <div className="relative mb-2 sm:mb-3">
        <div className="bg-gray-100 rounded-lg h-32 sm:h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <span className="text-gray-400 text-4xl sm:text-6xl">📷</span>
        </div>
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount} OFF
          </span>
        )}
        <button className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <h5 className="font-medium text-gray-800 mb-1 sm:mb-2 line-clamp-2 text-xs h-6 sm:h-8">{product.name}</h5>
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <span className="text-green-600 font-bold text-xs sm:text-sm">{product.price}</span>
        <span className="text-gray-400 text-xs line-through text-xs">{product.originalPrice}</span>
      </div>
      <button className="w-full bg-purple-600 text-white py-1 sm:py-2 rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors duration-300">
        Add to Cart
      </button>
    </div>
  );

  const SectionHeader = ({ title, onViewAll }) => (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
      <button 
        onClick={onViewAll}
        className="text-purple-600 font-semibold hover:text-purple-800 transition-colors flex items-center gap-1 text-sm sm:text-base"
      >
        View All
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Banner Carousel */}
      <div className=" mx-auto px-2 sm:px-4  sm:py-6">
        {/* Scrolling Categories Section - Like in Video */}
        <div className="bg-white rounded-xl   p-1 mb-6 overflow-hidden">
          <div className="flex gap-6">
            {/* Left Side - Promotional Badges (Scrolling) */}
            <div className="hidden lg:flex flex-shrink-0 w-90 bg-gray-200  overflow-hidden">
              <div 
                ref={promoScrollRef}
                className="flex gap-3 pt-2  animate-scroll-slow"
                style={{ transform: `translateX(-${categoryScrollPosition * 0.3}px)` }}
              >
                {[...promoBadges, ...promoBadges].map((badge, index) => (
                  <div 
                    key={`${badge.id}-${index}`}
                    className={`${badge.color} ${badge.textColor} rounded-xl p-3 flex-shrink-0 w-32 h-24 flex items-center justify-center text-center font-bold text-xs shadow-md`}
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
                className="flex gap-4"
                style={{ transform: `translateX(-${categoryScrollPosition}px)` }}
              >
                {[...categories, ...categories].map((category, index) => (
                  <div 
                    key={`${category.id}-${index}`}
                    className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group min-w-[100px]"
                  >
                    <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-center text-gray-700 font-medium line-clamp-2 max-w-[100px]">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Carousel - Col Span 2 */}
          <div className="col-span-1 md:col-span-2 relative">
            <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden rounded-2xl">
              {/* Carousel Slides */}
              {carouselBanners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className={`bg-gradient-to-r ${banner.gradient} rounded-2xl p-8 text-white relative overflow-hidden h-full flex items-center`}>
                    <div className="relative z-10 w-full">
                      <span className={`${banner.badgeColor} px-2 py-1 rounded-full text-xs sm:text-sm font-bold mb-2 sm:mb-4 inline-block`}>
                        {banner.badge}
                      </span>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">{banner.title}</h1>
                      <p className="text-sm sm:text-base md:text-xl mb-3 sm:mb-6">{banner.description}</p>
                      <button className={`${banner.buttonColor} px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-bold hover:shadow-lg transition`}>
                        Shop Now
                      </button>
                    </div>
                    <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 flex items-center justify-end">
                      <div className="text-6xl sm:text-8xl md:text-9xl">{banner.emoji}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                {carouselBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? "bg-white w-8" : "bg-white bg-opacity-50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Cashback Card - Col Span 1 */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 sm:p-6 md:p-8 text-purple-900 relative overflow-hidden h-48 sm:h-64 md:h-80 flex flex-col justify-center">
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">3% Cashback</h2>
              <p className="text-xs sm:text-sm md:text-base mb-2 sm:mb-4">On all purchases above PKR 5000</p>
              <button className="bg-purple-900 text-white px-3 sm:px-4 md:px-6 py-1 sm:py-2 text-xs sm:text-sm rounded-lg font-bold hover:bg-purple-800 transition">
                Learn More
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 text-6xl sm:text-7xl md:text-8xl opacity-30">💰</div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-3 sm:p-6 text-white cursor-pointer hover:scale-105 transition-transform">
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">📱</div>
            <h5 className="font-bold text-sm sm:text-lg">Mobile Phones</h5>
            <p className="text-xs sm:text-sm opacity-90">Up to 30% off</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-3 sm:p-6 text-white cursor-pointer hover:scale-105 transition-transform">
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">💻</div>
            <h5 className="font-bold text-sm sm:text-lg">Laptops</h5>
            <p className="text-xs sm:text-sm opacity-90">Special Offers</p>
          </div>
          <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl p-3 sm:p-6 text-white cursor-pointer hover:scale-105 transition-transform">
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">🎮</div>
            <h5 className="font-bold text-sm sm:text-lg">Gaming</h5>
            <p className="text-xs sm:text-sm opacity-90">New Arrivals</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-3 sm:p-6 text-white cursor-pointer hover:scale-105 transition-transform">
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">🎧</div>
            <h5 className="font-bold text-sm sm:text-lg">Audio</h5>
            <p className="text-xs sm:text-sm opacity-90">Best Deals</p>
          </div>
        </div>

        {/* Top Picks */}
        <div className="mb-12">
          <SectionHeader title="Top Picks" onViewAll={() => {}} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {topPicks.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Deals Of The Day */}
        <div className="mb-12">
          <SectionHeader title="Deals Of The Day" onViewAll={() => {}} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {dealsOfTheDay.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Deals You Might Like */}
        <div className="mb-12">
          <SectionHeader title="Deals You Might Like" onViewAll={() => {}} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {dealsYouMightLike.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-2 sm:p-4 group cursor-pointer relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.badge}
                </div>
                <div className="relative mb-2 sm:mb-3 mt-6">
                  <div className="bg-gray-100 rounded-lg h-32 sm:h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <span className="text-gray-400 text-4xl sm:text-6xl">📷</span>
                  </div>
                </div>
                <h5 className="font-medium text-gray-800 mb-1 sm:mb-2 line-clamp-2 text-xs h-6 sm:h-8">{product.name}</h5>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="text-green-600 font-bold text-xs sm:text-sm">{product.price}</span>
                  <span className="text-gray-400 text-xs line-through">{product.originalPrice}</span>
                </div>
                <button className="w-full bg-purple-600 text-white py-1 sm:py-2 rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors duration-300">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Perfumes Section */}
        <div className="mb-12">
          <SectionHeader title="Perfumes" onViewAll={() => {}} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {perfumes.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Games Section - Image 3 */}
        <div className="mb-12">
          <SectionHeader title="Games" onViewAll={() => {}} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {games.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Mobile Phones Section */}
        <div className="mb-12">
          <SectionHeader title="Mobile Phones" onViewAll={() => {}} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {mobilePhones.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Brand of the Week - Orange Banner */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden">
            <div className="relative z-10 text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold mb-2">BRAND OF THE WEEK</h2>
              <p className="text-sm sm:text-xl opacity-90">Apple Products - Up to 20% Off</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 relative z-10">
              {brandOfWeek.map(product => (
                <div key={product.id} className="bg-white rounded-xl p-2 sm:p-4 text-gray-800">
                  <div className="bg-gray-100 rounded-lg h-24 sm:h-40 flex items-center justify-center mb-2 sm:mb-3">
                    <span className="text-gray-400 text-3xl sm:text-5xl">📷</span>
                  </div>
                  <h5 className="font-medium text-xs mb-1 sm:mb-2 line-clamp-2 h-6">{product.name}</h5>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-green-600 font-bold text-xs">{product.price}</span>
                    <span className="text-gray-400 text-xs line-through">{product.originalPrice}</span>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-1 sm:py-2 rounded-lg text-xs font-medium hover:bg-purple-700 transition">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>
          </div>
        </div>

        {/* Laptops Section */}
        <div className="mb-12">
          <SectionHeader title="Laptops" onViewAll={() => {}} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {laptops.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Health Care Products Section */}
        <div className="mb-12">
          <SectionHeader title="Health Care Products" onViewAll={() => {}} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {healthCare.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Gaming Chairs & Desks - Image 1 */}
        <div className="mb-12">
          <SectionHeader title="Gaming Chairs & Desks" onViewAll={() => {}} />
          
          {/* Purple Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-4 sm:p-8 text-white mb-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="bg-yellow-400 text-purple-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold mb-2 sm:mb-4 inline-block">
                  NEW UPDATE
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4">LIVE</h2>
                <p className="text-sm sm:text-xl mb-4 sm:mb-6">Shopping Made Simple</p>
                <button className="bg-yellow-400 text-purple-900 px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-bold hover:bg-yellow-300 transition">
                  Shop Now
                </button>
              </div>
              <div className="flex gap-2 sm:gap-4 flex-shrink-0">
                <div className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📱</div>
                  <p className="text-xs sm:text-sm">Scan Here</p>
                  <p className="text-xs opacity-80">To Update on Mobile</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">💻</div>
                  <p className="text-xs sm:text-sm">Desktop</p>
                  <p className="text-xs opacity-80">Version Available</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
              <div className="absolute right-20 top-10 text-9xl">🛒</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {gamingChairs.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Speakers & Audio Devices */}
        <div className="mb-12">
          <SectionHeader title="Speakers & Audio Devices" onViewAll={() => {}} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {speakers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default App;