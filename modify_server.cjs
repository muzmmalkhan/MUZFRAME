const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Add quotes to initialDB
if (!code.includes('quotes: []')) {
  code = code.replace(
    'activities: []',
    'activities: [],\n    quotes: []'
  );
}

// Add API routes for quotes
const quoteRoutes = `
  // Quotes API
  app.get("/api/quotes", (req, res) => res.json(db.quotes || []));
  app.post("/api/quotes", async (req, res) => {
    const quote = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...req.body };
    db.quotes = db.quotes || [];
    db.quotes.push(quote);
    
    // Also add an activity for this
    db.activities.push({
      id: Date.now().toString() + "-act",
      timestamp: new Date().toISOString(),
      clientName: quote.clientName,
      description: "Requested a custom quote (Estimated: Rs. " + quote.estimatedPrice.toLocaleString() + ")"
    });
    
    await writeDb(db);
    res.json(quote);
  });
`;

if (!code.includes('/api/quotes')) {
  code = code.replace(
    'app.get("/api/activities"',
    quoteRoutes + '\n  app.get("/api/activities"'
  );
  fs.writeFileSync('server.ts', code);
  console.log('Quotes API added to server.ts');
} else {
  console.log('Quotes API already exists');
}
