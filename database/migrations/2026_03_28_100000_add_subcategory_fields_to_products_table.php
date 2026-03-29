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
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'subcategory_id')) {
                $table->foreignId('subcategory_id')->nullable()->after('category_id')->references('id')->on('subcategories')->constrained()->onUpdate('cascade')->onDelete('cascade');
            }
            if (!Schema::hasColumn('products', 'sub_subcategory_id')) {
                $table->foreignId('sub_subcategory_id')->nullable()->after('subcategory_id')->references('id')->on('sub_subcategories')->constrained()->onUpdate('cascade')->onDelete('cascade');
            }
            if (!Schema::hasColumn('products', 'status')) {
                $table->string('status')->default('Pending')->after('image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'subcategory_id')) {
                $table->dropForeignKeyIfExists(['subcategory_id']);
                $table->dropColumn('subcategory_id');
            }
            if (Schema::hasColumn('products', 'sub_subcategory_id')) {
                $table->dropForeignKeyIfExists(['sub_subcategory_id']);
                $table->dropColumn('sub_subcategory_id');
            }
            if (Schema::hasColumn('products', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};

