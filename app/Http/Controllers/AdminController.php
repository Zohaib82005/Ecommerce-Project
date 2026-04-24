<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
//add all models
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Subcategory;
use App\Models\Sub_subcategory;
use App\Models\Order;
use App\Models\HomeBanner;
use App\Models\PromotionBanner;
use App\Models\WebsiteSetting;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function index(){
        $categories = Category::select('category', 'id')->get();
        $subcategories = Subcategory::select('id', 'name', 'category_id')->get();
        $subSubcategories = Sub_subcategory::select('id', 'name', 'subcategory_id')->get();
        $users = User::select('name', 'email', 'role', 'id', 'created_at')->orderBy('created_at', 'desc')->get();
        $products = Product::join('categories', 'products.category_id', '=', 'categories.id')
                             ->join('users', 'products.added_by', '=', 'users.id')
                             ->select('products.*', 'categories.category as category_name', 'users.name as seller_name')
                             ->get();
        $sellers = User::where('role', 'Seller')->select('*')->get();
        $orders = Order::join('users as customers', 'orders.user_id', '=', 'customers.id')
                       ->join('carts', 'orders.id', '=', 'carts.order_id')
                       ->join('products', 'carts.product_id', '=', 'products.id')
                       ->leftJoin('users as sellers', 'products.added_by', '=', 'sellers.id')
                       ->leftJoin('addresses', 'orders.address_id', '=', 'addresses.id')
                       ->select(
                           'orders.id as order_id',
                           'orders.address_id',
                           'orders.total_amount',
                           
                           'orders.payment_method',
                           'orders.created_at',
                           'customers.name as customer_name',
                           'customers.email as customer_email',
                           'products.id as product_id',
                           'products.name as product_name',
                           'products.image as product_image',
                           'carts.quantity',
                           'carts.amount as line_amount',
                           'carts.orderstatus as product_order_status',
                           'sellers.name as seller_name',
                           'addresses.address',
                           'addresses.city',
                           'addresses.country as shipping_country',
                           'addresses.phone'
                       )
                       ->orderBy('orders.created_at', 'desc')
                       ->get();
        $homeBanners = HomeBanner::orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->get();
        $promotionBanners = PromotionBanner::orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->get();
        $websiteSettings = WebsiteSetting::getSettings();
        return Inertia::render('Admin',
            [
                'categories' => $categories,
                'subcategories' => $subcategories,
                'subSubcategories' => $subSubcategories,
                'users' => $users,
                'products' => $products,
                'sellers' => $sellers,
                'orders' => $orders,
                'homeBanners' => $homeBanners,
                'promotionBanners' => $promotionBanners,
                'websiteSettings' => $websiteSettings,
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
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user = User::find($data['id']);
        if (!$user) {
            return redirect()->back()->withErrors(['user' => 'User not found']);
        }

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->role = $data['role'];
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        return redirect()->back()->with('success', 'User updated successfully');
    }

    /**
     * Delete a user from admin panel.
     */
    public function deleteUser($id)
    {
        try{
            $user = User::find($id);
            if (!$user) {
                return redirect()->back()->withErrors(['user' => 'User not found']);
            }

            $user->delete();
            return redirect()->back()->with('success', 'User deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the user: ' . $e->getMessage()]);
        }
    }

    /**
     * Update category, sub category, or sub-sub category.
     */
    public function updateCategory(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|integer',
            'name' => 'required|string|max:255',
            'level' => 'required|in:main,sub,subsub',
        ]);

        try {
            if ($data['level'] === 'main') {
                $category = Category::find($data['id']);
                if (!$category) {
                    return redirect()->back()->with('error', 'Main category not found.');
                }
                $category->category = $data['name'];
                $category->save();
            } elseif ($data['level'] === 'sub') {
                $subcategory = Subcategory::find($data['id']);
                if (!$subcategory) {
                    return redirect()->back()->with('error', 'Sub category not found.');
                }
                $subcategory->name = $data['name'];
                $subcategory->save();
            } else {
                $subSubcategory = Sub_subcategory::find($data['id']);
                if (!$subSubcategory) {
                    return redirect()->back()->with('error', 'Sub-sub category not found.');
                }
                $subSubcategory->name = $data['name'];
                $subSubcategory->save();
            }

            return redirect()->back()->with('success', 'Category updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update category.');
        }
    }

    /**
     * Delete category, sub category, or sub-sub category.
     */
    public function deleteCategory(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|integer',
            'level' => 'required|in:main,sub,subsub',
        ]);

        try {
            if ($data['level'] === 'main') {
                $category = Category::find($data['id']);
                if (!$category) {
                    return redirect()->back()->with('error', 'Main category not found.');
                }
                $category->delete();
            } elseif ($data['level'] === 'sub') {
                $subcategory = Subcategory::find($data['id']);
                if (!$subcategory) {
                    return redirect()->back()->with('error', 'Sub category not found.');
                }
                $subcategory->delete();
            } else {
                $subSubcategory = Sub_subcategory::find($data['id']);
                if (!$subSubcategory) {
                    return redirect()->back()->with('error', 'Sub-sub category not found.');
                }
                $subSubcategory->delete();
            }

            return redirect()->back()->with('success', 'Category deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete category.');
        }
    }

    /**
     * Update website-level settings from admin panel.
     */
    public function updateWebsiteSettings(Request $request)
    {
        $data = $request->validate([
            'admin_login_slug' => ['required', 'string', 'max:120', 'regex:/^[a-zA-Z0-9_-]+$/'],
            'website_name' => ['required', 'string', 'max:160'],
            'website_logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:5120'],
        ]);

        $settings = WebsiteSetting::getSettings();
        $settings->admin_login_slug = strtolower(trim($data['admin_login_slug']));

        $settings->website_name = trim($data['website_name']);

        if ($request->hasFile('website_logo')) {
            if (!empty($settings->website_logo) && Storage::disk('public')->exists($settings->website_logo)) {
                Storage::disk('public')->delete($settings->website_logo);
            }

            $settings->website_logo = $request->file('website_logo')->store('website-settings', 'public');
        }

        $settings->save();

        return redirect()->back()->with('success', 'Website settings updated successfully.');
    }
}
