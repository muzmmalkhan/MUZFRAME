import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Flame, Award, Building2, Star, Calendar, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BrandStory {
  id: string;
  name: string;
  category: string;
  tagline: string;
  highlight: string;
  scope: string;
  bgImage: string;
  stat: string;
  statLabel: string;
  accent: string;
}

const BRANDS: BrandStory[] = [
  {
    id: 'bajwas',
    name: 'Bajwas Collection',
    category: 'Luxury Bridal & Haute Couture',
    tagline: 'Signature Bridal Films & Couture Campaigns',
    highlight: 'Official visual storyteller capturing opulent bridal wear, intricate embroidery details, and royal wedding runway shoots with 4K cinematic color-grading.',
    scope: 'Haute Couture Visuals • Bridal Films • Commercial Fashion Shoots',
    bgImage: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop',
    stat: '100%',
    statLabel: 'Royal Aesthetic Match',
    accent: '#f2a900'
  },
  {
    id: 'modern',
    name: 'Modern Cash & Carry',
    category: 'Mega Commercial & Retail Giant',
    tagline: 'Grand Opening & Commercial Video Campaigns',
    highlight: 'End-to-end aerial drone cinematography, high-energy promotional reels, and commercial launch campaigns reaching hundreds of thousands of customers.',
    scope: 'Brand Commercials • High-Impact Social Reels • Aerial Drone Coverage',
    bgImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop',
    stat: '500K+',
    statLabel: 'Campaign Views Generated',
    accent: '#38bdf8'
  },
  {
    id: 'shamsheer',
    name: 'Shamsheer',
    category: 'Premium Heritage & Lifestyle Brand',
    tagline: 'Exclusive Brand Stories & Cinematic Lookbooks',
    highlight: 'Bold, cinematic storytelling with rich atmospheric lighting and sharp editorial frames that elevated their brand prestige and customer engagement.',
    scope: 'Lookbook Cinematography • Editorial Masterpieces • VIP Brand Coverage',
    bgImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    stat: '5.0 ★',
    statLabel: 'Production Rating',
    accent: '#e0a96d'
  }
];

