const fs = require('fs');
let contactCode = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
let dashboardCode = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

const datePattern = /<input\s+type="date"\s+value=\{ev\.date\}[\s\S]*?className=\{`([^`]+)`\}/g;
contactCode = contactCode.replace(datePattern, (match, classNames) => {
  return match.replace(classNames, classNames + ' [color-scheme:dark]')
    .replace('<input ', '<input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} ');
});

const timeStartPattern = /<input\s+type="time"\s+value=\{ev\.startTime\}[\s\S]*?className=\{`([^`]+)`\}/g;
contactCode = contactCode.replace(timeStartPattern, (match, classNames) => {
  return match.replace(classNames, classNames + ' [color-scheme:dark]')
    .replace('<input ', '<input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} ');
});

const timeEndPattern = /<input\s+type="time"\s+value=\{ev\.endTime\}[\s\S]*?className=\{`([^`]+)`\}/g;
contactCode = contactCode.replace(timeEndPattern, (match, classNames) => {
  return match.replace(classNames, classNames + ' [color-scheme:dark]')
    .replace('<input ', '<input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} ');
});


const dbDatePattern = /<input\s+type="date"\s+value=\{ev\.date\}[\s\S]*?className=\{`([^`]+)`\}/g;
dashboardCode = dashboardCode.replace(dbDatePattern, (match, classNames) => {
  return match.replace(classNames, classNames + ' [color-scheme:dark]')
    .replace('<input ', '<input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} ');
});

const dbTimeStartPattern = /<input\s+type="time"\s+value=\{ev\.startTime\}[\s\S]*?className=\{`([^`]+)`\}/g;
dashboardCode = dashboardCode.replace(dbTimeStartPattern, (match, classNames) => {
  return match.replace(classNames, classNames + ' [color-scheme:dark]')
    .replace('<input ', '<input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} ');
});

const dbTimeEndPattern = /<input\s+type="time"\s+value=\{ev\.endTime\}[\s\S]*?className=\{`([^`]+)`\}/g;
dashboardCode = dashboardCode.replace(dbTimeEndPattern, (match, classNames) => {
  return match.replace(classNames, classNames + ' [color-scheme:dark]')
    .replace('<input ', '<input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} ');
});

fs.writeFileSync('src/pages/Contact.tsx', contactCode);
fs.writeFileSync('src/pages/ClientDashboard.tsx', dashboardCode);
