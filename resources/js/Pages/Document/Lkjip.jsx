import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import PanduanUpload from '@/Components/PanduanUpload';

export default function Lkjip({ documents }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset, errors, progress } = useForm({
        tahun: new Date().getFullYear(),
        file: null,
    });

    const submitForm = (e) => {
        e.preventDefault();

        if (data.file && data.file.size > 10 * 1024 * 1024) {
            alert('Ukuran file maksimal adalah 10MB. File yang Anda pilih terlalu besar.');
            return;
        }

        post(route('lkjip.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('file');
                alert('Dokumen berhasil diunggah!');
            },
            onError: (err) => {
                console.error(err);
                alert('Terjadi kesalahan validasi atau sistem. Cek pesan error di bawah form.');
            }
        });
    };

    const handleDeleteDocument = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus dokumen LKjIP ini?')) {
            router.delete(route('documents.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Dokumen LKjIP
                </h2>
            }
        >
            <Head title="LKjIP" />

            <div className="py-8 bg-slate-900 min-h-screen text-slate-100">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* Header Info */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Manajemen Dokumen LKjIP
                        </h1>
                        <p className="text-slate-400 mt-2">Unggah dan kelola Laporan Kinerja Instansi Pemerintah (LKjIP) Perangkat Daerah.</p>
                    </div>

                    <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md mb-8">
                        <div className="mb-6 bg-indigo-500/20 border border-indigo-500/30 p-4 rounded-lg flex items-start space-x-3">
                            <svg className="w-6 h-6 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <div>
                                <h4 className="text-sm font-bold text-indigo-300">Informasi</h4>
                                <p className="text-sm text-slate-300 mt-1">
                                    Silakan unggah dokumen Laporan Kinerja Instansi Pemerintah (LKjIP) format PDF. Maksimal ukuran file 10MB.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitForm} className="space-y-5 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Tahun Dokumen</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={data.tahun} 
                                    onChange={e => setData('tahun', e.target.value)} 
                                    required 
                                />
                                {errors.tahun && <div className="text-rose-400 text-xs mt-1">{errors.tahun}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">File PDF</label>
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition" 
                                    onChange={e => setData('file', e.target.files[0])}
                                    required
                                />
                                {errors.file && <div className="text-rose-400 text-xs mt-1">{errors.file}</div>}
                                {progress && (
                                  <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                                    <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progress.percentage}%` }}></div>
                                    <p className="text-xs text-slate-400 mt-1">{progress.percentage}% diunggah...</p>
                                  </div>
                                )}
                            </div>
                            <button type="submit" disabled={processing} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-900/20 transition disabled:opacity-50 flex items-center">
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Mengunggah...
                                    </>
                                ) : 'Unggah Dokumen'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md mb-8">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Riwayat Unggahan LKjIP
                        </h3>
                        {documents && documents.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                                            <th className="p-3 border-b border-slate-600 rounded-tl-lg">Tahun</th>
                                            <th className="p-3 border-b border-slate-600">Nama File</th>
                                            <th className="p-3 border-b border-slate-600">Tanggal Unggah</th>
                                            <th className="p-3 border-b border-slate-600 text-right rounded-tr-lg">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50 text-sm">
                                        {documents.map(doc => (
                                            <tr key={doc.id} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="p-3 font-medium text-emerald-400">{doc.tahun}</td>
                                                <td className="p-3 text-slate-300">{doc.nama_file}</td>
                                                <td className="p-3 text-slate-400">{new Date(doc.created_at).toLocaleDateString('id-ID')}</td>
                                                <td className="p-3">
                                                    <div className="flex justify-end items-center space-x-2">
                                                        <a href={route('documents.view', doc.id)} target="_blank" rel="noopener noreferrer" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-2.5 py-1.5 rounded transition" title="Lihat">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                        </a>
                                                        <a href={route('documents.download', doc.id)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-2.5 py-1.5 rounded transition" title="Unduh">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                        </a>
                                                        <button 
                                                            onClick={() => handleDeleteDocument(doc.id)} 
                                                            className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 px-2.5 py-1.5 rounded transition" title="Hapus">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">Belum ada dokumen yang diunggah.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
