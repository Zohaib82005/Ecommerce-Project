import React, { useState, useEffect } from 'react';
import '../css/editProduct.css';
import { usePage } from '@inertiajs/react';

// Mock Data based on your previous CSV request
const MOCK_CATEGORIES = [
  { id: 1, category: 'Electronics' },
  { id: 2, category: 'Clothing' },
  { id: 3, category: 'Home & Kitchen' },
  { id: 4, category: 'Books' },
  { id: 5, category: 'Sports & Outdoors' },
];

const INITIAL_PRODUCT = {
  id: 1,
  name: 'Wireless Headphones',
  price: 59.99,
  status: 'active',
  instock: 10,
  description: 'High quality noise cancelling headphones.',
  image: null,
  added_by: 1,
  category_id: 1,
  created_at: '2023-02-01 10:00:00',
  updated_at: '2023-02-01 10:00:00',
};

const EditProduct = () => {

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const props = usePage().props;
  console.log('Props from Inertia:', props);
    const [product, setProduct] = useState(props.product || INITIAL_PRODUCT);
  const [categories, setCategories] = useState(props.categories || MOCK_CATEGORIES);
//   setProduct(props.product);
//   setCategories(props.categories);
  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setProduct((prev) => ({
        ...prev,
        [name]: e.target.files[0],
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    // Simulate API Call
    setTimeout(() => {
      console.log('Updated Product Data:', product);
      setLoading(false);
      setSuccessMsg('Product updated successfully!');
      
      // Update the updated_at timestamp locally for demonstration
      setProduct((prev) => ({
        ...prev,
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }));
    }, 1000);
  };

  return (
    <div className="edit-product-page">
      <div className="container py-4 py-lg-5">
        
        {/* Header */}
        <div className="edit-header mb-4">
          <div className="header-content">
            <h1 className="page-title">
              <i className="bi bi-pencil-square me-3"></i>
              Edit Product
            </h1>
            <p className="page-subtitle">
              Update product details and category information below.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="edit-product-card">
          <form onSubmit={handleSubmit}>
            
            {/* Success Message */}
            {successMsg && (
              <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                <strong>Success!</strong> {successMsg}
              </div>
            )}

            <div className="row g-4">

              {/* ID (Read Only) */}
              <div className="col-md-6">
                <label className="form-label">Product ID</label>
                <input
                  type="text"
                  name="id"
                  value={product.id}
                  disabled
                  className="form-control bg-light"
                />
              </div>

              {/* Added By (Read Only) */}
              <div className="col-md-6">
                <label className="form-label">Added By (User ID)</label>
                <input
                  type="text"
                  name="added_by"
                  value={product.added_by}
                  disabled
                  className="form-control bg-light"
                />
              </div>

              {/* Product Name */}
              <div className="col-12">
                <label htmlFor="name" className="form-label">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={product.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div className="col-md-6">
                <label htmlFor="price" className="form-label">
                  Price ($) *
                </label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    required
                    value={product.price}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* In Stock (Number) */}
              <div className="col-md-6">
                <label htmlFor="instock" className="form-label">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="instock"
                  id="instock"
                  required
                  min="0"
                  value={product.instock}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter stock quantity"
                />
              </div>

              

              {/* Category */}
              <div className="col-md-6">
                <label htmlFor="category_id" className="form-label">
                  Category *
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={product.category_id}
                  onChange={handleChange}
                  className="form-select"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Image */}
              <div className="col-12">
                <label htmlFor="image" className="form-label">
                  Product Image *
                </label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="file-input"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <label htmlFor="image" className="file-label">
                    <i className="bi bi-cloud-upload"></i>
                    <span>Click to upload or drag and drop</span>
                    <small>PNG, JPG, GIF up to 10MB</small>
                  </label>
                  {product.image && (
                    <div className="file-preview">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span>
                        {typeof product.image === 'object' 
                          ? product.image.name 
                          : 'Image selected'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="col-12">
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={product.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter product description"
                  required
                />
              </div>

              {/* Created At (Read Only) */}
              <div className="col-md-6">
                <label className="form-label">Created At</label>
                <input
                  type="text"
                  name="created_at"
                  value={product.created_at}
                  disabled
                  className="form-control bg-light"
                />
              </div>

              {/* Updated At (Read Only) */}
              <div className="col-md-6">
                <label className="form-label">Last Updated</label>
                <input
                  type="text"
                  name="updated_at"
                  value={product.updated_at}
                  disabled
                  className="form-control bg-light"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions mt-5">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg"
              >
                <i className="bi bi-x-lg me-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary btn-lg ${loading ? 'disabled' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;