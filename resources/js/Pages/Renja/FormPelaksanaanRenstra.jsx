import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, useForm } from '@inertiajs/react';

import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function FormPelaksanaanRenstra({ auth, formulir_data }) {
    const { opd, flash } = usePage().props;
    
    // Default to current year for the PDF print headers
    const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear().toString());

    // Manual Input Modal State
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        nomor: '',
        renstra_pd: '',
        renja_pd: '',
        kesesuaian: '',
        evaluasi: '',
        tindak_lanjut: '',
        hasil_tindak_lanjut: '',
    });

    // Form for Excel import
    const { data: importData, setData: setImportData, post: postImport, processing: importProcessing, reset: resetImport, errors: importErrors, progress } = useForm({
        file: null,
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const openManualInput = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({
            nomor: '',
            renstra_pd: '',
            renja_pd: '',
            kesesuaian: '',
            evaluasi: '',
            tindak_lanjut: '',
            hasil_tindak_lanjut: '',
        });
        setIsManualModalOpen(true);
    };

    const editManualInput = (record) => {
        setIsEditing(true);
        setEditId(record.id);
        setFormData({
            nomor: record.nomor || '',
            renstra_pd: record.renstra_pd || '',
            renja_pd: record.renja_pd || '',
            kesesuaian: record.kesesuaian || '',
            evaluasi: record.evaluasi || '',
            tindak_lanjut: record.tindak_lanjut || '',
            hasil_tindak_lanjut: record.hasil_tindak_lanjut || '',
        });
        setIsManualModalOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            router.put(route('renja.pelaksanaan_renstra.update', editId), formData, {
                onSuccess: () => setIsManualModalOpen(false),
            });
        } else {
            router.post(route('renja.pelaksanaan_renstra.store'), formData, {
                onSuccess: () => setIsManualModalOpen(false),
            });
        }
    };

    const submitImport = (e) => {
        e.preventDefault();
        postImport(route('renja.pelaksanaan_renstra.import'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsImportModalOpen(false);
                resetImport('file');
                alert('File Excel berhasil di-import!');
            },
        });
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        router.delete(route('renja.pelaksanaan_renstra.destroy', deleteId), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center print:hidden">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Pelaksanaan Renstra
                    </h2>
                    <div className="flex space-x-2">
                        <select 
                            value={selectedTahun}
                            onChange={(e) => setSelectedTahun(e.target.value)}
                            className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        >
                            {[...Array(5)].map((_, i) => {
                                const year = new Date().getFullYear() - 2 + i;
                                return <option key={year} value={year}>{year}</option>;
                            })}
                        </select>
                        <button 
                            onClick={() => window.print()}
                            className="inline-flex items-center px-4 py-2 bg-slate-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-slate-700 shadow"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                            Cetak PDF
                        </button>
                        <PrimaryButton className="bg-green-600 hover:bg-green-700" onClick={() => setIsImportModalOpen(true)}>
                            Import Excel
                        </PrimaryButton>
                        <PrimaryButton onClick={openManualInput}>
                            Input Manual
                        </PrimaryButton>
                    </div>
                </div>
            }
        >
            <Head title={`Pelaksanaan Renstra - ${auth?.user?.opd?.nama || 'OPD Belum Diatur'}`} />

            <div className="py-12 print:py-0 print:m-0">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 print:max-w-none print:px-0">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg print:shadow-none print:bg-transparent">
                        <div className="p-6 text-gray-900 print:p-0">
                            
                            {/* Flash Messages */}
                            {flash?.success && (
                                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded print:hidden">
                                    {flash.success}
                                </div>
                            )}
                            {importErrors?.file && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded print:hidden">
                                    {importErrors.file}
                                </div>
                            )}

                            {/* Header Formulir */}
                            <div className="mb-6 flex items-center justify-between border-b pb-4">
                                <div className="w-24 hidden print:block">
                                    <img src="/images/logo_sungai_penuh.png" alt="Logo" className="w-full" />
                                </div>
                                <div className="text-center flex-1">
                                    <h3 className="font-bold text-lg">Pengendalian dan Evaluasi terhadap Pelaksanaan Renstra Perangkat Daerah</h3>
                                    <h4 className="font-semibold text-md">Kabupaten/Kota : SUNGAI PENUH</h4>
                                </div>
                                <div className="w-24 hidden print:block"></div>
                            </div>

                            <div className="mb-6 text-sm font-semibold overflow-x-auto">
                                <table className="whitespace-nowrap border-none">
                                    <tbody>
                                        <tr>
                                            <td className="pr-4 py-1">Perangkat Daerah</td>
                                            <td className="py-1" colSpan="3">: {auth.user.opd?.nama || 'OPD Belum Diatur'}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-4 py-1">Periode Renstra Perangkat Daerah</td>
                                            <td className="pr-16 py-1">: {selectedTahun}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-max w-full border-collapse text-sm print:text-xs">
                                    <thead className="text-gray-900 text-center align-middle font-bold">
                                        <tr>
                                            <th rowSpan="2" className="border px-2 py-2 border-black w-12 bg-white">No</th>
                                            <th rowSpan="2" className="border px-4 py-2 border-black w-64 bg-white">RENSTRA PD</th>
                                            <th rowSpan="2" className="border px-4 py-2 border-black w-64 bg-white">RENJA PD</th>
                                            
                                            <th colSpan="2" className="border px-2 py-2 border-black bg-white">Kesesuaian / Relevansi</th>
                                            
                                            <th rowSpan="2" className="border px-4 py-2 border-black w-48 bg-white">Evaluasi</th>
                                            <th rowSpan="2" className="border px-4 py-2 border-black w-48 bg-white">Tindak Lanjut</th>
                                            <th rowSpan="2" className="border px-4 py-2 border-black w-48 bg-white">Hasil Tindak Lanjut</th>
                                            <th rowSpan="2" className="border px-2 py-2 w-24 border-black bg-white print:hidden">Aksi</th>
                                        </tr>
                                        <tr>
                                            <th className="border px-2 py-1 border-black bg-white w-16">Ya</th>
                                            <th className="border px-2 py-1 border-black bg-white w-16">Tidak</th>
                                        </tr>
                                        <tr className="bg-white">
                                            <th className="border px-2 py-1 border-black text-xs font-normal text-center">-</th>
                                            <th className="border px-2 py-1 border-black text-xs font-normal text-center">1</th>
                                            <th className="border px-2 py-1 border-black text-xs font-normal text-center">2</th>
                                            <th className="border px-2 py-1 border-black text-xs font-normal text-center">(3a)</th>
                                            <th className="border px-2 py-1 border-black text-xs font-normal text-center">(3b)</th>
                                            <th className="border px-2 py-1 border-black text-xs font-normal text-center">4</th>
                                            <th className="border px-2 py-1 border-black text-xs font-normal text-center">5</th>
                                            <th className="border px-2 py-1 border-black text-xs font-normal text-center">6</th>
                                            <th className="border px-2 py-1 border-black text-xs font-normal text-center print:hidden"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formulir_data.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="text-center py-4 text-gray-500 border border-black">
                                                    Belum ada data.
                                                </td>
                                            </tr>
                                        ) : (
                                            formulir_data.map((row, index) => (
                                                <tr key={row.id} className="hover:bg-gray-50 align-top">
                                                    <td className="border px-2 py-2 border-black text-center">{index + 1}</td>
                                                    <td className="border px-4 py-2 border-black whitespace-pre-wrap break-words">{row.renstra_pd}</td>
                                                    <td className="border px-4 py-2 border-black whitespace-pre-wrap break-words">{row.renja_pd}</td>
                                                    
                                                    <td className="border px-2 py-2 text-center font-bold text-gray-900 border-black">
                                                        {row.kesesuaian === 'Ya' ? '✓' : ''}
                                                    </td>
                                                    <td className="border px-2 py-2 text-center font-bold text-gray-900 border-black">
                                                        {row.kesesuaian === 'Tidak' ? '✓' : ''}
                                                    </td>
                                                    
                                                    <td className="border px-4 py-2 border-black whitespace-pre-wrap break-words">{row.evaluasi}</td>
                                                    <td className="border px-4 py-2 border-black whitespace-pre-wrap break-words">{row.tindak_lanjut}</td>
                                                    <td className="border px-4 py-2 border-black whitespace-pre-wrap break-words">{row.hasil_tindak_lanjut}</td>
                                                    
                                                    <td className="border px-2 py-2 text-center border-black print:hidden flex flex-col items-center justify-center space-y-2 h-full">
                                                        <button 
                                                            onClick={() => editManualInput(row)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => confirmDelete(row.id)}
                                                            className="text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Panduan Import Excel */}
                    <div className="mt-8 overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500 print:hidden">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Panduan Import Excel (Pelaksanaan Renstra)
                        </h3>
                        <div className="text-sm text-gray-600 space-y-3">
                            <p>Pembacaan data dimulai secara otomatis dari <strong>Baris ke-4 (Row 4)</strong>. Pastikan baris 1 s/d 3 di file Excel Anda dikosongkan atau digunakan untuk Header/Judul Tabel.</p>
                            <h4 className="font-semibold text-gray-800 mt-4 border-b pb-2">Susunan Kolom Excel (Kiri ke Kanan)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-2 bg-gray-50 p-4 rounded border">
                                <div><strong className="text-blue-600">Kolom A:</strong> Nomor Urut (Opsional)</div>
                                <div><strong className="text-blue-600">Kolom B:</strong> RENSTRA PD</div>
                                <div><strong className="text-blue-600">Kolom C:</strong> RENJA PD</div>
                                <div><strong className="text-blue-600">Kolom D:</strong> Kesesuaian (Isi dengan "Ya" atau "Tidak")</div>
                                <div><strong className="text-blue-600">Kolom E:</strong> Evaluasi</div>
                                <div><strong className="text-blue-600">Kolom F:</strong> Tindak Lanjut</div>
                                <div><strong className="text-blue-600">Kolom G:</strong> Hasil Tindak Lanjut</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Import Excel */}
            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Import Data dari Excel</h2>
                    <form onSubmit={submitImport} className="space-y-4">
                        <div>
                            <InputLabel value="File Excel (.xlsx)" />
                            <input 
                                type="file" 
                                accept=".xlsx,.xls" 
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700" 
                                onChange={e => setImportData('file', e.target.files[0])}
                                required
                            />
                            {progress && <progress value={progress.percentage} max="100">{progress.percentage}%</progress>}
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <SecondaryButton onClick={() => setIsImportModalOpen(false)}>Batal</SecondaryButton>
                            <PrimaryButton disabled={importProcessing}>Upload & Import</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Manual Input Modal */}
            <Modal show={isManualModalOpen} onClose={() => setIsManualModalOpen(false)} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {isEditing ? 'Edit Data Pelaksanaan Renstra' : 'Input Data Pelaksanaan Renstra'}
                    </h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="renstra_pd" value="RENSTRA PD (Kolom 1)" />
                            <textarea
                                id="renstra_pd"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="3"
                                value={formData.renstra_pd}
                                onChange={(e) => setFormData({ ...formData, renstra_pd: e.target.value })}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="renja_pd" value="RENJA PD (Kolom 2)" />
                            <textarea
                                id="renja_pd"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="3"
                                value={formData.renja_pd}
                                onChange={(e) => setFormData({ ...formData, renja_pd: e.target.value })}
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Kesesuaian / Relevansi</h3>
                            
                            <div className="mb-3">
                                <div className="mt-2 flex space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                            value="Ya"
                                            checked={formData.kesesuaian === 'Ya'}
                                            onChange={(e) => setFormData({ ...formData, kesesuaian: e.target.value })}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Ya (3a)</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                            value="Tidak"
                                            checked={formData.kesesuaian === 'Tidak'}
                                            onChange={(e) => setFormData({ ...formData, kesesuaian: e.target.value })}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Tidak (3b)</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                            value=""
                                            checked={formData.kesesuaian === ''}
                                            onChange={(e) => setFormData({ ...formData, kesesuaian: e.target.value })}
                                        />
                                        <span className="ml-2 text-sm text-gray-500 italic">Belum Diisi</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="evaluasi" value="Evaluasi (Kolom 4)" />
                            <textarea
                                id="evaluasi"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="2"
                                value={formData.evaluasi}
                                onChange={(e) => setFormData({ ...formData, evaluasi: e.target.value })}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="tindak_lanjut" value="Tindak Lanjut (Kolom 5)" />
                            <textarea
                                id="tindak_lanjut"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="2"
                                value={formData.tindak_lanjut}
                                onChange={(e) => setFormData({ ...formData, tindak_lanjut: e.target.value })}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="hasil_tindak_lanjut" value="Hasil Tindak Lanjut (Kolom 6)" />
                            <textarea
                                id="hasil_tindak_lanjut"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="2"
                                value={formData.hasil_tindak_lanjut}
                                onChange={(e) => setFormData({ ...formData, hasil_tindak_lanjut: e.target.value })}
                            />
                        </div>

                        <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
                            <SecondaryButton onClick={() => setIsManualModalOpen(false)}>
                                Batal
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                Simpan
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Konfirmasi Hapus Data
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus data ini? Data yang telah dihapus tidak dapat dikembalikan.
                    </p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <SecondaryButton onClick={() => setIsDeleteModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete}>
                            Hapus
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
