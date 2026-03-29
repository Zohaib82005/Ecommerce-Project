<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/categories', [CategoryController::class, 'getAllCategories']);
Route::get('/subcategories/{categoryId}', [CategoryController::class, 'getSubcategoriesByCategory']);
Route::get('/sub-subcategories/{subcategoryId}', [CategoryController::class, 'getSubSubcategoriesBySubcategory']);
