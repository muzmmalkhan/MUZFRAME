import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PORTFOLIO_ASSETS, CLIENT_REVIEWS } from '../data/portfolioData';

export function About() {
  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch mb-16">
          {/* Studio Portrait Visual */}
          <div className="lg:col-span-5 min-w-0 w-full">
            <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-[#101010]">
              <img
                src={PORTFOLIO_ASSETS.showreelCinemaImg}
                alt="MuzFrame Studio cinematographer filming a grand Pakistani wedding entrance on gimbal"
                width={1600}
                height={900}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center block"
              />
            </div>
          </div>

          {/* Story & Verifiable Track Record */}
          <div className="lg:col-span-7 min-w-0 flex flex-col justify-center space-y-6">
            <div>
              <p className="text-[#f2a900] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                Est. 2018 · Hasilpur, Punjab
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight mb-5">
                More than photographers — <span className="italic text-[#f2a900]">visual storytellers.</span>
              </h1>
            </div>

            <div className="space-y-4 text-white/75 text-base leading-relaxed">
              <p>
                Founded in Hasilpur, <strong>MuzFrame Studio</strong> is a dedicated wedding photography and 4K cinema team serving families and commercial brands across Bahawalpur, Chishtian, Vehari, and Southern Punjab.
              </p>
              <p>
                Our production model combines calibrated Sony mirrorless rigs, gimbal stabilization, aerial drone cinematography, and experienced female photographers for comfortable bridal and ladies-hall coverage.
              </p>
            </div>

            {/* Verifiable Claims Paired Directly With Outcomes */}
            <div className="py-6 border-y border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#f2a900] font-mono">5+ Years</div>
                <p className="text-xs text-white/60 mt-1">Continuous studio operation since 2018</p>
              </div>
              <div>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#f2a900] font-mono">300+ Events</div>
                <p className="text-xs text-white/60 mt-1">Weddings, bridals & brand launches</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="font-serif text-3xl sm:text-4xl font-bold text-white font-mono">14 Days</div>
                <p className="text-xs text-white/60 mt-1">Average portal gallery delivery</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#f2a900] shrink-0 mt-1" />
                <span>Dedicated Female Photographers for private events</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#f2a900] shrink-0 mt-1" />
                <span>Dual SD card & cloud backups on every shoot day</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/gallery" className="btn-secondary">
                <span>Explore Portfolio</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Supporting Client Evidence Adjacent to Studio Claims */}
        <section className="pt-12 border-t border-white/10">
          <div className="mb-8">
            <p className="text-[#f2a900] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Client Verification
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
              Verified Client Feedback
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CLIENT_REVIEWS.map((rev) => (
              <div key={rev.id} className="p-6 rounded-2xl bg-[#101010] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#f2a900] font-medium mb-2">
                    {rev.eventType} · {rev.location}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">“{rev.quote}”</p>
                </div>
                <div className="pt-3 border-t border-white/10 text-xs">
                  <div className="font-semibold text-white">{rev.clientName}</div>
                  <div className="text-white/50 mt-0.5">{rev.outcome}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
