import React, { useState } from "react";
import "../css/admin.css";
import { useForm, usePage, Link } from "@inertiajs/react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const props = usePage().props;
  // console.log( props); // Debugging line to check props
  const category = useForm({
    category: ''
  });

  // Edit user modal form
  const [editModalOpen, setEditModalOpen] = useState(false);
  const editForm = useForm({
    id: '',
    name: '',
    email: '',
    role: '',
    status: ''
  });

  function openEditModal(user) {
    editForm.setData({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'User',
      status: user.status || ''
    });
    setEditModalOpen(true);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    editForm.post('/admin/user/update', {
      onSuccess: () => {
        setEditModalOpen(false);
      }
    });
  }

  function handleCatSubmit(e) {
    e.preventDefault();
    category.post('/addcate', {
      onSuccess: () => {
        category.reset();
      }
    });
  }

  // Sample data (replace with props data when available)
  const users = props.users || [
    { id: 1, name: "Zohaib Ahmed", email: "zohaib@example.com", status: "Pending", role: "User", created_at: "2026-01-15" },
    { id: 2, name: "Sarah Khan", email: "sarah@example.com", status: "Approved", role: "User", created_at: "2026-01-20" },
    { id: 3, name: "Ali Hassan", email: "ali@example.com", status: "Pending", role: "Seller", created_at: "2026-01-25" },
  ];

  const products = props.products || [
    { id: 1, name: "Wireless Camera", seller: "SellerX", price: 129, status: "Pending", created_at: "2026-01-28" },
    { id: 2, name: "Smart Watch Pro", seller: "TechSeller", price: 199, status: "Pending", created_at: "2026-01-29" },
  ];

  const sellers = props.sellers || [
    { id: 1, name: "SellerTech", products: 45, revenue: 12500, status: "Active", rating: 4.8 },
    { id: 2, name: "TechGadgets", products: 32, revenue: 8900, status: "Active", rating: 4.5 },
    { id: 3, name: "ElectroHub", products: 28, revenue: 6700, status: "Flagged", rating: 3.9 },
  ];

  const orders = props.reported_orders || [
    { id: "#CB10291", customer: "John Doe", amount: 299, status: "Dispute", issue: "Product not received" },
    { id: "#CB10292", customer: "Jane Smith", amount: 450, status: "Dispute", issue: "Wrong item delivered" },
  ];

  const reports = [
    { id: 1, type: "Product", description: "Policy violation - misleading images", reported_by: "User123", date: "2026-01-30" },
    { id: 2, type: "Seller", description: "Fake reviews detected", reported_by: "User456", date: "2026-01-29" },
  ];

  const logs = [
    { id: 1, action: "Admin approved user ID 1281", admin: "Admin", timestamp: "2026-01-31 10:30 AM" },
    { id: 2, action: "Admin rejected product ID 991", admin: "Admin", timestamp: "2026-01-31 09:15 AM" },
    { id: 3, action: "Seller temporarily frozen", admin: "Admin", timestamp: "2026-01-30 05:45 PM" },
  ];

  function approveProduct(productId) {
    // Implement product approval logic here (e.g., send request to backend)
    console.log(`Approving product with ID: ${productId}`);
  }
  return (
    <div className="admin-dashboard">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-section">
            <div className="brand-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <div className="brand-info">
              <h3 className="brand-name">CoreBuy</h3>
              <span className="admin-badge">ADMIN PANEL</span>
            </div>
          </div>
          <button className="close-sidebar d-lg-none" onClick={() => setSidebarOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Admin Profile */}
        <div className="admin-profile-card">
          <div className="admin-avatar">
            <i className="bi bi-person-badge"></i>
          </div>
          <div className="admin-info">
            <h5 className="admin-name">Administrator</h5>
            <p className="admin-role">Super Admin</p>
          </div>
          <div className="admin-status-badge">
            <i className="bi bi-circle-fill"></i>
            <span>Active</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
            >
              <i className="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </li>
            <li
              className={`nav-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => { setActiveTab("users"); setSidebarOpen(false); }}
            >
              <i className="bi bi-people"></i>
              <span>User Verification</span>
              <span className="badge bg-warning ms-auto">3</span>
            </li>
            <li
              className={`nav-item ${activeTab === "products" ? "active" : ""}`}
              onClick={() => { setActiveTab("products"); setSidebarOpen(false); }}
            >
              <i className="bi bi-box-seam"></i>
              <span>Product Review</span>
              <span className="badge bg-danger ms-auto">2</span>
            </li>
            <li
              className={`nav-item ${activeTab === "category" ? "active" : ""}`}
              onClick={() => { setActiveTab("category"); setSidebarOpen(false); }}
            >
              <i className="bi bi-tags"></i>
              <span>Manage Categories</span>
            </li>
            <li
              className={`nav-item ${activeTab === "sellers" ? "active" : ""}`}
              onClick={() => { setActiveTab("sellers"); setSidebarOpen(false); }}
            >
              <i className="bi bi-shop"></i>
              <span>Seller Control</span>
            </li>
            <li
              className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }}
            >
              <i className="bi bi-receipt"></i>
              <span>Order Oversight</span>
            </li>
            <li
              className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
              onClick={() => { setActiveTab("reports"); setSidebarOpen(false); }}
            >
              <i className="bi bi-flag"></i>
              <span>Reports</span>
            </li>
            <li
              className={`nav-item ${activeTab === "logs" ? "active" : ""}`}
              onClick={() => { setActiveTab("logs"); setSidebarOpen(false); }}
            >
              <i className="bi bi-clock-history"></i>
              <span>Audit Logs</span>
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
      <main className="admin-main-content">
        {/* TOP HEADER */}
        <header className="admin-top-header">
          <div className="header-left">
            <button
              className="btn btn-light sidebar-toggle d-lg-none me-3"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <div className="header-title-section">
              <h2 className="page-title">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "users" && "User Verification"}
                {activeTab === "products" && "Product Review"}
                {activeTab === "category" && "Manage Categories"}
                {activeTab === "sellers" && "Seller Control"}
                {activeTab === "orders" && "Order Oversight"}
                {activeTab === "reports" && "Reports & Flags"}
                {activeTab === "logs" && "Audit Logs"}
              </h2>
              <p className="page-subtitle">Moderate & verify platform activity</p>
            </div>
          </div>
          <div className="header-right">
            <button className="btn btn-light notification-btn position-relative">
              <i className="bi bi-bell-fill fs-5"></i>
              <span className="notification-badge">5</span>
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="admin-content-area">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="overview-section">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card stat-warning">
                  <div className="stat-icon">
                    <i className="bi bi-people"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Pending Users</p>
                    <h3 className="stat-value">12</h3>
                    <span className="stat-trend">
                      <i className="bi bi-clock"></i> Awaiting approval
                    </span>
                  </div>
                </div>

                <div className="stat-card stat-danger">
                  <div className="stat-icon">
                    <i className="bi bi-box-seam"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Pending Products</p>
                    <h3 className="stat-value">28</h3>
                    <span className="stat-trend">
                      <i className="bi bi-clock"></i> Needs review
                    </span>
                  </div>
                </div>

                <div className="stat-card stat-info">
                  <div className="stat-icon">
                    <i className="bi bi-exclamation-triangle"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Reported Orders</p>
                    <h3 className="stat-value">6</h3>
                    <span className="stat-trend">
                      <i className="bi bi-flag"></i> Disputes active
                    </span>
                  </div>
                </div>

                <div className="stat-card stat-primary">
                  <div className="stat-icon">
                    <i className="bi bi-shield-exclamation"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Flagged Sellers</p>
                    <h3 className="stat-value">2</h3>
                    <span className="stat-trend">
                      <i className="bi bi-eye"></i> Under investigation
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions-section mt-4">
                <h5 className="section-title">Quick Actions</h5>
                <div className="quick-actions-grid">
                  <button className="action-card" onClick={() => setActiveTab("users")}>
                    <i className="bi bi-person-check"></i>
                    <span>Verify Users</span>
                  </button>
                  <button className="action-card" onClick={() => setActiveTab("products")}>
                    <i className="bi bi-box-seam-fill"></i>
                    <span>Review Products</span>
                  </button>
                  <button className="action-card" onClick={() => setActiveTab("category")}>
                    <i className="bi bi-tags-fill"></i>
                    <span>Add Category</span>
                  </button>
                  <button className="action-card" onClick={() => setActiveTab("reports")}>
                    <i className="bi bi-flag-fill"></i>
                    <span>View Reports</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="recent-activity-section mt-4">
                <h5 className="section-title">Recent Activity</h5>
                <div className="activity-list">
                  {logs.slice(0, 5).map((log) => (
                    <div key={log.id} className="activity-item">
                      <div className="activity-icon">
                        <i className="bi bi-clock-history"></i>
                      </div>
                      <div className="activity-content">
                        <p className="activity-text">{log.action}</p>
                        <span className="activity-time">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USER VERIFICATION TAB */}
          {activeTab === "users" && (
            <div className="users-section">
              <div className="table-card">
                <div className="table-header">
                  <h5>Pending User Verifications</h5>
                  <div className="filter-buttons">
                    <button className="btn btn-sm btn-outline-primary active">All</button>
                    <button className="btn btn-sm btn-outline-primary">Pending</button>
                    <button className="btn btn-sm btn-outline-primary">Approved</button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">
                                {user.name.charAt(0)}
                              </div>
                              <strong>{user.name}</strong>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role.toLowerCase()}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge status-${user.status}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn btn-sm btn-success">
                                <i className="bi bi-check-lg"></i>
                              </button>
                              <button className="btn btn-sm btn-danger">
                                <i className="bi bi-x-lg"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditModal(user)}>
                                <i className="bi bi-pencil"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCT REVIEW TAB */}
          {activeTab === "products" && (
            <div className="products-section">
              <div className="table-card">
                <div className="table-header">
                  <h5>Products Awaiting Approval</h5>
                  <button className="btn btn-primary btn-sm">
                    <i className="bi bi-filter me-2"></i>
                    Filter
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Seller</th>
                        <th>Price</th>
                        <th>Instock</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="product-info">
                              <div className="product-icon">
                                <i className="bi bi-box"></i>
                              </div>
                              <strong>{product.name}</strong>
                            </div>
                          </td>
                          <td>{product.seller_name}</td>
                          <td className="fw-bold">${product.price}</td>
                          <td>
                            <span className={`status-badge status-${product.status}`}>
                              {product.instock}
                            </span>
                          </td>
                          <td>{new Date(product.created_at).toLocaleDateString()}</td>
                          <td>{product.status}</td>

                          <td>
                            <div className="action-buttons">
                              <Link href={`/approve/${product.id}`} className="btn btn-sm btn-success" onClick={approveProduct(product.id)}>
                              
                                <i className="bi bi-check-lg me-1"></i>
                                Approve
                              </Link>
                              <Link href={`/reject/${product.id}`} className="btn btn-sm btn-danger">
                                <i className="bi bi-x-lg me-1"></i>
                                Reject
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY TAB */}
          {activeTab === "category" && (
            <div className="category-section">
              <div className="row g-4">
                <div className="col-lg-4">
                  <div className="form-card">
                    <div className="form-header">
                      <h4>Add New Category</h4>
                      <p>Create a new product category</p>
                    </div>
                    <form onSubmit={handleCatSubmit} className="category-form">
                      <div className="mb-3">
                        <label className="form-label">Category Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Electronics, Fashion"
                          value={category.data.category}
                          onChange={(e) => category.setData('category', e.target.value)}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={category.processing}
                      >
                        {category.processing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-lg me-2"></i>
                            Add Category
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="col-lg-8">
                  <div className="table-card">
                    <div className="table-header">
                      <h5>All Categories ({props.categories?.length || 0})</h5>
                      <div className="search-box-small">
                        <i className="bi bi-search"></i>
                        <input type="text" placeholder="Search categories..." />
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Category Name</th>
                            <th>Products</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {props.categories?.map((item, index) => (
                            <tr key={index}>
                              <td>#{item.id}</td>
                              <td>
                                <div className="category-name">
                                  <i className="bi bi-tag-fill me-2"></i>
                                  <strong>{item.category}</strong>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-info">
                                  {props.products?.filter(p => p.category_id === item.id).length || 0}
                                </span>
                              </td>
                              <td>
                                <span className="status-badge status-active">Active</span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button className="btn btn-sm btn-outline-primary">
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button className="btn btn-sm btn-outline-danger">
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SELLERS TAB */}
          {activeTab === "sellers" && (
            <div className="sellers-section">
              <div className="table-card">
                <div className="table-header">
                  <h5>Seller Management</h5>
                  <div className="filter-buttons">
                    <button className="btn btn-sm btn-outline-primary active">All</button>
                    <button className="btn btn-sm btn-outline-success">Active</button>
                    <button className="btn btn-sm btn-outline-danger">Flagged</button>
                  </div>
                </div>
                <div className="sellers-grid">
                  {sellers.map((seller) => (
                    <div key={seller.id} className="seller-card">
                      <div className="seller-header">
                        <div className="seller-avatar">
                          <i className="bi bi-shop"></i>
                        </div>
                        <div className="seller-info">
                          <h5>{seller.name}</h5>
                          <span className={`status-badge status-${seller.status}`}>
                            {seller.status}
                          </span>
                        </div>
                      </div>
                      <div className="seller-stats">
                        <div className="stat">
                          <i className="bi bi-box"></i>
                          <div>
                            <strong>{seller.products}</strong>
                            <span>Products</span>
                          </div>
                        </div>
                        <div className="stat">
                          <i className="bi bi-currency-dollar"></i>
                          <div>
                            <strong>${seller.revenue}</strong>
                            <span>Revenue</span>
                          </div>
                        </div>
                        <div className="stat">
                          <i className="bi bi-star-fill"></i>
                          <div>
                            <strong>{seller.rating}</strong>
                            <span>Rating</span>
                          </div>
                        </div>
                      </div>
                      <div className="seller-actions">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-eye me-1"></i>
                          View Details
                        </button>
                        <button className="btn btn-sm btn-warning">
                          <i className="bi bi-pause-circle me-1"></i>
                          Freeze
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="orders-section">
              <div className="table-card">
                <div className="table-header">
                  <h5>Disputed Orders</h5>
                  <span className="badge bg-danger">Requires Attention</span>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Issue</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td><strong>{order.id}</strong></td>
                          <td>{order.customer}</td>
                          <td className="fw-bold">${order.amount}</td>
                          <td>{order.issue}</td>
                          <td>
                            <span className="status-badge status-dispute">
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn btn-sm btn-primary">
                                <i className="bi bi-arrow-up-circle me-1"></i>
                                Escalate
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
                                <i className="bi bi-eye me-1"></i>
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === "reports" && (
            <div className="reports-section">
              <div className="reports-grid">
                {reports.map((report) => (
                  <div key={report.id} className="report-card">
                    <div className="report-header">
                      <span className={`report-type ${report.type.toLowerCase()}`}>
                        <i className={`bi bi-${report.type === 'Product' ? 'box' : 'shop'}`}></i>
                        {report.type} Report
                      </span>
                      <span className="report-date">{report.date}</span>
                    </div>
                    <div className="report-body">
                      <p className="report-description">
                        <i className="bi bi-flag-fill me-2"></i>
                        {report.description}
                      </p>
                      <p className="report-meta">
                        Reported by: <strong>{report.reported_by}</strong>
                      </p>
                    </div>
                    <div className="report-actions">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-eye me-1"></i>
                        Investigate
                      </button>
                      <button className="btn btn-sm btn-success">
                        <i className="bi bi-check-lg me-1"></i>
                        Resolve
                      </button>
                      <button className="btn btn-sm btn-danger">
                        <i className="bi bi-x-lg me-1"></i>
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUDIT LOGS TAB */}
          {activeTab === "logs" && (
            <div className="logs-section">
              <div className="table-card">
                <div className="table-header">
                  <h5>Audit Trail</h5>
                  <div className="filter-buttons">
                    <button className="btn btn-sm btn-outline-primary active">Today</button>
                    <button className="btn btn-sm btn-outline-primary">This Week</button>
                    <button className="btn btn-sm btn-outline-primary">This Month</button>
                  </div>
                </div>
                <div className="logs-list">
                  {logs.map((log) => (
                    <div key={log.id} className="log-item">
                      <div className="log-icon">
                        <i className="bi bi-shield-check"></i>
                      </div>
                      <div className="log-content">
                        <p className="log-action">{log.action}</p>
                        <div className="log-meta">
                          <span>
                            <i className="bi bi-person me-1"></i>
                            {log.admin}
                          </span>
                          <span>
                            <i className="bi bi-clock me-1"></i>
                            {log.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Edit User Modal */}
      {editModalOpen && (
        <div>
          <div className="sidebar-overlay" onClick={() => setEditModalOpen(false)}></div>
          <div className="admin-modal" style={{position: 'fixed',left: '50%',top: '50%',transform: 'translate(-50%, -50%)',zIndex:1100,width:'480px',background:'#fff',borderRadius:'8px',boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
            <div style={{padding:'1rem 1.25rem',borderBottom:'1px solid #e5e7eb',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h5 style={{margin:0}}>Edit User</h5>
              <button className="close-sidebar" onClick={() => setEditModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} style={{padding:'1rem 1.25rem'}}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} required />
                {editForm.errors.name && <div className="text-danger small">{editForm.errors.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} required />
                {editForm.errors.email && <div className="text-danger small">{editForm.errors.email}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select className="form-select" value={editForm.data.role} onChange={(e) => editForm.setData('role', e.target.value)}>
                  <option value="Seller">Seller</option>
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                  
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select className="form-select" value={editForm.data.status} onChange={(e) => editForm.setData('status', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Active</option>
                </select>
              </div>
              <div style={{display:'flex',gap:'0.5rem',justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={editForm.processing}>
                  {editForm.processing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;