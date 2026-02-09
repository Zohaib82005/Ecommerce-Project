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
            'apartment' => 'nullable|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zipCode' => 'required|string',
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
            'apartment' => $validated['apartment'] ?? null,
            'city' => $validated['city'],
            'state' => $validated['state'],
            'zip' => $validated['zipCode'],
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

    public function addToWishlist($id){

        //check if already exists
        $exists = Wishlist::select('id')->where('user_id',Auth::user()->id)->where('product_id', $id)->where('status', 'active')->first();
        if($exists){
            return redirect()->back()->with('error','Product Already added to Wishlist!');
        }

        $existsremoved = Wishlist::select('id')->where('user_id',Auth::user()->id)->where('product_id', $id)->where('status', 'removed')->first();
        if($existsremoved){
            Wishlist::where('id', $existsremoved->id)->update([
                'status' => 'active'
            ]);
            return redirect()->back()->with('success','Product Added to Wishlist!');
        }
        Wishlist::create([
            'user_id' => Auth::user()->id,
            'product_id' => $id,
        ]);
        // return $id;
        return redirect()->back()->with('success', 'Product added to wishlist!');
    }

    public function removeFromWishlist($id){
        Wishlist::where('user_id', Auth::user()->id)->where('product_id', $id)->update([
            'status' => 'removed'
        ]);
        return redirect()->back()->with('success', 'Product removed from wishlist!');
    }
}
