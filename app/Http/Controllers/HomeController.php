<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Sub_subcategory;
use App\Models\Product;
use App\Models\Image;


class HomeController extends Controller
{
    public function index()
    {
        // Fetch all categories with their images stored directly in the column
        $categories = Subcategory::all();
        // dd($categories);
        
        // Fetch products grouped by category for various sections
        // Use PriceCalculator to ensure final_price is included
        $topPicks = Product::where('status', 'Approved')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($product) {
                $priceCalc = $product->getPriceCalculation();
                return array_merge($product->toArray(), [
                    'final_price' => $priceCalc['final_price'],
                    'discount_amount' => $priceCalc['discount_amount'],
                    'discount_percentage' => $priceCalc['discount_percentage'],
                    'is_discounted' => $priceCalc['is_discounted'],
                    'savings' => $priceCalc['savings'],
                ]);
            });
        
        $dealsOfTheDay = Product::where('status', 'Approved')
            ->whereNotNull('discount_price')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($product) {
                $priceCalc = $product->getPriceCalculation();
                return array_merge($product->toArray(), [
                    'final_price' => $priceCalc['final_price'],
                    'discount_amount' => $priceCalc['discount_amount'],
                    'discount_percentage' => $priceCalc['discount_percentage'],
                    'is_discounted' => $priceCalc['is_discounted'],
                    'savings' => $priceCalc['savings'],
                ]);
            });
        
        // You can add more sections as needed
        
        return Inertia::render('welcome', [
            'categories' => $categories,
            'topPicks' => $topPicks,
            'dealsOfTheDay' => $dealsOfTheDay,
        ]);
    }
}

