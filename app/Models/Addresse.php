<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Addresse extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'apartment',
        'city',
        'state',
        'zip',
        'country',
    ];
}
