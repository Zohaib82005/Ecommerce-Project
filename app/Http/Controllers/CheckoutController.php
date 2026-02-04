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

        // $cart = Cart::where('user_id', Auth::id())->first();
        // if (!$cart) {
        //     return Inertia::render('Checkout', ['cartItems' => []]);
        // }
        $products = Product::join('carts', 'products.id', '=', 'carts.product_id')
            ->select('products.*', 'carts.quantity as quantity', 'carts.id as cart_item_id')
            // ->where('carts.id', $cart->id)
            ->where('carts.user_id', Auth::id())
            ->where('carts.status', 'active')
            ->get();

            if(!$products){
                return Inertia::render('Checkout', ['cartItems' => []]);
            }
        // dd($products);

        $address = Addresse::where('user_id', Auth::id())->latest();
        // $products = Product::join()
        return Inertia::render('Checkout', ['cartItems' => $products, 'address' => $address]);
    }
}
