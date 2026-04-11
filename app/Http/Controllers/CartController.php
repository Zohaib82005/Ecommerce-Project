<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Flashdeals_product;
use Illuminate\Support\Facades\Auth;
use App\Models\Wishlist;
use App\Utils\PriceCalculator;
use Inertia\Inertia;
class CartController extends Controller
{
    private function getActiveDealPricingForProduct(int $productId, float $originalPrice): ?array
    {
        $today = now()->format('Y-m-d');

        $dealProduct = Flashdeals_product::where('product_id', $productId)
            ->whereHas('flashdeal', function ($query) use ($today) {
                $query->where('status', '1')
                    ->whereDate('start_date', '<=', $today)
                    ->whereDate('end_date', '>=', $today);
            })
            ->latest('id')
            ->first();

        if (!$dealProduct) {
            return null;
        }

        $dealPercentage = (float) ($dealProduct->discount_percentage ?? 0);
        $dealAmount = (float) ($dealProduct->discount_amount ?? 0);
        $discountType = $dealPercentage > 0 ? 'percentage' : 'fixed';
        $discountValue = $dealPercentage > 0 ? $dealPercentage : $dealAmount;

        if ($discountValue <= 0) {
            return null;
        }

        $savings = $discountType === 'percentage'
            ? ($originalPrice * $discountValue / 100)
            : $discountValue;
        $savings = min($originalPrice, max(0, $savings));

        return [
            'original_price' => round($originalPrice, 2),
            'discount_type' => $discountType,
            'discount_value' => $discountValue,
            'discount_amount' => round($savings, 2),
            'savings' => round($savings, 2),
            'final_price' => round(max(0, $originalPrice - $savings), 2),
            'discount_percentage' => $originalPrice > 0 ? round(($savings / $originalPrice) * 100, 2) : 0,
            'is_discounted' => true,
        ];
    }


    public function addToCart(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        $cart = Cart::select('id')->where('user_id', $user->id)->where('product_id', $validated['product_id'])->where('status','active')->first();

        if($cart){
            return redirect()->back()->with('error', 'Product already in cart!');
        }
        Cart::create([
            'user_id' => $user->id,
            'product_id' => $validated['product_id'],
            'quantity' => $validated['quantity'],
            'status' => 'active',
        ]);
        
        Wishlist::where('user_id', $user->id)->where('product_id', $validated['product_id'])->delete();
       

        return redirect()->back()->with('success', 'Product added to cart successfully!');
    }

    public function viewCart()
    {
        $user = Auth::user();
        $products = Product::join('carts', 'products.id', '=', 'carts.product_id')
            ->where('carts.user_id', $user->id)
            ->where('carts.status', 'active')
            ->select('products.*', 'carts.id as cart_item_id', 'carts.quantity as quantity')
            ->get()
            ->map(function ($product) {
                $originalPrice = (float) $product->price;
                $dealPricing = $this->getActiveDealPricingForProduct((int) $product->id, $originalPrice);

                // Active deal takes priority; otherwise use product discount.
                $priceCalc = $dealPricing ?: PriceCalculator::calculate(
                    $originalPrice,
                    $product->discount_price ?? 0,
                    $product->discount_type ?? 'percentage'
                );

                $effectiveDiscountType = $dealPricing['discount_type'] ?? ($product->discount_type ?? 'percentage');
                $effectiveDiscountValue = $dealPricing['discount_value'] ?? ($product->discount_price ?? 0);

                return array_merge($product->toArray(), [
                    'final_price' => $priceCalc['final_price'],
                    'discount_amount' => $priceCalc['discount_amount'],
                    'discount_percentage' => $priceCalc['discount_percentage'],
                    'is_discounted' => $priceCalc['is_discounted'],
                    'savings' => $priceCalc['savings'],
                    'discount_type' => $effectiveDiscountType,
                    'discount_price' => $effectiveDiscountValue,
                    'effective_discount_source' => $dealPricing ? 'deal' : 'product',
                ]);
            });

        if (!$products || $products->isEmpty()) {
            return Inertia::render('Cart', ['products' => []]);
        }

        return Inertia::render('Cart', ['products' => $products]);
    }

    //update status to removed
    public function removeFromCart($id)
    {
        // dd($id);
        $cartItem = Cart::find($id);
        if ($cartItem) {
            
            $cartItem->update(['status' => 'removed']);
            return redirect()->back()->with('success', 'Item removed from cart successfully!');
        }

        return redirect()->back()->with('error', 'Cart item not found!');
    }
}
