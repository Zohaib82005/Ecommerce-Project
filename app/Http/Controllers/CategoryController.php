<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use App\Models\Image;
use App\Models\Sub_subcategory;

class CategoryController extends Controller
{
    public function getAllCategories()
    {
        $categories = Category::with('subcategories.subSubcategories', 'images')->get();
        return response()->json($categories);
    }

    public function getSubcategoriesByCategory($categoryId)
    {
        
        $subcategories = Subcategory::where('category_id', $categoryId)->get();
        // dd($subcategories);
        return response()->json($subcategories);
    }

    public function getSubSubcategoriesBySubcategory($subcategoryId)
    {
        $subSubcategories = Sub_subcategory::where('subcategory_id', $subcategoryId)->get();
        return response()->json($subSubcategories);
    }

    public function addSubcategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        try {
            $subcategory = Subcategory::create([
                'name' => $request->name,
                'category_id' => $request->category_id,
            ]);

            // Handle image upload if provided
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('subcategories', 'public');
                
                Image::create([
                    'url' => $imagePath,
                    'category_id' => null,
                    'subcategory_id' => $subcategory->id,
                    'sub_subcategory_id' => null,
                ]);
            }
            return redirect()->back()->with('success', 'Sub-category added successfully');
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function addSubSubcategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'subcategory_id' => 'required|exists:subcategories,id',
        ]);

        try {
            $subSubcategory = Sub_subcategory::create([
                'name' => $request->name,
                'subcategory_id' => $request->subcategory_id,
            ]);

            // Handle image upload if provided
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('sub-subcategories', 'public');
                
                Image::create([
                    'url' => $imagePath,
                    'category_id' => null,
                    'subcategory_id' => null,
                    'sub_subcategory_id' => $subSubcategory->id,
                ]);
            }

            return redirect()->back()->with('success', 'Sub-sub-category added successfully');
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
