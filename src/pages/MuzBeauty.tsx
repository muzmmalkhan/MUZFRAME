import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MuzBeauty() {
  return (
    <div className="min-h-screen bg-black pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-1/2 flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 border border-[#f2a900]/30 bg-[#f2a900]/5 px-4 py-2 rounded-full w-fit">
            <Sparkles className="w-4 h-4 text-[#f2a900]" />
            <span className="text-[#f2a900] text-sm font-semibold tracking-widest uppercase">Coming Soon</span>
          </div>
          
          <h1 className="font-serif text-5xl lg:text-7xl font-medium text-white leading-tight">
            Flawless <br />
            <span className="text-[#f2a900] italic">Elegance</span> Awaits.
          </h1>
          
          <p className="text-white/60 text-lg leading-relaxed max-w-xl">
            MuzBeauty Bridal Glow Cream is currently in the final stages of perfection. Designed to deliver a camera-ready glow, it hydrates, nourishes, and brightens for all skin types. Prepare to radiate confidence in every frame.
          </p>
          
          <div className="pt-4 flex items-center gap-6">
            <Link to="/contact" className="btn-primary flex items-center gap-2 group">
              Join Waitlist
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:w-1/2 relative"
        >
          <div className="absolute inset-0 bg-[#f2a900]/10 blur-[100px] rounded-full"></div>
          <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-white/5 p-4 lg:p-8">
            <img 
              src="/muzbeauty.jpg" 
              alt="MuzBeauty Bridal Glow Cream" 
              className="w-full h-auto rounded-xl object-cover shadow-2xl shadow-black/50"
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
