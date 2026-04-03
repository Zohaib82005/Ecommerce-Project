/**
 * PriceCalculator - Centralized price calculation utility (Frontend)
 *
 * This utility provides a single, type-aware calculation method that:
 * - Dynamically detects discount type (percentage or fixed amount)
 * - Applies correct discount logic based on type
 * - Handles all edge cases robustly (null, undefined, non-numeric values)
 * - Returns predictable fallbacks without throwing errors
 *
 * Usage:
 * import { calculatePrice, calculateBatch, formatPrice } from '@/utils/priceCalculator';
 *
 * @module priceCalculator
 */

/**
 * Sanitize price input - convert to number, handle nulls and invalid values
 *
 * @param {*} price - The price value to sanitize
 * @returns {number} Safe numeric price (0 if invalid)
 * @private
 */
const sanitizePrice = (price) => {
  // Handle null, undefined, or empty values
  if (price === null || price === undefined || price === '') {
    return 0;
  }

  // Convert to number
  const num = Number(price);

  // Return 0 for NaN or negative values
  return isNaN(num) ? 0 : Math.max(0, num);
};

/**
 * Calculate percentage-based discount
 *
 * @param {number} originalPrice - The base product price
 * @param {number} percentage - The discount percentage (0-100)
 * @returns {number} The discount amount in currency units
 * @private
 */
const calculatePercentageDiscount = (originalPrice, percentage) => {
  // Clamp percentage to reasonable range
  let safePercentage = Math.max(0, Math.min(100, percentage));

  return (originalPrice * safePercentage) / 100;
};

/**
 * Calculate fixed amount discount
 *
 * @param {number} originalPrice - The base product price
 * @param {number} fixedAmount - The discount amount in currency units
 * @returns {number} The discount amount (capped to not exceed original price)
 * @private
 */
const calculateFixedDiscount = (originalPrice, fixedAmount) => {
  // Ensure discount doesn't exceed original price
  if (fixedAmount > originalPrice) {
    console.warn('Fixed discount exceeds original price', {
      originalPrice,
      fixedAmount,
    });
    // Cap at original price (100% off)
    return originalPrice;
  }

  // Ensure discount is not negative
  return Math.max(0, fixedAmount);
};

/**
 * Calculate final price based on original price and discount
 *
 * @param {number|string|null} originalPrice - The base product price
 * @param {number|string|null} discount - The discount value (percentage or fixed amount, depending on type)
 * @param {string} [discountType='percentage'] - Type of discount: 'percentage' or 'fixed'
 *
 * @returns {Object} Calculation result object:
 *          - originalPrice {number}: The base price (safe fallback if null)
 *          - discountAmount {number}: The calculated discount dollars/amount
 *          - discountPercentage {number}: Discount as percentage (0-100)
 *          - finalPrice {number}: The price after discount
 *          - discountType {string}: 'percentage' or 'fixed'
 *          - isDiscounted {boolean}: Whether a discount was applied
 *          - savings {number}: Alias for discountAmount (display compatibility)
 *
 * @example
 * // Percentage discount (10% off $100)
 * const result = calculatePrice(100, 10, 'percentage');
 * // Returns: { originalPrice: 100, discountAmount: 10, finalPrice: 90, ... }
 *
 * @example
 * // Fixed amount discount ($15 off $100)
 * const result = calculatePrice(100, 15, 'fixed');
 * // Returns: { originalPrice: 100, discountAmount: 15, finalPrice: 85, ... }
 *
 * @example
 * // Null/invalid handling - returns original price
 * const result = calculatePrice(null, 10, 'percentage');
 * // Returns: { originalPrice: 0, finalPrice: 0, isDiscounted: false, ... }
 */
export const calculatePrice = (
  originalPrice = null,
  discount = null,
  discountType = 'percentage'
) => {
  // Sanitize and validate inputs
  const safeOriginalPrice = sanitizePrice(originalPrice);
  const safeDiscount = sanitizePrice(discount);
  const safeDiscountType = String(discountType).toLowerCase().trim();

  // Initialize result with safe defaults
  const result = {
    originalPrice: safeOriginalPrice,
    discountAmount: 0,
    discountPercentage: 0,
    finalPrice: safeOriginalPrice,
    discountType: safeDiscountType,
    isDiscounted: false,
    savings: 0, // Alias for backend compatibility
  };

  // Early return if no discount or invalid price
  if (safeOriginalPrice <= 0 || safeDiscount <= 0) {
    return result;
  }

  // Validate discount type
  if (!['percentage', 'fixed'].includes(safeDiscountType)) {
    result.discountType = 'percentage'; // Fallback to percentage
  }

  // Calculate based on discount type
  let discountAmount = 0;
  if (safeDiscountType === 'percentage') {
    discountAmount = calculatePercentageDiscount(safeOriginalPrice, safeDiscount);
  } else {
    discountAmount = calculateFixedDiscount(safeOriginalPrice, safeDiscount);
  }

  // Calculate final price
  let finalPrice = safeOriginalPrice - discountAmount;
  finalPrice = Math.max(0, finalPrice);

  // Calculate discount percentage if not already a percentage discount
  let discountPercentage = safeDiscount;
  if (safeDiscountType === 'fixed' && safeOriginalPrice > 0) {
    discountPercentage = (discountAmount / safeOriginalPrice) * 100;
  }

  // Update result with calculated values
  result.discountAmount = Math.round(discountAmount * 100) / 100;
  result.discountPercentage = Math.round(discountPercentage * 100) / 100;
  result.finalPrice = Math.round(finalPrice * 100) / 100;
  result.isDiscounted = discountAmount > 0;
  result.savings = result.discountAmount; // Alias

  return result;
};

