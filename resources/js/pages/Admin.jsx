import React, { useState } from "react";
import "../css/admin.css";
import { useForm, usePage } from "@inertiajs/react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const props = usePage().props;
  const category = useForm({
    category: ''
  });
  function handleCatSubmit(e) {
    e.preventDefault()
    category.post('/addcate');
  }

  // props.categories[0].category;
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h3 className="logo">CoreBuy</h3>
        <span className="role">ADMIN PANEL</span>

        <ul>
          <li className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>Dashboard</li>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>User Verification</li>
          <li className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>Product Review</li>
          <li className={activeTab === "category" ? "active" : ""} onClick={() => setActiveTab("category")}>Manage Categories</li>
          <li className={activeTab === "sellers" ? "active" : ""} onClick={() => setActiveTab("sellers")}>Seller Control</li>
          <li className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Order Oversight</li>
          <li className={activeTab === "reports" ? "active" : ""} onClick={() => setActiveTab("reports")}>Reports</li>
          <li className={activeTab === "logs" ? "active" : ""} onClick={() => setActiveTab("logs")}>Audit Logs</li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="admin-main">

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h4>Admin Control Panel</h4>
            <p className="muted">Moderate & verify platform activity</p>
          </div>
          <span className="status">🛡 Active Admin</span>
        </div>

        {/* CONTENT */}
        <div className="admin-content">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="f stats-grid">
              <div className="stat-card"><p>Pending Users</p><h3>12</h3></div>
              <div className="stat-card"><p>Pending Products</p><h3>28</h3></div>
              <div className="stat-card"><p>Reported Orders</p><h3>6</h3></div>
              <div className="stat-card"><p>Flagged Sellers</p><h3>2</h3></div>
            </div>
          )}

          {activeTab === "category" && (
            <div className="f">
              <form onSubmit={handleCatSubmit}>

                <input type="text" onChange={(e) => { category.setData('category', e.target.value) }} placeholder="Write category name" className="form-control rounded border" />
                <button className="btn btn-primary text-white my-2" type="submit">Add</button>
              </form>

              <h2>All Categories</h2>
              { }
              <table className="table border">
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Id</td>
                  </tr>
                </thead>
                <tbody>
                  {props.categories.map((item, index) => (
                     <tr key={index}>
                        <td>{item.category}</td>
                        <td>{item.id}</td>
                     </tr>
                    // <div key={index}>

                    //   {item.category}
                    // </div>
                  ))}
                 
                </tbody>
              </table>
            </div>
          )}

          {/* USER VERIFICATION */}
          {activeTab === "users" && (
            <div className="f panel">
              <div className="row head">
                <span>User</span><span>Status</span><span>Action</span>
              </div>
              <div className="row">
                <span>Zohaib A.</span>
                <span className="pending">Pending</span>
                <span>
                  <button className="approve">Approve</button>
                  <button className="reject">Reject</button>
                </span>
              </div>
            </div>
          )}

          {/* PRODUCT REVIEW */}
          {activeTab === "products" && (
            <div className="f panel">
              <div className="row head">
                <span>Product</span><span>Seller</span><span>Compliance</span>
              </div>
              <div className="row">
                <span>Wireless Camera</span>
                <span>SellerX</span>
                <span>
                  <button className="approve">Approve</button>
                  <button className="reject">Reject</button>
                </span>
              </div>
            </div>
          )}

          {/* SELLERS */}
          {activeTab === "sellers" && (
            <div className="f panel">
              <div className="row">
                <span>SellerTech</span>
                <button className="warning">Freeze Seller</button>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="f panel">
              <div className="row">
                <span>#CB10291</span>
                <span className="flagged">Dispute Raised</span>
                <button>Escalate</button>
              </div>
            </div>
          )}

          {/* REPORTS */}
          {activeTab === "reports" && (
            <div className="f panel">
              <p>📌 Product reported for policy violation</p>
              <p>📌 Seller misuse reported</p>
            </div>
          )}

          {/* LOGS */}
          {activeTab === "logs" && (
            <div className="f panel logs">
              <p>Admin approved user ID 1281</p>
              <p>Admin rejected product ID 991</p>
              <p>Seller temporarily frozen</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Admin;
