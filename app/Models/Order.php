<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'total_amount',
        'total_amount_in_currency',
        'status',
        'payment_method',
        'address_id',
        'order_country_name',
        'order_country_code',
        'order_currency_code',
        'order_currency_rate',
        'myr_rate',
    ];
}
