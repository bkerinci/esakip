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
        Schema::table('pohon_kinerjas', function (Blueprint $table) {
            $table->double('x')->nullable();
            $table->double('y')->nullable();
            $table->integer('capaian')->default(0);
        });
        
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE pohon_kinerjas MODIFY COLUMN jenis_node ENUM('visi', 'misi', 'sasaran_pemda', 'sasaran_opd', 'program', 'kegiatan', 'iku_individu', 'tujuan', 'sasaran', 'sub_kegiatan')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pohon_kinerjas', function (Blueprint $table) {
            $table->dropColumn(['x', 'y', 'capaian']);
        });
    }
};
