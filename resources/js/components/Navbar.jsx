import { Link } from "@inertiajs/react";
import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top" aria-label="Main navigation">
      <a className="visually-hidden-focusable" href="#main-content">Skip to content</a>
      <div className="container">

        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-4 text-primary" href="/">
          CoreBuy
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapsed navbar-collapse" id="navbarContent">

          {/* Categories */}
          <ul className="navbar-nav me-3">
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle fw-semibold btn btn-link"
                data-bs-toggle="dropdown"
                type="button"
              >
                Categories
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/">Electronics</a></li>
                <li><a className="dropdown-item" href="/">Fashion</a></li>
                <li><a className="dropdown-item" href="/">Home & Living</a></li>
                <li><a className="dropdown-item" href="/">Books</a></li>
              </ul>
            </li>
          </ul>

          {/* Search Bar */}
          <form
            className="d-flex flex-grow-1 me-3"
            onSubmit={(e) => e.preventDefault()}
            role="search"
            aria-label="Site search"
          >
            <label className="visually-hidden">Search</label>
            <input
              className="form-control"
              type="search"
              placeholder="What are you looking for?"
              aria-label="Search products"
            />
            <button type="submit" className="btn btn-primary" aria-label="Search">
              <i className="bi bi-search" aria-hidden="true"></i>
            </button>
          </form>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-3">

            {/* Cart */}
            <a href="/cart" className="position-relative text-dark" aria-label="View cart">
              <i className="bi bi-cart3 fs-4" aria-hidden="true"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" aria-live="polite">
                2
              </span>
            </a>

            {/* Auth Buttons */}
            <Link href="/login" className="btn btn-outline-primary btn-sm">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Register
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
