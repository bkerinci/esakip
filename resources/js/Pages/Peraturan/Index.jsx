import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function Index({ peraturan }) {
    const { auth } = usePage().props;
    const isSuperAdmin = auth.user.role === 'super_admin';
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const { data, setData, post, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        uraian: '',
        nomor: '',
        tahun: new Date().getFullYear(),
        file: null,
    });

    const submitUpload = (e) => {
        e.preventDefault();
        post(route('peraturan.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                alert('Peraturan berhasil diunggah!');
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus peraturan ini?')) {
            destroy(route('peraturan.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Peraturan berhasil dihapus!');
                }
            });
        }
    };

    // If not super admin, technically they shouldn't reach here due to menu hiding,
    // but just in case:
    if (!isSuperAdmin) {
        return (
            <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-slate-800">Akses Ditolak</h2>}>
                <div className="py-12"><div className="mx-auto max-w-7xl sm:px-6 lg:px-8">Hanya Super Admin yang dapat mengakses halaman ini.</div></div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-800">
                    Manajemen Peraturan
                </h2>
            }
        >
            <Head title="Manajemen Peraturan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* Header with Upload Button */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Daftar Dokumen Peraturan</h3>
                            <p className="text-sm text-gray-500">Kelola dokumen peraturan yang tampil di halaman publik.</p>
                        </div>
                        <button
                            onClick={() => setIsUploading(!isUploading)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            {isUploading ? 'Batal Upload' : 'Upload Peraturan'}
                        </button>
                    </div>

                    {/* Upload Form */}
                    {isUploading && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 transition-all duration-300">
                            <h4 className="text-md font-bold text-slate-800 mb-4 border-b pb-2">Form Upload Peraturan Baru</h4>
                            <form onSubmit={submitUpload} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Uraian / Judul Peraturan</label>
                                        <input
                                            type="text"
                                            value={data.uraian}
                                            onChange={e => setData('uraian', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Contoh: Peraturan Walikota Sungai Penuh tentang..."
                                            required
                                        />
                                        {errors.uraian && <div className="text-red-500 text-xs mt-1">{errors.uraian}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor</label>
                                        <input
                                            type="text"
                                            value={data.nomor}
                                            onChange={e => setData('nomor', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Contoh: 12 Tahun 2024"
                                            required
                                        />
                                        {errors.nomor && <div className="text-red-500 text-xs mt-1">{errors.nomor}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                                        <input
                                            type="number"
                                            value={data.tahun}
                                            onChange={e => setData('tahun', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.tahun && <div className="text-red-500 text-xs mt-1">{errors.tahun}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">File Dokumen (PDF, Maks 10MB)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            ref={fileInputRef}
                                            onChange={e => setData('file', e.target.files[0])}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md p-1"
                                            required
                                        />
                                        {errors.file && <div className="text-red-500 text-xs mt-1">{errors.file}</div>}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-sm transition shadow-sm disabled:opacity-50"
                                    >
                                        {processing ? 'Mengunggah...' : 'Simpan Peraturan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-gray-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                        <th className="p-4 text-center w-16">No</th>
                                        <th className="p-4">Uraian / Judul</th>
                                        <th className="p-4 text-center w-40">Nomor</th>
                                        <th className="p-4 text-center w-24">Tahun</th>
                                        <th className="p-4 text-center w-48">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700 divide-y divide-gray-100">
                                    {peraturan && peraturan.length > 0 ? (
                                        peraturan.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-slate-50 transition">
                                                <td className="p-4 text-center">{index + 1}</td>
                                                <td className="p-4 font-medium text-slate-800">{item.uraian}</td>
                                                <td className="p-4 text-center"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{item.nomor}</span></td>
                                                <td className="p-4 text-center font-bold">{item.tahun}</td>
                                                <td className="p-4 text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <a href={route('peraturan.view', item.id)} target="_blank" rel="noopener noreferrer" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 px-2.5 py-1.5 rounded transition" title="Lihat">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                        </a>
                                                        <a href={route('peraturan.download', item.id)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-2.5 py-1.5 rounded transition" title="Unduh">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                        </a>
                                                        <button onClick={() => handleDelete(item.id)} className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-2.5 py-1.5 rounded transition" title="Hapus">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                                Belum ada data peraturan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
