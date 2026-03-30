import React, { useState, useEffect } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import Footer from "../components/Footer";
import FlashMessage from "../components/FlashMessage";

const Checkout = () => {
  const props = usePage().props;
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const [addressLoading, setAddressLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("WLC10");
  const [appliedCoupon, setAppliedCoupon] = useState({ code: "WLC10", discount: 2 });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [useWallet, setUseWallet] = useState(false);
  const [addressError, setAddressError] = useState(false);

  const formData = useForm({
    name: props.auth.user.name,
    phone: "",
    country: "Pakistan",
    location: "",
    area: "",
    address: "",
    landmark: "",
  });

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/addresses");
        const data = await response.json();
        setAddresses(data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setAddressLoading(false);
      }
    };
    
    fetchAddresses();
  }, []);

  // Pakistan provinces
  const pakistanProvinces = [
    "Punjab",
    "Sindh",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Gilgit-Baltistan",
    "Azad Jammu and Kashmir",
    "Islamabad",
  ];

  // Pakistan cities mapped by province
  const pakistanCities = {
    Punjab: [
      "Lahore",
      "Faisalabad",
      "Rawalpindi",
      "Multan",
      "Gujranwala",
      "Sialkot",
      "Sheikhupura",
      "Okara",
      "Sahiwal",
      "Sargodha",
      "Bahawalpur",
      "Jhang",
      "Kasur",
      "Chakwal",
      "Attock",
    ],
    Sindh: [
      "Karachi",
      "Hyderabad",
      "Sukkur",
      "Larkana",
      "Nawabshah",
      "Mirpur Khas",
      "Dadu",
      "Jacobabad",
      "Shikarpur",
      "Badin",
    ],
    "Khyber Pakhtunkhwa": [
      "Peshawar",
      "Mingora",
      "Abbottabad",
      "Mardan",
      "Kohat",
      "Bannu",
      "Swat",
      "Charsadda",
      "Nowshera",
      "Mansehra",
    ],
    Balochistan: [
      "Quetta",
      "Gwadar",
      "Ziaarat",
      "Loralai",
      "Zhob",
      "Khuzdar",
      "Turbat",
      "Sibi",
    ],
    "Gilgit-Baltistan": [
      "Gilgit",
      "Skardu",
      "Hunza",
      "Diamer",
      "Ghizer",
      "Shigar",
    ],
    "Azad Jammu and Kashmir": [
      "Muzaffarabad",
      "Mirpur",
      "Bhimber",
      "Kotli",
      "Poonch",
      "Rawalakot",
      "Mandi",
    ],
    Islamabad: ["Islamabad"],
  };

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

  const orderData = useForm({
    address_id: selectedAddress ? selectedAddress.id : null,
    paymentMethod: paymentMethod,
    total: total,

  });

  
  // Handle address selection from modal
  const handleSelectAddress = (address) => {
    formData.setData({
      ...formData.data,
      name: address.name,
      phone: address.phone,
      country: address.country || "Pakistan",
      location: address.province,
      area: address.city,
      address: address.address,
      landmark: address.landmark || "",
    });
    setSelectedAddress(address);
    setShowAddressModal(false);
    console.log("Selected Address:", address);
    orderData.setData("address_id", address.id);

  };

  // Check if all required address fields are filled
  const isAddressFormValid = () => {
    return (
      formData.data.name &&
      formData.data.name.trim() !== "" &&
      formData.data.phone &&
      formData.data.phone.trim() !== "" &&
      formData.data.location &&
      formData.data.location.trim() !== "" &&
      formData.data.area &&
      formData.data.area.trim() !== "" &&
      formData.data.address &&
      formData.data.address.trim() !== ""
    );
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    
    if (!isAddressFormValid()) {
      alert("Please fill all required fields");
      return;
    }

    // Submit address via POST request
    formData.post("/addresses", {
      onSuccess: async () => {
        setShowAddressForm(false);
        // Fetch updated addresses
        try {
          const response = await fetch("/addresses");
          const data = await response.json();
          setAddresses(data);
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
        // Reset form after successful submission
        formData.reset();
      },
      onError: (errors) => {
        console.error("Error adding address:", errors);
        alert("Failed to add address. Please try again.");
      },
    });
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
    console.log("Submitting Order with Data:", orderData.data);
    // Validate that an address is selected
    if (!selectedAddress) {
      setAddressError(true);
      return;
    }
    
    setAddressError(false);
    
    // Submit only address_id and payment method
    orderData.post("/success", {
      data: {
        address_id: selectedAddress.id,
        paymentMethod: paymentMethod,
        total: total,
      },
    });
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
                <h3 className="text-sm font-semibold text-red-800 mb-1">Complete Address Required</h3>
                <p className="text-sm text-red-700 mb-3">
                  Please select a delivery address or add a new address before proceeding with payment.
                </p>
                <button
                  onClick={() => {
                    setAddressError(false);
                    setShowAddressModal(true);
                  }}
                  className="inline-flex px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                >
                  📍 Select Address
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
                </div>

                {/* Address Selection Modal */}
                {showAddressModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Select an Address</h3>
                        <button
                          onClick={() => setShowAddressModal(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="p-6 space-y-3">
                        {addresses.length === 0 ? (
                          <p className="text-gray-600 text-center py-8">No saved addresses found. Please add a new address.</p>
                        ) : (
                          addresses.map((addr) => (
                            <button
                              key={addr.id}
                              onClick={() => handleSelectAddress(addr)}
                              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{addr.name}</p>
                                  <p className="text-sm text-gray-600">{addr.phone}</p>
                                  <p className="text-sm text-gray-600">
                                    {addr.city}, {addr.province}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                  {addr.landmark && (
                                    <p className="text-sm text-gray-500">Landmark: {addr.landmark}</p>
                                  )}
                                </div>
                                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </button>
                          ))
                        )}
                      </div>

                      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                        <button
                          onClick={() => {
                            setShowAddressModal(false);
                            setShowAddressForm(true);
                          }}
                          className="w-full px-6 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 font-medium"
                        >
                          + Add New Address
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show "Select Address" button if no address is selected */}
                {!selectedAddress && !showAddressForm && (
                  <div className="py-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600 mb-4">Please select a delivery address</p>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="px-6 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 font-medium"
                    >
                      📍 Select Address
                    </button>
                  </div>
                )}

                {/* Address Form */}
                {showAddressForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="mb-4">
                      <div className="flex gap-2 mb-3">
                        <button 
                          onClick={() => setShowAddressModal(true)}
                          className="px-4 py-2 border border-indigo-700 text-indigo-700 rounded-md hover:bg-indigo-50 font-medium"
                        >
                          ← Select from Saved
                        </button>
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
                            placeholder="+92 ********"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                          <select
                            name="country"
                            value={formData.data.country}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="Pakistan">Pakistan</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                          <select
                            name="location"
                            value={formData.data.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select Province</option>
                            {pakistanProvinces.map((province) => (
                              <option key={province} value={province}>
                                {province}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                          <select
                            name="area"
                            value={formData.data.area}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select City</option>
                            {formData.data.location &&
                              pakistanCities[formData.data.location]?.map((city) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter Full Address *</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                        <input
                          type="text"
                          name="landmark"
                          value={formData.data.landmark}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., Near City Center, Close to Market"
                        />
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
                          onClick={() => {
                            setShowAddressForm(false);
                            setSelectedAddress(null);
                          }}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddAddress}
                          disabled={!isAddressFormValid()}
                          className={`px-6 py-2 rounded-md font-medium transition-colors ${
                            isAddressFormValid()
                              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Save & Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Display Selected Address */}
                {selectedAddress && !showAddressForm && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <p className="font-semibold text-gray-900">{selectedAddress.name}</p>
                        </div>
                        <p className="text-sm text-gray-600">📞 {selectedAddress.phone}</p>
                        <p className="text-sm text-gray-600">📍 {selectedAddress.city}, {selectedAddress.province}</p>
                        <p className="text-sm text-gray-600">{selectedAddress.address}</p>
                        {selectedAddress.landmark && (
                          <p className="text-sm text-gray-500">Landmark: {selectedAddress.landmark}</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setShowAddressModal(true);
                          setSelectedAddress(null);
                        }}
                        className="text-indigo-700 hover:text-indigo-800 font-medium text-sm"
                      >
                        Change
                      </button>
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
              {/* <div className="bg-white rounded-lg shadow-sm p-6">
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
              </div> */}

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
                    Confirm Order
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