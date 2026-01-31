import React from "react";

const categories = [
  {
    title: "Home & Living",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
 
  {
    title: "Home & Living",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    title: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    title: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
];

const Category = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">

        {/* Section Title */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">Shop by Category</h2>
          <p className="text-muted">
            Find what you’re looking for in one click
          </p>
        </div>

        {/* Categories */}
        <div className="row g-4" role="list">
          {categories.map((cat, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={index} role="listitem">
              <div className="card border-0 shadow-sm h-100 category-card">
                <figure className="mb-0">
                  <img
                    src={cat.image}
                    className="card-img-top"
                    alt={cat.title}
                    loading="lazy"
                  />
                </figure>
                <div className="card-body text-center">
                  <h5 className="card-title fw-semibold">{cat.title}</h5>
                  <button type="button" aria-label={`Explore ${cat.title} category`} className="btn btn-outline-primary btn-sm mt-2">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Category;
