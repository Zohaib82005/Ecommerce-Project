import React, { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import Footer from "../components/Footer";
import FlashMessage from "../components/FlashMessage";

const Checkout = () => {
  const props = usePage().props;
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [couponCode, setCouponCode] = useState("WLC10");
  const [appliedCoupon, setAppliedCoupon] = useState({ code: "WLC10", discount: 2 });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [useWallet, setUseWallet] = useState(false);
  const [addressError, setAddressError] = useState(false);

  const formData = useForm({
    name: props.auth.user.name,
    phone: "",
    location: "",
    area: "",
    address: "6061 NE State Hwy U, Hamilton, MO 64644, USA",
    landmark: "",
  });

  const orderItems = props.cartItems || [
    {
      id: 1,
      name: "Calvin Klein One Eau de Toilette (EDT) 200ml",
      price: 32.80,
      image: "product1.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Hugo Boss Bottled Night Eau de Toilette (EDT)",
      price: 27.90,
      image: "product2.jpg",
      quantity: 1,
    },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const processingFee = paymentMethod === "cod" ? 1.00 : 0.00;
  const shipping = 0;
  const walletBalance = 0.00;
  const walletUsed = useWallet ? Math.min(walletBalance, subtotal - couponDiscount) : 0;
  const total = subtotal - couponDiscount + processingFee + shipping - walletUsed;
  const totalSavings = (60.70 - subtotal) + couponDiscount + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    formData.setData({ ...formData.data, [name]: value });
  };

  const handlePaymentMethodChange = (method) => {
    if (method === "card") {
      alert("This feature will be coming soon. Please select Cash on Delivery for now.");
      return;
    }
    setPaymentMethod(method);
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "WLC10") {
      setAppliedCoupon({ code: "WLC10", discount: 2 });
    } else {
      alert("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate address details
    if (!formData.data.address || formData.data.address.trim() === "" ||
        formData.data.address === "6061 NE State Hwy U, Hamilton, MO 64644, USA") {
      setAddressError(true);
      return;
    }
    
    setAddressError(false);
    formData.post("/success");
  };

  return (
    <>
      <FlashMessage />
      {addressError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 mb-1">Address Details Required</h3>
                <p className="text-sm text-red-700 mb-3">
                  Please enter your complete address details before proceeding with payment.
                </p>
                <button
                  onClick={() => {
                    setAddressError(false);
                    setShowAddressForm(true);
                  }}
                  className="inline-flex px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                >
                  + Add Address
                </button>
              </div>
              <button
                onClick={() => setAddressError(false)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm">
              <Link href="/cart" className="text-gray-600 hover:text-gray-900">Cart</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-indigo-700 font-semibold">Checkout</span>
            </nav>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">DELIVERY DETAILS</h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-4 py-2 text-indigo-700 border border-indigo-700 rounded-md hover:bg-indigo-50 transition-colors text-sm font-medium"
                    >
                      + Add Address
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="mb-4">
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Search your landmark, location..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button className="px-4 py-2 border border-indigo-700 text-indigo-700 rounded-md hover:bg-indigo-50 font-medium">
                          LOCATE ME
                        </button>
                      </div>
                      
                      {/* Map Placeholder */}
                      <div className="w-full h-48 bg-gray-200 rounded-md mb-4 relative overflow-hidden">
                        <img 
                          src="https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=12&size=600x300&key=YOUR_API_KEY" 
                          alt="Map" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden absolute inset-0 items-center justify-center bg-gray-300 text-gray-600">
                          <div className="text-center">
                            <i className="bi bi-geo-alt text-4xl mb-2"></i>
                            <p>Map View</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.data.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.data.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="+968 ********"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                          <select
                            name="location"
                            value={formData.data.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select Location</option>
                            <option value="muscat">Muscat</option>
                            <option value="salalah">Salalah</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
                          <select
                            name="area"
                            value={formData.data.area}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select Area</option>
                            <option value="area1">Area 1</option>
                            <option value="area2">Area 2</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <textarea
                          name="address"
                          value={formData.data.address}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter full address"
                        ></textarea>
                      </div>

                      <div className="mb-4">
                        <label className="flex items-start">
                          <input type="checkbox" className="mt-1 mr-2 rounded border-gray-300 text-indigo-600" />
                          <span className="text-sm text-gray-600">
                            By proceeding, you hereby agree to abide by Our Shoppee's Terms and Conditions and Privacy Policy and affirm that you are over 18 years old.
                          </span>
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="px-6 py-2 bg-gray-300 text-gray-500 rounded-md font-medium cursor-not-allowed"
                          disabled
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipment */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">SHIPMENT</h3>
                    <span className="text-sm text-green-600 font-medium">Delivery Expected By Wed, Apr 1</span>
                  </div>
                  
                  <div className="space-y-4">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <img src={`/storage/${item.image}`} alt={item.name} className="w-full h-full object-contain p-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 mb-1">
                            {item.name.split(' ')[0]} {item.name.split(' ')[1]}
                          </p>
                          <p className="text-sm text-gray-900 font-medium truncate">{item.name}</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">OMR {item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">PAYMENT OPTIONS</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <label className={`relative flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Pay by Card</p>
                        <p className="text-sm text-gray-600">Processing Fees: 0.00 OMR</p>
                      </div>
                    </div>
                  </label>

                  <label className={`relative flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Cash On Delivery</p>
                        <p className="text-sm text-gray-600">Processing Fees: 1.00 OMR</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Shopee Wallet */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-4">SHOPEE WALLET</h3>
                  <label className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Pay Using Wallet Balance</p>
                        <p className="text-sm text-gray-600">Available Balance: OMR {walletBalance.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <span className="text-orange-500">🎁</span>
                        Used Balance: OMR {walletUsed.toFixed(2)}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="mt-6 lg:mt-0 space-y-6">
              {/* Coupon */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Coupon</h3>
                  <button className="text-sm text-indigo-700 hover:text-indigo-900 font-medium">
                    🔗 Available Coupons
                  </button>
                </div>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-800">Congrats! You've saved OMR {appliedCoupon.discount}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="WLC10"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-r-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Price Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">OMR {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm bg-green-50 p-2 rounded">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span className="font-semibold text-green-600">OMR -{appliedCoupon.discount}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">
                        Total <span className="text-gray-500 font-normal text-sm">(Inclusive of VAT)</span>
                      </span>
                      <span className="text-lg font-bold text-gray-900">OMR {total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Savings */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-green-800">Your Total Savings</span>
                      </div>
                      <span className="font-bold text-green-700">OMR {totalSavings.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Pay Now Button */}
                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors shadow-md mt-4"
                  >
                    Pay Now OMR {total.toFixed(2)}
                  </button>
                  
                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm mt-4">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Safe & Secure Payment Transaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;