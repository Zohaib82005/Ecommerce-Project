<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Flashdeals_product extends Model
{
    protected $table = 'flashdeals_products';

    protected $fillable = [
        'flashdeal_id',
        'product_id',
        'discount_amount',
        'discount_percentage',
    ];

    /**
     * Get the flashdeal associated with this product.
     */
    public function flashdeal(): BelongsTo
    {
        return $this->belongsTo(Flashdeal::class, 'flashdeal_id');
    }

    /**
     * Get the product associated with this flashdeal.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
