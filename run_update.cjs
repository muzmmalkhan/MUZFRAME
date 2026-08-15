const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

code = code.replace(
  /const \[eventData, setEventData\] = useState<any>\(null\);/,
  "const [eventData, setEventData] = useState<any>(null);\n  const [clientEvents, setClientEvents] = useState<any[]>([]);"
);

code = code.replace(
  /const foundEvent = events\.find\(\(e: any\) => e\.clientName === foundClient\.name\);\n\s*if \(foundEvent\) \{\n\s*setEventData\(foundEvent\);\n\s*\}/,
  `const foundEvents = events.filter((e: any) => e.clientName === foundClient.name);\n          setClientEvents(foundEvents);\n          if (foundEvents.length > 0) {\n            setEventData(foundEvents[0]);\n          }`
);

const timelineStart = code.indexOf('<div className="bg-white/5 border border-white/10 rounded-3xl p-8">');
// Find the end of this div which is exactly before `<div className="bg-white/5 border border-white/10 rounded-3xl p-8">` and `Assigned Studio Team`
const teamStart = code.indexOf('<h3 className="font-serif text-xl font-medium text-white mb-4">Assigned Studio Team</h3>');
const endDiv = code.lastIndexOf('</div>', teamStart) - 10; // basically the close of the previous div.
// To be safer, let's just use string replacement on a known unique string block.

const blockToReplace = `<div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h2 className="font-serif text-2xl font-medium text-white mb-6 flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-[#f2a900]" /> Event Deliverables Timeline
                    </h2>
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
           {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isCurrent ? <Clock className="w-4 h-4 animate-pulse pointer-events-none" /> : <div className="w-2 h-2 rounded-full bg-[#f2a900]" />}
        </div>
        <div>
          <h3 className={\`font-medium text-sm \${isCompleted || isCurrent ? 'text-white' : 'text-white/50'}\`}>{titles[idx]} {isCurrent && '(In Progress)'}</h3>
          <p className="text-white/50 text-xs mt-1">{desc[idx]}</p>
        </div>
      </div>
    );
  })}
</div>
                  </div>`;

const newBlock = `{(clientEvents && clientEvents.length > 0 ? clientEvents : [{ id: 'dummy', eventName: displayEventName, status: eventData?.status || 'Upcoming' }]).map((evt: any) => (
  <div key={evt.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
    <h2 className="font-serif text-2xl font-medium text-white mb-6 flex items-center gap-3">
      <Sparkles className="w-5 h-5 text-[#f2a900]" /> {evt.eventName} Deliverables
    </h2>
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
              <h3 className={\`font-medium text-sm \${isCompleted || isCurrent ? 'text-white' : 'text-white/50'}\`}>{titles[idx]} {isCurrent && '(In Progress)'}</h3>
              <p className="text-white/50 text-xs mt-1">{desc[idx]}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
))}`;

if (code.includes('Event Deliverables Timeline')) {
  // Try exact match first
  if (code.includes(blockToReplace)) {
    code = code.replace(blockToReplace, newBlock);
    console.log("Replaced block successfully");
  } else {
    // If exact string doesn't match because of whitespaces, we find bounds
    const startTag = '<h2 className="font-serif text-2xl font-medium text-white mb-6 flex items-center gap-3">';
    const endTag = '</div>\n                  </div>\n                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">';
    
    let si = code.indexOf(startTag);
    if (si !== -1) {
      si = code.lastIndexOf('<div', si);
      let ei = code.indexOf(endTag, si);
      if (ei !== -1) {
        ei += '</div>\n                  </div>'.length;
        code = code.substring(0, si) + newBlock + code.substring(ei);
        console.log("Replaced via bounds successfully");
      }
    }
  }
  fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
}
