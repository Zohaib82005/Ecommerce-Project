import React from "react";
import "../css/ordersuccess.css";
import { Link } from "@inertiajs/react";

const OrderSuccess = () => {
  return (
    <div className="success-page">
      <div className="container text-center">

        {/* Truck Animation */}
        <div className="road">
          <div className="truck">
            <div className="truck-body">
              <div className="truck-cabin"></div>
              <div className="truck-back"></div>
            </div>

            {/* Wheels */}
            <div className="wheel wheel-front"></div>
            <div className="wheel wheel-back"></div>

            {/* Smoke */}
            <span className="smoke smoke-1"></span>
            <span className="smoke smoke-2"></span>
            <span className="smoke smoke-3"></span>
          </div>
        </div>

        {/* Text Content */}
        <div className="success-content">
          <h2 className="fw-bold mt-4">Thank You for Your Order 🎉</h2>
          <p className="text-muted">
            Your order has been confirmed and is on the way to your home.
          </p>

          <div className="order-box">
            <p><strong>Order ID:</strong> #CB-102349</p>
            <p><strong>Estimated Delivery:</strong> 2-3 Business Days</p>
          </div>

          <Link href="/products" className="btn btn-primary mt-3">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
