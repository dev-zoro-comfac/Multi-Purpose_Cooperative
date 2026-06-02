<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            if (! Schema::hasColumn('loan_applications', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable();
            }

            if (! Schema::hasColumn('loan_applications', 'reviewed_by')) {
                $table->unsignedBigInteger('reviewed_by')->nullable();
            }

            if (! Schema::hasColumn('loan_applications', 'approved_by')) {
                $table->unsignedBigInteger('approved_by')->nullable();
            }

            if (! Schema::hasColumn('loan_applications', 'released_at')) {
                $table->timestamp('released_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            $table->dropColumn([
                'reviewed_at',
                'reviewed_by',
                'approved_by',
                'released_at',
            ]);
        });
    }
};
