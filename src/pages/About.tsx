import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2940&auto=format&fit=crop" 
                alt="Photography Setup" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Logo Badge */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-black border-4 border-black flex items-center justify-center">
               <div className="w-full h-full rounded-full border border-white/20 flex flex-col items-center justify-center bg-zinc-900 shadow-2xl text-center">
                 <span className="font-serif text-xl font-bold text-white mb-1">مُزفریم</span>
                 <span className="text-[#f2a900] font-black text-[10px] tracking-widest uppercase mb-2">Studio</span>
                 <span className="font-serif font-bold tracking-wider text-[10px] uppercase text-white/50">EST. 2018</span>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <p className="text-[#f2a900] uppercase tracking-widest text-xs font-bold mb-4">Our Story</p>
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                More than just <br/><span className="luxury-gradient italic">photographers.</span>
              </h1>
            </div>
            
            <div className="space-y-6 text-white/70 text-lg leading-relaxed font-light">
              <p>
                Based in Hasilpur, <strong>MuzFrame Studio</strong> is an established premium photography and cinematography agency dedicated to preserving the fleeting moments that matter most. We believe every event carries its own unique heartbeat, and our mission is to capture it authentically.
              </p>
              <p>
                Our philosophy is simple: technology serves emotion. By combining cutting-edge DSLR and drone equipment with an editorial eye, we bridge the gap between classic portraiture and modern, cinematic storytelling. 
              </p>
            </div>

            <div className="py-8 border-y border-white/10 my-8 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-4xl text-[#f2a900] mb-2">5+</h4>
                <p className="text-white/50 text-sm uppercase tracking-widest font-bold">Years Exp.</p>
              </div>
              <div>
                <h4 className="font-serif text-4xl text-[#f2a900] mb-2">300+</h4>
                <p className="text-white/50 text-sm uppercase tracking-widest font-bold">Events</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
