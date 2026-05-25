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
        Schema::create('loan_applications', function (Blueprint $table) {
           $table->id();

$table->string('application_no')->nullable()->unique();

$table->string('borrower_name');
$table->foreignId('member_id')
    ->nullable()
    ->constrained('members')
    ->nullOnDelete();
$table->string('borrower_address')->nullable();
$table->integer('borrower_age')->nullable();
$table->string('borrower_civil_status')->nullable();
$table->string('borrower_employer')->nullable();
$table->string('borrower_length_of_service')->nullable();

$table->decimal('amount_requested', 12, 2);
$table->decimal('take_home_pay_15', 12, 2)->nullable();
$table->decimal('take_home_pay_30', 12, 2)->nullable();

$table->boolean('is_coop_member')->default(false);
$table->date('member_since')->nullable();

$table->string('co_maker_name')->nullable();
$table->string('co_maker_address')->nullable();
$table->integer('co_maker_age')->nullable();
$table->string('co_maker_civil_status')->nullable();
$table->string('co_maker_employer')->nullable();
$table->string('co_maker_length_of_service')->nullable();

$table->enum('status', [
    'draft',
    'documents_generated',
    'documents_uploaded',
    'submitted_for_evaluation',
    'under_accounting_review',
    'approved',
    'rejected', 
    'released',
])->default('submitted_for_evaluation');

$table->text('accounting_notes')->nullable();
$table->timestamp('submitted_at')->nullable();
$table->timestamp('approved_at')->nullable();
$table->timestamp('rejected_at')->nullable();

$table->timestamps();
        });
    }  

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_applications');
    }
};
