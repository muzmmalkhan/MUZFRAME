const fs = require('fs');
let file = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

file = file.replace(
  'const [errors, setErrors] = useState<Record<string, string>>({});',
  `const [errors, setErrors] = useState<Record<string, string>>({});\n  const [blockedDates, setBlockedDates] = React.useState<any[]>([]);\n\n  React.useEffect(() => {\n    fetch('/api/blocked-dates').then(r => r.json()).then(d => setBlockedDates(d || [])).catch(console.error);\n  }, []);`
);

const handleEventChangeCode = `
  const handleEventChange = (index: number, field: string, value: string) => {
    if (field === 'date') {
      const isBlocked = blockedDates.find(b => b.date === value);
      if (isBlocked) {
        alert(\`This date (\${value}) is unavailable: \${isBlocked.reason}\`);
        return;
      }
    }
    const newEvents = [...events];
    (newEvents[index] as any)[field] = value;
    setEvents(newEvents);
  };
`;

file = file.replace(
  /const handleEventChange = \(index: number, field: string, value: string\) => {[\s\S]*?setEvents\(newEvents\);\n  };/,
  handleEventChangeCode
);

const blockedDatesUI = `
                {blockedDates.length > 0 && (
                  <div className="mb-6 bg-red-950/20 border border-red-500/20 rounded-xl p-4">
                    <h4 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Unavailable Dates
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {blockedDates.map(bd => (
                        <span key={bd.id} className="bg-red-500/10 text-red-300 text-xs px-2 py-1 rounded-md border border-red-500/20">
                          {new Date(bd.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          <span className="opacity-60 ml-1">({bd.reason})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Event Types (Select Multiple)</label>
`;

file = file.replace('<label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Event Types (Select Multiple)</label>', blockedDatesUI);

fs.writeFileSync('src/pages/Contact.tsx', file);
