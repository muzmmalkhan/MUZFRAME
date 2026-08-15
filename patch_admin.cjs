const fs = require('fs');

let adminCode = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
adminCode = adminCode.replace(
  /<h1 className="font-serif text-3xl md:text-4xl font-medium text-white">MuzFrame Studio Console<\/h1>/g,
  `<div className="flex items-center gap-4"><img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" /><h1 className="font-serif text-3xl md:text-4xl font-medium text-white">Console</h1></div>`
);
fs.writeFileSync('src/pages/AdminDashboard.tsx', adminCode);
console.log("Admin dashboard updated");
