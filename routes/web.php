<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\PublicController;

// Rute Publik (Tanpa Middleware Auth)
Route::get('/', [PublicController::class, 'index'])->name('home');
Route::get('/publik/perencanaan', [PublicController::class, 'perencanaan'])->name('publik.perencanaan');
Route::get('/publik/pelaporan', [PublicController::class, 'pelaporan'])->name('publik.pelaporan');
Route::get('/publik/evaluasi', [PublicController::class, 'evaluasi'])->name('publik.evaluasi');
Route::get('/publik/capaian', [PublicController::class, 'sakipPublik'])->name('publik.capaian');
Route::get('/publik/opd/{id}', [PublicController::class, 'detailOpd'])->name('publik.opd');
Route::post('/feedback', [PublicController::class, 'storeFeedback'])->name('feedback.store');
Route::get('/peraturan', [\App\Http\Controllers\PeraturanController::class, 'publicIndex'])->name('publik.peraturan');

// Public Document Routes
Route::get('/publik/documents/{id}/view', [\App\Http\Controllers\DocumentUploadController::class, 'publicView'])->name('publik.documents.view');
Route::get('/publik/documents/{id}/download', [\App\Http\Controllers\DocumentUploadController::class, 'publicDownload'])->name('publik.documents.download');

// Public AI Chat Assistant (Home Page)
Route::post('/api/ai/chat', [\App\Http\Controllers\PublicAiController::class, 'chat'])->name('public.ai.chat');

