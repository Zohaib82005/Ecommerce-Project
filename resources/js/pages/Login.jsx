import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import "../css/Login.css";
import { Link, useForm, usePage } from "@inertiajs/react";

const Login = () => {
  const cred = useForm({
    email: '',
    password: ''
  });
  const [error, setError] = useState();
  const [nerror, setnError] = useState();
  const [eerror, seteError] = useState();
  const [showError, setShowError] = useState(false);
  const virtualprop = usePage().props;
  function handleSubmit(e){
    e.preventDefault();
    if (!cred.data.email) {
      seteError("Email field is required");
      return;
    }

    if (cred.data.password.length < 8) {
      setError("Please Use minimum of 8 characters");
      return;
    }

    cred.post('/submitlog');

  }

  useEffect(()=>{
    if(virtualprop.errors){
      setShowError(true);
    }

    const interval = setInterval(() => {
      setShowError(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [virtualprop.errors]);
  
  return (
    <>
      <Navbar />

      {(showError && virtualprop.errors[0]) && <span className="errorpopup animate-fade text-white bg-danger border rounded" >{virtualprop.errors[0]}</span>}

      <div className="login-wrapper">
        <div className="login-card animate-slide">

          {/* Left Side */}
          <div className="login-left d-none d-md-flex">
            <div className="overlay">
              <h2>Welcome Back</h2>
              <p>Login to continue shopping with CoreBuy</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="login-right">
            <h3 className="fw-bold mb-2">Login</h3>
            <p className="text-muted mb-4">
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  onChange={(e) => {cred.setData('email', e.target.value)}}
                />
                {eerror && (<span className="text-danger">{eerror}</span>)}

              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  onChange={(e) => {cred.setData('password', e.target.value)}}
                />
                 {error && (<span className="text-danger">{error}</span>)}

              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">Remember me</label>
                </div>
                <Link href="/" className="text-decoration-none small">
                  Forgot password?
                </Link>
              </div>

              <button className="btn btn-primary w-100 mb-3">
                Login
              </button>

              <p className="text-center small mb-0">
                Don’t have an account?
                <a href="/" className="text-decoration-none ms-1">
                  Register
                </a>
              </p>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;
