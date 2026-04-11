<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Category;
use App\Models\Product;


class HomeController extends Controller
{
    public function index()
    {
        // Fetch main categories for the welcome scrolling strip
        $categories = Category::all();
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

