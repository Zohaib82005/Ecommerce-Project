import React, { useState, useEffect } from 'react';
import '../css/editProduct.css';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';

const EditProduct = () => {
  const { product, categories, product_images } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [subcategories, setSubcategories] = useState([]);
  const [subSubcategories, setSubSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name: product.name || '',
    price: product.price || '',
    instock: product.instock || '',
    description: product.description || '',
    category_id: product.category_id || '',
    subcategory_id: product.subcategory_id || '',
    sub_subcategory_id: product.sub_subcategory_id || '',
    discount_price: product.discount_price || 0,
    discount_type: product.discount_type || 'percentage',
    image: null,
    image1: null,
    image2: null,
    image3: null,
  });

  const [previewImages, setPreviewImages] = useState({
    image: product.image ? `/storage/${product.image}` : null,
    image1: null,
    image2: null,
    image3: null,
  });

  // Fetch subcategories on category change
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setFormData(prev => ({
      ...prev,
      category_id: categoryId,
      subcategory_id: '',
      sub_subcategory_id: ''
    }));

    if (categoryId) {
      try {
        const response = await axios.get(`/api/categories/${categoryId}/subcategories`);
        setSubcategories(response.data);
        setSubSubcategories([]);
      } catch (error) {
        console.error('Failed to fetch subcategories', error);
      }
    } else {
      setSubcategories([]);
      setSubSubcategories([]);
    }
  };

  // Fetch sub-subcategories on subcategory change
  const handleSubcategoryChange = async (e) => {
    const subcategoryId = e.target.value;
    setFormData(prev => ({ ...prev, subcategory_id: subcategoryId, sub_subcategory_id: '' }));

    if (subcategoryId) {
      try {
        const response = await axios.get(`/api/subcategories/${subcategoryId}/sub-subcategories`);
        setSubSubcategories(response.data);
      } catch (error) {
        console.error('Failed to fetch sub-subcategories', error);
      }
    } else {
      setSubSubcategories([]);
    }
  };

  // Handle other input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages(prev => ({ ...prev, [name]: reader.result }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImages(prev => ({ ...prev, [name]: null }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });

    router.post(`/seller/updateProduct/${product.id}`, submitData, {
      forceFormData: true,
      onSuccess: () => {
        setLoading(false);
        setSuccessMsg('Product updated successfully!');
        setTimeout(() => router.visit('/seller'), 1500);
      },
      onError: (errors) => {
        setLoading(false);
        const errorMessages = Object.values(errors).join(' ');
        setErrorMsg(errorMessages || 'Failed to update product. Please check your input.');
        console.error('Errors:', errors);
      },
    });
  };

  const handleCancel = () => {
    router.visit('/seller');
  };

  const deleteImage = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      router.delete(`/product-images/${imageId}`, {
        onSuccess: () => {
          setSuccessMsg('Image deleted successfully!');
          router.reload({ only: ['product_images'] });
        },
        onError: (error) => {
          setErrorMsg('Failed to delete image');
        },
      });
    }
  };

  useEffect(() => {
    if (product.category_id) {
      axios.get(`/api/categories/${product.category_id}/subcategories`).then(res => setSubcategories(res.data));
    }
    if (product.subcategory_id) {
      axios.get(`/api/subcategories/${product.subcategory_id}/sub-subcategories`).then(res => setSubSubcategories(res.data));
    }
  }, [product]);

  return (
    <div className="edit-product-page">
      <div className="container py-4 py-lg-5">
        
        <div className="edit-header mb-4">
          <div className="header-content">
            <h1 className="page-title">
              <i className="bi bi-pencil-square me-3"></i>
              Edit Product
            </h1>
            <p className="page-subtitle">
              Update product details, images, and category information below.
            </p>
          </div>
        </div>

        <div className="edit-product-card">
          <form onSubmit={handleSubmit}>
            
            {successMsg && (
              <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                <strong>Success!</strong> {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <i className="bi bi-exclamation-circle me-2"></i>
                <strong>Error!</strong> {errorMsg}
              </div>
            )}

            <div className="row g-4">

              {/* Product Name */}
              <div className="col-12">
                <label htmlFor="name" className="form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price & Discount */}
              <div className="col-md-6">
                <label htmlFor="price" className="form-label">Price *</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="discount_price" className="form-label">Discount Price</label>
                <div className="input-group">
                  <input
                    type="number"
                    name="discount_price"
                    id="discount_price"
                    step="0.01"
                    min="0"
                    value={formData.discount_price}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="0.00"
                  />
                  <select name="discount_type" value={formData.discount_type} onChange={handleChange} className="form-select flex-grow-0 w-auto">
                    <option value="percentage">%</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
              </div>

              {/* Stock */}
              <div className="col-md-6">
                <label htmlFor="instock" className="form-label">Stock Quantity *</label>
                <input
                  type="number"
                  name="instock"
                  id="instock"
                  required
                  min="0"
                  value={formData.instock}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter stock quantity"
                />
              </div>

              {/* Categories */}
              <div className="col-md-6">
                <label htmlFor="category_id" className="form-label">Category *</label>
                <select id="category_id" name="category_id" value={formData.category_id} onChange={handleCategoryChange} className="form-select" required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.category}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="subcategory_id" className="form-label">Subcategory</label>
                <select id="subcategory_id" name="subcategory_id" value={formData.subcategory_id} onChange={handleSubcategoryChange} className="form-select">
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="sub_subcategory_id" className="form-label">Sub-Subcategory</label>
                <select id="sub_subcategory_id" name="sub_subcategory_id" value={formData.sub_subcategory_id} onChange={handleChange} className="form-select">
                  <option value="">Select Sub-Subcategory</option>
                  {subSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              {/* Image Uploads */}
              <div className="col-12">
                <label className="form-label">Product Images</label>
                <div className="row g-3">
                  {/* Main Image */}
                  <div className="col-md-4">
                    <div className="image-upload-box">
                      <input type="file" name="image" id="image" onChange={handleChange} accept="image/*" className="d-none" />
                      <label htmlFor="image" className="w-100">
                        {previewImages.image ? <img src={previewImages.image} alt="Main Preview" className="img-fluid" /> : <div className="upload-placeholder"><i className="bi bi-camera"></i><p>Main Image</p></div>}
                      </label>
                    </div>
                  </div>
                  {/* Extra Images */}
                  {[1, 2, 3].map(i => (
                    <div key={i} className="col-md-4">
                      <div className="image-upload-box">
                        <input type="file" name={`image${i}`} id={`image${i}`} onChange={handleChange} accept="image/*" className="d-none" />
                        <label htmlFor={`image${i}`} className="w-100">
                          {previewImages[`image${i}`] ? <img src={previewImages[`image${i}`]} alt={`Extra ${i} Preview`} className="img-fluid" /> : <div className="upload-placeholder"><i className="bi bi-plus-square"></i><p>Extra Image {i}</p></div>}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Previously Added Images */}
              {product_images && product_images.length > 0 && (
                <div className="col-12">
                  <label className="form-label">Previously Added Images</label>
                  <div className="row g-3">
                    {product_images.map((img) => (
                      <div key={img.id} className="col-md-3">
                        <div className="position-relative">
                          <img src={`/storage/${img.image}`} alt="Product" className="img-fluid rounded" />
                          <button type="button" onClick={() => deleteImage(img.id)} className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" title="Delete image">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="col-12">
                <label htmlFor="description" className="form-label">Description *</label>
                <textarea id="description" name="description" rows={5} value={formData.description} onChange={handleChange} className="form-control" placeholder="Enter product description" required />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions mt-5">
              <button type="button" onClick={handleCancel} className="btn btn-outline-secondary btn-lg">
                <i className="bi bi-x-lg me-2"></i>
                Cancel
              </button>
              <button type="submit" disabled={loading} className={`btn btn-primary btn-lg ${loading ? 'disabled' : ''}`}>
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