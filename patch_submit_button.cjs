const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

const submitUI = `
              </div>

              {/* Submit Selections Button */}
              {draftSongIds !== null && (
                <div className="mt-8 border-t border-[#f2a900]/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#f2a900]/5 p-6 rounded-2xl">
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#f2a900]"/> Unsaved Selections</h3>
                    <p className="text-white/60 text-xs mt-1">You have made changes to your song selection. Click submit to send them to the studio.</p>
                  </div>
                  <button onClick={handleSubmitSelections} className="w-full md:w-auto bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs px-8 py-3.5 rounded-xl transition-all shadow-lg flex-shrink-0 flex items-center justify-center gap-2">
                    Submit Selections
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
`;

code = code.replace(/<\/form>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/s, submitUI + '\n        )}');

fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
