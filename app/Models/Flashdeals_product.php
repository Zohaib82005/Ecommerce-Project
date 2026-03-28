<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flashdeals_product extends Model
{
    protected $fillable = [
        'flashdeal_id',
        'product_id',
        'discount_amount',
        'discount_percentage',
    ];
}
