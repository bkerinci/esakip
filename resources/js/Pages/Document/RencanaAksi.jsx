import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PanduanUpload from '@/Components/PanduanUpload';

export default function RencanaAksi({ rencana_aksis }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        nomor: '',
        sasaran: '',
        indikator_kinerja: '',
        tw_1: '',
        tw_2: '',
        tw_3: '',
        tw_4: '',
        aktifitas: '',
        penanggung_jawab: '',
        anggaran: '',
    });

    const { data: excelData, setData: setExcelData, post: postExcel, processing: excelProcessing, errors: excelErrors, reset: resetExcel } = useForm({
        file: null,
    });

    const openAddModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingId(item.id);
        setData({
            nomor: item.nomor || '',
            sasaran: item.sasaran || '',
            indikator_kinerja: item.indikator_kinerja || '',
            tw_1: item.tw_1 || '',
            tw_2: item.tw_2 || '',
            tw_3: item.tw_3 || '',
            tw_4: item.tw_4 || '',
            aktifitas: item.aktifitas || '',
            penanggung_jawab: item.penanggung_jawab || '',
            anggaran: item.anggaran || '',
        });
        setIsModalOpen(true);
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('rencana_aksi.update', editingId), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('rencana_aksi.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const submitExcel = (e) => {
        e.preventDefault();
        if (excelData.file && excelData.file.size > 10 * 1024 * 1024) {
            alert('Ukuran file maksimal adalah 10MB. File yang Anda pilih terlalu besar.');
            return;
        }

        postExcel(route('rencana_aksi.import'), {
            preserveScroll: true,
            onSuccess: () => {
                resetExcel('file');
                alert('Data Excel berhasil diimpor!');
            },
            onError: () => {
                alert('Gagal mengimpor data. Pastikan format file Excel sesuai (.xlsx)');
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data Rencana Aksi ini?')) {
            router.delete(route('rencana_aksi.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Rencana Aksi
                </h2>
            }
        >
            <Head title="Rencana Aksi" />

            <div className="py-8 bg-slate-900 min-h-screen text-slate-100">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Info */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Manajemen Rencana Aksi
                        </h1>
                        <p className="text-slate-400 mt-2">Kelola data dan target Rencana Aksi Perangkat Daerah.</p>
                    </div>

                    {/* Bagian Import Excel */}
                    <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Import Data dari Excel
                                </h3>
                                <p className="text-sm text-slate-400 mb-4">
                                    Unggah file Excel (.xlsx) dengan struktur tabel Rencana Aksi. Baris 1-4 akan diabaikan (dianggap header).
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitExcel} className="flex items-end gap-4 max-w-xl">
                            <div className="flex-grow">
                                <input 
                                    type="file" 
                                    accept=".xlsx, .xls" 
                                    className="block w-full text-sm text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 bg-slate-700 border border-slate-600 rounded-lg transition" 
                                    onChange={e => setExcelData('file', e.target.files[0])}
                                    required
                                />
                                {excelErrors.file && <div className="text-rose-400 text-xs mt-1">{excelErrors.file}</div>}
                            </div>
                            <button type="submit" disabled={excelProcessing} className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition disabled:opacity-50 h-[44px] flex items-center font-medium">
                                {excelProcessing ? 'Mengimpor...' : 'Import Excel'}
                            </button>
                        </form>
                    </div>

                    {/* Tabel Data Rencana Aksi */}
                    <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                Tabel Rencana Aksi
                            </h3>
                            <div className="flex gap-3">
                                <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition font-medium flex items-center">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    Tambah Data
                                </button>
                                <a 
                                    href={route('rencana_aksi.print')} 
                                    target="_blank" 
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition flex items-center font-medium"
                                >
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    Cetak PDF
                                </a>
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
                            <table className="min-w-full divide-y divide-slate-700/50">
                                <thead className="bg-slate-700/50">
                                    <tr>
                                        <th rowSpan="2" className="border-b border-r border-slate-600 px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Nomor</th>
                                        <th rowSpan="2" className="border-b border-r border-slate-600 px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Sasaran (Strategis/ Program/ Kegiatan)</th>
                                        <th rowSpan="2" className="border-b border-r border-slate-600 px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Indikator Kinerja (Program/kegiatan)</th>
                                        <th colSpan="4" className="border-b border-r border-slate-600 px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Target Kinerja</th>
                                        <th rowSpan="2" className="border-b border-r border-slate-600 px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Aktifitas yang direncanakan</th>
                                        <th rowSpan="2" className="border-b border-r border-slate-600 px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Penanggung Jawab</th>
                                        <th rowSpan="2" className="border-b border-r border-slate-600 px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Anggaran (Rp)</th>
                                        <th rowSpan="2" className="border-b border-slate-600 px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider w-24">Aksi</th>
                                    </tr>
                                    <tr className="bg-slate-700/30">
                                        <th className="border-b border-r border-slate-600 px-3 py-2 text-center text-xs font-semibold text-emerald-400 uppercase tracking-wider">TW 1</th>
                                        <th className="border-b border-r border-slate-600 px-3 py-2 text-center text-xs font-semibold text-emerald-400 uppercase tracking-wider">TW 2</th>
                                        <th className="border-b border-r border-slate-600 px-3 py-2 text-center text-xs font-semibold text-emerald-400 uppercase tracking-wider">TW 3</th>
                                        <th className="border-b border-r border-slate-600 px-3 py-2 text-center text-xs font-semibold text-emerald-400 uppercase tracking-wider">TW 4</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50 bg-slate-800/20">
                                    {rencana_aksis && rencana_aksis.length > 0 ? (
                                        rencana_aksis.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-slate-700/40 transition-colors">
                                                <td className="border-r border-slate-700/50 px-4 py-3 text-sm text-emerald-400 font-medium text-center">{index + 1}</td>
                                                <td className="border-r border-slate-700/50 px-4 py-3 text-sm text-slate-300">{item.sasaran}</td>
                                                <td className="border-r border-slate-700/50 px-4 py-3 text-sm text-slate-300">{item.indikator_kinerja}</td>
                                                <td className="border-r border-slate-700/50 px-3 py-3 text-sm text-slate-300 text-center">{item.tw_1}</td>
                                                <td className="border-r border-slate-700/50 px-3 py-3 text-sm text-slate-300 text-center">{item.tw_2}</td>
                                                <td className="border-r border-slate-700/50 px-3 py-3 text-sm text-slate-300 text-center">{item.tw_3}</td>
                                                <td className="border-r border-slate-700/50 px-3 py-3 text-sm text-slate-300 text-center">{item.tw_4}</td>
                                                <td className="border-r border-slate-700/50 px-4 py-3 text-sm text-slate-300">{item.aktifitas}</td>
                                                <td className="border-r border-slate-700/50 px-4 py-3 text-sm text-slate-300">{item.penanggung_jawab}</td>
                                                <td className="border-r border-slate-700/50 px-4 py-3 text-sm text-slate-300 text-right font-mono">{item.anggaran}</td>
                                                <td className="px-3 py-3 text-sm text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button onClick={() => openEditModal(item)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 p-2 rounded transition" title="Ubah">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 p-2 rounded transition" title="Hapus">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="px-6 py-8 text-center text-sm text-slate-500 italic">Belum ada data Rencana Aksi.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-8">
                        <PanduanUpload />
                    </div>
                </div>
            </div>

            {/* Modal Tambah/Ubah */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="p-6 bg-slate-800 text-slate-100">
                    <h2 className="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-3">{editingId ? 'Ubah Data Rencana Aksi' : 'Tambah Data Rencana Aksi'}</h2>
                    <form onSubmit={submitForm} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="nomor" value="Nomor" className="text-slate-300" />
                            <TextInput id="nomor" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.nomor} onChange={e => setData('nomor', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel htmlFor="sasaran" value="Sasaran (Strategis/ Program/ Kegiatan)" className="text-slate-300" />
                            <textarea id="sasaran" className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" rows="2" value={data.sasaran} onChange={e => setData('sasaran', e.target.value)}></textarea>
                        </div>
                        <div>
                            <InputLabel htmlFor="indikator_kinerja" value="Indikator Kinerja" className="text-slate-300" />
                            <textarea id="indikator_kinerja" className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" rows="2" value={data.indikator_kinerja} onChange={e => setData('indikator_kinerja', e.target.value)}></textarea>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <InputLabel htmlFor="tw_1" value="TW 1" className="text-slate-300" />
                                <TextInput id="tw_1" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.tw_1} onChange={e => setData('tw_1', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="tw_2" value="TW 2" className="text-slate-300" />
                                <TextInput id="tw_2" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.tw_2} onChange={e => setData('tw_2', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="tw_3" value="TW 3" className="text-slate-300" />
                                <TextInput id="tw_3" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.tw_3} onChange={e => setData('tw_3', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="tw_4" value="TW 4" className="text-slate-300" />
                                <TextInput id="tw_4" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.tw_4} onChange={e => setData('tw_4', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="aktifitas" value="Aktifitas yang direncanakan" className="text-slate-300" />
                            <textarea id="aktifitas" className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" rows="2" value={data.aktifitas} onChange={e => setData('aktifitas', e.target.value)}></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="penanggung_jawab" value="Penanggung Jawab" className="text-slate-300" />
                                <TextInput id="penanggung_jawab" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500" value={data.penanggung_jawab} onChange={e => setData('penanggung_jawab', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="anggaran" value="Anggaran (Rp)" className="text-slate-300" />
                                <TextInput id="anggaran" className="mt-1 block w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500 font-mono" value={data.anggaran} onChange={e => setData('anggaran', e.target.value)} />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition">Batal</button>
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 disabled:opacity-50 font-medium">Simpan</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
