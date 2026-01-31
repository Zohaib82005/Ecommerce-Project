<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cartitem extends Model
{
    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'status',
    ];
    
}
