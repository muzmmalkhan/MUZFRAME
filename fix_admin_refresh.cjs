const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

const targetStr = `    await fetch(\`/api/clients/\${updated.id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    setClients(clients.map(c => c.id === updated.id ? updated : c));
    setShowEditClient(false);
    triggerToast('Client account updated successfully.');`;

const replacement = `    await fetch(\`/api/clients/\${updated.id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    
    const [freshClients, freshEvents, freshPayments] = await Promise.all([
      fetch('/api/clients').then(res => res.json()),
      fetch('/api/events').then(res => res.json()),
      fetch('/api/payments').then(res => res.json())
    ]);
    setClients(freshClients);
    setEvents(freshEvents);
    setPayments(freshPayments);
    
    setShowEditClient(false);
    triggerToast('Client account updated successfully.');`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("Success");
