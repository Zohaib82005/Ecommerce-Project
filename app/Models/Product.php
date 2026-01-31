<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'instock',
        'description',
        'image',
        'category_id',
        'added_by'
    ];
}
