import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function UserManagement({ users, opds }) {
    const [editingUserId, setEditingUserId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        no_telp: '',
        role: 'admin',
        opd_id: '',
    });

    const { data: opdData, setData: setOpdData, post: postOpd, processing: opdProcessing, errors: opdErrors, reset: resetOpd } = useForm({
        nama: '',
        singkatan: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingUserId) {
            router.put(route('users.update', editingUserId), data, {
                onSuccess: () => {
                    setEditingUserId(null);
                    reset();
                }
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => reset('name', 'email', 'password', 'no_telp', 'opd_id'),
            });
        }
    };

    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            no_telp: user.no_telp || '',
            role: user.role,
            opd_id: user.opd_id || '',
        });
        window.scrollTo(0, 0);
    };

    const cancelEdit = () => {
        setEditingUserId(null);
        reset();
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(route('users.destroy', id));
        }
    };

    const submitOpd = (e) => {
        e.preventDefault();
        postOpd(route('opds.store'), {
            onSuccess: () => resetOpd('nama', 'singkatan'),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-bold leading-tight text-gray-800">Manajemen Pengguna OPD</h2>}
        >
            <Head title="Manajemen Pengguna" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Form Tambah/Edit User */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="text-lg font-bold mb-4">{editingUserId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
                        <form onSubmit={submit} className="space-y-4 max-w-xl">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="no_telp" value="Nomor Telepon/WhatsApp" />
                                <TextInput
                                    id="no_telp"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.no_telp}
                                    onChange={(e) => setData('no_telp', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                />
                                <InputError message={errors.no_telp} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value={editingUserId ? "Password (Kosongkan jika tidak ingin mengubah)" : "Password"} />
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="mt-1 block w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required={!editingUserId}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="role" value="Role Akses" />
                                <select
                                    id="role"
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                >
                                    <option value="admin">Admin OPD (Pengelola OPD)</option>
                                    <option value="super_admin">Super Admin (Akses Penuh)</option>
                                    <option value="evaluator">Evaluator (Penilai)</option>
                                </select>
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            {data.role === 'admin' && (
                                <div>
                                    <InputLabel htmlFor="opd_id" value="Pilih Organisasi Perangkat Daerah (OPD)" />
                                    <select
                                        id="opd_id"
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full"
                                        value={data.opd_id}
                                        onChange={(e) => setData('opd_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Pilih OPD --</option>
                                        {opds.map(opd => (
                                            <option key={opd.id} value={opd.id}>{opd.nama}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.opd_id} className="mt-2" />
                                </div>
                            )}

                            <div className="flex items-center gap-4 mt-6">
                                <PrimaryButton disabled={processing}>
                                    {editingUserId ? 'Simpan Perubahan' : 'Simpan Pengguna'}
                                </PrimaryButton>
                                {editingUserId && (
                                    <button 
                                        type="button" 
                                        onClick={cancelEdit}
                                        className="text-gray-600 hover:text-gray-900 underline text-sm"
                                    >
                                        Batal Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Form Tambah OPD */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="text-lg font-bold mb-4">Entry OPD Baru (Manual)</h3>
                        <form onSubmit={submitOpd} className="space-y-4 max-w-xl">
                            <div>
                                <InputLabel htmlFor="nama_opd" value="Nama OPD" />
                                <TextInput
                                    id="nama_opd"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={opdData.nama}
                                    onChange={(e) => setOpdData('nama', e.target.value)}
                                    required
                                />
                                <InputError message={opdErrors.nama} className="mt-2" />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="singkatan_opd" value="Singkatan OPD (Opsional)" />
                                <TextInput
                                    id="singkatan_opd"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={opdData.singkatan}
                                    onChange={(e) => setOpdData('singkatan', e.target.value)}
                                    placeholder="Contoh: Setda, Disdik"
                                />
                                <InputError message={opdErrors.singkatan} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-4 mt-6">
                                <PrimaryButton disabled={opdProcessing}>Simpan OPD</PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Tabel Daftar Pengguna */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="text-lg font-bold mb-4">Daftar Pengguna Sistem</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="p-3 border-b">Nama</th>
                                        <th className="p-3 border-b">Email</th>
                                        <th className="p-3 border-b">No. WhatsApp</th>
                                        <th className="p-3 border-b">Role</th>
                                        <th className="p-3 border-b">OPD Terkait</th>
                                        <th className="p-3 border-b text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium">{user.name}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">{user.no_telp || '-'}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-600">
                                                {user.opd ? user.opd.nama : '-'}
                                            </td>
                                            <td className="p-3 text-right space-x-2">
                                                <button onClick={() => handleEdit(user)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium" title="Ubah Pengguna">
                                                    ✏️ Ubah
                                                </button>
                                                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800 text-sm font-medium" title="Hapus Pengguna">
                                                    🗑️ Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
