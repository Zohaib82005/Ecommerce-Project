<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\Order;
class UserController extends Controller
{
    public function Register(Request $req)
    {
        $req->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|confirmed',
        ]);
        $pass = Hash::make($req->password);
        User::insert([
            'name' => $req->name,
            'email' => $req->email,
            'password' => $pass,
        ]);

        return redirect('/login');

    }

    public function Login(Request $req)
    {
        $req->validate([
            'email' => 'required',
            'password' => 'required',
        ]);
        // dd($req);
        $cred = Auth::attempt(['email' => $req->email, 'password' => $req->password]);
        if ($cred) {
            if (Auth::user()->role == 'Seller') {
                return redirect('/seller');
            } elseif (Auth::user()->role == 'Admin') {
                return redirect('/admin');
            }

            return redirect('/dashboard');

        }

        return redirect()->back()->withErrors('Incorrect email or password');
    }

    public function adminDashboard()
    {
        $categories = Category::select('category', 'id')->get();

        return Inertia::render('Admin',
            [
                'categories' => $categories,
            ]
        );
    }

    public function sellerDashboard(){
        $categories = Category::select('category', 'id')->get();
        $products = Product::leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->where('products.added_by', Auth::user()->id)
            ->select('products.*', 'categories.category')
            ->get();
        $pcount = Product::leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->where('products.added_by', Auth::user()->id)
            ->count();
            
        // dd($products);

        // get orders related to this seller (orders whose cart contains products added by this seller)
        // $orders = Order::join('cartitems', 'orders.cart_id', '=', 'cartitems.cart_id')
        //     ->join('products', 'cartitems.product_id', '=', 'products.id')
        //     ->where('products.added_by', Auth::user()->id)
        //     ->where('cartitems.status', 'ordered')
        //     ->select('orders.*','products.name as product_name','cartitems.quantity as quantity')
        //     ->distinct()
        //     ->get();

        $order = Order::join('carts', 'orders.cart_id', '=', 'carts.id')
            ->leftJoin('cartitems', 'carts.id', '=', 'cartitems.cart_id')
            ->leftJoin('products', 'cartitems.product_id', '=', 'products.id')
            ->join('addresses', 'orders.address_id', '=', 'addresses.id')
            ->where('products.added_by', Auth::user()->id)
            ->select('orders.*','orders.id as oid', 'products.name as product_name', 'cartitems.quantity as quantity', 'products.image as product_image', 'products.price as pprice','addresses.*')
            ->get();
    // dd($order);
        return Inertia::render('Seller',
            [
                'categories' => $categories,
                'products' => $products,
                'pcount' => $pcount,
                'orders' => $order,
            ]
        );
    }

    public function logout(Request $req)
    {
        Auth::logout();
        return redirect('/login');
    }

    public function dashboard()
    {
        // $categories = Category::select('category', 'id')->get();
        // $products = Product::leftJoin('categories', 'products.category_id', '=', 'categories.id')
        //     ->select('products.*', 'categories.category')
        //     ->get();
        // $pcount = Product::count();

        return Inertia::render('Dashboard'
        // ,
            // [
            //     'categories' => $categories,
            //     'products' => $products,
            //     'pcount' => $pcount,
            // ]
        );
    }
}
