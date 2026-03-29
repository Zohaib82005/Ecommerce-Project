<?php

namespace App\Http\Controllers;

use App\Models\Productimage;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Get all images for a specific product
     */
    public function getProductImages($productId)
    {
        $product = Product::findOrFail($productId);
        $images = Productimage::where('product_id', $productId)->get();
        
        return response()->json([
            'main_image' => $product->image,
            'extra_images' => $images
        ]);
    }

    /**
     * Delete an extra image from a product
     */
    public function deleteProductImage($imageId)
    {
        $image = Productimage::findOrFail($imageId);
        
        // Delete file from storage
        if ($image->image) {
            Storage::disk('public')->delete($image->image);
        }
        
        $image->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully'
        ]);
    }

    /**
     * Upload additional images for an existing product
     */
    public function uploadProductImage(Request $request, $productId)
    {
        $request->validate([
            'image1' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image2' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image3' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $product = Product::findOrFail($productId);
        
        $imageFields = ['image1', 'image2', 'image3'];
        $uploadedCount = 0;
        
        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $path = $file->store('images', 'public');
                
                Productimage::create([
                    'product_id' => $product->id,
                    'image' => $path
                ]);
                
                $uploadedCount++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => $uploadedCount . ' image(s) uploaded successfully',
            'images_uploaded' => $uploadedCount
        ]);
    }
}
