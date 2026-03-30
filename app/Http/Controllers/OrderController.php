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
class OrderController extends Controller
{
    public function success(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'total' => 'required|numeric',
            'address_id' => 'required|exists:addresses,id',
            'paymentMethod' => 'required|string',
        ]);

        $user = Auth::user();
        
        
        
        // Get all active cart items for this user
        $cartItems = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('product')
            ->get();
        
        if ($cartItems->isEmpty()) {
            return redirect('/cart')->with('error', 'Your cart is empty');
        }
        
        // Calculate total amount from products in cart
        $totalAmount = $cartItems->sum(function($item) {
            return $item->product->price * $item->quantity;
        });
        
        // Create order with address_id
        $order = Order::create([
            'user_id' => $user->id,
            'total_amount' => $totalAmount,
            'address_id' => $validated['address_id'],
            'payment_method' => $validated['paymentMethod'],
            'status' => 'Pending'
        ]);
        
        // Update all cart items to mark them as ordered
        foreach($cartItems as $cart) {
            $cart->update([
                'status' => 'ordered',
                'order_id' => $order->id
                // 'orderstatus' => 'confirmed'
            ]);
        }
        
        // Prepare order data for success page
        // $orderData = [
        //     'id' => $order->id,
        //     'order_number' => str_pad($order->id, 6, '0', STR_PAD_LEFT),
        //     'total' => $totalAmount,
        //     'paymentMethod' => $validated['paymentMethod'],
        //     'estimatedDelivery' => now()->addDays(3)->format('M d, Y'),
        //     'items' => $cartItems->map(function($item) {
        //         return [
        //             'name' => $item->product->name,
        //             'quantity' => $item->quantity,
        //             'price' => $item->product->price,
        //             'image' => $item->product->image,
        //         ];
        //     })->toArray(),
        //     'address' => [
        //         'name' => $address->name,
        //         'phone' => $address->phone,
        //         'address' => $address->address,
        //         'city' => $address->city,
        //         'province' => $address->province,
        //         'landmark' => $address->landmark,
        //     ]
        // ];
        
        return Inertia::render('OrderSuccess');
    }

    public function updateStatus(Request $req){
        Order::where('id', $req->order_id)->update([
            'status' => $req->status
        ]);
        
        // Handle both single product_id and array of product_ids
        if (is_array($req->product_id)) {
            // Multiple product IDs
            foreach ($req->product_id as $productId) {
                Cart::where('order_id', $req->order_id)
                    ->where('product_id', $productId)
                    ->update(['orderstatus' => $req->status]);
            }
        } else {
            // Single product ID
            Cart::where('order_id', $req->order_id)
                ->where('product_id', $req->product_id)
                ->update(['orderstatus' => $req->status]);
        }
        
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
