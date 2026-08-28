const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

// 1. Add states
const stateTarget = "const [showAddClient, setShowAddClient] = useState(false);";
const stateReplacement = `  const [showEditClient, setShowEditClient] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [showAddClient, setShowAddClient] = useState(false);`;
code = code.replace(stateTarget, stateReplacement);

// 2. Add handleEditClientSubmit
const handleAddTarget = "const handleAddClientSubmit = async (e: React.FormEvent) => {";
const handleEditReplacement = `  const handleEditClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    const tot = parseInt(editingClient.totalAmount) || 0;
    const paid = parseInt(editingClient.paidAmount) || 0;
    const updated = { ...editingClient, totalAmount: tot, paidAmount: paid };
    
    await fetch(\`/api/clients/\${updated.id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    setClients(clients.map(c => c.id === updated.id ? updated : c));
    setShowEditClient(false);
    triggerToast('Client account updated successfully.');
  };

  const handleAddClientSubmit = async (e: React.FormEvent) => {`;
code = code.replace(handleAddTarget, handleEditReplacement);

// 3. Add Edit Button in table
const actionTarget = `<button
                              onClick={() => handleDeleteClient(client.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors text-red-400"
                              title="Delete Client Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>`;
const actionReplacement = `<button
                              onClick={() => {
                                setEditingClient(client);
                                setShowEditClient(true);
                              }}
                              className="p-2 rounded-xl bg-white/5 hover:bg-[#f2a900] hover:text-black transition-colors text-white/80"
                              title="Edit Client Details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors text-red-400"
                              title="Delete Client Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>`;
code = code.replace(actionTarget, actionReplacement);

// 4. Add Modal
const modalTarget = "{/* MODAL 1: ADD CLIENT ACCOUNT */}";
const modalReplacement = `{/* EDIT CLIENT MODAL */}
      <AnimatePresence>
        {showEditClient && editingClient && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <h2 className="font-serif text-2xl font-medium text-white mb-6">Edit Client Account</h2>
              <form onSubmit={handleEditClientSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Client Full Names</label>
                  <input type="text" required value={editingClient.name} onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Email Address</label>
                    <input type="email" required value={editingClient.email} onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input type="text" value={editingClient.phone} onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Total Amount (Rs)</label>
                    <input type="number" required value={editingClient.totalAmount} onChange={(e) => setEditingClient({ ...editingClient, totalAmount: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Paid Amount (Rs)</label>
                    <input type="number" required value={editingClient.paidAmount} onChange={(e) => setEditingClient({ ...editingClient, paidAmount: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-4">
                  <button type="button" onClick={() => setShowEditClient(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#f2a900] hover:bg-white text-black font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-lg shadow-[#f2a900]/20">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 1: ADD CLIENT ACCOUNT */}`;
code = code.replace(modalTarget, modalReplacement);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("Success");
