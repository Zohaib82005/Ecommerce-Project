<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Middleware\CheckAdmin;
use Illuminate\Support\Facades\Route;

Route::middleware([CheckAdmin::class])->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);

    Route::post('/admin/addProduct', [ProductController::class, 'addProduct']);
    Route::get('/admin/editProduct/{id}', [ProductController::class, 'editProduct']);
    Route::post('/admin/updateProduct/{id}', [ProductController::class, 'updateProduct']);

    Route::post('/addcate', [ProductController::class, 'addcate']);
    Route::post('/add-subcategory', [CategoryController::class, 'addSubcategory']);
    Route::post('/add-sub-subcategory', [CategoryController::class, 'addSubSubcategory']);

    Route::get('/approve/{id}', [AdminController::class, 'approveProduct']);
    Route::get('/reject/{id}', [AdminController::class, 'rejectProduct']);

    Route::post('/admin/user/update', [AdminController::class, 'updateUser']);
    Route::delete('/admin/user/delete/{id}', [AdminController::class, 'deleteUser']);

    Route::post('/admin/category/update', [AdminController::class, 'updateCategory']);
    Route::post('/admin/category/delete', [AdminController::class, 'deleteCategory']);
    Route::post('/admin/orders/update-status', [OrderController::class, 'updateStatus']);
    Route::post('/admin/banners', [BannerController::class, 'store']);
    Route::delete('/admin/banners/{id}', [BannerController::class, 'destroy']);
    Route::post('/admin/promotions', [BannerController::class, 'storePromotion']);
    Route::delete('/admin/promotions/{id}', [BannerController::class, 'destroyPromotion']);

    Route::post('/admin/website-settings/update', [AdminController::class, 'updateWebsiteSettings']);
});