/**
 * Bulk calculate prices for multiple products
 * Useful for mass processing product arrays
 *
 * @param {Array<Object>} products - Array of products with 'price', 'discount_price', 'discount_type' keys
 * @returns {Array<Object>} Array of products with 'finalPrice' added
 *
 * @example
 * const products = [
 *   { id: 1, price: 100, discount_price: 10, discount_type: 'percentage' },
 *   { id: 2, price: 50, discount_price: 5, discount_type: 'fixed' },
 * ];
 * const updated = calculateBatch(products);
 */
export const calculateBatch = (products = []) => {
  if (!Array.isArray(products)) {
    console.warn('calculateBatch expects an array', products);
    return [];
  }

  return products.map((product) => {
    const originalPrice = product.price ?? null;
    const discount = product.discount_price ?? null;
    const discountType = product.discount_type ?? 'percentage';

    const calculation = calculatePrice(originalPrice, discount, discountType);

    return {
      ...product,
      finalPrice: calculation.finalPrice,
      discountAmount: calculation.discountAmount,
      discountPercentage: calculation.discountPercentage,
      isDiscounted: calculation.isDiscounted,
    };
  });
};

/**
 * Format price for display
 *
 * @param {number} price - The price to format
 * @param {string} [currency='RM'] - Currency symbol or code (default: Malaysian Ringgit)
 * @returns {string} Formatted price string (e.g., "RM 99.99")
 *
 * @example
 * formatPrice(99.99, 'RM') // Returns: "RM 99.99"
 * formatPrice(1234.5, '$') // Returns: "$ 1,234.50"
 */
export const formatPrice = (price, currency = 'RM') => {
  const safePrice = sanitizePrice(price);
  return `${currency} ${safePrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Calculate discount savings display
 * Returns a user-friendly string showing discount info
 *
 * @param {number} originalPrice - The base price
 * @param {number} discount - The discount value
 * @param {string} [discountType='percentage'] - Type of discount ('percentage' or 'fixed')
 * @returns {string} Formatted discount string (e.g., "Save 20%" or "Save RM 10")
 *
 * @example
 * getDiscountDisplay(100, 20, 'percentage') // Returns: "Save 20%"
 * getDiscountDisplay(100, 15, 'fixed') // Returns: "Save RM 15"
 */
export const getDiscountDisplay = (
  originalPrice,
  discount,
  discountType = 'percentage'
) => {
  const calculation = calculatePrice(originalPrice, discount, discountType);

  if (!calculation.isDiscounted) {
    return 'No discount';
  }

  if (discountType === 'percentage') {
    return `Save ${calculation.discountPercentage}%`;
  } else {
    return `Save ${formatPrice(calculation.discountAmount)}`;
  }
};

/**
 * Calculate total cart price with all items
 * Aggregates prices from multiple cart items
 *
 * @param {Array<Object>} cartItems - Array of cart items with 'price', 'quantity', etc.
 * @param {Object} [options={}] - Options for calculation
 * @param {string} [options.priceField='price'] - Which field to use for price
 * @returns {Object} Cart totals object with subtotal, discount total, final total
 *
 * @example
 * const items = [
 *   { price: 100, quantity: 2, discount_price: 10, discount_type: 'percentage' },
 *   { price: 50, quantity: 1, discount_price: 0 },
 * ];
 * const totals = calculateCartTotal(items);
 * // Returns: { subtotal: 250, totalDiscount: 20, finalTotal: 230, itemCount: 3 }
 */
export const calculateCartTotal = (cartItems = [], options = {}) => {
  const { priceField = 'price' } = options;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return {
      subtotal: 0,
      totalDiscount: 0,
      finalTotal: 0,
      itemCount: 0,
    };
  }

  let subtotal = 0;
  let totalDiscount = 0;

  cartItems.forEach((item) => {
    const itemPrice = sanitizePrice(item[priceField]);
    const quantity = Math.max(0, Number(item.quantity) || 1);
    const itemSubtotal = itemPrice * quantity;

    subtotal += itemSubtotal;

    // Calculate discount for this item
    const discount = item.discount_price ?? null;
    const discountType = item.discount_type ?? 'percentage';

    if (discount) {
      const calculation = calculatePrice(itemPrice, discount, discountType);
      totalDiscount += calculation.discountAmount * quantity;
    }
  });

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    finalTotal: Math.round((subtotal - totalDiscount) * 100) / 100,
    itemCount: cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
  };
};

/**
 * React Hook for price calculation
 * Automatically recalculates when inputs change
 *
 * @param {number} originalPrice - Base price
 * @param {number} discount - Discount value
 * @param {string} [discountType='percentage'] - Discount type
 * @returns {Object} Calculation result (same format as calculatePrice)
 *
 * @example
 * // In a React component:
 * const pricing = usePrice(product.price, product.discount_price, product.discount_type);
 * return <span>{formatPrice(pricing.finalPrice)}</span>
 */
export const usePrice = (
  originalPrice,
  discount = null,
  discountType = 'percentage'
) => {
  // This is a placeholder for React integration
  // In actual use, wrap with useMemo to optimize updates:
  // return useMemo(() => calculatePrice(...), [originalPrice, discount, discountType]);
  return calculatePrice(originalPrice, discount, discountType);
};

export default {
  calculatePrice,
  calculateBatch,
  formatPrice,
  getDiscountDisplay,
  calculateCartTotal,
  usePrice,
};
