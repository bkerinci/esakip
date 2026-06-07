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
        Schema::table('log_aktivitas', function (Blueprint $table) {
            $table->string('model_type')->nullable()->after('aktivitas');
            $table->unsignedBigInteger('model_id')->nullable()->after('model_type');
            $table->json('data_lama')->nullable()->after('deskripsi');
            $table->json('data_baru')->nullable()->after('data_lama');
            $table->string('ip_address')->nullable()->after('data_baru');
            $table->string('user_agent')->nullable()->after('ip_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('log_aktivitas', function (Blueprint $table) {
            $table->dropColumn(['model_type', 'model_id', 'data_lama', 'data_baru', 'ip_address', 'user_agent']);
        });
    }
};
