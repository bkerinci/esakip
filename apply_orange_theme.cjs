const fs = require('fs');

// 1. Update NavLink.jsx
let navLink = fs.readFileSync('resources/js/Components/NavLink.jsx', 'utf8');
navLink = navLink.replace(
    /border-orange-400 text-gray-900 focus:border-orange-700/g,
    'border-white text-white focus:border-gray-200'
);
navLink = navLink.replace(
    /border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700/g,
    'border-transparent text-orange-200 hover:border-orange-300 hover:text-white focus:border-orange-300 focus:text-white'
);
fs.writeFileSync('resources/js/Components/NavLink.jsx', navLink);

// 2. Update ResponsiveNavLink.jsx
let respNavLink = fs.readFileSync('resources/js/Components/ResponsiveNavLink.jsx', 'utf8');
respNavLink = respNavLink.replace(
    /border-orange-400 bg-orange-50 text-orange-700 focus:border-orange-700 focus:bg-orange-100 focus:text-orange-800/g,
    'border-white bg-orange-700 text-white focus:border-gray-200 focus:bg-orange-600 focus:text-white'
);
respNavLink = respNavLink.replace(
    /border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800/g,
    'border-transparent text-orange-200 hover:border-orange-300 hover:bg-orange-700 hover:text-white focus:border-orange-300 focus:bg-orange-700 focus:text-white'
);
fs.writeFileSync('resources/js/Components/ResponsiveNavLink.jsx', respNavLink);

// 3. Update AuthenticatedLayout.jsx
let authLayout = fs.readFileSync('resources/js/Layouts/AuthenticatedLayout.jsx', 'utf8');

// Navbar background
authLayout = authLayout.replace('nav className="border-b border-gray-100 bg-white print:hidden"', 'nav className="border-b border-orange-700 bg-orange-800 print:hidden"');

// Title text
authLayout = authLayout.replace('className="font-bold text-xl text-gray-800 tracking-wider uppercase"', 'className="font-bold text-xl text-white tracking-wider uppercase"');

// Renja dropdown
authLayout = authLayout.replace(/border-orange-400 text-gray-900 focus:border-orange-700/g, 'border-white text-white focus:border-gray-200');
authLayout = authLayout.replace(/border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300/g, 'border-transparent text-orange-200 hover:text-white hover:border-orange-300 focus:text-white focus:border-orange-300');

// Profile dropdown button
authLayout = authLayout.replace('className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"', 'className="inline-flex items-center rounded-md border border-transparent bg-orange-800 px-3 py-2 text-sm font-medium leading-4 text-orange-200 transition duration-150 ease-in-out hover:text-white focus:outline-none"');

// Hamburger button
authLayout = authLayout.replace('className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"', 'className="inline-flex items-center justify-center rounded-md p-2 text-orange-200 transition duration-150 ease-in-out hover:bg-orange-700 hover:text-white focus:bg-orange-700 focus:text-white focus:outline-none"');

// Mobile nav text color for user
authLayout = authLayout.replace('className="text-base font-medium text-gray-800"', 'className="text-base font-medium text-white"');
authLayout = authLayout.replace('className="text-sm font-medium text-gray-500"', 'className="text-sm font-medium text-orange-200"');
authLayout = authLayout.replace('className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"', 'className="px-4 text-xs font-semibold text-orange-200 uppercase tracking-wider"');

// Border colors in mobile menu
authLayout = authLayout.replace('className="pt-4 pb-1 border-t border-gray-200"', 'className="pt-4 pb-1 border-t border-orange-700"');
authLayout = authLayout.replace('className="pt-2 pb-1 border-t border-gray-200"', 'className="pt-2 pb-1 border-t border-orange-700"');

fs.writeFileSync('resources/js/Layouts/AuthenticatedLayout.jsx', authLayout);

console.log('Update Complete.');
