const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

const replacement = `
                  <button type="submit" className="bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs px-6 py-2.5 rounded-xl transition-all shadow-lg md:col-span-1">
                    Add Custom Song
                  </button>
                </form>

                {/* Display custom requests */}
                {(draftNotes || playlistData?.notes) && (
                  <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-[#f2a900] text-xs font-bold uppercase tracking-wider mb-2">Custom Requests:</h4>
                    <pre className="text-white/70 text-xs whitespace-pre-wrap font-sans">{draftNotes !== null ? draftNotes : playlistData?.notes}</pre>
                  </div>
                )}
`;

code = code.replace(/<button type="submit"[^>]*>[\s\S]*?Add Custom Song[\s\S]*?<\/button>\s*<\/form>/, replacement);

fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
