import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import PanduanUpload from '@/Components/PanduanUpload';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function IkuIndex({ ikus, documents }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        sasaran_strategis: '',
        indikator_kinerja: '',
        satuan: '',
        definisi_operasional: '',
        baseline: '',
        target: '',
        realisasi: ''
    });

    const { data: docData, setData: setDocData, post: postDoc, processing: docProcessing, reset: resetDoc, errors: docErrors, progress: docProgress } = useForm({
        tahun: new Date().getFullYear(),
        file: null,
    });

    const submitForm = (e) => {
        e.preventDefault();
        post(route('iku.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const submitDocForm = (e) => {
        e.preventDefault();

        if (docData.file && docData.file.size > 10 * 1024 * 1024) {
            alert('Ukuran file maksimal adalah 10MB. File yang Anda pilih terlalu besar.');
            return;
        }

        postDoc(route('iku.document.store'), {
            preserveScroll: true,
            onSuccess: () => {
                resetDoc('file');
                alert('Dokumen berhasil diunggah!');
            },
            onError: (err) => {
                console.error(err);
                alert('Terjadi kesalahan validasi atau sistem. Cek pesan error di bawah form.');
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data IKU ini?')) {
            router.delete(route('iku.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteDocument = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus dokumen IKU ini?')) {
            router.delete(route('documents.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Indikator Kinerja Utama (IKU)
                </h2>
            }
        >
            <Head title="IKU" />

            <div className="py-8 bg-slate-900 min-h-screen text-slate-100">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Header Info */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Manajemen IKU
                        </h1>
                        <p className="text-slate-400 mt-2">Kelola data dan dokumen Indikator Kinerja Utama Perangkat Daerah.</p>
                    </div>

                    {/* Bagian Upload Dokumen IKU */}
                    <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                        <div className="mb-6 bg-indigo-500/20 border border-indigo-500/30 p-4 rounded-lg flex items-start space-x-3">
                            <svg className="w-6 h-6 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <div>
                                <h4 className="text-sm font-bold text-indigo-300">Informasi</h4>
                                <p className="text-sm text-slate-300 mt-1">
                                    Silakan unggah dokumen IKU (Indikator Kinerja Utama) format PDF. Maksimal ukuran file 10MB.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitDocForm} className="space-y-5 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Tahun Dokumen</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={docData.tahun} 
                                    onChange={e => setDocData('tahun', e.target.value)} 
                                    required 
                                />
                                {docErrors.tahun && <div className="text-rose-400 text-xs mt-1">{docErrors.tahun}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">File PDF</label>
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition" 
                                    onChange={e => setDocData('file', e.target.files[0])}
                                    required
                                />
                                {docErrors.file && <div className="text-rose-400 text-xs mt-1">{docErrors.file}</div>}
                                {docProgress && (
                                  <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                                    <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${docProgress.percentage}%` }}></div>
                                    <p className="text-xs text-slate-400 mt-1">{docProgress.percentage}% diunggah...</p>
                                  </div>
                                )}
                            </div>
                            <button type="submit" disabled={docProcessing} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-900/20 transition disabled:opacity-50 flex items-center">
                                {docProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Mengunggah...
                                    </>
                                ) : 'Unggah Dokumen'}
                            </button>
                        </form>

                        <div className="mt-8 border-t border-slate-700 pt-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Riwayat Unggahan Dokumen IKU
                            </h3>
                            {documents && documents.length > 0 ? (
                                <div className="overflow-x-auto rounded-lg border border-slate-700/50">
                                    <table className="w-full text-left border-collapse whitespace-nowrap">
                                        <thead className="bg-slate-700/50">
                                            <tr>
                                                <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider">Tahun</th>
                                                <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider">Nama File</th>
                                                <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider">Tanggal Unggah</th>
                                                <th className="p-3 border-b border-slate-600 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50 bg-slate-800/20">
                                            {documents.map(doc => (
                                                <tr key={doc.id} className="hover:bg-slate-700/40 transition-colors">
                                                    <td className="p-3 border-r border-slate-700/50 text-sm font-medium text-emerald-400">{doc.tahun}</td>
                                                    <td className="p-3 border-r border-slate-700/50 text-sm text-slate-300">{doc.nama_file}</td>
                                                    <td className="p-3 border-r border-slate-700/50 text-sm text-slate-400">{new Date(doc.created_at).toLocaleDateString('id-ID')}</td>
                                                    <td className="p-3 text-sm">
                                                        <div className="flex justify-end items-center space-x-2">
                                                            <a href={route('documents.view', doc.id)} target="_blank" rel="noopener noreferrer" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 p-2 rounded transition" title="Lihat">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                            </a>
                                                            <a href={route('documents.download', doc.id)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 p-2 rounded transition" title="Unduh">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                            </a>
                                                            <button 
                                                                onClick={() => handleDeleteDocument(doc.id)} 
                                                                className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 p-2 rounded transition" title="Hapus">
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
                                <p className="text-sm text-slate-500 italic p-4 text-center">Belum ada dokumen yang diunggah.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                Tabel IKU OPD
                            </h3>
                            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition font-medium flex items-center">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Tambah IKU
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead className="bg-slate-700/50">
                                    <tr>
                                        <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider text-center">No</th>
                                        <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider">Sasaran Strategis</th>
                                        <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider">Indikator</th>
                                        <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider">Satuan</th>
                                        <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider">Definisi Operasional</th>
                                        <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider">Baseline</th>
                                        <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider">Target</th>
                                        <th className="p-3 border-b border-r border-slate-600 text-xs font-semibold text-slate-300 uppercase tracking-wider">Realisasi</th>
                                        <th className="p-3 border-b border-slate-600 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50 bg-slate-800/20">
                                    {ikus && ikus.length > 0 ? (
                                        ikus.map((iku, index) => (
                                            <tr key={iku.id} className="hover:bg-slate-700/40 transition-colors">
                                                <td className="p-3 border-r border-slate-700/50 text-sm font-medium text-emerald-400 text-center">{index + 1}</td>
                                                <td className="p-3 border-r border-slate-700/50 text-sm text-slate-300">{iku.sasaran_strategis}</td>
                                                <td className="p-3 border-r border-slate-700/50 text-sm text-slate-300">{iku.indikator_kinerja}</td>
                                                <td className="p-3 border-r border-slate-700/50 text-sm text-slate-300">{iku.satuan}</td>
                                                <td className="p-3 border-r border-slate-700/50 text-sm text-slate-400">{iku.definisi_operasional || '-'}</td>
                                                <td className="p-3 border-r border-slate-700/50 text-sm text-slate-300 font-mono">{iku.baseline || '-'}</td>
                                                <td className="p-3 border-r border-slate-700/50 text-sm text-emerald-400 font-bold text-center font-mono">{iku.target}</td>
                                                <td className="p-3 border-r border-slate-700/50 text-sm text-slate-300 text-center font-mono">{iku.realisasi || '-'}</td>
                                                <td className="p-3 text-sm text-center">
                                                    <button
                                                        onClick={() => handleDelete(iku.id)}
                                                        className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 p-2 rounded transition" title="Hapus"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="p-4 text-center text-sm text-slate-500 italic">Belum ada data IKU.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Komponen Panduan Upload */}
                    <div className="mt-8">
                        <PanduanUpload />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="p-6 bg-slate-800 text-slate-100">
                    <h2 className="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-3">Tambah Data IKU</h2>
                    <form onSubmit={submitForm} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="sasaran_strategis" value="Sasaran Strategis" className="text-slate-300" />
                            <TextInput id="sasaran_strategis" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.sasaran_strategis} onChange={e => setData('sasaran_strategis', e.target.value)} required />
                        </div>
                        <div>
                            <InputLabel htmlFor="indikator_kinerja" value="Indikator Kinerja" className="text-slate-300" />
                            <TextInput id="indikator_kinerja" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.indikator_kinerja} onChange={e => setData('indikator_kinerja', e.target.value)} required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="satuan" value="Satuan" className="text-slate-300" />
                                <TextInput id="satuan" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.satuan} onChange={e => setData('satuan', e.target.value)} required />
                            </div>
                            <div>
                                <InputLabel htmlFor="baseline" value="Baseline (Tahun Sebelumnya)" className="text-slate-300" />
                                <TextInput id="baseline" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.baseline} onChange={e => setData('baseline', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="definisi_operasional" value="Definisi Operasional / Rumus" className="text-slate-300" />
                            <textarea id="definisi_operasional" className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" rows="2" value={data.definisi_operasional} onChange={e => setData('definisi_operasional', e.target.value)}></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="target" value="Target Tahun Ini" className="text-slate-300" />
                                <TextInput id="target" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.target} onChange={e => setData('target', e.target.value)} required />
                            </div>
                            <div>
                                <InputLabel htmlFor="realisasi" value="Capaian/Realisasi" className="text-slate-300" />
                                <TextInput id="realisasi" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.realisasi} onChange={e => setData('realisasi', e.target.value)} placeholder="Boleh dikosongkan dahulu" />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition">Batal</button>
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 disabled:opacity-50 font-medium">Simpan IKU</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
