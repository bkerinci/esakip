import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

export default function Evaluasi({ dokumen, opds }) {
    return (
        <PublicLayout>
            <Head title="Evaluasi Kinerja Publik" />

            {/* Header Banner */}
            <div className="bg-slate-800 py-12 border-b-4 border-blue-500">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Dokumen Evaluasi Kinerja</h1>
                    <p className="text-slate-300 max-w-2xl mx-auto">
                        Akses dokumen Laporan Hasil Evaluasi (LHE) SAKIP Pemerintah Kota Sungai Penuh. Transparansi untuk akuntabilitas.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Dokumen Pemerintah Kota (Utama) */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">1</span>
                            Tingkat Pemerintah Daerah
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {dokumen.map((doc) => (
                                <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col h-full group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform"></div>
                                    <div className="flex items-start mb-4">
                                        <div className="text-3xl mr-4">{doc.icon}</div>
                                        <div>
                                            <h3 className="font-bold text-slate-700 text-lg group-hover:text-blue-600 transition">{doc.nama}</h3>
                                            <div className="inline-block mt-1 px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded">
                                                Tahun {doc.tahun}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 flex justify-end items-center border-t border-gray-100 space-x-2">
                                        <a href={doc.link} onClick={(e) => { if(doc.link==='#') { e.preventDefault(); alert('Dokumen belum tersedia.'); } }} className="flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded transition">
                                            👁️ Lihat
                                        </a>
                                        <a href={doc.link} onClick={(e) => { if(doc.link==='#') { e.preventDefault(); alert('Dokumen belum tersedia.'); } }} className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded transition">
                                            📥 Unduh
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dokumen Perangkat Daerah (OPD) */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">2</span>
                            Tingkat Perangkat Daerah (OPD)
                        </h2>
                        
                        <div className="space-y-6">
                            {opds && opds.map(opd => (
                                <div key={opd.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-slate-800 text-lg mb-4 border-b pb-2">{opd.nama}</h3>
                                    
                                    {opd.documents && opd.documents.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                                        <th className="p-3 border-b">Jenis Dokumen</th>
                                                        <th className="p-3 border-b text-center">Tahun</th>
                                                        <th className="p-3 border-b">Nama File</th>
                                                        <th className="p-3 border-b text-right">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 text-sm">
                                                    {opd.documents.map(doc => (
                                                        <tr key={doc.id} className="hover:bg-slate-50">
                                                            <td className="p-3 font-medium text-slate-700">
                                                                {doc.jenis_dokumen === 'lhe' && 'LHE'}
                                                            </td>
                                                            <td className="p-3 text-slate-600 text-center font-semibold">{doc.tahun}</td>
                                                            <td className="p-3 text-slate-600">{doc.nama_file}</td>
                                                            <td className="p-3 text-right">
                                                                <div className="flex justify-end items-center space-x-2">
                                                                    <a href={route('publik.documents.view', doc.id)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded transition font-medium" title="Lihat">
                                                                        👁️ Lihat
                                                                    </a>
                                                                    <a href={route('publik.documents.download', doc.id)} className="inline-flex items-center text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded transition font-medium" title="Unduh">
                                                                        📥 Unduh
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-slate-50 rounded border border-dashed border-gray-200">
                                            <p className="text-gray-400 text-sm italic">Belum ada dokumen LHE yang diunggah.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
