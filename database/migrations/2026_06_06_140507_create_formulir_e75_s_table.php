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
        Schema::create('formulir_e75s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('opd_id')->nullable()->constrained('opds')->cascadeOnDelete();
            $table->string('tahun');
            $table->string('kode')->nullable();
            $table->text('program')->nullable();
            $table->text('kegiatan')->nullable();
            $table->text('sub_kegiatan')->nullable();
            
            // Kolom Data Renja vs RKA
            $table->text('indikator_kinerja_renja')->nullable();
            $table->text('indikator_kinerja_rka')->nullable();
            
            $table->text('rencana_lokasi_renja')->nullable();
            $table->text('rencana_lokasi_rka')->nullable();
            
            $table->text('rencana_target_renja')->nullable();
            $table->text('rencana_target_rka')->nullable();
            
            $table->decimal('rencana_dana_renja', 20, 2)->default(0);
            $table->decimal('rencana_dana_rka', 20, 2)->default(0);
            
            $table->text('prakiraan_maju_target_renja')->nullable();
            $table->text('prakiraan_maju_target_rka')->nullable();
            
            $table->decimal('prakiraan_maju_dana_renja', 20, 2)->default(0);
            $table->decimal('prakiraan_maju_dana_rka', 20, 2)->default(0);
            
            // Kolom Lainnya
            $table->enum('kesesuaian', ['Ya', 'Tidak'])->nullable();
            $table->text('evaluasi')->nullable();
            $table->text('tindak_lanjut')->nullable();
            $table->text('hasil_tindak_lanjut')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formulir_e75s');
    }
};
