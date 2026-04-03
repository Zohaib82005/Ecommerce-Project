import React, { useEffect, useState } from "react";
import "../css/seller.css";
import { useForm, usePage, Link, router} from "@inertiajs/react";
import FlashMessage from '../components/FlashMessage.jsx';
import LoadingScreen from "../components/LoadingScreen.jsx";
const Seller = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [orderFilterStatus, setOrderFilterStatus] = useState("all");
  
  // States for categories
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subSubcategories, setSubSubcategories] = useState([]);
  
  const product = useForm({
    name: '',
    price: '',
    discount_price: '',
    discount_type: 'percentage',
    instock: '',
    desc: '',
    image: null,
    image1: null,
    image2: null,
    image3: null,
    category_id: '',
    subcategory_id: '',
    sub_subcategory_id: ''
  });

  const props = usePage().props;

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    product.setData('category_id', categoryId);
    product.setData('subcategory_id', '');
    product.setData('sub_subcategory_id', '');
    setSubcategories([]);
    setSubSubcategories([]);

    if (categoryId) {
      try {
        const response = await fetch(`/api/subcategories/${categoryId}`);
        const data = await response.json();
        console.log('Fetched subcategories:', data);
        setSubcategories(data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    }
  };

  // Fetch sub-subcategories when subcategory changes
  const handleSubcategoryChange = async (e) => {
    const subcategoryId = e.target.value;
    product.setData('subcategory_id', subcategoryId);
    product.setData('sub_subcategory_id', '');
    setSubSubcategories([]);

    if (subcategoryId) {
      try {
        const response = await fetch(`/api/sub-subcategories/${subcategoryId}`);
        const data = await response.json();
        setSubSubcategories(data);
      } catch (error) {
        console.error('Error fetching sub-subcategories:', error);
      }
    }
  };

 function addproductsubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', product.data.name);
    formData.append('price', product.data.price);
    formData.append('instock', product.data.instock);
    formData.append('desc', product.data.desc);
    formData.append('category_id', product.data.category_id);
    formData.append('subcategory_id', product.data.subcategory_id);
    formData.append('discount_type', product.data.discount_type);

    // Only append if not empty
    if (product.data.discount_price) 
        formData.append('discount_price', product.data.discount_price);
    if (product.data.sub_subcategory_id) 
        formData.append('sub_subcategory_id', product.data.sub_subcategory_id);

    // Only append files if they are actual File objects
    if (product.data.image instanceof File) 
        formData.append('image', product.data.image);
    if (product.data.image1 instanceof File) 
        formData.append('image1', product.data.image1);
    if (product.data.image2 instanceof File) 
        formData.append('image2', product.data.image2);
    if (product.data.image3 instanceof File) 
        formData.append('image3', product.data.image3);

    router.post('/addProduct', formData, {
        forceFormData: true,
        onError: (errors) => console.log(errors),
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
  
  const filteredOrders = (props.orders ? 
    Array.from(new Map(props.orders.map(order => [order.oid, order])).values()) : [])
    .filter(order => {
        if (orderFilterStatus === "all") return true;
        return order.status === orderFilterStatus;
    });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // States for deals management
  const [deals, setDeals] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dealSearch, setDealSearch] = useState("");
  const [discountType, setDiscountType] = useState("percentage");

  const dealForm = useForm({
    deal_name: '',
    discount_type: 'percentage',
    discount_value: '',
    start_date: '',
    end_date: '',
    products: []
  });

  // Handle product checkbox in deals
  const handleProductCheckbox = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle deal form submit
  const handleDealSubmit = (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    if (!dealForm.data.deal_name) {
      alert('Please enter a deal name');
      return;
    }

    if (!dealForm.data.discount_value) {
      alert('Please enter a discount value');
      return;
    }

    if (!dealForm.data.start_date) {
      alert('Please select a start date');
      return;
    }

    if (!dealForm.data.end_date) {
      alert('Please select an end date');
      return;
    }

    // Create complete form data with products
    const completeFormData = {
      deal_name: dealForm.data.deal_name,
      discount_type: dealForm.data.discount_type,
      discount_value: dealForm.data.discount_value,
      start_date: dealForm.data.start_date,
      end_date: dealForm.data.end_date,
      products: selectedProducts
    };

    // Use router.post with the complete data
    router.post('/seller/deals/store', completeFormData, {
      onSuccess: (page) => {
        dealForm.reset();
        setSelectedProducts([]);
        // Reload deals after successful creation
        fetchDeals();
        alert('Deal created successfully!');
      },
      onError: (errors) => {
        console.error('Deal creation errors:', errors);
        alert('Failed to create deal. Please check the form.');
      }
    });
  };

  // Fetch deals from backend
  const fetchDeals = () => {
    fetch('/seller/deals')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setDeals(data.deals);
        }
      })
      .catch(error => console.error('Error fetching deals:', error));
  };

  // Fetch deals on component mount
  useEffect(() => {
    fetchDeals();
  }, []);

  // Delete a deal
  const deleteDeal = (dealId) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      router.delete(`/seller/deals/delete/${dealId}`, {
        onSuccess: () => {
          fetchDeals();
          alert('Deal deleted successfully!');
        },
        onError: (errors) => {
          console.error('Delete error:', errors);
          alert('Failed to delete deal');
        }
      });
    }
  };
  
  // Form for status update
  const statusForm = useForm({
    order_id: '',
    product_id: [],
    status: ''
  });

  // Open modal
  const openStatusModal = (order) => {
    // Collect all product IDs for this order
    const productIds = props.orders
      .filter(o => o.oid === order.oid)
      .map(o => o.pid);
    
    setSelectedOrder(order);
    statusForm.setData({
      order_id: order.oid,
      product_id: productIds,
      status: order.status
    });

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
    // console.log(statusForm.data);
    // return;
    statusForm.post(`/orders/update-status`, {
      onSuccess: () => {
        closeStatusModal();
      }
    });
  };
  return (
    
    <div className="seller-dashboard">
      <LoadingScreen/>
      <FlashMessage errors={product.errors}/>
      
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
              className={`nav-item ${activeTab === "deals" ? "active" : ""}`}
              onClick={() => { setActiveTab("deals"); setSidebarOpen(false); }}
            >
              <i className="bi bi-lightning-fill"></i>
              <span>Manage Deals</span>
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
          <Link href="/logout" className="btn btn-outline-danger w-100">
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </Link>
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
                {activeTab === "deals" && "Manage Deals"}
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
                    <h3 className="stat-value">RM 12,430</h3>
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
                      <th>Discount</th>
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
                            <span className="product-price">RM {item.price}</span>
                          </td>
                          <td>
                            <div className="discount-display">
                              {item.discount_price ? (
                                <>
                                  <span className="discount-value">
                                    {item.discount_price}{item.discount_type === 'percentage' ? '%' : ' RM'}
                                  </span>
                                  <span className="discount-type-badge">
                                    {item.discount_type === 'percentage' ? 'Percent' : 'Fixed'}
                                  </span>
                                </>
                              ) : (
                                <span className="no-discount">No discount</span>
                              )}
                            </div>
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
                <form onSubmit={addproductsubmit} className="product-form" encType="multipart/form-data">
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
                      <label className="form-label">Discounted Price</label>
                      <div className="input-with-icon">
                        <i className="bi bi-tag-fill"></i>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          placeholder="0.00"
                          value={product.data.discount_price}
                          onChange={(e) => product.setData('discount_price', e.target.value)}
                        />
                      </div>
                      <small className="text-muted">Leave empty if no discount</small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Discount Type</label>
                      <select
                        className="form-select"
                        value={product.data.discount_type}
                        onChange={(e) => product.setData('discount_type', e.target.value)}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (RM)</option>
                      </select>
                      <small className="text-muted">
                        {product.data.discount_type === 'percentage' 
                          ? 'Discount percentage value (0-100)' 
                          : 'Fixed discount amount in RM'}
                      </small>
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
                      <label className="form-label">Main Category *</label>
                      <select
                        className="form-select"
                        value={product.data.category_id}
                        onChange={handleCategoryChange}
                        required
                      >
                        <option value="">Select Main Category</option>
                        {categories?.map((item, index) => (
                          <option value={item.id} key={index}>
                            {item.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        value={product.data.subcategory_id}
                        onChange={handleSubcategoryChange}
                        required
                        disabled={!product.data.category_id}
                      >
                        <option value="">Select Category</option>
                        {subcategories?.map((item, index) => (
                          <option value={item.id} key={index}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Sub Category</label>
                      <select
                        className="form-select"
                        value={product.data.sub_subcategory_id}
                        onChange={(e) => product.setData('sub_subcategory_id', e.target.value)}
                        disabled={!product.data.subcategory_id}
                      >
                        <option value="">Select Sub Category (Optional)</option>
                        {subSubcategories?.map((item, index) => (
                          <option value={item.id} key={index}>
                            {item.name}
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
                      <label className="form-label">Product Image * (Main Image)</label>
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
                      <label className="form-label">Additional Product Images (Optional - Up to 3)</label>
                      <div className="row g-3">
                        {[
                          { key: 'image1', label: 'Image 1' },
                          { key: 'image2', label: 'Image 2' },
                          { key: 'image3', label: 'Image 3' }
                        ].map((img) => (
                          <div key={img.key} className="col-md-4">
                            <div className="file-upload-wrapper">
                              <input
                                type="file"
                                id={img.key}
                                className="file-input"
                                accept="image/*"
                                onChange={(e) => {
                                  product.setData(img.key, e.target.files[0]);
                                }}
                              />
                              <label htmlFor={img.key} className="file-label">
                                <i className="bi bi-cloud-upload"></i>
                                <span>{img.label}</span>
                                <small>Optional</small>
                              </label>
                              {product.data[img.key] && (
                                <div className="file-preview">
                                  <i className="bi bi-check-circle-fill text-success"></i>
                                  <span>{product.data[img.key].name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
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
          <div className="products-toolbar">
            <div className="filter-group">
              <select 
                className="form-select"
                value={orderFilterStatus}
                onChange={(e) => setOrderFilterStatus(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          {filteredOrders.length > 0 ? (
            <div className="orders-grid">
              {/* Group orders by order ID */}
              {filteredOrders.map((groupedOrder, index) => {
                const productsInOrder = props.orders.filter(o => o.oid === groupedOrder.oid);
                return (
                  <div key={groupedOrder.oid || index} className="order-card">
                    <div className="order-header">
                      <strong className="order-id">Order #{groupedOrder.oid}</strong>
                      <span className={`status-badge ${groupedOrder.status.toLowerCase()}`}>
                        {groupedOrder.status}
                      </span>
                    </div>
                    
                    <div className="order-body">
                      {/* Display all products in this order */}
                      {productsInOrder.map((product, prodIdx) => (
                        <div key={prodIdx} className="order-product-info">
                          <img 
                            src={`/storage/${product.product_image}`} 
                            alt={product.product_name}
                            className="order-product-image"
                          />
                          <div>
                            <p className="order-product">{product.product_name}</p>
                            <p className="order-quantity">Qty: {product.quantity}</p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="order-details">
                        <p className="order-meta">
                          <i className="bi bi-calendar"></i> 
                          {new Date(groupedOrder.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="order-meta">
                          <i className="bi bi-currency-dollar"></i> RM {parseFloat(groupedOrder.total_amount).toFixed(2)}
                        </p>
                        <p className="order-meta">
                          <i className="bi bi-geo-alt"></i> {groupedOrder.city}, {groupedOrder.state}
                        </p>
                        <p className="order-meta">
                          <i className="bi bi-credit-card"></i> 
                          <span className="text-capitalize">{groupedOrder.payment_method}</span>
                        </p>
                      </div>
                      
                      <div className="order-total">
                        <strong>Total: RM {parseFloat(groupedOrder.total_amount).toFixed(2)}</strong>
                      </div>
                    </div>
                    
                    <div className="order-footer">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => openStatusModal(groupedOrder)}
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
                );
              })}
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
                    <span className="info-value">#{selectedOrder.oid}</span>
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
                      RM {parseFloat(selectedOrder.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="product-info-section">
                <h5 className="section-title">Product Details</h5>
                {props.orders
                  .filter(o => o.oid === selectedOrder.oid)
                  .map((product, idx) => (
                    <div className="product-detail-card" key={idx}>
                      <img 
                        src={`http://localhost:8000/storage/${product.product_image}`} 
                        alt={product.product_name}
                        className="product-detail-image"
                      />
                      <div className="product-detail-info">
                        <h6>{product.product_name}</h6>
                        <p className="product-price">
                          RM {parseFloat(product.pprice).toFixed(2)} × {product.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
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
                  {/* {console.log(selectedOrder)} */}
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
                        value="Shipped"
                        checked={statusForm.data.status === 'Shipped'}
                        onChange={(e) => statusForm.setData('status', e.target.value)}
                      />
                      <div className="option-card shipped">
                        <i className="bi bi-box-seam"></i>
                        <span>Shipped</span>
                        <p>Order has been shipped</p>
                      </div>
                    </label>

                    <label className="status-option">
                      <input
                        type="radio"
                        name="status"
                        value="Delivered"
                        checked={statusForm.data.status === 'Delivered'}
                        onChange={(e) => statusForm.setData('status', e.target.value)}
                      />
                      <div className="option-card delivered">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Delivered</span>
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

          {/* DEALS MANAGEMENT */}
          {activeTab === "deals" && (
        <>
          <div className="deals-management-section">
            {/* Deal Creation Form */}
            <div className="deals-form-container">
              <div className="form-header">
                <h3><i className="bi bi-lightning-fill"></i> Create New Deal</h3>
                <p>Set up flash deals and special offers for your products</p>
              </div>

              <form onSubmit={handleDealSubmit} className="deals-form">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-label">Deal Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Summer Sale, Black Friday Deal"
                        value={dealForm.data.deal_name}
                        onChange={(e) => dealForm.setData('deal_name', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Discount Type</label>
                      <select
                        className="form-select"
                        value={dealForm.data.discount_type}
                        onChange={(e) => dealForm.setData('discount_type', e.target.value)}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (RM)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Discount Value</label>
                      <div className="discount-input-wrapper">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter discount value"
                          value={dealForm.data.discount_value}
                          onChange={(e) => dealForm.setData('discount_value', e.target.value)}
                          required
                        />
                        <span className="discount-unit">
                          {dealForm.data.discount_type === 'percentage' ? '%' : 'RM'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Start Date & Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={dealForm.data.start_date}
                        onChange={(e) => dealForm.setData('start_date', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">End Date & Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={dealForm.data.end_date}
                        onChange={(e) => dealForm.setData('end_date', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="deal-submit-section">
                  <div className="selected-products-badge">
                    <i className="bi bi-check-circle"></i>
                    <span>{selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected</span>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="bi bi-plus-lg me-2"></i>
                    Create Deal
                  </button>
                </div>
              </form>
            </div>

            {/* Product Selection Grid */}
            <div className="products-selection-container">
              <div className="form-header">
                <h3><i className="bi bi-box-seam"></i> Select Products</h3>
                <div className="search-input">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={dealSearch}
                    onChange={(e) => setDealSearch(e.target.value)}
                  />
                  <i className="bi bi-search"></i>
                </div>
              </div>

              <div className="products-grid">
                {props.products && props.products.length > 0 ? (
                  props.products
                    .filter(product => 
                      product.name.toLowerCase().includes(dealSearch.toLowerCase())
                    )
                    .map((product) => (
                      <div key={product.id} className={`product-card ${selectedProducts.includes(product.id) ? 'selected' : ''}`}>
                        <div className="product-checkbox">
                          <input
                            type="checkbox"
                            id={`product-${product.id}`}
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleProductCheckbox(product.id)}
                          />
                          <label htmlFor={`product-${product.id}`}></label>
                        </div>
                        <div className="product-image">
                          {product.image ? (
                            <img src={`/storage/${product.image}`} alt={product.name} />
                          ) : (
                            <div className="placeholder-image">
                              <i className="bi bi-image"></i>
                            </div>
                          )}
                        </div>
                        <div className="product-info">
                          <h6 className="product-name">{product.name}</h6>
                          <p className="product-stock">
                            <i className="bi bi-box"></i>
                            Stock: {product.instock}
                          </p>
                          <div className="product-pricing">
                            <span className="price">RM {parseFloat(product.price).toFixed(2)}</span>
                            {product.discount_price && (
                              <span className="discount-badge">
                                {product.discount_price}{product.discount_type === 'percentage' ? '%' : ' RM'} OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="no-products-message">
                    <i className="bi bi-inbox"></i>
                    <p>No products available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Deals Display */}
            <div className="active-deals-container">
              <div className="form-header">
                <h3><i className="bi bi-star-fill"></i> Active & Upcoming Deals</h3>
              </div>

              <div className="deals-list">
                {deals && deals.length > 0 ? (
                  deals.map((deal) => {
                    const now = new Date();
                    const startDate = new Date(deal.start_date);
                    const endDate = new Date(deal.end_date);
                    
                    let dealStatus = 'upcoming';
                    let statusIcon = 'hourglass-top';
                    let statusText = 'Upcoming';
                    
                    if (now >= startDate && now <= endDate) {
                      dealStatus = 'active';
                      statusIcon = 'lightning-fill';
                      statusText = 'Active';
                    } else if (now > endDate) {
                      dealStatus = 'expired';
                      statusIcon = 'x-circle';
                      statusText = 'Expired';
                    }

                    return (
                      <div key={deal.id} className="deal-item">
                        <div className={`deal-status-badge ${dealStatus}`}>
                          <i className={`bi bi-${statusIcon}`}></i>
                          {statusText}
                        </div>
                        <div className="deal-content">
                          <h5>{deal.title}</h5>
                          <div className="deal-meta">
                            <span className="deal-products">
                              <i className="bi bi-box-seam"></i>
                              {deal.products_count} Product{deal.products_count !== 1 ? 's' : ''}
                            </span>
                            <span className="deal-date">
                              <i className="bi bi-calendar-event"></i>
                              {dealStatus === 'expired' ? 'Ended: ' : dealStatus === 'active' ? 'Ends: ' : 'Starts: '}
                              {dealStatus === 'active' ? new Date(deal.end_date).toLocaleDateString() : dealStatus === 'expired' ? new Date(deal.end_date).toLocaleDateString() : new Date(deal.start_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="deal-actions">
                          {dealStatus !== 'expired' && (
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </button>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteDeal(deal.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <i className="bi bi-inbox"></i>
                    <p>No deals created yet. Start by creating your first deal above!</p>
                  </div>
                )}
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
                    <span className="analytics-value">RM 10,000</span>
                  </div>
                  <div className="progress-wrapper">
                    <div className="progress">
                      <div className="progress-bar bg-primary" style={{ width: "70%" }}></div>
                    </div>
                    <span className="progress-label">RM 7,000 / RM 10,000 (70%)</span>
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
                    <h2 className="payout-amount">RM 1,230.00</h2>
                    <p className="payout-pending">RM 450.00 pending clearance</p>
                  </div>
                </div>
                <div className="payout-body">
                  <div className="payout-details">
                    <div className="detail-item">
                      <span className="detail-label">Last Payout</span>
                      <span className="detail-value">RM 850.00</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payout Date</span>
                      <span className="detail-value">Jan 15, 2026</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Earned</span>
                      <span className="detail-value">RM 12,430.00</span>
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
                    <div className="history-amount">+RM 850.00</div>
                  </div>
                  <div className="history-item">
                    <div className="history-icon success">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="history-content">
                      <p className="history-title">Payout Completed</p>
                      <p className="history-date">December 15, 2025</p>
                    </div>
                    <div className="history-amount">+RM 1,200.00</div>
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