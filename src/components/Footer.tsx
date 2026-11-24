import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MapPin, Phone, Mail, Clock, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { STUDIO_CONTACT } from '../config/studioContact';

export function Footer() {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-[#050505] pt-16 sm:pt-20 pb-24 sm:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              to="/"
              aria-label="MuzFrame Studio Home"
              className="inline-block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2a900]"
            >
              <BrandLogo size="md" />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Wedding photography, 4K cinema films, and twilight drone coverage based in Hasilpur and serving families across Punjab since 2018.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href={STUDIO_CONTACT.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#f2a900] hover:text-[#f2a900] text-white text-xs font-medium inline-flex items-center gap-2 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>{STUDIO_CONTACT.socials.instagramHandle}</span>
              </a>
              <a
                href={STUDIO_CONTACT.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#f2a900] hover:text-[#f2a900] text-white text-xs font-medium inline-flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.66-.21-3.16 1.76-6.19 4.79-7.14 1.1-.35 2.26-.4 3.4-.24v4.06c-1.22-.04-2.45.39-3.26 1.25-.86.91-1.07 2.37-.53 3.51.52 1.09 1.76 1.78 2.97 1.83 1.2.04 2.4-.41 3.2-1.32.74-.83 1.08-1.95 1.07-3.07-.03-5.74-.01-11.48-.02-17.22Z" />
                </svg>
                <span>{STUDIO_CONTACT.socials.tiktokHandle}</span>
              </a>
              <a
                href={STUDIO_CONTACT.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#f2a900] hover:text-[#f2a900] text-white text-xs font-medium inline-flex items-center gap-2 transition-colors"
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-xl font-semibold text-[#f2a900] mb-4">Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/services" className="text-white/70 hover:text-white transition-colors">
                  Wedding Coverage
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-white/70 hover:text-white transition-colors">
                  Bridal Specials
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/70 hover:text-white transition-colors">
                  4K Aerial Drone
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/70 hover:text-white transition-colors">
                  Commercial Films
                </Link>
              </li>
              <li>
                <Link to="/muzbeauty" className="text-white/70 hover:text-white transition-colors">
                  MuzBeauty Line
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Column */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-xl font-semibold text-[#f2a900] mb-4">Studio</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/gallery" className="text-white/70 hover:text-white transition-colors">
                  Portfolio Gallery
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-white/70 hover:text-white transition-colors">
                  Pricing & Compare
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/70 hover:text-[#f2a900] transition-colors">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-[#f2a900] transition-colors">
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column (Selectable business details) */}
          <div className="lg:col-span-4">
            <h3 className="font-serif text-xl font-semibold text-[#f2a900] mb-4">Contact</h3>
            <ul className="space-y-3.5 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#f2a900] shrink-0 mt-1" />
                <span>{STUDIO_CONTACT.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#f2a900] shrink-0" />
                <div>
                  <a
                    href={`tel:${STUDIO_CONTACT.officialPhoneTel}`}
                    className="text-white hover:text-[#f2a900] font-medium font-mono transition-colors select-text"
                  >
                    {STUDIO_CONTACT.officialPhoneDisplay}
                  </a>
                  <span className="text-xs text-white/50 block">Studio Booking Desk · Call & WhatsApp</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#f2a900] shrink-0" />
                <a
                  href={`mailto:${STUDIO_CONTACT.officialEmail}`}
                  className="hover:text-[#f2a900] transition-colors select-text"
                >
                  {STUDIO_CONTACT.officialEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#f2a900] shrink-0" />
                <span className="text-white/60">{STUDIO_CONTACT.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {STUDIO_CONTACT.brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Booking Terms
            </button>
          </div>
        </div>
      </div>

      {/* Legal Information Modal */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={legalModal === 'privacy' ? 'Privacy Policy' : 'Booking Terms'}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="bg-[#111111] border border-white/15 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              aria-label="Close legal dialog"
              className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-2xl font-semibold text-[#f2a900] mb-3">
              {legalModal === 'privacy' ? 'Privacy & Client Gallery Policy' : 'Booking & Delivery Terms'}
            </h3>
            {legalModal === 'privacy' ? (
              <div className="space-y-3 text-sm text-white/75 leading-relaxed">
                <p>
                  Client event galleries, private bridal portraits covered by our female photography crew, and personal phone numbers are stored strictly for booking coordination and protected portal delivery.
                </p>
                <p>
                  Photographs are published in our public portfolio only with client approval. Clients may request private-only storage at any time via our booking desk.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-white/75 leading-relaxed">
                <p>
                  Event dates are confirmed upon receipt of an advance booking deposit and written package agreement. Local Hasilpur shoots carry zero travel surcharge; outstation dates include distance-based crew travel agreed in advance.
                </p>
                <p>
                  Standard turnaround is 10–15 days for digital highlight galleries and 25–30 days for edited 4K films and printed Indian albums.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
