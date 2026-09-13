const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf-8');

code = code.replace(
  'className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 overflow-x-auto"',
  'className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 overflow-x-auto hide-scrollbar"'
);

// Cover Header adjustments
code = code.replace(
  'className="absolute bottom-8 left-6 lg:left-12 right-6 lg:right-12 flex flex-col md:flex-row md:items-end justify-between gap-6"',
  'className="absolute bottom-6 sm:bottom-8 left-4 sm:left-6 lg:left-12 right-4 sm:right-6 lg:right-12 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6"'
);
code = code.replace(
  'className="font-serif text-3xl md:text-5xl font-medium text-white mb-1"',
  'className="font-serif text-2xl sm:text-3xl md:text-5xl font-medium text-white mb-1"'
);

// Tab Content Paddings
code = code.replace(
  'className="max-w-7xl mx-auto px-6 lg:px-12 mt-8"',
  'className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-6 sm:mt-8"'
);
code = code.replace(
  /className="bg-white\/5 border border-white\/10 rounded-3xl p-8"/g,
  'className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8"'
);
code = code.replace(
  /className="bg-white\/5 border border-white\/10 rounded-3xl p-6"/g,
  'className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6"'
);

fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
console.log("Updated ClientDashboard for mobile");
