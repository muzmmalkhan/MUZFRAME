const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

// Update the Quotes tab display to show the new fields
const oldQuoteDetails = `<div className="flex flex-wrap gap-3 mt-3">
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Days: <strong className="text-white">{q.days}</strong></span>
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Canvas: <strong className="text-white">{q.canvas}</strong></span>
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Venue: <strong className="text-white">{q.venue}</strong></span>
                    </div>`;

const newQuoteDetails = `<div className="flex flex-wrap gap-3 mt-3">
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Days: <strong className="text-white">{q.days}</strong></span>
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Cameras: <strong className="text-white">{q.cameras || 1}</strong></span>
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Canvas: <strong className="text-white">{q.canvas}</strong></span>
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Venue: <strong className="text-white">{q.venue}</strong></span>
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs text-white/60">Delivery: <strong className="text-white">{q.delivery || 'Cloud'}</strong></span>
                    </div>`;

code = code.replace(oldQuoteDetails, newQuoteDetails);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("AdminDashboard updated to show new quote fields");
