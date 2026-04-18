import React, { useState } from "react";
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

  const calculateStats = () => {
    const pendingUsers = props.users?.filter(u => u.status === 'Pending').length || 0;
    const pendingProducts = props.products?.filter(p => p.status === 'Pending').length || 0;
    const reportedOrders = props.reported_orders?.length || 0;
    const flaggedSellers = props.sellers?.filter(s => s.status === 'Flagged').length || 0;
    return {
      pendingUsers, pendingProducts, reportedOrders, flaggedSellers,
      userNotifications: pendingUsers + pendingProducts + reportedOrders + flaggedSellers,
      totalUsers: props.users?.length || 0,
      totalProducts: props.products?.length || 0,
    };
  };

  const stats = calculateStats();

  const category = useForm({ category: '', parent_id: null, level: 'main', image: null });
  const subCategory = useForm({ name: '', category_id: '', image: null });
  const subSubCategory = useForm({ name: '', subcategory_id: '', image: null });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);

  const editForm = useForm({ id: '', name: '', email: '', role: '', password: '', password_confirmation: '' });
  const editCategoryForm = useForm({ id: '', name: '', level: 'main' });
  const deleteCategoryForm = useForm({ id: '', level: 'main' });
  const websiteSettingsForm = useForm({
    admin_login_slug: props.websiteSettings?.admin_login_slug || 'admin',
  });

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
    websiteSettingsForm.post('/admin/website-settings/update');
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

  const users = props.users || [];
  const products = props.products || [];
  const orders = props.orders || [];
  const reports = props.reports || [];
  const logs = props.logs || [];
  const adminLoginPath = `/login/${websiteSettingsForm.data.admin_login_slug || ''}`;

  const navItems = [
    { key: "overview", label: "Overview", icon: "bi-grid" },
    { key: "users", label: "Users", icon: "bi-people", badge: stats.pendingUsers },
    { key: "products", label: "Products", icon: "bi-box-seam", badge: stats.pendingProducts },
    { key: "category", label: "Categories", icon: "bi-tags" },
    { key: "orders", label: "Orders", icon: "bi-receipt" },
    { key: "website-settings", label: "Website Settings", icon: "bi-sliders" },
    { key: "reports", label: "Reports", icon: "bi-flag" },
    { key: "logs", label: "Logs", icon: "bi-clock-history" },
  ];

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500";
  const btnPrimary = "px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 transition-colors";
  const btnSecondary = "px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors";

  const Modal = ({ open, onClose, title, children }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-10">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h5 className="text-sm font-semibold text-gray-800">{title}</h5>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    );
  };

  const Badge = ({ children, color = "gray" }) => {
    const colors = { gray: "bg-gray-100 text-gray-600", green: "bg-green-100 text-green-700", yellow: "bg-yellow-100 text-yellow-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700" };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>{children}</span>;
  };

  return (
    <div className="flex h-screen bg-gray-50 text-sm overflow-hidden">
      <FlashMessage />
      <LoadingScreen />

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-52 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
          <img src="/logo.png" className="w-6 h-6 rounded object-cover" alt="logo" />
          <p className="text-sm font-semibold text-gray-800 leading-tight">Admin</p>
          <button className="ml-auto lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <i className="bi bi-x-lg text-sm" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left transition-colors ${activeTab === item.key ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}`}
            >
              <i className={`bi ${item.icon} text-xs w-4 text-center`} />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${activeTab === item.key ? "bg-white text-gray-800" : "bg-gray-200 text-gray-700"}`}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <Link href="/logout" className="flex items-center gap-2 px-3 py-2 rounded text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full">
            <i className="bi bi-box-arrow-right text-sm" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 shrink-0">
          <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
            <i className="bi bi-list text-xl" />
          </button>
          <h2 className="font-semibold text-gray-800">{navItems.find(n => n.key === activeTab)?.label}</h2>
          <div className="ml-auto flex items-center gap-2">
            {stats.userNotifications > 0 && <Badge color="red">{stats.userNotifications} alerts</Badge>}
            <span className="text-xs text-gray-400 hidden sm:inline">{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Summary</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                {[
                  { label: "Pending Users", value: stats.pendingUsers, sub: "Need approval" },
                  { label: "Pending Products", value: stats.pendingProducts, sub: "Need review" },
                  { label: "Reported Orders", value: stats.reportedOrders, sub: "Active disputes" },
                  { label: "Flagged Sellers", value: stats.flaggedSellers, sub: "Under review" },
                ].map((s, i) => (
                  <div key={i} className="p-4">
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                  </div>
                ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { tab: "users", label: "Verify Users" },
                    { tab: "products", label: "Review Products" },
                    { tab: "category", label: "Add Category" },
                    { tab: "reports", label: "View Reports" },
                  ].map(a => (
                    <button key={a.tab} onClick={() => setActiveTab(a.tab)} className="py-2 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recent Activity</p>
                </div>
                {logs.slice(0, 5).length > 0 ? logs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
                    <p className="flex-1 text-xs text-gray-700">{log.action}</p>
                    <span className="text-xs text-gray-400 shrink-0">{log.timestamp}</span>
                  </div>
                )) : (
                  <p className="px-4 py-6 text-center text-xs text-gray-400">No recent activity</p>
                )}
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-700">User Verifications</p>
                <Badge>{users.length} total</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-left">
                      {["Name", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                        <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.length > 0 ? users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold shrink-0">{user.name.charAt(0)}</div>
                            <span className="font-medium text-gray-800">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{user.email}</td>
                        <td className="px-4 py-3"><Badge>{user.role}</Badge></td>
                        <td className="px-4 py-3">
                          <Badge color={user.status === 'Approved' ? 'green' : user.status === 'Pending' ? 'yellow' : 'red'}>{user.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors">✓</button>
                            <button className="px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors">✕</button>
                            <button onClick={() => openEditModal(user)} className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Edit</button>
                            <button onClick={() => deleteUser(user.id, user.name)} className="px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Del</button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-700">Products Awaiting Approval</p>
                <Badge color="yellow">{stats.pendingProducts} pending</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-left">
                      {["Product", "Seller", "Price", "Stock", "Date", "Status", "Actions"].map(h => (
                        <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.length > 0 ? products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                        <td className="px-4 py-3 text-gray-500">{product.seller_name || 'N/A'}</td>
                        <td className="px-4 py-3 font-medium text-gray-700">RM {product.price}</td>
                        <td className="px-4 py-3">
                          <Badge color={product.instock > 0 ? 'green' : 'red'}>{product.instock}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{new Date(product.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3"><Badge color="yellow">{product.status}</Badge></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Link href={`/approve/${product.id}`} className="px-2.5 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors">Approve</Link>
                            <Link href={`/reject/${product.id}`} className="px-2.5 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors">Reject</Link>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-400">No products pending review</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-700">All Orders</p>
                <Badge>{orders.length} records</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-left">
                      {["Order ID", "Product", "Customer", "Seller", "Qty", "Amount", "Status", "Actions"].map(h => (
                        <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.length > 0 ? orders.map((order, i) => (
                      <tr key={`${order.order_id || order.id}-${i}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700">#{order.order_id || order.id}</td>
                        <td className="px-4 py-3 text-gray-600">{order.product_name || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600">{order.customer_name || order.customer || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600">{order.seller_name || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600">{order.quantity || 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-700">RM {order.total_amount || order.amount || 0}</td>
                        <td className="px-4 py-3"><Badge color="blue">{order.order_status || order.status || 'Pending'}</Badge></td>
                        <td className="px-4 py-3">
                          <button className="px-2.5 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Details</button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-400">No orders found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WEBSITE SETTINGS */}
          {activeTab === "website-settings" && (
            <div className="max-w-2xl bg-white border border-gray-200 rounded-lg p-5">
              <p className="font-medium text-gray-700">Admin Login URL</p>
              <p className="text-xs text-gray-500 mt-1">
                Set a custom path after <span className="font-semibold">/login/</span> for the separate admin login page.
              </p>

              <form onSubmit={handleWebsiteSettingsSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Custom URL slug</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-xs text-gray-500 rounded-l">/login/</span>
                    <input
                      type="text"
                      className={inputCls + " rounded-l-none"}
                      value={websiteSettingsForm.data.admin_login_slug}
                      onChange={e => websiteSettingsForm.setData('admin_login_slug', e.target.value)}
                      placeholder="admin"
                      required
                    />
                  </div>
                  {websiteSettingsForm.errors.admin_login_slug && (
                    <p className="text-xs text-red-500 mt-1">{websiteSettingsForm.errors.admin_login_slug}</p>
                  )}
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-3 py-2 break-all">
                  Active admin login path: {adminLoginPath}
                </div>

                <button type="submit" disabled={websiteSettingsForm.processing} className={btnPrimary}>
                  {websiteSettingsForm.processing ? 'Saving...' : 'Save Website Settings'}
                </button>
              </form>
            </div>
          )}

          {/* CATEGORIES */}
          {activeTab === "category" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-700 mb-3">Add Category</p>

                <div className="flex border border-gray-200 rounded overflow-hidden mb-4">
                  {["main", "sub", "subsub"].map((lvl, i) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setCategoryLevel(lvl);
                        if (lvl !== 'subsub') { setSelectedSubCategory(''); subSubCategory.reset(); }
                        if (lvl === 'main') { setSelectedMainCategory(''); category.reset(); subCategory.reset(); }
                      }}
                      className={`flex-1 py-1.5 text-xs font-medium transition-colors ${categoryLevel === lvl ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {["Main", "Sub", "Sub-Sub"][i]}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCatSubmit} className="space-y-3">
                  {categoryLevel === 'main' && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Category Name *</label>
                        <input type="text" className={inputCls} placeholder="e.g., Electronics" value={category.data.category} onChange={e => category.setData('category', e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Image (Optional)</label>
                        <input type="file" className={inputCls} accept="image/*" onChange={e => category.setData('image', e.target.files[0])} />
                      </div>
                      <button type="submit" disabled={category.processing} className={btnPrimary + " w-full"}>{category.processing ? 'Adding...' : 'Add Main Category'}</button>
                    </>
                  )}

                  {categoryLevel === 'sub' && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Main Category *</label>
                        <select className={inputCls} value={subCategory.data.category_id} onChange={e => { subCategory.setData('category_id', e.target.value); setSelectedMainCategory(e.target.value); }} required>
                          <option value="">-- Select --</option>
                          {props.categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Sub Category Name *</label>
                        <input type="text" className={inputCls} placeholder="e.g., Smartphones" value={subCategory.data.name} onChange={e => subCategory.setData('name', e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Image (Optional)</label>
                        <input type="file" className={inputCls} accept="image/*" onChange={e => subCategory.setData('image', e.target.files[0])} />
                      </div>
                      <button type="submit" disabled={subCategory.processing || !subCategory.data.category_id} className={btnPrimary + " w-full"}>{subCategory.processing ? 'Adding...' : 'Add Sub Category'}</button>
                    </>
                  )}

                  {categoryLevel === 'subsub' && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Main Category *</label>
                        <select className={inputCls} value={selectedMainCategory} onChange={e => { setSelectedMainCategory(e.target.value); setSelectedSubCategory(''); subSubCategory.setData('subcategory_id', ''); }} required>
                          <option value="">-- Select --</option>
                          {props.categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Sub Category *</label>
                        <select className={inputCls + " disabled:bg-gray-50"} value={subSubCategory.data.subcategory_id} onChange={e => { subSubCategory.setData('subcategory_id', e.target.value); setSelectedSubCategory(e.target.value); }} disabled={!selectedMainCategory} required>
                          <option value="">-- Select --</option>
                          {selectedMainCategory && props.subcategories?.filter(s => s.category_id == selectedMainCategory).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Name *</label>
                        <input type="text" className={inputCls} placeholder="e.g., iPhone" value={subSubCategory.data.name} onChange={e => subSubCategory.setData('name', e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Image (Optional)</label>
                        <input type="file" className={inputCls} accept="image/*" onChange={e => subSubCategory.setData('image', e.target.files[0])} />
                      </div>
                      <button type="submit" disabled={subSubCategory.processing || !subSubCategory.data.subcategory_id} className={btnPrimary + " w-full"}>{subSubCategory.processing ? 'Adding...' : 'Add Sub-Sub Category'}</button>
                    </>
                  )}
                </form>
              </div>

              <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-700">All Categories ({props.categories?.length || 0})</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 uppercase text-left">
                        {["Name", "Type", "Actions"].map(h => (
                          <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {props.categories?.map((item, i) => (
                        <React.Fragment key={`main-${i}`}>
                          <tr className="bg-gray-50 border-t border-gray-100">
                            <td className="px-4 py-2.5 font-semibold text-gray-800">{item.category}</td>
                            <td className="px-4 py-2.5"><Badge color="blue">Main</Badge></td>
                            <td className="px-4 py-2.5">
                              <div className="flex gap-1">
                                <button onClick={() => openEditCategoryModal(item, 'main')} className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Edit</button>
                                <button onClick={() => openDeleteCategoryModal(item, 'main')} className="px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Del</button>
                              </div>
                            </td>
                          </tr>
                          {props.subcategories?.filter(s => s.category_id === item.id).map((subcat, si) => (
                            <React.Fragment key={`sub-${si}`}>
                              <tr className="border-t border-gray-50 hover:bg-gray-50">
                                <td className="px-4 py-2 pl-8 text-gray-600">↳ {subcat.name}</td>
                                <td className="px-4 py-2"><Badge color="green">Sub</Badge></td>
                                <td className="px-4 py-2">
                                  <div className="flex gap-1">
                                    <button onClick={() => openEditCategoryModal(subcat, 'sub')} className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Edit</button>
                                    <button onClick={() => openDeleteCategoryModal(subcat, 'sub')} className="px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Del</button>
                                  </div>
                                </td>
                              </tr>
                              {props.subSubcategories?.filter(ss => ss.subcategory_id === subcat.id).map((ss, ssi) => (
                                <tr key={`subsub-${ssi}`} className="border-t border-gray-50 hover:bg-gray-50">
                                  <td className="px-4 py-2 pl-14 text-gray-400">↳ {ss.name}</td>
                                  <td className="px-4 py-2"><Badge color="yellow">Sub-Sub</Badge></td>
                                  <td className="px-4 py-2">
                                    <div className="flex gap-1">
                                      <button onClick={() => openEditCategoryModal(ss, 'subsub')} className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Edit</button>
                                      <button onClick={() => openDeleteCategoryModal(ss, 'subsub')} className="px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Del</button>
                                    </div>
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

          {/* REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-3">
              {reports.length > 0 ? reports.map(report => (
                <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge color={report.type === 'Product' ? 'blue' : 'yellow'}>{report.type} Report</Badge>
                      <span className="text-xs text-gray-400">{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-700 mb-1">{report.description}</p>
                    <p className="text-xs text-gray-400">By: <span className="text-gray-600">{report.reported_by}</span></p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="px-2.5 py-1 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">View</button>
                    <button className="px-2.5 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors">Resolve</button>
                    <button className="px-2.5 py-1 text-xs rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Dismiss</button>
                  </div>
                </div>
              )) : (
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-8 text-center text-gray-400 text-xs">No reports found</div>
              )}
            </div>
          )}

          {/* LOGS */}
          {activeTab === "logs" && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-700">Audit Trail</p>
                <div className="flex gap-1">
                  {["Today", "Week", "Month"].map(f => (
                    <button key={f} className="px-2.5 py-1 text-xs rounded border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors">{f}</button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {logs.length > 0 ? logs.map(log => (
                  <div key={log.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                    <p className="flex-1 text-xs text-gray-700">{log.action}</p>
                    <span className="text-xs text-gray-400">{log.admin}</span>
                    <span className="text-xs text-gray-300">{log.timestamp}</span>
                  </div>
                )) : (
                  <p className="px-4 py-8 text-center text-xs text-gray-400">No audit logs found</p>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODALS */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit User">
        <form onSubmit={handleEditSubmit} className="space-y-3">
          {[{ label: "Name", key: "name", type: "text" }, { label: "Email", key: "email", type: "email" }].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-gray-600 mb-1">{f.label}</label>
              <input type={f.type} className={inputCls} value={editForm.data[f.key]} onChange={e => editForm.setData(f.key, e.target.value)} required />
              {editForm.errors[f.key] && <p className="text-xs text-red-500 mt-1">{editForm.errors[f.key]}</p>}
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Role</label>
            <select className={inputCls} value={editForm.data.role} onChange={e => editForm.setData('role', e.target.value)}>
              <option value="Seller">Seller</option>
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {[{ label: "New Password (optional)", key: "password", ph: "Leave blank to keep current" }, { label: "Confirm Password", key: "password_confirmation", ph: "Re-enter password" }].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-gray-600 mb-1">{f.label}</label>
              <input type="password" className={inputCls} value={editForm.data[f.key]} onChange={e => editForm.setData(f.key, e.target.value)} placeholder={f.ph} />
            </div>
          ))}
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setEditModalOpen(false)} className={btnSecondary}>Cancel</button>
            <button type="submit" disabled={editForm.processing} className={btnPrimary}>{editForm.processing ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={editCategoryModalOpen} onClose={() => setEditCategoryModalOpen(false)} title="Edit Category">
        <form onSubmit={handleCategoryEditSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Type</label>
            <input type="text" className={inputCls + " bg-gray-50 text-gray-400"} value={editCategoryForm.data.level === 'main' ? 'Main' : editCategoryForm.data.level === 'sub' ? 'Sub' : 'Sub-Sub'} disabled />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Name</label>
            <input type="text" className={inputCls} value={editCategoryForm.data.name} onChange={e => editCategoryForm.setData('name', e.target.value)} required />
            {editCategoryForm.errors.name && <p className="text-xs text-red-500 mt-1">{editCategoryForm.errors.name}</p>}
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setEditCategoryModalOpen(false)} className={btnSecondary}>Cancel</button>
            <button type="submit" disabled={editCategoryForm.processing} className={btnPrimary}>{editCategoryForm.processing ? 'Updating...' : 'Update'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={deleteCategoryModalOpen} onClose={() => setDeleteCategoryModalOpen(false)} title="Delete Category">
        <form onSubmit={handleCategoryDeleteSubmit} className="space-y-3">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            <strong>Warning:</strong> Deleting this {deleteCategoryForm.data.level === 'main' ? 'main category' : deleteCategoryForm.data.level === 'sub' ? 'sub category' : 'sub-sub category'} will also remove all related products. This cannot be undone.
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setDeleteCategoryModalOpen(false)} className={btnSecondary}>Cancel</button>
            <button type="submit" disabled={deleteCategoryForm.processing} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors">{deleteCategoryForm.processing ? 'Deleting...' : 'Delete'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;