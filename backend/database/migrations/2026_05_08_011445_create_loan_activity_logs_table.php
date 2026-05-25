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
        Schema::create('loan_activity_logs', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignId('loan_application_id')
                ->constrained('loan_applications')
                ->cascadeOnDelete();

            $table->foreignUlid('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('action');

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_activity_logs');
    }
};