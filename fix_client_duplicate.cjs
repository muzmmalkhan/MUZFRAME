const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `  app.post("/api/clients", async (req, res) => {
    db.clients.push(req.body);
    saveDb();
    pushToSupabase('clients', req.body);
    res.json(req.body);
  });`;

const replacement = `  app.post("/api/clients", async (req, res) => {
    const existing = db.clients.find(c => c.email.toLowerCase() === req.body.email.toLowerCase());
    if (existing) {
        return res.status(400).json({ error: "A client with this email already exists." });
    }
    db.clients.push(req.body);
    saveDb();
    pushToSupabase('clients', req.body);
    res.json(req.body);
  });`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('server.ts', code);
console.log("Success");
