<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Review;
class ReviewController extends Controller
{
    public function submitReview(Request $request)
    {
        // dd($request);
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Assuming you have a Review model and a reviews table
        \App\Models\Review::create([
            'user_id' => Auth::user()->id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return redirect()->back()->with('success', 'Review submitted successfully!');
    }

    public function getReviewsByProduct($productId)
    {
        $reviews = Review::where('product_id', $productId)->with('user')->get();
        return response()->json($reviews);
    }

    public function getAverageRating($productId)
    {
        $averageRating = Review::where('product_id', $productId)->avg('rating');
        $totalReviews = Review::where('product_id', $productId)->count();
        return response()->json([
            'average_rating' => round($averageRating, 2),
            'total_reviews' => $totalReviews,
        ]);
    }
}
