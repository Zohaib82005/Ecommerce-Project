<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Flashdeal extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'start_date',
        'end_date',
        'status',
        'created_by',
    ];

    /**
     * Get the products associated with this flashdeal.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'flashdeals_products')
            ->withPivot('discount_amount', 'discount_percentage')
            ->withTimestamps();
    }

    /**
     * Get the flashdeal products (pivot records).
     */
    public function flashdealProducts(): HasMany
    {
        return $this->hasMany(Flashdeals_product::class, 'flashdeal_id');
    }

    /**
     * Get the user who created this deal.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
