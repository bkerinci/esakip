import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-white bg-blue-700 text-white focus:border-gray-200 focus:bg-blue-600 focus:text-white'
                    : 'border-transparent text-blue-200 hover:border-blue-300 hover:bg-blue-700 hover:text-white focus:border-blue-300 focus:bg-blue-700 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
