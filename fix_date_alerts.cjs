const fs = require('fs');

// Contact.tsx
let contactFile = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

const contactOldCode = `
  const handleEventChange = (index: number, field: string, value: string) => {
    if (field === 'date') {
      const isBlocked = blockedDates.find(b => b.date === value);
      if (isBlocked) {
        alert(\`This date (\${value}) is unavailable: \${isBlocked.reason}\`);
        return;
      }
    }
    const newEvents = [...events];
    (newEvents[index] as any)[field] = value;
    setEvents(newEvents);
  };
`;

const contactNewCode = `
  const handleEventChange = (index: number, field: string, value: string) => {
    if (field === 'date') {
      const isBlocked = blockedDates.find(b => b.date === value);
      if (isBlocked) {
        setErrors(prev => ({ ...prev, [\`date_\${events[index].type}\`]: \`This date is unavailable: \${isBlocked.reason}\` }));
        return;
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[\`date_\${events[index].type}\`];
          return newErrors;
        });
      }
    }
    const newEvents = [...events];
    (newEvents[index] as any)[field] = value;
    setEvents(newEvents);
  };
`;

contactFile = contactFile.replace(contactOldCode.trim(), contactNewCode.trim());
fs.writeFileSync('src/pages/Contact.tsx', contactFile);

// ClientDashboard.tsx
let clientFile = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

const clientOldCode = `
  const handleBookingEventChange = (index: number, field: string, value: string) => {
    if (field === 'date') {
      const isBlocked = blockedDates.find(b => b.date === value);
      if (isBlocked) {
        alert(\`This date (\${value}) is unavailable: \${isBlocked.reason}\`);
        return; // do not update state
      }
    }
    const newEvents = [...bookingEvents];
    (newEvents[index] as any)[field] = value;
    setBookingEvents(newEvents);
  };
`;

const clientNewCode = `
  const handleBookingEventChange = (index: number, field: string, value: string) => {
    if (field === 'date') {
      const isBlocked = blockedDates.find(b => b.date === value);
      if (isBlocked) {
        setBookingErrors(prev => ({ ...prev, [\`date_\${bookingEvents[index].type}\`]: \`This date is unavailable: \${isBlocked.reason}\` }));
        return;
      } else {
        setBookingErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[\`date_\${bookingEvents[index].type}\`];
          return newErrors;
        });
      }
    }
    const newEvents = [...bookingEvents];
    (newEvents[index] as any)[field] = value;
    setBookingEvents(newEvents);
  };
`;

clientFile = clientFile.replace(clientOldCode.trim(), clientNewCode.trim());
fs.writeFileSync('src/pages/ClientDashboard.tsx', clientFile);
