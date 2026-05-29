<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            if (!Schema::hasColumn('loan_applications', 'borrower_email')) {
                $table->string('borrower_email')->nullable()->after('borrower_name');
            }

            if (!Schema::hasColumn('loan_applications', 'borrower_contact_number')) {
                $table->string('borrower_contact_number')->nullable()->after('borrower_email');
            }

            if (!Schema::hasColumn('loan_applications', 'borrower_position')) {
                $table->string('borrower_position')->nullable()->after('borrower_employer');
            }

            if (!Schema::hasColumn('loan_applications', 'co_maker_email')) {
                $table->string('co_maker_email')->nullable()->after('co_maker_name');
            }

            if (!Schema::hasColumn('loan_applications', 'co_maker_contact_number')) {
                $table->string('co_maker_contact_number')->nullable()->after('co_maker_email');
            }

            if (!Schema::hasColumn('loan_applications', 'loan_type')) {
                $table->string('loan_type')->nullable()->after('member_since');
            }

            if (!Schema::hasColumn('loan_applications', 'annual_rate')) {
                $table->decimal('annual_rate', 8, 2)->nullable()->after('amount_requested');
            }

            if (!Schema::hasColumn('loan_applications', 'number_of_paydays')) {
                $table->unsignedInteger('number_of_paydays')->nullable()->after('annual_rate');
            }

            if (!Schema::hasColumn('loan_applications', 'payment_frequency')) {
                $table->string('payment_frequency')->nullable()->after('number_of_paydays');
            }

            if (!Schema::hasColumn('loan_applications', 'processing_fee')) {
                $table->decimal('processing_fee', 12, 2)->default(0)->after('payment_frequency');
            }

            if (!Schema::hasColumn('loan_applications', 'total_contribution')) {
                $table->decimal('total_contribution', 12, 2)->default(0)->after('processing_fee');
            }

            if (!Schema::hasColumn('loan_applications', 'outstanding_loan_balance')) {
                $table->decimal('outstanding_loan_balance', 12, 2)->default(0)->after('total_contribution');
            }

            if (!Schema::hasColumn('loan_applications', 'purpose')) {
                $table->text('purpose')->nullable()->after('outstanding_loan_balance');
            }

            if (!Schema::hasColumn('loan_applications', 'total_amount_payable')) {
                $table->decimal('total_amount_payable', 12, 2)->nullable()->after('purpose');
            }

            if (!Schema::hasColumn('loan_applications', 'monthly_amortization')) {
                $table->decimal('monthly_amortization', 12, 2)->nullable()->after('total_amount_payable');
            }
        });
    }

    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $columns = [
                'borrower_email',
                'borrower_contact_number',
                'borrower_position',
                'co_maker_email',
                'co_maker_contact_number',
                'loan_type',
                'annual_rate',
                'number_of_paydays',
                'payment_frequency',
                'processing_fee',
                'total_contribution',
                'outstanding_loan_balance',
                'purpose',
                'total_amount_payable',
                'monthly_amortization',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('loan_applications', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};