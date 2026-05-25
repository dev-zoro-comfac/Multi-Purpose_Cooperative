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
        Schema::create('loan_amortizations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('loan_application_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->integer('payday_no');
    $table->decimal('amortization', 12, 2);
    $table->decimal('interest', 12, 2);
    $table->decimal('principal', 12, 2);
    $table->decimal('balance', 12, 2);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_amortizations');
    }
};
