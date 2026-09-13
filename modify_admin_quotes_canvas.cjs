const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

code = code.replace(
  '<span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Canvas: <strong className="text-white">{q.canvas}</strong></span>',
  '{q.canvas && q.canvas !== "None" && <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Canvas: <strong className="text-white">{q.canvas}</strong></span>}'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("Updated AdminDashboard quotes to conditionally show canvas");
