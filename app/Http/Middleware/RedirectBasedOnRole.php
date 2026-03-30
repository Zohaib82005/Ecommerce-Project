<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only redirect if user is authenticated and on public routes like home
        if (Auth::check()) {
            // List of routes where redirects should NOT happen (e.g., logout, API endpoints, etc.)
            $excludedRoutes = [
                'login',
                'register',
                'submitreg',
                'submitlog',
                'logout',
                'api/',
                'product',
            ];

            $shouldExclude = false;
            foreach ($excludedRoutes as $route) {
                if ($request->routeIs($route . '*') || str_contains($request->path(), $route)) {
                    $shouldExclude = true;
                    break;
                }
            }

            // If on home page or public route, redirect based on role
            if (!$shouldExclude && ($request->path() === '/' || $request->routeIs('home'))) {
                $userRole = Auth::user()->role;

                if ($userRole === 'Admin') {
                    return redirect('/admin');
                } elseif ($userRole === 'Seller') {
                    return redirect('/seller');
                }
                // Allow customers to stay on home page
            }
        }

        return $next($request);
    }
}
