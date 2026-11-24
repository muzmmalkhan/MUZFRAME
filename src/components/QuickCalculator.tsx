import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Check,
  Minus,
  Plus,
  ChevronDown,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { buildWhatsAppUrl, STUDIO_CONTACT } from '../config/studioContact';

const RATE_MIRRORLESS = 10000;
const RATE_DSLR = 7000;
const RATE_FEMALE_PHOTOGRAPHER = 10000;
const RATE_INDIAN_ALBUM_1 = 12000;
const RATE_INDIAN_ALBUM_2 = 22000;

const STANDARD_EVENTS = ['Mehndi', 'Barat', 'Walima'] as const;

export function QuickCalculator() {
  const { user } = useAuth();

  const [selectedEvents, setSelectedEvents] = useState<string[]>(['Barat']);
  const [days, setDays] = useState(1);

  const [mirrorlessCameras, setMirrorlessCameras] = useState(1);
  const [dslrCameras, setDslrCameras] = useState(0);
  const [femalePhotographers, setFemalePhotographers] = useState(0);
  const [drones, setDrones] = useState(0); // 0: None, 1: Barat, 2: Walima, 3: Both
  const [indianAlbums, setIndianAlbums] = useState(0); // 0..3
  const [venue, setVenue] = useState('Hasilpur');

  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string; cameras?: string; submit?: string }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedQuoteData, setSubmittedQuoteData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (!contactName) setContactName(user.name || '');
      if (!contactPhone) setContactPhone(user.phone || '');
    }
  }, [user]);

  const toggleEvent = (event: string) => {
    let nextEvents: string[];
    if (selectedEvents.includes(event)) {
      if (selectedEvents.length === 1) return;
      nextEvents = selectedEvents.filter((e) => e !== event);
    } else {
      nextEvents = [...selectedEvents, event];
    }

    nextEvents.sort(
      (a, b) =>
        STANDARD_EVENTS.indexOf(a as (typeof STANDARD_EVENTS)[number]) -
        STANDARD_EVENTS.indexOf(b as (typeof STANDARD_EVENTS)[number])
    );
    setSelectedEvents(nextEvents);
    setDays(nextEvents.length);
  };

  const handleDaysAdjust = (delta: number) => {
    const nextDays = Math.max(1, Math.min(5, days + delta));
    setDays(nextDays);
    if (nextDays >= 3) {
      setSelectedEvents(['Mehndi', 'Barat', 'Walima']);
    } else if (nextDays === 2) {
      setSelectedEvents(['Mehndi', 'Barat']);
    } else {
      setSelectedEvents(['Barat']);
    }
  };

  const totalCameras = mirrorlessCameras + dslrCameras;

  const indianAlbumCost = useMemo(() => {
    if (indianAlbums === 1) return RATE_INDIAN_ALBUM_1;
    if (indianAlbums === 2) return RATE_INDIAN_ALBUM_2;
    if (indianAlbums >= 3) return RATE_INDIAN_ALBUM_2 + (indianAlbums - 2) * 10000;
    return 0;
  }, [indianAlbums]);

  const droneCost = useMemo(() => {
    if (drones === 1 || drones === 2) return 5000;
    if (drones === 3) return 10000;
    return 0;
  }, [drones]);

  const travelCost = venue === 'Chistian' ? 5000 : 0;

  const estimatedPrice = useMemo(() => {
    const dailyEquipmentRate =
      mirrorlessCameras * RATE_MIRRORLESS +
      dslrCameras * RATE_DSLR +
      femalePhotographers * RATE_FEMALE_PHOTOGRAPHER;

    return dailyEquipmentRate * days + droneCost + indianAlbumCost + travelCost;
  }, [days, mirrorlessCameras, dslrCameras, femalePhotographers, droneCost, indianAlbumCost, travelCost]);

  useEffect(() => {
    if (user && !submitted) {
      const pendingStr = localStorage.getItem('pendingQuote');
      if (pendingStr) {
        try {
          const pendingQuote = JSON.parse(pendingStr);
          if (Date.now() - pendingQuote.time < 1000 * 60 * 60) {
            submitQuote(pendingQuote.data);
          }
          localStorage.removeItem('pendingQuote');
        } catch {
          localStorage.removeItem('pendingQuote');
        }
      }
    }
  }, [user, submitted]);

  const submitQuote = async (quoteData: any) => {
    setIsSubmitting(true);
    setFieldErrors({});
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
      });
      if (!res.ok) throw new Error('Failed to send quote');
      setSubmittedQuoteData(quoteData);
      setSubmitted(true);
    } catch {
      setFieldErrors({ submit: 'Could not submit your quote. Please try again or contact us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = contactName.trim() || user?.name || '';
    const finalPhone = contactPhone.trim() || user?.phone || '';

    const nextErrors: { name?: string; phone?: string; cameras?: string } = {};
    if (!finalName) {
      nextErrors.name = 'Full name is required.';
    }
    if (!finalPhone || finalPhone.replace(/\D/g, '').length < 7) {
      nextErrors.phone = 'Enter a valid mobile or WhatsApp number.';
    }
    if (totalCameras === 0) {
      nextErrors.cameras = 'Select at least one camera unit (Mirrorless or DSLR).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    let cameraTypeDesc = '';
    if (mirrorlessCameras > 0 && dslrCameras > 0) {
      cameraTypeDesc = `${mirrorlessCameras}x Mirrorless + ${dslrCameras}x DSLR`;
    } else if (mirrorlessCameras > 0) {
      cameraTypeDesc = `${mirrorlessCameras}x Mirrorless`;
    } else {
      cameraTypeDesc = `${dslrCameras}x DSLR`;
    }

    const droneCoverageDesc =
      drones === 0
        ? 'No Drone'
        : drones === 1
        ? 'Barat (Rs. 5,000)'
        : drones === 2
        ? 'Walima (Rs. 5,000)'
        : 'Barat & Walima (Rs. 10,000)';

    const quoteData = {
      days,
      events: selectedEvents,
      mirrorless: mirrorlessCameras,
      dslr: dslrCameras,
      cameraType: cameraTypeDesc,
      cameras: totalCameras,
      femalePhotographers,
      drones,
      droneCoverage: droneCoverageDesc,
      indianAlbums,
      indianAlbumCost,
      venue,
      delivery: 'Cloud Gallery (Online Client Portal)',
      estimatedPrice,
      clientName: finalName,
      clientPhone: finalPhone,
      userId: user?.id || null,
    };

    submitQuote(quoteData);
  };

  const applyPreset = (preset: 'single' | 'twoDay' | 'fullWedding') => {
    setFieldErrors({});
    if (preset === 'single') {
      setSelectedEvents(['Barat']);
      setDays(1);
      setMirrorlessCameras(1);
      setDslrCameras(0);
      setFemalePhotographers(0);
      setDrones(0);
      setIndianAlbums(0);
      setVenue('Hasilpur');
    } else if (preset === 'twoDay') {
      setSelectedEvents(['Mehndi', 'Barat']);
      setDays(2);
      setMirrorlessCameras(1);
      setDslrCameras(1);
      setFemalePhotographers(0);
      setDrones(1);
      setIndianAlbums(1);
      setVenue('Hasilpur');
    } else {
      setSelectedEvents(['Mehndi', 'Barat', 'Walima']);
      setDays(3);
      setMirrorlessCameras(1);
      setDslrCameras(1);
      setFemalePhotographers(1);
      setDrones(3);
      setIndianAlbums(2);
      setVenue('Hasilpur');
    }
  };

  const scrollToSummary = () => {
    const el = document.getElementById('calc-summary-card');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-6xl mx-auto bg-[#0c0c0c] border border-white/15 rounded-2xl p-5 sm:p-8 lg:p-10">
      {/* Header & Pricing Context */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 mb-6 border-b border-white/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f2a900]/15 border border-[#f2a900]/30 flex items-center justify-center shrink-0">
            <Calculator className="w-6 h-6 text-[#f2a900]" />
          </div>
          <div>
            <p className="text-[#f2a900] text-xs font-semibold uppercase tracking-[0.2em] mb-1">
              Instant Estimate Calculator
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
              Build Your Custom Quote
            </h2>
            <p className="text-white/70 text-sm mt-1.5 max-w-2xl">
              Single-camera day rates start at <span className="text-white font-medium">Rs. 10,000/day</span> (Mirrorless) or <span className="text-white font-medium">Rs. 7,000/day</span> (DSLR). Prefer a fixed bundle?{' '}
              <Link to="/packages" className="text-[#f2a900] hover:underline font-medium">
                View wedding packages from Rs. 45,000
              </Link>
              .
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => applyPreset('single')}
          className="self-start lg:self-end text-xs font-medium text-white/70 hover:text-[#f2a900] border border-white/15 hover:border-[#f2a900]/50 px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default</span>
        </button>
      </div>

      {/* 1-Click Quick Presets */}
      <div className="mb-6">
        <p className="text-xs font-medium text-white/60 mb-2.5">
          Quick Start Presets — tap one to fill common setups, then customize below:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset('single')}
            className="text-left p-3.5 rounded-xl bg-[#121212] border border-white/10 hover:border-[#f2a900]/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white">Single Event</span>
              <span className="text-xs font-mono text-[#f2a900]">Rs. 10,000</span>
            </div>
            <p className="text-xs text-white/60 mt-1">1 Day · 1 Mirrorless Camera</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('twoDay')}
            className="text-left p-3.5 rounded-xl bg-[#121212] border border-white/10 hover:border-[#f2a900]/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white">2-Day Standard</span>
              <span className="text-xs font-mono text-[#f2a900]">Rs. 51,000</span>
            </div>
            <p className="text-xs text-white/60 mt-1">Mehndi + Barat · Drone + 1 Album</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('fullWedding')}
            className="text-left p-3.5 rounded-xl bg-[#121212] border border-white/10 hover:border-[#f2a900]/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white">3-Day Complete</span>
              <span className="text-xs font-mono text-[#f2a900]">Rs. 113,000</span>
            </div>
            <p className="text-xs text-white/60 mt-1">All 3 Days · Male + Female Crew + Drone + 2 Albums</p>
          </button>
        </div>
      </div>

      {/* Mobile Sticky Live Total Bar */}
      <div className="lg:hidden sticky top-20 z-30 mb-6 bg-[#141414]/95 backdrop-blur-md border border-[#f2a900]/40 rounded-xl p-3.5 flex items-center justify-between gap-3">
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-white/60">
            Live Estimate ({days} {days === 1 ? 'Day' : 'Days'})
          </span>
          <span className="font-mono text-xl font-bold text-[#f2a900]">
            Rs. {estimatedPrice.toLocaleString()}
          </span>
        </div>
        <button
          type="button"
          onClick={scrollToSummary}
          className="bg-[#f2a900] hover:bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
        >
          <span>Review & Book</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left: Simplified Non-Duplicate Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Events & Shoot Days */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">1. Event Functions & Coverage Days</h3>
                <p className="text-xs text-white/60 mt-0.5">Select functions or adjust total shooting days (up to 5 days).</p>
              </div>
              <div className="flex items-center gap-2 bg-black border border-white/15 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => handleDaysAdjust(-1)}
                  disabled={days <= 1}
                  aria-label="Decrease shoot days"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-2.5 text-sm font-mono font-semibold text-[#f2a900] min-w-[68px] text-center">
                  {days} {days === 1 ? 'Day' : 'Days'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDaysAdjust(1)}
                  disabled={days >= 5}
                  aria-label="Increase shoot days"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {STANDARD_EVENTS.map((evt) => {
                const isSelected = selectedEvents.includes(evt);
                return (
                  <button
                    key={evt}
                    type="button"
                    onClick={() => toggleEvent(evt)}
                    aria-pressed={isSelected}
                    className={`min-h-[44px] py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#f2a900] text-black border-[#f2a900] font-semibold'
                        : 'bg-black/60 text-white/80 border-white/15 hover:border-white/35'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                    <span>{evt}</span>
                  </button>
                );
              })}
            </div>
            {days > 3 && (
              <p className="text-xs text-[#f2a900] mt-3">
                Includes {selectedEvents.join(', ')} plus {days - 3} additional shoot {days - 3 === 1 ? 'day' : 'days'}.
              </p>
            )}
          </div>

          {/* 2. Camera & Crew Steppers (Consistent Gold/Black Controls, No Duplicate Sliders) */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-white">2. Cameras & Photography Crew</h3>
              <p className="text-xs text-white/60 mt-0.5">Choose daily equipment units multiplied by your selected coverage days.</p>
            </div>

            {/* Mirrorless */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">Mirrorless 4K Camera</span>
                  <span className="text-xs font-mono text-[#f2a900]">Rs. 10,000 / day</span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">Sony FX3 / A7IV cinema video and low-light portrait units.</p>
              </div>
              <div className="flex items-center gap-2 bg-black border border-white/15 rounded-xl p-1 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => { setMirrorlessCameras(Math.max(0, mirrorlessCameras - 1)); setFieldErrors((p) => ({ ...p, cameras: undefined })); }}
                  disabled={mirrorlessCameras <= 0}
                  aria-label="Decrease mirrorless cameras"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-mono text-sm font-semibold text-white">
                  {mirrorlessCameras}
                </span>
                <button
                  type="button"
                  onClick={() => { setMirrorlessCameras(Math.min(4, mirrorlessCameras + 1)); setFieldErrors((p) => ({ ...p, cameras: undefined })); }}
                  disabled={mirrorlessCameras >= 4}
                  aria-label="Increase mirrorless cameras"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* DSLR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">Full-Frame DSLR Camera</span>
                  <span className="text-xs font-mono text-[#f2a900]">Rs. 7,000 / day</span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">Traditional stage lighting, guest portraits, and group coverage.</p>
              </div>
              <div className="flex items-center gap-2 bg-black border border-white/15 rounded-xl p-1 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => { setDslrCameras(Math.max(0, dslrCameras - 1)); setFieldErrors((p) => ({ ...p, cameras: undefined })); }}
                  disabled={dslrCameras <= 0}
                  aria-label="Decrease DSLR cameras"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-mono text-sm font-semibold text-white">
                  {dslrCameras}
                </span>
                <button
                  type="button"
                  onClick={() => { setDslrCameras(Math.min(4, dslrCameras + 1)); setFieldErrors((p) => ({ ...p, cameras: undefined })); }}
                  disabled={dslrCameras >= 4}
                  aria-label="Increase DSLR cameras"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Female Photographer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">Female Photographer</span>
                  <span className="text-xs font-mono text-[#f2a900]">Rs. 10,000 / day</span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">Dedicated female coverage for bridal prep and ladies family halls.</p>
              </div>
              <div className="flex items-center gap-2 bg-black border border-white/15 rounded-xl p-1 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setFemalePhotographers(Math.max(0, femalePhotographers - 1))}
                  disabled={femalePhotographers <= 0}
                  aria-label="Decrease female photographers"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-mono text-sm font-semibold text-white">
                  {femalePhotographers}
                </span>
                <button
                  type="button"
                  onClick={() => setFemalePhotographers(Math.min(3, femalePhotographers + 1))}
                  disabled={femalePhotographers >= 3}
                  aria-label="Increase female photographers"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {fieldErrors.cameras && (
              <p className="text-red-400 text-xs flex items-center gap-1.5 pt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fieldErrors.cameras}</span>
              </p>
            )}
          </div>

          {/* 3. Drone Aerial Coverage */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-1">3. 4K Aerial Drone Coverage</h3>
            <p className="text-xs text-white/60 mb-4">Add exterior marquee flights, fireworks, and arrival shots.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { val: 0, label: 'None', priceTag: 'Rs. 0' },
                { val: 1, label: 'Barat Only', priceTag: 'Rs. 5,000' },
                { val: 2, label: 'Walima Only', priceTag: 'Rs. 5,000' },
                { val: 3, label: 'Barat + Walima', priceTag: 'Rs. 10,000' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setDrones(opt.val)}
                  aria-pressed={drones === opt.val}
                  className={`min-h-[54px] py-2.5 px-3 rounded-xl border text-center transition-colors flex flex-col items-center justify-center cursor-pointer ${
                    drones === opt.val
                      ? 'bg-[#f2a900] text-black border-[#f2a900]'
                      : 'bg-black/60 text-white/80 border-white/15 hover:border-white/35'
                  }`}
                >
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <span className={`text-xs font-mono mt-0.5 ${drones === opt.val ? 'text-black/80 font-semibold' : 'text-[#f2a900]'}`}>
                    {opt.priceTag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Printed Indian Albums */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-1">4. Printed Indian Albums</h3>
            <p className="text-xs text-white/60 mb-4">Hardbound lay-flat metallic prints with presentation box (bundle discount on 2+ albums).</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { val: 0, label: 'Digital Only', priceTag: 'Rs. 0' },
                { val: 1, label: '1 Album', priceTag: 'Rs. 12,000' },
                { val: 2, label: '2 Albums', priceTag: 'Rs. 22,000' },
                { val: 3, label: '3 Albums', priceTag: 'Rs. 32,000' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setIndianAlbums(opt.val)}
                  aria-pressed={indianAlbums === opt.val}
                  className={`min-h-[54px] py-2.5 px-3 rounded-xl border text-center transition-colors flex flex-col items-center justify-center cursor-pointer ${
                    indianAlbums === opt.val
                      ? 'bg-[#f2a900] text-black border-[#f2a900]'
                      : 'bg-black/60 text-white/80 border-white/15 hover:border-white/35'
                  }`}
                >
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <span className={`text-xs font-mono mt-0.5 ${indianAlbums === opt.val ? 'text-black/80 font-semibold' : 'text-[#f2a900]'}`}>
                    {opt.priceTag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Venue City */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10">
            <label htmlFor="calc-venue" className="block text-sm font-semibold text-white mb-2">
              5. Event City / Venue Location <span className="text-[#f2a900]">*</span>
            </label>
            <div className="relative">
              <select
                id="calc-venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full appearance-none bg-black border border-white/20 rounded-xl py-3.5 pl-4 pr-10 text-sm sm:text-base text-white focus:outline-none focus:border-[#f2a900] cursor-pointer [color-scheme:dark]"
              >
                <option value="Hasilpur">Hasilpur (No travel charge)</option>
                <option value="Chistian">Chishtian (+ Rs. 5,000 travel)</option>
                <option value="Others">Other Cities (Distance-based travel quote)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-white/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Clear Price Breakdown & Enquiry Form */}
        <div id="calc-summary-card" className="lg:col-span-5 scroll-mt-24">
          <div className="bg-[#121212] border border-[#f2a900]/45 rounded-2xl p-6 sm:p-7 sticky top-24">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Estimated Total
              </span>
              <span className="text-xs text-[#f2a900] font-medium">Custom Add-On Rate</span>
            </div>

            <div className="font-serif text-4xl sm:text-5xl font-bold text-white font-mono mb-2">
              <span className="text-xl text-[#f2a900] mr-1.5 font-sans">Rs.</span>
              {estimatedPrice.toLocaleString()}
            </div>
            <p className="text-xs text-white/60 mb-6">
              Includes {days} {days === 1 ? 'day' : 'days'} coverage, color grading, and private online gallery delivery.
            </p>

            {/* Itemized Breakdown */}
            <div className="space-y-2.5 bg-black/60 border border-white/10 p-4 rounded-xl mb-6 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-white/60">Events ({days}d)</span>
                <span className="text-white font-medium text-right">{selectedEvents.join(', ')}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-white/60">Mirrorless ({mirrorlessCameras} × {days}d)</span>
                <span className="font-mono text-white">
                  Rs. {(mirrorlessCameras * RATE_MIRRORLESS * days).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-white/60">DSLR ({dslrCameras} × {days}d)</span>
                <span className="font-mono text-white">
                  Rs. {(dslrCameras * RATE_DSLR * days).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-white/60">Female Crew ({femalePhotographers} × {days}d)</span>
                <span className="font-mono text-white">
                  Rs. {(femalePhotographers * RATE_FEMALE_PHOTOGRAPHER * days).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-white/60">Aerial Drone</span>
                <span className="font-mono text-white">Rs. {droneCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-white/60">Indian Albums ({indianAlbums})</span>
                <span className="font-mono text-white">Rs. {indianAlbumCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-3 pt-2 border-t border-white/10">
                <span className="text-white/60">Location ({venue})</span>
                <span className="font-mono text-[#f2a900]">
                  {venue === 'Others' ? 'Quoted on call' : `Rs. ${travelCost.toLocaleString()}`}
                </span>
              </div>
            </div>

            {submitted ? (
              <div className="space-y-4">
                <div className="bg-[#f2a900]/10 border border-[#f2a900]/40 p-5 rounded-xl text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#f2a900] mx-auto mb-2" />
                  <h4 className="font-serif text-xl font-semibold text-white mb-1">
                    Quotation Received
                  </h4>
                  <p className="text-sm text-white/75">
                    Our booking team has received your custom breakdown and will confirm availability shortly.
                  </p>
                </div>

                {submittedQuoteData && (
                  <a
                    href={buildWhatsAppUrl(
                      `Assalam-o-Alaikum MuzFrame Studio! Here is my custom quote from the website estimator:\n\nName: ${submittedQuoteData.clientName}\nPhone: ${submittedQuoteData.clientPhone}\nEvents: ${submittedQuoteData.events?.join(', ')} (${submittedQuoteData.days} Days)\nEquipment: ${submittedQuoteData.cameraType}, Female Staff: ${submittedQuoteData.femalePhotographers}, Drone: ${submittedQuoteData.droneCoverage}\nAlbums: ${submittedQuoteData.indianAlbums}\nCity: ${submittedQuoteData.venue}\nEstimated Total: Rs. ${Number(submittedQuoteData.estimatedPrice || 0).toLocaleString()}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#f2a900] hover:bg-white text-black font-semibold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Send Breakdown via WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmittedQuoteData(null);
                  }}
                  className="w-full text-center text-white/70 hover:text-white text-sm py-2 cursor-pointer"
                >
                  Modify Custom Estimate
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} noValidate className="space-y-4">
                <div>
                  <label htmlFor="calc-client-name" className="block text-sm font-medium text-white mb-1.5">
                    Full Name <span className="text-[#f2a900]">*</span>
                  </label>
                  <input
                    id="calc-client-name"
                    type="text"
                    required
                    placeholder="e.g. Bilal Ahmed"
                    value={contactName}
                    aria-invalid={!!fieldErrors.name}
                    onChange={(e) => {
                      setContactName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
                    }}
                    className={`w-full bg-black border ${
                      fieldErrors.name ? 'border-red-500' : 'border-white/20'
                    } focus:border-[#f2a900] rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none`}
                  />
                  {fieldErrors.name && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="calc-client-phone" className="block text-sm font-medium text-white mb-1.5">
                    Mobile / WhatsApp Number <span className="text-[#f2a900]">*</span>
                  </label>
                  <input
                    id="calc-client-phone"
                    type="tel"
                    required
                    placeholder={`e.g. ${STUDIO_CONTACT.officialPhoneDisplay}`}
                    value={contactPhone}
                    aria-invalid={!!fieldErrors.phone}
                    onChange={(e) => {
                      setContactPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
                    }}
                    className={`w-full bg-black border ${
                      fieldErrors.phone ? 'border-red-500' : 'border-white/20'
                    } focus:border-[#f2a900] rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                {fieldErrors.submit && (
                  <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
                    {fieldErrors.submit}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[48px] bg-[#f2a900] hover:bg-white text-black py-3.5 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Quote...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Custom Quote</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
