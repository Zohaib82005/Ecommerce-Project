<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\Product;
use App\Models\Cart;
use App\Models\Addresse;
use App\Models\Flashdeals_product;
use App\Utils\PriceCalculator;
class OrderController extends Controller
{
    private function convertFromMyr(float $amountMyr, float $myrRate, float $targetRate): float
    {
        if ($myrRate <= 0 || $targetRate <= 0) {
            return $amountMyr;
        }

        return ($amountMyr / $myrRate) * $targetRate;
    }

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
            'final_price' => round(max(0, $originalPrice - $savings), 2),
        ];
    }

    public function success(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'paymentMethod' => 'required|string',
            'selectedCountry' => 'nullable|array',
            'selectedCountry.name' => 'nullable|string|max:100',
            'selectedCountry.code' => 'nullable|string|max:10',
            'selectedCountry.currency' => 'nullable|string|max:10',
            'conversionRates' => 'nullable|array',
        ]);
        // dd($validated);
        $user = Auth::user();
        // dd($validated);
        // Get all active cart items for this user
        $cartItems = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect('/cart')->with('error', 'Your cart is empty');
        }

        $address = Addresse::where('id', $validated['address_id'])
            ->where('user_id', $user->id)
            ->first();

        if (!$address) {
            return redirect('/checkout')->with('error', 'Selected address is invalid.');
        }

        $selectedCountry = $validated['selectedCountry'] ?? [];
        $rates = $validated['conversionRates'] ?? [];

        $orderCurrencyCode = strtoupper((string) ($selectedCountry['currency'] ?? 'MYR'));
        $orderCountryName = (string) ($selectedCountry['name'] ?? $address->country ?? 'Malaysia');
        $orderCountryCode = strtoupper((string) ($selectedCountry['code'] ?? 'MY'));
        $myrRate = (float) ($rates['MYR'] ?? 0);
        $currencyRate = (float) ($rates[$orderCurrencyCode] ?? 0);

        if ($myrRate <= 0 || $currencyRate <= 0) {
            $orderCurrencyCode = 'MYR';
            $currencyRate = 1;
            $myrRate = 1;
        }

        $totalAmount = 0;
        $totalAmountInCurrency = 0;

        DB::beginTransaction();

        try {
            foreach ($cartItems as $cart) {
                $product = Product::where('id', $cart->product_id)
                    ->lockForUpdate()
                    ->first();

                if (!$product) {
                    DB::rollBack();
                    return redirect('/cart')->with('error', 'One or more products are no longer available.');
                }

                if ((int) $product->instock < (int) $cart->quantity) {
                    DB::rollBack();
                    return redirect('/cart')->with('error', "Insufficient stock for {$product->name}.");
                }

                $originalPrice = (float) ($product->price ?? 0);
                $dealPricing = $this->getActiveDealPricingForProduct((int) $product->id, $originalPrice);
                $priceCalc = $dealPricing ?: PriceCalculator::calculate(
                    $originalPrice,
                    $product->discount_price ?? 0,
                    $product->discount_type ?? 'percentage'
                );

                $calculatedAmount = (float) ($priceCalc['final_price'] ?? $originalPrice);
                $totalAmount += ($calculatedAmount * (int) $cart->quantity);

                $convertedAmount = $this->convertFromMyr($calculatedAmount, $myrRate, $currencyRate);
                $totalAmountInCurrency += ($convertedAmount * (int) $cart->quantity);

                $cart->update([
                    'amount' => round($calculatedAmount, 2),
                    'amount_in_currency' => round($convertedAmount, 2),
                    'currency_code' => $orderCurrencyCode,
                ]);

                $product->decrement('instock', (int) $cart->quantity);
            }

            $totalAmount = round($totalAmount, 2);
            $totalAmountInCurrency = round($totalAmountInCurrency, 2);

            // Create order with calculated total
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'total_amount_in_currency' => $totalAmountInCurrency,
                'address_id' => $validated['address_id'],
                'payment_method' => $validated['paymentMethod'],
                'status' => 'Pending',
                'order_country_name' => $orderCountryName,
                'order_country_code' => $orderCountryCode,
                'order_currency_code' => $orderCurrencyCode,
                'order_currency_rate' => $currencyRate,
                'myr_rate' => $myrRate,
            ]);

            // Update all cart items to mark them as ordered
            foreach ($cartItems as $cart) {
                $cart->update([
                    'status' => 'ordered',
                    'order_id' => $order->id
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return redirect('/cart')->with('error', 'Unable to place order right now. Please try again.');
        }
        
        return Inertia::render('OrderSuccess');
    }

    public function updateStatus(Request $req){
        // dd($req->all());
        // Order::where('id', $req->order_id)->update([
        //     'status' => $req->status
        // ]);
        
        // Handle both single product_id and array of product_ids
        if (is_array($req->product_id)) {
            // Multiple product IDs
            foreach ($req->product_id as $productId) {
                Cart::where('order_id', $req->order_id)
                    ->where('product_id', $productId)
                    ->update(['orderstatus' => $req->status]);
            }
        } else {
            // Single product ID
            Cart::where('order_id', $req->order_id)
                ->where('product_id', $req->product_id)
                ->update(['orderstatus' => $req->status]);
        }
        
        // If order is completed, add quantities to total_sold
        if (strtolower($req->status) === 'completed' || strtolower($req->status) === 'delivered') {
            $cartItems = Cart::where('order_id', $req->order_id)
                ->with('product')
                ->get();
            
            foreach ($cartItems as $item) {
                Product::where('id', $item->product_id)->increment('total_sold', $item->quantity);
            }
        }
        
        return redirect()->back()->with('success', 'Status Updated Successfully!');
    }


}
