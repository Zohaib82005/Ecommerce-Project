<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration standardizes discount handling by:
     * - Adding `discount_type` enum to specify if discount is a percentage or fixed amount
     * - Adding `final_price` to store the calculated price after discount
     * - Renaming `discount_price` semantically to represent the discount value (not the final price)
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Add discount_type: specifies if discount_price is 'percentage' (%) or 'fixed' (amount)
            $table->enum('discount_type', ['percentage', 'fixed'])->default('percentage')->after('discount_price');
            
            // Add final_price: the calculated price after discount is applied
            $table->decimal('final_price', 10, 2)->nullable()->after('discount_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['discount_type', 'final_price']);
        });
    }
};
