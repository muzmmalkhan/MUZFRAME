const fs = require('fs');

let content = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf-8');

// 1. Add new state variables for booking form
content = content.replace(
  "const [bookingLocation, setBookingLocation] = useState('');",
  `const [bookingLocation, setBookingLocation] = useState('');
  const [bookingEmail, setBookingEmail] = useState(user?.email || '');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEventType, setBookingEventType] = useState('');`
);

// 2. Change hasBookedEvent
content = content.replace(
  "const hasBookedEvent = !!clientData || !!user?.hasBookedEvent;",
  `const hasBookedEvent = !!eventData && clientData?.eventName !== 'Pending Booking';`
);

// 3. Move booking button to be second
const buttonsBlock = `
            <button 
              onClick={() => setActiveTab('gallery')}
              className={\`pb-3 font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors relative \${activeTab === 'gallery' ? 'text-[#f2a900]' : 'text-white/50 hover:text-white'}\`}
            >
              <ImageIcon className="w-4 h-4" /> Private Collection Gallery
              {activeTab === 'gallery' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2a900]" />}
            </button>
            <button 
              onClick={() => setActiveTab('booking')}
              className={\`pb-3 font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors relative \${activeTab === 'booking' ? 'text-[#f2a900]' : 'text-white/50 hover:text-white'}\`}
            >
              <Calendar className="w-4 h-4" /> New Booking
              {activeTab === 'booking' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2a900]" />}
            </button>
`;
// We will use replace with string functions manually.
