<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Addresse;
use App\Models\Flashdeals_product;
use App\Utils\PriceCalculator;
use Illuminate\Support\Facades\Auth;


class CheckoutController extends Controller
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
            'discount_type' => $discountType,
            'discount_value' => $discountValue,
            'savings' => round($savings, 2),
            'final_price' => round(max(0, $originalPrice - $savings), 2),
            'discount_percentage' => $originalPrice > 0 ? round(($savings / $originalPrice) * 100, 2) : 0,
            'discount_amount' => round($savings, 2),
            'is_discounted' => $savings > 0,
        ];
    }

    public function showCheckout()
    {

        // $cart = Cart::where('user_id', Auth::id())->first();
        // if (!$cart) {
        //     return Inertia::render('Checkout', ['cartItems' => []]);
        // }
        $products = Product::join('carts', 'products.id', '=', 'carts.product_id')
            ->select('products.*', 'carts.quantity as quantity', 'carts.id as cart_item_id')
            // ->where('carts.id', $cart->id)
            ->where('carts.user_id', Auth::id())
            ->where('carts.status', 'active')
            ->get();

        $products = $products->map(function ($product) {
            $originalPrice = (float) $product->price;
            $dealPricing = $this->getActiveDealPricingForProduct((int) $product->id, $originalPrice);

            $priceCalc = $dealPricing ?: PriceCalculator::calculate(
                $originalPrice,
                $product->discount_price ?? 0,
                $product->discount_type ?? 'percentage'
            );

            $product->final_price = $priceCalc['final_price'];
            $product->discount_amount = $priceCalc['discount_amount'];
            $product->discount_percentage = $priceCalc['discount_percentage'];
            $product->is_discounted = $priceCalc['is_discounted'];
            $product->discount_type = $dealPricing['discount_type'] ?? ($product->discount_type ?? 'percentage');
            $product->discount_price = $dealPricing['discount_value'] ?? ($product->discount_price ?? 0);
            $product->effective_discount_source = $dealPricing ? 'deal' : 'product';

            return $product;
        });

            if(!$products){
                return Inertia::render('Checkout', ['cartItems' => []]);
            }
        // dd($products);

        $address = Addresse::where('user_id', Auth::id())->latest();
        // $products = Product::join()
        return Inertia::render('Checkout', ['cartItems' => $products, 'address' => $address]);
    }
}
