const fs = require('fs');
let code = fs.readFileSync('src/components/QuickCalculator.tsx', 'utf-8');

// 1. Remove Canvas state
code = code.replace("  const [canvas, setCanvas] = useState('None');\n", "");

// 2. Remove Canvas pricing logic
const canvasPricing = `    if (canvas === '12x18 (Standard)') total += 3000;
    else if (canvas === '16x24 (Large)') total += 5000;
    else if (canvas === '20x30 (Premium)') total += 8000;
    else if (canvas === '24x36 (Cinematic)') total += 12000;
    
`;
code = code.replace(canvasPricing, "");
code = code.replace("}, [days, cameras, canvas, venue, delivery]);", "}, [days, cameras, venue, delivery]);");

// 3. Remove Canvas from quoteData payload
code = code.replace("      canvas,\n", "");

// 4. Remove Canvas dropdown UI
const canvasUIStart = code.indexOf("{/* Canvas Dropdown */}");
const venueUIStart = code.indexOf("{/* Venue Dropdown */}");
if (canvasUIStart !== -1 && venueUIStart !== -1) {
  const canvasUI = code.substring(canvasUIStart, venueUIStart);
  code = code.replace(canvasUI, "");
}

fs.writeFileSync('src/components/QuickCalculator.tsx', code);
console.log("Removed Canvas from QuickCalculator");
