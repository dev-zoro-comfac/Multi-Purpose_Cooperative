<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            if (! Schema::hasColumn('loan_applications', 'declared_member_status')) {
                $table
                    ->string('declared_member_status')
                    ->nullable()
                    ->after('application_source');
            }

            if (! Schema::hasColumn('loan_applications', 'declared_member_no')) {
                $table
                    ->string('declared_member_no')
                    ->nullable()
                    ->after('declared_member_status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('loan_applications', function (Blueprint $table) {
            foreach (['declared_member_status', 'declared_member_no'] as $column) {
                if (Schema::hasColumn('loan_applications', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
