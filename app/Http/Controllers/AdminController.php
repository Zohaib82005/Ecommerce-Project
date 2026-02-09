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

    /**
     * Update a user's details from admin panel.
     */
    public function updateUser(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'required|string|max:50',
            'status' => 'nullable|string|max:50',
        ]);

        $user = User::find($data['id']);
        if (!$user) {
            return redirect()->back()->withErrors(['user' => 'User not found']);
        }

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->role = $data['role'];
        if (isset($data['status'])) {
            $user->status = $data['status'];
        }
        $user->save();

        return redirect()->back()->with('success', 'User updated successfully');
    }
}
