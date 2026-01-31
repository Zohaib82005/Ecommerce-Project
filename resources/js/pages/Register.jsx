import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import "../css/Register.css";
import { useForm, usePage } from "@inertiajs/react";

const Register = () => {
  const cred = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState();
  const [nerror, setnError] = useState();
  const [eerror, seteError] = useState();
  const [showError, setShowError] = useState(false);
  
  function handleSubmit(e) {
    e.preventDefault();
    if (!cred.data.name) {
      setnError("Name field is required");
      return;
    }
    if (!cred.data.email) {
      seteError("Email field is required");
      return;
    }

    if (cred.data.password.length < 8) {
      setError("Please Use minimum of 8 characters");
      return;
    }
    if (cred.data.password != cred.data.password_confirmation) {
      setError("The confirm Password Field does not match");
      return;
    }
    cred.post('/submitreg');
  }
  useEffect(() => {
    if (cred.errors.email || cred.errors.name || cred.errors.password) {
      setShowError(true);
    }
    const interval = setInterval(() => {
      setShowError(false);
    }, 3000);

    return () => clearInterval(interval); // cleanup
  }, [cred.errors]);

 
  // console.log(error);
  return (
    <>
      <Navbar />

      {
        showError && (<div>
          {/* {cred.errors?.map((item, index) => (
            <span className="errorpopup animate-fade text-white bg-danger border rounded" key={index}>{item}</span>
          ))}
          {/* {cred.errors.map( 
            <span className="errorpopup animate-fade text-white bg-danger border rounded" >{item}</span>
          )
          } */}

          {(cred.errors.email) && <span className="errorpopup animate-fade text-white bg-danger border rounded" >{cred.errors.email}</span>}
          {(cred.errors.name) && <span className="errorpopup animate-fade text-white bg-danger border rounded" >{cred.errors.name}</span>}
          {(cred.errors.password) && <span className="errorpopup animate-fade text-white bg-danger border rounded" >{cred.errors.password}</span>}

        </div>)
      }

      <div className="register-wrapper">
        <div className="register-card animate-fade">

          {/* Left Form */}
          <div className="register-left">
            <h3 className="fw-bold mb-2">Create Account</h3>
            <p className="text-muted mb-4">
              Join CoreBuy and start shopping smarter
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  onChange={(e) => { cred.setData('name', e.target.value) }}

                />
                {nerror && (<span className="text-danger">{nerror}</span>)}
              </div>

              <div className="mb-3">
                {/* <label htmlFor="">{cred.data.email}</label> */}
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  onChange={(e) => { cred.setData('email', e.target.value) }}
                />
                {eerror && (<span className="text-danger">{eerror}</span>)}
                
              </div>

              <div className="mb-3">

                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  onChange={(e) => { cred.setData('password', e.target.value) }}

                />
                {error && (<span className="text-danger">{error}</span>)}
                <span className="text-danger">{cred.errors.password}</span>

              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  onChange={(e) => { cred.setData('password_confirmation', e.target.value) }}

                />
                <span className="text-danger">{cred.errors.password_confirmation}</span>
              </div>

              <button className="btn btn-primary w-100 mb-3" >
                Register
              </button>

              <p className="text-center small mb-0">
                Already have an account?
                <a href="/login" className="text-decoration-none ms-1">
                  Login
                </a>
              </p>
            </form>
          </div>

          {/* Right Image */}
          <div className="register-right d-none d-md-flex">
            <div className="overlay">
              <h2>Welcome!</h2>
              <p>Create an account to access exclusive deals</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Register;
