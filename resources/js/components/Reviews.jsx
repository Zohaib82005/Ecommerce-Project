import React from "react";

const reviews = [
  {
    name: "Sarah Khan",
    rating: 5,
    text: "Amazing service! Fast delivery and great quality products. Highly recommended!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Ali Raza",
    rating: 4,
    text: "The products are excellent and the support team is very responsive.",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    name: "Hina Malik",
    rating: 5,
    text: "I love the deals and the website is super easy to navigate.",
    image: "https://randomuser.me/api/portraits/women/48.jpg",
  },
  {
    name: "Omar Farooq",
    rating: 4,
    text: "Great experience overall. Will definitely shop again.",
    image: "https://randomuser.me/api/portraits/men/49.jpg",
  },
];

const Reviews = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">

        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">What Our Customers Say</h2>
          <p className="text-muted">
            Real reviews from real people
          </p>
        </div>

        {/* Reviews */}
        <div className="row g-4">
          {reviews.map((review, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={index}>
              <div className="card border-0 shadow-sm h-100 text-center review-card p-3">

                {/* User */}
                <img
                  src={review.image}
                  alt={review.name}
                  className="rounded-circle mb-3"
                  width="80"
                  height="80"
                  loading="lazy"
                />

                {/* Name */}
                <h6 className="fw-semibold">{review.name}</h6>

                {/* Rating */}
                <div className="text-warning mb-2" aria-hidden="true">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <i key={i} className="bi bi-star-fill"></i>
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, i) => (
                    <i key={i} className="bi bi-star"></i>
                  ))}
                </div>
                <div className="visually-hidden">{review.rating} out of 5 stars</div>

                {/* Text */}
                <p className="text-muted small">{review.text}</p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
