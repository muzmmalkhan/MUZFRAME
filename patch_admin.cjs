const fs = require('fs');
let file = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

file = file.replace(
  'const [activities, setActivities] = useState<any[]>([]);',
  `const [activities, setActivities] = useState<any[]>([]);\n  const [blockedDates, setBlockedDates] = useState<{id: string, date: string, reason: string}[]>([]);\n  const [newBlockedDate, setNewBlockedDate] = useState('');\n  const [newBlockedReason, setNewBlockedReason] = useState('');`
);

file = file.replace(
  'const [cRes, eRes, pRes, nRes, plRes, aRes] = await Promise.all([',
  `const [cRes, eRes, pRes, nRes, plRes, aRes, bdRes] = await Promise.all([`
);

file = file.replace(
  'fetchJson(\'/api/activities\')\n        ]);',
  `fetchJson('/api/activities'),\n          fetchJson('/api/blocked-dates')\n        ]);`
);

file = file.replace(
  'setActivities(aRes);',
  `setActivities(aRes);\n        setBlockedDates(bdRes);`
);

const handleBlockDateCode = `
  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newBlockedDate, reason: newBlockedReason })
      });
      if (res.ok) {
        const bd = await res.json();
        setBlockedDates([...blockedDates, bd]);
        setNewBlockedDate('');
        setNewBlockedReason('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnblockDate = async (id: string) => {
    try {
      const res = await fetch(\`/api/blocked-dates/\${id}\`, { method: 'DELETE' });
      if (res.ok) {
        setBlockedDates(blockedDates.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };
`;

file = file.replace('return (', handleBlockDateCode + '\n  return (');

const blockDatesUI = `
          <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 shadow-xl mb-6">
            <h3 className="font-serif text-xl font-medium text-white mb-4">Calendar Availability (Block Dates)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <form onSubmit={handleBlockDate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Select Date</label>
                  <input type="date" value={newBlockedDate} onChange={e => setNewBlockedDate(e.target.value)} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark] focus:outline-none focus:border-[#f2a900]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Reason (Optional)</label>
                  <input type="text" value={newBlockedReason} onChange={e => setNewBlockedReason(e.target.value)} placeholder="e.g., Public Holiday, Fully Booked" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f2a900]" />
                </div>
                <button type="submit" className="w-full bg-red-600/20 text-red-500 border border-red-500/30 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-red-600/30 transition-all flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Block Selected Date
                </button>
              </form>
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <h4 className="text-white/70 font-semibold text-sm mb-3">Currently Blocked Dates</h4>
                {blockedDates.length === 0 ? (
                  <p className="text-white/40 text-xs">No dates are currently blocked.</p>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {blockedDates.map(bd => (
                      <div key={bd.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/5 rounded-lg p-3 border border-white/10">
                        <div>
                          <p className="text-white font-medium text-sm">{new Date(bd.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          <p className="text-white/50 text-xs">{bd.reason}</p>
                        </div>
                        <button onClick={() => handleUnblockDate(bd.id)} className="text-white/40 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-md transition-all self-start sm:self-auto">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
`;

file = file.replace('<div className="grid grid-cols-1 md:grid-cols-3 gap-6">', blockDatesUI + '\n          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">');

fs.writeFileSync('src/pages/AdminDashboard.tsx', file);
