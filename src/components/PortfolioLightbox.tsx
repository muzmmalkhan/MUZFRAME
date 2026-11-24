import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PortfolioItem } from '../data/portfolioData';

interface PortfolioLightboxProps {
  items: PortfolioItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function PortfolioLightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: PortfolioLightboxProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNavigate((activeIndex + 1) % items.length);
      } else if (e.key === 'ArrowLeft') {
        onNavigate((activeIndex - 1 + items.length) % items.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, items.length, onClose, onNavigate]);

  if (activeIndex === null || !items[activeIndex]) {
    return null;
  }

  const item = items[activeIndex];

  const handleBookSimilar = () => {
    onClose();
    navigate(`/contact?package=${encodeURIComponent(`Inquiry: ${item.category} Shoot (${item.title})`)}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} shoot details`}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-[#0d0d0d] border border-white/15 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close shoot detail viewer"
          className="absolute top-3 right-3 z-30 w-11 h-11 rounded-xl bg-black/80 border border-white/20 text-white hover:text-[#f2a900] hover:border-[#f2a900] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left / Main Image Canvas */}
        <div className="lg:col-span-8 relative bg-black flex items-center justify-center min-h-[260px] sm:min-h-[380px] lg:min-h-[540px] max-h-[60vh] lg:max-h-[85vh] overflow-hidden">
          <img
            src={item.image}
            alt={item.alt}
            width={item.width}
            height={item.height}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain bg-black"
          />

          {/* Prev / Next Navigation Controls */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onNavigate((activeIndex - 1 + items.length) % items.length)}
                aria-label="Previous photograph"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-black/75 border border-white/20 text-white hover:text-[#f2a900] hover:border-[#f2a900] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate((activeIndex + 1) % items.length)}
                aria-label="Next photograph"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-black/75 border border-white/20 text-white hover:text-[#f2a900] hover:border-[#f2a900] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/80 border border-white/15 text-xs font-mono tabular-nums text-white/80">
            {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </div>
        </div>

        {/* Right Shoot Details Sidebar */}
        <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs text-[#f2a900] font-medium">
              <span>{item.category}</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span className="text-white/60">{item.year}</span>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white leading-snug">
                {item.title}
              </h2>
              <p className="text-sm text-white/60 mt-1">
                Featured Couple / Client: <span className="text-white font-medium">{item.coupleOrClient}</span>
              </p>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2.5 text-sm text-white/75">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#f2a900] shrink-0" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-[#f2a900] shrink-0" />
                <span>{item.cameraGear}</span>
              </div>
            </div>

            <p className="text-sm text-white/70 leading-relaxed pt-2 border-t border-white/10">
              {item.story}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={handleBookSimilar}
              className="w-full bg-[#f2a900] hover:bg-white text-black font-semibold text-sm py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Book a Similar Shoot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-white/45 text-center">
              Press Esc to close or use arrow keys to browse
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
