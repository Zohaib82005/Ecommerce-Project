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
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/></svg>
              </div>
              <span className="text-lg font-black">Our<span className="text-yellow-400">Shop</span><span className="text-orange-400">ee</span></span>
            </div>
            <p className="text-purple-300 text-xs md:text-sm leading-relaxed mb-4">
              Established in 2015. Ourshopee.com is a prominent and rapidly growing online shopping platform in the region...
            </p>
            <p className="text-purple-300 text-xs mb-1">© Copyright 2026, Ourshopee.com, All rights reserved.</p>
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
              Ourshopee support team is here working 24/7 for our customers. We give high priority to troubleshoot and sort out all the complaints and issues of our customers.
            </p>
            <p className="text-purple-300 text-xs mb-1">We're always here to help you.</p>
            <p className="text-purple-300 text-xs mb-1">Reach out to us through any of these support channels:</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-yellow-400 font-semibold">Hotline: (971) 44156850</p>
              <p className="text-xs text-yellow-400 font-semibold">WhatsApp: (971) 526770771</p>
              <p className="text-xs text-purple-300">E-mail: support@ourshopee.com</p>
            </div>

            {/* Get App */}
            <p className="text-white font-semibold text-xs mt-4 mb-2">Get App</p>
            <div className="flex gap-2">
              <div className="bg-black rounded-lg px-3 py-1.5 flex items-center gap-1 cursor-pointer hover:bg-gray-800 transition">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div>
                  <div className="text-white text-[8px]">Download on the</div>
                  <div className="text-white text-[10px] font-bold">App Store</div>
                </div>
              </div>
              <div className="bg-black rounded-lg px-3 py-1.5 flex items-center gap-1 cursor-pointer hover:bg-gray-800 transition">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3.18 23.76c.38.21.8.24 1.22.08l12.19-7.02-2.6-2.6-10.81 9.54zM.24 1.2C.09 1.54 0 1.93 0 2.38v19.24c0 .45.09.84.24 1.17l.06.06 10.78-10.77v-.25L.3 1.14.24 1.2zM20.15 10.53l-2.69-1.55-2.93 2.93 2.93 2.93 2.7-1.56c.77-.44.77-1.16-.01-1.75zM4.4.16L16.59 7.18l-2.6 2.6L4.4.24V.16z"/></svg>
                <div>
                  <div className="text-white text-[8px]">Get it on</div>
                  <div className="text-white text-[10px] font-bold">Google Play</div>
                </div>
              </div>
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
            © 2026 OurShopee. All Rights Reserved | Country: Pakistan
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;