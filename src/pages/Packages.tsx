import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  PhoneCall,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QuickCalculator } from '../components/QuickCalculator';
import { ALL_PACKAGES, PackageItem } from '../data/packagesData';
import { STUDIO_CONTACT } from '../config/studioContact';

export function Packages() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'wedding' | 'bridal'>('wedding');
  const [durationFilter, setDurationFilter] = useState<'all' | '1day' | '2days'>('all');
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

  const toggleFeatures = (pkgId: string) => {
    setExpandedFeatures((prev) => ({ ...prev, [pkgId]: !prev[pkgId] }));
  };

  const filteredPackages = ALL_PACKAGES.filter((pkg) => {
    if (pkg.category !== activeCategory) return false;
    if (durationFilter === '1day' && pkg.days !== 1) return false;
    if (durationFilter === '2days' && pkg.days !== 2) return false;
    return true;
  });

  const handleBookPackage = (pkg: PackageItem) => {
    const pkgString = `${pkg.code} — ${pkg.name} (${pkg.price})`;
    navigate(`/contact?package=${encodeURIComponent(pkgString)}`);
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Page Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="text-[#f2a900] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Transparent Studio Rates · Hasilpur & Punjab
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight">
            Wedding & Bridal <span className="italic text-[#f2a900]">Packages</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Every bundled package includes color-graded digital editing, private online gallery delivery, and transparent crew allocation.
          </p>
        </div>

        {/* Category Switcher & Duration Filter */}
        <div className="flex flex-col items-center gap-4 mb-10 sm:mb-12">
          <div className="grid grid-cols-2 p-1.5 rounded-xl bg-[#111111] border border-white/15 w-full max-w-md">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('wedding');
                setDurationFilter('all');
              }}
              className={`min-h-[44px] py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'wedding'
                  ? 'bg-[#f2a900] text-black'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              Wedding Packages (6)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('bridal');
                setDurationFilter('all');
              }}
              className={`min-h-[44px] py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'bridal'
                  ? 'bg-[#f2a900] text-black'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              Bridal Specials (4)
            </button>
          </div>

          {activeCategory === 'wedding' && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { key: 'all', label: 'All Wedding Tiers' },
                { key: '1day', label: '1 Day Events' },
                { key: '2days', label: '2 Days Full Weddings' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setDurationFilter(opt.key as 'all' | '1day' | '2days')}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    durationFilter === opt.key
                      ? 'bg-white/15 text-[#f2a900] border-[#f2a900]/50'
                      : 'bg-[#101010] text-white/70 border-white/10 hover:border-white/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clean Package Cards Grid (No duplicate deliverables boxes, single clear CTA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredPackages.map((pkg) => {
            const isExpanded = !!expandedFeatures[pkg.id];
            const visibleItems = isExpanded ? pkg.includes : pkg.includes.slice(0, 5);

            return (
              <article
                key={pkg.id}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-colors ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-[#171307] to-[#0c0c0c] border border-[#f2a900]/70'
                    : 'bg-[#101010] border border-white/10 hover:border-white/25'
                }`}
              >
                <div>
                  {/* Quiet Top Metadata + Professional Badge */}
                  <div className="flex items-center justify-between gap-2 text-xs mb-3">
                    <div className="flex items-center gap-2 text-white/60">
                      <span className="text-[#f2a900] font-semibold">{pkg.code}</span>
                      <span aria-hidden="true">·</span>
                      <span>{pkg.coverage}</span>
                    </div>
                    {pkg.badge && (
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                          pkg.isPopular
                            ? 'bg-[#f2a900] text-black'
                            : 'bg-white/10 text-white/90 border border-white/15'
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Price */}
                  <div className="pb-4 border-b border-white/10">
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
                      {pkg.name}
                    </h2>
                    <div className="font-serif text-3xl sm:text-4xl font-bold text-[#f2a900] font-mono mt-2">
                      {pkg.price}
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed mt-3">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Single Expandable Deliverables List */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                        Included Deliverables ({pkg.includes.length})
                      </span>
                      {pkg.includes.length > 5 && (
                        <button
                          type="button"
                          onClick={() => toggleFeatures(pkg.id)}
                          className="text-xs text-[#f2a900] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Show less' : `Show all ${pkg.includes.length}`}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>

                    <ul className="space-y-2.5">
                      {visibleItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-white/85">
                          <Check className="w-4 h-4 text-[#f2a900] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Single Clear Enquiry Action */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleBookPackage(pkg)}
                    className={`w-full min-h-[46px] py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      pkg.isPopular
                        ? 'bg-[#f2a900] text-black hover:bg-white'
                        : 'bg-transparent text-white border border-white/25 hover:border-[#f2a900] hover:text-[#f2a900]'
                    }`}
                  >
                    <span>Book {pkg.name} Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Always-Visible Responsive Package Comparison Table */}
        <section aria-labelledby="comparison-heading" className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <p className="text-[#f2a900] text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                Side-by-Side Comparison
              </p>
              <h2 id="comparison-heading" className="font-serif text-2xl sm:text-3xl font-semibold text-white">
                Compare {activeCategory === 'wedding' ? 'Wedding' : 'Bridal'} Packages
              </h2>
            </div>
            <p className="text-xs text-white/50 sm:text-right">
              Scroll horizontally on mobile to compare every specification.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-[#0c0c0c] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[740px]">
                <thead>
                  <tr className="border-b border-white/10 bg-[#141414] text-xs uppercase tracking-wider text-white/60">
                    <th className="p-4 font-semibold sticky left-0 bg-[#141414] z-10">Package</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Duration</th>
                    <th className="p-4 font-semibold">Camera & Crew</th>
                    <th className="p-4 font-semibold">Aerial Drone</th>
                    <th className="p-4 font-semibold">Female Crew</th>
                    <th className="p-4 font-semibold">Albums</th>
                    <th className="p-4 font-semibold text-right">Select</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredPackages.map((pkg) => (
                    <tr
                      key={`row-${pkg.id}`}
                      className={pkg.isPopular ? 'bg-[#f2a900]/[0.06]' : 'hover:bg-white/[0.02]'}
                    >
                      <td className="p-4 font-medium text-white sticky left-0 bg-[#0c0c0c] z-10">
                        <div className="font-semibold">{pkg.name}</div>
                        <div className="text-xs text-white/50">{pkg.code}</div>
                      </td>
                      <td className="p-4 font-mono font-semibold text-[#f2a900] whitespace-nowrap">
                        {pkg.price}
                      </td>
                      <td className="p-4 text-white/80 whitespace-nowrap">{pkg.coverage}</td>
                      <td className="p-4 text-white/80">{pkg.camerasSummary}</td>
                      <td className="p-4 text-white/80 whitespace-nowrap">{pkg.droneSummary}</td>
                      <td className="p-4 text-white/80 whitespace-nowrap">{pkg.femaleCrewSummary}</td>
                      <td className="p-4 text-white/80 whitespace-nowrap">{pkg.albumSummary}</td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleBookPackage(pkg)}
                          className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-[#f2a900]/60 text-[#f2a900] hover:bg-[#f2a900] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Consistent Business Contact & Guarantee Strip */}
        <div className="mb-16 p-6 sm:p-8 rounded-2xl bg-[#101010] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f2a900]/15 border border-[#f2a900]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#f2a900]" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white">
                Dual-Camera Backup & Written Booking Agreement
              </h3>
              <p className="text-sm text-white/70 mt-1 max-w-2xl">
                Questions about outstation travel or custom multi-event pricing? Reach our studio booking desk directly at{' '}
                <a
                  href={`tel:${STUDIO_CONTACT.officialPhoneTel}`}
                  className="text-[#f2a900] font-mono font-medium hover:underline select-text"
                >
                  {STUDIO_CONTACT.officialPhoneDisplay}
                </a>
                .
              </p>
            </div>
          </div>
          <a
            href={`tel:${STUDIO_CONTACT.officialPhoneTel}`}
            className="shrink-0 btn-secondary whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4 text-[#f2a900]" />
            <span>Call Booking Desk</span>
          </a>
        </div>

        {/* Custom Estimator Anchor */}
        <section id="custom-calculator" className="scroll-mt-24">
          <QuickCalculator />
        </section>
      </div>
    </div>
  );
}
