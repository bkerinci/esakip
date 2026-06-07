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
        Schema::create('pohon_kinerjas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('pohon_kinerjas')->onDelete('cascade');
            $table->unsignedBigInteger('opd_id')->nullable();
            $table->enum('jenis_node', ['visi', 'misi', 'sasaran_pemda', 'sasaran_opd', 'program', 'kegiatan', 'iku_individu']);
            $table->text('deskripsi');
            $table->string('indikator')->nullable();
            $table->string('target')->nullable();
            $table->boolean('is_crosscutting')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pohon_kinerjas');
    }
};
