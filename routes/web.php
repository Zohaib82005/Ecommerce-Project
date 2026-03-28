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
use App\Http\Controllers\AdminController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\AddressController;

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
    Route::get('/admin', [AdminController::class, 'index']);
    Route::post('/addcate', [ProductController::class, 'addcate']);
    Route::get('/approve/{id}', [AdminController::class, 'approveProduct']);
    Route::get('/reject/{id}', [AdminController::class, 'rejectProduct']);
    // Admin - update user (edit from admin panel)
    Route::post('/admin/user/update', [AdminController::class, 'updateUser']);
});


// customer routes
Route::middleware([CheckCustomer::class])->group(function () {
    Route::get('/dashboard',[UserController::class,'dashboard']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    
    Route::get('/cart', [CartController::class, 'viewCart']);
    Route::delete('/cart/remove/{id}', [CartController::class, 'removeFromCart']);
    Route::get('/checkout', [CheckoutController::class, 'showCheckout']);
    Route::post('/success',[OrderController::class, 'success']);
    Route::get('/addtowishlist/{id}', [WishlistController::class, 'addToWishlist']);
    Route::get('/remove-wishlist/{id}', [WishlistController::class, 'removeFromWishlist']);
    
    // Address management routes with prefix
    Route::prefix('addresses')->group(function () {
        // Store new address to database
        Route::post('/', [AddressController::class, 'store'])->name('addresses.store');
        
        // Get all user addresses
        Route::get('/', [AddressController::class, 'index'])->name('addresses.index');
        
        // Update specific address
        Route::put('/{id}', [AddressController::class, 'update'])->name('addresses.update');
        
        // Delete specific address
        Route::delete('/{id}', [AddressController::class, 'destroy'])->name('addresses.destroy');
    });
});

Route::get('/products', [ProductController::class, 'products']);

Route::get('/product/details/{id}',[ProductController::class,'productDetails']);

Route::get('/super', function () {
    return Inertia::render('SuperAdminDashboard');
});
