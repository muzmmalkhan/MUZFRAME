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
    id: 'modern',
    name: 'Modern Cash & Carry',
    category: 'Commercial & Retail Store',
    tagline: 'Commercial Video Campaigns & Promos',
    highlight: 'Drone video coverage, promo reels, and launch events seen by thousands of customers.',
    scope: 'Brand Commercials • Drone Coverage • Social Reels',
    bgImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop',
    stat: '500K+',
    statLabel: 'Views Generated',
    accent: '#38bdf8'
  }
];

export function TrustedBrandsSection() {
  const [activeBrand, setActiveBrand] = useState<string>('modern');
  const navigate = useNavigate();

  const currentBrand = BRANDS.find((b) => b.id === activeBrand) || BRANDS[0];

  const handleBookNow = () => {
    navigate('/contact');
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Hello MuzFrame Studio! I saw that you are trusted by Modern Cash & Carry. I want to inquire about booking your team for my upcoming event.");
    window.open(`https://wa.me/923006103262?text=${text}`, '_blank');
  };

  return (
    <section id="trusted-by-section" className="relative py-16 sm:py-20 bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-black border-y border-[#f2a900]/20 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#f2a900]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header with Authority Badge */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2a900]/10 border border-[#f2a900]/30 text-[#f2a900] text-xs uppercase tracking-wider font-semibold mb-3"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Hasilpur Ke Top Brands Ka Etemad</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-white mb-3 tracking-wide"
          >
            Chosen by <span className="text-[#f2a900] font-medium">Top Brands</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-sm sm:text-base font-light leading-relaxed"
          >
            Hasilpur ke mashhoor commercial stores aur brands apne launch campaigns aur video shoots ke liye MuzFrame par bharosa karte hain. Wahi cinematic camera quality hum aapki shadi ke har event mein laate hain.
          </motion.p>
        </div>

        {/* Brand Selector Card */}
        <div className="max-w-md mx-auto mb-10">
          {BRANDS.map((brand) => {
            const isSelected = activeBrand === brand.id;
            return (
              <button
                key={brand.id}
                id={`brand-tab-${brand.id}`}
                onClick={() => setActiveBrand(brand.id)}
                className={`relative w-full text-left p-6 sm:p-7 rounded-2xl transition-all duration-300 border ${
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
                    Trusted Partner • Official Shoot
                  </span>
                  <ShieldCheck className={`w-4 h-4 ${isSelected ? 'text-[#f2a900]' : 'text-white/30'}`} />
                </div>
                <h3 className="font-serif text-2xl text-white font-medium mb-1 tracking-wide">
                  {brand.name}
                </h3>
                <p className="text-xs text-white/60 line-clamp-1 font-light">
                  {brand.category} — {brand.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
