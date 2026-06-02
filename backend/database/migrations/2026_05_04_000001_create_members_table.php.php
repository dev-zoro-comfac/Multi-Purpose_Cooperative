<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();

            $table->string('member_no')->unique();

            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();

            $table->date('birth_date')->nullable();
            $table->string('gender')->nullable();
            $table->string('civil_status')->nullable();

            $table->string('email')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();

            $table->string('employment_status')->nullable();
            $table->string('department')->nullable();
            $table->string('position')->nullable();

            $table->decimal('share_capital', 12, 2)->default(0);
            $table->decimal('total_contribution', 12, 2)->default(0);

            $table->string('status')->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
