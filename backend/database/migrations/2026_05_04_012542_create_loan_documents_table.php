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
        Schema::create('loan_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('loan_application_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('document_type');
            // authorization_to_deduct, promissory_note, co_maker_agreement

            $table->string('file_name');
            $table->string('file_path');

            $table->enum('status', [
                'generated',
                'uploaded',
                'approved',
                'rejected',
            ])->default('generated');

            $table->boolean('is_signed')->default(false);

            $table->timestamp('generated_at')->nullable();
            $table->timestamp('uploaded_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_documents');
    }
};
