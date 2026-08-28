const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

const targetStr = `  const handleDeleteClient = async (id: string) => {
    await fetch(\`/api/clients/\${id}\`, { method: 'DELETE' });
    setClients(clients.filter(c => c.id !== id));
    triggerToast('Client account & associated timelines removed.');
  };`;

const replacement = `  const handleDeleteClient = async (id: string) => {
    await fetch(\`/api/clients/\${id}\`, { method: 'DELETE' });
    
    const [freshClients, freshEvents, freshPayments] = await Promise.all([
      fetch('/api/clients').then(res => res.json()),
      fetch('/api/events').then(res => res.json()),
      fetch('/api/payments').then(res => res.json())
    ]);
    setClients(freshClients);
    setEvents(freshEvents);
    setPayments(freshPayments);
    
    triggerToast('Client account & associated timelines removed.');
  };`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("Success");
