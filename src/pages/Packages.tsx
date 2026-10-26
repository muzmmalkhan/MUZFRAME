import React, { useState } from 'react';
import { 
  Check, 
  Calendar, 
  Sparkles, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Camera, 
  Video, 
  Users, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Table, 
  LayoutGrid, 
  Flame, 
  Award, 
  Heart,
  PhoneCall
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QuickCalculator } from '../components/QuickCalculator';
import { ALL_PACKAGES, PackageItem } from '../data/packagesData';

export function Packages() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'wedding' | 'bridal'>('wedding');
  const [durationFilter, setDurationFilter] = useState<'all' | '1day' | '2days'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

  const toggleFeatures = (pkgId: string) => {
    setExpandedFeatures((prev) => ({ ...prev, [pkgId]: !prev[pkgId] }));
  };

  const filteredPackages = ALL_PACKAGES.filter((pkg) => {
    if (pkg.category !== activeCategory) {
      return false;
    }
    if (durationFilter === '1day' && pkg.days !== 1) {
      return false;
    }
    if (durationFilter === '2days' && pkg.days !== 2) {
      return false;
    }
    return true;
  });

  const handleBookPackage = (pkg: PackageItem) => {
    const pkgString = `${pkg.code} — ${pkg.name} (${pkg.price})`;
    navigate(`/contact?package=${encodeURIComponent(pkgString)}`);
  };

  const handleWhatsAppPackage = (pkg: PackageItem) => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum MuzFrame Studio! Main is package ki details aur booking ke baare mein baat karna chahta hoon:\n\n*${pkg.code} — ${pkg.name}*\nPrice: ${pkg.price}\nCoverage: ${pkg.coverage}\nBest For: ${pkg.bestFor}`
    );
    window.open(`https://wa.me/923007572772?text=${text}`, '_blank');
  };

  return (
    <div className="pt-24 sm:pt-32 pb-28 min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#f2a900]/30 text-[#f2a900] text-xs font-bold tracking-[0.25em] uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Price Guide</span>
          </motion.div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 uppercase tracking-tight">
            Transparent <span className="luxury-gradient italic">Packages</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed px-2">
            Hasilpur aur Punjab bhar mein transparent pricing. Har package mein cinematic color grading, 
            high-speed cloud delivery aur studio client portal shamil hai.
          </p>
        </div>

        {/* Primary Category Switcher (Prominent & Simple) */}
        <div className="flex flex-col items-center gap-4 mb-8 sm:mb-10">
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#121212] border border-white/10 w-full max-w-lg shadow-xl">
            <button
              onClick={() => { setActiveCategory('wedding'); setDurationFilter('all'); }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === 'wedding'
                  ? 'bg-[#f2a900] text-black shadow-[0_0_20px_rgba(242,169,0,0.4)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>💍 Wedding (01–06)</span>
            </button>
            <button
              onClick={() => { setActiveCategory('bridal'); setDurationFilter('all'); }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === 'bridal'
                  ? 'bg-[#f2a900] text-black shadow-[0_0_20px_rgba(242,169,0,0.4)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>👰 Bridal Specials (4)</span>
            </button>
          </div>

          {/* Sub-Filters & View Toggle Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-5xl px-1">
            {/* Duration Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-white/40 text-[11px] uppercase tracking-wider hidden sm:inline mr-1">Filter:</span>
              <button
                onClick={() => setDurationFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                  durationFilter === 'all'
                    ? 'bg-white/20 text-[#f2a900] border-[#f2a900]/50'
                    : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDurationFilter('1day')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                  durationFilter === '1day'
                    ? 'bg-white/20 text-[#f2a900] border-[#f2a900]/50'
                    : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'
                }`}
              >
                1 Day Event
              </button>
              {activeCategory === 'wedding' && (
                <button
                  onClick={() => setDurationFilter('2days')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                    durationFilter === '2days'
                      ? 'bg-white/20 text-[#f2a900] border-[#f2a900]/50'
                      : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'
                  }`}
                >
                  2 Days (Full Wedding)
                </button>
              )}
            </div>

            {/* Laptop / Large Screen View Toggle (Cards vs Matrix) */}
            <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#f2a900] text-black font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Card View</span>
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'matrix'
                    ? 'bg-[#f2a900] text-black font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Comparison Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: SIDE-BY-SIDE COMPARISON TABLE (LAPTOP & LARGE SCREEN) */}
        {viewMode === 'matrix' && (
          <div className="hidden lg:block mb-16 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#141414] to-black shadow-2xl">
            <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <span>Side-by-Side Comparison Matrix</span>
                  <span className="text-[#f2a900] text-sm font-sans font-normal">({filteredPackages.length} Packages)</span>
                </h3>
                <p className="text-white/50 text-xs mt-1">Sabhi packages ke cameras, drone, female crew aur albums ka aapas mein comparison.</p>
              </div>
              <button
                onClick={() => setViewMode('cards')}
                className="text-xs text-[#f2a900] hover:underline cursor-pointer"
              >
                Switch to Card View →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="p-4 text-white/50 uppercase tracking-wider font-semibold w-56">Package & Price</th>
                    <th className="p-4 text-white/50 uppercase tracking-wider font-semibold">Coverage</th>
                    <th className="p-4 text-white/50 uppercase tracking-wider font-semibold">Cameras & Crew</th>
                    <th className="p-4 text-white/50 uppercase tracking-wider font-semibold">Drone Days</th>
                    <th className="p-4 text-white/50 uppercase tracking-wider font-semibold">Female Photographer</th>
                    <th className="p-4 text-white/50 uppercase tracking-wider font-semibold">Albums Included</th>
                    <th className="p-4 text-white/50 uppercase tracking-wider font-semibold w-48 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPackages.map((pkg) => (
                    <tr 
                      key={pkg.id} 
                      className={`hover:bg-white/[0.03] transition-colors ${pkg.isPopular ? 'bg-[#f2a900]/[0.04]' : ''}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{pkg.name}</span>
                          {pkg.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-[#f2a900] text-black text-[9px] font-black uppercase tracking-wider">
                              {pkg.badge.replace(/[⭐🔥👑]/g, '').trim()}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#f2a900] font-bold font-serif mt-1">{pkg.price}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{pkg.bestFor}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                          <Calendar className="w-3 h-3 text-[#f2a900]" />
                          <span>{pkg.coverage}</span>
                        </span>
                      </td>
                      <td className="p-4 text-white/85">{pkg.crewSummary}</td>
                      <td className="p-4">
                        <span className={`font-medium ${pkg.droneSummary.includes('Included') || pkg.droneSummary.includes('Coverage') ? 'text-white' : 'text-white/40'}`}>
                          {pkg.droneSummary}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${pkg.femalePhotoSummary?.includes('Included') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-white/40'}`}>
                          {pkg.femalePhotoSummary || 'Optional Add-on'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-medium ${pkg.albumSummary.includes('Included') ? 'text-[#f2a900]' : 'text-white/40'}`}>
                          {pkg.albumSummary}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleBookPackage(pkg)}
                            className="px-3.5 py-2 rounded-lg bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer shadow-md"
                          >
                            Book Now
                          </button>
                          <button
                            onClick={() => handleWhatsAppPackage(pkg)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-white hover:text-emerald-400 border border-white/10 transition-colors cursor-pointer"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 2: CARDS VIEW (OPTIMIZED FOR BOTH MOBILE & LAPTOPS) */}
        {(viewMode === 'cards' || true) && (
          <div className={`${viewMode === 'matrix' ? 'lg:hidden' : 'block'} mb-20`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 max-w-7xl mx-auto">
              <AnimatePresence mode="popLayout">
                {filteredPackages.map((pkg) => {
                  const isExpanded = !!expandedFeatures[pkg.id];
                  const isTopHighlight = pkg.isPopular || pkg.badge?.includes('ULTIMATE') || pkg.badge?.includes('ROYAL');

                  return (
                    <motion.div
                      key={pkg.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`relative rounded-3xl p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                        isTopHighlight
                          ? 'bg-gradient-to-b from-[#1f1906] via-[#121212] to-black border-2 border-[#f2a900] shadow-[0_0_35px_rgba(242,169,0,0.18)]'
                          : 'bg-gradient-to-b from-white/[0.04] to-black/90 border border-white/10 hover:border-white/25 shadow-xl'
                      }`}
                    >
                      {/* Floating Badge */}
                      {pkg.badge && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f2a900] text-black px-4 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-[0_4px_20px_rgba(242,169,0,0.45)] whitespace-nowrap z-10">
                          {pkg.badge}
                        </div>
                      )}

                      {/* Top Header & Price */}
                      <div>
                        <div className="flex items-center justify-between gap-2 pt-2 pb-3 border-b border-white/10">
                          <div>
                            <span className="text-[#f2a900] text-[11px] font-bold uppercase tracking-widest block">
                              {pkg.code}
                            </span>
                            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
                              {pkg.name}
                            </h3>
                          </div>
                          <div className="text-right">
                            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#f2a900] tracking-tight block">
                              {pkg.price}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-white/70 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 mt-0.5">
                              <Calendar className="w-3 h-3 text-[#f2a900]" />
                              <span>{pkg.coverage}</span>
                            </span>
                          </div>
                        </div>

                        {/* Best For Container */}
                        <div className="my-3.5 p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                          <span className="text-[10px] uppercase tracking-wider text-[#f2a900] font-bold block mb-0.5">
                            Best Suited For
                          </span>
                          <p className="text-white/85 text-xs font-light leading-snug">
                            {pkg.bestFor}
                          </p>
                        </div>

                        {/* Key Highlight Pills (Fast Scanning on Mobile & Laptop) */}
                        <div className="grid grid-cols-1 gap-2 mb-4">
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80">
                            <Users className="w-3.5 h-3.5 text-[#f2a900] shrink-0" />
                            <span className="truncate">{pkg.crewSummary}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80">
                              <Video className="w-3.5 h-3.5 text-[#f2a900] shrink-0" />
                              <span className="truncate">{pkg.droneSummary}</span>
                            </div>
                            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80">
                              <BookOpen className="w-3.5 h-3.5 text-[#f2a900] shrink-0" />
                              <span className="truncate">{pkg.albumSummary}</span>
                            </div>
                          </div>
                        </div>

                        {/* Full Deliverables List (Clean & Expandable on Mobile) */}
                        <div className="border-t border-white/10 pt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">
                              All Inclusions ({pkg.includes.length})
                            </span>
                            <button
                              onClick={() => toggleFeatures(pkg.id)}
                              className="text-[11px] text-[#f2a900] font-medium flex items-center gap-1 cursor-pointer hover:underline"
                            >
                              <span>{isExpanded ? 'Hide' : 'View Full List'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>

                          {/* Default preview items (first 4 items always visible) */}
                          <div className="space-y-2">
                            {(isExpanded ? pkg.includes : pkg.includes.slice(0, 4)).map((item, i) => (
                              <div key={i} className="flex items-start gap-2 text-left">
                                <div className="w-4 h-4 rounded-full bg-[#f2a900]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#f2a900]/30">
                                  <Check className="w-2.5 h-2.5 text-[#f2a900]" />
                                </div>
                                <span className="text-white/80 text-xs font-light leading-snug">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>

                          {!isExpanded && pkg.includes.length > 4 && (
                            <button
                              onClick={() => toggleFeatures(pkg.id)}
                              className="w-full text-center mt-2.5 py-1 text-[11px] text-white/40 hover:text-[#f2a900] transition-colors cursor-pointer"
                            >
                              + {pkg.includes.length - 4} more deliverables included
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
                        <button
                          onClick={() => handleBookPackage(pkg)}
                          className={`w-full py-3.5 px-4 text-center rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                            isTopHighlight
                              ? 'bg-[#f2a900] text-black hover:bg-white active:scale-[0.98]'
                              : 'bg-white/10 text-white hover:bg-[#f2a900] hover:text-black border border-white/15 hover:border-transparent active:scale-[0.98]'
                          }`}
                        >
                          <span>Book This Package</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleWhatsAppPackage(pkg)}
                          className="w-full py-2.5 px-4 text-center rounded-xl font-semibold text-xs text-white/70 hover:text-emerald-400 bg-white/[0.02] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp Direct Inquiry</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Quality Guarantee Banner */}
        <div className="mb-16 p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-white/[0.02] via-[#f2a900]/10 to-white/[0.02] border border-[#f2a900]/25 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#f2a900]/15 border border-[#f2a900]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-[#f2a900]" />
            </div>
            <div>
              <h4 className="text-white font-serif font-bold text-lg sm:text-xl">MuzFrame Studio Assurance</h4>
              <p className="text-white/60 text-xs sm:text-sm mt-0.5 max-w-xl">
                Dual camera backup on all wedding days, dedicated female photographers for family privacy, 
                high-definition 4K master grade, aur direct client portal access.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                const el = document.getElementById('custom-calculator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-[#f2a900] hover:text-black text-white text-xs font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
            >
              Custom Calculator ↓
            </button>
            <a
              href="tel:03007572772"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#f2a900] text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Us</span>
            </a>
          </div>
        </div>

        {/* Custom Quote Calculator */}
        <div id="custom-calculator" className="scroll-mt-24">
          <div className="text-center mb-8">
            <p className="text-[#f2a900] text-xs font-bold uppercase tracking-widest mb-2">Build Your Own Setup</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">Instant Price <span className="luxury-gradient italic">Calculator</span></h2>
            <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
              Agar aapko custom cameras, drones, extra days ya albums add karne hain to neeche calculator use karein.
            </p>
          </div>
          <QuickCalculator />
        </div>
      </div>
    </div>
  );
}
