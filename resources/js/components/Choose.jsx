import React from "react";

const features = [
  {
    icon: "bi-truck",
    title: "Fast Delivery",
    description: "Quick and reliable delivery all across the country.",
  },
  {
    icon: "bi-shield-check",
    title: "Secure Payments",
    description: "Your payments are protected with top-level security.",
  },
  {
    icon: "bi-arrow-repeat",
    title: "Easy Returns",
    description: "Hassle-free returns within 7 days of purchase.",
  },
  {
    icon: "bi-headset",
    title: "24/7 Support",
    description: "Our support team is always here to help you.",
  },
];

const Choose = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">

        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose CoreBuy?</h2>
          <p className="text-muted">
            We provide the best service and trusted experience
          </p>
        </div>

        {/* Features */}
        <div className="row g-4">
          {features.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={index}>
              <div className="card border-0 shadow-sm h-100 text-center feature-card" role="article" aria-labelledby={`feature-${index}-title`} tabIndex="0">

                <div className="card-body">
                  <div className="icon-circle mb-3" aria-hidden="true">
                    <i className={`bi ${item.icon}`} aria-hidden="true"></i>
                  </div>
                  <h6 id={`feature-${index}-title`} className="fw-semibold">{item.title}</h6>
                  <p className="text-muted small mb-0">
                    {item.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Choose;
