import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, ArrowRight, CheckCircle2, Loader2, Camera, Video, Users, Plane, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function QuickCalculator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Events and Days
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['Barat']);
  const [days, setDays] = useState(1);
  
  // Cameras & Equipment
  const [cameraType, setCameraType] = useState<'DSLR' | 'Mirrorless'>('Mirrorless');
  const [cameras, setCameras] = useState(1);
  
  // Additional Sliders: Female Photographer (max 3) & Drone
  const [femalePhotographers, setFemalePhotographers] = useState(0);
  const [drones, setDrones] = useState(0);

  // Venue & Delivery
  const [venue, setVenue] = useState('Hasilpur');
  const [delivery, setDelivery] = useState('Cloud (Google Drive Link)');
  
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

  // Toggle Mehndi, Barat, Walima and sync days
  const toggleEvent = (event: string) => {
    let nextEvents: string[];
    if (selectedEvents.includes(event)) {
      nextEvents = selectedEvents.filter(e => e !== event);
    } else {
      nextEvents = [...selectedEvents, event];
    }
    setSelectedEvents(nextEvents);
    
    // Automatically update days to reflect number of selected events
    if (nextEvents.length > 0) {
      setDays(nextEvents.length);
    } else {
      setDays(1);
    }
  };

  const estimatedPrice = useMemo(() => {
    // Camera base rate
    const cameraBase = cameraType === 'Mirrorless' ? 28000 : 22000;
    const extraCameraRate = cameraType === 'Mirrorless' ? 18000 : 14000;
    
    let total = days * cameraBase;
    if (cameras > 1) {
      total += (cameras - 1) * days * extraCameraRate;
    }

    // Female Photographers rate per day
    if (femalePhotographers > 0) {
      total += femalePhotographers * days * 15000;
    }

    // Drone cameras rate per day
    if (drones > 0) {
      total += drones * days * 12000;
    }
    
    if (venue === 'Chistian') total += 10000;
    else if (venue === 'Others') total += 50000;
    
    if (delivery === 'Local Pickup (USB Drive)') total += 2000;
    else if (delivery === 'Cloud (Google Drive Link)') total += 3000;
    
    return total;
  }, [days, cameras, cameraType, femalePhotographers, drones, venue, delivery]);

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
      setFormError('Baraye meharbani apna Naam darj karein.');
      return;
    }
    if (!finalPhone || finalPhone.length < 7) {
      setFormError('Baraye meharbani apna Mobile / WhatsApp number darj karein.');
      return;
    }

    setFormError('');

    const quoteData = {
      days,
      events: selectedEvents,
      cameraType,
      cameras,
      femalePhotographers,
      drones,
      venue,
      delivery,
      estimatedPrice,
      clientName: finalName,
      clientPhone: finalPhone,
      userId: user?.id || null
    };

    submitQuote(quoteData);
  };

  return (
    <div className="mt-20 max-w-5xl mx-auto bg-[#0a0a0a] border border-[#f2a900]/30 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_0_50px_rgba(242,169,0,0.1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Calculator className="w-56 h-56 text-[#f2a900]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#f2a900]/20 rounded-xl">
            <Calculator className="w-6 h-6 text-[#f2a900]" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">Quick Wedding Calculator</h2>
            <p className="text-white/60 text-xs sm:text-sm mt-1">Shoot days, cameras, female crew aur aerial drone select karein aur instant estimated quotation hasil karein.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* 1. Multi-Select Events & Shoot Days */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs uppercase tracking-widest text-white/70 font-semibold">
                  Wedding Events Select Karein
                </label>
                <div className="bg-[#f2a900]/20 border border-[#f2a900]/40 px-2.5 py-1 rounded-full text-xs font-bold text-[#f2a900] flex items-center gap-1.5 shadow-sm">
                  <span>{days} {days === 1 ? 'Din Ka Shoot' : 'Dino Ka Shoot'}</span>
                </div>
              </div>

              {/* Three multi-select buttons: Mehndi, Barat, Walima */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                {(['Mehndi', 'Barat', 'Walima'] as const).map((evt) => {
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

              {/* Slider for days with dynamic display */}
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-2">
                  <span>Shoot Days (Dino Ki Tadaad)</span>
                  <span className="text-white font-medium">
                    {days} {days === 1 ? 'Day' : 'Days'}
                    {selectedEvents.length > 0 && ` (${selectedEvents.join(' + ')})`}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="7" 
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full accent-[#f2a900] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/40 mt-1">
                  <span>1 Din</span>
                  <span>3 Din</span>
                  <span>5 Din</span>
                  <span>7 Din</span>
                </div>
              </div>
            </div>

            {/* 2. Camera Type & Number of Cameras */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest text-white/70 font-semibold">
                  Camera Equipment (DSLR ya Mirrorless)
                </label>
                <span className="text-[11px] text-[#f2a900] font-medium">
                  {cameraType === 'Mirrorless' ? 'Cinematic 4K 10-Bit' : 'Professional Full Frame'}
                </span>
              </div>

              {/* DSLR or Mirrorless Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCameraType('DSLR')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    cameraType === 'DSLR'
                      ? 'bg-[#f2a900] text-black border-[#f2a900] shadow-[0_0_15px_rgba(242,169,0,0.3)]'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  DSLR Camera
                </button>
                <button
                  type="button"
                  onClick={() => setCameraType('Mirrorless')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    cameraType === 'Mirrorless'
                      ? 'bg-[#f2a900] text-black border-[#f2a900] shadow-[0_0_15px_rgba(242,169,0,0.3)]'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Mirrorless Camera
                </button>
              </div>

              {/* Number of Cameras Slider */}
              <div className="pt-1">
                <div className="flex justify-between text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">
                  <span>Number of {cameraType} Cameras (Kitne Cameras Chahiyein)</span>
                  <span className="text-[#f2a900] font-bold">{cameras} {cameras === 1 ? 'Camera' : 'Cameras'}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={cameras}
                  onChange={(e) => setCameras(parseInt(e.target.value))}
                  className="w-full accent-[#f2a900] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/40 mt-1">
                  <span>1 Camera (Solo)</span>
                  <span>3 Multi-Angle</span>
                  <span>5 Production Setup</span>
                </div>
              </div>
            </div>

            {/* 3. Slider: Female Photographer (Max 3) */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-white/70 font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-pink-400" />
                  Female Photographer (Khawateen Crew - Max 3)
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  femalePhotographers > 0 ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'text-white/40'
                }`}>
                  {femalePhotographers === 0 
                    ? '0 (Nahi Chahiye)' 
                    : `${femalePhotographers} Female ${femalePhotographers === 1 ? 'Staff' : 'Staffs'}`}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="3" 
                value={femalePhotographers}
                onChange={(e) => setFemalePhotographers(parseInt(e.target.value))}
                className="w-full accent-pink-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>0 (None)</span>
                <span>1 Female Staff</span>
                <span>2 Female Staff</span>
                <span>3 Females (Max)</span>
              </div>
              <p className="text-[11px] text-white/40 mt-2">
                Dulhan ki tayyari, family portraits aur private ladies hall ke liye dedicated female photographers.
              </p>
            </div>

            {/* 4. Slider: Drone Camera */}
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-white/70 font-semibold flex items-center gap-2">
                  <Plane className="w-4 h-4 text-cyan-400" />
                  Drone Camera (Aerial 4K Shots)
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  drones > 0 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/40'
                }`}>
                  {drones === 0 ? '0 (No Drone)' : `${drones} Drone ${drones === 1 ? 'Operator' : 'Operators'}`}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="2" 
                value={drones}
                onChange={(e) => setDrones(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>0 (Nahi)</span>
                <span>1 Drone Unit (Baraat Entry)</span>
                <span>2 Drone Units (Dual Pilot)</span>
              </div>
              <p className="text-[11px] text-white/40 mt-2">
                Baraat arrival, fireworks aur grand venue entry ke cinematic 4K hawaai shots.
              </p>
            </div>

            {/* Venue & Delivery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">
                  Venue Location (City)
                </label>
                <select 
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#f2a900]/60 transition-colors"
                >
                  <option value="Hasilpur" className="bg-[#121212]">Hasilpur (Local Shoot)</option>
                  <option value="Chistian" className="bg-[#121212]">Chistian (+ Rs. 10k)</option>
                  <option value="Others" className="bg-[#121212]">Others (Outstation + Rs. 50k)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">
                  Delivery Method
                </label>
                <select 
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#f2a900]/60 transition-colors"
                >
                  <option value="Cloud (Google Drive Link)" className="bg-[#121212]">Cloud (Google Drive Link) + Rs. 3,000</option>
                  <option value="Local Pickup (USB Drive)" className="bg-[#121212]">USB Drive Pickup + Rs. 2,000</option>
                </select>
              </div>
            </div>

          </div>

          {/* Price & Summary Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-black/70 border border-[#f2a900]/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <span className="text-white/60 text-xs uppercase tracking-widest font-bold">Quotation Estimate</span>
                  <span className="bg-[#f2a900]/20 text-[#f2a900] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Instant Calculation
                  </span>
                </div>

                <div className="font-serif text-4xl sm:text-5xl text-white font-bold mb-2">
                  <span className="text-xl sm:text-2xl text-[#f2a900] font-sans align-top mr-1">Rs.</span>
                  {estimatedPrice.toLocaleString()}
                </div>
                <p className="text-white/40 text-[11px] uppercase tracking-wider mb-6">
                  *Aapke select kiye gaye setup aur crew ke mutabiq estimated budget.
                </p>

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
                    <span className="font-semibold text-[#f2a900]">{days} {days === 1 ? 'Din (1 Day)' : `${days} Din`}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Camera Setup:</span>
                    <span className="font-semibold text-white">{cameras}x {cameraType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Female Photographer:</span>
                    <span className={`font-semibold ${femalePhotographers > 0 ? 'text-pink-300' : 'text-white/40'}`}>
                      {femalePhotographers > 0 ? `${femalePhotographers} Female Staff` : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Drone Coverage:</span>
                    <span className={`font-semibold ${drones > 0 ? 'text-cyan-300' : 'text-white/40'}`}>
                      {drones > 0 ? `${drones} Drone Unit(s)` : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Location:</span>
                    <span className="font-semibold text-white">{venue}</span>
                  </div>
                </div>

                {/* Contact Inputs */}
                {!submitted && (
                  <div className="space-y-3 mb-6 bg-white/[0.03] border border-white/10 p-4 rounded-xl">
                    <p className="text-[11px] uppercase tracking-wider text-[#f2a900] font-semibold">
                      Aapki Rabta Tafseelat (Your Contact Details)
                    </p>
                    <div>
                      <input
                        type="text"
                        placeholder="Aapka Naam (e.g. Ali Khan)"
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
                      <CheckCircle2 className="w-5 h-5" /> Quote Kamiyabi Se Send Ho Gayi!
                    </div>
                    <p className="text-xs text-white/70">
                      Aapki quote request Admin Panel ke <strong>Quotes</strong> section mein receive ho chuki hai. Hamari team foran aapse rabta karegi.
                    </p>
                  </div>

                  {submittedQuoteData && (
                    <a
                      href={`https://wa.me/923006103262?text=${encodeURIComponent(
                        `Assalam-o-Alaikum MuzFrame Studio! Main ne website par quote calculate ki hai:\n\n*Name:* ${submittedQuoteData.clientName}\n*Phone:* ${submittedQuoteData.clientPhone}\n*Events:* ${submittedQuoteData.events?.join(', ') || 'Custom'}\n*Days:* ${submittedQuoteData.days}\n*Cameras:* ${submittedQuoteData.cameras} (${submittedQuoteData.cameraType})\n*Female Staff:* ${submittedQuoteData.femalePhotographers}\n*Drone:* ${submittedQuoteData.drones}\n*Estimated:* Rs. ${Number(submittedQuoteData.estimatedPrice || 0).toLocaleString()}\n\nBaraye meharbani booking confirmation provide karein.`
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
                    Nayi Quote Calculate Karein
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
                    <><Loader2 className="w-5 h-5 animate-spin" /> Process Ho Raha Hai...</>
                  ) : (
                    <>Ye Package Request Karein <ArrowRight className="w-5 h-5" /></>
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

