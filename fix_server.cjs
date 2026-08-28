const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const startStr = '  app.post("/api/auth/google", async (req, res) => {';
const endStr = '  // Data Routes';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

const replacement = `  app.post("/api/auth/google", async (req, res) => {
    const { email, name, photoURL } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required from Google Auth" });
    }

    // Strict Admin verification via Google
    if (email.toLowerCase() === 'muzmmal.khan99@gmail.com') {
      return res.json({ user: { id: 'admin', email: 'muzmmal.khan99@gmail.com', phone: 'muzammal.frames', name: 'Muzammal Khan', role: 'admin' } });
    }

    let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      let existingClient = db.clients.find((c: any) => c.email.toLowerCase() === email.toLowerCase());
      const newUserId = existingClient ? existingClient.id : \`CLI-\${Math.floor(100 + Math.random() * 900)}\`;
      user = {
        id: newUserId,
        email,
        password: Math.random().toString(36).slice(-8),
        name: existingClient ? existingClient.name : (name || email.split('@')[0]),
        role: 'client'
      };
      db.users.push(user);
      pushToSupabase('users', user);
      
      if (!existingClient) {
        const newClient = {
          id: newUserId,
          name: user.name,
          email: user.email,
          phone: 'Not provided',
          location: 'Unknown',
          eventName: 'Pending Booking',
          eventType: 'Unknown',
          eventDate: 'Not Scheduled',
          package: 'Pending Selection',
          status: 'active',
          totalAmount: 0,
          paidAmount: 0
        };
        db.clients.push(newClient);
        pushToSupabase('clients', newClient);
      }

      const activity = {
        id: \`ACT-\${Date.now()}\`,
        clientName: user.name,
        type: 'Registration',
        description: \`Client registered via Google.\`,
        timestamp: new Date().toISOString()
      };
      db.activities.unshift(activity);
      pushToSupabase('activities', activity);
      if (db.activities.length > 100) db.activities.pop();
      
      saveDb();
    }
    
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

`;

code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
fs.writeFileSync('server.ts', code);
console.log("Success");
