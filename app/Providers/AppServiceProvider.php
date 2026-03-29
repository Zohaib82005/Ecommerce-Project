<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share cart count with all Inertia responses
        Inertia::share([
            'cartCount' => function () {
                if (Auth::check()) {
                    return Cart::where('user_id', Auth::id())
                        ->where('status', 'active')
                        ->sum('quantity');
                }
                return 0;
            },
        ]);
    }
}
