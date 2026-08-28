const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

// 1. Add states
const stateTarget = "const [editingClient, setEditingClient] = useState<any>(null);";
const stateReplacement = `const [editingClient, setEditingClient] = useState<any>(null);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);`;
code = code.replace(stateTarget, stateReplacement);

// 2. Add handleEditEventSubmit
const handleAddTarget = "const handleAddClientSubmit = async (e: React.FormEvent) => {";
const handleEditReplacement = `  const handleEditEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    await fetch(\`/api/events/\${editingEvent.id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingEvent)
    });
    setEvents(events.map(ev => ev.id === editingEvent.id ? editingEvent : ev));
    setShowEditEvent(false);
    triggerToast('Event details updated successfully.');
  };

  const handleAddClientSubmit = async (e: React.FormEvent) => {`;
code = code.replace(handleAddTarget, handleEditReplacement);

// 3. Add Edit Button to Event Card
const actionTarget = `<div className="flex items-center justify-between mb-3">
                    <span className="bg-white/10 text-white font-mono text-[10px] px-2.5 py-1 rounded font-bold">{evt.id}</span>
                    <span className="bg-[#f2a900]/10 border border-[#f2a900]/30 text-[#f2a900] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                      {evt.eventType || 'Wedding'}
                    </span>
                  </div>`;
const actionReplacement = `<div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/10 text-white font-mono text-[10px] px-2.5 py-1 rounded font-bold">{evt.id}</span>
                      <button onClick={() => { setEditingEvent(evt); setShowEditEvent(true); }} className="p-1 rounded bg-white/5 hover:bg-[#f2a900] hover:text-black transition-colors text-white/60">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="bg-[#f2a900]/10 border border-[#f2a900]/30 text-[#f2a900] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                      {evt.eventType || 'Wedding'}
                    </span>
                  </div>`;
code = code.replace(actionTarget, actionReplacement);

// 4. Add Modal
const modalTarget = "{/* EDIT CLIENT MODAL */}";
const modalReplacement = `{/* EDIT EVENT MODAL */}
      <AnimatePresence>
        {showEditEvent && editingEvent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <h2 className="font-serif text-2xl font-medium text-white mb-6">Edit Event Details</h2>
              <form onSubmit={handleEditEventSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Event Name</label>
                  <input type="text" required value={editingEvent.eventName} onChange={(e) => setEditingEvent({ ...editingEvent, eventName: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Date</label>
                    <input type="date" required value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900] [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Team Lead</label>
                    <input type="text" value={editingEvent.teamLead} onChange={(e) => setEditingEvent({ ...editingEvent, teamLead: e.target.value })} placeholder="e.g. Muzammal Khan" className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Venue</label>
                  <input type="text" required value={editingEvent.venue} onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Package Details</label>
                  <input type="text" required value={editingEvent.packageDetails} onChange={(e) => setEditingEvent({ ...editingEvent, packageDetails: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                </div>
                
                <div className="flex items-center gap-3 pt-4">
                  <button type="button" onClick={() => setShowEditEvent(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#f2a900] hover:bg-white text-black font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-lg shadow-[#f2a900]/20">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT CLIENT MODAL */}`;
code = code.replace(modalTarget, modalReplacement);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("Success");
