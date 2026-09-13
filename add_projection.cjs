const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

const targetAnalytics = `            <div className="bg-zinc-900/80 border border-white/10 p-6 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">Active Events</h3>
                <div className="bg-blue-500/20 text-blue-500 p-2 rounded-lg"><Calendar className="w-4 h-4" /></div>
              </div>
              <p className="text-3xl font-serif text-white font-medium">{events.filter(e => e.status !== 'Delivered').length}</p>
              <p className="text-blue-400 text-[10px] uppercase tracking-wider mt-2 font-bold">In Production Pipeline</p>
            </div>`;

const replacementAnalytics = `            <div className="bg-zinc-900/80 border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">Active Pipeline</h3>
                <div className="bg-blue-500/20 text-blue-500 p-2 rounded-lg"><Calendar className="w-4 h-4" /></div>
              </div>
              <p className="text-3xl font-serif text-white font-medium relative z-10">{events.filter(e => e.status !== 'Delivered').length}</p>
              <p className="text-blue-400 text-[10px] uppercase tracking-wider mt-2 font-bold relative z-10">Total Pipeline Events</p>
              
              {/* Powerful Feature: Dynamic Revenue Pipeline Calculation */}
              <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Expected Inflow</span>
                  <span className="text-green-400 font-bold">
                    Rs. {clients.filter(c => events.some(e => e.clientName === c.name && e.status !== 'Delivered')).reduce((acc, c) => acc + (c.totalAmount - c.paidAmount), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>`;

if (code.includes('Active Events')) {
  code = code.replace(targetAnalytics, replacementAnalytics);
  fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
  console.log("Revenue Projection Added to Admin");
} else {
  console.log("Could not find Active Events in AdminDashboard");
}
