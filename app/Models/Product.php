<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Utils\PriceCalculator;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'discount_price',
        'discount_type',
        'final_price',
        'instock',
        'description',
        'image',
        'category_id',
        'subcategory_id',
        'sub_subcategory_id',
        'added_by',
        'status',
        'total_sold'
    ];

    /**
     * Automatically calculate and set final_price when price or discount changes
     * Uses the PriceCalculator utility for consistency across the application
     */
    protected static function boot()
    {
        parent::boot();

        // Calculate final_price before saving
        static::saving(function ($model) {
            $calculation = PriceCalculator::calculate(
                $model->price ?? 0,
                $model->discount_price ?? 0,
                $model->discount_type ?? 'percentage'
            );
            $model->final_price = $calculation['final_price'];
            $model->discount_type = $calculation['discount_type'];
        });
    }

    /**
     * Get price calculation for this product
     * Returns a complete price breakdown
     * 
     * @return array Complete pricing information
     */
    public function getPriceCalculation(): array
    {
        return PriceCalculator::calculate(
            $this->price,
            $this->discount_price,
            $this->discount_type ?? 'percentage'
        );
    }

    /**
     * Accessor: get formatted final price
     * 
     * @return string Formatted price (e.g., "RM 99.99")
     */
    public function getFormattedFinalPriceAttribute(): string
    {
        return PriceCalculator::formatPrice($this->final_price ?? $this->price);
    }

    /**
     * Accessor: get formatted original price
     * 
     * @return string Formatted price
     */
    public function getFormattedPriceAttribute(): string
    {
        return PriceCalculator::formatPrice($this->price);
    }

    /**
     * Accessor: get discount display string
     * 
     * @return string Discount text (e.g., "Save 20%")
     */
    public function getDiscountDisplayAttribute(): string
    {
        return PriceCalculator::getDiscountDisplay(
            $this->price,
            $this->discount_price,
            $this->discount_type ?? 'percentage'
        );
    }

    /**
     * Check if product is currently discounted
     * 
     * @return bool
     */
    public function isDiscounted(): bool
    {
        return ($this->discount_price ?? 0) > 0;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function subSubcategory()
    {
        return $this->belongsTo(Sub_subcategory::class, 'sub_subcategory_id');
    }

    public function images()
    {
        return $this->hasMany(Productimage::class);
    }

    public function flashdealProducts()
    {
        return $this->hasMany(Flashdeals_product::class, 'product_id');
    }
}
