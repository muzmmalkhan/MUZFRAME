const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf-8');

const targetStr = `      await Promise.all(selectedEvents.map((ev, idx) => {`;
const replacement = `      const isFirstBooking = !clientEvents || clientEvents.length === 0;
      
      // Update the client package if this is their first booking
      if (isFirstBooking && clientData) {
        const updatedClient = {
          ...clientData,
          package: bookingPackage === 'Custom Quote' ? \`Custom Quote (Budget: Rs. \${bookingBudget})\` : bookingPackage,
          eventName: \`\${clientName}'s \${selectedEvents[0].type === 'Other' ? selectedEvents[0].customType : selectedEvents[0].type}\`,
          eventType: selectedEvents[0].type === 'Other' ? selectedEvents[0].customType : selectedEvents[0].type,
          eventDate: selectedEvents[0].date
        };
        fetch(\`/api/clients/\${clientData.id}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedClient)
        });
        setClientData(updatedClient);
      }

      const newEventsData = selectedEvents.map((ev, idx) => {
        const typeName = ev.type === 'Other' ? ev.customType : ev.type;
        const loc = ev.type === 'Barat' ? \`\${ev.startLocation} to \${ev.endLocation}\` : ev.startLocation;
        return {
            id: \`EVT-\${Date.now()}-\${idx}\`,
            clientName: clientName,
            eventName: \`\${clientName}'s \${typeName}\`,
            eventType: typeName,
            date: ev.date,
            venue: loc,
            teamLead: 'Pending Assignment',
            packageDetails: (bookingPackage === 'Custom Quote' ? \`Custom Quote (Budget: Rs. \${bookingBudget})\` : bookingPackage) + (bookingSongs ? \` | Notes: \${bookingSongs}\` : ''),
            status: 'Upcoming',
            deliverablesCount: 0
        };
      });
      
      setClientEvents([...(clientEvents || []), ...newEventsData]);

      await Promise.all(newEventsData.map((evt) => {
        return fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(evt)
        });
      }));`;

const startIdx = code.indexOf(targetStr);
const endStr = `// WhatsApp redirection`;
const endIdx = code.indexOf(endStr);

code = code.substring(0, startIdx) + replacement + "\n\n      " + code.substring(endIdx);
fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
console.log("Success");
