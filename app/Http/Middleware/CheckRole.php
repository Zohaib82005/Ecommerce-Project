<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $roles  Comma-separated list of allowed roles
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        try {
            $allowedRoles = array_map('trim', explode(',', $roles));
            
            if (Auth::check() && (Auth::user()->role == 'Admin' || Auth::user()->role == 'Seller')) {
                return $next($request);
            }

            
        } catch (\Exception $e) {
            return "Facing Issues". $e->getMessage();
            return redirect('/login');
        }

        return redirect('/login')->with('error', 'Unauthorized access. Your role does not have permission to access this page.');
    }
}
