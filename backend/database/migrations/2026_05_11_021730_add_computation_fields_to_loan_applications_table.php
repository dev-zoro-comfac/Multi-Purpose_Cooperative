<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            if (! Schema::hasColumn('loan_applications', 'annual_rate')) {
                $table->decimal('annual_rate', 8, 2)->nullable()->after('amount_requested');
            }

            if (! Schema::hasColumn('loan_applications', 'number_of_paydays')) {
                $table->integer('number_of_paydays')->nullable()->after('annual_rate');
            }

            if (! Schema::hasColumn('loan_applications', 'amortization_per_payday')) {
                $table->decimal('amortization_per_payday', 12, 2)->nullable()->after('number_of_paydays');
            }

            if (! Schema::hasColumn('loan_applications', 'monthly_amortization')) {
                $table->decimal('monthly_amortization', 12, 2)->nullable()->after('amortization_per_payday');
            }

            if (! Schema::hasColumn('loan_applications', 'total_interest')) {
                $table->decimal('total_interest', 12, 2)->nullable()->after('monthly_amortization');
            }

            if (! Schema::hasColumn('loan_applications', 'total_amount_payable')) {
                $table->decimal('total_amount_payable', 12, 2)->nullable()->after('total_interest');
            }

            if (! Schema::hasColumn('loan_applications', 'processing_fee')) {
                $table->decimal('processing_fee', 12, 2)->nullable()->after('total_amount_payable');
            }

            if (! Schema::hasColumn('loan_applications', 'net_proceeds')) {
                $table->decimal('net_proceeds', 12, 2)->nullable()->after('processing_fee');
            }
        });
    }

    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->dropColumn([
                'annual_rate',
                'number_of_paydays',
                'amortization_per_payday',
                'monthly_amortization',
                'total_interest',
                'total_amount_payable',
                'processing_fee',
                'net_proceeds',
            ]);
        });
    }
};
