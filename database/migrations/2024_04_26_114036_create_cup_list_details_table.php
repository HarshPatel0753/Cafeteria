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
        Schema::create('cup_list_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cup_list_master_id');
            $table->unsignedBigInteger('product_id');
            $table->float('price');
            $table->integer('cups');
            $table->unsignedBigInteger('created_by')->comment('user_id');
            $table->timestamps();

            $table->foreign('cup_list_master_id')->references('id')->on('cup_list_master');
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('created_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cup_list_details');
    }
};
