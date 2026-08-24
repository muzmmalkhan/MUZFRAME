const fs = require('fs');
let file = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

file = file.replace(
  'const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});',
  `const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});\n  const [blockedDates, setBlockedDates] = useState<any[]>([]);`
);

file = file.replace(
  'const [clients, events, playlists, payments] = await Promise.all([',
  `const [clients, events, playlists, payments, bDates] = await Promise.all([`
);

file = file.replace(
  `fetchJson('/api/payments')\n        ]);`,
  `fetchJson('/api/payments'),\n          fetchJson('/api/blocked-dates')\n        ]);\n        setBlockedDates(bDates || []);`
);

const handleBookingEventChangeCode = `
  const handleBookingEventChange = (index: number, field: string, value: string) => {
    if (field === 'date') {
      const isBlocked = blockedDates.find(b => b.date === value);
      if (isBlocked) {
        alert(\`This date (\${value}) is unavailable: \${isBlocked.reason}\`);
        return; // do not update state
      }
    }
    const newEvents = [...bookingEvents];
    (newEvents[index] as any)[field] = value;
    setBookingEvents(newEvents);
  };
`;

file = file.replace(
  /const handleBookingEventChange = \(index: number, field: string, value: string\) => {[\s\S]*?setBookingEvents\(newEvents\);\n  };/,
  handleBookingEventChangeCode
);

const blockedDatesUI = `
          {blockedDates.length > 0 && (
            <div className="mb-6 bg-red-950/20 border border-red-500/20 rounded-xl p-4">
              <h4 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Unavailable Dates</h4>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
`;

file = file.replace('<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">', blockedDatesUI);

fs.writeFileSync('src/pages/ClientDashboard.tsx', file);
