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
        Schema::table('images', function (Blueprint $table) {
            $table->unsignedBigInteger('sub_subcategory_id')->nullable()->after('subcategory_id');
            $table->foreign('sub_subcategory_id')->references('id')->on('sub_subcategories')->onDelete('set null');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('images', function (Blueprint $table) {
            $table->dropForeign(['sub_subcategory_id']);
            $table->dropColumn('sub_subcategory_id');
        });
    }
};
