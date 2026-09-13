const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

// 1. Update State
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'clients' | 'events' | 'payments' | 'songs' | 'gallery' | 'notifications'>('clients');",
  "const [activeTab, setActiveTab] = useState<'analytics' | 'clients' | 'events' | 'payments' | 'songs' | 'gallery' | 'notifications' | 'activities'>('analytics');"
);

// 2. Add Lucide Icons
if (!code.includes('TrendingUp')) {
  code = code.replace(
    "import { \n  Users,",
    "import { \n  Users,\n  TrendingUp,\n  Activity,\n  AlertCircle,\n  CheckSquare,"
  );
}

// 3. Add Tab Button
const tabButtonHtml = `
          <button 
            onClick={() => setActiveTab('analytics')}
            className={\`px-5 py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all flex-shrink-0 \${activeTab === 'analytics' ? 'bg-[#f2a900] text-black shadow-lg shadow-[#f2a900]/20 font-bold' : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'}\`}
          >
            <TrendingUp className="w-4 h-4" /> Studio Analytics & Intelligence
          </button>
`;
if (!code.includes("Studio Analytics & Intelligence")) {
  code = code.replace(
    /<div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white\/10">\s*<button/g,
    `<div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">\n${tabButtonHtml}\n          <button`
  );
}

// 4. Add Analytics View Content
const analyticsView = `
      {/* TAB: ANALYTICS & INTELLIGENCE */}
      {activeTab === 'analytics' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/80 border border-white/10 p-6 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">Total Revenue</h3>
                <div className="bg-[#f2a900]/20 text-[#f2a900] p-2 rounded-lg"><DollarSign className="w-4 h-4" /></div>
              </div>
              <p className="text-3xl font-serif text-white font-medium">Rs. {totalRevenue.toLocaleString()}</p>
              <p className="text-[#f2a900] text-[10px] uppercase tracking-wider mt-2 font-bold">+Lifetime Earnings</p>
            </div>
            
            <div className="bg-zinc-900/80 border border-white/10 p-6 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">Pending Receivables</h3>
                <div className="bg-red-500/20 text-red-500 p-2 rounded-lg"><AlertCircle className="w-4 h-4" /></div>
              </div>
              <p className="text-3xl font-serif text-white font-medium">Rs. {totalReceivables.toLocaleString()}</p>
              <p className="text-red-400 text-[10px] uppercase tracking-wider mt-2 font-bold">Requires Follow-up</p>
            </div>
            
            <div className="bg-zinc-900/80 border border-white/10 p-6 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">Active Events</h3>
                <div className="bg-blue-500/20 text-blue-500 p-2 rounded-lg"><Calendar className="w-4 h-4" /></div>
              </div>
              <p className="text-3xl font-serif text-white font-medium">{events.filter(e => e.status !== 'Delivered').length}</p>
              <p className="text-blue-400 text-[10px] uppercase tracking-wider mt-2 font-bold">In Production Pipeline</p>
            </div>

            <div className="bg-zinc-900/80 border border-white/10 p-6 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">Client Base</h3>
                <div className="bg-purple-500/20 text-purple-500 p-2 rounded-lg"><Users className="w-4 h-4" /></div>
              </div>
              <p className="text-3xl font-serif text-white font-medium">{clients.length}</p>
              <p className="text-purple-400 text-[10px] uppercase tracking-wider mt-2 font-bold">Total Registered</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-medium text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#f2a900]" /> Intelligence & Action Items
                </h2>
              </div>
              <div className="space-y-4">
                {clients.filter(c => c.totalAmount - c.paidAmount > 0).slice(0, 3).map(client => (
                  <div key={'warn-'+client.id} className="bg-black/40 border border-red-500/20 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500" /> Pending Payment: {client.name}</h4>
                      <p className="text-white/50 text-xs mt-1">Balance of Rs. {(client.totalAmount - client.paidAmount).toLocaleString()} is pending.</p>
                    </div>
                    <button onClick={() => setActiveTab('clients')} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">Resolve</button>
                  </div>
                ))}

                {events.filter(e => e.status === 'Upcoming').slice(0, 3).map(ev => {
                  const targetDate = new Date(ev.date).getTime();
                  const now = new Date().getTime();
                  const diff = targetDate - now;
                  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                  if (days >= 0 && days <= 7) {
                    return (
                      <div key={'urg-'+ev.id} className="bg-black/40 border border-[#f2a900]/20 p-4 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-[#f2a900]" /> Upcoming Event: {ev.eventName}</h4>
                          <p className="text-white/50 text-xs mt-1">Event is in {days} days. Ensure team lead ({ev.teamLead}) is ready.</p>
                        </div>
                        <button onClick={() => setActiveTab('events')} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">Manage</button>
                      </div>
                    );
                  }
                  return null;
                })}

                {events.filter(e => e.status === 'Editing' || e.status === 'Color Grading').slice(0, 3).map(ev => (
                  <div key={'prog-'+ev.id} className="bg-black/40 border border-blue-500/20 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium text-sm flex items-center gap-2"><CheckSquare className="w-4 h-4 text-blue-500" /> In Post-Production: {ev.eventName}</h4>
                      <p className="text-white/50 text-xs mt-1">Currently in {ev.status} phase.</p>
                    </div>
                    <button onClick={() => setActiveTab('events')} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">Update</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-xl">
              <h2 className="font-serif text-xl font-medium text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f2a900]" /> Latest Activity
              </h2>
              <div className="space-y-4">
                {activities.slice(0, 5).map(act => (
                  <div key={act.id} className="border-l-2 border-[#f2a900]/30 pl-4 pb-4 last:pb-0 relative">
                    <div className="absolute w-2 h-2 rounded-full bg-[#f2a900] -left-[5px] top-1.5" />
                    <p className="text-white text-sm font-medium">{act.clientName}</p>
                    <p className="text-white/60 text-xs mt-0.5">{act.description}</p>
                    <p className="text-white/40 text-[10px] mt-1 uppercase tracking-widest">{new Date(act.timestamp).toLocaleDateString()}</p>
                  </div>
                ))}
                {activities.length === 0 && <p className="text-white/40 text-xs italic">No recent activity detected.</p>}
              </div>
              <button onClick={() => setActiveTab('activities')} className="w-full mt-6 py-3 border border-white/10 hover:border-[#f2a900]/50 rounded-xl text-xs font-bold uppercase tracking-widest text-white/70 hover:text-[#f2a900] transition-colors">View All Logs</button>
            </div>
          </div>
        </div>
      )}
`;

if (!code.includes("{/* TAB: ANALYTICS & INTELLIGENCE */}")) {
  code = code.replace(
    "{/* TAB: ACTIVITIES */}",
    analyticsView + "\n\n      {/* TAB: ACTIVITIES */}"
  );
}

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("Admin Dashboard Logic Enhanced");
