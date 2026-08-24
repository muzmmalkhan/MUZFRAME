const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace register logic
code = code.replace(
  /app\.post\("\/api\/auth\/register", async \(req, res\) => \{[\s\S]*?db\.users\.push\(newUser\);/m,
  `app.post("/api/auth/register", async (req, res) => {
    const { phone, password, name, location } = req.body;

    if (!phone || !password || password.length < 6) {
      return res.status(400).json({ error: "Phone number and a strong password (min 6 chars) are required" });
    }

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: "A valid full name is required" });
    }

    const existing = db.users.find(u => u.phone === phone || u.email === phone);
    if (existing) {
      return res.status(400).json({ error: "User already exists with this phone number" });
    }
    
    const newUserId = \`CLI-\${Math.floor(100 + Math.random() * 900)}\`;
    const newUser = {
      id: newUserId,
      email: \`\${phone.replace(/\\s/g, '')}@client.muzframe\`, // Fallback for email dependencies
      phone: phone,
      password, // In a real app, hash this!
      name: name,
      role: 'client'
    };
    
    db.users.push(newUser);`
);

// Update newClient to use phone
code = code.replace(
  /email: newUser\.email,\s*phone: 'Not provided',/m,
  `email: newUser.email,
      phone: newUser.phone,`
);

// Update login logic
code = code.replace(
  /app\.post\("\/api\/auth\/login", \(req, res\) => \{[\s\S]*?const user = db\.users\.find\(u => u\.email\.toLowerCase\(\) === email\.toLowerCase\(\) && u\.password === password\);/m,
  `app.post("/api/auth/login", (req, res) => {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.status(400).json({ error: "Phone number and password are required" });
    }

    // Hardcoded admin login
    if (phone === 'muz@frame' || phone === 'admin') {
      if (password === 'muz@frame') {
        return res.json({ user: { id: 'admin', email: 'muz@frame', phone: 'admin', name: 'Admin', role: 'admin' } });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    }

    const user = db.users.find(u => (u.phone === phone || u.email === phone) && u.password === password);`
);

fs.writeFileSync('server.ts', code);
