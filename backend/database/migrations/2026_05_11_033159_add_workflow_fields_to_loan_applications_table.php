<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {

            if (! Schema::hasColumn('loan_applications', 'status')) {
                $table->string('status')
                    ->default('pending')
                    ->after('application_no');
            }

            if (! Schema::hasColumn('loan_applications', 'reviewed_at')) {
                $table->timestamp('reviewed_at')
                    ->nullable();
            }

            if (! Schema::hasColumn('loan_applications', 'approved_at')) {
                $table->timestamp('approved_at')
                    ->nullable();
            }

            if (! Schema::hasColumn('loan_applications', 'released_at')) {
                $table->timestamp('released_at')
                    ->nullable();
            }

           $table->foreignUlid('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            if (! Schema::hasColumn('loan_applications', 'approved_by')) {

            $table->foreignUlid('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {

            $table->dropForeign(['reviewed_by']);
            $table->dropForeign(['approved_by']);

            $table->dropColumn([
                'status',
                'reviewed_at',
                'approved_at',
                'released_at',
                'reviewed_by',
                'approved_by',
            ]);
        });
    }
};
