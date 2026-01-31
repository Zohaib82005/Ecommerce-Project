import { Link } from "@inertiajs/react";
import React from "react";

const Carousel = () => {
  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">

      {/* Indicators */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
      </div>

      {/* Slides */}
      <div className="carousel-inner">

        <div className="carousel-item active" style={{height: "100vh"}}>
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            className="d-block w-100 img-fluid"
            alt="Electronics"
          />
          <div className="carousel-caption d-none d-md-block">
            <h2 className="fw-bold text-primary">Latest Electronics</h2>
            <p>Upgrade your lifestyle with modern gadgets</p>
            <Link href="/products" className="btn btn-primary">Shop Now</Link>
          </div>
        </div>

        <div className="carousel-item" style={{height: "100vh"}}>
          <img
            src="https://images.unsplash.com/photo-1491553895911-0055eca6402d"
            className="d-block w-100 img-fluid"
            alt="Fashion"
          />
          <div className="carousel-caption d-none d-md-block">
            <h2 className="fw-bold text-primary">Trending Fashion</h2>
            <p className="text-primary">Style that speaks confidence</p>
            <button className="btn btn-primary">Explore</button>
          </div>
        </div>

        <div className="carousel-item" style={{height: "100vh"}}>
          <img
            src="https://images.unsplash.com/photo-1503602642458-232111445657"
            className="d-block img-fluid w-100"
            alt="Home"
          />
          <div className="carousel-caption d-none d-md-block">
            <h2 className="fw-bold">Home Essentials</h2>
            <p>Comfort meets elegance</p>
            <button className="btn btn-primary">Discover</button>
          </div>
        </div>

      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>

    </div>
  );
};

export default Carousel;
