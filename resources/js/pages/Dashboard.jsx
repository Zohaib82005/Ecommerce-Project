import React, { useState } from "react";
import "../css/dashboard.css";
import { Link, usePage } from "@inertiajs/react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
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

  const wishlistItems = [
    { id: 1, name: "Bluetooth Speaker", price: "$89", image: "🔊", inStock: true },
    { id: 2, name: "Mechanical Keyboard", price: "$159", image: "⌨️", inStock: true },
    { id: 3, name: "Gaming Mouse", price: "$79", image: "🖱️", inStock: false },
  ];

  const savedAddresses = [
    { id: 1, type: "Home", address: "House 23, Street 7, Islamabad", default: true },
    { id: 2, type: "Office", address: "Plaza 5, Blue Area, Islamabad", default: false },
  ];

  return (
    <div className="customer-profile-layout">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside className={`profile-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <h3 className="brand-logo">
            <i className="bi bi-bag-heart-fill "></i>
            CoreBuy
          </h3>
        </div>

        <div className="user-profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {props.auth.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="online-indicator"></div>
          </div>
          <h5 className="profile-name">{props.auth.user.name}</h5>
          <p className="profile-email">{props.auth.user.email}</p>
          <div className="loyalty-badge">
            <i className="bi bi-star-fill"></i> Gold Member
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li 
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }} 
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            >
              <i className="bi bi-grid-fill"></i>
              <span>Dashboard</span>
            </li>
            <li 
              onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }} 
              className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
            >
              <i className="bi bi-bag-check-fill"></i>
              <span>My Orders</span>
              <span className="badge bg-primary ms-auto">3</span>
            </li>
            <li 
              onClick={() => { setActiveTab("wishlist"); setSidebarOpen(false); }} 
              className={`nav-item ${activeTab === "wishlist" ? "active" : ""}`}
            >
              <i className="bi bi-heart-fill"></i>
              <span>Wishlist</span>
            </li>
            <li 
              onClick={() => { setActiveTab("addresses"); setSidebarOpen(false); }} 
              className={`nav-item ${activeTab === "addresses" ? "active" : ""}`}
            >
              <i className="bi bi-geo-alt-fill"></i>
              <span>Addresses</span>
            </li>
            <li 
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }} 
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            >
              <i className="bi bi-gear-fill"></i>
              <span>Settings</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-outline-danger w-100">
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="profile-main-content">
        {/* HEADER BAR */}
        <header className="content-header">
          <div className="header-left">
            <button 
              className="btn btn-light sidebar-toggle d-lg-none" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <div className="header-title">
              <h2>Welcome back, {props.auth.user.name}! 👋</h2>
              <p className="text-muted">Manage your orders and account preferences</p>
            </div>
          </div>

          <div className="header-right">
            <div className="notification-bell position-relative">
              <Link href='/products' className="btn btn-primary bg-primary ">Buy Products</Link>
              <button 
                className="btn btn-light position-relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="bi bi-bell-fill fs-5"></i>
                <span className="notification-badge">3</span>
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h6>Notifications</h6>
                    <button 
                      className="btn-close btn-sm" 
                      onClick={() => setShowNotifications(false)}
                    ></button>
                  </div>
                  <div className="notification-body">
                    <div className="notification-item">
                      <div className="notification-icon shipped">📦</div>
                      <div className="notification-content">
                        <p className="notification-text">Your order #CB10991 has been shipped</p>
                        <span className="notification-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-icon success">💳</div>
                      <div className="notification-content">
                        <p className="notification-text">Payment received successfully</p>
                        <span className="notification-time">5 hours ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-icon promo">🔥</div>
                      <div className="notification-content">
                        <p className="notification-text">New deals available - Save up to 50%</p>
                        <span className="notification-time">1 day ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="notification-footer">
                    <a href="#" className="text-primary">View All Notifications</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="content-body">
          {activeTab === "overview" && (
            <div className="tab-content-wrapper fade-in">
              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                <div className="col-md-6 col-xl-3">
                  <div className="stat-card stat-primary">
                    <div className="stat-icon">
                      <i className="bi bi-cart-fill"></i>
                    </div>
                    <div className="stat-content">
                      <h3 className="stat-number">18</h3>
                      <p className="stat-label">Total Orders</p>
                    </div>
                    <div className="stat-trend positive">
                      <i className="bi bi-arrow-up"></i> 12%
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="stat-card stat-warning">
                    <div className="stat-icon">
                      <i className="bi bi-hourglass-split"></i>
                    </div>
                    <div className="stat-content">
                      <h3 className="stat-number">4</h3>
                      <p className="stat-label">Pending Orders</p>
                    </div>
                    <div className="stat-trend">
                      <i className="bi bi-dash"></i> 0%
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="stat-card stat-success">
                    <div className="stat-icon">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="stat-content">
                      <h3 className="stat-number">14</h3>
                      <p className="stat-label">Completed</p>
                    </div>
                    <div className="stat-trend positive">
                      <i className="bi bi-arrow-up"></i> 8%
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="stat-card stat-info">
                    <div className="stat-icon">
                      <i className="bi bi-wallet-fill"></i>
                    </div>
                    <div className="stat-content">
                      <h3 className="stat-number">$120</h3>
                      <p className="stat-label">Wallet Balance</p>
                    </div>
                    <div className="stat-trend positive">
                      <i className="bi bi-arrow-up"></i> $20
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="section-card mb-4">
                <div className="section-header">
                  <h4>Recent Orders</h4>
                  <button className="btn btn-sm btn-outline-primary">View All</button>
                </div>
                <div className="orders-list">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-icon">{order.image}</div>
                      <div className="order-details">
                        <h6 className="order-title">{order.product}</h6>
                        <p className="order-meta">Order #{order.id} • {order.date}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                        <p className="order-amount">{order.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="action-card">
                    <i className="bi bi-arrow-repeat fs-1 text-primary"></i>
                    <h5>Track Order</h5>
                    <p>Track your recent orders</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="action-card">
                    <i className="bi bi-chat-dots fs-1 text-success"></i>
                    <h5>Customer Support</h5>
                    <p>Get help from our team</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="action-card">
                    <i className="bi bi-credit-card fs-1 text-warning"></i>
                    <h5>Payment Methods</h5>
                    <p>Manage your payments</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="tab-content-wrapper fade-in">
              <div className="section-card">
                <div className="section-header">
                  <h4>My Orders</h4>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-primary active">All</button>
                    <button className="btn btn-sm btn-outline-primary">Pending</button>
                    <button className="btn btn-sm btn-outline-primary">Delivered</button>
                  </div>
                </div>
                
                <div className="orders-grid">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <h6>Order #{order.id}</h6>
                          <p className="text-muted small">{order.date}</p>
                        </div>
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-card-body">
                        <div className="d-flex align-items-center">
                          <div className="product-icon-large">{order.image}</div>
                          <div className="flex-grow-1 ms-3">
                            <h5>{order.product}</h5>
                            <p className="text-muted mb-2">Quantity: 1</p>
                            <h5 className="text-primary">{order.amount}</h5>
                          </div>
                        </div>
                      </div>
                      <div className="order-card-footer">
                        <button className="btn btn-sm btn-outline-primary">Track Order</button>
                        <button className="btn btn-sm btn-primary">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="tab-content-wrapper fade-in">
              <div className="section-card">
                <div className="section-header">
                  <h4>My Wishlist</h4>
                  <p className="text-muted">{wishlistItems.length} items</p>
                </div>
                
                <div className="wishlist-grid">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="wishlist-card">
                      <button className="wishlist-remove">
                        <i className="bi bi-x-lg"></i>
                      </button>
                      <div className="wishlist-icon">{item.image}</div>
                      <h5 className="wishlist-name">{item.name}</h5>
                      <p className="wishlist-price">{item.price}</p>
                      <div className="wishlist-stock">
                        {item.inStock ? (
                          <span className="text-success">
                            <i className="bi bi-check-circle-fill"></i> In Stock
                          </span>
                        ) : (
                          <span className="text-danger">
                            <i className="bi bi-x-circle-fill"></i> Out of Stock
                          </span>
                        )}
                      </div>
                      <button className="btn btn-primary w-100 mt-3">
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="tab-content-wrapper fade-in">
              <div className="section-card">
                <div className="section-header">
                  <h4>Saved Addresses</h4>
                  <button className="btn btn-primary">
                    <i className="bi bi-plus-lg me-2"></i>
                    Add New Address
                  </button>
                </div>
                
                <div className="addresses-grid">
                  {savedAddresses.map((address) => (
                    <div key={address.id} className="address-card">
                      {address.default && (
                        <span className="default-badge">Default</span>
                      )}
                      <div className="address-icon">
                        <i className="bi bi-geo-alt-fill"></i>
                      </div>
                      <h5 className="address-type">{address.type}</h5>
                      <p className="address-text">{address.address}</p>
                      <div className="address-actions">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="tab-content-wrapper fade-in">
              <div className="row">
                <div className="col-lg-8">
                  <div className="section-card mb-4">
                    <div className="section-header">
                      <h4>Personal Information</h4>
                    </div>
                    <form>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={settings.name}
                            onChange={handleSettingsChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={settings.email}
                            onChange={handleSettingsChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            value={settings.phone}
                            onChange={handleSettingsChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Birthday</label>
                          <input
                            type="date"
                            name="birthday"
                            className="form-control"
                            value={settings.birthday}
                            onChange={handleSettingsChange}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <button type="button" className="btn btn-primary" onClick={handleSettingsSave}>
                          <i className="bi bi-check-lg me-2"></i>
                          Save Changes
                        </button>
                        <button type="button" className="btn btn-outline-secondary ms-2">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="section-card">
                    <div className="section-header">
                      <h4>Security Settings</h4>
                    </div>
                    <div className="security-options">
                      <div className="security-item">
                        <div>
                          <h6>Change Password</h6>
                          <p className="text-muted small">Update your account password</p>
                        </div>
                        <button className="btn btn-outline-primary">Change</button>
                      </div>
                      <div className="security-item">
                        <div>
                          <h6>Two-Factor Authentication</h6>
                          <p className="text-muted small">Add extra security to your account</p>
                        </div>
                        <button className="btn btn-outline-primary">Enable</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="section-card">
                    <div className="section-header">
                      <h4>Preferences</h4>
                    </div>
                    <div className="preferences-list">
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="emailNotif" defaultChecked />
                        <label className="form-check-label" htmlFor="emailNotif">
                          Email Notifications
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="smsNotif" />
                        <label className="form-check-label" htmlFor="smsNotif">
                          SMS Notifications
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="promoNotif" defaultChecked />
                        <label className="form-check-label" htmlFor="promoNotif">
                          Promotional Emails
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="orderUpdates" defaultChecked />
                        <label className="form-check-label" htmlFor="orderUpdates">
                          Order Updates
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;