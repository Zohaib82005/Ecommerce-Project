<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use App\Models\Cartitem;
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

        // Find or create a cart for the user
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Check if the product is already in the cart
        $cartItem = Cartitem::where('cart_id', $cart->id)->where('product_id', $validated['product_id'])->first();

        if ($cartItem) {
            // If it exists, update quantity
            $cartItem->update([
                'quantity' =>  $validated['quantity'],
                'status' => 'active',
                ]);
        } else {
            // If it doesn't exist, create a new cart item
            Cartitem::create([
                'cart_id' => $cart->id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'status' => 'active',
            ]);
        }

        return redirect()->back()->with('success', 'Product added to cart successfully!');
    }

    public function viewCart()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        $products = Product::Join('cartitems', 'products.id', '=', 'cartitems.product_id')
            ->select('products.*', 'cartitems.quantity as quantity', 'cartitems.id as cartitem_id')
            ->where('cartitems.cart_id', $cart->id)
            ->where('cartitems.status', 'active')
            ->get();
            // dd($products);
        if (!$cart) {
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
