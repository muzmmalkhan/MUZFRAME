const fs = require('fs');
let code = fs.readFileSync('src/components/QuickCalculator.tsx', 'utf-8');

// 1. Add state variables for cameras and delivery
code = code.replace(
  "const [venue, setVenue] = useState('Hasilpur');",
  "const [venue, setVenue] = useState('Hasilpur');\n  const [cameras, setCameras] = useState(1);\n  const [delivery, setDelivery] = useState('Cloud');"
);

// 2. Update the estimated price calculation
const oldPricing = `  const estimatedPrice = useMemo(() => {
    let total = days * 25000;
    
    if (canvas === '12x18 (Standard)') total += 3000;
    else if (canvas === '16x24 (Large)') total += 5000;
    else if (canvas === '20x30 (Premium)') total += 8000;
    else if (canvas === '24x36 (Cinematic)') total += 12000;
    
    if (venue === 'Chistian') total += 10000;
    else if (venue === 'Others') total += 50000;
    
    return total;
  }, [days, canvas, venue]);`;

const newPricing = `  const estimatedPrice = useMemo(() => {
    let total = days * 25000; // Base for 1 camera
    
    if (cameras > 1) {
      total += (cameras - 1) * days * 15000; // Extra per camera per day
    }
    
    if (canvas === '12x18 (Standard)') total += 3000;
    else if (canvas === '16x24 (Large)') total += 5000;
    else if (canvas === '20x30 (Premium)') total += 8000;
    else if (canvas === '24x36 (Cinematic)') total += 12000;
    
    if (venue === 'Chistian') total += 10000;
    else if (venue === 'Others') total += 50000;
    
    if (delivery === 'Local Pickup (USB Drive)') total += 2000;
    
    return total;
  }, [days, cameras, canvas, venue, delivery]);`;

code = code.replace(oldPricing, newPricing);

// 3. Update the handleSendQuote payload
const oldPayload = `    const quoteData = {
      days,
      canvas,
      venue,
      estimatedPrice,
      clientName: user?.name || 'Unknown',
      clientPhone: user?.phone || 'Unknown'
    };`;

const newPayload = `    const quoteData = {
      days,
      cameras,
      canvas,
      venue,
      delivery,
      estimatedPrice,
      clientName: user?.name || 'Unknown',
      clientPhone: user?.phone || 'Unknown'
    };`;

code = code.replace(oldPayload, newPayload);

// 4. Add UI elements for cameras and delivery
const daysUI = `            {/* Slider for days */}
            <div>
              <label className="flex justify-between text-sm uppercase tracking-widest text-white/70 font-semibold mb-4">
                <span>Number of Shoot Days</span>
                <span className="text-[#f2a900] font-bold">{days} {days === 1 ? 'Day' : 'Days'}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="7" 
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full accent-[#f2a900] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>`;

const extraUI = `${daysUI}

            {/* Slider for cameras */}
            <div>
              <label className="flex justify-between text-sm uppercase tracking-widest text-white/70 font-semibold mb-4">
                <span>Number of Cameras</span>
                <span className="text-[#f2a900] font-bold">{cameras} {cameras === 1 ? 'Camera' : 'Cameras'}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={cameras}
                onChange={(e) => setCameras(parseInt(e.target.value))}
                className="w-full accent-[#f2a900] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>`;

code = code.replace(daysUI, extraUI);

const venueUI = `            {/* Venue Dropdown */}
            <div>
              <label className="block text-sm uppercase tracking-widest text-white/70 font-semibold mb-3">
                Venue Location
              </label>
              <select 
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-[#f2a900]/60 transition-colors appearance-none"
              >
                <option value="Hasilpur" className="bg-[#121212]">Hasilpur</option>
                <option value="Chistian" className="bg-[#121212]">Chistian</option>
                <option value="Others" className="bg-[#121212]">Others (Travel/Stay Required)</option>
              </select>
            </div>`;

const deliveryUI = `${venueUI}

            {/* Delivery Method Dropdown */}
            <div>
              <label className="block text-sm uppercase tracking-widest text-white/70 font-semibold mb-3">
                Delivery Method
              </label>
              <select 
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-[#f2a900]/60 transition-colors appearance-none"
              >
                <option value="Cloud" className="bg-[#121212]">Cloud (Google Drive Link)</option>
                <option value="Local Pickup (USB Drive)" className="bg-[#121212]">Local Pickup (USB Drive) + Rs. 2,000</option>
              </select>
            </div>`;

code = code.replace(venueUI, deliveryUI);

fs.writeFileSync('src/components/QuickCalculator.tsx', code);
console.log("QuickCalculator updated with cameras and delivery");
