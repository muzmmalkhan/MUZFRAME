import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Camera, Calculator, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrustedBrandsSection } from '../components/TrustedBrandsSection';
import { QuickCalculator } from '../components/QuickCalculator';

const HERO_SLIDES = [
  {
    image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_12.57.21_PM_a2784729.jpeg',
    title: 'Royal Bridal Mehndi & Details',
    desktopPos: 'center 62%',
  },
  {
    image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=3000&auto=format&fit=crop',
    title: 'Stunning Drone & Aerial Views',
    desktopPos: 'center center',
  },
  {
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=3000&auto=format&fit=crop',
    title: 'Vibrant Wedding Celebrations',
    desktopPos: 'center center',
  },
  {
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=3000&auto=format&fit=crop',
    title: 'Cinematic Royal Moments',
    desktopPos: 'center center',
  },
  {
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=3000&auto=format&fit=crop',
    title: 'Studio Gear & 4K Setup',
    desktopPos: 'center center',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 1,
  }),
};

export function Home() {
  const [[currentBg, direction], setSlide] = useState<[number, number]>([0, 1]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/contact');
  };

  const handleQuickQuote = () => {
    const el = document.getElementById('quick-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const paginate = (newDirection: number) => {
    setSlide(([prev]) => {
      const nextIndex = (prev + newDirection + HERO_SLIDES.length) % HERO_SLIDES.length;
      return [nextIndex, newDirection];
    });
  };

  const goToSlide = (targetIndex: number) => {
    setSlide(([prev]) => {
      if (targetIndex === prev) return [prev, 0];
      const dir = targetIndex > prev ? 1 : -1;
      return [targetIndex, dir];
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex-col flex">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] md:h-screen md:min-h-[600px] flex items-center justify-center overflow-hidden py-24 md:py-0 select-none">
        {/* Backgrounds - Horizontal Slide */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`slide-bg-${currentBg}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 240, damping: 28 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Desktop Full-Bleed Sharp Background */}
            <div
              className="hidden md:block absolute inset-0 w-full h-full bg-cover transition-all duration-700"
              style={{
                backgroundImage: `url(${HERO_SLIDES[currentBg].image})`,
                backgroundPosition: HERO_SLIDES[currentBg].desktopPos,
              }}
            />
            {/* Mobile Ambient Glow Background (Fills screen without harsh borders) */}
            <div
              className="md:hidden absolute inset-0 w-full h-full bg-cover bg-center filter blur-3xl scale-125 opacity-40"
              style={{
                backgroundImage: `url(${HERO_SLIDES[currentBg].image})`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 md:bg-black/40 z-10 pointer-events-none" />

        {/* Desktop Left / Right Navigation Chevrons */}
        <button
          onClick={() => paginate(-1)}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white hover:text-[#f2a900] hover:border-[#f2a900] items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white hover:text-[#f2a900] hover:border-[#f2a900] items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full text-center mt-6 md:mt-16 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#f2a900]/30 text-[#f2a900] text-xs uppercase tracking-widest font-semibold mb-4 sm:mb-6"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Hasilpur Ka Trusted Studio</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-4 uppercase max-w-4xl mx-auto px-2 sm:px-0"
          >
            Framing Your <br className="hidden sm:block" />
            <span className="italic luxury-gradient">Wedding Moments</span><br />
            Perfectly
          </motion.h1>

          {/* Mobile Featured Photo Showcase (Horizontal Slide + Swipe) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="md:hidden w-full max-w-md my-4 relative"
          >
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#f2a900]/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] bg-black/40">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={`mobile-img-${currentBg}`}
                  src={HERO_SLIDES[currentBg].image}
                  alt={HERO_SLIDES[currentBg].title}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 280, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.3}
                  onDragEnd={(_, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -8000 || offset.x < -50) {
                      paginate(1);
                    } else if (swipe > 8000 || offset.x > 50) {
                      paginate(-1);
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-center cursor-grab active:cursor-grabbing select-none"
                />
              </AnimatePresence>

              {/* Title tag on image */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 flex items-center justify-between text-left pointer-events-none">
                <span className="text-white text-xs font-medium tracking-wide">
                  {HERO_SLIDES[currentBg].title}
                </span>
                <span className="text-[#f2a900] text-[10px] uppercase font-bold tracking-widest bg-black/70 px-2 py-0.5 rounded-full border border-[#f2a900]/30">
                  {currentBg + 1} / {HERO_SLIDES.length}
                </span>
              </div>

              {/* Previous / Next buttons on mobile preview */}
              <button 
                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm active:scale-95 transition-all z-20 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm active:scale-95 transition-all z-20 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 font-light leading-relaxed"
          >
            Aapke sab se khaas lamhaat ko cinematic andaaz mein mehfooz karein — 4K video, breathtaking drone shots aur royal bridal photography ke saath.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-xs sm:max-w-none px-4 sm:px-0"
          >
            <button 
              onClick={handleBookNow}
              className="w-full sm:w-auto justify-center bg-[#f2a900] text-black px-8 py-3.5 sm:py-4 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 hover:bg-white transition-colors shadow-[0_0_20px_rgba(242,169,0,0.4)] cursor-pointer"
            >
              Book Now <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={handleQuickQuote}
              className="w-full sm:w-auto justify-center nav-pill px-8 py-3.5 sm:py-4 bg-black/50 backdrop-blur-md flex items-center gap-2 hover:border-[#f2a900] hover:text-[#f2a900] transition-colors cursor-pointer text-xs sm:text-sm uppercase tracking-widest font-bold"
            >
              <Calculator className="w-4 h-4 text-[#f2a900]" /> Instant Quote
            </button>
          </motion.div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button 
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${currentBg === i ? 'w-8 bg-[#f2a900]' : 'w-2 bg-white/30 hover:bg-white/60'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Quick Calculator Section */}
      <section id="quick-calculator" className="bg-black py-24 border-t border-white/5 scroll-mt-12">
        <QuickCalculator />
      </section>

      {/* Chosen By Section (Modern Cash & Carry) */}
      <TrustedBrandsSection />

      {/* Video Reel Section */}
      <section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f2a900] blur-[150px] rounded-full mix-blend-screen" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <p className="text-[#f2a900] uppercase tracking-widest text-xs font-bold mb-4">Our Showreel</p>
              <h2 className="font-serif text-4xl md:text-5xl">Cinematic <span className="luxury-gradient italic">Vision</span></h2>
              <p className="text-white/60 text-sm mt-2">Real wedding stories aur royal celebration highlights dekhein.</p>
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
               <button onClick={() => navigate('/gallery')} className="w-24 h-24 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center group-hover:border-[#f2a900] group-hover:text-[#f2a900] transition-all hover:scale-110 group-hover:shadow-[0_0_30px_rgba(242,169,0,0.3)] cursor-pointer">
                 <Play className="w-8 h-8 ml-2" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Reel Section */}
    </div>
  );
}
