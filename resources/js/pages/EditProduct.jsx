import React, { useState, useEffect } from 'react';
import '../css/editProduct.css';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';

const EditProduct = () => {
  const { product, categories, product_images, auth } = usePage().props;
  const isAdmin = auth?.user?.role === 'Admin';
  const updateEndpoint = isAdmin ? `/admin/updateProduct/${product.id}` : `/seller/updateProduct/${product.id}`;
  const backToDashboardPath = isAdmin ? '/admin' : '/seller';
  const [loading, setLoading]       = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg]     = useState('');
  const [subcategories, setSubcategories]       = useState([]);
  const [subSubcategories, setSubSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name:               product.name               || '',
    price:              product.price              || '',
    instock:            product.instock            || '',
    description:        product.description        || '',
    category_id:        product.category_id        || '',
    subcategory_id:     product.subcategory_id     || '',
    sub_subcategory_id: product.sub_subcategory_id || '',
    discount_price:     product.discount_price     || 0,
    discount_type:      product.discount_type      || 'percentage',
    image: null, image1: null, image2: null, image3: null,
  });

  const [previewImages, setPreviewImages] = useState({
    image:  product.image ? `/storage/${product.image}` : null,
    image1: null, image2: null, image3: null,
  });

  /* ── Handlers (all unchanged) ──────────────────────────── */
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setFormData(prev => ({ ...prev, category_id: categoryId, subcategory_id: '', sub_subcategory_id: '' }));
    if (categoryId) {
      try {
        const response = await axios.get(`/api/subcategories/${categoryId}`);
        setSubcategories(response.data);
        setSubSubcategories([]);
      } catch (error) { console.error('Failed to fetch subcategories', error); }
    } else { setSubcategories([]); setSubSubcategories([]); }
  };

  const handleSubcategoryChange = async (e) => {
    const subcategoryId = e.target.value;
    setFormData(prev => ({ ...prev, subcategory_id: subcategoryId, sub_subcategory_id: '' }));
    if (subcategoryId) {
      try {
        const response = await axios.get(`/api/sub-subcategories/${subcategoryId}`);
        setSubSubcategories(response.data);
      } catch (error) { console.error('Failed to fetch sub-subcategories', error); }
    } else { setSubSubcategories([]); }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImages(prev => ({ ...prev, [name]: reader.result }));
        reader.readAsDataURL(file);
      } else {
        setPreviewImages(prev => ({ ...prev, [name]: null }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(''); setSuccessMsg('');
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) submitData.append(key, formData[key]);
    });
    router.post(updateEndpoint, submitData, {
      forceFormData: true,
      onSuccess: () => {
        setLoading(false);
        setSuccessMsg('Product updated successfully!');
        setTimeout(() => router.visit(backToDashboardPath), 1500);
      },
      onError: (errors) => {
        setLoading(false);
        const errorMessages = Object.values(errors).join(' ');
        setErrorMsg(errorMessages || 'Failed to update product. Please check your input.');
        console.error('Errors:', errors);
      },
    });
  };

  const handleCancel = () => router.visit(backToDashboardPath);

  const deleteImage = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      router.delete(`/product-images/${imageId}`, {
        onSuccess: () => {
          setSuccessMsg('Image deleted successfully!');
          router.reload({ only: ['product_images'] });
        },
        onError: () => setErrorMsg('Failed to delete image'),
      });
    }
  };

  useEffect(() => {
    if (product.category_id)
      axios.get(`/api/subcategories/${product.category_id}`).then(res => setSubcategories(res.data));
    if (product.subcategory_id)
      axios.get(`/api/sub-subcategories/${product.subcategory_id}`).then(res => setSubSubcategories(res.data));
  }, [product]);

  /* ── SVG icons ─────────────────────────────────────────── */
  const icons = {
    back:     <svg width={13} height={13} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>,
    info:     <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    money:    <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    category: <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>,
    image:    <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    upload:   <svg width={28} height={28} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    trash:    <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
    x:        <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>,
    save:     <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>,
    check:    <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    alert:    <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    hint:     <svg width={13} height={13} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    box:      <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
  };

  /* ── Image upload slot ─────────────────────────────────── */
  const ImageSlot = ({ name, label, preview }) => (
    <div className="ep-img-slot">
      <input type="file" name={name} id={name} onChange={handleChange} accept="image/*" />
      <label htmlFor={name} className="ep-img-label">
        {preview ? (
          <>
            <img src={preview} alt={label} />
            <div className="ep-img-overlay"><span>Change Image</span></div>
          </>
        ) : (
          <div className="ep-img-placeholder">
            {icons.upload}
            <span>{label}</span>
            <small>Click to upload</small>
          </div>
        )}
      </label>
    </div>
  );

  /* ── Section card ──────────────────────────────────────── */
  const Section = ({ title, colorClass, icon, children }) => (
    <div className="ep-section">
      <div className="ep-section-header">
        <div className={`ep-section-icon ${colorClass}`}>{icon}</div>
        <span className="ep-section-title">{title}</span>
      </div>
      <div className="ep-section-body">{children}</div>
    </div>
  );

  /* ── Render ────────────────────────────────────────────── */
  return (
    <div className="edit-product-page">
      <div className="ep-container">

        {/* Header */}
        <div className="ep-header">
          <div className="ep-breadcrumb">
            <button onClick={handleCancel}>{icons.back} Dashboard</button>
            <span>/</span>
            <span className="ep-breadcrumb-active">Edit Product</span>
          </div>
          <div className="ep-title-row">
            <div>
              <h1 className="ep-title">
                Edit Product
                <span className="ep-id-badge">#{product.id}</span>
              </h1>
              <p className="ep-subtitle">Update product details, images, and category information below.</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="ep-alert ep-alert--success">
            <span className="ep-alert-icon">{icons.check}</span>
            <div><strong>Success!</strong><p>{successMsg}</p></div>
          </div>
        )}
        {errorMsg && (
          <div className="ep-alert ep-alert--error">
            <span className="ep-alert-icon">{icons.alert}</span>
            <div><strong>Error</strong><p>{errorMsg}</p></div>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Section 1 — Basic Info */}
          <Section title="Basic Information" colorClass="ep-section-icon--info" icon={icons.info}>
            <div className="ep-form-group">
              <label htmlFor="name" className="ep-label">Product Name <span className="required">*</span></label>
              <input
                type="text" name="name" id="name" required
                value={formData.name} onChange={handleChange}
                placeholder="Enter product name"
                className="ep-input"
              />
            </div>
            <div className="ep-form-group">
              <label htmlFor="description" className="ep-label">Description <span className="required">*</span></label>
              <textarea
                id="description" name="description" rows={5} required
                value={formData.description} onChange={handleChange}
                placeholder="Describe your product in detail..."
                className="ep-textarea"
              />
            </div>
          </Section>

          {/* Section 2 — Pricing & Stock */}
          <Section title="Pricing & Stock" colorClass="ep-section-icon--money" icon={icons.money}>
            <div className="ep-grid-3">
              {/* Price */}
              <div className="ep-form-group">
                <label htmlFor="price" className="ep-label">Price <span className="required">*</span></label>
                <div className="ep-input-group">
                  <span className="ep-prefix">$</span>
                  <input
                    type="number" name="price" id="price" step="0.01" required
                    value={formData.price} onChange={handleChange}
                    placeholder="0.00" className="ep-input"
                  />
                </div>
              </div>
              {/* Discount */}
              <div className="ep-form-group">
                <label htmlFor="discount_price" className="ep-label">Discount Price</label>
                <div className="ep-discount-row">
                  <input
                    type="number" name="discount_price" id="discount_price"
                    step="0.01" min="0"
                    value={formData.discount_price} onChange={handleChange}
                    placeholder="0.00" className="ep-input"
                  />
                  <select name="discount_type" value={formData.discount_type} onChange={handleChange} className="ep-discount-type">
                    <option value="percentage">%</option>
                    <option value="fixed">$</option>
                  </select>
                </div>
              </div>
              {/* Stock */}
              <div className="ep-form-group">
                <label htmlFor="instock" className="ep-label">Stock Qty <span className="required">*</span></label>
                <div className="ep-input-group">
                  <span className="ep-prefix" style={{ display:'flex' }}>{icons.box}</span>
                  <input
                    type="number" name="instock" id="instock" required min="0"
                    value={formData.instock} onChange={handleChange}
                    placeholder="0" className="ep-input"
                    style={{ paddingLeft: '34px' }}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Section 3 — Category */}
          <Section title="Category" colorClass="ep-section-icon--cat" icon={icons.category}>
            <div className="ep-grid-3">
              <div className="ep-form-group">
                <label htmlFor="category_id" className="ep-label">Category <span className="required">*</span></label>
                <select id="category_id" name="category_id" value={formData.category_id} onChange={handleCategoryChange} className="ep-select" required>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
                </select>
              </div>
              <div className="ep-form-group">
                <label htmlFor="subcategory_id" className="ep-label">Subcategory</label>
                <select id="subcategory_id" name="subcategory_id" value={formData.subcategory_id} onChange={handleSubcategoryChange} className="ep-select" disabled={subcategories.length === 0}>
                  <option value="">Select Subcategory</option>
                  {subcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>
              <div className="ep-form-group">
                <label htmlFor="sub_subcategory_id" className="ep-label">Sub-Subcategory</label>
                <select id="sub_subcategory_id" name="sub_subcategory_id" value={formData.sub_subcategory_id} onChange={handleChange} className="ep-select" disabled={subSubcategories.length === 0}>
                  <option value="">Select Sub-Subcategory</option>
                  {subSubcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>
            </div>
            <p className="ep-hint">{icons.hint} Select a category first to enable subcategory options.</p>
          </Section>

          {/* Section 4 — Images */}
          <Section title="Product Images" colorClass="ep-section-icon--images" icon={icons.image}>
            <span className="ep-sub-label" style={{ marginTop: 0 }}>Upload New Images</span>
            <div className="ep-image-grid">
              <ImageSlot name="image"  label="Main Image"    preview={previewImages.image}  />
              <ImageSlot name="image1" label="Extra Image 1" preview={previewImages.image1} />
              <ImageSlot name="image2" label="Extra Image 2" preview={previewImages.image2} />
              <ImageSlot name="image3" label="Extra Image 3" preview={previewImages.image3} />
            </div>

            {product_images && product_images.length > 0 && (
              <>
                <span className="ep-sub-label">Previously Added</span>
                <div className="ep-prev-grid">
                  {product_images.map(img => (
                    <div key={img.id} className="ep-prev-img-wrap">
                      <img src={`/storage/${img.image}`} alt="Product" />
                      <div className="ep-prev-overlay">
                        <button type="button" onClick={() => deleteImage(img.id)} className="ep-delete-btn" title="Delete image">
                          {icons.trash}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Section>

          {/* Actions */}
          <div className="ep-actions">
            <button type="button" onClick={handleCancel} className="ep-btn ep-btn--cancel">
              {icons.x} Cancel
            </button>
            <button type="submit" disabled={loading} className="ep-btn ep-btn--save">
              {loading ? (
                <><div className="ep-spinner" /> Saving...</>
              ) : (
                <>{icons.save} Save Changes</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProduct;