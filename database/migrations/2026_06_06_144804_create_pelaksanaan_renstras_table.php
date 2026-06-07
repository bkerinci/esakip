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
        Schema::create('pelaksanaan_renstras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('opd_id')->constrained()->cascadeOnDelete();
            $table->integer('nomor')->nullable();
            $table->text('renstra_pd')->nullable();
            $table->text('renja_pd')->nullable();
            $table->string('kesesuaian')->nullable(); // 'Ya', 'Tidak'
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
        Schema::dropIfExists('pelaksanaan_renstras');
    }
};
