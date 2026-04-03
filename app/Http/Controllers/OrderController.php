<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Addresse;
use App\Models\Wishlist;
use App\Models\Order;
use App\Models\Product;
use App\Models\Cart;
use App\Utils\PriceCalculator;
class OrderController extends Controller
{
    public function success(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'total' => 'required|numeric|min:0',
            'address_id' => 'required|exists:addresses,id',
            'paymentMethod' => 'required|string',
        ]);

        $user = Auth::user();
        // dd($validated);
        // Get all active cart items for this user
        $cartItems = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect('/cart')->with('error', 'Your cart is empty');
        }

        // Calculate total amount from products in cart using PriceCalculator
        $totalAmount = 0;
        foreach ($cartItems as $item) {
            if (!$item->product) {
                continue;
            }

            // Use PriceCalculator to get the correct final price for each item
            $priceCalc = PriceCalculator::calculate(
                $item->product->price,
                $item->product->discount_price ?? 0,
                $item->product->discount_type ?? 'percentage'
            );

            // Add to total: (final_price * quantity)
            $totalAmount += $priceCalc['final_price'] * $item->quantity;
        }

        $totalAmount = round($totalAmount, 2);

        // Create order with calculated total
        $order = Order::create([
            'user_id' => $user->id,
            'total_amount' => $totalAmount,
            'address_id' => $validated['address_id'],
            'payment_method' => $validated['paymentMethod'],
            'status' => 'Pending'
        ]);

        // Update all cart items to mark them as ordered
        foreach ($cartItems as $cart) {
            $cart->update([
                'status' => 'ordered',
                'order_id' => $order->id
            ]);
        }

        return Inertia::render('OrderSuccess');
    }

    public function updateStatus(Request $req){
        Order::where('id', $req->order_id)->update([
            'status' => $req->status
        ]);
        
        // Handle both single product_id and array of product_ids
        // if (is_array($req->product_id)) {
        //     // Multiple product IDs
        //     foreach ($req->product_id as $productId) {
        //         Cart::where('order_id', $req->order_id)
        //             ->where('product_id', $productId)
        //             ->update(['orderstatus' => $req->status]);
        //     }
        // } else {
        //     // Single product ID
        //     Cart::where('order_id', $req->order_id)
        //         ->where('product_id', $req->product_id)
        //         ->update(['orderstatus' => $req->status]);
        // }
        
        // If order is completed, add quantities to total_sold
        if (strtolower($req->status) === 'completed' || strtolower($req->status) === 'delivered') {
            $cartItems = Cart::where('order_id', $req->order_id)
                ->with('product')
                ->get();
            
            foreach ($cartItems as $item) {
                Product::where('id', $item->product_id)->increment('total_sold', $item->quantity);
            }
        }
        
        return redirect()->back()->with('success', 'Status Updated Successfully!');
    }


}
