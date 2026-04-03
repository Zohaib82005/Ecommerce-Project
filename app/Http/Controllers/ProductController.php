<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Productimage;
use App\Utils\PriceCalculator;
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
        /**
         * Updated validation to support both percentage and fixed discount types
         * - If discount_type is 'percentage': discount_price should be 0-100
         * - If discount_type is 'fixed': discount_price should be less than price
         * - Default is 'percentage' for backward compatibility
         */
        $data = $req->validate([
            'name' => 'required',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|in:percentage,fixed',
            'instock' => 'required|numeric|min:0',
            'desc' => 'required',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'sub_subcategory_id' => 'nullable|exists:sub_subcategories,id',
            'image1' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image2' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image3' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Store main image
        if ($req->hasFile('image')) {
            $file = $req->file('image');
            $path = $file->store('images', 'public');
            $data['image'] = $path;
        }

        // Use PriceCalculator to ensure final_price is calculated and validated
        $priceCalculation = PriceCalculator::calculate(
            $data['price'],
            $data['discount_price'] ?? null,
            $data['discount_type'] ?? 'percentage'
        );

        // Create product with calculated final price
        $product = Product::create([
            'name' => $data['name'],
            'price' => $data['price'],
            'discount_price' => $data['discount_price'] ?? null,
            'discount_type' => $priceCalculation['discount_type'],
            'final_price' => $priceCalculation['final_price'],
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

    public function updateProduct(Request $req, $id)
    {
        $product = Product::findOrFail($id);

        $data = $req->validate([
            'name' => 'required',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|in:percentage,fixed',
            'instock' => 'required|numeric|min:0',
            'description' => 'required',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'sub_subcategory_id' => 'nullable|exists:sub_subcategories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image1' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image2' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image3' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Handle main image update
        if ($req->hasFile('image')) {
            // Delete old image if it exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $file = $req->file('image');
            $path = $file->store('images', 'public');
            $data['image'] = $path;
        }

        // Use PriceCalculator for consistent price updates
        $priceCalculation = PriceCalculator::calculate(
            $data['price'],
            $data['discount_price'] ?? null,
            $data['discount_type'] ?? 'percentage'
        );

        // Update product fields
        $product->fill(array_merge($data, [
            'final_price' => $priceCalculation['final_price'],
            'discount_type' => $priceCalculation['discount_type'],
            'description' => $data['description'],
        ]));

        $product->save();

        // Handle optional extra images
        $imageFields = ['image1', 'image2', 'image3'];
        foreach ($imageFields as $field) {
            if ($req->hasFile($field)) {
                $file = $req->file($field);
                $path = $file->store('images', 'public');
                Productimage::create([
                    'product_id' => $product->id,
                    'image' => $path,
                ]);
            }
        }

        return redirect('/seller')->with('success', 'Product updated successfully!');
    }

    public function editProduct($id)
    {
        $product = Product::findOrFail($id);
        $categories = Category::all();
        $productImages = Productimage::where('product_id', $id)->get();

        return Inertia::render('EditProduct', [
            'product' => $product,
            'categories' => $categories,
            'product_images' => $productImages,
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
            ->get()
            ->map(function ($product) {
                // Use PriceCalculator for consistent calculations
                $priceCalc = $product->getPriceCalculation();
                
                return array_merge($product->toArray(), [
                    'final_price' => $priceCalc['final_price'],
                    'discount_amount' => $priceCalc['discount_amount'],
                    'discount_percentage' => $priceCalc['discount_percentage'],
                    'is_discounted' => $priceCalc['is_discounted'],
                    'savings' => $priceCalc['savings'],
                ]);
            });

        $categories = Category::all();

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

        if (!$product) {
            return redirect()->back()->with('error', 'Product not found!');
        }

        // Fetch product images
        $productImages = Productimage::where('product_id', $id)->get();

        // Calculate delivery date (current date + 3 days)
        $deliveryDate = now()->addDays(3);

        // Ensure final_price is calculated if not already in DB
        $priceCalc = $product->getPriceCalculation();
        $product->final_price = $priceCalc['final_price'];
        $product->discount_amount = $priceCalc['discount_amount'];
        $product->discount_percentage = $priceCalc['discount_percentage'];
        $product->is_discounted = $priceCalc['is_discounted'];

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'productImages' => $productImages,
            'deliveryDate' => $deliveryDate,
        ]);
    }

    /**
     * API endpoint - Get all categories with their products
     * Uses centralized PriceCalculator for consistent discount application
     */
    public function getCategoriesWithProducts()
    {
        try {
            $categories = Category::all()->map(function ($category) {
                $products = Product::where('category_id', $category->id)
                    ->where('status', 'Approved')
                    ->limit(4)
                    ->get()
                    ->map(function ($product) {
                        // Use PriceCalculator for consistent price calculations
                        $priceCalc = $product->getPriceCalculation();

                        return [
                            'id' => $product->id,
                            'name' => $product->name,
                            'price' => $product->price,
                            'discount_price' => $product->discount_price ?? 0,
                            'discount_type' => $product->discount_type ?? 'percentage',
                            'final_price' => $priceCalc['final_price'],
                            'discount_amount' => $priceCalc['discount_amount'],
                            'discount_percentage' => $priceCalc['discount_percentage'],
                            'image' => $product->image,
                            'savings' => $priceCalc['savings'],
                            'is_discounted' => $priceCalc['is_discounted'],
                        ];
                    });

                return [
                    'id' => $category->id,
                    'name' => $category->category,
                    'image' => $category->image,
                    'productCount' => Product::where('category_id', $category->id)->where('status', 'Approved')->count(),
                    'products' => $products,
                ];
            })->filter(fn($cat) => $cat['productCount'] > 0);

            return response()->json([
                'success' => true,
                'categories' => $categories->values(),
                'total' => $categories->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching categories: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API endpoint - Get all products by category
     * Uses centralized PriceCalculator for consistent discount application
     */
    public function getProductsByCategory($categoryId)
    {
        try {
            $category = Category::find($categoryId);
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found',
                ], 404);
            }

            // Get paginated products with consistent price calculations
            $productsPaginated = Product::where('category_id', $categoryId)
                ->orderBy('created_at', 'desc')
                ->paginate(12);

            $products = $productsPaginated->map(function ($product) {
                // Use PriceCalculator for consistent price calculations
                $priceCalc = $product->getPriceCalculation();

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'discount_price' => $product->discount_price ?? 0,
                    'discount_type' => $product->discount_type ?? 'percentage',
                    'final_price' => $priceCalc['final_price'],
                    'discount_amount' => $priceCalc['discount_amount'],
                    'discount_percentage' => $priceCalc['discount_percentage'],
                    'image' => $product->image,
                    'savings' => $priceCalc['savings'],
                    'is_discounted' => $priceCalc['is_discounted'],
                    'status' => $product->status,
                ];
            })->toArray();

            return response()->json([
                'success' => true,
                'category' => [
                    'id' => $category->id,
                    'name' => $category->category,
                    'image' => $category->image,
                ],
                'products' => $products,
                'pagination' => [
                    'total' => $productsPaginated->total(),
                    'per_page' => $productsPaginated->perPage(),
                    'current_page' => $productsPaginated->currentPage(),
                    'last_page' => $productsPaginated->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching products: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper function to calculate savings
     */
    private function calculateSavings($price, $discount)
    {
        if ($discount && $price) {
            return round($price * $discount / 100);
        }
        return 0;
    }
}
