const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

// 1. Add quotes state
if (!code.includes('const [quotes, setQuotes]')) {
  code = code.replace(
    'const [activities, setActivities] = useState<any[]>([]);',
    'const [activities, setActivities] = useState<any[]>([]);\n  const [quotes, setQuotes] = useState<any[]>([]);'
  );
}

// 2. Fetch quotes
if (!code.includes('fetch(\'/api/quotes\')')) {
  code = code.replace(
    "const actsRes = await fetch('/api/activities');",
    "const actsRes = await fetch('/api/activities');\n        const quotesRes = await fetch('/api/quotes');"
  );
  code = code.replace(
    "setActivities(actsData.reverse());",
    "setActivities(actsData.reverse());\n          setQuotes((await quotesRes.json()).reverse());"
  );
}

// 3. Add Quotes Tab state
if (!code.includes("'quotes'")) {
  code = code.replace(
    "useState<'analytics' | 'clients' | 'events' | 'payments' | 'songs' | 'gallery' | 'notifications' | 'activities'>",
    "useState<'analytics' | 'clients' | 'events' | 'payments' | 'songs' | 'gallery' | 'notifications' | 'activities' | 'quotes'>"
  );
}

// 4. Add Tab Button for Quotes
const tabButtonHtml = `
          <button 
            onClick={() => setActiveTab('quotes')}
            className={\`px-5 py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all flex-shrink-0 \${activeTab === 'quotes' ? 'bg-[#f2a900] text-black shadow-lg shadow-[#f2a900]/20 font-bold' : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'}\`}
          >
            <MessageSquare className="w-4 h-4" /> Quotes
          </button>
`;
if (!code.includes("<MessageSquare className=\"w-4 h-4\" /> Quotes")) {
  code = code.replace(
    /<div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white\/10">\s*<button/g,
    `<div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">\n${tabButtonHtml}\n          <button`
  );
}

// 5. Add Quotes View Content
const quotesView = `
      {/* TAB: QUOTES */}
      {activeTab === 'quotes' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-xl">
            <h2 className="font-serif text-2xl font-medium text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#f2a900]" /> Custom Quote Requests
            </h2>
            <div className="space-y-4">
              {quotes.map((q: any) => (
                <div key={q.id} className="bg-black/50 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div>
                    <h3 className="text-[#f2a900] font-bold uppercase tracking-wider text-sm mb-1">{q.clientName} ({q.clientPhone})</h3>
                    <p className="text-white/80 text-sm mb-2">Requested a quote on {new Date(q.timestamp).toLocaleDateString()}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Days: <strong className="text-white">{q.days}</strong></span>
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Canvas: <strong className="text-white">{q.canvas}</strong></span>
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Venue: <strong className="text-white">{q.venue}</strong></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Estimated Value</p>
                    <p className="text-3xl font-serif text-white">Rs. {q.estimatedPrice.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {quotes.length === 0 && (
                <div className="text-center py-12 border border-white/10 border-dashed rounded-2xl">
                  <p className="text-white/50">No custom quotes requested yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
`;

if (!code.includes("{/* TAB: QUOTES */}")) {
  code = code.replace(
    "{/* TAB: ACTIVITIES */}",
    quotesView + "\n\n      {/* TAB: ACTIVITIES */}"
  );
}

// Ensure MessageSquare is imported
if (!code.includes('MessageSquare')) {
  code = code.replace(
    "import { \n  Users,",
    "import { \n  Users,\n  MessageSquare,"
  );
}

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("Quotes Tab added to AdminDashboard.tsx");
