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
        Schema::table('ikus', function (Blueprint $table) {
            $table->text('definisi_operasional')->nullable()->after('satuan');
            $table->string('baseline')->nullable()->after('definisi_operasional');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ikus', function (Blueprint $table) {
            $table->dropColumn(['definisi_operasional', 'baseline']);
        });
    }
};
