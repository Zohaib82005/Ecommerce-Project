<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Addresse;
use Illuminate\Support\Facades\Auth;


class CheckoutController extends Controller
{
    public function showCheckout()
    {
        $cart = Cart::where('user_id', Auth::id())->first();
        if (!$cart) {
            return Inertia::render('Checkout', ['cartItems' => []]);
        }
        $products = Product::join('cartitems', 'products.id', '=', 'cartitems.product_id')
            ->select('products.*', 'cartitems.quantity as quantity', 'cartitems.id as cartitem_id', 'cartitems.cart_id as cart_id')
            ->where('cartitems.cart_id', $cart->id)
            ->where('cartitems.status', 'active')
            ->get();

        // dd($products);

        $address = Addresse::where('user_id', Auth::id())->first();
        // $products = Product::join()
        return Inertia::render('Checkout', ['cartItems' => $products, 'address' => $address]);
    }
}
