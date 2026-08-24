import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Camera, Star, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=3000&auto=format&fit=crop', // Stunning Drone view
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=3000&auto=format&fit=crop', // Vibrant Wedding
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=3000&auto=format&fit=crop', // Cinematic Moments
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=3000&auto=format&fit=crop', // Photography Setup
];

export function Home() {
  const [currentBg, setCurrentBg] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (user) {
      navigate('/contact');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex-col flex">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Backgrounds */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`img-${currentBg}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${HERO_IMAGES[currentBg]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full text-center mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#f2a900] uppercase tracking-[0.3em] text-sm font-semibold mb-6"
          >
            Welcome to MuzFrame Studio
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-tight mb-8"
          >
            Preserving <span className="italic luxury-gradient">Moments.</span><br />
            Creating Legacy.
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={handleBookNow}
              className="bg-[#f2a900] text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-white transition-colors shadow-[0_0_20px_rgba(242,169,0,0.4)]"
            >
              Book Now <ArrowRight className="w-4 h-4" />
            </button>
            <Link 
              to="/gallery" 
              className="nav-pill px-8 py-4 bg-black/50 backdrop-blur-md flex items-center gap-2 hover:border-[#f2a900] hover:text-[#f2a900]"
            >
              <Play className="w-4 h-4" /> View Portfolio
            </Link>
          </motion.div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {Array.from({ length: HERO_IMAGES.length + 1 }).map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentBg(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${currentBg === i ? 'w-8 bg-[#f2a900]' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Services Snippet */}
      <section className="bg-black py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Our Expertise</h2>
            <p className="text-white/60 max-w-2xl mx-auto">We offer comprehensive packages including professional DSLR photography, cinematic videography, and stunning drone shots to capture your most important days.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Photography', desc: 'High-resolution moments captured with state-of-the-art DSLR cameras.', icon: Camera, img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2938&auto=format&fit=crop' },
              { title: 'Cinematography', desc: 'Full highlight reels and complete event video editing.', icon: Play, img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2942&auto=format&fit=crop' },
              { title: 'Drone Shots', desc: 'Breathtaking aerial views that add a cinematic scale to your story.', icon: Star, img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2000&auto=format&fit=crop' }
            ].map((s, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${s.img})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <s.icon className="w-10 h-10 text-[#f2a900] mb-4" />
                  <h3 className="font-serif text-3xl mb-2">{s.title}</h3>
                  <p className="text-white/70 text-sm mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {s.desc}
                  </p>
                  <Link to="/packages" className="text-xs uppercase tracking-widest text-[#f2a900] font-semibold flex items-center gap-2">
                    View Packages <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Video Reel Section */}
      <section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f2a900] blur-[150px] rounded-full mix-blend-screen" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <p className="text-[#f2a900] uppercase tracking-widest text-xs font-bold mb-4">Showreel</p>
              <h2 className="font-serif text-4xl md:text-5xl">Cinematic <span className="luxury-gradient italic">Vision</span></h2>
            </div>
            <Link to="/gallery" className="nav-pill hidden md:flex items-center gap-2 mt-4 md:mt-0 glass-panel">
              View All Videos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="relative aspect-video rounded-3xl overflow-hidden group border border-white/10 shadow-[0_0_50px_rgba(242,169,0,0.1)]">
            <div 
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 bg-cover bg-center"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=3000&auto=format&fit=crop)` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
               <button className="w-24 h-24 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center group-hover:border-[#f2a900] group-hover:text-[#f2a900] transition-all hover:scale-110 group-hover:shadow-[0_0_30px_rgba(242,169,0,0.3)]">
                 <Play className="w-8 h-8 ml-2" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
           <div className="text-center mb-16">
              <Star className="w-8 h-8 text-[#f2a900] mx-auto mb-4" />
              <h2 className="font-serif text-4xl md:text-5xl mb-4">Client Love</h2>
              <p className="text-white/60 max-w-2xl mx-auto">Hear from those who trusted us with their most precious memories.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { name: 'Ayesha & Ali', role: 'Wedding Couple', text: "MuzFrame Studio exceeded our expectations. The drone shots were breathtaking, and the cinematic video still makes us cry every time we watch it. Ultra professional team." },
                { name: 'Hassan Raza', role: 'Brand Owner', text: "We hired them for a product shoot and fashion portfolio. The lighting, the editing, the premium quality—they truly understand exactly what a high-end brand needs." }
              ].map((t, i) => (
                <div key={i} className="glass-panel p-10 rounded-3xl relative">
                  <div className="absolute -top-4 -left-4 text-6xl text-[#f2a900] opacity-20 font-serif">"</div>
                  <p className="text-white/80 leading-relaxed mb-8 relative z-10 font-light text-lg">"{t.text}"</p>
                  <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#f2a900] font-serif text-xl border border-white/5">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white tracking-wide">{t.name}</h4>
                      <p className="text-[#f2a900] text-xs uppercase tracking-widest mt-1">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
