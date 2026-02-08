import React, { useEffect, useState } from "react";
import "../css/seller.css";
import { useForm, usePage, Link } from "@inertiajs/react";
import FlashMessage from '../components/FlashMessage.jsx';

const Seller = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const product = useForm({
    name: '',
    price: '',
    instock: '',
    desc: '',
    image: null,
    category_id: ''
  });

  const props = usePage().props;

  function addproductsubmit(e) {
    e.preventDefault();
    product.post('/addProduct', {
      onSuccess: () => {
        product.reset();
        setActiveTab("products");
      }
    });
  }

  function EditProduct(id) {
    return `/seller/editProduct/${id}`;
  }

  // Filter products based on search and status
  const filteredProducts = props.products?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "instock" && item.instock > 0) ||
      (filterStatus === "outofstock" && item.instock === 0);
    return matchesSearch && matchesStatus;
  }) || [];
  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

 
  
  // Form for status update
  const statusForm = useForm({
    order_id: '',
    status: ''
  });

  // Open modal
  const openStatusModal = (order) => {
    console.log(order);
    setSelectedOrder(order);
    statusForm.setData({
      order_id: order.oid,
      status: order.status
    });

    console.log(statusForm.data);
    setShowStatusModal(true);
  };

  // Close modal
  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
    statusForm.reset();
  };

  // Update status
  function handleStatusUpdate (e)  {
    e.preventDefault();
    console.log(statusForm.data);
    // return;
    statusForm.post(`/orders/update-status`, {
      onSuccess: () => {
        closeStatusModal();
      }
    });
  };
  return (
    <div className="seller-dashboard">
      <FlashMessage />
      
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`seller-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-section">
            <div className="brand-icon">
              <i className="bi bi-shop"></i>
            </div>
            <div className="brand-text">
              <h3 className="brand-name">CoreBuy</h3>
              <span className="brand-subtitle">Seller Panel</span>
            </div>
          </div>
          <button className="sidebar-close d-lg-none" onClick={() => setSidebarOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Seller Info */}
        <div className="seller-info-card">
          <div className="seller-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          <div className="seller-details">
            <h6 className="seller-name">{props.auth?.user?.name || "Seller"}</h6>
            <p className="seller-email">{props.auth?.user?.email}</p>
          </div>
          <div className="store-status-badge active">
            <i className="bi bi-circle-fill"></i>
            Active
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li 
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
            >
              <i className="bi bi-grid-fill"></i>
              <span>Dashboard</span>
            </li>
            <li 
              className={`nav-item ${activeTab === "products" ? "active" : ""}`}
              onClick={() => { setActiveTab("products"); setSidebarOpen(false); }}
            >
              <i className="bi bi-box-seam"></i>
              <span>My Products</span>
              <span className="badge">{props.pcount || 0}</span>
            </li>
            <li 
              className={`nav-item ${activeTab === "addProduct" ? "active" : ""}`}
              onClick={() => { setActiveTab("addProduct"); setSidebarOpen(false); }}
            >
              <i className="bi bi-plus-circle-fill"></i>
              <span>Add Product</span>
            </li>
            <li 
              className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }}
            >
              <i className="bi bi-bag-check-fill"></i>
              <span>Orders</span>
              <span className="badge badge-warning">8</span>
            </li>
            <li 
              className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => { setActiveTab("analytics"); setSidebarOpen(false); }}
            >
              <i className="bi bi-graph-up"></i>
              <span>Analytics</span>
            </li>
            <li 
              className={`nav-item ${activeTab === "payouts" ? "active" : ""}`}
              onClick={() => { setActiveTab("payouts"); setSidebarOpen(false); }}
            >
              <i className="bi bi-wallet2"></i>
              <span>Payouts</span>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button className="btn btn-outline-danger w-100">
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="seller-main">
        {/* HEADER */}
        <div className="seller-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle d-lg-none"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-list"></i>
            </button>
            <div className="header-title">
              <h2>
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "products" && "My Products"}
                {activeTab === "addProduct" && "Add New Product"}
                {activeTab === "orders" && "Order Management"}
                {activeTab === "analytics" && "Analytics & Reports"}
                {activeTab === "payouts" && "Payouts"}
              </h2>
              <p className="header-subtitle">Manage your store and sales efficiently</p>
            </div>
          </div>
          <div className="header-right">
            <button className="btn-notification">
              <i className="bi bi-bell-fill"></i>
              <span className="notification-badge">3</span>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="seller-content">

          {/* OVERVIEW/DASHBOARD */}
          {activeTab === "overview" && (
            <div className="tab-content-wrapper">
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card stat-primary">
                  <div className="stat-icon">
                    <i className="bi bi-box-seam"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Total Products</p>
                    <h3 className="stat-value">{props.pcount || 0}</h3>
                    <div className="stat-trend positive">
                      <i className="bi bi-arrow-up"></i> 12%
                    </div>
                  </div>
                </div>

                <div className="stat-card stat-success">
                  <div className="stat-icon">
                    <i className="bi bi-bag-check"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Total Orders</p>
                    <h3 className="stat-value">{props.orders.length}</h3>
                    <div className="stat-trend positive">
                      <i className="bi bi-arrow-up"></i> 8%
                    </div>
                  </div>
                </div>

                <div className="stat-card stat-warning">
                  <div className="stat-icon">
                    <i className="bi bi-clock-history"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Pending Orders</p>
                    <h3 className="stat-value">{props.orders.length}</h3>
                    <div className="stat-trend neutral">
                      <i className="bi bi-dash"></i> 0%
                    </div>
                  </div>
                </div>

                <div className="stat-card stat-info">
                  <div className="stat-icon">
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Total Revenue</p>
                    <h3 className="stat-value">$12,430</h3>
                    <div className="stat-trend positive">
                      <i className="bi bi-arrow-up"></i> 23%
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions-section">
                <h5 className="section-title">Quick Actions</h5>
                <div className="quick-actions-grid">
                  <div className="action-card" onClick={() => setActiveTab("addProduct")}>
                    <i className="bi bi-plus-circle"></i>
                    <span>Add Product</span>
                  </div>
                  <div className="action-card" onClick={() => setActiveTab("orders")}>
                    <i className="bi bi-box-arrow-in-down"></i>
                    <span>View Orders</span>
                  </div>
                  <div className="action-card" onClick={() => setActiveTab("analytics")}>
                    <i className="bi bi-bar-chart"></i>
                    <span>View Analytics</span>
                  </div>
                  <div className="action-card" onClick={() => setActiveTab("payouts")}>
                    <i className="bi bi-cash-stack"></i>
                    <span>Request Payout</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="recent-activity-section">
                <h5 className="section-title">Recent Activity</h5>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon success">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">New order received</p>
                      <p className="activity-time">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon info">
                      <i className="bi bi-box-seam"></i>
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">Product "Wireless Headphones" updated</p>
                      <p className="activity-time">1 hour ago</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon warning">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">Low stock alert: Smart Watch</p>
                      <p className="activity-time">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MY PRODUCTS */}
          {activeTab === "products" && (
            <div className="tab-content-wrapper">
              {/* Toolbar */}
              <div className="products-toolbar">
                <div className="search-bar">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <select 
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Products</option>
                    <option value="instock">In Stock</option>
                    <option value="outofstock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Image</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="product-name-cell">
                              <strong>{item.name}</strong>
                              <span className="product-desc">{item.desc?.substring(0, 50)}...</span>
                            </div>
                          </td>
                          <td>
                            <img 
                              src={`http://localhost:8000/storage/${item.image}`} 
                              alt={item.name}
                              className="product-thumbnail"
                            />
                          </td>
                          <td>
                            <span className="product-price">${item.price}</span>
                          </td>
                          <td>
                            <span className={`stock-quantity ${item.instock > 10 ? 'high' : item.instock > 0 ? 'low' : 'out'}`}>
                              {item.instock}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${item.instock > 0 ? 'success' : 'danger'}`}>
                              {item.instock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Link 
                                href={EditProduct(item.id)} 
                                className="btn btn-sm btn-primary"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <Link 
                                href={`/seller/deleteProduct/${item.id}`} 
                                className="btn btn-sm btn-danger"
                              >
                                <i className="bi bi-trash"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          <div className="empty-state">
                            <i className="bi bi-inbox"></i>
                            <p>No products found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADD PRODUCT */}
          {activeTab === "addProduct" && (
            <div className="tab-content-wrapper">
              
              <div className="add-product-card">
                <form onSubmit={addproductsubmit} className="product-form">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter product name"
                        value={product.data.name}
                        onChange={(e) => product.setData('name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Price *</label>
                      <div className="input-with-icon">
                        <i className="bi bi-currency-dollar"></i>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          placeholder="0.00"
                          value={product.data.price}
                          onChange={(e) => product.setData('price', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Stock Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter stock quantity"
                        value={product.data.instock}
                        onChange={(e) => product.setData('instock', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        value={product.data.category_id}
                        onChange={(e) => product.setData('category_id', e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {props.categories?.map((item, index) => (
                          <option value={item.id} key={index}>
                            {item.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Description *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Enter product description"
                        value={product.data.desc}
                        onChange={(e) => product.setData('desc', e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Product Image *</label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="productImage"
                          className="file-input"
                          accept="image/*"
                          onChange={(e) => product.setData('image', e.target.files[0])}
                          required
                        />
                        <label htmlFor="productImage" className="file-label">
                          <i className="bi bi-cloud-upload"></i>
                          <span>Click to upload or drag and drop</span>
                          <small>PNG, JPG, GIF up to 10MB</small>
                        </label>
                        {product.data.image && (
                          <div className="file-preview">
                            <i className="bi bi-check-circle-fill text-success"></i>
                            <span>{product.data.image.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-actions">
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-lg"
                          disabled={product.processing}
                        >
                          {product.processing ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Adding Product...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-plus-circle me-2"></i>
                              Add Product
                            </>
                          )}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-lg"
                          onClick={() => product.reset()}
                        >
                          Reset Form
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          {activeTab === "orders" && (
        <div className="tab-content-wrapper">
          {props.orders && props.orders.length > 0 ? (
            <div className="orders-grid">
              {props.orders.map((order, index) => (
                <div key={order.id || index} className="order-card">
                  <div className="order-header">
                    <strong className="order-id">Order #{order.oid}</strong>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="order-body">
                    <div className="order-product-info">
                      <img 
                        src={`http://localhost:8000/storage/${order.product_image}`} 
                        alt={order.product_name}
                        className="order-product-image"
                      />
                      <div>
                        <p className="order-product">{order.product_name}</p>
                        <p className="order-quantity">Qty: {order.quantity}</p>
                      </div>
                    </div>
                    
                    <div className="order-details">
                      <p className="order-meta">
                        <i className="bi bi-calendar"></i> 
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="order-meta">
                        <i className="bi bi-currency-dollar"></i> ${parseFloat(order.pprice).toFixed(2)}
                      </p>
                      <p className="order-meta">
                        <i className="bi bi-geo-alt"></i> {order.city}, {order.state}
                      </p>
                      <p className="order-meta">
                        <i className="bi bi-credit-card"></i> 
                        <span className="text-capitalize">{order.payment_method}</span>
                      </p>
                    </div>
                    
                    <div className="order-total">
                      <strong>Total: ${parseFloat(order.total_amount).toFixed(2)}</strong>
                    </div>
                  </div>
                  
                  <div className="order-footer">
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => openStatusModal(order)}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View Details
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="bi bi-printer me-1"></i>
                      Print
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>No orders found</p>
            </div>
          )}
        </div>
      )}

      {/* STATUS UPDATE MODAL */}
      {showStatusModal && selectedOrder && (
        <>
          <div className="modal-overlay" onClick={closeStatusModal}></div>
          <div className="status-modal">
            <div className="modal-header">
              <h4>
                <i className="bi bi-box-seam me-2"></i>
                Order Details & Status Update
              </h4>
              <button className="btn-close-modal" onClick={closeStatusModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Order Information */}
              <div className="order-info-section">
                <h5 className="section-title">Order Information</h5>
                <div className="info-grid">
                  <div className="info-row">
                    <span className="info-label">Order ID:</span>
                    <span className="info-value">#{selectedOrder.id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date:</span>
                    <span className="info-value">
                      {new Date(selectedOrder.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Payment Method:</span>
                    <span className="info-value text-capitalize">{selectedOrder.payment_method}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Total Amount:</span>
                    <span className="info-value text-primary fw-bold">
                      ${parseFloat(selectedOrder.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="product-info-section">
                <h5 className="section-title">Product Details</h5>
                <div className="product-detail-card">
                  <img 
                    src={`http://localhost:8000/storage/${selectedOrder.product_image}`} 
                    alt={selectedOrder.product_name}
                    className="product-detail-image"
                  />
                  <div className="product-detail-info">
                    <h6>{selectedOrder.product_name}</h6>
                    <p className="product-price">
                      ${parseFloat(selectedOrder.pprice).toFixed(2)} × {selectedOrder.quantity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="shipping-info-section">
                <h5 className="section-title">Shipping Address</h5>
                <div className="address-card">
                  <i className="bi bi-geo-alt-fill"></i>
                  <div className="address-details">
                    <p>{selectedOrder.address}</p>
                    {selectedOrder.apartment && <p>{selectedOrder.apartment}</p>}
                    <p>{selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip}</p>
                    <p>{selectedOrder.country}</p>
                    <p className="phone-number">
                      <i className="bi bi-phone"></i> {selectedOrder.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="status-update-section">
                <h5 className="section-title">Update Order Status</h5>
                <form onSubmit={handleStatusUpdate}>
                  {console.log(selectedOrder)}
                  <div className="current-status-display">
                    <span className="label">Current Status:</span>
                    <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="status-options">
                    <label className="status-option">
                      <input
                        type="radio"
                        name="status"
                        value="Pending"
                        checked={statusForm.data.status === 'Pending'}
                        onChange={(e) => statusForm.setData('status', e.target.value)}
                      />
                      <div className="option-card pending">
                        <i className="bi bi-clock-history"></i>
                        <span>Pending</span>
                        <p>Order is awaiting processing</p>
                      </div>
                    </label>

                    <label className="status-option">
                      <input
                        type="radio"
                        name="status"
                        value="Processing"
                        checked={statusForm.data.status === 'Processing'}
                        onChange={(e) => statusForm.setData('status', e.target.value)}
                      />
                      <div className="option-card processing">
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Processing</span>
                        <p>Order is being prepared</p>
                      </div>
                    </label>

                    <label className="status-option">
                      <input
                        type="radio"
                        name="status"
                        value="Completed"
                        checked={statusForm.data.status === 'Completed'}
                        onChange={(e) => statusForm.setData('status', e.target.value)}
                      />
                      <div className="option-card completed">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Completed</span>
                        <p>Order has been delivered</p>
                      </div>
                    </label>

                    <label className="status-option">
                      <input
                        type="radio"
                        name="status"
                        value="Cancelled"
                        checked={statusForm.data.status === 'Cancelled'}
                        onChange={(e) => statusForm.setData('status', e.target.value)}
                      />
                      <div className="option-card cancelled">
                        <i className="bi bi-x-circle-fill"></i>
                        <span>Cancelled</span>
                        <p>Order has been cancelled</p>
                      </div>
                    </label>
                  </div>

                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={closeStatusModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={statusForm.processing}
                    >
                      {statusForm.processing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Update Status
                        </>
                      )}
                       </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="tab-content-wrapper">
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-header">
                    <h6>Monthly Sales Target</h6>
                    <span className="analytics-value">$10,000</span>
                  </div>
                  <div className="progress-wrapper">
                    <div className="progress">
                      <div className="progress-bar bg-primary" style={{ width: "70%" }}></div>
                    </div>
                    <span className="progress-label">$7,000 / $10,000 (70%)</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h6>Order Fulfillment Rate</h6>
                    <span className="analytics-value">92%</span>
                  </div>
                  <div className="progress-wrapper">
                    <div className="progress">
                      <div className="progress-bar bg-success" style={{ width: "92%" }}></div>
                    </div>
                    <span className="progress-label">284 / 309 orders fulfilled</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h6>Customer Satisfaction</h6>
                    <span className="analytics-value">4.8/5</span>
                  </div>
                  <div className="rating-stars">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-half"></i>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYOUTS */}
          {activeTab === "payouts" && (
            <div className="tab-content-wrapper">
              <div className="payout-card">
                <div className="payout-header">
                  <div className="payout-icon">
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <div className="payout-info">
                    <p className="payout-label">Available Balance</p>
                    <h2 className="payout-amount">$1,230.00</h2>
                    <p className="payout-pending">$450.00 pending clearance</p>
                  </div>
                </div>
                <div className="payout-body">
                  <div className="payout-details">
                    <div className="detail-item">
                      <span className="detail-label">Last Payout</span>
                      <span className="detail-value">$850.00</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payout Date</span>
                      <span className="detail-value">Jan 15, 2026</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Earned</span>
                      <span className="detail-value">$12,430.00</span>
                    </div>
                  </div>
                </div>
                <div className="payout-footer">
                  <button className="btn btn-primary btn-lg w-100">
                    <i className="bi bi-cash-stack me-2"></i>
                    Request Payout
                  </button>
                </div>
              </div>

              {/* Payout History */}
              <div className="payout-history">
                <h5 className="section-title">Payout History</h5>
                <div className="history-list">
                  <div className="history-item">
                    <div className="history-icon success">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="history-content">
                      <p className="history-title">Payout Completed</p>
                      <p className="history-date">January 15, 2026</p>
                    </div>
                    <div className="history-amount">+$850.00</div>
                  </div>
                  <div className="history-item">
                    <div className="history-icon success">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="history-content">
                      <p className="history-title">Payout Completed</p>
                      <p className="history-date">December 15, 2025</p>
                    </div>
                    <div className="history-amount">+$1,200.00</div>
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

export default Seller;