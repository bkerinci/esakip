<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('target_kinerjas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('iku_id')->constrained('ikus')->onDelete('cascade');
            $table->integer('tahun');
            $table->string('target');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('target_kinerjas');
    }
};
