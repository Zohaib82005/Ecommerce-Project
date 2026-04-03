import { Link, usePage, router } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import CategoryDropdown from './CategoryDropdown';
import LoadingScreen from './LoadingScreen';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: 'MY', name: 'Malaysia', flag: '🇲🇾', currency: 'MYR' });
  const dropdownTimeoutRef = useRef(null);
  const countryDropdownTimeoutRef = useRef(null);
  const { auth, cartCount } = usePage().props;

  const countries = [
    { code: 'MY', name: 'Malaysia', flag: `my`, currency: 'RM' },
    { code: 'CN', name: 'China', flag: '🇨🇳', currency: 'CNY' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED' },
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰', currency: 'PKR' },
  ];

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
    }, 300);
  };

  const handleCountryDropdownMouseEnter = () => {
    if (countryDropdownTimeoutRef.current) {
      clearTimeout(countryDropdownTimeoutRef.current);
      countryDropdownTimeoutRef.current = null;
    }
    setCountryDropdownOpen(true);
  };

  const handleCountryDropdownMouseLeave = () => {
    countryDropdownTimeoutRef.current = setTimeout(() => {
      setCountryDropdownOpen(false);
    }, 300);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountryDropdownOpen(false);
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
    <header className="bg-indigo-600 text-white sticky top-0 z-50 shadow-lg">
      {/* Main Header */}
      <LoadingScreen  />
      <div className="w-full px-4 py-2.5">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3 lg:gap-5">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 text-white text-decoration-none">
            <img src={`/logo.png`} className='h-10' alt="Logo" />
            <span className="text-base font-extrabold tracking-tight leading-none">
              BrightMaxTrading
            </span>
          </Link>

          {/* ── Category Button ── */}
          <div className="hidden md:block flex-shrink-0">
            <CategoryDropdown />
          </div>

          {/* ── Search Bar ── */}
          <div className="hidden md:flex flex-1">
            <div className="flex w-full rounded-md overflow-hidden border border-indigo-700 focus-within:border-yellow-400 transition">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 bg-white text-gray-800 text-sm focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-yellow-400 hover:bg-yellow-300 transition px-4 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-indigo-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Right Side Items ── */}
          <div className="flex items-center gap-1 lg:gap-3 flex-shrink-0 ml-auto md:ml-0">

            {/* Deliver To */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-indigo-900 transition cursor-pointer">
              <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-indigo-300">Deliver to</span>
                <span className="text-xs font-semibold text-yellow-400 whitespace-nowrap">Fetching location...</span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-indigo-700"></div>

            {/* Download App */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-indigo-900 transition cursor-pointer">
              <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5l-6-6m6 6l6-6m-6 6V3" />
                <rect x="3" y="19" width="18" height="2" rx="1" fill="currentColor" stroke="none"/>
              </svg>
              <span className="text-xs font-medium whitespace-nowrap">Download App</span>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-indigo-700"></div>

            {/* Country / Language Selector */}
            <div
              className="relative"
              onMouseEnter={handleCountryDropdownMouseEnter}
              onMouseLeave={handleCountryDropdownMouseLeave}
            >
              <div className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded hover:bg-indigo-900 transition cursor-pointer">
                <span className="text-base leading-none">{selectedCountry.flag}</span>
                <span className="text-xs font-medium">{selectedCountry.code}</span>
                <svg className={`w-3 h-3 text-indigo-300 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Country Dropdown */}
              {countryDropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-1 w-56 bg-white text-gray-900 rounded-lg shadow-xl py-1.5 z-50 border border-gray-100"
                  onMouseEnter={handleCountryDropdownMouseEnter}
                  onMouseLeave={handleCountryDropdownMouseLeave}
                >
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full text-left flex items-center justify-between px-4 py-2.5 transition ${
                        selectedCountry.code === country.code
                          ? 'bg-indigo-50 border-l-4 border-indigo-600'
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{country.flag}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800">{country.name}</span>
                          <span className="text-xs text-gray-500">{country.currency}</span>
                        </div>
                      </div>
                      {selectedCountry.code === country.code && (
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-indigo-700"></div>

            {/* Account / Login */}
            <div
              className="relative"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-indigo-900 transition cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium">
                  {auth?.user ? auth.user.name : 'Login'}
                </span>
                <svg className={`w-3 h-3 text-indigo-300 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-1 w-48 bg-white text-gray-900 rounded-lg shadow-xl py-1.5 z-50 border border-gray-100"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {auth?.user ? (
                    <>
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-800 text-decoration-none text-sm transition">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        My Account
                      </Link>
                      <Link href="/dashboard?tab=addresses" className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-800 text-decoration-none text-sm transition">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        My Addresses
                      </Link>
                      <Link href="/dashboard?tab=orders" className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-800 text-decoration-none text-sm transition">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        My Orders
                      </Link>
                      <Link href="/dashboard?tab=wishlist" className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-800 text-decoration-none text-sm transition">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        My Wishlist
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <Link href="/logout" method="post" as="button" className="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 text-decoration-none text-sm font-medium transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                      </Link>
                    </>
                  ) : (
                    <Link href="/login" className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-800 text-decoration-none text-sm transition">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="text-decoration-none text-white">
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-indigo-900 transition relative cursor-pointer">
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-indigo-950 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">{cartCount}</span>
                  )}
                </div>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded hover:bg-indigo-900 transition"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all mb-1 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all mb-1 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-2.5">
          <div className="flex rounded-md overflow-hidden border border-indigo-700 focus-within:border-yellow-400 transition">
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 bg-white text-gray-800 text-sm focus:outline-none"
            />
            <button onClick={handleSearch} className="bg-yellow-400 hover:bg-yellow-300 transition px-4 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-indigo-800 pt-3">
            <div className="flex flex-col gap-1">
              {auth?.user ? (
                <>
                  <Link href="/dashboard" className="text-white text-decoration-none flex items-center gap-2 px-2 py-2.5 rounded hover:bg-indigo-900 transition text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    My Account
                  </Link>
                  <Link href="/dashboard?tab=addresses" className="text-white text-decoration-none flex items-center gap-2 px-2 py-2.5 rounded hover:bg-indigo-900 transition text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    My Addresses
                  </Link>
                  <Link href="/dashboard?tab=orders" className="text-white text-decoration-none flex items-center gap-2 px-2 py-2.5 rounded hover:bg-indigo-900 transition text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    My Orders
                  </Link>
                  <Link href="/dashboard?tab=wishlist" className="text-white text-decoration-none flex items-center gap-2 px-2 py-2.5 rounded hover:bg-indigo-900 transition text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    My Wishlist
                  </Link>
                  <div className="border-t border-indigo-700 my-1"></div>
                  <Link href="/logout" method="post" as="button" className="w-full text-left flex items-center gap-2 px-2 py-2.5 rounded hover:bg-indigo-900 text-red-300 text-decoration-none text-sm font-medium transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </Link>
                </>
              ) : (
                <Link href="/login" className="text-white text-decoration-none flex items-center gap-2 px-2 py-2.5 rounded hover:bg-indigo-900 transition text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Login
                </Link>
              )}
              {/* Mobile: Deliver To */}
              <div className="flex items-center gap-2 px-2 py-2.5 text-sm text-indigo-200">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                <span>Deliver to: <span className="text-yellow-400 font-medium">Fetching location...</span></span>
              </div>

              {/* Mobile: Country Selector */}
              <div className="border-t border-indigo-700 my-2 pt-2">
                <div className="px-2 pb-2 text-xs text-indigo-300 font-medium">SELECT COUNTRY</div>
                <div className="space-y-1">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2 rounded transition text-sm ${
                        selectedCountry.code === country.code
                          ? 'bg-indigo-700 text-white'
                          : 'text-indigo-100 hover:bg-indigo-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{country.flag}</span>
                        <div className="flex flex-col">
                          <span className="font-medium">{country.name}</span>
                          <span className="text-xs opacity-80">{country.currency}</span>
                        </div>
                      </div>
                      {selectedCountry.code === country.code && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;