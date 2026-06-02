<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            if (! Schema::hasColumn('loan_applications', 'borrower_position')) {
                $table->string('borrower_position')->nullable()->after('borrower_employer');
            }

            if (! Schema::hasColumn('loan_applications', 'loan_type')) {
                $table->string('loan_type')->nullable()->after('member_id');
            }

            if (! Schema::hasColumn('loan_applications', 'payment_frequency')) {
                $table->string('payment_frequency')->nullable()->after('loan_type');
            }

            if (! Schema::hasColumn('loan_applications', 'purpose')) {
                $table->text('purpose')->nullable()->after('payment_frequency');
            }

            if (! Schema::hasColumn('loan_applications', 'annual_rate')) {
                $table->decimal('annual_rate', 8, 2)->nullable()->after('amount_requested');
            }

            if (! Schema::hasColumn('loan_applications', 'number_of_paydays')) {
                $table->integer('number_of_paydays')->nullable()->after('annual_rate');
            }

            if (! Schema::hasColumn('loan_applications', 'processing_fee')) {
                $table->decimal('processing_fee', 12, 2)->nullable()->after('number_of_paydays');
            }

            if (! Schema::hasColumn('loan_applications', 'total_contribution')) {
                $table->decimal('total_contribution', 12, 2)->nullable()->after('processing_fee');
            }

            if (! Schema::hasColumn('loan_applications', 'outstanding_loan_balance')) {
                $table->decimal('outstanding_loan_balance', 12, 2)->nullable()->after('total_contribution');
            }
        });
    }

    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            foreach ([
                'borrower_position',
                'loan_type',
                'payment_frequency',
                'purpose',
                'annual_rate',
                'number_of_paydays',
                'processing_fee',
                'total_contribution',
                'outstanding_loan_balance',
            ] as $column) {
                if (Schema::hasColumn('loan_applications', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
