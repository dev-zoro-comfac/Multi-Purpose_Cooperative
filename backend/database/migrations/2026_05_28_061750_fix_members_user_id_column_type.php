<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE members MODIFY user_id VARCHAR(26) NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE members MODIFY user_id BIGINT UNSIGNED NULL");
    }
};