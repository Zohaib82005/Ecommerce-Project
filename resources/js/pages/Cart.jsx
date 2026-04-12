import React, { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import FlashMessage from "../components/FlashMessage";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { calculatePrice } from '@/utils/priceCalculator';
import { useCurrency } from '../contexts/CurrencyContext';
const Cart = () => {
  const products = usePage().props.products || [];
  const { formatCurrencyFromMYR } = useCurrency();
  const formatMoney = (value) => formatCurrencyFromMYR(value);
  const [cartItems, setCartItems] = useState(products);
  
  useEffect(() => {
    setCartItems(products);
  }, [products]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Calculate totals using centralized price calculator
  const subtotal = cartItems.reduce((total, item) => {
    // Use final_price if available (calculated by backend), otherwise calculate on frontend
    const finalPrice = item.final_price || calculatePrice(
      item.price,
      item.discount_price || 0,
      item.discount_type || 'percentage'
    ).finalPrice;
    
    return total + (finalPrice * item.quantity);
  }, 0);

  const processingFee = 0; // FREE
  const shipping = 0; // FREE
  const total = subtotal + processingFee + shipping;

  // Update quantity
  const updateQuantity = (cartItemId, newQty) => {
    if (newQty < 1) return;
    setCartItems(cartItems.map(item => 
      (item.cart_item_id || item.cartitem_id) === cartItemId ? { ...item, quantity: newQty } : item
    ));
  };

  // Remove item
  const removeItem = (cartItemId) => {
    router.delete(`/cart/remove/${cartItemId}`, {
      preserveScroll: true,
      onSuccess: () => {
        setCartItems(cartItems.filter(item => (item.cart_item_id || item.cartitem_id) !== cartItemId));
      }
    });
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo({ code: "SAVE10", discount: 10 });
    } else {
      alert("Invalid promo code");
    }
  };

  // Remove promo code
  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };

  return (
    <>
      <FlashMessage />
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {cartItems.length === 0 ? (
            // Empty Cart State
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-8">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1170/1170663.png" 
                  alt="Empty Cart" 
                  className="w-64 h-64 object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
                Your Cart is empty
              </h1>
              <p className="text-gray-600 mb-8 text-center max-w-md">
                There nothing in the cart. Let's add some items.
              </p>
              <Link 
                href="/products" 
                className="px-8 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors shadow-lg"
              >
                Keep exploring
              </Link>
            </div>
          ) : (
            // Cart with Items
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Left: Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">MY CART</h2>
                
                {cartItems.map((item) => (
                  <div key={item.cart_item_id || item.cartitem_id} className="bg-white rounded-lg shadow-sm p-6 flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0">
                      <img 
                        src={`/storage/${item.image}`} 
                        alt={item.name}
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-medium mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-900 mb-4">
                        {formatMoney(item.final_price)}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">Qty: {item.quantity}</p>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                          Quantity: {item.quantity}
                        </span>
                        

                        {/* Remove Button */}
                        <button 
                          onClick={() => removeItem(item.cart_item_id || item.cartitem_id)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="text-sm font-medium">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Price Details */}
              <div className="mt-8 lg:mt-0">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Price Details</h3>
                  
                  <div className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">{formatMoney(subtotal)}</span>
                    </div>

                    {/* Processing Fee */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Processing Fee</span>
                      <span className="font-semibold text-green-600">May Apply</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-green-600">May Apply</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">
                          Total <span className="text-gray-500 font-normal text-sm">(Inclusive of VAT)</span>
                        </span>
                        <span className="text-xl font-bold text-gray-900">{formatMoney(total)}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link 
                      href="/checkout"
                      className="w-full block text-center px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors mt-6"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;