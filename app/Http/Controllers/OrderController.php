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
        $validated = $request->validate([
            'phone' => 'required|string',
            'address' => 'required|string',
            'province' => 'nullable|string',
            'name' => 'nullable|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'paymentMethod' => 'required|string',
        ]);

        
        $totalAmount = Cart::join('products', 'carts.product_id', '=', 'products.id')
            ->where('carts.user_id', Auth::id())
            ->where('carts.status', 'active')
            ->sum(\DB::raw('products.price * carts.quantity'));
        // dd($totalAmount);
        // dd($totalAmount);
        Addresse::create([
            'user_id' => Auth::id(),
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'name' => $validated['name'] ?? null,
            'city' => $validated['city'],
            'province' => $validated['province'] ?? null,
            'country' => $validated['country'],
        ]
        );
        Order::create([
            'user_id' => Auth::id(),
            'total_amount' => $totalAmount,
            'address_id' => Addresse::where('user_id', Auth::id())->latest()->first()->id,
            'payment_method' => $validated['paymentMethod'],
            'status' => 'Pending'
        ]);

        $order = Order::where('user_id', Auth::id())->latest()->first();
        $carts = Cart::where('user_id', Auth::id())->where('status', 'active')->get();
        foreach($carts as $cart){
            Cart::where('user_id', Auth::user()->id)->where('status', 'active')->where('id', $cart->id)->update([
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
        
        return redirect()->back()->with('success', 'Status Updated Successfully!');
    }


}
