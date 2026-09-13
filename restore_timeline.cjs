const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf-8');

// 1. Update activeTab state declaration
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'songs' | 'security' | 'booking'>('booking');",
  "const [activeTab, setActiveTab] = useState<'overview' | 'booking' | 'songs' | 'security'>('overview');"
);

// 2. Add the Overview tab button as the very first button
const oldButtonsBlock = `<div className="flex gap-8 min-w-max">
            
            <button 
              onClick={() => setActiveTab('booking')}`;

const newButtonsBlock = `<div className="flex gap-8 min-w-max">
            <button 
              onClick={() => setActiveTab('overview')}
              className={\`pb-3 font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors relative \${activeTab === 'overview' ? 'text-[#f2a900]' : 'text-white/50 hover:text-white'}\`}
            >
              <FileText className="w-4 h-4" /> Event Details & Status Timeline
              {activeTab === 'overview' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2a900]" />}
            </button>

            <button 
              onClick={() => setActiveTab('booking')}`;

code = code.replace(oldButtonsBlock, newButtonsBlock);

// 3. Add the Overview tab content before Song Selection
const targetTabPoint = `{/* Tab 3: Song Selection & Playlist */}`;

const overviewJSX = `{/* Tab 1: Event Details & Status Timeline */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* HELPFUL HINT */}
            <div className="bg-[#f2a900]/10 border border-[#f2a900]/30 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#f2a900] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[#f2a900] text-sm font-bold uppercase tracking-wider mb-1">Live Event & Production Status</h4>
                <p className="text-white/70 text-xs leading-relaxed">
                  Track the real-time milestone progress of your wedding cinematography and photography deliverables from initial shoot to color grading and final delivery.
                </p>
              </div>
            </div>

            {(!hasBookedEvent && (!clientEvents || clientEvents.length === 0)) ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-zinc-900/90 via-black to-zinc-900/90 border border-[#f2a900]/40 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#f2a900]/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
                <Calendar className="w-16 h-16 text-[#f2a900] mx-auto mb-4 pointer-events-none" />
                <h3 className="font-serif text-3xl text-white font-medium mb-3">No Active Booked Event Found</h3>
                <p className="text-white/60 max-w-md mx-auto text-sm mb-8 leading-relaxed">
                  You haven't booked any wedding or cinematography coverage yet. Book your upcoming event or contact our team to initialize your timeline.
                </p>
                <button
                  onClick={() => setActiveTab('booking')}
                  className="bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-all inline-flex items-center gap-2 shadow-lg shadow-[#f2a900]/20"
                >
                  <Calendar className="w-4 h-4 pointer-events-none" /> Book Your Event Now
                </button>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Event Highlights & Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f2a900]/10 border border-[#f2a900]/30 text-[#f2a900] flex items-center justify-center">
                        <Calendar className="w-5 h-5 pointer-events-none" />
                      </div>
                      <div>
                        <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Event Schedule</p>
                        <h4 className="text-white font-medium text-base">{displayEventDate}</h4>
                      </div>
                    </div>
                    <p className="text-white/60 text-xs flex items-center gap-1.5 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-[#f2a900]" /> {eventData?.venue || clientData?.location || 'Venue Confirmed'}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f2a900]/10 border border-[#f2a900]/30 text-[#f2a900] flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Booked Package</p>
                        <h4 className="text-white font-medium text-base truncate">{displayPackage}</h4>
                      </div>
                    </div>
                    <p className="text-white/60 text-xs">
                      {eventData?.packageDetails || 'Full Multi-Cam Production'}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 pointer-events-none" />
                      </div>
                      <div>
                        <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Payment & Account</p>
                        <h4 className="text-white font-medium text-base">
                          Rs. {(clientData?.paidAmount || 0).toLocaleString()} Paid
                        </h4>
                      </div>
                    </div>
                    <p className="text-white/60 text-xs">
                      Total: Rs. {(clientData?.totalAmount || 0).toLocaleString()} | Balance: Rs. {Math.max(0, (clientData?.totalAmount || 0) - (clientData?.paidAmount || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Deliverables Timeline */}
                {(clientEvents && clientEvents.length > 0 ? clientEvents : [{ id: 'evt-curr', eventName: displayEventName, status: eventData?.status || 'Upcoming' }]).map((evt) => (
                  <div key={evt.id} className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
                      <div>
                        <span className="bg-[#f2a900]/10 border border-[#f2a900]/30 text-[#f2a900] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          {evt.eventType || 'Ceremony'}
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-medium text-white mt-2 flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-[#f2a900]" /> {evt.eventName} Deliverables
                        </h2>
                        {evt.venue && (
                          <p className="text-white/50 text-xs flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#f2a900]" /> {evt.venue} &bull; {evt.date}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-widest text-white/50">Current Status:</span>
                        <span className="bg-white/10 text-[#f2a900] border border-[#f2a900]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {evt.status || 'Upcoming'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                      {['Upcoming', 'In Progress', 'Editing', 'Color Grading', 'Delivered'].map((step, idx) => {
                        const statusOrder = ['Upcoming', 'In Progress', 'Editing', 'Color Grading', 'Delivered'];
                        const currentStatus = evt.status || 'Upcoming';
                        let currentIndex = statusOrder.indexOf(currentStatus);
                        if (currentIndex === -1) currentIndex = 0;
                        
                        const stepIndex = idx;
                        const isDelivered = currentStatus === 'Delivered';
                        
                        const isCompleted = isDelivered ? true : stepIndex < currentIndex;
                        const isCurrent = isDelivered ? false : stepIndex === currentIndex;
                        const isPending = isDelivered ? false : stepIndex > currentIndex;
                        const titles = [
                          'Booking Confirmed & Agreement Signed',
                          'Event Shoot Completed',
                          'Editing & Assembly',
                          'Color Grading & Highlights',
                          'Completed & Delivered'
                        ];
                        const desc = [
                          'Package locked: ' + displayPackage + '. Advance deposit verified.',
                          'Multi-camera cinematography & aerial drone coverage successfully concluded.',
                          'Initial assembly and sync of all video and audio footage.',
                          'First pass cinematic highlights color-graded and uploaded to portal.',
                          'Final media available for download and custom albums in production.'
                        ];
                        return (
                          <div key={step} className="flex items-start gap-4 relative">
                            <div className={\`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 \${isCompleted || isCurrent ? 'bg-[#f2a900] text-black' : 'bg-white/10 border border-[#f2a900] text-[#f2a900]'}\`}>
                              {isCompleted ? <CheckCircle2 className="w-4 h-4 pointer-events-none" /> : isCurrent ? <Clock className="w-4 h-4 animate-pulse pointer-events-none" /> : <div className="w-2 h-2 rounded-full bg-[#f2a900]" />}
                            </div>
                            <div>
                              <h3 className={\`font-medium text-sm \${isCompleted || isCurrent ? 'text-white' : 'text-white/50'}\`}>
                                {titles[idx]} {isCurrent && '(In Progress)'}
                              </h3>
                              <p className="text-white/50 text-xs mt-1">{desc[idx]}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Assigned Team & Direct Contact */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                  <h3 className="font-serif text-xl font-medium text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#f2a900]" /> Assigned Studio Team
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 border border-white/5 rounded-2xl p-5">
                    <div>
                      <p className="text-white font-medium text-sm">{eventData?.teamLead || 'Muzammal Khan & Senior Cinematography Crew'}</p>
                      <p className="text-white/50 text-xs mt-0.5">Lead Cinematographer & Creative Director</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href="https://wa.me/923072480246"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#25D366]/20 hover:bg-[#25D366] hover:text-black text-[#25D366] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-[#25D366]/30 transition-all flex items-center gap-2"
                      >
                        Contact Director on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        ` + targetTabPoint;

code = code.replace(targetTabPoint, overviewJSX);

fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
console.log("Successfully restored Event Details & Status Timeline to first position!");
