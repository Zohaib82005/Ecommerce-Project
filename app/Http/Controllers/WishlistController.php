<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
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
