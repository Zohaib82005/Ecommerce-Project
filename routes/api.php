<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\DealsController;
use App\Http\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/categories', [CategoryController::class, 'getAllCategories']);
Route::get('/subcategories/{categoryId}', [CategoryController::class, 'getSubcategoriesByCategory']);
Route::get('/sub-subcategories/{subcategoryId}', [CategoryController::class, 'getSubSubcategoriesBySubcategory']);

//fetching reviews

Route::get('/reviews/product/{productId}', [ReviewController::class, 'getReviewsByProduct']);
Route::get('/reviews/product/{productId}/average', [ReviewController::class, 'getAverageRating']);

// Fetch active deals
Route::get('/deals/active', [DealsController::class, 'getActiveDeal']);

// Product API endpoints
Route::get('/products/categories-with-products', [ProductController::class, 'getCategoriesWithProducts']);
Route::get('/products/category/{categoryId}', [ProductController::class, 'getProductsByCategory']);

Route::get('/locations/countries', function () {
    $apiKey = config('services.countrystatecity.key');

    if (!$apiKey) {
        return response()->json(['message' => 'Country API key is not configured.'], 500);
    }

    $response = Http::withHeaders([
        'X-CSCAPI-KEY' => $apiKey,
    ])->get('https://api.countrystatecity.in/v1/countries');

    if (!$response->successful()) {
        return response()->json([
            'message' => 'Failed to fetch countries.',
            'status' => $response->status(),
        ], $response->status());
    }

    return response()->json($response->json());
});

Route::get('/locations/countries/{countryCode}/states', function (string $countryCode) {
    $apiKey = config('services.countrystatecity.key');

    if (!$apiKey) {
        return response()->json(['message' => 'Country API key is not configured.'], 500);
    }

    $response = Http::withHeaders([
        'X-CSCAPI-KEY' => $apiKey,
    ])->get("https://api.countrystatecity.in/v1/countries/{$countryCode}/states");

    if (!$response->successful()) {
        return response()->json([
            'message' => 'Failed to fetch states.',
            'status' => $response->status(),
        ], $response->status());
    }

    return response()->json($response->json());
});

Route::get('/locations/countries/{countryCode}/states/{stateCode}/cities', function (string $countryCode, string $stateCode) {
    $apiKey = config('services.countrystatecity.key');

    if (!$apiKey) {
        return response()->json(['message' => 'Country API key is not configured.'], 500);
    }

    $response = Http::withHeaders([
        'X-CSCAPI-KEY' => $apiKey,
    ])->get("https://api.countrystatecity.in/v1/countries/{$countryCode}/states/{$stateCode}/cities");

    if (!$response->successful()) {
        return response()->json([
            'message' => 'Failed to fetch cities.',
            'status' => $response->status(),
        ], $response->status());
    }

    return response()->json($response->json());
});