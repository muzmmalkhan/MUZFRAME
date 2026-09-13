const fs = require('fs');
let code = fs.readFileSync('src/components/QuickCalculator.tsx', 'utf-8');

// Update calculation logic
const oldCalc = `    if (delivery === 'Local Pickup (USB Drive)') total += 2000;`;
const newCalc = `    if (delivery === 'Local Pickup (USB Drive)') total += 2000;
    else if (delivery === 'Cloud (Google Drive Link)') total += 3000;`;
code = code.replace(oldCalc, newCalc);

// Update dropdown options
const oldDropdown = `<option value="Cloud" className="bg-[#121212]">Cloud (Google Drive Link)</option>`;
const newDropdown = `<option value="Cloud (Google Drive Link)" className="bg-[#121212]">Cloud (Google Drive Link) + Rs. 3,000</option>`;
code = code.replace(oldDropdown, newDropdown);

// Update default state
const oldState = `const [delivery, setDelivery] = useState('Cloud');`;
const newState = `const [delivery, setDelivery] = useState('Cloud (Google Drive Link)');`;
code = code.replace(oldState, newState);

fs.writeFileSync('src/components/QuickCalculator.tsx', code);
console.log("Updated Cloud price in QuickCalculator");
