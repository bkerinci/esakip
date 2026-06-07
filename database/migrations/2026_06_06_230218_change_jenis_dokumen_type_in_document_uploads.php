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
        Schema::table('document_uploads', function (Blueprint $table) {
            $table->string('jenis_dokumen', 50)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_uploads', function (Blueprint $table) {
            // Reverting back to enum might cause data loss if there are 'iku' values
            // so we'll just leave it as string or change it back to the original enum
            $table->enum('jenis_dokumen', ['lkjip', 'perjanjian_kinerja', 'renstra'])->change();
        });
    }
};
