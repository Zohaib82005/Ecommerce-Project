import React, { useEffect, useState } from "react";
import "../css/seller.css";
import { useForm, usePage , Link} from "@inertiajs/react";

const Seller = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showError, setShowError] = useState(false);
  
  const product = useForm({
    name: '',
    price: '',
    instock: '',
    desc: '',
    image: '',
    category_id: ''
  });
  const props = usePage().props;
  function addproductsubmit(e) {
    e.preventDefault();
    product.post('/addProduct');
    
  }

  function EditProduct(id) {
    return `/seller/editProduct/${id}`;
  }
  // console.log(props.products);
// console.log(props);
    useEffect(()=>{
      if(props.errors || props.flash.success){
        setShowError(true);
      }
  
      const interval = setInterval(() => {
        setShowError(false);
      }, 3000);
  
      return () => clearInterval(interval);
    }, [props.errors, props.flash.success]);


  return (
    <div className="seller-layout">
     {(showError && props.errors.image) && <span className="errorpopup animate-fade text-white bg-danger border rounded" >{props.errors.image}</span>}
     {(showError && props.errors.name) && <span className="errorpopup animate-fade text-white bg-danger border rounded" >{props.errors.image}</span>}
     {(showError && props.errors.instock) && <span className="errorpopup animate-fade text-white bg-danger border rounded" >{props.errors.image}</span>}
     {(showError && props.errors.desc) && <span className="errorpopup animate-fade text-white bg-danger border rounded" >{props.errors.image}</span>}
     {(showError && props.errors.price) && <span className="errorpopup animate-fade text-white bg-danger border rounded" >{props.errors.image}</span>}
    {(showError && props.flash.success) && <span className="errorpopup animate-fade text-white bg-success border rounded" >{props.flash.success}</span>}

      {/* SIDEBAR */}
      <aside className="seller-sidebar">
        <h3 className="logo">CoreBuy</h3>
        <span className="role">SELLER PANEL</span>

        <ul>
          <li className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>Dashboard</li>
          <li className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>My Products</li>
          <li className={activeTab === "addProduct" ? "active" : ""} onClick={() => setActiveTab("addProduct")}>Add Product</li>
          <li className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Orders</li>
          <li className={activeTab === "analytics" ? "active" : ""} onClick={() => setActiveTab("analytics")}>Analytics</li>
          <li className={activeTab === "payouts" ? "active" : ""} onClick={() => setActiveTab("payouts")}>Payouts</li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="seller-main">

        {/* HEADER */}
        <div className="seller-header">
          <div>
            <h4>Welcome, Seller</h4>
            <p className="muted">Manage your store & sales</p>
          </div>
          <span className="store-status">🟢 Store Active</span>
        </div>

        {/* CONTENT */}
        <div className="seller-content">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="f">
              <div className="stats-grid">
                <div className="stat-card"><p>Total Products</p><h3>{props.pcount}</h3></div>
                <div className="stat-card"><p>Total Orders</p><h3>312</h3></div>
                <div className="stat-card"><p>Pending Orders</p><h3>8</h3></div>
                <div className="stat-card"><p>Total Revenue</p><h3>$12,430</h3></div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <div className="f">
              <table className="border table">
                <thead >
                  <th>Product</th>
                  <th>Image</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </thead>
                <tbody>
                 {props.products.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td><img src={`http://localhost:8000/storage/${item.image}`} width="100px"  alt="Product Image" /></td>
                  <td>{item.instock}</td>
                  <td className={item.instock > 0 ? "active" : "inactive"} >{item.instock > 0 ? "In Stock" : "Out of Stock"}</td>
                  <td><Link href={EditProduct(item.id)} className="btn btn-sm btn-primary">Edit</Link> <Link href={`/seller/deleteProduct/${item.id}`} className="btn btn-sm btn-danger">Delete</Link></td>
                </tr>
                 ))}
                </tbody>
                  
                
              </table>
            </div>
          )}

          {/* ADD PRODUCT */}
          {/* {product.data.desc}

          <br />
          {product.data.name}
          <br />
          {product.data.instock}
          <br />
          {product.data.price}
          <br /> */}
          {/* {console.log(product.errors)} */}
          {activeTab === "addProduct" && (
            
            <div className="f form-card">
              <form onSubmit={addproductsubmit}>
                <input placeholder="Product Name" type="text" className="border rounded-lg"
                  required
                  onChange={(e) => { product.setData('name', e.target.value) }}
                />
                <input placeholder="Price" className="border rounded-lg"
                  required
                  onChange={(e) => { product.setData('price', e.target.value) }}
                />
                <input placeholder="Stock Quantity" className="border rounded-lg"
                  type="number" required
                  onChange={(e) => { product.setData('instock', e.target.value) }}
                />
                <textarea placeholder="Description" className="border rounded-lg"
                  onChange={(e) => { product.setData('desc', e.target.value) }} required
                ></textarea>
                {/* {product.data.category_id} */}
                <select className="form-control mb-3" onChange={(e) => {product.setData('category_id', e.target.value)}}>
                  <option selected disabled>Select Category</option>
                  {props.categories.map((item, index) => (
                     <option value={item.id} key={index}>
                        {item.category}
                     </option>
                    
                  ))}
                </select>
                <input type="file" placeholder="Select Top  Image" className="border rounded-lg"
                  onChange={(e) => { product.setData('image', e.target.files[0]) }}
                />
                <button>Add Product</button>
              </form>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="f">
              <div className="order-card">
                <strong>#CB9012</strong> — Headphones
                <span className="status new">New</span>
              </div>
              <div className="order-card">
                <strong>#CB8991</strong> — Smart Watch
                <span className="status pending">Pending</span>
              </div>
              <div className="order-card">
                <strong>#CB8812</strong> — Keyboard
                <span className="status completed">Completed</span>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="f analytics">
              <div className="progress-box">
                <p>Monthly Target</p>
                <div className="progress">
                  <div className="progress-bar" style={{ width: "70%" }}></div>
                </div>
                <span>70% achieved</span>
              </div>

              <div className="progress-box">
                <p>Order Fulfillment Rate</p>
                <div className="progress">
                  <div className="progress-bar success" style={{ width: "92%" }}></div>
                </div>
                <span>92%</span>
              </div>
            </div>
          )}

          {/* PAYOUTS */}
          {activeTab === "payouts" && (
            <div className=" payout-card">
              <p>Available Balance</p>
              <h3>$1,230</h3>
              <button>Request Payout</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Seller;
