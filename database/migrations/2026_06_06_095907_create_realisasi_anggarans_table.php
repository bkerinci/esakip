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
        Schema::create('realisasi_anggarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('opd_id')->constrained('opds')->cascadeOnDelete();
            $table->year('tahun');
            $table->integer('triwulan');
            
            $table->string('program');
            $table->string('kegiatan');
            $table->string('sub_kegiatan');

            // Belanja Pegawai
            $table->decimal('pegawai_anggaran', 20, 2)->default(0);
            $table->decimal('pegawai_realisasi_keuangan', 20, 2)->default(0);
            $table->decimal('pegawai_realisasi_fisik', 5, 2)->default(0);

            // Belanja Barang dan Jasa
            $table->decimal('barang_jasa_anggaran', 20, 2)->default(0);
            $table->decimal('barang_jasa_realisasi_keuangan', 20, 2)->default(0);
            $table->decimal('barang_jasa_realisasi_fisik', 5, 2)->default(0);

            // Belanja Modal
            $table->decimal('modal_anggaran', 20, 2)->default(0);
            $table->decimal('modal_realisasi_keuangan', 20, 2)->default(0);
            $table->decimal('modal_realisasi_fisik', 5, 2)->default(0);

            // Belanja Hibah
            $table->decimal('hibah_anggaran', 20, 2)->default(0);
            $table->decimal('hibah_realisasi_keuangan', 20, 2)->default(0);
            $table->decimal('hibah_realisasi_fisik', 5, 2)->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('realisasi_anggarans');
    }
};
