<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
class ProductController extends Controller
{
    public function addcate(Request $req)
    {
        // dd($req);
        $req->validate([
            'category' => 'required',
        ]);

        Category::create([
            'category' => $req->category,
        ]);

        return redirect()->back();
    }

    public function addProduct(Request $req)
    {
        $data = $req->validate([
            'name' => 'required',
            'price' => 'required',
            'instock' => 'required',
            'desc' => 'required',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'category_id' => 'required',
        ]);

        if ($req->hasFile('image')) {
            $file = $req->file('image');

            // Store image in storage/app/public/images
            $path = $file->store('images', 'public');
            // dd($path);
            // // Save image path in data array
            $data['image'] = $path;
        }

        // Create product
        Product::create([
            'name' => $data['name'],
            'price' => $data['price'],
            'instock' => $data['instock'],
            'description' => $data['desc'],
            'image' => $data['image'],
            'category_id' => $data['category_id'],
            'added_by' => Auth::user()->id,
        ]);

        return redirect()->back()->with('success', 'Product added successfully!');

    }

    public function editProduct($id)
    {
        return '<h1>Edit Product '.$id.'</h1>';
    }

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->back()->with('success', 'Product deleted successfully!');
    }

    public function products()
    {
        try{
            $products = Product::leftJoin('categories', 'products.category_id', '=', 'categories.id')
                ->select('products.*', 'categories.category as category')
                ->where('products.status', 'Approved')
                ->get();
                // ->paginate(5);
            $categories = Category::all();
        }catch(\Exception $e){
            return "We are facing some issues. Please try again later.";
        }

        return Inertia::render('Product',
            [
                'products' => $products,
                'categories' => $categories,
            ]
        );
    }

    public function productDetails($id){
        $product = Product::leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.category as category')
            ->where('products.id', $id)
            ->first();

        if (!$product) {
            return redirect()->back()->with('error', 'Product not found!');
        }

        return Inertia::render('ProductDetail', [
            'product' => $product,
        ]);
    }
}
