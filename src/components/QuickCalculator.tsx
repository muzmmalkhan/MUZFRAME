import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function QuickCalculator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [days, setDays] = useState(1);
  const [venue, setVenue] = useState('Hasilpur');
  const [cameras, setCameras] = useState(1);
  const [delivery, setDelivery] = useState('Cloud (Google Drive Link)');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const estimatedPrice = useMemo(() => {
    let total = days * 25000; // Base for 1 camera
    
    if (cameras > 1) {
      total += (cameras - 1) * days * 15000; // Extra per camera per day
    }
    
    if (venue === 'Chistian') total += 10000;
    else if (venue === 'Others') total += 50000;
    
    if (delivery === 'Local Pickup (USB Drive)') total += 2000;
    else if (delivery === 'Cloud (Google Drive Link)') total += 3000;
    
    return total;
  }, [days, cameras, venue, delivery]);

  // Check for pending quote after login
  useEffect(() => {
    if (user && !submitted) {
      const pendingStr = localStorage.getItem('pendingQuote');
      if (pendingStr) {
        try {
          const pendingQuote = JSON.parse(pendingStr);
          if (Date.now() - pendingQuote.time < 1000 * 60 * 60) {
            // It's a recent pending quote, submit it
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
    try {
      await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendQuote = () => {
    const quoteData = {
      days,
      cameras,
      venue,
      delivery,
      estimatedPrice,
      clientName: user?.name || 'Unknown',
      clientPhone: user?.phone || 'Unknown'
    };

    if (!user) {
      // Save to localStorage and go to login
      localStorage.setItem('pendingQuote', JSON.stringify({ data: quoteData, time: Date.now() }));
      navigate('/login?redirect=packages');
      return;
    }

    submitQuote(quoteData);
  };

  return (
    <div className="mt-20 max-w-4xl mx-auto bg-[#0a0a0a] border border-[#f2a900]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(242,169,0,0.1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Calculator className="w-48 h-48 text-[#f2a900]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#f2a900]/20 rounded-xl">
            <Calculator className="w-6 h-6 text-[#f2a900]" />
          </div>
          <div>
            <h2 className="font-serif text-3xl text-white font-medium">Quick Calculator</h2>
            <p className="text-white/50 text-sm mt-1">Get an instant estimated quote based on your requirements.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-8">
            {/* Slider for days */}
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
            </div>

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
            </div>

            {/* Venue Dropdown */}
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
            </div>

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
                <option value="Cloud (Google Drive Link)" className="bg-[#121212]">Cloud (Google Drive Link) + Rs. 3,000</option>
                <option value="Local Pickup (USB Drive)" className="bg-[#121212]">Local Pickup (USB Drive) + Rs. 2,000</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-black/60 border border-[#f2a900]/40 rounded-2xl p-8 text-center backdrop-blur-sm relative">
              <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2">Estimated Price</p>
              <div className="font-serif text-5xl text-white font-bold mb-4">
                <span className="text-2xl text-[#f2a900] font-sans align-top mr-1">Rs.</span>
                {estimatedPrice.toLocaleString()}
              </div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-8">
                *Final price may vary based on exact requirements.
              </p>

              {submitted ? (
                <div className="bg-green-500/20 text-green-400 py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm border border-green-500/30">
                  <CheckCircle2 className="w-5 h-5" /> Quote Submitted!
                </div>
              ) : (
                <button
                  onClick={handleSendQuote}
                  disabled={isSubmitting}
                  className="w-full bg-[#f2a900] hover:bg-white text-black py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(242,169,0,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <>Send Quote <ArrowRight className="w-5 h-5" /></>
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
