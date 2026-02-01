<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckAdmin;
use App\Http\Middleware\CheckSeller;
use App\Http\Middleware\CheckCustomer;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/login', function () {
    return Inertia::render('Login');
});

Route::get('/register', function () {
    return Inertia::render('Register');
});

Route::post('/submitreg', [UserController::class, 'register']);
Route::post('/submitlog', [UserController::class, 'Login']);

// seller routes
Route::middleware([CheckSeller::class])->group(function () {
    Route::get('/seller', [UserController::class, 'sellerDashboard']);
    Route::post('/addProduct', [ProductController::class, 'addProduct']);
    Route::get('/seller/editProduct/{id}', [ProductController::class, 'editProduct']);
    Route::get('/seller/deleteProduct/{id}', [ProductController::class, 'deleteProduct']);
    Route::post('/orders/update-status', [OrderController::class, 'updateStatus']);
});

//admin routes
Route::middleware([CheckAdmin::class])->group(function () {
    Route::get('/admin', [UserController::class, 'adminDashboard']);
    Route::post('/addcate', [ProductController::class, 'addcate']);
});


// customer routes
Route::middleware([CheckCustomer::class])->group(function () {
    Route::get('/dashboard',[UserController::class,'dashboard']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    
    Route::get('/cart', [CartController::class, 'viewCart']);
    Route::get('/cart/remove/{id}', [CartController::class, 'removeFromCart']);
    Route::get('/checkout', [CheckoutController::class, 'showCheckout']);
    Route::post('/success/{id}',[OrderController::class, 'success']);
});

Route::get('/products', [ProductController::class, 'products']);





Route::get('/product/details/{id}',[ProductController::class,'productDetails']);

Route::get('/super', function () {
    return Inertia::render('SuperAdminDashboard');
});
