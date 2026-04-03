<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use App\Models\Wishlist;
use App\Utils\PriceCalculator;
use Inertia\Inertia;
class CartController extends Controller
{

    public function addToCart(Request $request)
    {
        // dd($request->all());
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
        
        Wishlist::where('user_id', $user->id)->where('product_id', $validated['product_id'])->delete();
       

        return redirect()->back()->with('success', 'Product added to cart successfully!');
    }

    public function viewCart()
    {
        $user = Auth::user();
        $products = Product::join('carts', 'products.id', '=', 'carts.product_id')
            ->where('carts.user_id', $user->id)
            ->where('carts.status', 'active')
            ->select('products.*', 'carts.id as cart_item_id', 'carts.quantity as quantity')
            ->get()
            ->map(function ($product) {
                // Use PriceCalculator for consistent price calculations
                $priceCalc = PriceCalculator::calculate(
                    $product->price,
                    $product->discount_price ?? 0,
                    $product->discount_type ?? 'percentage'
                );

                return array_merge($product->toArray(), [
                    'final_price' => $priceCalc['final_price'],
                    'discount_amount' => $priceCalc['discount_amount'],
                    'discount_percentage' => $priceCalc['discount_percentage'],
                    'is_discounted' => $priceCalc['is_discounted'],
                    'savings' => $priceCalc['savings'],
                ]);
            });

        if (!$products || $products->isEmpty()) {
            return Inertia::render('Cart', ['products' => []]);
        }

        return Inertia::render('Cart', ['products' => $products]);
    }

    //update status to removed
    public function removeFromCart($id)
    {
        // dd($id);
        $cartItem = Cart::find($id);
        if ($cartItem) {
            
            $cartItem->update(['status' => 'removed']);
            return redirect()->back()->with('success', 'Item removed from cart successfully!');
        }

        return redirect()->back()->with('error', 'Cart item not found!');
    }
}
