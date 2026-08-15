const fs = require('fs');
let contactCode = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
let dashboardCode = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

contactCode = contactCode.replace(/<Calendar className="([^"]+)"/g, (match, className) => {
  if (!className.includes('pointer-events-none')) {
    return `<Calendar className="${className} pointer-events-none"`;
  }
  return match;
});

contactCode = contactCode.replace(/<Clock className="([^"]+)"/g, (match, className) => {
  if (!className.includes('pointer-events-none')) {
    return `<Clock className="${className} pointer-events-none"`;
  }
  return match;
});

dashboardCode = dashboardCode.replace(/<Calendar className="([^"]+)"/g, (match, className) => {
  if (!className.includes('pointer-events-none')) {
    return `<Calendar className="${className} pointer-events-none"`;
  }
  return match;
});

dashboardCode = dashboardCode.replace(/<Clock className="([^"]+)"/g, (match, className) => {
  if (!className.includes('pointer-events-none')) {
    return `<Clock className="${className} pointer-events-none"`;
  }
  return match;
});

fs.writeFileSync('src/pages/Contact.tsx', contactCode);
fs.writeFileSync('src/pages/ClientDashboard.tsx', dashboardCode);
