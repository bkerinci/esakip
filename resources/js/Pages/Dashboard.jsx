import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Dashboard({ statistik, totalFeedback }) {
    const { auth } = usePage().props;
    const isSuperAdmin = auth.user.role === 'super_admin';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-800">
                    Dashboard {isSuperAdmin ? 'Super Admin' : 'Admin OPD'}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* Welcome Banner */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-blue-500 mb-6">
                        <div className="p-6 text-slate-900 flex items-center">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Selamat Datang, {auth.user.name}!</h3>
                                <p className="text-sm text-gray-500">
                                    Anda login sebagai <span className="font-bold uppercase text-blue-600">{auth.user.role.replace('_', ' ')}</span>
                                    {auth.user.opd?.nama && <span className="font-bold text-slate-700"> - {auth.user.opd.nama}</span>}.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase">Total OPD</p>
                                <p className="text-3xl font-bold text-slate-800">{statistik?.total_opd || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase">Indikator Kinerja</p>
                                <p className="text-3xl font-bold text-slate-800">{statistik?.total_indikator || 0}</p>
                            </div>
                            <div className="p-3 bg-green-50 text-green-500 rounded-lg">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase">Feedback Publik</p>
                                <p className="text-3xl font-bold text-slate-800">{totalFeedback || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <Link href={route('renstra.index')} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-lg transition">
                                    <span className="text-2xl mb-2">📄</span>
                                    <span className="text-sm font-semibold text-slate-700 text-center">Kelola Dokumen</span>
                                </Link>
                                <Link href={route('iku.index')} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-lg transition">
                                    <span className="text-2xl mb-2">🎯</span>
                                    <span className="text-sm font-semibold text-slate-700 text-center">Update Realisasi IKU</span>
                                </Link>
                                <Link href={route('pohon-kinerja.index')} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-lg transition">
                                    <span className="text-2xl mb-2">🌳</span>
                                    <span className="text-sm font-semibold text-slate-700 text-center">Pohon Kinerja</span>
                                </Link>
                                {isSuperAdmin && (
                                    <>
                                        <Link href={route('users.index')} className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition">
                                            <span className="text-2xl mb-2">👥</span>
                                            <span className="text-sm font-semibold text-purple-700 text-center">Manajemen Pengguna</span>
                                        </Link>
                                        <Link href={route('audit.log')} className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition">
                                            <span className="text-2xl mb-2">🛡️</span>
                                            <span className="text-sm font-semibold text-red-700 text-center">Audit Log Aktivitas</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
