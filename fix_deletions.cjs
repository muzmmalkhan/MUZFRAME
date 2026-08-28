const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `  app.delete("/api/clients/:id", async (req, res) => {
    db.clients = db.clients.filter(c => c.id !== req.params.id);
    saveDb();
    deleteFromSupabase('clients', req.params.id);
    res.json({ success: true });
  });`;

const replacement = `  app.delete("/api/clients/:id", async (req, res) => {
    const client = db.clients.find(c => c.id === req.params.id);
    if (!client) return res.status(404).json({ error: "Not found" });
    
    db.clients = db.clients.filter(c => c.id !== req.params.id);
    db.events = db.events.filter(e => e.clientName !== client.name);
    db.payments = db.payments.filter(p => p.clientName !== client.name);
    db.playlists = db.playlists.filter(p => p.clientId !== client.id);
    
    saveDb();
    deleteFromSupabase('clients', req.params.id);
    res.json({ success: true });
  });`;

code = code.replace(targetStr, replacement);

const targetStr2 = `  app.put("/api/clients/:id", async (req, res) => {
    db.clients = db.clients.map(c => c.id === req.params.id ? { ...c, ...req.body } : c);
    saveDb();
    const updated = db.clients.find(c => c.id === req.params.id);
    if (updated) pushToSupabase('clients', updated);
    res.json({ success: true });
  });`;

const replacement2 = `  app.put("/api/clients/:id", async (req, res) => {
    const oldClient = db.clients.find(c => c.id === req.params.id);
    if (!oldClient) return res.status(404).json({ error: "Not found" });
    
    const newName = req.body.name;
    const nameChanged = newName && oldClient.name !== newName;
    
    db.clients = db.clients.map(c => c.id === req.params.id ? { ...c, ...req.body } : c);
    
    if (nameChanged) {
      db.events = db.events.map(e => e.clientName === oldClient.name ? { ...e, clientName: newName } : e);
      db.payments = db.payments.map(p => p.clientName === oldClient.name ? { ...p, clientName: newName } : p);
    }
    
    saveDb();
    const updated = db.clients.find(c => c.id === req.params.id);
    if (updated) pushToSupabase('clients', updated);
    res.json({ success: true });
  });`;

code = code.replace(targetStr2, replacement2);

// Add missing delete endpoints
const endpointsInsertStr = `  app.get("/api/events", (req, res) => res.json(db.events));`;
const missingEndpoints = `  app.delete("/api/events/:id", async (req, res) => {
    db.events = db.events.filter(e => e.id !== req.params.id);
    saveDb();
    deleteFromSupabase('events', req.params.id);
    res.json({ success: true });
  });
  app.delete("/api/payments/:id", async (req, res) => {
    db.payments = db.payments.filter(p => p.id !== req.params.id);
    saveDb();
    deleteFromSupabase('payments', req.params.id);
    res.json({ success: true });
  });
`;

code = code.replace(endpointsInsertStr, missingEndpoints + endpointsInsertStr);

fs.writeFileSync('server.ts', code);
console.log("Success");
