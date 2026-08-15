const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

const startStr = '<h2 className="font-serif text-2xl font-medium text-white mb-6 flex items-center gap-3">\n                      <Sparkles className="w-5 h-5 text-[#f2a900]" /> Event Deliverables Timeline\n                    </h2>';

let startIdx = code.indexOf(startStr);
if (startIdx !== -1) {
  startIdx = code.lastIndexOf('<div', startIdx);
  
  const endStr = '<h3 className="font-serif text-xl font-medium text-white mb-4">Assigned Studio Team</h3>';
  let endIdx = code.indexOf(endStr, startIdx);
  if (endIdx !== -1) {
    endIdx = code.lastIndexOf('<div', endIdx);
    
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
))}\n                  `;
    
    code = code.substring(0, startIdx) + newBlock + code.substring(endIdx);
    fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
    console.log("Replaced timeline logic successfully");
  } else {
    console.log("Could not find endStr");
  }
} else {
  console.log("Could not find startStr");
}
