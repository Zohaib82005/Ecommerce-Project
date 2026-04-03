<?php

namespace App\Utils;

/**
 * PriceCalculator - Centralized price calculation utility
 * 
 * This utility provides a single, type-aware calculation method that:
 * - Dynamically detects discount type (percentage or fixed amount)
 * - Applies correct discount logic based on type
 * - Handles all edge cases robustly
 * - Returns predictable fallbacks without throwing errors
 * 
 * @package App\Utils
 */
class PriceCalculator
{
    /**
     * Calculate final price based on original price and discount
     * 
     * @param float|int|null $originalPrice The base product price
     * @param float|int|null $discount The discount value (percentage or fixed amount, depending on type)
     * @param string $discountType Type of discount: 'percentage' or 'fixed'. Default: 'percentage'
     * 
     * @return array Associative array with keys:
     *         - original_price (float): The base price (safe fallback if null)
     *         - discount_amount (float): The calculated discount dollars/amount
     *         - discount_percentage (float): Discount as percentage (0-100 or calculated)
     *         - final_price (float): The price after discount
     *         - discount_type (string): 'percentage' or 'fixed'
     *         - is_discounted (bool): Whether a discount was applied
     *         - savings (float): Alias for discount_amount (for frontend compatibility)
     * 
     * @example
     * // Percentage discount (10% off $100)
     * $result = PriceCalculator::calculate(100, 10, 'percentage');
     * // Returns: ['original_price' => 100, 'discount_amount' => 10, 'final_price' => 90, ...]
     * 
     * @example
     * // Fixed amount discount ($15 off $100)
     * $result = PriceCalculator::calculate(100, 15, 'fixed');
     * // Returns: ['original_price' => 100, 'discount_amount' => 15, 'final_price' => 85, ...]
     * 
     * @example
     * // Null/invalid handling - returns original price
     * $result = PriceCalculator::calculate(null, 10, 'percentage');
     * // Returns: ['original_price' => 0, 'final_price' => 0, 'is_discounted' => false, ...]
     */
    public static function calculate(
        $originalPrice = null,
        $discount = null,
        string $discountType = 'percentage'
    ): array {
        // Sanitize and validate inputs
        $originalPrice = self::sanitizePrice($originalPrice);
        $discount = self::sanitizePrice($discount);
        $discountType = strtolower(trim($discountType));

        // Initialize result with safe defaults
        $result = [
            'original_price' => $originalPrice,
            'discount_amount' => 0,
            'discount_percentage' => 0,
            'final_price' => $originalPrice,
            'discount_type' => $discountType,
            'is_discounted' => false,
            'savings' => 0, // Alias for frontend compatibility
        ];

        // Early return if no discount or invalid price
        if ($originalPrice <= 0 || $discount <= 0) {
            return $result;
        }

        // Validate discount type
        if (!in_array($discountType, ['percentage', 'fixed'])) {
            $discountType = 'percentage'; // Fallback to percentage
            $result['discount_type'] = $discountType;
        }

        // Calculate based on discount type
        if ($discountType === 'percentage') {
            $discountAmount = self::calculatePercentageDiscount($originalPrice, $discount);
        } else {
            $discountAmount = self::calculateFixedDiscount($originalPrice, $discount);
        }

        // Calculate final price
        $finalPrice = $originalPrice - $discountAmount;

        // Ensure final price is never negative
        $finalPrice = max(0, $finalPrice);

        // Calculate discount percentage if not already a percentage discount
        if ($discountType === 'fixed' && $originalPrice > 0) {
            $discountPercentage = ($discountAmount / $originalPrice) * 100;
        } else {
            $discountPercentage = $discount;
        }

        // Update result with calculated values
        $result['discount_amount'] = round($discountAmount, 2);
        $result['discount_percentage'] = round($discountPercentage, 2);
        $result['final_price'] = round($finalPrice, 2);
        $result['is_discounted'] = $discountAmount > 0;
        $result['savings'] = $result['discount_amount']; // Alias for frontend

        return $result;
    }

