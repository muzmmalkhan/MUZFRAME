import React from 'react';
import { Building2, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRUSTED_PARTNERS, CLIENT_REVIEWS } from '../data/portfolioData';

export function TrustedBrandsSection() {
  return (
    <section
      id="trusted-by-section"
      className="py-16 sm:py-20 lg:py-24 bg-[#070707] border-y border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Heading & Verifiable Track Record */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <p className="text-[#f2a900] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Proven Track Record · Since 2018
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
              Trusted by Punjab <span className="italic text-[#f2a900]">families & brands</span>
            </h2>
            <p className="text-white/70 text-sm sm:text-base mt-3 leading-relaxed">
              Over 300 covered weddings, bridal shoots, and commercial launch campaigns across Hasilpur, Bahawalpur, Chishtian, and Vehari — backed by verifiable client reviews.
            </p>
          </div>

          {/* Grounded Studio Metrics */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-5 lg:pt-0 lg:pl-8 shrink-0">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#f2a900] font-mono">300+</div>
              <div className="text-xs text-white/60 mt-0.5">Events Delivered</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white font-mono">14 Days</div>
              <div className="text-xs text-white/60 mt-0.5">Avg. Gallery Turnaround</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white font-mono">5+ Yrs</div>
              <div className="text-xs text-white/60 mt-0.5">Studio Experience</div>
            </div>
          </div>
        </div>

        {/* Expanded Client & Commercial Partner Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {TRUSTED_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="p-5 rounded-2xl bg-[#101010] border border-white/10 hover:border-[#f2a900]/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-white/50 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[#f2a900] font-medium">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{partner.location}</span>
                  </span>
                  <span className="font-mono text-white/70">{partner.metric}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-white mb-1">
                  {partner.name}
                </h3>
                <p className="text-xs text-white/50 mb-3">{partner.sector}</p>
                <p className="text-sm text-white/70 leading-relaxed">{partner.summary}</p>
              </div>
              <p className="text-xs text-white/50 pt-4 mt-4 border-t border-white/10">
                {partner.scope}
              </p>
            </div>
          ))}
        </div>

        {/* Attributable Client Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {CLIENT_REVIEWS.map((review) => (
            <article
              key={review.id}
              className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-white/50 mb-4">
                  <span className="text-[#f2a900] font-medium">{review.eventType}</span>
                  <span>{review.location} · {review.date}</span>
                </div>
                <Quote className="w-5 h-5 text-[#f2a900]/60 mb-3" aria-hidden="true" />
                <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-5">
                  “{review.quote}”
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-end justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{review.clientName}</div>
                  <div className="text-xs text-white/50 mt-0.5">{review.packageUsed}</div>
                </div>
                <div className="text-xs text-[#f2a900] text-right font-medium">
                  {review.outcome}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            to="/about"
            className="text-sm text-white/80 hover:text-[#f2a900] inline-flex items-center gap-2 transition-colors font-medium"
          >
            <span>Read our studio story & production workflow</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
