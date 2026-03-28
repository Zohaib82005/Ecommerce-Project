import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import FlashMessage from '../Components/FlashMessage';
const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showModal, setShowModal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    agree_terms: false
  });

  const [errors, setErrors] = useState({});

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    router.post('/submitlog', loginData, {
      onSuccess: () => {
        setShowModal(false);
      },
      onError: (errors) => {
        // console.log(errors[0]);
        setErrors(errors);
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (signupData.password !== signupData.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (!signupData.agree_terms) {
      setErrors({ agree_terms: 'You must agree to the terms and conditions' });
      setIsLoading(false);
      return;
    }

    router.post('/submitreg', signupData, {
      onSuccess: () => {
        setShowModal(false);
      },
      onError: (errors) => {
        setErrors(errors);
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const closeModal = () => {
    setShowModal(true);
  };

  if (!showModal) return null;

  return (
    <>
    <FlashMessage errors={errors} />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Close Button */}
        <Link
        href="/"
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        <div className="flex flex-col md:flex-row">
          {/* Left Side - Purple Background */}
          <div className="md:w-2/5 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 md:p-12 text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-purple-400 opacity-20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 right-5 w-16 h-16 bg-yellow-400 opacity-20 rounded-full blur-xl"></div>
            
            {/* Star Decorations */}
            <div className="absolute top-32 right-16 text-purple-300 opacity-60">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
            <div className="absolute bottom-32 left-8 text-purple-300 opacity-40">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome Back</h2>
              <p className="text-purple-100 text-lg mb-8">
                Pick up your browsing exactly where you left.
              </p>
              
              {/* Shopping Illustration */}
              <div className="relative mt-8">
                <div className="flex items-end justify-center space-x-2">
                  {/* Purple Shopping Bag */}
                  <div className="relative transform -rotate-12">
                    <div className="w-24 h-28 bg-purple-900 rounded-lg shadow-2xl flex items-center justify-center">
                      <div className="w-16 h-20 bg-purple-800 rounded"></div>
                    </div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-8 border-4 border-purple-900 rounded-t-full"></div>
                    {/* Discount Tag */}
                    <div className="absolute -left-4 top-8 bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transform -rotate-12">
                      %
                    </div>
                  </div>
                  
                  {/* Yellow Shopping Bag */}
                  <div className="relative transform rotate-6 -mb-4">
                    <div className="w-20 h-24 bg-yellow-400 rounded-lg shadow-2xl flex items-center justify-center">
                      <div className="w-12 h-16 bg-yellow-300 rounded"></div>
                    </div>
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-6 border-4 border-yellow-400 rounded-t-full"></div>
                    {/* Percentage Symbol */}
                    <div className="absolute -bottom-2 -right-2 text-pink-500 text-3xl font-bold">
                      %
                    </div>
                  </div>
                </div>
                
                {/* Floating Items */}
                <div className="absolute top-0 left-1/4 w-8 h-8 bg-blue-500 rounded-full opacity-80"></div>
                <div className="absolute top-8 right-1/4 w-6 h-6 bg-red-500 rounded opacity-80"></div>
                <div className="absolute bottom-12 left-1/3 w-10 h-10 bg-green-500 rounded-lg opacity-80 transform rotate-12"></div>
              </div>
            </div>
          </div>

          {/* Right Side - White Background */}
          <div className="md:w-3/5 p-8 md:p-12 bg-white">
            {/* Tabs */}
            <div className="flex rounded-full bg-gray-100 p-1 mb-8">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 px-6 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                LOG IN
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-3 px-6 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'signup'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* Continue Shopping Section */}
            <div className="mb-2">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                {activeTab === 'login' ? 'Continue Shopping' : 'Create Account'}
              </h4>
              <p className="text-gray-600">
                {activeTab === 'login' 
                  ? 'Please enter email or mobile number' 
                  : 'Fill in your details to get started'}
              </p>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="Enter Mobile Number or Email"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Enter Password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      <span>LOGIN</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      name="first_name"
                      value={signupData.first_name}
                      onChange={handleSignupChange}
                      placeholder="First Name"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.first_name ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="last_name"
                      value={signupData.last_name}
                      onChange={handleSignupChange}
                      placeholder="Last Name"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.last_name ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    placeholder="Email Address"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={signupData.phone}
                    onChange={handleSignupChange}
                    placeholder="Phone Number"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Password"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={signupData.password_confirmation}
                      onChange={handleSignupChange}
                      placeholder="Confirm Password"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agree_terms"
                    checked={signupData.agree_terms}
                    onChange={handleSignupChange}
                    className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="/terms" className="text-purple-600 hover:underline">Terms and Conditions</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      <span>CREATE ACCOUNT</span>
                      <svg className="w-5 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="mt-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Auth;