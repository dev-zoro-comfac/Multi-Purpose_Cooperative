<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            if (! Schema::hasColumn('loan_applications', 'preferred_payment_method')) {
                $table->string('preferred_payment_method')
                    ->default('salary_deduction')
                    ->after('payment_frequency');
            }
        });
    }

    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            if (Schema::hasColumn('loan_applications', 'preferred_payment_method')) {
                $table->dropColumn('preferred_payment_method');
            }
        });
    }
};
