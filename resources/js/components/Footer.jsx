import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-900 text-white mt-16">
      {/* Newsletter Section */}
      <div className="bg-purple-950 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold">Subscribe to our newsletter</h3>
                <p className="text-purple-300 text-xs md:text-sm">Get the latest deals and updates</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 md:py-3 rounded-lg md:rounded-l-lg text-gray-900 flex-1 sm:flex-initial md:w-80 focus:outline-none text-sm"
              />
              <button className="bg-yellow-400 text-purple-900 px-6 py-2 md:py-3 rounded-lg md:rounded-r-lg font-semibold hover:bg-yellow-300 transition text-sm md:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4">About Us</h4>
            <ul className="space-y-2 text-purple-300 text-xs md:text-sm">
              <li className="hover:text-white cursor-pointer transition">About ShopNow</li>
              <li className="hover:text-white cursor-pointer transition">Careers</li>
              <li className="hover:text-white cursor-pointer transition">ShopNow Policies</li>
              <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition">Terms & Conditions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4">Customer Service</h4>
            <ul className="space-y-2 text-purple-300 text-xs md:text-sm">
              <li className="hover:text-white cursor-pointer transition">Help Center</li>
              <li className="hover:text-white cursor-pointer transition">How to Buy</li>
              <li className="hover:text-white cursor-pointer transition">Shipping & Delivery</li>
              <li className="hover:text-white cursor-pointer transition">Return Policy</li>
              <li className="hover:text-white cursor-pointer transition">Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4">Make Money</h4>
            <ul className="space-y-2 text-purple-300 text-xs md:text-sm">
              <li className="hover:text-white cursor-pointer transition">Sell on ShopNow</li>
              <li className="hover:text-white cursor-pointer transition">Become an Affiliate</li>
              <li className="hover:text-white cursor-pointer transition">Advertise Your Products</li>
              <li className="hover:text-white cursor-pointer transition">Self Service</li>
              <li className="hover:text-white cursor-pointer transition">Become a Supplier</li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4">Payment Methods</h4>
            <div className="flex gap-2 mb-4">
              <div className="w-12 h-8 bg-white rounded"></div>
              <div className="w-12 h-8 bg-white rounded"></div>
              <div className="w-12 h-8 bg-white rounded hidden sm:block"></div>
              <div className="w-12 h-8 bg-white rounded hidden sm:block"></div>
            </div>
            <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center hover:bg-yellow-400 cursor-pointer transition text-xs font-bold">
                f
              </div>
              <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center hover:bg-yellow-400 cursor-pointer transition text-xs font-bold">
                t
              </div>
              <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center hover:bg-yellow-400 cursor-pointer transition text-xs font-bold">
                in
              </div>
              <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center hover:bg-yellow-400 cursor-pointer transition text-xs font-bold">
                ig
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-purple-800 py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs md:text-sm text-purple-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span>© 2026 ShopNow. All Rights Reserved</span>
              <span className="hidden sm:inline">|</span>
              <span>Country: Pakistan</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span>Secure Payment</span>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-white rounded"></div>
                <div className="w-8 h-5 bg-white rounded"></div>
                <div className="w-8 h-5 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;