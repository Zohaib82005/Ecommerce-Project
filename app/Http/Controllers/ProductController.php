<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Productimage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function addcate(Request $req)
    {
        $req->validate([
            'category' => 'required',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = [
            'category' => $req->category,
        ];

        // Handle image upload if provided
        if ($req->hasFile('image')) {
            $file = $req->file('image');
            $path = $file->store('categories', 'public');
            $data['image'] = $path;
        }

        Category::create($data);

        return redirect()->back();
    }

    public function addProduct(Request $req)
    {

        // dd([
        //     'files' => $req->allFiles(),
        //     'inputs' => $req->except(['image','image1','image2','image3']),
        //     'content_type' => $req->header('Content-Type'),
        // ]);

        $data = $req->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric|lt:price', // ← this is failing because 34 is not less than 34
            'instock' => 'required',
            'desc' => 'required',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'category_id' => 'required',
            'subcategory_id' => 'required',
            'sub_subcategory_id' => 'nullable',
            'image1' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image2' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image3' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        // dd($data);
        // Store main image
        if ($req->hasFile('image')) {
            $file = $req->file('image');
            $path = $file->store('images', 'public');
            $data['image'] = $path;
        }

        // Create product
        $product = Product::create([
            'name' => $data['name'],
            'price' => $data['price'],
            'discount_price' => $data['discount_price'] ?? null,
            'instock' => $data['instock'],
            'description' => $data['desc'],
            'image' => $data['image'],
            'category_id' => $data['category_id'],
            'subcategory_id' => $data['subcategory_id'],
            'sub_subcategory_id' => $data['sub_subcategory_id'],
            'added_by' => Auth::user()->id,
            'status' => 'Pending',
        ]);

        // Handle optional extra images - save to productimages table
        $imageFields = ['image1', 'image2', 'image3'];

        foreach ($imageFields as $field) {
            if ($req->hasFile($field)) {
                $file = $req->file($field);
                $path = $file->store('images', 'public');

                // Create product image record with proper product_id
                Productimage::create([
                    'product_id' => $product->id,
                    'image' => $path,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Product added successfully!');

    }

    public function editProduct($id)
    {
        $product = Product::findOrFail($id);
        // dd($product);
        $categories = Category::all();

        return Inertia::render('EditProduct', [
            'product' => $product,
            'categories' => $categories,
        ]);
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

        $products = Product::leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.category as category')
            ->where('products.status', 'Approved')
            ->get();
        // ->paginate(5);
        $categories = Category::all();
        // dd($products);
        // dd($products);

        // return "We are facing some issues. Please try again later.";

        return Inertia::render('Product',
            [
                'products' => $products,
                'categories' => $categories,
            ]
        );
    }

    public function productDetails($id)
    {
        $product = Product::leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.category as category')
            ->where('products.id', $id)
            ->first();

        if (! $product) {
            return redirect()->back()->with('error', 'Product not found!');
        }

        // Fetch product images
        $productImages = Productimage::where('product_id', $id)->get();

        // Calculate delivery date (current date + 3 days)
        $deliveryDate = now()->addDays(3);

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'productImages' => $productImages,
            'deliveryDate' => $deliveryDate,
        ]);
    }
}