export function TrustedBrandsSection() {
  const [activeBrand, setActiveBrand] = useState<string>('bajwas');
  const navigate = useNavigate();

  const currentBrand = BRANDS.find((b) => b.id === activeBrand) || BRANDS[0];

  const handleBookNow = () => {
    navigate('/contact');
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Hello MuzFrame Studio! I saw that you are trusted by Bajwas Collection, Modern Cash & Carry, and Shamsheer. I want to inquire about booking your premium team for my upcoming event/campaign.");
    window.open(`https://wa.me/923006103262?text=${text}`, '_blank');
  };

  return (
    <section id="trusted-by-section" className="relative py-24 bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-black border-y border-[#f2a900]/20 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#f2a900]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header with Authority Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2a900]/10 border border-[#f2a900]/30 text-[#f2a900] text-xs uppercase tracking-[0.25em] font-bold mb-5 shadow-[0_0_15px_rgba(242,169,0,0.15)]"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Proven Industry Trust</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-tight mb-5"
          >
            Proudly Chosen By <br className="hidden sm:inline" />
            <span className="italic luxury-gradient font-medium">Industry Leaders & Top Brands</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-base sm:text-lg font-light leading-relaxed"
          >
            From premier fashion houses to commercial retail giants, leading brands trust MuzFrame Studio to deliver unmatched visual excellence. We bring this exact VIP standard to your wedding and event stories.
          </motion.p>
        </div>

        {/* Brand Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {BRANDS.map((brand) => {
            const isSelected = activeBrand === brand.id;
            return (
              <button
                key={brand.id}
                id={`brand-tab-${brand.id}`}
                onClick={() => setActiveBrand(brand.id)}
                className={`relative text-left p-6 rounded-2xl transition-all duration-300 border ${
                  isSelected
                    ? 'bg-gradient-to-b from-white/10 to-white/[0.03] border-[#f2a900] shadow-[0_0_30px_rgba(242,169,0,0.2)]'
                    : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                }`}
              >
                {isSelected && (
                  <motion.div 
                    layoutId="activeBrandGlow"
                    className="absolute -top-px left-8 right-8 h-1 bg-[#f2a900] shadow-[0_0_12px_#f2a900] rounded-full"
                  />
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#f2a900] bg-[#f2a900]/10 px-2.5 py-1 rounded-md border border-[#f2a900]/20">
                    Trusted Partner
                  </span>
                  <ShieldCheck className={`w-4 h-4 ${isSelected ? 'text-[#f2a900]' : 'text-white/30'}`} />
                </div>
                <h3 className="font-serif text-2xl text-white font-medium mb-1 tracking-wide">
                  {brand.name}
                </h3>
                <p className="text-xs text-white/60 line-clamp-1 font-light">
                  {brand.category}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Brand Interactive Showcase Banner */}
        <motion.div 
          key={currentBrand.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl overflow-hidden border border-white/15 bg-black/80 shadow-2xl mb-16"
        >
          {/* Background Photo with dynamic dark vignette */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-30 scale-105"
            style={{ backgroundImage: `url(${currentBrand.bgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2a900]/15 border border-[#f2a900]/40 text-[#f2a900] text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Client Case Study
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  {currentBrand.category}
                </span>
              </div>

              <div>
                <h4 className="font-serif text-3xl sm:text-4xl text-white font-normal mb-2">
                  {currentBrand.name}
                </h4>
                <p className="text-lg text-[#f2a900] font-light italic">
                  "{currentBrand.tagline}"
                </p>
              </div>

              <p className="text-white/80 text-base leading-relaxed font-light max-w-2xl">
                {currentBrand.highlight}
              </p>

              <div className="pt-2 border-t border-white/10">
                <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-2">
                  Production Scope & Deliverables:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentBrand.scope.split('•').map((item, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#f2a900]" />
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Metric Box Column */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-black/60 border border-[#f2a900]/30 text-center relative overflow-hidden backdrop-blur-md shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Award className="w-24 h-24 text-[#f2a900]" />
                </div>
                
                <p className="text-[#f2a900] text-xs font-bold uppercase tracking-widest mb-1">
                  Verified Outcome
                </p>
                <div className="font-serif text-5xl sm:text-6xl text-white font-bold my-2 tracking-tight">
                  {currentBrand.stat}
                </div>
                <p className="text-white/70 text-xs sm:text-sm font-medium">
                  {currentBrand.statLabel}
                </p>
                
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-[#f2a900]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cinematic Broadcast Grade Standard</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* HIGH-CONVERSION BOOKING CALL-TO-ACTION CARD (Forced for Booking) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#141005] via-[#1f1604] to-[#120e03] border-2 border-[#f2a900]/50 shadow-[0_0_50px_rgba(242,169,0,0.25)] overflow-hidden"
        >
          {/* Shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f2a900] to-transparent animate-pulse" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left side: Scarcity & Value proposition */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest">
                <Flame className="w-3.5 h-3.5 animate-bounce" />
                <span>High Demand Wedding Season 2026/2027</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight">
                Want The Same <span className="text-[#f2a900] underline decoration-[#f2a900]/50 underline-offset-8">Celebrity Standard</span> For Your Big Day?
              </h3>

              <p className="text-white/80 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
                Dates for lead cinematographer <strong className="text-white font-medium">Muzammal Khan</strong> and our prime cinema crew are reserved months in advance. Secure your slot now to avoid disappointment.
              </p>

              {/* Live Scarcity & Benefit Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-white/90 bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/10">
                  <Calendar className="w-4 h-4 text-[#f2a900]" />
                  <span>Limited Slots Per Month</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/90 bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/10">
                  <Crown className="w-4 h-4 text-[#f2a900]" />
                  <span>Custom Luxury Packages</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/90 bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-[#f2a900]" />
                  <span>Complimentary Drone Coverage</span>
                </div>
              </div>
            </div>

            {/* Right side: Direct High-Impact Action Buttons */}
            <div className="lg:col-span-4 flex flex-col gap-3.5 w-full">
              <button
                id="urgent-book-now-btn"
                onClick={handleBookNow}
                className="w-full bg-[#f2a900] hover:bg-white text-black py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(242,169,0,0.5)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Reserve Your Date Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="urgent-whatsapp-btn"
                onClick={openWhatsApp}
                className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 py-3.5 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Inquiry</span>
              </button>

              <p className="text-center text-[11px] text-white/40 tracking-wider">
                ⚡ Instant confirmation within 15 minutes
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
