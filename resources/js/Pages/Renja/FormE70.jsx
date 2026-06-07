import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';

import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function FormE70({ auth, formulir_data }) {
    const { opd } = usePage().props;
    
    // Default to current year for the PDF print headers (since DB doesn't track year as requested)
    const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear().toString());

    // Manual Input Modal State
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        nomor: '',
        jenis_kegiatan: '',
        kesesuaian: '',
        faktor_penyebab: '',
        tindak_lanjut: '',
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const openManualInput = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({
            nomor: '',
            jenis_kegiatan: '',
            kesesuaian: '',
            faktor_penyebab: '',
            tindak_lanjut: '',
        });
        setIsManualModalOpen(true);
    };

    const editManualInput = (record) => {
        setIsEditing(true);
        setEditId(record.id);
        setFormData({
            nomor: record.nomor || '',
            jenis_kegiatan: record.jenis_kegiatan || '',
            kesesuaian: record.kesesuaian || '',
            faktor_penyebab: record.faktor_penyebab || '',
            tindak_lanjut: record.tindak_lanjut || '',
        });
        setIsManualModalOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            router.put(route('renja.form_e70.update', editId), formData, {
                onSuccess: () => setIsManualModalOpen(false),
            });
        } else {
            router.post(route('renja.form_e70.store'), formData, {
                onSuccess: () => setIsManualModalOpen(false),
            });
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        router.delete(route('renja.form_e70.destroy', deleteId), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center print:hidden">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Formulir E.70 (Evaluasi Kebijakan Renja)
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
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                        >
                            Cetak PDF
                        </button>
                        <PrimaryButton onClick={openManualInput}>
                            Input Manual
                        </PrimaryButton>
                    </div>
                </div>
            }
        >
            <Head title={`Formulir E.70 - ${auth?.user?.opd?.nama || 'OPD Belum Diatur'}`} />

            <div className="py-12 print:py-0 print:m-0">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 print:max-w-none print:px-0">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg print:shadow-none print:bg-transparent">
                        <div className="p-6 text-gray-900 print:p-0">
                            
                            {/* KOP PDF (Only visible when printing) */}
                            <div className="hidden print:block mb-6">
                                <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-4">
                                    <div className="w-24">
                                        <img src="/images/logo_sungaipenuh.png" alt="Logo" className="w-full h-auto" />
                                    </div>
                                    <div className="flex-1 text-center">
                                        <h1 className="text-xl font-bold uppercase">PEMERINTAH KOTA SUNGAI PENUH</h1>
                                        <h2 className="text-2xl font-extrabold uppercase">{auth.user.opd?.nama || 'NAMA OPD'}</h2>
                                        <p className="text-sm mt-1 text-gray-600">Jalan ...</p>
                                    </div>
                                    <div className="w-24"></div>
                                </div>
                            </div>

                            {/* Header Formulir */}
                            <div className="mb-4 text-center border-b pb-4">
                                <h3 className="font-bold text-lg uppercase">Formulir E.70</h3>
                                <h4 className="font-semibold text-md">Pengendalian & Evaluasi Terhadap Kebijakan Renja Perangkat Daerah</h4>
                                <h4 className="font-semibold text-md">Kabupaten/Kota : Sungai Penuh</h4>
                            </div>

                            <div className="mb-6 text-sm font-semibold overflow-x-auto">
                                <table className="whitespace-nowrap border-none">
                                    <tbody>
                                        <tr>
                                            <td className="pr-4 py-1">Perangkat Daerah</td>
                                            <td className="py-1" colSpan="3">: {auth.user.opd?.nama || 'OPD Belum Diatur'}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-4 py-1">Periode Renja Perangkat Daerah</td>
                                            <td className="pr-16 py-1">: {selectedTahun}</td>
                                            <td className="pr-4 py-1">Periode RKA Perangkat Daerah</td>
                                            <td className="py-1">: {selectedTahun}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-max w-full border-collapse text-sm print:text-xs">
                                    <thead className="bg-gray-100 text-gray-700 text-center align-middle">
                                        <tr>
                                            <th rowSpan="2" className="border px-2 py-2 w-12 border-gray-400">No</th>
                                            <th rowSpan="2" className="border px-4 py-2 border-gray-400 min-w-[200px]">Jenis Kegiatan</th>
                                            
                                            <th colSpan="4" className="border px-2 py-2 border-gray-400 bg-blue-50">Hasil Pengendalian dan Evaluasi</th>
                                            
                                            <th rowSpan="2" className="border px-2 py-2 w-24 border-gray-400 print:hidden">Aksi</th>
                                        </tr>
                                        <tr>
                                            <th colSpan="2" className="border px-2 py-1 border-gray-400 bg-green-50">Kesesuaian</th>
                                            <th rowSpan="2" className="border px-2 py-1 border-gray-400 bg-yellow-50 w-48">Faktor Penyebab<br/>Ketidak Sesuaian</th>
                                            <th rowSpan="2" className="border px-2 py-1 border-gray-400 bg-blue-50 w-48">Tindak Lanjut<br/>Penyempurnaan Apabila Tidak</th>
                                        </tr>
                                        <tr>
                                            <th className="border px-2 py-1 border-gray-400 bg-gray-50 text-xs italic">(1)</th>
                                            <th className="border px-2 py-1 border-gray-400 bg-gray-50 text-xs italic">(2)</th>
                                            
                                            <th className="border px-2 py-1 border-gray-400 bg-green-50 w-16">Ada</th>
                                            <th className="border px-2 py-1 border-gray-400 bg-green-50 w-24">Tidak Ada</th>
                                            
                                            <th className="border px-2 py-1 border-gray-400 bg-gray-50 text-xs italic print:hidden"></th>
                                        </tr>
                                        <tr>
                                            <th colSpan="2" className="border px-2 py-1 border-gray-400 bg-gray-50 text-xs italic"></th>
                                            
                                            <th className="border px-2 py-1 border-gray-400 bg-gray-50 text-xs italic">(3)</th>
                                            <th className="border px-2 py-1 border-gray-400 bg-gray-50 text-xs italic">(4)</th>
                                            
                                            <th className="border px-2 py-1 border-gray-400 bg-gray-50 text-xs italic">(5)</th>
                                            <th className="border px-2 py-1 border-gray-400 bg-gray-50 text-xs italic">(6)</th>
                                            
                                            <th className="border px-2 py-1 border-gray-400 bg-gray-50 text-xs italic print:hidden"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formulir_data.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-4 text-gray-500 border border-gray-400">
                                                    Belum ada data kegiatan.
                                                </td>
                                            </tr>
                                        ) : (
                                            formulir_data.map((row) => (
                                                <tr key={row.id} className="hover:bg-gray-50">
                                                    <td className="border px-2 py-2 text-center border-gray-400">{row.nomor}</td>
                                                    <td className="border px-4 py-2 border-gray-400 whitespace-pre-wrap break-words">{row.jenis_kegiatan}</td>
                                                    
                                                    <td className="border px-2 py-2 text-center font-bold text-green-600 border-gray-400">
                                                        {row.kesesuaian === 'Ada' ? '✓' : ''}
                                                    </td>
                                                    <td className="border px-2 py-2 text-center font-bold text-red-600 border-gray-400">
                                                        {row.kesesuaian === 'Tidak Ada' ? '✓' : ''}
                                                    </td>
                                                    
                                                    <td className="border px-4 py-2 border-gray-400 whitespace-pre-wrap break-words">{row.faktor_penyebab}</td>
                                                    <td className="border px-4 py-2 border-gray-400 whitespace-pre-wrap break-words">{row.tindak_lanjut}</td>
                                                    
                                                    <td className="border px-2 py-2 text-center border-gray-400 print:hidden space-x-1">
                                                        <button 
                                                            onClick={() => editManualInput(row)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => confirmDelete(row.id)}
                                                            className="text-red-600 hover:text-red-800"
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
                </div>
            </div>

            {/* Manual Input Modal */}
            <Modal show={isManualModalOpen} onClose={() => setIsManualModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {isEditing ? 'Edit Kegiatan E.70' : 'Input Kegiatan E.70'}
                    </h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="nomor" value="Nomor Urut (Opsional)" />
                                <TextInput
                                    id="nomor"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={formData.nomor}
                                    onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="jenis_kegiatan" value="Jenis Kegiatan" />
                            <textarea
                                id="jenis_kegiatan"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="3"
                                value={formData.jenis_kegiatan}
                                onChange={(e) => setFormData({ ...formData, jenis_kegiatan: e.target.value })}
                            />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                            <h3 className="font-semibold text-blue-800 mb-3 text-sm">Hasil Pengendalian dan Evaluasi</h3>
                            
                            <div className="mb-3">
                                <InputLabel value="Kesesuaian" />
                                <div className="mt-2 flex space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                            value="Ada"
                                            checked={formData.kesesuaian === 'Ada'}
                                            onChange={(e) => setFormData({ ...formData, kesesuaian: e.target.value })}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Ada</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                            value="Tidak Ada"
                                            checked={formData.kesesuaian === 'Tidak Ada'}
                                            onChange={(e) => setFormData({ ...formData, kesesuaian: e.target.value })}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Tidak Ada</span>
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

                            <div className="mb-3">
                                <InputLabel htmlFor="faktor_penyebab" value="Faktor Penyebab Ketidak Sesuaian" />
                                <textarea
                                    id="faktor_penyebab"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows="2"
                                    value={formData.faktor_penyebab}
                                    onChange={(e) => setFormData({ ...formData, faktor_penyebab: e.target.value })}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="tindak_lanjut" value="Tindak Lanjut Penyempurnaan Apabila Tidak" />
                                <textarea
                                    id="tindak_lanjut"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows="2"
                                    value={formData.tindak_lanjut}
                                    onChange={(e) => setFormData({ ...formData, tindak_lanjut: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
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
                        Apakah Anda yakin ingin menghapus kegiatan ini? Data yang telah dihapus tidak dapat dikembalikan.
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
