const fs = require('fs');

let content = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf-8');

// 1. Add new state variables for booking form
content = content.replace(
  "const [bookingLocation, setBookingLocation] = useState('');",
  `const [bookingLocation, setBookingLocation] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEventType, setBookingEventType] = useState('');`
);

// Add default values after user loads
content = content.replace(
  "setClientData(foundClient);",
  `setClientData(foundClient);
          setBookingEmail(user.email || '');`
);

// 2. Change hasBookedEvent
content = content.replace(
  "const hasBookedEvent = !!clientData || !!user?.hasBookedEvent;",
  "const hasBookedEvent = !!eventData && clientData?.eventName !== 'Pending Booking';"
);

// 3. Move booking button to be second
// Find the booking button block and remove it from the end, insert after gallery
const bookingBtnRegex = /<button \s*onClick=\{\(\) => setActiveTab\('booking'\)\}.*?<\/button>/s;
const match = content.match(bookingBtnRegex);
if (match) {
    content = content.replace(match[0], '');
    const galleryBtnRegex = /<button \s*onClick=\{\(\) => setActiveTab\('gallery'\)\}.*?<\/button>/s;
    const gMatch = content.match(galleryBtnRegex);
    if (gMatch) {
        content = content.replace(gMatch[0], gMatch[0] + '\n            ' + match[0]);
    }
}

// 4. Update timeline to be dynamic
const timelineContentRegex = /<div className="space-y-6 relative before:absolute before:left-3\.5 before:top-2 before:bottom-2 before:w-0\.5 before:bg-white\/10">.*?<\/div>\s*<\/div>\s*<div className="bg-white\/5 border border-white\/10 rounded-3xl p-8">/s;
const dynamicTimeline = `
<div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
  {['Upcoming', 'In Progress', 'Editing', 'Color Grading', 'Delivered'].map((step, idx) => {
    const statusOrder = ['Upcoming', 'In Progress', 'Editing', 'Color Grading', 'Delivered'];
    const currentStatus = eventData?.status || 'Upcoming';
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = idx;
    const isCompleted = stepIndex < currentIndex;
    const isCurrent = stepIndex === currentIndex;
    const isPending = stepIndex > currentIndex;

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
           {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isCurrent ? <Clock className="w-4 h-4 animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-[#f2a900]" />}
        </div>
        <div>
          <h3 className={\`font-medium text-sm \${isCompleted || isCurrent ? 'text-white' : 'text-white/50'}\`}>{titles[idx]} {isCurrent && '(In Progress)'}</h3>
          <p className="text-white/50 text-xs mt-1">{desc[idx]}</p>
        </div>
      </div>
    );
  })}
</div>
</div>

<div className="bg-white/5 border border-white/10 rounded-3xl p-8">
`;
content = content.replace(timelineContentRegex, dynamicTimeline);

// 5. Update handleBookingSubmit and Form UI
const handleBookingSubmitReplacement = `
      const newEvent = {
        id: \`EVT-\${Date.now()}\`,
        clientName: user?.name || clientData?.name || 'Unknown Client',
        eventName: \`\${bookingEventType} Event\`,
        eventType: bookingEventType,
        date: bookingDate,
        venue: bookingLocation,
        teamLead: 'Pending Assignment',
        packageDetails: bookingPackage + (bookingSongs ? \` | Notes: \${bookingSongs}\` : ''),
        status: 'Upcoming',
        deliverablesCount: 0
      };

      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      
      // WhatsApp redirection
      const adminPhone = "923000000000"; // Replace with actual admin number
      const waText = encodeURIComponent(\`New Booking Request\\n\\nClient: \${newEvent.clientName}\\nEmail: \${bookingEmail}\\nPhone: \${bookingPhone}\\nEvent Type: \${bookingEventType}\\nPackage: \${bookingPackage}\\nDate: \${newEvent.date}\\nTime: \${bookingTime}\\nLocation: \${newEvent.venue}\\nPreferred Songs: \${bookingSongs}\`);
`;

content = content.replace(
  /const newEvent = \{[\s\S]*?const waText = encodeURIComponent.*?;/s,
  handleBookingSubmitReplacement
);

// 6. Form fields in tab 5
const oldFormContent = /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">[\s\S]*?<div className="md:col-span-2">/s;
const newFormContent = `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+92 XXX XXXXXXX"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Select Package</label>
                    <select 
                      value={bookingPackage}
                      onChange={(e) => setBookingPackage(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                    >
                      <option value="" disabled>Choose a package...</option>
                      <option value="Premium Wedding Cover">Premium Wedding Cover</option>
                      <option value="Luxury Cinematic Package">Luxury Cinematic Package</option>
                      <option value="Basic Event Shoot">Basic Event Shoot</option>
                      <option value="Pre-Wedding / Engagement">Pre-Wedding / Engagement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Event Type</label>
                    <select 
                      value={bookingEventType}
                      onChange={(e) => setBookingEventType(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                    >
                      <option value="" disabled>Choose event type...</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Event Location / Address</label>
                    <input 
                      type="text" 
                      placeholder="Full Venue Address or City" 
                      value={bookingLocation}
                      onChange={(e) => setBookingLocation(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Event Date</label>
                    <input 
                      type="date" 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Time Details</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Evening / 7:00 PM onwards" 
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">`;
                
content = content.replace(oldFormContent, newFormContent);

fs.writeFileSync('src/pages/ClientDashboard.tsx', content);
