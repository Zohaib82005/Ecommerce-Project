<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
	protected $fillable = [
		'admin_login_slug',
	];

	public static function getSettings(): self
	{
		return static::firstOrCreate([], [
			'admin_login_slug' => 'admin',
		]);
	}
}
