const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const replacement = `    let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
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
    }`;

// Replace the block manually
const startStr = "    let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());";
const startIdx = code.indexOf(startStr);
if (startIdx !== -1) {
    const endStr = "    }";
    // find the end of the if(!user) block
    const endIdx = code.indexOf(endStr, startIdx + startStr.length + 50) + endStr.length;
    const newCode = code.substring(0, startIdx) + replacement + code.substring(endIdx);
    fs.writeFileSync('server.ts', newCode);
    console.log("Success");
}
