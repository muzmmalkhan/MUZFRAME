const fs = require('fs');
let contactCode = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
let dashboardCode = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

contactCode = contactCode.replace(/border-white\/10'\} rounded-lg text-sm text-white focus:outline-none focus:border-\[#f2a900\]/g, "border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]");

dashboardCode = dashboardCode.replace(/border-white\/10'\} rounded-lg text-sm text-white focus:outline-none focus:border-\[#f2a900\]/g, "border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]");

fs.writeFileSync('src/pages/Contact.tsx', contactCode);
fs.writeFileSync('src/pages/ClientDashboard.tsx', dashboardCode);
