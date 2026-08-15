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

fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
console.log("Replaced state logic successfully");
