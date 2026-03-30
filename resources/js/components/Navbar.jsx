import { Link, usePage, router } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import CategoryDropdown from './CategoryDropdown';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const { auth, cartCount } = usePage().props;

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.visit(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-purple-900 text-white sticky top-0 z-50">
      {/* Main Header */}
      <div className="w-full px-4 py-3 md:py-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Row: Logo, Search (hidden on mobile), and Icons */}
          <div className="flex items-center justify-between gap-3 md:gap-8">
            {/* Logo */}
            <div className="flex items-center  flex-shrink-0">
              
              <span className="text-xl md:text-xl font-bold">Shopee</span>
            </div>

            {/* Category Dropdown */}
            <div className="hidden md:bloack lg:block">
              <CategoryDropdown />
            </div>

            {/* Search Bar - Hidden on mobile, visible on md and up */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="flex w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 bg-white py-2 rounded-l-lg text-gray-900 focus:outline-none text-sm"
                />
                <button 
                  onClick={handleSearch}
                  className="bg-yellow-400 text-purple-900 px-6 py-2 rounded-r-lg font-semibold hover:bg-yellow-300 transition">
                  Search
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            {/* Login/Dashboard - Hidden on mobile */}
            <div 
              className="relative"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              {auth?.user ? (
                <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{auth.user.name}</span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Account</span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}

              {/* Dropdown Menu */}
              {dropdownOpen && (
                
                <div 
                  className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {auth?.user ? (
                    <>
                    
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2.5 hover:bg-gray-100 text-decoration-none text-gray-900 transition"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>My Account</span>
                        </div>
                      </Link>
                      <Link 
                        href="/dashboard?tab=addresses" 
                        className="block px-4 py-2.5 hover:bg-gray-100 text-decoration-none text-gray-900 transition"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>My Addresses</span>
                        </div>
                      </Link>
                      <Link 
                        href="/dashboard?tab=orders" 
                        className="block px-4 py-2.5 hover:bg-gray-100 text-decoration-none text-gray-900 transition"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span>My Orders</span>
                        </div>
                      </Link>
                      <Link 
                        href="/dashboard?tab=wishlist" 
                        className="block px-4 py-2.5 hover:bg-gray-100 text-decoration-none text-gray-900 transition"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>My Wishlist</span>
                        </div>
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <Link 
                        href="/logout" 
                        method="post"
                        as="button"
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-decoration-none text-red-600 transition font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </div>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="block px-4 py-2.5 hover:bg-gray-100 text-decoration-none text-gray-900 transition"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Login</span>
                        </div>
                      </Link>
                     
                    </>
                  )}
                </div>
              )}
            </div>

              {/* Favorites - Hidden on mobile */}
                <Link href="/dashboard?tab=wishlist" className='text-white text-decoration-none'>
              <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">Favorites</span>
              </div>
                </Link>

              {/* Cart */}
                <Link href="/cart" className="text-decoration-none text-white font-semibold text-sm hidden sm:inline">
              <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                  Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
                )}
              </div>
                </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex flex-col gap-1.5"
              >
                <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>

          {/* Search Bar for Mobile - Visible on mobile only */}
          <div className="md:hidden mt-3">
            <div className="flex">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 bg-white py-2 rounded-l-lg text-gray-900 focus:outline-none text-xs"
              />
              <button 
                onClick={handleSearch}
                className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-r-lg font-semibold hover:bg-yellow-300 transition text-xs">
                Search
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-purple-800 pt-4">
              <div className="flex flex-col gap-4">
                {auth?.user ? (
                  <>
                    <Link href="/dashboard" className="text-white text-decoration-none flex items-center gap-2 hover:text-yellow-400 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>My Account</span>
                    </Link>
                    <Link href="/dashboard?tab=addresses" className="text-white text-decoration-none flex items-center gap-2 hover:text-yellow-400 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>My Addresses</span>
                    </Link>
                    <Link href="/dashboard?tab=orders" className="text-white text-decoration-none flex items-center gap-2 hover:text-yellow-400 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>My Orders</span>
                    </Link>
                    <div className="text-white flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Favorites</span>
                    </div>
                    <div className="border-t border-purple-700 pt-4">
                      <Link href="/logout" method="post" as="button" className="w-full text-left text-red-300 text-decoration-none flex items-center gap-2 hover:text-red-200 transition font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-white text-decoration-none flex items-center gap-2 hover:text-yellow-400 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Login</span>
                    </Link>
                    
                  </>
                )}
                <div className="text-white flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Favorites</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {/* <nav className="border-t border-purple-800">
        <div className="container mx-auto px-4">
          <ul className="flex gap-8 py-3 text-sm">
            <li className="hover:text-yellow-400 cursor-pointer font-semibold">All Categories</li>
            <li className="hover:text-yellow-400 cursor-pointer">Mobile Phones</li>
            <li className="hover:text-yellow-400 cursor-pointer">Laptops</li>
            <li className="hover:text-yellow-400 cursor-pointer">Gaming</li>
            <li className="hover:text-yellow-400 cursor-pointer">Electronics</li>
            <li className="hover:text-yellow-400 cursor-pointer">Fashion</li>
            <li className="hover:text-yellow-400 cursor-pointer">Home & Living</li>
            <li className="hover:text-yellow-400 cursor-pointer">Health & Beauty</li>
            <li className="hover:text-yellow-400 cursor-pointer text-red-400">Deals</li>
          </ul>
        </div>
      </nav> */}
    </header>
  );
};

export default Navbar;