<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Review;
use App\Models\Product;

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

    /**
     * Get all reviews for a seller's products
     */
    public function getSellerReviews()
    {
        $sellerId = Auth::user()->id;
        
        // Get all reviews for products sold by the current seller
        $reviews = Review::whereHas('product', function ($query) use ($sellerId) {
            $query->where('added_by', $sellerId);
        })
        ->with(['product', 'user'])
        ->orderBy('created_at', 'desc')
        ->get();

        // Group reviews by product
        $groupedReviews = $reviews->groupBy('product_id');

        return response()->json([
            'reviews' => $reviews,
            'grouped_reviews' => $groupedReviews
        ]);
    }

    /**
     * Reply to a review as a seller
     */
    public function replyToReview(Request $request, $reviewId)
    {
        $request->validate([
            'seller_reply' => 'required|string|max:1000',
        ]);

        $review = Review::find($reviewId);

        if (!$review) {
            return response()->json(['error' => 'Review not found'], 404);
        }

        // Verify the current user is the seller of this product
        $product = Product::find($review->product_id);
        if ($product->added_by !== Auth::user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $review->seller_reply = $request->seller_reply;
        $review->seller_replied_at = now();
        $review->save();

        return redirect()->back()->with('success', 'Reply added successfully!');
    }

    /**
     * Delete a seller reply
     */
    public function deleteSellerReply($reviewId)
    {
        $review = Review::find($reviewId);

        if (!$review) {
            return response()->json(['error' => 'Review not found'], 404);
        }

        // Verify the current user is the seller of this product
        $product = Product::find($review->product_id);
        if ($product->added_by !== Auth::user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $review->seller_reply = null;
        $review->seller_replied_at = null;
        $review->save();

        return redirect()->back()->with('success', 'Reply deleted successfully!');
    }
}

