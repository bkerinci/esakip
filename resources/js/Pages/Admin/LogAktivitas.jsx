import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function LogAktivitas({ logs }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-bold leading-tight text-gray-800">Audit Log Aktivitas</h2>}
        >
            <Head title="Audit Log" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                                <p className="text-sm text-red-700 font-bold">
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    RESTRICTED AREA: Halaman ini hanya dapat diakses oleh Super Admin.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse border border-gray-200">
                                    <thead className="bg-gray-100 border-b-2 border-gray-300 text-gray-700">
                                        <tr>
                                            <th className="p-3 border border-gray-200 w-12 text-center">No</th>
                                            <th className="p-3 border border-gray-200">Waktu</th>
                                            <th className="p-3 border border-gray-200">Pengguna</th>
                                            <th className="p-3 border border-gray-200">Aktivitas</th>
                                            <th className="p-3 border border-gray-200">Deskripsi</th>
                                            <th className="p-3 border border-gray-200">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.data && logs.data.length > 0 ? (
                                            logs.data.map((log, index) => (
                                                <tr key={log.id} className="hover:bg-gray-50 border-b border-gray-200">
                                                    <td className="p-3 border border-gray-200 text-center">{logs.from + index}</td>
                                                    <td className="p-3 border border-gray-200 whitespace-nowrap">
                                                        {new Date(log.created_at).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="p-3 border border-gray-200 font-medium">
                                                        {log.user ? log.user.name : 'System/Unknown'}
                                                    </td>
                                                    <td className="p-3 border border-gray-200 text-center">
                                                        <span className={`px-2 py-1 text-xs font-bold rounded ${
                                                            log.aktivitas === 'CREATE' ? 'bg-green-100 text-green-800' :
                                                            log.aktivitas === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {log.aktivitas}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 border border-gray-200">{log.deskripsi}</td>
                                                    <td className="p-3 border border-gray-200 font-mono text-xs text-gray-500">{log.ip_address}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="p-6 text-center text-gray-500">Belum ada riwayat aktivitas yang dicatat.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
