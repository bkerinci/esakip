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
        Schema::create('rencana_aksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('opd_id')->constrained()->onDelete('cascade');
            $table->string('nomor')->nullable();
            $table->string('sasaran')->nullable();
            $table->string('indikator_kinerja')->nullable();
            $table->string('tw_1')->nullable();
            $table->string('tw_2')->nullable();
            $table->string('tw_3')->nullable();
            $table->string('tw_4')->nullable();
            $table->text('aktifitas')->nullable();
            $table->string('penanggung_jawab')->nullable();
            $table->string('anggaran')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rencana_aksis');
    }
};
