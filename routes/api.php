<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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