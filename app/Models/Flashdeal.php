<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
