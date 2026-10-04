import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, ArrowRight, CheckCircle2, Loader2, Camera, Video, Users, Plane, Check, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RATE_MIRRORLESS = 10000;
const RATE_DSLR = 7000;
const RATE_FEMALE_PHOTOGRAPHER = 10000;
const RATE_DRONE = 5000;
const RATE_INDIAN_ALBUM_1 = 12000;
const RATE_INDIAN_ALBUM_2 = 22000; // Special bundle discount on 2

const STANDARD_EVENTS = ['Mehndi', 'Barat', 'Walima'];

export function QuickCalculator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Events and Days (1 to 5 days)
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['Barat']);
  const [days, setDays] = useState(1);
  
  // Equipment Sliders
  // 1 Mirrorless = 10000, DSLR = 7000, Female Photographer = 10000, Drone = 5000
  const [mirrorlessCameras, setMirrorlessCameras] = useState(1);
  const [dslrCameras, setDslrCameras] = useState(0);
  const [femalePhotographers, setFemalePhotographers] = useState(0);
  const [drones, setDrones] = useState(0);
  const [indianAlbums, setIndianAlbums] = useState(0);

  // Venue
  const [venue, setVenue] = useState('Hasilpur');
  
  // Client contact information for quote submission
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [formError, setFormError] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedQuoteData, setSubmittedQuoteData] = useState<any>(null);

  // Sync with user context if user logs in
  useEffect(() => {
    if (user) {
      if (!contactName) setContactName(user.name || '');
      if (!contactPhone) setContactPhone(user.phone || '');
    }
  }, [user]);

  // Toggle Mehndi, Barat, Walima buttons and accurately sync with days
  const toggleEvent = (event: string) => {
    let nextEvents: string[];
    if (selectedEvents.includes(event)) {
      // If clicking already selected event, remove it (keep at least 1 event selected)
      if (selectedEvents.length === 1) {
        return; // Don't allow 0 events
      }
      nextEvents = selectedEvents.filter(e => e !== event);
    } else {
      nextEvents = [...selectedEvents, event];
    }
    
    // Sort in natural order: Mehndi -> Barat -> Walima
    nextEvents.sort((a, b) => STANDARD_EVENTS.indexOf(a) - STANDARD_EVENTS.indexOf(b));
    setSelectedEvents(nextEvents);
    setDays(nextEvents.length);
  };

  // Slider change handler for Days (1 to 5):
  // Deterministic lockstep:
  // 1 -> Barat
  // 2 -> Mehndi, Barat
  // 3 -> Mehndi, Barat, Walima
  // 4 -> Mehndi, Barat, Walima (+ 1 Extra Day)
  // 5 -> Mehndi, Barat, Walima (+ 2 Extra Days)
  const handleDaysChange = (newDays: number) => {
    const clamped = Math.max(1, Math.min(5, newDays));
    setDays(clamped);

    if (clamped >= 3) {
      setSelectedEvents(['Mehndi', 'Barat', 'Walima']);
    } else if (clamped === 2) {
      setSelectedEvents(['Mehndi', 'Barat']);
    } else {
      setSelectedEvents(['Barat']);
    }
  };

  const totalCameras = mirrorlessCameras + dslrCameras;

  // Calculation logic based on user's exact rates:
  // Mirrorless: Rs. 10,000 / day
  // DSLR: Rs. 7,000 / day
  // Female Photographer: Rs. 10,000 / day
  // Drone: 0 = No Drone (Rs. 0), 1 = Barat (Rs. 5,000), 2 = Walima (Rs. 5,000), 3 = Barat & Walima (Rs. 10,000)
  // Indian Album: 1 = Rs. 12,000, 2 = Rs. 22,000 (Rs. 2,000 bundle discount!), 3 = Rs. 32,000 (Save Rs. 4,000!)
  // Chistian: Rs. 5,000 extra
  // Others: Travel charges depend on distance (informed on contact)
  const indianAlbumCost = useMemo(() => {
    if (indianAlbums === 1) return RATE_INDIAN_ALBUM_1;
    if (indianAlbums === 2) return RATE_INDIAN_ALBUM_2; // Rs. 2,000 discount
    if (indianAlbums >= 3) return RATE_INDIAN_ALBUM_2 + (indianAlbums - 2) * 10000;
    return 0;
  }, [indianAlbums]);

  const estimatedPrice = useMemo(() => {
    const dailyEquipmentRate = 
      (mirrorlessCameras * RATE_MIRRORLESS) +
      (dslrCameras * RATE_DSLR) +
      (femalePhotographers * RATE_FEMALE_PHOTOGRAPHER);
    
    const droneCost = drones === 1 ? 5000 : drones === 2 ? 5000 : drones === 3 ? 10000 : 0;
    
    let total = (dailyEquipmentRate * days) + droneCost + indianAlbumCost;

    // Chistian is Rs. 5,000 extra
    // Others depends on distance (informed to client according to distance, +0 base)
    if (venue === 'Chistian') {
      total += 5000;
    }
    
    return total;
  }, [days, mirrorlessCameras, dslrCameras, femalePhotographers, drones, indianAlbumCost, venue]);

  // Check for pending quote after login
  useEffect(() => {
    if (user && !submitted) {
      const pendingStr = localStorage.getItem('pendingQuote');
      if (pendingStr) {
        try {
          const pendingQuote = JSON.parse(pendingStr);
          if (Date.now() - pendingQuote.time < 1000 * 60 * 60) {
            submitQuote(pendingQuote.data);
          }
          localStorage.removeItem('pendingQuote');
        } catch (e) {
          localStorage.removeItem('pendingQuote');
        }
      }
    }
  }, [user, submitted]);

  const submitQuote = async (quoteData: any) => {
    setIsSubmitting(true);
    setFormError('');
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });
      if (res.ok) {
        setSubmittedQuoteData(quoteData);
        setSubmitted(true);
      } else {
        throw new Error('Failed to send quote');
      }
    } catch (err) {
      console.error(err);
      setFormError('Quote send nahi ho saki. Baraye meharbani dobara koshish karein.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendQuote = () => {
    const finalName = contactName.trim() || user?.name || '';
    const finalPhone = contactPhone.trim() || user?.phone || '';

    if (!finalName) {
      setFormError('Baraye meharbani apna Name darj karein.');
      return;
    }
    if (!finalPhone || finalPhone.length < 7) {
      setFormError('Baraye meharbani apna Mobile / WhatsApp number darj karein.');
      return;
    }

    if (totalCameras === 0) {
      setFormError('Please select at least 1 camera (Mirrorless or DSLR).');
      return;
    }

    setFormError('');

    let cameraTypeDesc = '';
    if (mirrorlessCameras > 0 && dslrCameras > 0) {
      cameraTypeDesc = `${mirrorlessCameras}x Mirrorless + ${dslrCameras}x DSLR`;
    } else if (mirrorlessCameras > 0) {
      cameraTypeDesc = `${mirrorlessCameras}x Mirrorless`;
    } else {
      cameraTypeDesc = `${dslrCameras}x DSLR`;
    }

    const droneCoverageDesc = 
      drones === 0 ? 'No Drone' : 
      drones === 1 ? 'Barat (Rs. 5,000)' : 
      drones === 2 ? 'Walima (Rs. 5,000)' : 
      'Barat & Walima (Rs. 10,000)';

    const quoteData = {
      days,
      events: selectedEvents,
      mirrorless: mirrorlessCameras,
      dslr: dslrCameras,
      cameraType: cameraTypeDesc,
      cameras: totalCameras,
      femalePhotographers,
      drones,
      droneCoverage: droneCoverageDesc,
      indianAlbums,
      indianAlbumCost,
      venue,
      delivery: 'Cloud (Google Drive Link)',
      estimatedPrice,
      clientName: finalName,
      clientPhone: finalPhone,
      userId: user?.id || null
    };

    submitQuote(quoteData);
  };

  return (
    <div className="max-w-5xl mx-auto bg-[#0a0a0a] border border-[#f2a900]/30 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_0_50px_rgba(242,169,0,0.1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Calculator className="w-56 h-56 text-[#f2a900]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#f2a900]/20 rounded-xl">
            <Calculator className="w-6 h-6 text-[#f2a900]" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">Quick Wedding Calculator</h2>
            <p className="text-white/60 text-xs sm:text-sm mt-1">
              Select events, cameras, female crew and drone to get an instant quotation estimate.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* 1. Multi-Select Events & Shoot Days */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs uppercase tracking-widest text-white/70 font-semibold">
                  Select Wedding Events
                </label>
                <div className="bg-[#f2a900]/20 border border-[#f2a900]/40 px-2.5 py-1 rounded-full text-xs font-bold text-[#f2a900] flex items-center gap-1.5 shadow-sm">
                  <span>{days} {days === 1 ? 'Day Shoot' : 'Days Shoot'}</span>
                </div>
              </div>

              {/* Three multi-select buttons: Mehndi, Barat, Walima */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                {(STANDARD_EVENTS as readonly string[]).map((evt) => {
                  const isSelected = selectedEvents.includes(evt);
                  return (
                    <button
                      key={evt}
                      type="button"
                      onClick={() => toggleEvent(evt)}
                      className={`py-3 px-2 sm:px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#f2a900] text-black border-[#f2a900] shadow-[0_0_15px_rgba(242,169,0,0.35)] scale-[1.02]'
                          : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                      {evt}
                    </button>
                  );
                })}
              </div>

              {/* Slider for days (Max 5 Days) - synced bidirectionally with buttons */}
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-2">
                  <span>Shoot Days</span>
                  <span className="text-white font-medium">
                    {days} {days === 1 ? 'Day' : 'Days'}
                    {days <= 3 && selectedEvents.length > 0 && ` (${selectedEvents.join(' + ')})`}
                    {days === 4 && ` (${selectedEvents.join(' + ')} + 1 Extra Day)`}
                    {days === 5 && ` (${selectedEvents.join(' + ')} + 2 Extra Days)`}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={days}
                  onChange={(e) => handleDaysChange(parseInt(e.target.value, 10))}
                  className="w-full accent-[#f2a900] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/40 mt-1">
                  <span>1 Day</span>
                  <span>2 Days</span>
                  <span>3 Days</span>
                  <span>4 Days</span>
                  <span>5 Days</span>
                </div>
              </div>
            </div>

            {/* 2. Mirrorless Camera Slider (Rs. 10,000 / Day) */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-white/80 font-semibold flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#f2a900]" />
                  Mirrorless Camera (4K Cinematic)
                </span>
                <span className="bg-[#f2a900]/15 text-[#f2a900] border border-[#f2a900]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Rs. 10,000 / Day
                </span>
              </div>
              <p className="text-[11px] text-white/50 mb-3">
                Sony FX3 / A7IV cinematic 4K video aur royal portrait coverage.
              </p>
              
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="4" 
                  value={mirrorlessCameras}
                  onChange={(e) => setMirrorlessCameras(parseInt(e.target.value, 10))}
                  className="w-full accent-[#f2a900] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="min-w-[70px] text-right font-bold text-sm text-[#f2a900]">
                  {mirrorlessCameras} {mirrorlessCameras === 1 ? 'Unit' : 'Units'}
                </div>
              </div>

              {/* Quick count buttons */}
              <div className="flex gap-2 mt-2.5">
                {[0, 1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setMirrorlessCameras(count)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                      mirrorlessCameras === count 
                        ? 'bg-[#f2a900] text-black font-bold' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {count === 0 ? '0' : `${count}`}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. DSLR Camera Slider (Rs. 7,000 / Day) */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-white/80 font-semibold flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  DSLR Camera (Traditional Full Frame)
                </span>
                <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Rs. 7,000 / Day
                </span>
              </div>
              <p className="text-[11px] text-white/50 mb-3">
                Canon / Nikon full-frame stage portraits aur traditional event coverage.
              </p>
              
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="4" 
                  value={dslrCameras}
                  onChange={(e) => setDslrCameras(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="min-w-[70px] text-right font-bold text-sm text-amber-400">
                  {dslrCameras} {dslrCameras === 1 ? 'Unit' : 'Units'}
                </div>
              </div>

              {/* Quick count buttons */}
              <div className="flex gap-2 mt-2.5">
                {[0, 1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setDslrCameras(count)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                      dslrCameras === count 
                        ? 'bg-amber-400 text-black font-bold' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {count === 0 ? '0' : `${count}`}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Slider: Female Photographer (Rs. 10,000 / Day - Max 3) */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-white/80 font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-pink-400" />
                  Female Photographer (Khawateen Crew)
                </span>
                <span className="bg-pink-500/15 text-pink-300 border border-pink-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Rs. 10,000 / Day
                </span>
              </div>
              <p className="text-[11px] text-white/50 mb-3">
                Dulhan ki tayyari, family portraits aur private ladies hall ke liye dedicated female photographers.
              </p>
              
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="3" 
                  value={femalePhotographers}
                  onChange={(e) => setFemalePhotographers(parseInt(e.target.value, 10))}
                  className="w-full accent-pink-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="min-w-[70px] text-right font-bold text-sm text-pink-300">
                  {femalePhotographers} {femalePhotographers === 1 ? 'Staff' : 'Staffs'}
                </div>
              </div>

              {/* Quick count buttons */}
              <div className="flex gap-2 mt-2.5">
                {[0, 1, 2, 3].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFemalePhotographers(count)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                      femalePhotographers === count 
                        ? 'bg-pink-500 text-white font-bold' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {count === 0 ? 'None (0)' : `${count} Female`}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Drone Camera Section (0: No Drone, 1: Barat, 2: Walima, 3: Barat & Walima) */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-white/80 font-semibold flex items-center gap-2">
                  <Plane className="w-4 h-4 text-cyan-400" />
                  Drone Camera (Aerial 4K Shots)
                </span>
                <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {drones === 0 ? '0 No Drone' : drones === 1 ? 'Barat (+Rs. 5,000)' : drones === 2 ? 'Walima (+Rs. 5,000)' : 'Barat & Walima (+Rs. 10,000)'}
                </span>
              </div>
              <p className="text-[11px] text-white/50 mb-3">
                Cinematic aerial 4K shots for bridal entry, fireworks aur venue views.
              </p>
              
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="3" 
                  value={drones}
                  onChange={(e) => setDrones(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="min-w-[130px] text-right font-bold text-xs sm:text-sm text-cyan-300">
                  {drones === 0 ? '0 No Drone' : drones === 1 ? 'Barat (Rs. 5k)' : drones === 2 ? 'Walima (Rs. 5k)' : 'Barat & Walima (10k)'}
                </div>
              </div>

              {/* Options: 0 No Drone, Barat, Walima, Barat & Walima */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                {[
                  { val: 0, label: '0 No Drone', priceTag: 'Rs. 0' },
                  { val: 1, label: 'Barat', priceTag: 'Rs. 5,000' },
                  { val: 2, label: 'Walima', priceTag: 'Rs. 5,000' },
                  { val: 3, label: 'Barat & Walima', priceTag: 'Rs. 10,000' }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setDrones(opt.val)}
                    className={`py-2 px-2 rounded-xl text-[11px] transition-all flex flex-col items-center justify-center cursor-pointer ${
                      drones === opt.val 
                        ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.35)]' 
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <span className={`text-[10px] ${drones === opt.val ? 'text-black/80 font-bold' : 'text-cyan-400/80'}`}>{opt.priceTag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Indian Photobook / Album Section (1 = Rs. 12,000, 2 = Rs. 22,000 with discount) */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-white/80 font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Royal Indian Album (Printed Photobook)
                </span>
                <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {indianAlbums === 0 
                    ? 'None (Rs. 0)' 
                    : indianAlbums === 1 
                    ? '1 Album (Rs. 12,000)' 
                    : indianAlbums === 2 
                    ? '2 Albums (Rs. 22,000 • Save Rs. 2,000!)' 
                    : `${indianAlbums} Albums (Rs. ${indianAlbumCost.toLocaleString()} • Save Rs. 4,000!)`}
                </span>
              </div>
              <p className="text-[11px] text-white/50 mb-3">
                High-end crystal acrylic / leather cover with rigid lay-flat pages, metallic sheet printing & presentation box.
              </p>
              
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="3" 
                  value={indianAlbums}
                  onChange={(e) => setIndianAlbums(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-400 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="min-w-[130px] text-right font-bold text-xs sm:text-sm text-emerald-300">
                  {indianAlbums === 0 
                    ? 'None (0)' 
                    : indianAlbums === 1 
                    ? '1 Album (12k)' 
                    : indianAlbums === 2 
                    ? '2 Albums (22k ⭐)' 
                    : `${indianAlbums} Albums (${(indianAlbumCost/1000).toFixed(0)}k)`}
                </div>
              </div>

              {/* Options: 0 None, 1 Album (12k), 2 Albums (22k Discount), 3 Albums */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                {[
                  { val: 0, label: 'None (0)', priceTag: 'Rs. 0', discountTag: null },
                  { val: 1, label: '1 Album', priceTag: 'Rs. 12,000', discountTag: 'Regular' },
                  { val: 2, label: '2 Albums', priceTag: 'Rs. 22,000', discountTag: 'Save Rs. 2,000' },
                  { val: 3, label: '3 Albums', priceTag: 'Rs. 32,000', discountTag: 'Save Rs. 4,000' }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setIndianAlbums(opt.val)}
                    className={`py-2 px-2 rounded-xl text-[11px] transition-all flex flex-col items-center justify-center cursor-pointer relative ${
                      indianAlbums === opt.val 
                        ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.35)]' 
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <span className={`text-[10px] ${indianAlbums === opt.val ? 'text-black/80 font-bold' : 'text-emerald-400/90'}`}>{opt.priceTag}</span>
                    {opt.discountTag && (
                      <span className={`text-[9px] px-1.5 py-0.5 mt-0.5 rounded-md font-medium ${
                        indianAlbums === opt.val 
                          ? 'bg-black/20 text-black font-bold' 
                          : opt.val >= 2 ? 'bg-emerald-400/20 text-emerald-300' : 'text-white/40'
                      }`}>
                        {opt.discountTag}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Venue Location (City) */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl">
              <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">
                Shoot Venue Location (City)
              </label>
              <select 
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#f2a900]/60 transition-colors cursor-pointer"
              >
                <option value="Hasilpur" className="bg-[#121212]">Hasilpur (Local Shoot - Rs. 0 Extra)</option>
                <option value="Chistian" className="bg-[#121212]">Chistian (+ Rs. 5,000 Travel)</option>
                <option value="Others" className="bg-[#121212]">Others (Travel Charges Depend on Distance)</option>
              </select>

              {venue === 'Others' && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs flex items-start gap-2.5">
                  <span className="text-base leading-none">📍</span>
                  <div className="leading-relaxed">
                    <strong className="text-amber-200">Outstation Shoot:</strong> Hasilpur aur Chistian ke ilawa doosre cities ke travel charges exact distance (faslay) ke mutabiq rabta par tay kiye jayenge.
                  </div>
                </div>
              )}
            </div>

            {totalCameras === 0 && (
              <div className="text-amber-400 text-xs bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center gap-2">
                <span>⚠️ Baraye meharbani kam az kam 1 Mirrorless ya DSLR camera zaroor select karein.</span>
              </div>
            )}

          </div>

          {/* Price & Summary Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-black/70 border border-[#f2a900]/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <span className="text-white/60 text-xs uppercase tracking-widest font-bold">Quotation Estimate</span>
                  <span className="bg-[#f2a900]/20 text-[#f2a900] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Transparent Rates
                  </span>
                </div>

                <div className="font-serif text-4xl sm:text-5xl text-white font-bold mb-2">
                  <span className="text-xl sm:text-2xl text-[#f2a900] font-sans align-top mr-1">Rs.</span>
                  {estimatedPrice.toLocaleString()}
                </div>
                <p className="text-white/40 text-[11px] uppercase tracking-wider mb-4">
                  *Mirrorless (Rs. 10k), DSLR (Rs. 7k), Female Staff (Rs. 10k), Drone (Rs. 5k) / Day.
                </p>

                {venue === 'Others' && (
                  <p className="text-amber-300 text-xs mb-5 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
                    + Distance ke mutabiq travel charges rabta par bata diye jayenge.
                  </p>
                )}

                {/* Selected Spec Overview */}
                <div className="space-y-2.5 bg-white/5 border border-white/10 p-4 rounded-xl mb-6 text-xs text-white/80">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Events:</span>
                    <span className="font-semibold text-white">
                      {selectedEvents.length > 0 ? selectedEvents.join(', ') : 'Custom Shoot'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Duration:</span>
                    <span className="font-semibold text-[#f2a900]">{days} {days === 1 ? 'Day' : 'Days'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Mirrorless (Rs. 10k):</span>
                    <span className={`font-semibold ${mirrorlessCameras > 0 ? 'text-[#f2a900]' : 'text-white/40'}`}>
                      {mirrorlessCameras > 0 ? `${mirrorlessCameras}x Unit(s) (Rs. ${(mirrorlessCameras * RATE_MIRRORLESS * days).toLocaleString()})` : '0 (None)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">DSLR (Rs. 7k):</span>
                    <span className={`font-semibold ${dslrCameras > 0 ? 'text-amber-300' : 'text-white/40'}`}>
                      {dslrCameras > 0 ? `${dslrCameras}x Unit(s) (Rs. ${(dslrCameras * RATE_DSLR * days).toLocaleString()})` : '0 (None)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Female Crew (Rs. 10k):</span>
                    <span className={`font-semibold ${femalePhotographers > 0 ? 'text-pink-300' : 'text-white/40'}`}>
                      {femalePhotographers > 0 ? `${femalePhotographers} Staff (Rs. ${(femalePhotographers * RATE_FEMALE_PHOTOGRAPHER * days).toLocaleString()})` : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Drone Coverage:</span>
                    <span className={`font-semibold ${drones > 0 ? 'text-cyan-300' : 'text-white/40'}`}>
                      {drones === 0 ? '0 No Drone' : drones === 1 ? 'Barat (Rs. 5,000)' : drones === 2 ? 'Walima (Rs. 5,000)' : 'Barat & Walima (Rs. 10,000)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Indian Album:</span>
                    <span className={`font-semibold ${indianAlbums > 0 ? 'text-emerald-400' : 'text-white/40'}`}>
                      {indianAlbums === 0 
                        ? 'None' 
                        : indianAlbums === 1 
                        ? '1 Album (Rs. 12,000)' 
                        : `${indianAlbums} Albums (Rs. ${indianAlbumCost.toLocaleString()}${indianAlbums === 2 ? ' • Save Rs. 2k' : ''})`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Location:</span>
                    <span className="font-semibold text-white">
                      {venue === 'Hasilpur' 
                        ? 'Hasilpur (Local Shoot)' 
                        : venue === 'Chistian' 
                        ? 'Chistian (+ Rs. 5,000)' 
                        : 'Others (Distance Ke Mutabiq)'}
                    </span>
                  </div>
                </div>

                {/* Contact Inputs */}
                {!submitted && (
                  <div className="space-y-3 mb-6 bg-white/[0.03] border border-white/10 p-4 rounded-xl">
                    <p className="text-[11px] uppercase tracking-wider text-[#f2a900] font-semibold">
                      Your Contact Details (Rabta Tafseelat)
                    </p>
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Ali Khan)"
                        value={contactName}
                        onChange={(e) => { setContactName(e.target.value); setFormError(''); }}
                        className="w-full bg-black/40 border border-white/10 focus:border-[#f2a900] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="WhatsApp / Mobile Number (e.g. 0300 6103262)"
                        value={contactPhone}
                        onChange={(e) => { setContactPhone(e.target.value); setFormError(''); }}
                        className="w-full bg-black/40 border border-white/10 focus:border-[#f2a900] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                      />
                    </div>
                    {formError && (
                      <p className="text-red-400 text-xs mt-1">{formError}</p>
                    )}
                  </div>
                )}
              </div>

              {submitted ? (
                <div className="space-y-4">
                  <div className="bg-green-500/20 text-green-300 py-4 px-5 rounded-xl border border-green-500/30 text-center">
                    <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm mb-1 text-green-400">
                      <CheckCircle2 className="w-5 h-5" /> Quote Sent Successfully!
                    </div>
                    <p className="text-xs text-white/70">
                      Aapki quote request receive ho chuki hai. Hamari team foran aapse rabta karegi.
                    </p>
                  </div>

                  {submittedQuoteData && (
                    <a
                      href={`https://wa.me/923006103262?text=${encodeURIComponent(
                        `Assalam-o-Alaikum MuzFrame Studio! Main ne website calculator se quotation banayi hai:\n\n*Name:* ${submittedQuoteData.clientName}\n*Phone:* ${submittedQuoteData.clientPhone}\n*Events:* ${submittedQuoteData.events?.join(', ') || 'Custom'}\n*Days:* ${submittedQuoteData.days} Days\n*Mirrorless Cameras (Rs. 10k/day):* ${submittedQuoteData.mirrorless || 0}\n*DSLR Cameras (Rs. 7k/day):* ${submittedQuoteData.dslr || 0}\n*Female Crew (Rs. 10k/day):* ${submittedQuoteData.femalePhotographers || 0}\n*Drone:* ${submittedQuoteData.droneCoverage || (submittedQuoteData.drones === 1 ? 'Barat (Rs. 5,000)' : submittedQuoteData.drones === 2 ? 'Walima (Rs. 5,000)' : submittedQuoteData.drones === 3 ? 'Barat & Walima (Rs. 10,000)' : 'No Drone')}\n*Indian Album:* ${submittedQuoteData.indianAlbums > 0 ? `${submittedQuoteData.indianAlbums}x Album (Rs. ${(submittedQuoteData.indianAlbumCost || 0).toLocaleString()}${submittedQuoteData.indianAlbums === 2 ? ' • Special Discount' : ''})` : 'None'}\n*City:* ${submittedQuoteData.venue}${submittedQuoteData.venue === 'Others' ? ' (Distance ke mutabiq travel charges tay honge)' : submittedQuoteData.venue === 'Chistian' ? ' (+ Rs. 5,000 travel)' : ''}\n*Estimated Price:* Rs. ${Number(submittedQuoteData.estimatedPrice || 0).toLocaleString()}\n\nBaraye meharbani booking details confirm karein.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold uppercase tracking-wider text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#25D366]/20"
                    >
                      WhatsApp Par Direct Send Karein
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setSubmittedQuoteData(null); }}
                    className="w-full text-center text-white/50 hover:text-white text-xs underline cursor-pointer py-1"
                  >
                    Calculate Another Quote
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSendQuote}
                  disabled={isSubmitting}
                  className="w-full bg-[#f2a900] hover:bg-white text-black py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-[0_0_25px_rgba(242,169,0,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <>Request This Quote <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