    /**
     * Calculate percentage-based discount
     * 
     * @param float $originalPrice
     * @param float $percentage The discount percentage (0-100 or higher)
     * 
     * @return float The discount amount in currency units
     */
    private static function calculatePercentageDiscount(float $originalPrice, float $percentage): float
    {
        // Clamp percentage to 0-100 range, but allow up to 150% for flexibility
        // (though typically 0-100 is the realistic range)
        if ($percentage < 0) {
            $percentage = 0;
        }
        
        // Handle values > 100% carefully (though not typical)
        if ($percentage > 100) {
            // Log edge case but proceed - could be system error or special promo
            \Log::warning('Discount percentage exceeds 100%', [
                'original_price' => $originalPrice,
                'percentage' => $percentage,
            ]);
            // Cap at 100% instead of failing
            $percentage = 100;
        }

        return ($originalPrice * $percentage) / 100;
    }

    /**
     * Calculate fixed amount discount
     * 
     * @param float $originalPrice
     * @param float $fixedAmount The discount amount in currency units
     * 
     * @return float The discount amount (capped to not exceed original price)
     */
    private static function calculateFixedDiscount(float $originalPrice, float $fixedAmount): float
    {
        // Ensure discount doesn't exceed original price
        if ($fixedAmount > $originalPrice) {
            \Log::warning('Fixed discount exceeds original price', [
                'original_price' => $originalPrice,
                'fixed_amount' => $fixedAmount,
            ]);
            // Cap at original price (100% off)
            return $originalPrice;
        }

        // Ensure discount is not negative
        return max(0, $fixedAmount);
    }

    /**
     * Sanitize price input - convert to float, handle nulls and invalid values
     * 
     * @param mixed $price The price value to sanitize
     * 
     * @return float Safe numeric price (0 if invalid)
     */
    private static function sanitizePrice($price): float
    {
        // Handle null or empty values
        if ($price === null || $price === '') {
            return 0;
        }

        // Convert to float, handle non-numeric strings
        $sanitized = (float) filter_var($price, FILTER_VALIDATE_FLOAT);

        // Return 0 for invalid values (filter_var returns 0 for invalid input)
        return max(0, $sanitized);
    }

    /**
     * Bulk calculate prices for multiple products
     * Useful for mass processing product arrays
     * 
     * @param array $products Array of products with 'price', 'discount_price', 'discount_type' keys
     * 
     * @return array Array of products with 'final_price' added
     */
    public static function calculateBatch(array $products): array
    {
        return array_map(function ($product) {
            $originalPrice = $product['price'] ?? null;
            $discount = $product['discount_price'] ?? null;
            $discountType = $product['discount_type'] ?? 'percentage';

            $calculation = self::calculate($originalPrice, $discount, $discountType);

            return array_merge($product, [
                'final_price' => $calculation['final_price'],
                'discount_amount' => $calculation['discount_amount'],
                'discount_percentage' => $calculation['discount_percentage'],
                'is_discounted' => $calculation['is_discounted'],
            ]);
        }, $products);
    }

    /**
     * Format price for display
     * 
     * @param float $price
     * @param string $currency Currency code (default: 'RM' for Malaysian Ringgit)
     * 
     * @return string Formatted price string
     */
    public static function formatPrice(float $price, string $currency = 'RM'): string
    {
        return $currency . ' ' . number_format($price, 2, '.', ',');
    }

    /**
     * Calculate discount savings display
     * Returns a user-friendly string showing discount info
     * 
     * @param float $originalPrice
     * @param float $discount
     * @param string $discountType
     * 
     * @return string Formatted discount string (e.g. "Save RM 10" or "Save 20%")
     */
    public static function getDiscountDisplay(
        float $originalPrice,
        float $discount,
        string $discountType = 'percentage'
    ): string {
        $calculation = self::calculate($originalPrice, $discount, $discountType);

        if (!$calculation['is_discounted']) {
            return 'No discount';
        }

        if ($discountType === 'percentage') {
            return 'Save ' . $calculation['discount_percentage'] . '%';
        } else {
            return 'Save ' . self::formatPrice($calculation['discount_amount']);
        }
    }
}
