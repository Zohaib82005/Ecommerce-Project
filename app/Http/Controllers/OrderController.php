<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Addresse;
use App\Models\Cartitem;
use App\Models\Order;
use App\Models\Product;
class OrderController extends Controller
{
    public function success(Request $request, $cartId)
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

        $address = Addresse::where('user_id', Auth::user()->id)->first();
        $cid = $cartId;
        Product::whereIn('id', function ($query) use ($cid) {
            $query->select('product_id')
                  ->from('cartitems')
                  ->where('cart_id', $cid)
                  ->where('status', 'active');
        })->update(['instock' => \DB::raw('instock - (SELECT quantity FROM cartitems WHERE cartitems.product_id = products.id AND cartitems.cart_id = '.$cid.' AND cartitems.status = "active")')]);
        $totalPrice = Product::join('cartitems', 'products.id', '=', 'cartitems.product_id')
            ->where('cartitems.cart_id', $cid)
            ->where('cartitems.status', 'active')
            ->sum(\DB::raw('products.price * cartitems.quantity'));
            
        Order::create([
            'user_id' => Auth::user()->id,
            'total_amount' => $totalPrice,
            'cart_id' => $cid,
            'address_id' => $address->id,
            'payment_method' => $validated['paymentMethod'],
            'status' => 'Pending',
        ]);
        Cartitem::where('cart_id', $cid)->where('status','active')->update(['status' => 'ordered']);
        
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
