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
        Schema::table('formulir_e81_s', function (Blueprint $table) {
            $table->text('kegiatan')->nullable()->after('program');
            $table->text('sub_kegiatan')->nullable()->after('kegiatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formulir_e81_s', function (Blueprint $table) {
            $table->dropColumn(['kegiatan', 'sub_kegiatan']);
        });
    }
};
