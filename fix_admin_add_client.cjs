const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

const targetStr = `    await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    });`;

const replacement = `    const clientRes = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    });
    
    if (!clientRes.ok) {
        const errorData = await clientRes.json();
        alert(errorData.error || "Failed to add client");
        return;
    }`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("Success");
