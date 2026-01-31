import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5">
      <div className="container">

        <div className="row g-4">

          {/* About / Logo */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold text-primary">CoreBuy</h5>
            <p className="text-white">
              Your one-stop online store for electronics, fashion, home essentials, books, and more.
            </p>
            <p className="text-white small mb-0">&copy; 2026 CoreBuy. All rights reserved.</p>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2" aria-label="Quick links">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled text-muted">
              <li><a href="/" className="text-decoration-none text-white">Home</a></li>
              <li><a href="/" className="text-decoration-none text-white">Shop</a></li>
              <li><a href="/" className="text-decoration-none text-white">Deals</a></li>
              <li><a href="/" className="text-decoration-none text-white">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-6 col-md-2" aria-label="Support links">
            <h6 className="fw-semibold">Support</h6>
            <ul className="list-unstyled ">
              <li><a href="/" className="text-decoration-none text-white">FAQs</a></li>
              <li><a href="/" className="text-decoration-none text-white">Shipping</a></li>
              <li><a href="/" className="text-decoration-none text-white">Returns</a></li>
              <li><a href="/" className="text-decoration-none text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social & Payments */}
          <div className="col-12 col-md-4">
            <h6 className="fw-semibold">Follow Us</h6>
            <div className="d-flex gap-3 mb-3">
              <a href="/" className="text-white fs-5" aria-label="Follow us on Facebook"><i className="bi bi-facebook" aria-hidden="true"></i></a>
              <a href="/" className="text-white fs-5" aria-label="Follow us on Twitter"><i className="bi bi-twitter" aria-hidden="true"></i></a>
              <a href="/" className="text-white fs-5" aria-label="Follow us on Instagram"><i className="bi bi-instagram" aria-hidden="true"></i></a>
              <a href="/" className="text-white fs-5" aria-label="Follow us on YouTube"><i className="bi bi-youtube" aria-hidden="true"></i></a>
            </div>
            <h6 className="fw-semibold">We Accept</h6>
            <div className="d-flex gap-2 mt-2" aria-label="Accepted payment methods">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" width="50" loading="lazy"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Mastercard_Logo.svg" alt="Mastercard" width="50" loading="lazy"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width="50" loading="lazy"/>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
