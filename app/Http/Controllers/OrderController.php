<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Addresse;

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

        Cart::where('user_id', Auth::user()->id)->where('status', 'active')->update([
            'status' => 'ordered'
        ]);
        
       
        return Inertia::render('OrderSuccess');
    }

    public function updateStatus(Request $req){
        Order::where('id', $req->order_id)->update([
            'status' => $req->status
        ]);
        // dd($req);
        return redirect()->back()->with('success', 'Status Updated Successfully!');
    }
}
