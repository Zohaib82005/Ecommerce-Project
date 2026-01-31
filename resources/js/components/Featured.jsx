import React from "react";

const products = [
  {
    name: "Wireless Headphones",
    price: "$79",
    image: "https://images.unsplash.com/photo-1585386959984-a41552231693",
  },
  {
    name: "Smart Watch",
    price: "$129",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
  },
  {
    name: "Running Shoes",
    price: "$99",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
  },
  {
    name: "Modern Chair",
    price: "$149",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657",
  },
];

const Featured = () => {
  return (
    <section className="py-5">
      <div className="container">

        {/* Title */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Featured Products</h2>
            <p className="text-muted mb-0">
              Handpicked items just for you
            </p>
          </div>
          <button className="btn btn-outline-primary btn-sm">
            View All
          </button>
        </div>

        {/* Products */}
        <div className="row g-4" role="list">
          {products.map((product, index) => (
            <div className="col-12 col-sm-6 col-lg-3" key={index} role="listitem">
              <div className="card h-100 border-0 shadow-sm product-card">

                {/* Image */}
                <figure className="mb-0">
                  <img
                    src={product.image}
                    className="rounded w-100"
                    alt={product.name}
                    style={{ height : "200px", objectFit: "cover"}}
                    loading="lazy"
                  />
                </figure>

                {/* Body */}
                <div className="card-body">
                  <h6 className="fw-semibold">{product.name}</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">
                      {product.price}
                    </span>
                    <button type="button" aria-label={`Add ${product.name} to cart`} className="btn btn-sm btn-primary">
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Featured;
