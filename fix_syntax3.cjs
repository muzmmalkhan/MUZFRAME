const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

code = code.replace(/{\/\* Submit Selections Button \*\/}}/g, '{/* Submit Selections Button */}');
code = code.replace(/\)\}\n\n        \)\}/g, ')}');

fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
