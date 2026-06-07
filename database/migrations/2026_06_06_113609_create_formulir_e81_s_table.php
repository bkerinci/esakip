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
        Schema::create('formulir_e81_s', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('opd_id');
            $table->integer('tahun');
            $table->string('nomor')->nullable();
            $table->text('sasaran')->nullable();
            $table->text('program')->nullable(); // program kegiatan, sub kegiatan
            $table->text('indikator_kinerja')->nullable();
            
            $table->decimal('target_renstra_akhir_kinerja', 15, 2)->default(0);
            $table->decimal('target_renstra_akhir_anggaran', 15, 2)->default(0);
            
            $table->decimal('realisasi_kinerja_tahun_lalu_kinerja', 15, 2)->default(0);
            $table->decimal('realisasi_kinerja_tahun_lalu_anggaran', 15, 2)->default(0);
            
            $table->decimal('target_kinerja_tahun_berjalan_kinerja', 15, 2)->default(0);
            $table->decimal('target_kinerja_tahun_berjalan_anggaran', 15, 2)->default(0);
            
            $table->decimal('realisasi_tw1_kinerja', 15, 2)->default(0);
            $table->decimal('realisasi_tw1_anggaran', 15, 2)->default(0);
            
            $table->decimal('realisasi_tw2_kinerja', 15, 2)->default(0);
            $table->decimal('realisasi_tw2_anggaran', 15, 2)->default(0);
            
            $table->decimal('realisasi_tw3_kinerja', 15, 2)->default(0);
            $table->decimal('realisasi_tw3_anggaran', 15, 2)->default(0);
            
            $table->decimal('realisasi_tw4_kinerja', 15, 2)->default(0);
            $table->decimal('realisasi_tw4_anggaran', 15, 2)->default(0);
            
            $table->decimal('realisasi_capaian_tahun_dievaluasi_kinerja', 15, 2)->default(0);
            $table->decimal('realisasi_capaian_tahun_dievaluasi_anggaran', 15, 2)->default(0);
            
            $table->decimal('realisasi_kinerja_renstra_tahun_berjalan_kinerja', 15, 2)->default(0);
            $table->decimal('realisasi_kinerja_renstra_tahun_berjalan_anggaran', 15, 2)->default(0);
            
            $table->decimal('tingkat_capaian_renstra_tahun_berjalan_kinerja', 15, 2)->default(0);
            $table->decimal('tingkat_capaian_renstra_tahun_berjalan_anggaran', 15, 2)->default(0);
            
            $table->string('unit_penanggung_jawab')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formulir_e81_s');
    }
};
