import { Camera, Video, Plane, Edit3, Image as ImageIcon, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const INDIVIDUAL_SERVICES = [
  { title: "Wedding Photography", icon: ImageIcon, desc: "Candid and cinematic moments captured beautifully." },
  { title: "Fashion Shoots", icon: Camera, desc: "High-end editorial fashion photography." },
  { title: "Product Shoots", icon: Check, desc: "Premium commercial product showcases." },
  { title: "Drone Shoots", icon: Plane, desc: "Epic aerial 4K cinematography." },
  { title: "Video Editing", icon: Video, desc: "Professional post-production and color grading." },
];

export function Services() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Individual Services */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Core <span className="luxury-gradient italic">Services</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">We provide specialized creative services tailored to your needs.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {INDIVIDUAL_SERVICES.map((srv, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-[#fff]/5 hover:border-[#f2a900]/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#f2a900] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(242,169,0,0.2)] transition-all">
                  <srv.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-white group-hover:text-[#f2a900] transition-colors">{srv.title}</h3>
                <p className="text-white/50 text-sm">{srv.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
