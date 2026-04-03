import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d0a4e 50%, #1a0533 100%)' }} className="text-white mt-16">

      {/* Shop Now Pay Later Banner - matching image 4 */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #065f46, #047857, #10b981)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white">Shop Now. Pay Later with <span className="text-yellow-300">Tabby.</span></h3>
            <p className="text-green-100 text-sm mt-1">SPLIT YOUR PURCHASE INTO 4 INTEREST FREE PAYMENTS</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-12 h-8 bg-white rounded-md flex items-center justify-center text-xs font-bold text-green-700">VISA</div>
            <div className="w-12 h-8 bg-white rounded-md flex items-center justify-center text-xs font-bold text-red-500">MC</div>
            <div className="w-12 h-8 bg-white rounded-md flex items-center justify-center text-xs font-bold text-blue-600">PY</div>
          </div>
        </div>
        {/* Decorative glow lines */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-white/10"></div>
        <div className="absolute top-4 right-1/4 w-32 h-0.5 bg-white/20 rotate-45"></div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-purple-800/50 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold">Enter Your Mail</h3>
                <p className="text-purple-300 text-xs md:text-sm">Subscribe for exclusive deals & updates</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 rounded-l-xl text-gray-900 flex-1 md:w-72 bg-white focus:outline-none text-sm"
              />
              <button
                className="px-6 py-2.5 rounded-r-xl font-bold text-sm transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#1a0533' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
                <img src={`/logo.png`} width="30" height="30" alt="Logo" />
              
              <span className="text-lg font-black">BrightMaxTrading.com</span>
            </div>
            <p className="text-purple-300 text-xs md:text-sm leading-relaxed mb-4">
              Established in 2015. brightmaxtrading.com is a prominent and rapidly growing online shopping platform in the region...
            </p>
            <p className="text-purple-300 text-xs mb-1">© Copyright 2026, brightmaxtrading.com, All rights reserved.</p>
          </div>

          <div>
            <h4 className="font-bold text-base mb-3 md:mb-4 text-white">Online Shopping</h4>
            <ul className="space-y-2 text-purple-300 text-xs md:text-sm">
              {['Home & Kitchen Appliances','Contact Us','Mobile Phones','Tablets','Laptops & Computers','Gaming & Accessories','Pre-Owned','Accessories'].map(item => (
                <li key={item} className="hover:text-yellow-400 cursor-pointer transition">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base mb-3 md:mb-4 text-white">Customer Policies</h4>
            <ul className="space-y-2 text-purple-300 text-xs md:text-sm">
              {['About Ourshopee','Contact Us','FAQs','Privacy Policy','Terms & Conditions','Return and Replacement Policy'].map(item => (
                <li key={item} className="hover:text-yellow-400 cursor-pointer transition">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base mb-3 md:mb-4 text-white">Useful Links</h4>
            <ul className="space-y-2 text-purple-300 text-xs md:text-sm">
              {['Sell With Us'].map(item => (
                <li key={item} className="hover:text-yellow-400 cursor-pointer transition">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base mb-3 md:mb-4 text-white">24/7 Customer Support</h4>
            <p className="text-purple-300 text-xs mb-3 leading-relaxed">
              BrightMaxTrading support team is here working 24/7 for our customers. We give high priority to troubleshoot and sort out all the complaints and issues of our customers.
            </p>
            <p className="text-purple-300 text-xs mb-1">We're always here to help you.</p>
            <p className="text-purple-300 text-xs mb-1">Reach out to us through any of these support channels:</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-yellow-400 font-semibold">Contact: (+60) 1245 30698</p>
              <p className="text-xs text-purple-300">E-mail: info@brightmaxtrading.com</p>
            </div>

            
          </div>
        </div>
      </div>

      {/* Social + Connect */}
      <div className="border-t border-purple-800/50 py-4 md:py-5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-purple-300 text-xs">Connect with us:</span>
              {[
                { label: 'f', color: '#1877F2' },
                { label: '𝕏', color: '#000' },
                { label: 'in', color: '#0A66C2' },
                { label: '▶', color: '#FF0000' },
                { label: '📷', color: '#E4405F' },
              ].map((social, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition hover:scale-110"
                  style={{ background: social.color || '#4c1d95' }}
                >
                  {social.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-purple-300 text-xs">Secure Payment:</span>
              <div className="flex gap-2">
                {['VISA', 'MC', 'PY', 'CB'].map(p => (
                  <div key={p} className="w-10 h-6 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-700">{p}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center text-purple-400 text-xs mt-3">
            © 2026 BrightMaxTrading. All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;