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
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\HomeController; 
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\MailController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\DealsController;


Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/login', function () {
    return Inertia::render('Login');
});

Route::post('/submitreg', [UserController::class, 'register']);
Route::post('/submitlog', [UserController::class, 'Login']);

// Public category routes
Route::get('/api/categories', [CategoryController::class, 'getAllCategories']);

// ========== ADMIN ROUTES (Admin only) ==========
Route::middleware([CheckAdmin::class])->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);
    Route::post('/addcate', [ProductController::class, 'addcate']);
    Route::post('/add-subcategory', [CategoryController::class, 'addSubcategory']);
    Route::post('/add-sub-subcategory', [CategoryController::class, 'addSubSubcategory']);
    Route::get('/approve/{id}', [AdminController::class, 'approveProduct']);
    Route::get('/reject/{id}', [AdminController::class, 'rejectProduct']);
    Route::post('/admin/user/update', [AdminController::class, 'updateUser']);
});

// ========== SELLER ROUTES (Seller only) ==========
Route::middleware([CheckSeller::class])->group(function () {
    Route::get('/seller', [UserController::class, 'sellerDashboard']);
    Route::post('/addProduct', [ProductController::class, 'addProduct']);
    Route::get('/seller/editProduct/{id}', [ProductController::class, 'editProduct']);
    Route::get('/seller/deleteProduct/{id}', [ProductController::class, 'deleteProduct']);
    Route::post('/orders/update-status', [OrderController::class, 'updateStatus']);
    
    // Deals management routes
    Route::get('/seller/deals', [DealsController::class, 'index']);
    Route::post('/seller/deals/store', [DealsController::class, 'store']);
    Route::post('/seller/deals/update/{id}', [DealsController::class, 'update']);
    Route::delete('/seller/deals/delete/{id}', [DealsController::class, 'destroy']);
    
    // Product image management routes
    Route::get('/product-images/{productId}', [ImageController::class, 'getProductImages']);
    Route::delete('/product-images/{imageId}', [ImageController::class, 'deleteProductImage']);
    Route::post('/product-images/{productId}', [ImageController::class, 'uploadProductImage']);
});

// ========== CUSTOMER ROUTES (Customer only) ==========
Route::middleware([CheckCustomer::class])->group(function () {
    Route::get('/dashboard', [UserController::class, 'dashboard']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::get('/cart', [CartController::class, 'viewCart']);
    Route::delete('/cart/remove/{id}', [CartController::class, 'removeFromCart']);
    Route::get('/checkout', [CheckoutController::class, 'showCheckout']);
    Route::post('/success', [OrderController::class, 'success']);
    Route::get('/addtowishlist/{id}', [WishlistController::class, 'addToWishlist']);
    Route::get('/remove-wishlist/{id}', [WishlistController::class, 'removeFromWishlist']);
    
    // Address management routes with prefix
    Route::prefix('addresses')->group(function () {
        Route::post('/', [AddressController::class, 'store'])->name('addresses.store');
        Route::get('/', [AddressController::class, 'index'])->name('addresses.index');
        Route::put('/{id}', [AddressController::class, 'update'])->name('addresses.update');
        Route::delete('/{id}', [AddressController::class, 'destroy'])->name('addresses.destroy');
    });

    Route::prefix('reviews')->group(function () {
        Route::post('/submit', [ReviewController::class, 'submitReview'])->name('reviews.submit');
    });
});

Route::get('/products', [ProductController::class, 'products']);

Route::get('/product/details/{id}',[ProductController::class,'productDetails']);

Route::get('/category/{id}', function ($id) {
    return Inertia::render('CategoryWiseProducts', ['categoryId' => $id]);
})->name('category.products');

Route::get('/super', function () {
    return Inertia::render('SuperAdminDashboard');
});
Route::get('/cart/count', [CartController::class, 'getCartCount']);

Route::get('/logout', function () {
    Auth::logout();
    return redirect('/');
});

Route::get('/verify/otp', function () {
    return Inertia::render('otp');
})->name('verify-otp');

Route::get('/send-email', [MailController::class, 'sendEmail']);
Route::post('/verify-otp', [MailController::class, 'verifyOtp'])->name('verify.otp');