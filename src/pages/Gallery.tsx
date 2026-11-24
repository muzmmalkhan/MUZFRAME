import React, { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  PORTFOLIO_ITEMS,
  PortfolioCategory,
} from '../data/portfolioData';
import { PortfolioLightbox } from '../components/PortfolioLightbox';

const CATEGORIES: PortfolioCategory[] = [
  'All',
  'Mehndi',
  'Barat',
  'Walima',
  'Bridal',
  'Pre-wedding',
  'Drone',
];

export function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    selectedCategory === 'All'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="text-[#f2a900] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            MuzFrame Archive · Punjab Weddings
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4">
            Our <span className="italic text-[#f2a900]">Portfolio</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Browse curated wedding commissions by ceremony. Click any photograph to view high-resolution details, shoot location, and camera equipment used.
          </p>
        </div>

        {/* Event-Based Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter portfolio by event category"
          className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            const count =
              category === 'All'
                ? PORTFOLIO_ITEMS.length
                : PORTFOLIO_ITEMS.filter((p) => p.category === category).length;

            return (
              <button
                key={category}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => {
                  setSelectedCategory(category);
                  setLightboxIndex(null);
                }}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#f2a900] text-black border-[#f2a900] font-semibold'
                    : 'bg-[#101010] text-white/75 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {category} <span className={active ? 'text-black/70' : 'text-white/40'}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className="group text-left rounded-2xl overflow-hidden bg-[#101010] border border-white/10 hover:border-[#f2a900]/60 transition-colors flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#141414]">
                <img
                  src={item.image}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading={idx < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-semibold text-[#f2a900]">{item.category}</span>
                  <span className="inline-flex items-center gap-1 text-white/85">
                    <MapPin className="w-3.5 h-3.5 text-[#f2a900]" />
                    {item.location}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white group-hover:text-[#f2a900] transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs text-white/55 mt-1">
                    {item.coupleOrClient} · {item.year}
                  </p>
                </div>
                <p className="text-xs text-white/70 mt-3 pt-3 border-t border-white/10">
                  {item.cameraGear}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Portfolio Bottom Enquiry Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#101010] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
              Planning an upcoming wedding or bridal shoot?
            </h2>
            <p className="text-sm text-white/70 mt-1">
              Check date availability or compare our all-inclusive photo and 4K video packages.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/packages" className="btn-secondary">
              View Packages
            </Link>
            <Link to="/contact" className="btn-primary">
              <span>Book Your Date</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Fullscreen Shoot Lightbox */}
      <PortfolioLightbox
        items={filteredItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
