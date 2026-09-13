const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

code = code.replace(
  'className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 overflow-x-auto"',
  'className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 overflow-x-auto hide-scrollbar"'
);

code = code.replace(
  'className="flex justify-between items-end mb-8"',
  'className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("Updated AdminDashboard for mobile");
