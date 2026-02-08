<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
//add all models
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
class AdminController extends Controller
{
    public function index(){
        $categories = Category::select('category', 'id')->get();
        $users = User::select('name', 'email', 'role', 'id', 'created_at')->get();
        $products = Product::join('categories', 'products.category_id', '=', 'categories.id')
                             ->join('users', 'products.added_by', '=', 'users.id')
                             ->select('products.*', 'categories.category as category_name', 'users.name as seller_name')
                             ->get();
        $sellers = User::where('role', 'Seller')->select('*')->get();
        return Inertia::render('Admin',
            [
                'categories' => $categories,
                'users' => $users,
                'products' => $products,
                'sellers' => $sellers
            ]
        );
        
    }

    public function approveProduct($id){
        $product = Product::find($id);
        if($product){
            $product->status = 'Approved';
            $product->save();
        }
        return redirect()->back();
    }

    public function rejectProduct($id){
        $product = Product::find($id);
        if($product){
            $product->status = 'Rejected';
            $product->save();
        }
        return redirect()->back();
    }
}
