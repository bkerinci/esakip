<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('realisasi_kinerjas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('target_kinerja_id')->constrained('target_kinerjas')->onDelete('cascade');
            $table->integer('triwulan');
            $table->string('realisasi');
            $table->text('penjelasan')->nullable();
            $table->string('status_capaian')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('realisasi_kinerjas');
    }
};
