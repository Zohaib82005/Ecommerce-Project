import React, { useEffect, useState } from "react";

const dealEndTime = new Date().getTime() + 6 * 60 * 60 * 1000; // 6 hours from now

const Deals = () => {
  const [timeLeft, setTimeLeft] = useState(dealEndTime - new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(dealEndTime - new Date().getTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <section className="py-5 bg-dark text-white">
      <div className="container">

        {/* Header */}
        <div className="row align-items-center mb-4">
          <div className="col-md-6">
            <h2 className="fw-bold">Deals of the Day</h2>
            <p className="text-light mb-0">
              Hurry up! Limited time offers
            </p>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <span className="fs-5 fw-semibold" aria-live="polite" aria-atomic="true">
              Ends in: <span className="text-warning" id="deals-countdown">{formatTime(timeLeft)}</span>
            </span>
          </div>
        </div>

        {/* Deals */}
        <div className="row g-4">

          {/* Deal Item */}
          <div className="col-12 col-md-6 col-lg-3" role="listitem">
            <div className="card border-0 h-100 deal-card">
              <img
                src="https://images.unsplash.com/photo-1585386959984-a41552231693"
                style={{height: "200px"}}
                className="card-img-top"
                alt="Wireless Headphones"
                loading="lazy"
              />
              <div className="card-body">
                <h6 className="fw-semibold">Wireless Headphones</h6>
                <p className="mb-1">
                  <span className="text-decoration-line-through text-muted me-2">
                    $129
                  </span>
                  <span className="fw-bold text-danger">$79</span>
                </p>
                <button type="button" aria-label="Grab deal for Wireless Headphones" className="btn btn-sm btn-danger w-100">
                  Grab Deal
                </button>
              </div>
            </div>
          </div>

          {/* Repeat Items */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 h-100 deal-card">
              <img
                src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b"
                className="card-img-top"
                style={{height: "200px"}}
                alt="Smart Watch"
                loading="lazy"
              />
              <div className="card-body">
                <h6 className="fw-semibold">Smart Watch</h6>
                <p className="mb-1">
                  <span className="text-decoration-line-through text-muted me-2">
                    $199
                  </span>
                  <span className="fw-bold text-danger">$129</span>
                </p>
                <button type="button" aria-label="Grab deal for Smart Watch" className="btn btn-sm btn-danger w-100">
                  Grab Deal
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 h-100 deal-card">
              <img
                src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"
                className="card-img-top"
                style={{height: "200px"}}
                alt="Running Shoes"
                loading="lazy"
              />
              <div className="card-body">
                <h6 className="fw-semibold">Running Shoes</h6>
                <p className="mb-1">
                  <span className="text-decoration-line-through text-muted me-2">
                    $149
                  </span>
                  <span className="fw-bold text-danger">$99</span>
                </p>
                <button type="button" aria-label="Grab deal for Running Shoes" className="btn btn-sm btn-danger w-100">
                  Grab Deal
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 h-100 deal-card">
              <img
                src="https://images.unsplash.com/photo-1503602642458-232111445657"
                className="card-img-top"
                style={{height: "200px"}}
                alt="Modern Chair"
                loading="lazy"
              />
              <div className="card-body">
                <h6 className="fw-semibold">Modern Chair</h6>
                <p className="mb-1">
                  <span className="text-decoration-line-through text-muted me-2">
                    $249
                  </span>
                  <span className="fw-bold text-danger">$149</span>
                </p>
                <button type="button" aria-label="Grab deal for Modern Chair" className="btn btn-sm btn-danger w-100">
                  Grab Deal
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Deals;
