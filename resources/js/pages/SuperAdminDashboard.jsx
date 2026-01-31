import React from "react";
import "../css/superAdminDashboard.css";

const SuperAdminDashboard = () => {
  return (
    <div className="super-layout">

      {/* SIDEBAR */}
      <aside className="super-sidebar">
        <h2>CoreBuy</h2>
        <span className="role">SUPER ADMIN</span>

        <ul>
          <li className="active">System Overview</li>
          <li>Users</li>
          <li>Admins</li>
          <li>Products</li>
          <li>Orders</li>
          <li>Payments</li>
          <li>CMS Pages</li>
          <li>Analytics</li>
          <li>Security Logs</li>
          <li className="danger">Danger Zone</li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="super-main">

        {/* TOP BAR */}
        <div className="super-topbar">
          <div>
            <h4>System Control Panel</h4>
            <p>Full access to CoreBuy ecosystem</p>
          </div>

          <button className="impersonate-btn">
            Login as Any User
          </button>
        </div>

        {/* SYSTEM STATS */}
        <div className="system-stats">
          <div className="sys-card">
            <p>Total Users</p>
            <h3>124,921</h3>
          </div>
          <div className="sys-card">
            <p>Active Orders</p>
            <h3>2,318</h3>
          </div>
          <div className="sys-card">
            <p>Revenue (Monthly)</p>
            <h3>$842,120</h3>
          </div>
          <div className="sys-card">
            <p>System Status</p>
            <h3 className="healthy">Healthy</h3>
          </div>
        </div>

        {/* CONTROL PANELS */}
        <div className="control-grid">

          <section className="panel">
            <h5>User Control</h5>
            <button>View All Users</button>
            <button>Ban User</button>
            <button>Reset Password</button>
          </section>

          <section className="panel">
            <h5>Product Control</h5>
            <button>Add Product</button>
            <button>Disable Product</button>
            <button>Force Price Update</button>
          </section>

          <section className="panel">
            <h5>Order Control</h5>
            <button>Force Cancel Order</button>
            <button>Override Status</button>
            <button>Refund Any Order</button>
          </section>

          <section className="panel">
            <h5>Website Control</h5>
            <button>Enable Maintenance Mode</button>
            <button>Clear Cache</button>
            <button>Rebuild Search Index</button>
          </section>

        </div>

        {/* ACTIVITY LOG */}
        <section className="panel full">
          <h5>System Activity Logs</h5>
          <ul className="logs">
            <li>Admin #12 disabled product ID 8821</li>
            <li>Payment gateway sync completed</li>
            <li>User ID 129991 refunded manually</li>
            <li>Security scan passed</li>
          </ul>
        </section>

        {/* DANGER ZONE */}
        <section className="panel danger-zone">
          <h5>⚠️ Danger Zone</h5>
          <p>These actions affect the entire platform.</p>
          <button className="danger-btn">Shutdown Website</button>
          <button className="danger-btn outline">Delete All Orders</button>
        </section>

      </main>
    </div>
  );
};

export default SuperAdminDashboard;
