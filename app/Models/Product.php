<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'discount_price',
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
}
