<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\WebsiteSetting;
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
                        ->count();
                }
                return 0;
            },
            'websiteSettings' => function () {
                $settings = WebsiteSetting::getSettings();

                return [
                    'admin_login_slug' => $settings->admin_login_slug,
                    'website_name' => $settings->website_name,
                    'website_logo' => $settings->website_logo,
                ];
            },
        ]);
    }
}
