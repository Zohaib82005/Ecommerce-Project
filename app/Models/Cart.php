<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// use App\Models\Cartitem;
class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'amount',
        'amount_in_currency',
        'currency_code',
        'status',
        'order_id',
    ];

    //product function
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