Route::get('/dashboard', function (\App\Services\KinerjaService $kinerjaService) {
    return Inertia::render('Dashboard', [
        'statistik' => $kinerjaService->getStatistikDashboard(),
        'totalFeedback' => \App\Models\Feedback::count()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Super Admin Routes
    Route::middleware('role:super_admin')->group(function () {
        Route::get('/audit-log', function() {
            $logs = \App\Models\LogAktivitas::with('user')->latest()->paginate(20);
            return Inertia::render('Admin/LogAktivitas', [
                'logs' => $logs
            ]);
        })->name('audit.log');

        Route::get('/users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
        Route::post('/users', [\App\Http\Controllers\UserController::class, 'store'])->name('users.store');
        Route::put('/users/{id}', [\App\Http\Controllers\UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{id}', [\App\Http\Controllers\UserController::class, 'destroy'])->name('users.destroy');
        
        Route::post('/opds', [\App\Http\Controllers\UserController::class, 'storeOpd'])->name('opds.store');
    });

    // SIPANDAI Route (AI & Analytics)
    Route::middleware('role:super_admin|evaluator')->group(function () {
        Route::get('/sipandai', [\App\Http\Controllers\SipandaiController::class, 'index'])->name('sipandai.index');
        Route::post('/sipandai/chat', [\App\Http\Controllers\SipandaiController::class, 'chat'])->name('sipandai.chat');
        Route::post('/sipandai/lhe', [\App\Http\Controllers\SipandaiController::class, 'storeLhe'])->name('sipandai.lhe.store');
        Route::delete('/sipandai/lhe/{id}', [\App\Http\Controllers\SipandaiController::class, 'destroyLhe'])->name('sipandai.lhe.destroy');
    });

    Route::get('/pohon-kinerja', [\App\Http\Controllers\PohonKinerjaController::class, 'index'])->name('pohon-kinerja.index');
    Route::post('/pohon-kinerja', [\App\Http\Controllers\PohonKinerjaController::class, 'store'])->name('pohon-kinerja.store');
    Route::put('/pohon-kinerja/{id}', [\App\Http\Controllers\PohonKinerjaController::class, 'update'])->name('pohon-kinerja.update');
    Route::delete('/pohon-kinerja/{id}', [\App\Http\Controllers\PohonKinerjaController::class, 'destroy'])->name('pohon-kinerja.destroy');

    Route::get('/iku', [\App\Http\Controllers\IkuController::class, 'index'])->name('iku.index');
    Route::post('/iku', [\App\Http\Controllers\IkuController::class, 'store'])->name('iku.store');
    Route::delete('/iku/{id}', [\App\Http\Controllers\IkuController::class, 'destroy'])->name('iku.destroy');
    Route::post('/iku/document', [\App\Http\Controllers\IkuController::class, 'storeDocument'])->name('iku.document.store');

    Route::get('/realisasi-anggaran', [\App\Http\Controllers\RealisasiAnggaranController::class, 'index'])->name('realisasi.index');
    Route::post('/realisasi-anggaran', [\App\Http\Controllers\RealisasiAnggaranController::class, 'store'])->name('realisasi.store');

    Route::get('/perjanjian-kinerja', [\App\Http\Controllers\DocumentUploadController::class, 'perjanjianKinerjaIndex'])->name('perjanjian-kinerja.index');
    Route::post('/perjanjian-kinerja', [\App\Http\Controllers\DocumentUploadController::class, 'storePerjanjianKinerja'])->name('perjanjian-kinerja.store');
    Route::post('/perjanjian-kinerja-perubahan', [\App\Http\Controllers\DocumentUploadController::class, 'storePerjanjianKinerjaPerubahan'])->name('perjanjian-kinerja-perubahan.store');

    Route::get('/lkjip', [\App\Http\Controllers\DocumentUploadController::class, 'lkjipIndex'])->name('lkjip.index');
    Route::post('/lkjip', [\App\Http\Controllers\DocumentUploadController::class, 'storeLkjip'])->name('lkjip.store');

    Route::get('/renstra', [\App\Http\Controllers\DocumentUploadController::class, 'renstraIndex'])->name('renstra.index');
    Route::post('/renstra', [\App\Http\Controllers\DocumentUploadController::class, 'storeRenstra'])->name('renstra.store');

    Route::get('/rencana-aksi', [\App\Http\Controllers\RencanaAksiController::class, 'index'])->name('rencana_aksi.index');
    Route::post('/rencana-aksi/store', [\App\Http\Controllers\RencanaAksiController::class, 'store'])->name('rencana_aksi.store');
    Route::put('/rencana-aksi/{id}', [\App\Http\Controllers\RencanaAksiController::class, 'update'])->name('rencana_aksi.update');
    Route::delete('/rencana-aksi/{id}', [\App\Http\Controllers\RencanaAksiController::class, 'destroy'])->name('rencana_aksi.destroy');
    Route::post('/rencana-aksi/import', [\App\Http\Controllers\RencanaAksiController::class, 'importExcel'])->name('rencana_aksi.import');
    Route::get('/rencana-aksi/print', [\App\Http\Controllers\RencanaAksiController::class, 'printPdf'])->name('rencana_aksi.print');

    Route::get('/dpa', [\App\Http\Controllers\DocumentUploadController::class, 'dpaIndex'])->name('dpa.index');
    Route::post('/dpa', [\App\Http\Controllers\DocumentUploadController::class, 'storeDpa'])->name('dpa.store');

    Route::get('/calk', [\App\Http\Controllers\DocumentUploadController::class, 'calkIndex'])->name('calk.index');
    Route::post('/calk', [\App\Http\Controllers\DocumentUploadController::class, 'storeCalk'])->name('calk.store');

    Route::get('/renja/form-e81', [\App\Http\Controllers\FormulirE81Controller::class, 'index'])->name('renja.form_e81.index');
    Route::post('/renja/form-e81/store', [\App\Http\Controllers\FormulirE81Controller::class, 'store'])->name('renja.form_e81.store');
    Route::put('/renja/form-e81/{id}', [\App\Http\Controllers\FormulirE81Controller::class, 'update'])->name('renja.form_e81.update');
    Route::post('/renja/form-e81/import', [\App\Http\Controllers\FormulirE81Controller::class, 'import'])->name('renja.form_e81.import');
    Route::delete('/renja/form-e81/{id}', [\App\Http\Controllers\FormulirE81Controller::class, 'destroy'])->name('renja.form_e81.destroy');

    Route::get('/renja/form-e75', [\App\Http\Controllers\FormulirE75Controller::class, 'index'])->name('renja.form_e75.index');
    Route::post('/renja/form-e75/store', [\App\Http\Controllers\FormulirE75Controller::class, 'store'])->name('renja.form_e75.store');
    Route::put('/renja/form-e75/{id}', [\App\Http\Controllers\FormulirE75Controller::class, 'update'])->name('renja.form_e75.update');
    Route::post('/renja/form-e75/import', [\App\Http\Controllers\FormulirE75Controller::class, 'import'])->name('renja.form_e75.import');
    Route::delete('/renja/form-e75/{id}', [\App\Http\Controllers\FormulirE75Controller::class, 'destroy'])->name('renja.form_e75.destroy');

    Route::get('/renja/form-e70', [\App\Http\Controllers\FormulirE70Controller::class, 'index'])->name('renja.form_e70.index');
    Route::post('/renja/form-e70/store', [\App\Http\Controllers\FormulirE70Controller::class, 'store'])->name('renja.form_e70.store');
    Route::put('/renja/form-e70/{id}', [\App\Http\Controllers\FormulirE70Controller::class, 'update'])->name('renja.form_e70.update');
    Route::delete('/renja/form-e70/{id}', [\App\Http\Controllers\FormulirE70Controller::class, 'destroy'])->name('renja.form_e70.destroy');

    Route::get('/renja/pelaksanaan-renstra', [\App\Http\Controllers\PelaksanaanRenstraController::class, 'index'])->name('renja.pelaksanaan_renstra.index');
    Route::post('/renja/pelaksanaan-renstra/store', [\App\Http\Controllers\PelaksanaanRenstraController::class, 'store'])->name('renja.pelaksanaan_renstra.store');
    Route::put('/renja/pelaksanaan-renstra/{id}', [\App\Http\Controllers\PelaksanaanRenstraController::class, 'update'])->name('renja.pelaksanaan_renstra.update');
    Route::post('/renja/pelaksanaan-renstra/import', [\App\Http\Controllers\PelaksanaanRenstraController::class, 'import'])->name('renja.pelaksanaan_renstra.import');
    Route::delete('/renja/pelaksanaan-renstra/{id}', [\App\Http\Controllers\PelaksanaanRenstraController::class, 'destroy'])->name('renja.pelaksanaan_renstra.destroy');

    Route::get('/renja/{type}', [\App\Http\Controllers\DocumentUploadController::class, 'genericRenjaIndex'])->name('renja.generic.index');
    Route::post('/renja/{type}', [\App\Http\Controllers\DocumentUploadController::class, 'genericRenjaStore'])->name('renja.generic.store');

    Route::get('/documents/{id}/view', [\App\Http\Controllers\DocumentUploadController::class, 'view'])->name('documents.view');
    Route::get('/documents/{id}/download', [\App\Http\Controllers\DocumentUploadController::class, 'download'])->name('documents.download');
    Route::delete('/documents/{id}', [\App\Http\Controllers\DocumentUploadController::class, 'destroy'])->name('documents.destroy');

    Route::get('/feedback-publik', [\App\Http\Controllers\FeedbackController::class, 'index'])->name('feedback.index');
    Route::delete('/feedback-publik/{id}', [\App\Http\Controllers\FeedbackController::class, 'destroy'])->name('feedback.destroy');

    Route::get('/admin/peraturan', [\App\Http\Controllers\PeraturanController::class, 'index'])->name('peraturan.index');
    Route::post('/admin/peraturan', [\App\Http\Controllers\PeraturanController::class, 'store'])->name('peraturan.store');
    Route::get('/peraturan/{id}/view', [\App\Http\Controllers\PeraturanController::class, 'view'])->name('peraturan.view');
    Route::get('/peraturan/{id}/download', [\App\Http\Controllers\PeraturanController::class, 'download'])->name('peraturan.download');
    Route::delete('/admin/peraturan/{id}', [\App\Http\Controllers\PeraturanController::class, 'destroy'])->name('peraturan.destroy');
});

require __DIR__.'/auth.php';
