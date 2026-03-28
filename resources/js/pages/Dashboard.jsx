import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import FlashMessage from "../Components/FlashMessage";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    name: "Zohaib",
    email: "zohaib@example.com",
    phone: "+92 300 1234567",
    birthday: "1995-06-15"
  });

  const props = usePage().props;

  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSettingsSave = () => {
    alert("Settings saved successfully!");
  };

  // Sample data
  const recentOrders = [
    { id: "CB10991", product: "Smart Watch Pro", status: "Shipped", date: "Jan 25, 2026", amount: "$299", image: "🎁" },
    { id: "CB10987", product: "Wireless Headphones", status: "Processing", date: "Jan 28, 2026", amount: "$149", image: "🎧" },
    { id: "CB10983", product: "Laptop Stand", status: "Delivered", date: "Jan 20, 2026", amount: "$45", image: "💻" },
  ];

  const wishlistItems = props.wishlists || [];
  const savedAddresses = [
    { id: 1, type: "Home", address: "House 23, Street 7, Islamabad", default: true },
    { id: 2, type: "Office", address: "Plaza 5, Blue Area, Islamabad", default: false },
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      <FlashMessage />
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex">
        {/* SIDEBAR */}
        <aside className={`fixed lg:static inset-y-0 left-0  w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                  {props.auth.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                <span className="text-gray-600 font-medium">Welcome</span>
                <br />
                <span className="text-gray-600 font-bold">{props.auth.user.name}</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Account Setting */}
              <div>
                <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Account Setting</h6>
                <ul className="space-y-1">
                  <li 
                    onClick={() => { setActiveTab("profile"); setSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === "profile" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <i className="bi bi-person text-lg"></i>
                    <span className="font-medium">Profile</span>
                  </li>
                  <li 
                    onClick={() => { setActiveTab("addresses"); setSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === "addresses" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <i className="bi bi-geo-alt text-lg"></i>
                    <span className="font-medium">Address</span>
                  </li>
                  <li 
                    onClick={() => { setActiveTab("wishlist"); setSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === "wishlist" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <i className="bi bi-heart text-lg"></i>
                    <span className="font-medium">Wishlist</span>
                  </li>
                </ul>
              </div>

              {/* Order Details */}
              <div>
                <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Order Details</h6>
                <ul className="space-y-1">
                  <li 
                    onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === "orders" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <i className="bi bi-box text-lg"></i>
                    <span className="font-medium">My Orders</span>
                  </li>
                  <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors">
                    <i className="bi bi-truck text-lg"></i>
                    <span className="font-medium">Track your order</span>
                  </li>
                </ul>
              </div>

              {/* Wallet */}
              <div>
                <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Wallet</h6>
                <ul className="space-y-1">
                  <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors">
                    <i className="bi bi-wallet text-lg"></i>
                    <span className="font-medium">Wallet</span>
                  </li>
                </ul>
              </div>

              {/* Help Center */}
              <div>
                <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Help Center</h6>
                <ul className="space-y-1">
                  <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors">
                    <i className="bi bi-info-circle text-lg"></i>
                    <span className="font-medium">Complaints</span>
                  </li>
                </ul>
              </div>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors font-medium">
                <i className="bi bi-box-arrow-right"></i>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <i className="bi bi-list text-xl"></i>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            <div className="w-10"></div>
          </div>

          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                  <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600 leading-relaxed max-w-3xl">
                      View the details of your current and past orders, track your purchases, 
                      and stay updated on the status of your items all in one place.
                    </p>
                  </div>

                  {(() => {
                    const groupedOrders = props.orders ? props.orders.reduce((acc, item) => {
                      const oid = item.oid;
                      if (!acc[oid]) {
                        acc[oid] = {
                          id: item.id,
                          oid: item.oid,
                          created_at: item.created_at,
                          order_status: item.order_status,
                          status: item.status,
                          cstatus: item.cstatus,
                          payment_method: item.payment_method,
                          total_amount: item.total_amount,
                          products: []
                        };
                      }
                      acc[oid].products.push({
                        name: item.product_name,
                        quantity: item.quantity,
                        cstatus: item.cstatus,
                        image: item.product_image,
                        price: item.pprice,
                        totalPrice: (item.quantity * item.pprice).toFixed(2)
                      });
                      return acc;
                    }, {}) : {};

                    return Object.keys(groupedOrders).length > 0 ? (
                      <div className="space-y-4">
                        {Object.values(groupedOrders).map((order) => (
                          <div key={order.oid} className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                              <div>
                                <h6 className="font-semibold text-gray-900">Order #{order.oid}</h6>
                                <p className="text-sm text-gray-500">
                                  {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="p-4 space-y-4">
                              {order.products.map((product, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                  <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                    <img
                                      src={`/storage/${product.image}`}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-gray-900 truncate">{product.name}</h5>
                                    <p className="text-sm text-gray-500 mt-1">Quantity: {product.quantity}</p>
                                    <p className="text-sm text-gray-500">Price: ${parseFloat(product.price).toFixed(2)}</p>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                      product.cstatus?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      product.cstatus?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                                      product.cstatus?.toLowerCase() === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {product.cstatus}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              
                              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Payment Method:</span>
                                  <span className="font-medium text-gray-900 capitalize">{order.payment_method}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <h5 className="font-semibold text-gray-900">Total:</h5>
                                  <h5 className="text-lg font-bold text-indigo-600">${parseFloat(order.total_amount).toFixed(2)}</h5>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex gap-3 justify-end">
                              <button className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                                <i className="bi bi-geo-alt mr-1"></i>
                                Track Order
                              </button>
                              <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                                <i className="bi bi-eye mr-1"></i>
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <i className="bi bi-file-earmark-plus text-5xl text-gray-400"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                          You haven't placed any orders yet. Start exploring our amazing products and make your first purchase!
                        </p>
                        <Link href="/products" className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                          Keep Exploring
                        </Link>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Information</h1>
                    <p className="text-gray-600">Manage your personal information and account settings</p>
                  </div>

                  <div className="max-w-2xl space-y-6">
                    <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
                      <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
                        {props.auth.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{props.auth.user.name}</h3>
                        <p className="text-gray-600">{props.auth.user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Active Member
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={props.auth.user.name}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={props.auth.user.email}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === "wishlist" && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Wishlist</h1>
                      <p className="text-gray-600">{wishlistItems.length} items saved</p>
                    </div>
                  </div>

                  {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img 
                              src={`/storage/${item.image}`} 
                              alt={item.name}
                              className="w-full h-48 object-cover"
                            />
                            <Link 
                              href={`/remove-wishlist/${item.id}`}
                              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                            >
                              <i className="bi bi-x-lg text-gray-600"></i>
                            </Link>
                          </div>
                          <div className="p-4">
                            <h5 className="font-semibold text-gray-900 mb-2">{item.name}</h5>
                            <p className="text-lg font-bold text-indigo-600 mb-2">{item.price}</p>
                            <div className="mb-4">
                              {item.instock > 0 ? (
                                <span className="text-sm text-green-600 flex items-center gap-1">
                                  <i className="bi bi-check-circle-fill"></i> In Stock
                                </span>
                              ) : (
                                <span className="text-sm text-red-600 flex items-center gap-1">
                                  <i className="bi bi-x-circle-fill"></i> Out of Stock
                                </span>
                              )}
                            </div>
                            <button 
                              disabled={item.instock === 0}
                              className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                                item.instock > 0 
                                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              <i className="bi bi-cart-plus mr-2"></i>
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="bi bi-heart text-5xl text-gray-400"></i>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Wishlist Items</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        You haven't added any items to your wishlist yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">Saved Addresses</h1>
                      <p className="text-gray-600">Manage your delivery addresses</p>
                    </div>
                    <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      <i className="bi bi-plus-lg"></i>
                      Add New Address
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {savedAddresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-xl p-6 relative hover:shadow-md transition-shadow">
                        {address.default && (
                          <span className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            Default
                          </span>
                        )}
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                          <i className="bi bi-geo-alt-fill text-2xl text-indigo-600"></i>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2">{address.type}</h5>
                        <p className="text-gray-600 mb-4">{address.address}</p>
                        <div className="flex gap-3">
                          <button className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                            <i className="bi bi-pencil mr-1"></i> Edit
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            <i className="bi bi-trash mr-1"></i> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                      <h1 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h1>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={settings.name}
                              onChange={handleSettingsChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              name="email"
                              value={settings.email}
                              onChange={handleSettingsChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                              type="tel"
                              name="phone"
                              value={settings.phone}
                              onChange={handleSettingsChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
                            <input
                              type="date"
                              name="birthday"
                              value={settings.birthday}
                              onChange={handleSettingsChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <button 
                            onClick={handleSettingsSave}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                          >
                            <i className="bi bi-check-lg"></i>
                            Save Changes
                          </button>
                          <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h6 className="font-semibold text-gray-900">Change Password</h6>
                            <p className="text-sm text-gray-600">Update your account password</p>
                          </div>
                          <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                            Change
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h6 className="font-semibold text-gray-900">Two-Factor Authentication</h6>
                            <p className="text-sm text-gray-600">Add extra security to your account</p>
                          </div>
                          <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-700">Email Notifications</span>
                          <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-700">SMS Notifications</span>
                          <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-700">Promotional Emails</span>
                          <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-700">Order Updates</span>
                          <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fade-in">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <i className="bi bi-cart-fill text-2xl"></i>
                      </div>
                      <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        <i className="bi bi-arrow-up mr-1"></i>12%
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{props.orders.length}</h3>
                    <p className="text-indigo-100">Total Orders</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <i className="bi bi-hourglass-split text-2xl"></i>
                      </div>
                      <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        <i className="bi bi-dash mr-1"></i>0%
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">4</h3>
                    <p className="text-amber-100">Pending Orders</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <i className="bi bi-check-circle-fill text-2xl"></i>
                      </div>
                      <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        <i className="bi bi-arrow-up mr-1"></i>8%
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{props.orders.length}</h3>
                    <p className="text-green-100">Completed</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <i className="bi bi-wallet-fill text-2xl"></i>
                      </div>
                      <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        <i className="bi bi-arrow-up mr-1"></i>$20
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">$120</h3>
                    <p className="text-cyan-100">Wallet Balance</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <button className="text-indigo-600 font-medium hover:text-indigo-700">View All</button>
                  </div>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                          {order.image}
                        </div>
                        <div className="flex-1">
                          <h6 className="font-semibold text-gray-900">{order.product}</h6>
                          <p className="text-sm text-gray-600">Order #{order.id} • {order.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                            order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="font-bold text-gray-900">{order.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="bi bi-arrow-repeat text-3xl text-indigo-600"></i>
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">Track Order</h5>
                    <p className="text-gray-600 text-sm">Track your recent orders</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="bi bi-chat-dots text-3xl text-green-600"></i>
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">Customer Support</h5>
                    <p className="text-gray-600 text-sm">Get help from our team</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="bi bi-credit-card text-3xl text-amber-600"></i>
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">Payment Methods</h5>
                    <p className="text-gray-600 text-sm">Manage your payments</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
    <Footer/>
    </>
  );
};

export default Dashboard;