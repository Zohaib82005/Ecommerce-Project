import { Link, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { auth } = usePage().props;

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
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-purple-900 font-bold text-xl">S</span>
              </div>
              <span className="text-xl md:text-2xl font-bold">Shopee</span>
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
              {auth?.user ? (
                <Link href="/dashboard" className="text-white text-decoration-none text-sm">
                  <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{auth.user.name}</span>
                  </div>
                </Link>
              ) : (
                <Link href="/login" className="text-white text-decoration-none text-sm">
                  <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Login</span>
                  </div>
                </Link>
              )}

              {/* Favorites - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">Favorites</span>
              </div>

              {/* Cart */}
                <Link href="/cart" className="text-decoration-none text-white font-semibold text-sm hidden sm:inline">
              <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                  Cart
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">3</span>
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
                  <Link href="/dashboard" className="text-white text-decoration-none flex items-center gap-2 hover:text-yellow-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{auth.user.name}</span>
                  </Link>
                ) : (
                  <Link href="/login" className="text-white text-decoration-none flex items-center gap-2 hover:text-yellow-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Login</span>
                  </Link>
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