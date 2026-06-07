import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function Peraturan({ peraturan }) {
    return (
        <PublicLayout>
            <Head title="Peraturan - SAKIP Kota Sungai Penuh" />

            {/* Header Banner */}
            <div className="bg-blue-900 py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Peraturan</h1>
                        <p className="text-lg text-blue-100 mb-8">
                            Kumpulan dokumen peraturan, pedoman, dan kebijakan terkait Sistem Akuntabilitas Kinerja Instansi Pemerintah.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-slate-800">Daftar Peraturan</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                                        <th className="p-4 border-b font-semibold w-16 text-center">No</th>
                                        <th className="p-4 border-b font-semibold">Uraian / Judul Peraturan</th>
                                        <th className="p-4 border-b font-semibold w-48 text-center">Nomor</th>
                                        <th className="p-4 border-b font-semibold w-32 text-center">Tahun</th>
                                        <th className="p-4 border-b font-semibold w-40 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-700">
                                    {peraturan && peraturan.length > 0 ? (
                                        peraturan.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-slate-50 border-b border-gray-50 transition">
                                                <td className="p-4 text-center">{index + 1}</td>
                                                <td className="p-4">
                                                    <div className="font-semibold text-slate-800">{item.uraian}</div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                                                        {item.nomor}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center font-bold text-slate-600">{item.tahun}</td>
                                                <td className="p-4">
                                                    <div className="flex justify-center space-x-2">
                                                        <a href={route('peraturan.view', item.id)} target="_blank" rel="noopener noreferrer" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 px-2.5 py-1.5 rounded transition" title="Lihat">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                        </a>
                                                        <a href={route('peraturan.download', item.id)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-2.5 py-1.5 rounded transition" title="Unduh">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                                Belum ada dokumen peraturan yang diunggah.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
