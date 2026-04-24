import React, { useEffect, useState } from "react";
import "../css/seller.css";
import { useForm, usePage, Link, router} from "@inertiajs/react";
import FlashMessage from '../components/FlashMessage.jsx';
import LoadingScreen from "../components/LoadingScreen.jsx";
import { useCurrency } from '../contexts/CurrencyContext';
const Seller = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [orderFilterStatus, setOrderFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    image1: null,
    image2: null,
    image3: null
  });
  
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
  const { formatCurrencyFromMYR, selectedCountry } = useCurrency();

  const formatMoney = (amount, options = {}) => formatCurrencyFromMYR(amount, options);

  const formatByCurrencyCode = (amount, currencyCode = 'MYR') => {
    const numericAmount = Number(amount || 0);

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericAmount);
    } catch (error) {
      return `${currencyCode} ${numericAmount.toFixed(2)}`;
    }
  };

  // Helper function to calculate order totals
  const calculateOrderTotals = () => {
    const orderTotals = {};
    props.orders?.forEach(orderRow => {
      if (orderTotals[orderRow.oid] === undefined) {
        orderTotals[orderRow.oid] = 0;
      }

      const amount = parseFloat(orderRow.pprice || 0);
      const quantity = parseInt(orderRow.quantity || 0, 10);
      orderTotals[orderRow.oid] += amount * quantity;
    });

    return orderTotals;
  };

  const orderTotals = calculateOrderTotals();

  // Calculate dashboard statistics
  const calculateStats = () => {
    const totalRevenue = Object.values(orderTotals).reduce((sum, total) => sum + total, 0) || 0;
    
    // Get unique orders for status filtering
    const uniqueOrders = Array.from(new Map(props.orders?.map(order => [order.oid, order]) || []).values());
    const pendingOrders = uniqueOrders?.filter(order => order.status === 'Pending').length || 0;
    const deliveredOrders = uniqueOrders?.filter(order => order.status === 'Delivered').length || 0;
    const fulfillmentRate = uniqueOrders?.length > 0 ? ((deliveredOrders / uniqueOrders.length) * 100).toFixed(1) : 0;
    
    return {
      totalRevenue: totalRevenue.toFixed(2),
      pendingOrders,
      fulfillmentRate,
      deliveredOrders
    };
  };

  const stats = calculateStats();
  const totalRevenueValue = parseFloat(stats.totalRevenue) || 0;
  const analyticsTargetValue = 20000;
  const revenueProgressPercent = Math.min((totalRevenueValue / analyticsTargetValue) * 100, 100);

  // Get recent activity from orders and products
  const getRecentActivity = () => {
    const activities = [];
    
    // Get most recent orders (converted to a map to get unique ones)
    const recentOrdersMap = new Map(props.orders?.map(order => [order.oid, order]) || []);
    const recentOrders = Array.from(recentOrdersMap.values()).slice(0, 3);
    
    recentOrders.forEach(order => {
      if (order.status === 'Delivered') {
        activities.push({
          type: 'delivered',
          title: `Order #${order.oid} delivered`,
          time: new Date(order.created_at),
          icon: 'check-circle-fill'
        });
      } else if (order.status === 'Shipped') {
        activities.push({
          type: 'shipped',
          title: `Order #${order.oid} shipped`,
          time: new Date(order.created_at),
          icon: 'box-seam'
        });
      }
    });
    
    // Add low stock alerts
    const productsData = Array.isArray(props.products) ? props.products : props.products?.data || [];
    productsData.forEach(product => {
      if (product.instock > 0 && product.instock <= 5) {
        activities.push({
          type: 'low-stock',
          title: `Low stock alert: ${product.name}`,
          time: new Date(),
          icon: 'exclamation-triangle-fill'
        });
      }
    });
    
    return activities.sort((a, b) => b.time - a.time).slice(0, 3);
  };

  const recentActivities = getRecentActivity();

  // Function to format time difference
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

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
        // console.log('Fetched subcategories:', data);
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

  // Handle image preview
  const handleImageChange = (fieldName, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({
          ...prev,
          [fieldName]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviews(prev => ({
        ...prev,
        [fieldName]: null
      }));
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
  const productsArray = Array.isArray(props.products) ? props.products : props.products?.data || [];
  const allFilteredProducts = productsArray.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "instock" && item.instock > 0) ||
      (filterStatus === "outofstock" && item.instock === 0);
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(allFilteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredProducts = allFilteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);
  
  const filteredOrders = (props.orders ? 
    Array.from(new Map(props.orders.map(order => [order.oid, order])).values()) : [])
    .filter(order => {
      const cartStatus = props.orders.find(o => o.oid === order.oid)?.cart_status || 'ordered';
      const normalized = String(cartStatus).toLowerCase();
      return normalized !== 'cancelled' && normalized !== 'canceled';
    })
    .filter(order => {
        if (orderFilterStatus === "all") return true;
        const cartStatus = props.orders.find(o => o.oid === order.oid)?.cart_status || 'ordered';
        return cartStatus === orderFilterStatus;
    });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // States for deals management
  const [deals, setDeals] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dealSearch, setDealSearch] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [dealCurrentPage, setDealCurrentPage] = useState(1);
  const [dealItemsPerPage, setDealItemsPerPage] = useState(10);
  const [showEditDealModal, setShowEditDealModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [editSelectedProducts, setEditSelectedProducts] = useState([]);
  const [editDealSearch, setEditDealSearch] = useState("");
  const [editDealCurrentPage, setEditDealCurrentPage] = useState(1);
  const [editDealItemsPerPage, setEditDealItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: null, label: '' });

  // States for reviews management
  const [reviews, setReviews] = useState([]);
  const [reviewsGroupedByProduct, setReviewsGroupedByProduct] = useState({});
  const [replyStates, setReplyStates] = useState({});
  const [loadingReviews, setLoadingReviews] = useState(false);

  const replyForm = useForm({
    review_id: '',
    seller_reply: ''
  });

  const dealForm = useForm({
    deal_name: '',
    discount_type: 'percentage',
    discount_value: '',
    start_date: '',
    end_date: '',
    products: []
  });

  const editDealForm = useForm({
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

  const handleEditProductCheckbox = (productId) => {
    setEditSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toDatetimeLocalValue = (rawDate) => {
    if (!rawDate) return '';
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const openEditDealModal = (deal) => {
    const dealProducts = Array.isArray(deal.products) ? deal.products : [];
    const preselectedIds = dealProducts.map((p) => p.id);
    const firstProduct = dealProducts[0] || {};
    const hasPercentage = parseFloat(firstProduct.discount_percentage_deal || 0) > 0;
    const initialDiscountType = hasPercentage ? 'percentage' : 'fixed';
    const initialDiscountValue = hasPercentage
      ? (firstProduct.discount_percentage_deal || 0)
      : (firstProduct.discount_amount || 0);

    setEditingDeal(deal);
    setEditSelectedProducts(preselectedIds);
    setEditDealSearch('');
    setEditDealCurrentPage(1);

    editDealForm.setData({
      deal_name: deal.title || '',
      discount_type: initialDiscountType,
      discount_value: initialDiscountValue,
      start_date: toDatetimeLocalValue(deal.start_date),
      end_date: toDatetimeLocalValue(deal.end_date),
      products: preselectedIds,
    });

    setShowEditDealModal(true);
  };

  const closeEditDealModal = () => {
    setShowEditDealModal(false);
    setEditingDeal(null);
    setEditSelectedProducts([]);
    setEditDealSearch('');
    setEditDealCurrentPage(1);
    editDealForm.reset();
  };

  const openDeleteModal = (type, id, label = '') => {
    setDeleteTarget({ type, id, label });
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget({ type: '', id: null, label: '' });
  };

  const executeDeleteAction = () => {
    if (!deleteTarget.id || !deleteTarget.type) {
      closeDeleteModal();
      return;
    }

    if (deleteTarget.type === 'product') {
      router.get(`/seller/deleteProduct/${deleteTarget.id}`, {
        onSuccess: () => {
          closeDeleteModal();
          alert('Product deleted successfully!');
        },
        onError: () => {
          alert('Failed to delete product');
        }
      });
      return;
    }

    if (deleteTarget.type === 'deal') {
      router.delete(`/seller/deals/delete/${deleteTarget.id}`, {
        onSuccess: () => {
          fetchDeals();
          closeDeleteModal();
          alert('Deal deleted successfully!');
        },
        onError: (errors) => {
          console.error('Delete error:', errors);
          alert('Failed to delete deal');
        }
      });
      return;
    }

    if (deleteTarget.type === 'reply') {
      router.delete(`/seller/reviews/${deleteTarget.id}/reply`, {
        onSuccess: () => {
          fetchSellerReviews();
          closeDeleteModal();
          alert('Reply deleted successfully!');
        },
        onError: (errors) => {
          console.error('Error deleting reply:', errors);
          alert('Failed to delete reply');
        }
      });
    }
  };

  const handleEditDealSubmit = (e) => {
    e.preventDefault();

    if (!editingDeal?.id) {
      alert('Unable to update this deal. Please try again.');
      return;
    }

    if (editSelectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    const completeFormData = {
      deal_name: editDealForm.data.deal_name,
      discount_type: editDealForm.data.discount_type,
      discount_value: editDealForm.data.discount_value,
      start_date: editDealForm.data.start_date,
      end_date: editDealForm.data.end_date,
      products: editSelectedProducts,
    };

    router.post(`/seller/deals/update/${editingDeal.id}`, completeFormData, {
      onSuccess: () => {
        fetchDeals();
        closeEditDealModal();
        alert('Deal updated successfully!');
      },
      onError: (errors) => {
        console.error('Deal update errors:', errors);
        alert('Failed to update deal. Please check the form.');
      }
    });
  };

  // Fetch deals on component mount
  useEffect(() => {
    fetchDeals();
  }, []);

  // Fetch seller reviews
  const fetchSellerReviews = () => {
    setLoadingReviews(true);
    fetch('/seller/reviews')
      .then(response => response.json())
      .then(data => {
        if (data.reviews) {
          setReviews(data.reviews);
          setReviewsGroupedByProduct(data.grouped_reviews || {});
        }
        setLoadingReviews(false);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setLoadingReviews(false);
      });
  };

  // Fetch reviews when activeTab changes to reviews
  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchSellerReviews();
    }
  }, [activeTab]);

  // Toggle reply form visibility
  const toggleReplyForm = (reviewId) => {
    setReplyStates(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Handle review reply submission
  const handleReplySubmit = (reviewId) => {
    if (!replyForm.data.seller_reply.trim()) {
      alert('Please enter a reply');
      return;
    }

    router.post(`/seller/reviews/${reviewId}/reply`, {
      seller_reply: replyForm.data.seller_reply
    }, {
      onSuccess: () => {
        replyForm.reset();
        toggleReplyForm(reviewId);
        fetchSellerReviews();
        alert('Reply added successfully!');
      },
      onError: (errors) => {
        console.error('Error submitting reply:', errors);
        alert('Failed to submit reply');
      }
    });
  };

  // Handle delete reply
  const deleteReply = (reviewId) => {
    openDeleteModal('reply', reviewId, 'this reply');
  };

  // Delete a deal
  const deleteDeal = (dealId) => {
    openDeleteModal('deal', dealId, 'this deal');
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
              <span className="badge badge-warning">{stats.pendingOrders}</span>
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
            <li 
              className={`nav-item ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => { setActiveTab("reviews"); setSidebarOpen(false); }}
            >
              <i className="bi bi-star-fill"></i>
              <span>Reviews</span>
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
                {activeTab === "reviews" && "Product Reviews"}
              </h2>
              <p className="header-subtitle">Manage your store and sales efficiently</p>
            </div>
          </div>
          <div className="header-right">
            <button className="btn-notification">
              <i className="bi bi-bell-fill"></i>
              <span className="notification-badge">{stats.pendingOrders + recentActivities.length}</span>
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
                    <h3 className="stat-value">{stats.pendingOrders}</h3>
                    <div className="stat-trend neutral">
                      <i className="bi bi-dash"></i> {stats.pendingOrders > 0 ? 'Action needed' : 'All clear'}
                    </div>
                  </div>
                </div>

                <div className="stat-card stat-info">
                  <div className="stat-icon">
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Total Revenue</p>
                    <h3 className="stat-value">{formatMoney(stats.totalRevenue)}</h3>
                    <div className="stat-trend positive">
                      <i className="bi bi-arrow-up"></i> {props.orders?.length > 0 ? ((stats.deliveredOrders / props.orders.length) * 100).toFixed(0) : 0}%
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
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className={`activity-icon ${activity.type === 'low-stock' ? 'warning' : activity.type === 'delivered' ? 'success' : 'info'}`}>
                          <i className={`bi bi-${activity.icon}`}></i>
                        </div>
                        <div className="activity-content">
                          <p className="activity-title">{activity.title}</p>
                          <p className="activity-time">{formatTimeAgo(activity.time)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="activity-item">
                      <div className="activity-icon info">
                        <i className="bi bi-info-circle"></i>
                      </div>
                      <div className="activity-content">
                        <p className="activity-title">No recent activity</p>
                        <p className="activity-time">Your orders and products will appear here</p>
                      </div>
                    </div>
                  )}
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
                      <th>Admin Status</th>
                      <th>Stock Status</th>
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
                              src={`/storage/${item.image}`} 
                              alt={item.name}
                              className="product-thumbnail"
                            />
                          </td>
                          <td>
                            <span className="product-price">{formatMoney(item.price)}</span>
                          </td>
                          <td>
                            <div className="discount-display">
                              {item.discount_price ? (
                                <>
                                  <span className="discount-value">
                                    {item.discount_type === 'percentage' ? `${item.discount_price}%` : formatMoney(item.discount_price)}
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
                            <span className={`status-badge admin-status ${
                              item.status === 'Approved' ? 'success' : 
                              item.status === 'Pending' ? 'warning' : 
                              item.status === 'Rejected' ? 'danger' : 'secondary'
                            }`}>
                              <i className={`bi bi-${
                                item.status === 'Approved' ? 'check-circle-fill' : 
                                item.status === 'Pending' ? 'clock-history' : 
                                item.status === 'Rejected' ? 'x-circle-fill' : 'question-circle-fill'
                              }`}></i>
                              {item.status || 'Pending'}
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
                              <button 
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => openDeleteModal('product', item.id, item.name)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
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

              {/* Pagination Controls */}
              {allFilteredProducts.length > 0 && (
                <div className="pagination-section">
                  <div className="pagination-info">
                    <p>
                      Showing {startIndex + 1} to {Math.min(endIndex, allFilteredProducts.length)} of {allFilteredProducts.length} products
                    </p>
                    <div className="items-per-page">
                      <label>Items per page:</label>
                      <select 
                        value={itemsPerPage} 
                        onChange={(e) => {
                          setItemsPerPage(parseInt(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="form-select"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>

                  <div className="pagination-controls">
                    <button 
                      className="btn btn-pagination"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <i className="bi bi-chevron-left"></i> Previous
                    </button>

                    <div className="pagination-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`page-number ${currentPage === page ? 'active' : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button 
                      className="btn btn-pagination"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
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
                          onChange={(e) => {
                            const file = e.target.files[0];
                            product.setData('image', file);
                            handleImageChange('image', file);
                          }}
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
                                  const file = e.target.files[0];
                                  product.setData(img.key, file);
                                  handleImageChange(img.key, file);
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

                    {/* Image Preview Section */}
                    {(imagePreviews.image || imagePreviews.image1 || imagePreviews.image2 || imagePreviews.image3) && (
                      <div className="col-12">
                        <label className="form-label">Image Preview</label>
                        <div className="image-preview-gallery">
                          {imagePreviews.image && (
                            <div className="preview-item main-preview">
                              <img src={imagePreviews.image} alt="Main Product" />
                              <span className="preview-label">Main Image</span>
                            </div>
                          )}
                          {imagePreviews.image1 && (
                            <div className="preview-item">
                              <img src={imagePreviews.image1} alt="Additional Image 1" />
                              <span className="preview-label">Image 1</span>
                            </div>
                          )}
                          {imagePreviews.image2 && (
                            <div className="preview-item">
                              <img src={imagePreviews.image2} alt="Additional Image 2" />
                              <span className="preview-label">Image 2</span>
                            </div>
                          )}
                          {imagePreviews.image3 && (
                            <div className="preview-item">
                              <img src={imagePreviews.image3} alt="Additional Image 3" />
                              <span className="preview-label">Image 3</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

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
                const cartStatus = productsInOrder[0]?.cart_status || 'ordered';
                return (
                  <div key={groupedOrder.oid || index} className="order-card">
                    <div className="order-header">
                      <strong className="order-id">Order #{groupedOrder.oid}</strong>
                      <span className={`status-badge ${cartStatus.toLowerCase()}`}>
                        {cartStatus}
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
                          <i className="bi bi-currency-dollar"></i> {formatMoney(orderTotals[groupedOrder.oid] || 0)}
                        </p>
                        <p className="order-meta">
                          <i className="bi bi-geo-alt"></i> {groupedOrder.order_country_name || groupedOrder.shipping_country || 'Unknown'}
                        </p>
                        <p className="order-meta">
                          <i className="bi bi-globe2"></i> Placed as {groupedOrder.order_currency_code || 'MYR'}
                        </p>
                        <p className="order-meta">
                          <i className="bi bi-credit-card"></i> 
                          <span className="text-capitalize">{groupedOrder.payment_method}</span>
                        </p>
                      </div>
                      
                      <div className="order-total">
                        <strong>Total: {formatMoney(orderTotals[groupedOrder.oid] || 0)}</strong>
                        
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
                    <span className="info-label">Customer Name:</span>
                    <span className="info-value">{selectedOrder.customer_name || 'N/A'}</span>
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
                      {formatMoney(orderTotals[selectedOrder.oid] || 0)}
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Placed From Country:</span>
                    <span className="info-value">{selectedOrder.order_country_name || selectedOrder.shipping_country || 'Unknown'}</span>
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
                        src={`/storage/${product.product_image}`} 
                        alt={product.product_name}
                        className="product-detail-image"
                      />
                      <div className="product-detail-info">
                        <h6>{product.product_name}</h6>
                        <p className="product-price">
                          {formatMoney(product.pprice)} × {product.quantity}
                        </p>
                        <p className="product-price text-muted mb-0">
                          {formatByCurrencyCode(product.pprice_local ?? product.pprice, product.item_currency || selectedOrder.order_currency_code || 'MYR')} × {product.quantity}
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
                    <p>{selectedOrder.city}</p>
                    <p>{selectedOrder.shipping_country || selectedOrder.order_country_name}</p>
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
                    <span className="label">Current Product Status:</span>
                    <span className={`status-badge ${(props.orders.find(o => o.oid === selectedOrder.oid)?.cart_status || 'ordered').toLowerCase()}`}>
                      {props.orders.find(o => o.oid === selectedOrder.oid)?.cart_status || 'ordered'}
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

      {/* DELETE WARNING MODAL */}
      {showDeleteModal && (
        <>
          <div className="modal-overlay" onClick={closeDeleteModal}></div>
          <div className="status-modal" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h4>
                <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
                Confirm Deletion
              </h4>
              <button className="btn-close-modal" onClick={closeDeleteModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="alert alert-warning mb-3" role="alert">
                You are about to permanently delete {deleteTarget.label || 'this item'}. Its related things may also be deleted
              </div>
              <p className="text-muted mb-4">This action cannot be undone.</p>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline-secondary" onClick={closeDeleteModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={executeDeleteAction}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* EDIT DEAL MODAL */}
      {showEditDealModal && editingDeal && (
        <>
          <div className="modal-overlay" onClick={closeEditDealModal}></div>
          <div className="status-modal" style={{ maxWidth: '1000px' }}>
            <div className="modal-header">
              <h4>
                <i className="bi bi-pencil-square me-2"></i>
                Edit Deal: {editingDeal.title}
              </h4>
              <button className="btn-close-modal" onClick={closeEditDealModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleEditDealSubmit}>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Deal Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editDealForm.data.deal_name}
                      onChange={(e) => editDealForm.setData('deal_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Discount Type</label>
                    <select
                      className="form-select"
                      value={editDealForm.data.discount_type}
                      onChange={(e) => editDealForm.setData('discount_type', e.target.value)}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ({selectedCountry.currency})</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Discount Value</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editDealForm.data.discount_value}
                      onChange={(e) => editDealForm.setData('discount_value', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={editDealForm.data.start_date}
                      onChange={(e) => editDealForm.setData('start_date', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={editDealForm.data.end_date}
                      onChange={(e) => editDealForm.setData('end_date', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="mb-2">Products In This Deal</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {editingDeal.products && editingDeal.products.length > 0 ? (
                      editingDeal.products.map((p) => (
                        <span key={p.id} className="badge bg-primary-subtle text-primary border">{p.name}</span>
                      ))
                    ) : (
                      <span className="text-muted">No products currently linked.</span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="mb-2">Select Products (Paginated)</h6>
                  <div className="search-bar mb-3">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search products..."
                      value={editDealSearch}
                      onChange={(e) => {
                        setEditDealSearch(e.target.value);
                        setEditDealCurrentPage(1);
                      }}
                    />
                  </div>

                  {(() => {
                    const allDealProducts = Array.isArray(productsArray) ? productsArray : [];
                    const filteredEditProducts = allDealProducts.filter((product) =>
                      product.name.toLowerCase().includes(editDealSearch.toLowerCase())
                    );
                    const totalEditPages = Math.ceil(filteredEditProducts.length / editDealItemsPerPage) || 1;
                    const editStartIndex = (editDealCurrentPage - 1) * editDealItemsPerPage;
                    const editEndIndex = editStartIndex + editDealItemsPerPage;
                    const paginatedEditProducts = filteredEditProducts.slice(editStartIndex, editEndIndex);

                    return (
                      <>
                        <div className="products-table-container">
                          <table className="products-table">
                            <thead>
                              <tr>
                                <th style={{ width: '50px' }}>Select</th>
                                <th style={{ width: '100px' }}>Image</th>
                                <th>Product Name</th>
                                <th style={{ width: '120px' }}>Price</th>
                                <th style={{ width: '100px' }}>Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedEditProducts.length > 0 ? (
                                paginatedEditProducts.map((product) => (
                                  <tr key={`edit-deal-product-${product.id}`} className={editSelectedProducts.includes(product.id) ? 'table-active' : ''}>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={editSelectedProducts.includes(product.id)}
                                        onChange={() => handleEditProductCheckbox(product.id)}
                                        className="form-check-input"
                                      />
                                    </td>
                                    <td>
                                      {product.image ? (
                                        <img
                                          src={`/storage/${product.image}`}
                                          alt={product.name}
                                          className="product-thumbnail"
                                        />
                                      ) : (
                                        <div className="placeholder-image">
                                          <i className="bi bi-image"></i>
                                        </div>
                                      )}
                                    </td>
                                    <td><strong>{product.name}</strong></td>
                                    <td><span className="product-price">{formatMoney(product.price)}</span></td>
                                    <td>
                                      <span className={`stock-quantity ${product.instock > 10 ? 'high' : product.instock > 0 ? 'low' : 'out'}`}>
                                        {product.instock}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-center">No products found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="pagination-section">
                          <div className="pagination-info">
                            <p>
                              Showing {filteredEditProducts.length > 0 ? editStartIndex + 1 : 0} to {Math.min(editEndIndex, filteredEditProducts.length)} of {filteredEditProducts.length} products
                            </p>
                            <div className="items-per-page">
                              <label>Items per page:</label>
                              <select
                                value={editDealItemsPerPage}
                                onChange={(e) => {
                                  setEditDealItemsPerPage(parseInt(e.target.value));
                                  setEditDealCurrentPage(1);
                                }}
                                className="form-select"
                              >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                              </select>
                            </div>
                          </div>

                          <div className="pagination-controls">
                            <button
                              type="button"
                              className="btn btn-pagination"
                              onClick={() => setEditDealCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={editDealCurrentPage === 1}
                            >
                              <i className="bi bi-chevron-left"></i> Previous
                            </button>

                            <div className="pagination-numbers">
                              {Array.from({ length: totalEditPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  type="button"
                                  key={`edit-deal-page-${page}`}
                                  className={`page-number ${editDealCurrentPage === page ? 'active' : ''}`}
                                  onClick={() => setEditDealCurrentPage(page)}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>

                            <button
                              type="button"
                              className="btn btn-pagination"
                              onClick={() => setEditDealCurrentPage((prev) => Math.min(prev + 1, totalEditPages))}
                              disabled={editDealCurrentPage === totalEditPages}
                            >
                              Next <i className="bi bi-chevron-right"></i>
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeEditDealModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={editDealForm.processing}>
                    {editDealForm.processing ? 'Updating...' : 'Update Deal'}
                  </button>
                </div>
              </form>
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
                        <option value="fixed">Fixed Amount ({selectedCountry.currency})</option>
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
                          {dealForm.data.discount_type === 'percentage' ? '%' : selectedCountry.currency}
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

            {/* Product Selection List with Pagination */}
            <div className="products-selection-container">
              <div className="form-header">
                <h3><i className="bi bi-box-seam"></i> Select Products</h3>
                <div className="search-bar">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={dealSearch}
                    onChange={(e) => {
                      setDealSearch(e.target.value);
                      setDealCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              {(() => {
                // Handle both direct array and nested .data structure
                const allDealProducts = Array.isArray(productsArray) ? productsArray : [];
                const filteredDealProducts = allDealProducts.filter(product => 
                  product.name.toLowerCase().includes(dealSearch.toLowerCase())
                );

                // Pagination calculations
                const totalDealPages = Math.ceil(filteredDealProducts.length / dealItemsPerPage);
                const dealStartIndex = (dealCurrentPage - 1) * dealItemsPerPage;
                const dealEndIndex = dealStartIndex + dealItemsPerPage;
                const paginatedDealProducts = filteredDealProducts.slice(dealStartIndex, dealEndIndex);

                return (
                  <>
                    {filteredDealProducts.length > 0 ? (
                      <>
                        <div className="products-table-container">
                          <table className="products-table">
                            <thead>
                              <tr>
                                <th style={{ width: '50px' }}>Select</th>
                                <th style={{ width: '100px' }}>Image</th>
                                <th>Product Name</th>
                                <th style={{ width: '100px' }}>Stock</th>
                                <th style={{ width: '120px' }}>Price</th>
                                <th style={{ width: '120px' }}>Discount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedDealProducts.map((product) => (
                                <tr 
                                  key={product.id} 
                                  className={selectedProducts.includes(product.id) ? 'table-active' : ''}
                                >
                                  <td>
                                    <input
                                      type="checkbox"
                                      id={`deal-product-${product.id}`}
                                      checked={selectedProducts.includes(product.id)}
                                      onChange={() => handleProductCheckbox(product.id)}
                                      className="form-check-input"
                                    />
                                  </td>
                                  <td>
                                    {product.image ? (
                                      <img 
                                        src={`/storage/${product.image}`}
                                        alt={product.name}
                                        className="product-thumbnail"
                                      />
                                    ) : (
                                      <div className="placeholder-image">
                                        <i className="bi bi-image"></i>
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <strong>{product.name}</strong>
                                  </td>
                                  <td>
                                    <span className={`stock-quantity ${product.instock > 10 ? 'high' : product.instock > 0 ? 'low' : 'out'}`}>
                                      {product.instock}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="product-price">{formatMoney(product.price)}</span>
                                  </td>
                                  <td>
                                    {product.discount_price ? (
                                      <span className="discount-badge">
                                        {product.discount_type === 'percentage' ? `${product.discount_price}%` : `${formatMoney(product.discount_price)} OFF`}
                                      </span>
                                    ) : (
                                      <span className="no-discount">No discount</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Controls */}
                        {filteredDealProducts.length > 0 && (
                          <div className="pagination-section">
                            <div className="pagination-info">
                              <p>
                                Showing {dealStartIndex + 1} to {Math.min(dealEndIndex, filteredDealProducts.length)} of {filteredDealProducts.length} products
                              </p>
                              <div className="items-per-page">
                                <label>Items per page:</label>
                                <select 
                                  value={dealItemsPerPage} 
                                  onChange={(e) => {
                                    setDealItemsPerPage(parseInt(e.target.value));
                                    setDealCurrentPage(1);
                                  }}
                                  className="form-select"
                                >
                                  <option value={5}>5</option>
                                  <option value={10}>10</option>
                                  <option value={15}>15</option>
                                  <option value={20}>20</option>
                                </select>
                              </div>
                            </div>

                            <div className="pagination-controls">
                              <button 
                                className="btn btn-pagination"
                                onClick={() => setDealCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={dealCurrentPage === 1}
                              >
                                <i className="bi bi-chevron-left"></i> Previous
                              </button>

                              <div className="pagination-numbers">
                                {Array.from({ length: totalDealPages }, (_, i) => i + 1).map(page => (
                                  <button
                                    key={page}
                                    className={`page-number ${dealCurrentPage === page ? 'active' : ''}`}
                                    onClick={() => setDealCurrentPage(page)}
                                  >
                                    {page}
                                  </button>
                                ))}
                              </div>

                              <button 
                                className="btn btn-pagination"
                                onClick={() => setDealCurrentPage(prev => Math.min(prev + 1, totalDealPages))}
                                disabled={dealCurrentPage === totalDealPages}
                              >
                                Next <i className="bi bi-chevron-right"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="empty-state">
                        <i className="bi bi-inbox"></i>
                        <p>{dealSearch ? 'No products matching your search' : 'No products available'}</p>
                      </div>
                    )}
                  </>
                );
              })()}
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
                            <button className="btn btn-sm btn-outline-primary" onClick={() => openEditDealModal(deal)}>
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
                    <h6>Total Revenue</h6>
                    <span className="analytics-value">{formatMoney(stats.totalRevenue)}</span>
                  </div>
                  <div className="progress-wrapper">
                    <div className="progress">
                      <div className="progress-bar bg-primary" style={{ width: `${revenueProgressPercent}%` }}></div>
                    </div>
                    <span className="progress-label">{formatMoney(stats.totalRevenue)} / {formatMoney(analyticsTargetValue)} target ({revenueProgressPercent.toFixed(1)}%)</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h6>Order Fulfillment Rate</h6>
                    <span className="analytics-value">{stats.fulfillmentRate}%</span>
                  </div>
                  <div className="progress-wrapper">
                    <div className="progress">
                      <div className="progress-bar bg-success" style={{ width: `${stats.fulfillmentRate}%` }}></div>
                    </div>
                    <span className="progress-label">{stats.deliveredOrders} / {props.orders?.length || 0} orders fulfilled</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h6>Active Products</h6>
                    <span className="analytics-value">{props.pcount || 0}</span>
                  </div>
                  <div className="rating-stars">
                    <p style={{ margin: 0 }}>
                      {(() => {
                        const allProducts = Array.isArray(props.products) ? props.products : props.products?.data || [];
                        return `${allProducts.filter(p => p.instock > 0).length || 0} in stock, ${allProducts.filter(p => p.instock === 0).length || 0} out of stock`;
                      })()}
                    </p>
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
                    <p className="payout-label">Total Earnings</p>
                    <h2 className="payout-amount">{formatMoney(stats.totalRevenue)}</h2>
                    <p className="payout-pending">From {props.orders?.length || 0} orders</p>
                  </div>
                </div>
                <div className="payout-body">
                  <div className="payout-details">
                    <div className="detail-item">
                      <span className="detail-label">Delivered Orders</span>
                      <span className="detail-value">{stats.deliveredOrders}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Avg Order Value</span>
                      <span className="detail-value">{formatMoney(props.orders?.length > 0 ? (totalRevenueValue / props.orders.length) : 0)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Pending Orders</span>
                      <span className="detail-value">{stats.pendingOrders}</span>
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

              {/* Recent Orders Summary */}
              <div className="payout-history">
                <h5 className="section-title">Orders Summary</h5>
                <div className="history-list">
                  {props.orders && props.orders.length > 0 ? (
                    (() => {
                      // Group orders by ID and get unique ones
                      const uniqueOrders = Array.from(new Map(props.orders.map(o => [o.oid, o])).values()).slice(0, 5);
                      return uniqueOrders.map((order, idx) => (
                        <div key={idx} className="history-item">
                          <div className={`history-icon ${order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'warning'}`}>
                            <i className={`bi bi-${order.status === 'Delivered' ? 'check-circle-fill' : order.status === 'Cancelled' ? 'x-circle-fill' : 'clock-history'}`}></i>
                          </div>
                          <div className="history-content">
                            <p className="history-title">Order #{order.oid} - {order.status}</p>
                            <p className="history-date">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </div>
                          <div className="history-amount">+{formatMoney(order.total_amount)}</div>
                        </div>
                      ));
                    })()
                  ) : (
                    <div className="history-item">
                      <div className="history-icon info">
                        <i className="bi bi-info-circle"></i>
                      </div>
                      <div className="history-content">
                        <p className="history-title">No Orders Yet</p>
                        <p className="history-date">Your orders will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === "reviews" && (
            <div className="tab-content-wrapper">
              {loadingReviews ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading reviews...</p>
                </div>
              ) : reviews.length > 0 ? (
                <>
                  <div className="reviews-summary">
                    <div className="summary-card">
                      <div className="summary-icon">
                        <i className="bi bi-star-fill"></i>
                      </div>
                      <div className="summary-content">
                        <p className="summary-label">Total Reviews</p>
                        <h3 className="summary-value">{reviews.length}</h3>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon">
                        <i className="bi bi-chat-dots"></i>
                      </div>
                      <div className="summary-content">
                        <p className="summary-label">Replied</p>
                        <h3 className="summary-value">{reviews.filter(r => r.seller_reply).length}</h3>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon">
                        <i className="bi bi-exclamation-circle"></i>
                      </div>
                      <div className="summary-content">
                        <p className="summary-label">Pending Reply</p>
                        <h3 className="summary-value">{reviews.filter(r => !r.seller_reply).length}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="reviews-container">
                    {Object.entries(reviewsGroupedByProduct).map(([productId, productReviews]) => {
                      const product = productReviews[0]?.product;
                      return (
                        <div key={productId} className="product-reviews-section">
                          <div className="product-header">
                            <div className="product-info">
                              {product?.image && (
                                <img 
                                  src={`/storage/${product.image}`} 
                                  alt={product?.name}
                                  className="product-thumbnail-review"
                                />
                              )}
                              <div>
                                <h5 className="product-name">{product?.name}</h5>
                                <p className="product-sku">ID: {productId}</p>
                              </div>
                            </div>
                            <div className="reviews-count">
                              <span className="badge bg-primary">{productReviews.length} review{productReviews.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          <div className="reviews-list">
                            {productReviews.map((review) => (
                              <div key={review.id} className="review-item">
                                <div className="review-header">
                                  <div className="reviewer-info">
                                    <div className="reviewer-avatar">
                                      {review.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="reviewer-details">
                                      <p className="reviewer-name">{review.user?.name}</p>
                                      <p className="review-date">
                                        {new Date(review.created_at).toLocaleDateString('en-US', { 
                                          year: 'numeric', 
                                          month: 'short', 
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="review-rating">
                                    <div className="stars">
                                      {[...Array(5)].map((_, i) => (
                                        <i 
                                          key={i} 
                                          className={`bi bi-star${i < review.rating ? '-fill' : ''}`}
                                        ></i>
                                      ))}
                                    </div>
                                    <span className="rating-text">{review.rating}.0 / 5.0</span>
                                  </div>
                                </div>

                                <div className="review-content">
                                  <p className="review-comment">{review.comment}</p>
                                </div>

                                {review.seller_reply ? (
                                  <div className="seller-reply-section">
                                    <div className="reply-header">
                                      <div className="seller-badge">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>Store Response</span>
                                      </div>
                                      <p className="reply-date">
                                        {new Date(review.seller_replied_at).toLocaleDateString('en-US', { 
                                          year: 'numeric', 
                                          month: 'short', 
                                          day: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                    <div className="reply-content">
                                      <p>{review.seller_reply}</p>
                                    </div>
                                    <div className="reply-actions">
                                      <button 
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => toggleReplyForm(review.id)}
                                      >
                                        <i className="bi bi-pencil"></i> Edit
                                      </button>
                                      <button 
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => deleteReply(review.id)}
                                      >
                                        <i className="bi bi-trash"></i> Delete
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="no-reply-section">
                                    <p className="no-reply-text">You haven't replied to this review yet</p>
                                    <button 
                                      className="btn btn-sm btn-primary"
                                      onClick={() => toggleReplyForm(review.id)}
                                    >
                                      <i className="bi bi-reply-fill"></i> Reply
                                    </button>
                                  </div>
                                )}

                                {replyStates[review.id] && (
                                  <div className="reply-form-section">
                                    <textarea
                                      className="form-control"
                                      placeholder="Write your response here (Max 1000 characters)..."
                                      maxLength="1000"
                                      rows="4"
                                      value={replyForm.data.seller_reply}
                                      onChange={(e) => replyForm.setData('seller_reply', e.target.value)}
                                    ></textarea>
                                    <div className="form-actions">
                                      <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleReplySubmit(review.id)}
                                      >
                                        <i className="bi bi-send"></i> Send Reply
                                      </button>
                                      <button 
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => {
                                          replyForm.reset();
                                          toggleReplyForm(review.id);
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <i className="bi bi-chat-dots"></i>
                  <p>No reviews yet. Start getting customer feedback!</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Seller;