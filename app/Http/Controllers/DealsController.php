<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flashdeal;
use App\Models\Flashdeals_product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class DealsController extends Controller
{
    /**
     * Store a newly created deal in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'deal_name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'products' => 'required|array|min:1',
            'products.*' => 'exists:products,id',
        ]);

        try {
            // Create the flashdeal
            $deal = Flashdeal::create([
                'title' => $validated['deal_name'],
                'slug' => Str::slug($validated['deal_name']) . '-' . time(),
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => true,
                'created_by' => Auth::id(),
            ]);

            // Attach products to the deal
            foreach ($validated['products'] as $productId) {
                $dealData = [
                    'flashdeal_id' => $deal->id,
                    'product_id' => $productId,
                ];

                // Store discount based on type
                if ($validated['discount_type'] === 'percentage') {
                    $dealData['discount_percentage'] = $validated['discount_value'];
                } else {
                    $dealData['discount_amount'] = $validated['discount_value'];
                }

                Flashdeals_product::create($dealData);
            }

            return redirect()->back()->with('success', 'Deal created successfully!');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create deal: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Fetch all deals for the logged-in seller.
     */
    public function index()
    {
        try {
            $deals = Flashdeal::where('created_by', Auth::id())
                ->with('products')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($deal) {
                    return [
                        'id' => $deal->id,
                        'title' => $deal->title,
                        'slug' => $deal->slug,
                        'start_date' => $deal->start_date,
                        'end_date' => $deal->end_date,
                        'status' => $deal->status,
                        'created_at' => $deal->created_at,
                        'products_count' => $deal->products->count(),
                        'products' => $deal->products->map(function ($product) {
                            return [
                                'id' => $product->id,
                                'name' => $product->name,
                                'price' => (float) $product->price,
                                'discount_price' => (float) ($product->discount_price ?? 0),
                                'discount_type' => $product->discount_type ?? 'percentage',
                                'discount_percentage_deal' => (float) ($product->pivot->discount_percentage ?? 0),
                                'discount_amount' => (float) ($product->pivot->discount_amount ?? 0),
                                'image' => $product->image,
                                'instock' => $product->instock,
                            ];
                        }),
                    ];
                });

            return response()->json([
                'success' => true,
                'deals' => $deals,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch deals: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a deal.
     */
    public function destroy($id)
    {
        try {
            $deal = Flashdeal::where('created_by', Auth::id())->findOrFail($id);
            
            // Delete associated products
            Flashdeals_product::where('flashdeal_id', $deal->id)->delete();
            
            // Delete the deal
            $deal->delete();

            return redirect()->back()->with('success', 'Deal Deleted Successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to Delete Deal');
        }
    }

    /**
     * Update a deal.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'deal_name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'products' => 'required|array|min:1',
            'products.*' => 'exists:products,id',
        ]);

        try {
            $deal = Flashdeal::where('created_by', Auth::id())->findOrFail($id);

            // Update deal details
            $deal->update([
                'title' => $validated['deal_name'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
            ]);

            // Delete old product associations
            Flashdeals_product::where('flashdeal_id', $deal->id)->delete();

            // Add new product associations
            foreach ($validated['products'] as $productId) {
                $dealData = [
                    'flashdeal_id' => $deal->id,
                    'product_id' => $productId,
                ];

                if ($validated['discount_type'] === 'percentage') {
                    $dealData['discount_percentage'] = $validated['discount_value'];
                } else {
                    $dealData['discount_amount'] = $validated['discount_value'];
                }

                Flashdeals_product::create($dealData);
            }

            return redirect()->back()->with('success', 'Deal Updated Successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update deal: ' . $e->getMessage());
        }
    }

    /**
     * Get all active deals with their products for the frontend
     */
    public function getActiveDeal()
    {
        try {
            $now = now();
            $today = $now->format('Y-m-d'); // For DATE columns

            // Fetch active deals (deals that have started but not ended)
            $deals = Flashdeal::where('status', '1')
                ->whereDate('start_date', '<=', $today)
                ->whereDate('end_date', '>=', $today)
                ->with('products')
                ->where('products.status', 'Approved')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($deal) {
                    return [
                        'id' => $deal->id,
                        'title' => $deal->title,
                        'slug' => $deal->slug,
                        'start_date' => $deal->start_date,
                        'end_date' => $deal->end_date,
                        'products' => $deal->products->map(function ($product) {
                            $originalPrice = (float) $product->price;
                            $dealDiscountPercentage = (float) ($product->pivot->discount_percentage ?? 0);
                            $dealDiscountAmount = (float) ($product->pivot->discount_amount ?? 0);

                            $dealDiscountType = $dealDiscountPercentage > 0 ? 'percentage' : 'fixed';
                            $dealDiscountValue = $dealDiscountPercentage > 0 ? $dealDiscountPercentage : $dealDiscountAmount;
                            $dealSavings = $dealDiscountType === 'percentage'
                                ? ($originalPrice * $dealDiscountValue / 100)
                                : $dealDiscountValue;
                            $dealSavings = min($originalPrice, max(0, $dealSavings));

                            return [
                                'id' => $product->id,
                                'name' => $product->name,
                                'price' => $originalPrice,
                                'discount_price' => (float) ($product->discount_price ?? 0),
                                'discount_type' => $product->discount_type ?? 'percentage',
                                'discount_percentage_deal' => $dealDiscountPercentage,
                                'discount_amount' => $dealDiscountAmount,
                                'effective_discount_source' => 'deal',
                                'effective_discount_type' => $dealDiscountType,
                                'effective_discount_value' => $dealDiscountValue,
                                'effective_savings' => round($dealSavings, 2),
                                'effective_final_price' => round(max(0, $originalPrice - $dealSavings), 2),
                                'image' => $product->image,
                                'instock' => $product->instock,
                            ];
                        })->toArray(),
                    ];
                });

            return response()->json([
                'success' => true,
            'deals' => $deals,
            'count' => $deals->count(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch deals: ' . $e->getMessage(),
        ], 500);
    }
}

}
