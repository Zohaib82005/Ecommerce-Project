import React, { useEffect, useState } from "react";
import { useForm, usePage, Link, router } from "@inertiajs/react";
import FlashMessage from "../components/FlashMessage";
import LoadingScreen from "../Components/LoadingScreen";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const props = usePage().props;

  const [categoryLevel, setCategoryLevel] = useState("main");
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [adminImagePreviews, setAdminImagePreviews] = useState({
    image: null, image1: null, image2: null, image3: null,
  });
  const [homeBannerPreview, setHomeBannerPreview] = useState(null);
  const [websiteLogoPreview, setWebsiteLogoPreview] = useState(null);

  const adminProductForm = useForm({
    name: '', price: '', discount_price: '', discount_type: 'percentage',
    instock: '', desc: '', image: null, image1: null, image2: null, image3: null,
    category_id: '', subcategory_id: '', sub_subcategory_id: '',
  });

  const calculateStats = () => {
    const pendingUsers = props.users?.filter(u => u.status === 'Pending').length || 0;
    const pendingProducts = props.products?.filter(p => p.status === 'Pending').length || 0;
    const approvedProducts = props.products?.filter(p => String(p.status || '').toLowerCase() === 'approved').length || 0;
    const totalProducts = props.products?.length || 0;
    const pendingOrders = props.orders?.filter(o => String(o.product_order_status || o.order_status || o.status || '').toLowerCase() === 'pending').length || 0;
    const totalOrders = props.orders?.length || 0;
    const canceledOrders = props.orders?.filter(o => {
      const normalized = String(o.product_order_status || o.order_status || o.status || '').toLowerCase();
      return normalized === 'cancelled' || normalized === 'canceled';
    }).length || 0;
    const reportedOrders = props.reported_orders?.length || 0;
    const flaggedSellers = props.sellers?.filter(s => s.status === 'Flagged').length || 0;
    return {
      pendingUsers, pendingProducts, approvedProducts, pendingOrders, totalOrders,
      canceledOrders, reportedOrders, flaggedSellers,
      userNotifications: pendingUsers + pendingProducts + pendingOrders + reportedOrders + flaggedSellers,
      totalUsers: props.users?.length || 0,
      totalProducts,
    };
  };

  const stats = calculateStats();

  const category = useForm({ category: '', parent_id: null, level: 'main', image: null });
  const subCategory = useForm({ name: '', category_id: '', image: null });
  const subSubCategory = useForm({ name: '', subcategory_id: '', image: null });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrderRows, setSelectedOrderRows] = useState([]);

  const editForm = useForm({ id: '', name: '', email: '', role: '', password: '', password_confirmation: '' });
  const editCategoryForm = useForm({ id: '', name: '', level: 'main' });
  const deleteCategoryForm = useForm({ id: '', level: 'main' });
  const websiteSettingsForm = useForm({
    admin_login_slug: props.websiteSettings?.admin_login_slug || 'admin',
    website_name: props.websiteSettings?.website_name || 'BrightMaxTrading',
    website_logo: null,
  });
  const adminOrderStatusForm = useForm({ order_id: '', product_id: [], status: '' });
  const homeBannerForm = useForm({
    badge: '', title: '', subtitle: '', description: '',
    button_text: 'Shop Now', button_link: '#', sort_order: 0, is_active: true, image: null,
  });
  const promotionBannerForm = useForm({
    title: '', subtitle: '', button_link: '#', sort_order: 0, is_active: true, image: null,
  });
  const [promotionBannerPreview, setPromotionBannerPreview] = useState(null);

  function openEditModal(user) {
    editForm.setData({ id: user.id, name: user.name || '', email: user.email || '', role: user.role || 'User', password: '', password_confirmation: '' });
    setEditModalOpen(true);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    editForm.post('/admin/user/update', {
      onSuccess: () => { setEditModalOpen(false); editForm.setData('password', ''); editForm.setData('password_confirmation', ''); }
    });
  }

  function deleteUser(userId, userName) {
    if (confirm(`Delete user "${userName}"? This cannot be undone.`)) {
      router.delete(`/admin/user/delete/${userId}`, {
        onSuccess: () => alert('User deleted successfully'),
        onError: () => alert('Failed to delete user')
      });
    }
  }

  function openEditCategoryModal(item, level) {
    editCategoryForm.setData({ id: item.id, name: level === 'main' ? (item.category || '') : (item.name || ''), level });
    setEditCategoryModalOpen(true);
  }

  function handleCategoryEditSubmit(e) {
    e.preventDefault();
    editCategoryForm.post('/admin/category/update', { onSuccess: () => setEditCategoryModalOpen(false) });
  }

  function openDeleteCategoryModal(item, level) {
    deleteCategoryForm.setData({ id: item.id, level });
    setDeleteCategoryModalOpen(true);
  }

  function handleCategoryDeleteSubmit(e) {
    e.preventDefault();
    deleteCategoryForm.post('/admin/category/delete', { onSuccess: () => setDeleteCategoryModalOpen(false) });
  }

  function handleWebsiteSettingsSubmit(e) {
    e.preventDefault();
    websiteSettingsForm.post('/admin/website-settings/update', {
      forceFormData: true,
      onSuccess: () => { setWebsiteLogoPreview(null); websiteSettingsForm.setData('website_logo', null); },
    });
  }

  function handleHomeBannerSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('badge', homeBannerForm.data.badge || '');
    formData.append('title', homeBannerForm.data.title || '');
    formData.append('subtitle', homeBannerForm.data.subtitle || '');
    formData.append('description', homeBannerForm.data.description || '');
    formData.append('button_text', homeBannerForm.data.button_text || 'Shop Now');
    formData.append('button_link', homeBannerForm.data.button_link || '#');
    formData.append('sort_order', String(homeBannerForm.data.sort_order || 0));
    formData.append('is_active', homeBannerForm.data.is_active ? '1' : '0');
    if (homeBannerForm.data.image instanceof File) formData.append('image', homeBannerForm.data.image);
    router.post('/admin/banners', formData, {
      forceFormData: true,
      onSuccess: () => {
        homeBannerForm.reset();
        homeBannerForm.setData('button_text', 'Shop Now');
        homeBannerForm.setData('button_link', '#');
        homeBannerForm.setData('sort_order', 0);
        homeBannerForm.setData('is_active', true);
        setHomeBannerPreview(null);
      },
    });
  }

  function deleteHomeBanner(id) {
    if (!confirm('Delete this banner?')) return;
    router.delete(`/admin/banners/${id}`);
  }

  function handlePromotionBannerSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', promotionBannerForm.data.title || '');
    formData.append('subtitle', promotionBannerForm.data.subtitle || '');
    formData.append('button_link', promotionBannerForm.data.button_link || '#');
    formData.append('sort_order', String(promotionBannerForm.data.sort_order || 0));
    formData.append('is_active', promotionBannerForm.data.is_active ? '1' : '0');
    if (promotionBannerForm.data.image instanceof File) formData.append('image', promotionBannerForm.data.image);
    router.post('/admin/promotions', formData, {
      forceFormData: true,
      onSuccess: () => {
        promotionBannerForm.reset();
        promotionBannerForm.setData('button_link', '#');
        promotionBannerForm.setData('sort_order', 0);
        promotionBannerForm.setData('is_active', true);
        setPromotionBannerPreview(null);
      },
    });
  }

  function deletePromotionBanner(id) {
    if (!confirm('Delete this promotion banner?')) return;
    router.delete(`/admin/promotions/${id}`);
  }

  function openOrderDetails(orderId) {
    const matchedRows = orders.filter((item) => String(item.order_id || item.id) === String(orderId));
    if (matchedRows.length === 0) return;
    setSelectedOrderRows(matchedRows);
    adminOrderStatusForm.setData({
      order_id: orderId,
      product_id: matchedRows.map((item) => item.product_id).filter(Boolean),
      status: matchedRows[0]?.product_order_status || 'Pending',
    });
    setShowOrderDetailModal(true);
  }

  function closeOrderDetails() {
    setShowOrderDetailModal(false);
    setSelectedOrderRows([]);
    adminOrderStatusForm.reset();
  }

  function handleAdminOrderStatusUpdate(e) {
    e.preventDefault();
    adminOrderStatusForm.post('/admin/orders/update-status', {
      onSuccess: () => { router.reload({ only: ['orders'] }); closeOrderDetails(); },
    });
  }

  function handleCatSubmit(e) {
    e.preventDefault();
    if (categoryLevel === "main") {
      category.post('/addcate', { onSuccess: () => { category.reset(); alert('Main category added!'); }, onError: () => alert('Failed to add category') });
    } else if (categoryLevel === "sub") {
      if (!subCategory.data.category_id) { alert('Please select a main category'); return; }
      subCategory.post('/add-subcategory', { onSuccess: () => { subCategory.reset(); setSelectedMainCategory(''); alert('Sub category added!'); }, onError: () => alert('Failed') });
    } else if (categoryLevel === "subsub") {
      if (!subSubCategory.data.subcategory_id) { alert('Please select a sub category'); return; }
      subSubCategory.post('/add-sub-subcategory', { onSuccess: () => { subSubCategory.reset(); setSelectedMainCategory(''); setSelectedSubCategory(''); alert('Sub-sub category added!'); }, onError: () => alert('Failed') });
    }
  }

  function handleAdminCategoryChange(e) {
    const categoryId = e.target.value;
    adminProductForm.setData('category_id', categoryId);
    adminProductForm.setData('subcategory_id', '');
    adminProductForm.setData('sub_subcategory_id', '');
  }

  function handleAdminSubcategoryChange(e) {
    const subcategoryId = e.target.value;
    adminProductForm.setData('subcategory_id', subcategoryId);
    adminProductForm.setData('sub_subcategory_id', '');
  }

  function handleAdminImageChange(fieldName, file) {
    if (!file) { setAdminImagePreviews((prev) => ({ ...prev, [fieldName]: null })); return; }
    const reader = new FileReader();
    reader.onloadend = () => setAdminImagePreviews((prev) => ({ ...prev, [fieldName]: reader.result }));
    reader.readAsDataURL(file);
  }

  function handleAdminProductSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', adminProductForm.data.name);
    formData.append('price', adminProductForm.data.price);
    formData.append('instock', adminProductForm.data.instock);
    formData.append('desc', adminProductForm.data.desc);
    formData.append('category_id', adminProductForm.data.category_id);
    formData.append('subcategory_id', adminProductForm.data.subcategory_id);
    formData.append('discount_type', adminProductForm.data.discount_type);
    formData.append('status', 'Approved');
    if (adminProductForm.data.discount_price) formData.append('discount_price', adminProductForm.data.discount_price);
    if (adminProductForm.data.sub_subcategory_id) formData.append('sub_subcategory_id', adminProductForm.data.sub_subcategory_id);
    if (adminProductForm.data.image instanceof File) formData.append('image', adminProductForm.data.image);
    if (adminProductForm.data.image1 instanceof File) formData.append('image1', adminProductForm.data.image1);
    if (adminProductForm.data.image2 instanceof File) formData.append('image2', adminProductForm.data.image2);
    if (adminProductForm.data.image3 instanceof File) formData.append('image3', adminProductForm.data.image3);
    router.post('/admin/addProduct', formData, {
      forceFormData: true,
      onSuccess: () => { adminProductForm.reset(); setAdminImagePreviews({ image: null, image1: null, image2: null, image3: null }); },
    });
  }

  const filteredAdminSubcategories = (props.subcategories || []).filter(
    (sub) => String(sub.category_id) === String(adminProductForm.data.category_id),
  );
  const filteredAdminSubSubcategories = (props.subSubcategories || []).filter(
    (subSub) => String(subSub.subcategory_id) === String(adminProductForm.data.subcategory_id),
  );

  useEffect(() => {
    adminProductForm.clearErrors();
    homeBannerForm.clearErrors();
    websiteSettingsForm.clearErrors();
  }, [activeTab]);

  const users = props.users || [];
  const products = props.products || [];
  const orders = props.orders || [];
  const reports = props.reports || [];
  const logs = props.logs || [];
  const homeBanners = props.homeBanners || [];
  const promotionBanners = props.promotionBanners || [];

  const uniqueOrders = Object.values(
    orders.reduce((acc, row) => {
      const orderId = String(row.order_id || row.id || '');
      if (!orderId) return acc;
      if (!acc[orderId]) {
        acc[orderId] = { ...row, _order_key: orderId, item_count: 0, total_quantity: 0, seller_names: new Set() };
      }
      acc[orderId].item_count += 1;
      acc[orderId].total_quantity += Number(row.quantity || 0);
      if (row.seller_name) acc[orderId].seller_names.add(row.seller_name);
      return acc;
    }, {})
  ).map((order) => ({
    ...order,
    seller_name: order.seller_names.size > 1 ? 'Multiple Sellers' : (Array.from(order.seller_names)[0] || 'N/A'),
  }));

  const adminLoginPath = `/login/${websiteSettingsForm.data.admin_login_slug || ''}`;
  const websiteName = websiteSettingsForm.data.website_name || 'BrightMaxTrading';
  const currentWebsiteLogo = props.websiteSettings?.website_logo;
  const activeWebsiteLogo = websiteLogoPreview || (currentWebsiteLogo ? `/storage/${currentWebsiteLogo}` : '/logo.png');

  const navItems = [
    { key: "overview", label: "Overview", icon: "bi-grid-1x2" },
    { key: "users", label: "Users", icon: "bi-people-fill", badge: stats.pendingUsers },
    { key: "products", label: "Products", icon: "bi-box-seam-fill", badge: stats.pendingProducts },
    { key: "add-product", label: "Add Product", icon: "bi-plus-circle-fill" },
    { key: "category", label: "Categories", icon: "bi-tags-fill" },
    { key: "orders", label: "Orders", icon: "bi-receipt-cutoff" },
    { key: "banners", label: "Banners", icon: "bi-images" },
    { key: "promotions", label: "Promotions", icon: "bi-megaphone-fill" },
    { key: "website-settings", label: "Settings", icon: "bi-gear-fill" },
    { key: "reports", label: "Reports", icon: "bi-flag-fill" },
    { key: "logs", label: "Logs", icon: "bi-clock-history" },
  ];

  const inp = "w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all";
  const inpLight = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 transition-all";
  const btnPrimary = "px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-all font-medium shadow-sm";
  const btnSecondary = "px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all font-medium";
  const btnDanger = "px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all font-medium";

  const getOrderStatusColor = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'pending') return 'amber';
    if (s === 'processing' || s === 'shipped') return 'blue';
    if (s === 'delivered' || s === 'completed') return 'emerald';
    if (s === 'cancelled') return 'red';
    return 'slate';
  };

  const Badge = ({ children, color = "slate" }) => {
    const map = {
      slate: "bg-slate-100 text-slate-600 border border-slate-200",
      emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      amber: "bg-amber-50 text-amber-700 border border-amber-200",
      red: "bg-red-50 text-red-700 border border-red-200",
      blue: "bg-blue-50 text-blue-700 border border-blue-200",
      violet: "bg-violet-50 text-violet-700 border border-violet-200",
      green: "bg-green-50 text-green-700 border border-green-200",
      gray: "bg-slate-100 text-slate-600 border border-slate-200",
      yellow: "bg-amber-50 text-amber-700 border border-amber-200",
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${map[color] || map.slate}`}>{children}</span>;
  };

  const Modal = ({ open, onClose, title, children, wide }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-md'} z-10 max-h-[90vh] overflow-y-auto`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h5 className="text-sm font-semibold text-slate-800">{title}</h5>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-sm">&times;</button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  const StatCard = ({ label, value, sub, gradient, icon }) => (
    <div className={`relative overflow-hidden rounded-2xl p-4 ${gradient} shadow-sm`}>
      <div className="absolute top-3 right-3 text-white/20 text-3xl">
        <i className={`bi ${icon}`} />
      </div>
      <p className="text-xs text-white/70 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-white/60 mt-1">{sub}</p>
    </div>
  );

  const SectionHeader = ({ title, badge, badgeColor }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {badge !== undefined && <Badge color={badgeColor || 'slate'}>{badge}</Badge>}
    </div>
  );

  const EmptyState = ({ icon, message }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <i className={`bi ${icon} text-2xl text-slate-300`} />
      </div>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );

  const TableHead = ({ cols }) => (
    <thead>
      <tr className="border-b border-slate-100">
        {cols.map(c => <th key={c} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{c}</th>)}
      </tr>
    </thead>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-sm overflow-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .sidebar-item-active { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); }
        .card-glass { background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); }
        .gradient-sidebar { background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%); }
        input[type=file]::file-selector-button { background: #7c3aed; color: white; border: none; padding: 4px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; margin-right: 8px; }
        input[type=file]::file-selector-button:hover { background: #6d28d9; }
        .tr-hover:hover { background-color: #f8f7ff; }
      `}</style>

      <FlashMessage />
      <LoadingScreen />

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`gradient-sidebar fixed lg:static inset-y-0 left-0 z-50 w-56 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center overflow-hidden shadow-lg">
            <img src={activeWebsiteLogo} className="w-full h-full object-cover" alt="logo" onError={e => e.target.style.display = 'none'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white leading-tight truncate">{websiteName}</p>
            <p className="text-[10px] text-violet-300 font-medium">Admin Panel</p>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <i className="bi bi-x-lg text-sm" />
          </button>
        </div>

        {/* Alerts pill */}
        {stats.userNotifications > 0 && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <p className="text-xs text-red-300">{stats.userNotifications} alerts pending</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? 'sidebar-item-active shadow-lg shadow-violet-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
              >
                <i className={`bi ${item.icon} text-sm w-4 text-center ${isActive ? 'text-white' : ''}`} />
                <span className={`flex-1 text-sm font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                {item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white text-violet-700' : 'bg-red-500 text-white'}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <Link href="/logout" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-600/20 hover:text-red-400 transition-all w-full">
            <i className="bi bi-box-arrow-right text-sm" />
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3 shrink-0 shadow-sm">
          <button className="lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(true)}>
            <i className="bi bi-list text-xl" />
          </button>
          <div>
            <h2 className="font-bold text-slate-800 text-base">{navItems.find(n => n.key === activeTab)?.label}</h2>
            <p className="text-xs text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {stats.userNotifications > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-600 font-medium">{stats.userNotifications} alerts</span>
              </div>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <i className="bi bi-person-fill text-white text-sm" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {[
                  { label: "Total Users", value: stats.totalUsers, sub: "All registered", gradient: "bg-gradient-to-br from-violet-600 to-violet-800", icon: "bi-people-fill" },
                  { label: "Total Products", value: stats.totalProducts, sub: "In catalog", gradient: "bg-gradient-to-br from-blue-600 to-blue-800", icon: "bi-box-seam-fill" },
                  { label: "Approved", value: stats.approvedProducts, sub: "Live products", gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700", icon: "bi-check-circle-fill" },
                  { label: "Total Orders", value: stats.totalOrders, sub: "All time", gradient: "bg-gradient-to-br from-cyan-500 to-cyan-700", icon: "bi-receipt-cutoff" },
                  { label: "Pending Users", value: stats.pendingUsers, sub: "Need approval", gradient: "bg-gradient-to-br from-orange-500 to-orange-700", icon: "bi-person-exclamation" },
                  { label: "Pending Products", value: stats.pendingProducts, sub: "Need review", gradient: "bg-gradient-to-br from-sky-500 to-sky-700", icon: "bi-hourglass-split" },
                  { label: "Pending Orders", value: stats.pendingOrders, sub: "Needs processing", gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700", icon: "bi-clock-fill" },
                  { label: "Cancelled", value: stats.canceledOrders, sub: "Cancellations", gradient: "bg-gradient-to-br from-rose-500 to-rose-700", icon: "bi-x-circle-fill" },
                  { label: "Reported", value: stats.reportedOrders, sub: "Active disputes", gradient: "bg-gradient-to-br from-pink-500 to-pink-700", icon: "bi-flag-fill" },
                  { label: "Flagged Sellers", value: stats.flaggedSellers, sub: "Under review", gradient: "bg-gradient-to-br from-purple-600 to-purple-800", icon: "bi-shield-exclamation" },
                ].map((s, i) => <StatCard key={i} {...s} />)}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { tab: "users", label: "Verify Users", icon: "bi-person-check", color: "bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-100" },
                      { tab: "products", label: "Review Products", icon: "bi-box-seam", color: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100" },
                      { tab: "add-product", label: "Add Product", icon: "bi-plus-circle", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100" },
                      { tab: "category", label: "Add Category", icon: "bi-tags", color: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100" },
                    ].map(a => (
                      <button key={a.tab} onClick={() => setActiveTab(a.tab)} className={`flex flex-col items-center gap-2 py-4 text-xs font-semibold border rounded-xl transition-all ${a.color}`}>
                        <i className={`bi ${a.icon} text-lg`} />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm lg:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Activity</p>
                  {logs.slice(0, 6).length > 0 ? (
                    <div className="space-y-1">
                      {logs.slice(0, 6).map((log, i) => (
                        <div key={log.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                          <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                          <p className="flex-1 text-xs text-slate-600">{log.action}</p>
                          <span className="text-[10px] text-slate-300 shrink-0 group-hover:text-slate-400 transition-colors">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  ) : <EmptyState icon="bi-clock-history" message="No recent activity" />}
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <SectionHeader title="User Management" badge={`${users.length} total`} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <TableHead cols={["User", "Email", "Role", "Status", "Joined", "Actions"]} />
                  <tbody>
                    {users.length > 0 ? users.map(user => (
                      <tr key={user.id} className="tr-hover border-b border-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-800">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">{user.email}</td>
                        <td className="px-4 py-3.5"><Badge color="violet">{user.role}</Badge></td>
                        <td className="px-4 py-3.5">
                          <Badge color={user.status === 'Approved' ? 'emerald' : user.status === 'Pending' ? 'amber' : 'red'}>{user.status}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white text-[11px] font-semibold hover:bg-emerald-600 transition-colors">Approve</button>
                            <button className="px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-[11px] font-semibold hover:bg-red-600 transition-colors">Reject</button>
                            <button onClick={() => openEditModal(user)} className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold hover:bg-slate-200 transition-colors">Edit</button>
                            <button onClick={() => deleteUser(user.id, user.name)} className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-[11px] font-semibold hover:bg-red-100 transition-colors">Del</button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="6"><EmptyState icon="bi-people" message="No users found" /></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {activeTab === "products" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <SectionHeader title="Products Awaiting Approval" badge={`${stats.pendingProducts} pending`} badgeColor="amber" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <TableHead cols={["Product", "Seller", "Price", "Stock", "Date", "Status", "Actions"]} />
                  <tbody>
                    {products.length > 0 ? products.map(product => (
                      <tr key={product.id} className="tr-hover border-b border-slate-50 transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-slate-800">{product.name}</td>
                        <td className="px-4 py-3.5 text-slate-500">{product.seller_name || 'N/A'}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-700">RM {product.price}</td>
                        <td className="px-4 py-3.5">
                          <Badge color={product.instock > 0 ? 'emerald' : 'red'}>{product.instock}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">{new Date(product.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3.5"><Badge color="amber">{product.status}</Badge></td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-1.5">
                            <Link href={`/admin/editProduct/${product.id}`} className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold hover:bg-slate-200 transition-colors no-underline">Edit</Link>
                            <Link href={`/approve/${product.id}`} className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white text-[11px] font-semibold hover:bg-emerald-600 transition-colors no-underline">Approve</Link>
                            <Link href={`/reject/${product.id}`} className="px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-[11px] font-semibold hover:bg-red-600 transition-colors no-underline">Reject</Link>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="7"><EmptyState icon="bi-box-seam" message="No products pending review" /></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <SectionHeader title="All Orders" badge={`${uniqueOrders.length} orders`} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <TableHead cols={["Order ID", "Customer", "Seller", "Items", "Amount", "Status", "Actions"]} />
                  <tbody>
                    {uniqueOrders.length > 0 ? uniqueOrders.map((order, i) => (
                      <tr key={`${order._order_key}-${i}`} className="tr-hover border-b border-slate-50 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-violet-700">#{order.order_id || order.id}</td>
                        <td className="px-4 py-3.5 text-slate-600">{order.customer_name || order.customer || 'N/A'}</td>
                        <td className="px-4 py-3.5 text-slate-500">{order.seller_name || 'N/A'}</td>
                        <td className="px-4 py-3.5 text-slate-500">{order.item_count} items</td>
                        <td className="px-4 py-3.5 font-bold text-slate-800">RM {order.total_amount || order.amount || 0}</td>
                        <td className="px-4 py-3.5">
                          <Badge color={getOrderStatusColor(order.product_order_status || order.order_status || order.status)}>
                            {order.product_order_status || order.order_status || order.status || 'Pending'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <button onClick={() => openOrderDetails(order.order_id || order.id)} className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-[11px] font-semibold hover:bg-violet-100 transition-colors border border-violet-100">
                            Details
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="7"><EmptyState icon="bi-receipt" message="No orders found" /></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ADD PRODUCT ── */}
          {activeTab === "add-product" && (
            <div className="max-w-4xl bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-base font-bold text-slate-800">Add New Product</h3>
                <p className="text-xs text-slate-400 mt-1">Products added here are automatically approved and listed.</p>
              </div>
              <form onSubmit={handleAdminProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
                {[
                  { label: "Product Name", key: "name", type: "text", required: true },
                  { label: "Price (RM)", key: "price", type: "number", step: "0.01", required: true },
                  { label: "Discount Value", key: "discount_price", type: "number", step: "0.01" },
                  { label: "Stock Quantity", key: "instock", type: "number", required: true },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label} {f.required && <span className="text-red-400">*</span>}</label>
                    <input type={f.type} step={f.step} className={inpLight} value={adminProductForm.data[f.key]} onChange={e => adminProductForm.setData(f.key, e.target.value)} required={f.required} />
                    {adminProductForm.errors[f.key] && <p className="text-xs text-red-500 mt-1">{adminProductForm.errors[f.key]}</p>}
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Discount Type</label>
                  <select className={inpLight} value={adminProductForm.data.discount_type} onChange={e => adminProductForm.setData('discount_type', e.target.value)}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (RM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Main Category <span className="text-red-400">*</span></label>
                  <select className={inpLight} value={adminProductForm.data.category_id} onChange={handleAdminCategoryChange} required>
                    <option value="">Select main category</option>
                    {(props.categories || []).map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
                  </select>
                  {adminProductForm.errors.category_id && <p className="text-xs text-red-500 mt-1">{adminProductForm.errors.category_id}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sub Category <span className="text-red-400">*</span></label>
                  <select className={inpLight} value={adminProductForm.data.subcategory_id} onChange={handleAdminSubcategoryChange} disabled={!adminProductForm.data.category_id} required>
                    <option value="">Select sub category</option>
                    {filteredAdminSubcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                  </select>
                  {adminProductForm.errors.subcategory_id && <p className="text-xs text-red-500 mt-1">{adminProductForm.errors.subcategory_id}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sub-Sub Category</label>
                  <select className={inpLight} value={adminProductForm.data.sub_subcategory_id} onChange={e => adminProductForm.setData('sub_subcategory_id', e.target.value)} disabled={!adminProductForm.data.subcategory_id}>
                    <option value="">Optional</option>
                    {filteredAdminSubSubcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description <span className="text-red-400">*</span></label>
                  <textarea className={inpLight} rows={4} value={adminProductForm.data.desc} onChange={e => adminProductForm.setData('desc', e.target.value)} required />
                  {adminProductForm.errors.desc && <p className="text-xs text-red-500 mt-1">{adminProductForm.errors.desc}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Main Image <span className="text-red-400">*</span></label>
                  <input type="file" className={inpLight} accept="image/*" required onChange={e => { const f = e.target.files?.[0] || null; adminProductForm.setData('image', f); handleAdminImageChange('image', f); }} />
                  {adminProductForm.errors.image && <p className="text-xs text-red-500 mt-1">{adminProductForm.errors.image}</p>}
                </div>

                <div className="md:col-span-2 grid grid-cols-3 gap-3">
                  {['image1', 'image2', 'image3'].map((key, i) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Image {i + 1} <span className="text-slate-300">(optional)</span></label>
                      <input type="file" className={inpLight} accept="image/*" onChange={e => { const f = e.target.files?.[0] || null; adminProductForm.setData(key, f); handleAdminImageChange(key, f); }} />
                    </div>
                  ))}
                </div>

                {Object.values(adminImagePreviews).some(Boolean) && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-2">Preview</label>
                    <div className="grid grid-cols-4 gap-3">
                      {Object.entries(adminImagePreviews).map(([key, src]) => src ? (
                        <div key={key} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-square">
                          <img src={src} alt={key} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">{key}</div>
                        </div>
                      ) : null)}
                    </div>
                  </div>
                )}

                <div className="md:col-span-2 flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button type="button" className={btnSecondary} onClick={() => { adminProductForm.reset(); setAdminImagePreviews({ image: null, image1: null, image2: null, image3: null }); }}>Reset</button>
                  <button type="submit" disabled={adminProductForm.processing} className={btnPrimary}>
                    {adminProductForm.processing ? 'Adding...' : '+ Add Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── WEBSITE SETTINGS ── */}
          {activeTab === "website-settings" && (
            <div className="max-w-xl bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-base font-bold text-slate-800">Website Settings</h3>
                <p className="text-xs text-slate-400 mt-1">Update branding and admin login path.</p>
              </div>
              <form onSubmit={handleWebsiteSettingsSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Website Name</label>
                  <input type="text" className={inpLight} value={websiteSettingsForm.data.website_name} onChange={e => websiteSettingsForm.setData('website_name', e.target.value)} required />
                  {websiteSettingsForm.errors.website_name && <p className="text-xs text-red-500 mt-1">{websiteSettingsForm.errors.website_name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Website Logo</label>
                  <input type="file" className={inpLight} accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml" onChange={e => {
                    const file = e.target.files?.[0] || null;
                    websiteSettingsForm.setData('website_logo', file);
                    if (!file) { setWebsiteLogoPreview(null); return; }
                    const reader = new FileReader();
                    reader.onloadend = () => setWebsiteLogoPreview(reader.result);
                    reader.readAsDataURL(file);
                  }} />
                  {websiteSettingsForm.errors.website_logo && <p className="text-xs text-red-500 mt-1">{websiteSettingsForm.errors.website_logo}</p>}
                  <div className="mt-3 flex items-center gap-3">
                    <img src={activeWebsiteLogo} alt="logo" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm" />
                    <span className="text-xs text-slate-400">Current logo</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Admin URL Slug</label>
                  <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
                    <span className="px-3 py-2 bg-slate-50 text-xs text-slate-400 border-r border-slate-200">/login/</span>
                    <input type="text" className="flex-1 px-3 py-2 text-sm text-slate-800 focus:outline-none" value={websiteSettingsForm.data.admin_login_slug} onChange={e => websiteSettingsForm.setData('admin_login_slug', e.target.value)} required />
                  </div>
                  {websiteSettingsForm.errors.admin_login_slug && <p className="text-xs text-red-500 mt-1">{websiteSettingsForm.errors.admin_login_slug}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl">
                    <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-wide mb-1">Site Name</p>
                    <p className="text-sm font-bold text-violet-800 truncate">{websiteName}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Admin Path</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{adminLoginPath}</p>
                  </div>
                </div>
                <button type="submit" disabled={websiteSettingsForm.processing} className={btnPrimary + " w-full justify-center"}>
                  {websiteSettingsForm.processing ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>
          )}

          {/* ── BANNERS ── */}
          {activeTab === "banners" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-1">Add Welcome Banner</h3>
                <p className="text-xs text-slate-400 mb-4">Hero carousel for the home page.</p>
                <form onSubmit={handleHomeBannerSubmit} className="space-y-3" encType="multipart/form-data">
                  {[
                    { label: "Badge", key: "badge", ph: "EXCLUSIVE DEALS" },
                    { label: "Title *", key: "title", ph: "GET UP TO 40% OFF", required: true },
                    { label: "Subtitle", key: "subtitle", ph: "On Pre-Owned Products" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{f.label}</label>
                      <input className={inpLight} type="text" value={homeBannerForm.data[f.key]} onChange={e => homeBannerForm.setData(f.key, e.target.value)} placeholder={f.ph} required={f.required} />
                      {homeBannerForm.errors[f.key] && <p className="text-xs text-red-500 mt-1">{homeBannerForm.errors[f.key]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                    <textarea className={inpLight} rows={2} value={homeBannerForm.data.description} onChange={e => homeBannerForm.setData('description', e.target.value)} placeholder="Certified Quality & Smart Savings" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Button Text</label>
                      <input className={inpLight} type="text" value={homeBannerForm.data.button_text} onChange={e => homeBannerForm.setData('button_text', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Button Link</label>
                      <input className={inpLight} type="text" value={homeBannerForm.data.button_link} onChange={e => homeBannerForm.setData('button_link', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Sort Order</label>
                      <input className={inpLight} type="number" min="0" value={homeBannerForm.data.sort_order} onChange={e => homeBannerForm.setData('sort_order', e.target.value)} />
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 pb-2 cursor-pointer">
                      <input type="checkbox" checked={homeBannerForm.data.is_active} onChange={e => homeBannerForm.setData('is_active', e.target.checked)} className="w-4 h-4 accent-violet-600" />
                      Active
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Background Image <span className="text-red-400">*</span></label>
                    <input className={inpLight} type="file" accept="image/*" required onChange={e => {
                      const file = e.target.files?.[0] || null;
                      homeBannerForm.setData('image', file);
                      if (!file) { setHomeBannerPreview(null); return; }
                      const reader = new FileReader();
                      reader.onloadend = () => setHomeBannerPreview(reader.result);
                      reader.readAsDataURL(file);
                    }} />
                    {homeBannerForm.errors.image && <p className="text-xs text-red-500 mt-1">{homeBannerForm.errors.image}</p>}
                  </div>
                  {homeBannerPreview && <div className="rounded-xl overflow-hidden border border-slate-200"><img src={homeBannerPreview} alt="preview" className="w-full h-28 object-cover" /></div>}
                  <button type="submit" disabled={homeBannerForm.processing} className={btnPrimary + " w-full justify-center"}>
                    {homeBannerForm.processing ? 'Uploading...' : 'Upload Banner'}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Uploaded Banners</h3>
                  <Badge color="violet">{homeBanners.length} total</Badge>
                </div>
                <div className="space-y-3 max-h-[65vh] overflow-auto pr-1">
                  {homeBanners.length > 0 ? homeBanners.map(banner => (
                    <div key={banner.id} className="rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-colors">
                      {banner.image && <img src={`/storage/${banner.image}`} alt={banner.title} className="w-full h-28 object-cover" />}
                      <div className="p-3 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-800 truncate">{banner.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{banner.subtitle || 'No subtitle'}</p>
                          <p className="text-[10px] text-slate-300 mt-1">Order: {banner.sort_order ?? 0} · {banner.button_text || 'Shop Now'}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge color={banner.is_active ? 'emerald' : 'slate'}>{banner.is_active ? 'Active' : 'Off'}</Badge>
                          <button onClick={() => deleteHomeBanner(banner.id)} className="px-2 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium">Del</button>
                        </div>
                      </div>
                    </div>
                  )) : <EmptyState icon="bi-images" message="No banners uploaded yet." />}
                </div>
              </div>
            </div>
          )}

          {/* ── PROMOTIONS ── */}
          {activeTab === "promotions" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-1">Add Promotion Banner</h3>
                <p className="text-xs text-slate-400 mb-4">Appears in the homepage promotions strip.</p>
                <form onSubmit={handlePromotionBannerSubmit} className="space-y-3" encType="multipart/form-data">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Title <span className="text-red-400">*</span></label>
                    <input className={inpLight} type="text" value={promotionBannerForm.data.title} onChange={e => promotionBannerForm.setData('title', e.target.value)} required />
                    {promotionBannerForm.errors.title && <p className="text-xs text-red-500 mt-1">{promotionBannerForm.errors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Subtitle</label>
                    <input className={inpLight} type="text" value={promotionBannerForm.data.subtitle} onChange={e => promotionBannerForm.setData('subtitle', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Button Link</label>
                    <input className={inpLight} type="text" value={promotionBannerForm.data.button_link} onChange={e => promotionBannerForm.setData('button_link', e.target.value)} placeholder="#" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Sort Order</label>
                      <input className={inpLight} type="number" min="0" value={promotionBannerForm.data.sort_order} onChange={e => promotionBannerForm.setData('sort_order', e.target.value)} />
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 pb-2 cursor-pointer">
                      <input type="checkbox" checked={promotionBannerForm.data.is_active} onChange={e => promotionBannerForm.setData('is_active', e.target.checked)} className="w-4 h-4 accent-violet-600" />
                      Active
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Banner Image <span className="text-red-400">*</span></label>
                    <input className={inpLight} type="file" accept="image/*" required onChange={e => {
                      const file = e.target.files?.[0] || null;
                      promotionBannerForm.setData('image', file);
                      if (!file) { setPromotionBannerPreview(null); return; }
                      const reader = new FileReader();
                      reader.onloadend = () => setPromotionBannerPreview(reader.result);
                      reader.readAsDataURL(file);
                    }} />
                    {promotionBannerForm.errors.image && <p className="text-xs text-red-500 mt-1">{promotionBannerForm.errors.image}</p>}
                  </div>
                  {promotionBannerPreview && <div className="rounded-xl overflow-hidden border border-slate-200"><img src={promotionBannerPreview} alt="preview" className="w-full h-28 object-cover" /></div>}
                  <button type="submit" disabled={promotionBannerForm.processing} className={btnPrimary + " w-full justify-center"}>
                    {promotionBannerForm.processing ? 'Uploading...' : 'Upload Promotion'}
                  </button>
                </form>
              </div>
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Promotion Banners</h3>
                  <Badge color="violet">{promotionBanners.length} total</Badge>
                </div>
                <div className="space-y-3 max-h-[65vh] overflow-auto pr-1">
                  {promotionBanners.length > 0 ? promotionBanners.map(banner => (
                    <div key={banner.id} className="rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-colors">
                      {banner.image && <img src={`/storage/${banner.image}`} alt={banner.title} className="w-full h-28 object-cover" />}
                      <div className="p-3 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-800 truncate">{banner.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{banner.subtitle || 'No subtitle'}</p>
                          <p className="text-[10px] text-slate-300 mt-1">Sort: {banner.sort_order ?? 0} · {banner.button_link || '#'}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge color={banner.is_active ? 'emerald' : 'slate'}>{banner.is_active ? 'Active' : 'Off'}</Badge>
                          <button onClick={() => deletePromotionBanner(banner.id)} className="px-2 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium">Del</button>
                        </div>
                      </div>
                    </div>
                  )) : <EmptyState icon="bi-megaphone" message="No promotion banners yet." />}
                </div>
              </div>
            </div>
          )}

          {/* ── CATEGORIES ── */}
          {activeTab === "category" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4">Add Category</h3>
                <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-5">
                  {["main", "sub", "subsub"].map((lvl, i) => (
                    <button key={lvl} onClick={() => {
                      setCategoryLevel(lvl);
                      if (lvl !== 'subsub') { setSelectedSubCategory(''); subSubCategory.reset(); }
                      if (lvl === 'main') { setSelectedMainCategory(''); category.reset(); subCategory.reset(); }
                    }} className={`flex-1 py-2 text-xs font-bold transition-all ${categoryLevel === lvl ? 'bg-violet-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                      {["Main", "Sub", "Sub-Sub"][i]}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleCatSubmit} className="space-y-3">
                  {categoryLevel === 'main' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category Name <span className="text-red-400">*</span></label>
                        <input type="text" className={inpLight} placeholder="e.g., Electronics" value={category.data.category} onChange={e => category.setData('category', e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Image (Optional)</label>
                        <input type="file" className={inpLight} accept="image/*" onChange={e => category.setData('image', e.target.files[0])} />
                      </div>
                      <button type="submit" disabled={category.processing} className={btnPrimary + " w-full justify-center"}>{category.processing ? 'Adding...' : 'Add Main Category'}</button>
                    </>
                  )}
                  {categoryLevel === 'sub' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Main Category <span className="text-red-400">*</span></label>
                        <select className={inpLight} value={subCategory.data.category_id} onChange={e => { subCategory.setData('category_id', e.target.value); setSelectedMainCategory(e.target.value); }} required>
                          <option value="">— Select —</option>
                          {props.categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sub Category Name <span className="text-red-400">*</span></label>
                        <input type="text" className={inpLight} placeholder="e.g., Smartphones" value={subCategory.data.name} onChange={e => subCategory.setData('name', e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Image (Optional)</label>
                        <input type="file" className={inpLight} accept="image/*" onChange={e => subCategory.setData('image', e.target.files[0])} />
                      </div>
                      <button type="submit" disabled={subCategory.processing || !subCategory.data.category_id} className={btnPrimary + " w-full justify-center"}>{subCategory.processing ? 'Adding...' : 'Add Sub Category'}</button>
                    </>
                  )}
                  {categoryLevel === 'subsub' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Main Category <span className="text-red-400">*</span></label>
                        <select className={inpLight} value={selectedMainCategory} onChange={e => { setSelectedMainCategory(e.target.value); setSelectedSubCategory(''); subSubCategory.setData('subcategory_id', ''); }} required>
                          <option value="">— Select —</option>
                          {props.categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sub Category <span className="text-red-400">*</span></label>
                        <select className={inpLight} value={subSubCategory.data.subcategory_id} onChange={e => { subSubCategory.setData('subcategory_id', e.target.value); setSelectedSubCategory(e.target.value); }} disabled={!selectedMainCategory} required>
                          <option value="">— Select —</option>
                          {selectedMainCategory && props.subcategories?.filter(s => s.category_id == selectedMainCategory).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Name <span className="text-red-400">*</span></label>
                        <input type="text" className={inpLight} placeholder="e.g., iPhone" value={subSubCategory.data.name} onChange={e => subSubCategory.setData('name', e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Image (Optional)</label>
                        <input type="file" className={inpLight} accept="image/*" onChange={e => subSubCategory.setData('image', e.target.files[0])} />
                      </div>
                      <button type="submit" disabled={subSubCategory.processing || !subSubCategory.data.subcategory_id} className={btnPrimary + " w-full justify-center"}>{subSubCategory.processing ? 'Adding...' : 'Add Sub-Sub Category'}</button>
                    </>
                  )}
                </form>
              </div>

              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">All Categories <span className="text-slate-400 font-normal text-sm">({props.categories?.length || 0})</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <TableHead cols={["Name", "Type", "Actions"]} />
                    <tbody>
                      {props.categories?.map((item, i) => (
                        <React.Fragment key={`main-${i}`}>
                          <tr className="bg-slate-50 border-t border-slate-100">
                            <td className="px-4 py-3 font-bold text-slate-800">{item.category}</td>
                            <td className="px-4 py-3"><Badge color="violet">Main</Badge></td>
                            <td className="px-4 py-3 flex gap-1.5">
                              <button onClick={() => openEditCategoryModal(item, 'main')} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-semibold">Edit</button>
                              <button onClick={() => openDeleteCategoryModal(item, 'main')} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-semibold">Del</button>
                            </td>
                          </tr>
                          {props.subcategories?.filter(s => s.category_id === item.id).map((subcat, si) => (
                            <React.Fragment key={`sub-${si}`}>
                              <tr className="border-t border-slate-50 tr-hover">
                                <td className="px-4 py-2.5 pl-8 text-slate-600">↳ {subcat.name}</td>
                                <td className="px-4 py-2.5"><Badge color="blue">Sub</Badge></td>
                                <td className="px-4 py-2.5 flex gap-1.5">
                                  <button onClick={() => openEditCategoryModal(subcat, 'sub')} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-semibold">Edit</button>
                                  <button onClick={() => openDeleteCategoryModal(subcat, 'sub')} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-semibold">Del</button>
                                </td>
                              </tr>
                              {props.subSubcategories?.filter(ss => ss.subcategory_id === subcat.id).map((ss, ssi) => (
                                <tr key={`subsub-${ssi}`} className="border-t border-slate-50 tr-hover">
                                  <td className="px-4 py-2 pl-14 text-slate-400">↳ {ss.name}</td>
                                  <td className="px-4 py-2"><Badge color="amber">Sub-Sub</Badge></td>
                                  <td className="px-4 py-2 flex gap-1.5">
                                    <button onClick={() => openEditCategoryModal(ss, 'subsub')} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-semibold">Edit</button>
                                    <button onClick={() => openDeleteCategoryModal(ss, 'subsub')} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-semibold">Del</button>
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── REPORTS ── */}
          {activeTab === "reports" && (
            <div className="space-y-3">
              {reports.length > 0 ? reports.map(report => (
                <div key={report.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm hover:border-slate-200 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${report.type === 'Product' ? 'bg-blue-50' : 'bg-amber-50'}`}>
                    <i className={`bi ${report.type === 'Product' ? 'bi-box-seam text-blue-500' : 'bi-bag text-amber-500'} text-lg`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge color={report.type === 'Product' ? 'blue' : 'amber'}>{report.type} Report</Badge>
                      <span className="text-xs text-slate-400">{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-700 mb-1">{report.description}</p>
                    <p className="text-xs text-slate-400">By: <span className="text-slate-600 font-medium">{report.reported_by}</span></p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-medium">View</button>
                    <button className="px-2.5 py-1.5 text-xs rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium">Resolve</button>
                    <button className="px-2.5 py-1.5 text-xs rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-medium">Dismiss</button>
                  </div>
                </div>
              )) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <EmptyState icon="bi-flag" message="No reports found" />
                </div>
              )}
            </div>
          )}

          {/* ── LOGS ── */}
          {activeTab === "logs" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Audit Trail</h3>
                <div className="flex gap-1.5">
                  {["Today", "Week", "Month"].map(f => (
                    <button key={f} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all">{f}</button>
                  ))}
                </div>
              </div>
              <div>
                {logs.length > 0 ? logs.map((log, i) => (
                  <div key={log.id} className={`flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors ${i !== logs.length - 1 ? 'border-b border-slate-50' : ''}`}>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <p className="flex-1 text-xs text-slate-700">{log.action}</p>
                    <span className="text-xs font-medium text-slate-500 shrink-0">{log.admin}</span>
                    <span className="text-xs text-slate-300 shrink-0">{log.timestamp}</span>
                  </div>
                )) : <EmptyState icon="bi-clock-history" message="No audit logs found" />}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── MODALS ── */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit User">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {[{ label: "Name", key: "name", type: "text" }, { label: "Email", key: "email", type: "email" }].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label}</label>
              <input type={f.type} className={inpLight} value={editForm.data[f.key]} onChange={e => editForm.setData(f.key, e.target.value)} required />
              {editForm.errors[f.key] && <p className="text-xs text-red-500 mt-1">{editForm.errors[f.key]}</p>}
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role</label>
            <select className={inpLight} value={editForm.data.role} onChange={e => editForm.setData('role', e.target.value)}>
              <option value="Seller">Seller</option>
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {[{ label: "New Password (optional)", key: "password", ph: "Leave blank to keep current" }, { label: "Confirm Password", key: "password_confirmation", ph: "Re-enter password" }].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label}</label>
              <input type="password" className={inpLight} value={editForm.data[f.key]} onChange={e => editForm.setData(f.key, e.target.value)} placeholder={f.ph} />
            </div>
          ))}
          <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setEditModalOpen(false)} className={btnSecondary}>Cancel</button>
            <button type="submit" disabled={editForm.processing} className={btnPrimary}>{editForm.processing ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={editCategoryModalOpen} onClose={() => setEditCategoryModalOpen(false)} title="Edit Category">
        <form onSubmit={handleCategoryEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Type</label>
            <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-500">
              {editCategoryForm.data.level === 'main' ? 'Main Category' : editCategoryForm.data.level === 'sub' ? 'Sub Category' : 'Sub-Sub Category'}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Name</label>
            <input type="text" className={inpLight} value={editCategoryForm.data.name} onChange={e => editCategoryForm.setData('name', e.target.value)} required />
            {editCategoryForm.errors.name && <p className="text-xs text-red-500 mt-1">{editCategoryForm.errors.name}</p>}
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setEditCategoryModalOpen(false)} className={btnSecondary}>Cancel</button>
            <button type="submit" disabled={editCategoryForm.processing} className={btnPrimary}>{editCategoryForm.processing ? 'Updating...' : 'Update'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={deleteCategoryModalOpen} onClose={() => setDeleteCategoryModalOpen(false)} title="Delete Category">
        <form onSubmit={handleCategoryDeleteSubmit} className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800">
            <div className="flex gap-2 items-start">
              <i className="bi bi-exclamation-triangle-fill text-red-500 mt-0.5" />
              <div>
                <p className="font-bold mb-1">This action cannot be undone.</p>
                <p>Deleting this {deleteCategoryForm.data.level === 'main' ? 'main category' : deleteCategoryForm.data.level === 'sub' ? 'sub category' : 'sub-sub category'} will also remove all related products.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setDeleteCategoryModalOpen(false)} className={btnSecondary}>Cancel</button>
            <button type="submit" disabled={deleteCategoryForm.processing} className={btnDanger}>{deleteCategoryForm.processing ? 'Deleting...' : 'Delete'}</button>
          </div>
        </form>
      </Modal>

      {showOrderDetailModal && selectedOrderRows.length > 0 && (
        <Modal open={true} onClose={closeOrderDetails} title={`Order #${selectedOrderRows[0].order_id}`} wide>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-semibold uppercase tracking-wide text-[10px] mb-1.5">Customer</p>
                <p className="font-bold text-slate-800">{selectedOrderRows[0].customer_name || 'N/A'}</p>
                <p className="text-slate-500 mt-0.5">{selectedOrderRows[0].customer_email || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-semibold uppercase tracking-wide text-[10px] mb-1.5">Payment</p>
                <p className="font-bold text-slate-800">{selectedOrderRows[0].payment_method || 'N/A'}</p>
                <p className="text-slate-500 mt-0.5">RM {selectedOrderRows[0].total_amount || 0}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-semibold uppercase tracking-wide text-[10px] mb-1.5">Shipping</p>
                <p className="font-bold text-slate-800">{selectedOrderRows[0].address || 'N/A'}</p>
                <p className="text-slate-500 mt-0.5">{selectedOrderRows[0].city || ''} {selectedOrderRows[0].shipping_country || ''}</p>
                <p className="text-slate-400 mt-0.5">☎ {selectedOrderRows[0].phone || 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Products</p>
              <div className="space-y-2">
                {selectedOrderRows.map((item, idx) => (
                  <div key={`${item.product_id}-${idx}`} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
                    {item.product_image ? (
                      <img src={`/storage/${item.product_image}`} alt={item.product_name} className="w-12 h-12 object-cover rounded-lg" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
                        <i className="bi bi-image text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.product_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity} · RM {item.line_amount || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAdminOrderStatusUpdate} className="bg-violet-50 border border-violet-100 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-violet-700">Update Order Status</p>
              <select className={inpLight} value={adminOrderStatusForm.data.status} onChange={(e) => adminOrderStatusForm.setData('status', e.target.value)} required>
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" className={btnSecondary} onClick={closeOrderDetails}>Close</button>
                <button type="submit" disabled={adminOrderStatusForm.processing} className={btnPrimary}>
                  {adminOrderStatusForm.processing ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Admin;