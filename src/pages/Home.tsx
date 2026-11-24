import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Calculator,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  X,
  Pause,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TrustedBrandsSection } from '../components/TrustedBrandsSection';
import { QuickCalculator } from '../components/QuickCalculator';
import { PortfolioLightbox } from '../components/PortfolioLightbox';
import {
  HERO_SLIDES,
  PORTFOLIO_ITEMS,
  MAIN_SHOWREEL,
} from '../data/portfolioData';

export function Home() {
  const [[currentBg, direction], setSlideState] = useState<[number, number]>([0, 1]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  const navigate = useNavigate();

  const featuredPortfolio = PORTFOLIO_ITEMS.filter((item) => item.featuredOnHome);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || HERO_SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setSlideState(([prev]) => [(prev + 1) % HERO_SLIDES.length, 1]);
    }, 5500);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, isPaused]);

  useEffect(() => {
    if (!showreelOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowreelOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showreelOpen]);

  const paginate = (dir: number) => {
    setSlideState(([prev]) => [(prev + dir + HERO_SLIDES.length) % HERO_SLIDES.length, dir]);
  };

  const goToSlide = (targetIndex: number) => {
    setSlideState(([prev]) => [targetIndex, targetIndex >= prev ? 1 : -1]);
  };

  const handleBookNow = () => {
    navigate('/contact');
  };

  const handleQuickQuote = () => {
    const el = document.getElementById('quick-calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activeIndex = currentBg % HERO_SLIDES.length;
  const currentSlide = HERO_SLIDES[activeIndex] || HERO_SLIDES[0];

  const slideVariants = {
    enter: (dir: number) =>
      prefersReducedMotion
        ? { opacity: 0, x: 0 }
        : { x: dir > 0 ? '100%' : '-100%', opacity: 1 },
    center: { x: '0%', opacity: 1 },
    exit: (dir: number) =>
      prefersReducedMotion
        ? { opacity: 0, x: 0 }
        : { x: dir > 0 ? '-100%' : '100%', opacity: 1 },
  };

  return (
    <div className="w-full flex flex-col bg-[#050505] text-white">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100svh] lg:min-h-[680px] flex items-end lg:items-center overflow-hidden pt-24 pb-16 sm:pb-20">
        {/* Background Horizontal Photography Slider */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050505]">
          <AnimatePresence initial={false} custom={direction} mode="sync">
            <motion.img
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              src={currentSlide.image}
              alt={currentSlide.alt}
              width={1600}
              height={900}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              transition={{
                x: { duration: prefersReducedMotion ? 0.01 : 0.7, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: prefersReducedMotion ? 0.2 : 0.35 },
              }}
              style={{ objectPosition: currentSlide.objectPosition }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Directional Contrast Scrim: preserves right-side photographic brilliance */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/15 pointer-events-none" />
          <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30 pointer-events-none" />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <div className="max-w-2xl">
            <p className="text-[#f2a900] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Hasilpur Wedding Photography & Cinema
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-[1.1] mb-4 text-balance">
              Framing your{' '}
              <span className="italic text-[#f2a900]">wedding moments</span>{' '}
              with timeless craft
            </h1>

            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-xl mb-4">
              Candid wedding photography, 4K cinema films, twilight drone shoots, and private female-crew bridal coverage across Hasilpur and Punjab.
            </p>

            {/* Starting Price Indicator */}
            <p className="text-xs sm:text-sm text-white/75 mb-7 font-medium">
              Wedding packages from <span className="text-[#f2a900] font-mono font-semibold">Rs. 45,000</span>
              <span aria-hidden="true" className="mx-2 text-white/30">·</span>
              Bridal shoots from <span className="text-[#f2a900] font-mono font-semibold">Rs. 25,000</span>
              <span aria-hidden="true" className="mx-2 text-white/30">·</span>
              Custom rates from <span className="text-[#f2a900] font-mono font-semibold">Rs. 10,000/day</span>
            </p>

            {/* Primary & Secondary Action Hierarchy */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
              <button
                type="button"
                onClick={handleBookNow}
                className="min-h-[48px] bg-[#f2a900] hover:bg-white text-black px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleQuickQuote}
                className="min-h-[48px] bg-black/55 hover:bg-black/80 text-white border border-white/30 hover:border-[#f2a900] hover:text-[#f2a900] px-6 py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors backdrop-blur-sm cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-[#f2a900]" />
                <span>Instant Quote</span>
              </button>
            </div>

            {/* Slide Controls, Pagination Bars & Current Shoot Caption */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15 max-w-xl">
              <div className="text-xs text-white/75">
                <span className="text-white font-medium">{currentSlide.caption}</span>
                <span aria-hidden="true" className="mx-2 text-white/30">·</span>
                <span>{currentSlide.location}</span>
              </div>

              {HERO_SLIDES.length > 1 && (
                <div className="flex items-center gap-3">
                  {/* Slide Dots */}
                  <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero slide indicators">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        role="tab"
                        aria-selected={idx === activeIndex}
                        aria-label={`Show slide ${idx + 1}: ${slide.caption}`}
                        onClick={() => goToSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === activeIndex
                            ? 'w-6 bg-[#f2a900]'
                            : 'w-2 bg-white/35 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Prev / Pause / Next Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => paginate(-1)}
                      aria-label="Previous hero photograph"
                      className="w-9 h-9 rounded-lg bg-black/60 border border-white/20 text-white hover:border-[#f2a900] hover:text-[#f2a900] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPaused((p) => !p)}
                      aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
                      className="w-9 h-9 rounded-lg bg-black/60 border border-white/20 text-white hover:border-[#f2a900] hover:text-[#f2a900] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => paginate(1)}
                      aria-label="Next hero photograph"
                      className="w-9 h-9 rounded-lg bg-black/60 border border-white/20 text-white hover:border-[#f2a900] hover:text-[#f2a900] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CUSTOM QUOTATION CALCULATOR (Directly below Hero for instant pricing clarity) */}
      <section id="quick-calculator" className="py-14 sm:py-16 lg:py-20 bg-[#050505] border-t border-white/10 scroll-mt-20">
        <div className="px-4 sm:px-6 lg:px-12 space-y-8">
          <QuickCalculator />

          {/* Simple 3-Step Booking Workflow */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-white/10">
                <span className="text-xs font-mono font-semibold text-[#f2a900]">STEP 01</span>
                <h3 className="font-serif text-xl font-semibold text-white mt-1">Estimate or Choose a Package</h3>
                <p className="text-xs text-white/65 mt-1.5 leading-relaxed">
                  Calculate your exact custom rate above or pick an all-inclusive wedding or bridal bundle starting at Rs. 25,000.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-white/10">
                <span className="text-xs font-mono font-semibold text-[#f2a900]">STEP 02</span>
                <h3 className="font-serif text-xl font-semibold text-white mt-1">Lock Your Event Dates</h3>
                <p className="text-xs text-white/65 mt-1.5 leading-relaxed">
                  Confirm crew availability directly with our Hasilpur booking desk via WhatsApp or the online booking form.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-white/10">
                <span className="text-xs font-mono font-semibold text-[#f2a900]">STEP 03</span>
                <h3 className="font-serif text-xl font-semibold text-white mt-1">Track Delivery in Client Portal</h3>
                <p className="text-xs text-white/65 mt-1.5 leading-relaxed">
                  Pick wedding entrance songs, monitor live editing milestones, and download full-resolution galleries anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECENT WORK PORTFOLIO PREVIEW */}
      <section id="recent-work" className="py-16 sm:py-20 lg:py-24 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[#f2a900] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                Recent Commissions
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
                Selected <span className="italic text-[#f2a900]">Wedding Stories</span>
              </h2>
              <p className="text-white/70 text-sm sm:text-base mt-2 max-w-xl">
                Real Mehndi, Barat, Walima, and Bridal photography from recent MuzFrame assignments. Click any photograph to inspect full shoot details.
              </p>
            </div>
            <Link
              to="/gallery"
              className="btn-secondary shrink-0 self-start sm:self-auto whitespace-nowrap"
            >
              <span>Complete Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredPortfolio.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className="group text-left rounded-2xl overflow-hidden bg-[#101010] border border-white/10 hover:border-[#f2a900]/50 transition-colors flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#141414]">
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-medium text-[#f2a900]">{item.category}</span>
                    <span className="inline-flex items-center gap-1 text-white/80">
                      <MapPin className="w-3 h-3 text-[#f2a900]" />
                      {item.location}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif text-xl font-semibold text-white group-hover:text-[#f2a900] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    {item.coupleOrClient} · {item.cameraGear}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SHOWREEL SECTION (Clear preview, play control & video duration) */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#050505] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[#f2a900] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                2026 Cinema Showreel
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
                4K Wedding <span className="italic text-[#f2a900]">Highlights Reel</span>
              </h2>
              <p className="text-white/70 text-sm sm:text-base mt-2 max-w-xl">
                {MAIN_SHOWREEL.summary}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/70 font-mono shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#f2a900]" />
                {MAIN_SHOWREEL.duration}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#141414] border border-white/10">
                {MAIN_SHOWREEL.resolution}
              </span>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/15 bg-[#101010] group">
            <img
              src={MAIN_SHOWREEL.thumbnail}
              alt={MAIN_SHOWREEL.alt}
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

            {/* Play Control */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setActiveChapter(0);
                  setShowreelOpen(true);
                }}
                aria-label="Play 2026 wedding showreel preview"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f2a900] hover:bg-white text-black flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-xl"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current" />
              </button>
              <span className="mt-4 text-sm sm:text-base font-medium text-white">
                Watch Showreel Preview ({MAIN_SHOWREEL.duration})
              </span>
            </div>

            {/* Bottom Reel Metadata */}
            <div className="hidden sm:flex absolute bottom-4 left-5 right-5 items-center justify-between text-xs text-white/80 pointer-events-none">
              <span>{MAIN_SHOWREEL.couple}</span>
              <span className="font-mono text-[#f2a900]">{MAIN_SHOWREEL.chapters.length} Curated Chapters</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUSTED PARTNERS & CLIENT REVIEWS */}
      <TrustedBrandsSection />

      {/* Lightbox Modal for Recent Work Tiles */}
      <PortfolioLightbox
        items={featuredPortfolio}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      {/* Interactive Showreel Chapter Preview Modal */}
      {showreelOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="MuzFrame Showreel Preview"
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowreelOpen(false)}
        >
          <div
            className="w-full max-w-4xl bg-[#0f0f0f] border border-white/15 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white">
                  {MAIN_SHOWREEL.title}
                </h3>
                <p className="text-xs text-white/60">
                  {MAIN_SHOWREEL.resolution} · Duration {MAIN_SHOWREEL.duration}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowreelOpen(false)}
                aria-label="Close showreel modal"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              <img
                src={
                  featuredPortfolio[activeChapter % featuredPortfolio.length]?.image ||
                  MAIN_SHOWREEL.thumbnail
                }
                alt={MAIN_SHOWREEL.chapters[activeChapter]?.label || MAIN_SHOWREEL.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-[#f2a900]">
                    Chapter {activeChapter + 1} · {MAIN_SHOWREEL.chapters[activeChapter]?.time}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-white font-semibold">
                    {MAIN_SHOWREEL.chapters[activeChapter]?.label}
                  </h4>
                </div>
                <Link
                  to="/contact"
                  onClick={() => setShowreelOpen(false)}
                  className="btn-primary"
                >
                  <span>Book 4K Cinema Crew</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-5 gap-2 border-t border-white/10">
              {MAIN_SHOWREEL.chapters.map((ch, idx) => (
                <button
                  key={ch.time}
                  type="button"
                  onClick={() => setActiveChapter(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    activeChapter === idx
                      ? 'bg-[#f2a900] text-black border-[#f2a900]'
                      : 'bg-black/60 text-white/80 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className={`text-[11px] font-mono ${activeChapter === idx ? 'text-black/80 font-semibold' : 'text-[#f2a900]'}`}>
                    {ch.time}
                  </div>
                  <div className="text-xs font-medium line-clamp-1 mt-0.5">{ch.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
