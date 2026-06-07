import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 print:bg-white">
            <nav className="border-b border-blue-700 bg-blue-800 print:hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center">
                                    <img src="/images/logo_sakip_sungai_penuh.png" alt="SAKIP Kota Sungai Penuh" className="h-16 w-auto object-contain py-1" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex sm:flex-wrap">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <div className="hidden sm:flex sm:items-center">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md h-full items-center cursor-pointer">
                                                <div className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none h-full mt-4 pb-4 ${route().current('pohon-kinerja.*') || route().current('iku.*') || route().current('perjanjian-kinerja.*') ? 'border-white text-white focus:border-gray-200' : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300 focus:text-white focus:border-blue-300'}`}>
                                                    Kinerja
                                                    <svg className="ml-1 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('pohon-kinerja.index')}>Pohon Kinerja</Dropdown.Link>
                                            <Dropdown.Link href={route('iku.index')}>IKU</Dropdown.Link>
                                            <Dropdown.Link href={route('perjanjian-kinerja.index')}>Perjanjian Kinerja</Dropdown.Link>
                                            <Dropdown.Link href={route('rencana_aksi.index')}>Rencana Aksi</Dropdown.Link>
                                            <Dropdown.Link href={route('dpa.index')}>DPA</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                                <NavLink href={route('lkjip.index')} active={route().current('lkjip.*')}>
                                    LKjIP
                                </NavLink>
                                <NavLink href={route('renstra.index')} active={route().current('renstra.*')}>
                                    Renstra
                                </NavLink>
                                <div className="hidden sm:flex sm:items-center">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md h-full items-center cursor-pointer">
                                                <div className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none h-full mt-4 pb-4 ${route().current('renja.*') ? 'border-white text-white focus:border-gray-200' : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300 focus:text-white focus:border-blue-300'}`}>
                                                    Renja
                                                    <svg className="ml-1 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('renja.generic.index', 'dokumen')}>Dokumen Renja</Dropdown.Link>
                                            <Dropdown.Link href={route('renja.form_e81.index')}>Formulir E.81</Dropdown.Link>
                                            <Dropdown.Link href={route('renja.form_e70.index')}>Formulir E.70</Dropdown.Link>
                                            <Dropdown.Link href={route('renja.pelaksanaan_renstra.index')}>Pelaksanaan Renstra</Dropdown.Link>
                                            <Dropdown.Link href={route('renja.form_e75.index')}>Formulir E.75</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                                <div className="hidden sm:flex sm:items-center">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md h-full items-center cursor-pointer">
                                                <div className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none h-full mt-4 pb-4 ${route().current('calk.*') || route().current('realisasi.*') ? 'border-white text-white focus:border-gray-200' : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300 focus:text-white focus:border-blue-300'}`}>
                                                    Laporan
                                                    <svg className="ml-1 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('calk.index')}>CALK</Dropdown.Link>
                                            <Dropdown.Link href={route('realisasi.index')}>Real. Fisik & Uang</Dropdown.Link>
                                            {user.role === 'super_admin' && (
                                                <Dropdown.Link href={route('peraturan.index')}>Peraturan</Dropdown.Link>
                                            )}
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                                {(user.role === 'evaluator' || user.role === 'super_admin') && (
                                    <NavLink href={route('sipandai.index')} active={route().current('sipandai.*')}>
                                        SIPANDAI SAKIP
                                    </NavLink>
                                )}
                                {user.role === 'super_admin' && (
                                    <>
                                        <NavLink href={route('users.index')} active={route().current('users.*')}>
                                            Manajemen Pengguna
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-blue-800 px-3 py-2 text-sm font-medium leading-4 text-blue-200 transition duration-150 ease-in-out hover:text-white focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-blue-200 transition duration-150 ease-in-out hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        <div className="pt-2 pb-1 border-t border-blue-700">
                            <div className="px-4 text-xs font-semibold text-blue-200 uppercase tracking-wider">Kinerja</div>
                            <div className="mt-2 space-y-1 pl-4">
                                <ResponsiveNavLink href={route('pohon-kinerja.index')} active={route().current('pohon-kinerja.*')}>
                                    Pohon Kinerja
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('iku.index')} active={route().current('iku.*')}>
                                    IKU
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('perjanjian-kinerja.index')} active={route().current('perjanjian-kinerja.*')}>
                                    Perjanjian Kinerja
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('rencana_aksi.index')} active={route().current('rencana_aksi.*')}>
                                    Rencana Aksi
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('dpa.index')} active={route().current('dpa.*')}>
                                    DPA
                                </ResponsiveNavLink>
                            </div>
                        </div>
                        <ResponsiveNavLink href={route('lkjip.index')} active={route().current('lkjip.*')}>
                            LKjIP
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('renstra.index')} active={route().current('renstra.*')}>
                            Renstra
                        </ResponsiveNavLink>
                        <div className="pt-2 pb-1 border-t border-blue-700">
                            <div className="px-4 text-xs font-semibold text-blue-200 uppercase tracking-wider">Renja</div>
                            <div className="mt-2 space-y-1 pl-4">
                                <ResponsiveNavLink href={route('renja.generic.index', 'dokumen')} active={route().current('renja.generic.index', 'dokumen')}>
                                    Dokumen Renja
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('renja.form_e81.index')} active={route().current('renja.form_e81.index')}>
                                    Formulir E.81
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('renja.form_e70.index')} active={route().current('renja.form_e70.index')}>
                                    Formulir E.70
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('renja.pelaksanaan_renstra.index')} active={route().current('renja.pelaksanaan_renstra.index')}>
                                    Pelaksanaan Renstra
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('renja.form_e75.index')} active={route().current('renja.form_e75.*')}>
                                    Formulir E.75
                                </ResponsiveNavLink>
                            </div>
                        </div>
                        <div className="pt-2 pb-1 border-t border-blue-700">
                            <div className="px-4 text-xs font-semibold text-blue-200 uppercase tracking-wider">Laporan</div>
                            <div className="mt-2 space-y-1 pl-4">
                                <ResponsiveNavLink href={route('calk.index')} active={route().current('calk.*')}>
                                    CALK
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('realisasi.index')} active={route().current('realisasi.*')}>
                                    Real. Fisik & Uang
                                </ResponsiveNavLink>
                                {user.role === 'super_admin' && (
                                    <ResponsiveNavLink href={route('peraturan.index')} active={route().current('peraturan.*')}>
                                        Peraturan
                                    </ResponsiveNavLink>
                                )}
                            </div>
                        </div>
                        {(user.role === 'evaluator' || user.role === 'super_admin') && (
                            <ResponsiveNavLink href={route('sipandai.index')} active={route().current('sipandai.*')}>
                                SIPANDAI SAKIP
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'super_admin' && (
                            <>
                                <ResponsiveNavLink href={route('users.index')} active={route().current('users.*')}>
                                    Manajemen Pengguna
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-white">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-blue-200">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow print:hidden">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
