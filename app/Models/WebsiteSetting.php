<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
	protected $fillable = [
		'admin_login_slug',
		'website_name',
		'website_logo',
	];

	public static function getSettings(): self
	{
		return static::firstOrCreate([], [
			'admin_login_slug' => 'admin',
			'website_name' => 'BrightMaxTrading',
			'website_logo' => null,
		]);
	}
}
