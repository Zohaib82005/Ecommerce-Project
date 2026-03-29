<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sub_subcategory extends Model
{
    protected $fillable = [
        'subcategory_id',
        'name',
        
    ];

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }
}
