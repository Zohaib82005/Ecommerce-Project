<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_country_name')->nullable()->after('address_id');
            $table->string('order_country_code', 5)->nullable()->after('order_country_name');
            $table->string('order_currency_code', 5)->default('MYR')->after('order_country_code');
            $table->decimal('order_currency_rate', 14, 6)->nullable()->after('order_currency_code');
            $table->decimal('myr_rate', 14, 6)->nullable()->after('order_currency_rate');
            $table->decimal('total_amount_in_currency', 12, 2)->nullable()->after('total_amount');
        });

        Schema::table('carts', function (Blueprint $table) {
            $table->decimal('amount_in_currency', 10, 2)->nullable()->after('amount');
            $table->string('currency_code', 5)->nullable()->after('amount_in_currency');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropColumn(['amount_in_currency', 'currency_code']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'order_country_name',
                'order_country_code',
                'order_currency_code',
                'order_currency_rate',
                'myr_rate',
                'total_amount_in_currency',
            ]);
        });
    }
};