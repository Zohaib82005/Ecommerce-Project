<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;
class CartController extends Controller
{

    public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        $cart = Cart::select('id')->where('user_id', $user->id)->where('product_id', $validated['product_id'])->where('status','active')->first();

        if($cart){
            return redirect()->back()->with('error', 'Product already in cart!');
        }
        Cart::create([
            'user_id' => $user->id,
            'product_id' => $validated['product_id'],
            'quantity' => $validated['quantity'],
            'status' => 'active',
        ]);
        
       

        return redirect()->back()->with('success', 'Product added to cart successfully!');
    }

    public function viewCart()
    {
        $user = Auth::user();
        $products = Product::join('carts', 'products.id', '=', 'carts.product_id')
            ->where('carts.user_id', $user->id)
            ->where('carts.status', 'active')
            ->select('products.*', 'carts.id as cart_item_id', 'carts.quantity as quantity')
            ->get();

            // dd($products);
        if (!$products) {
            return Inertia::render('Cart', ['cartItems' => []]);
        }

        // $cartItems = Cartitem::where('cart_id', $cart->id)
        //     ->where('status', 'active')
        //     ->with('product')
        //     ->get();
        // dd($products);
        return Inertia::render('Cart', ['products' => $products]);
        
    }

    //update status to removed
    public function removeFromCart($id)
    {
        $cartItem = Cartitem::find($id);
        
        if ($cartItem) {
            
            $cartItem->update(['status' => 'removed']);
            return redirect()->back()->with('success', 'Item removed from cart successfully!');
        }
    }
}
