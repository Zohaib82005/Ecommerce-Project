<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'category',
        'image'
    ];

    public function subcategories()
    {
        return $this->hasMany(Subcategory::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }
}
