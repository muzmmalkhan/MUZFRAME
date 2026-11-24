import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Calendar,
  Clock,
  ChevronDown,
  Check,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDisplayDate } from '../utils/dateFormatter';
import { ALL_PACKAGES } from '../data/packagesData';
import { STUDIO_CONTACT, buildWhatsAppUrl } from '../config/studioContact';

export function Contact() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    package: searchParams.get('package') || 'None selected',
    budget: '',
    message: '',
  });

  useEffect(() => {
    const pkgFromQuery = searchParams.get('package');
    if (pkgFromQuery) {
      setFormData((prev) => ({ ...prev, package: pkgFromQuery }));
    }
  }, [searchParams]);

  const [events, setEvents] = useState<
    {
      type: string;
      customType: string;
      date: string;
      startTime: string;
      endTime: string;
      startLocation: string;
      endLocation: string;
      selected: boolean;
    }[]
  >([
    { type: 'Mehndi', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
    { type: 'Barat', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
    { type: 'Walima', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
    { type: 'Nikkah', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
    { type: 'Birthday', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
    { type: 'Other', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedWaUrl, setSubmittedWaUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/blocked-dates')
      .then((r) => {
        if (!r.ok || !r.headers.get('content-type')?.includes('application/json')) return [];
        return r.json();
      })
      .then((d) => setBlockedDates(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const toggleEvent = (index: number) => {
    const newEvents = [...events];
    newEvents[index].selected = !newEvents[index].selected;
    setEvents(newEvents);
    if (errors.events) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.events;
        return next;
      });
    }
  };

  const handleEventChange = (index: number, field: string, value: string) => {
    if (field === 'date') {
      const isBlocked = blockedDates.find((b) => b.date === value);
      if (isBlocked) {
        setErrors((prev) => ({
          ...prev,
          [`date_${events[index].type}`]: `This date is already booked: ${isBlocked.reason}`,
        }));
        return;
      }
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${field}_${events[index].type}`];
      if (field === 'customType') delete next[`custom_${events[index].type}`];
      return next;
    });

    const newEvents = [...events];
    (newEvents[index] as any)[field] = value;
    setEvents(newEvents);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Enter a valid mobile or WhatsApp number.';
    }

    const selectedEvents = events.filter((e) => e.selected);
    if (selectedEvents.length === 0) {
      newErrors.events = 'Please select at least one event function.';
    } else {
      selectedEvents.forEach((e) => {
        if (!e.date) newErrors[`date_${e.type}`] = 'Event date is required.';
        if (!e.startTime) newErrors[`startTime_${e.type}`] = 'Start time required.';
        if (!e.endTime) newErrors[`endTime_${e.type}`] = 'End time required.';
        if (!e.startLocation.trim()) newErrors[`startLocation_${e.type}`] = 'Venue location is required.';
        if (e.type === 'Barat' && !e.endLocation.trim()) {
          newErrors[`endLocation_${e.type}`] = 'Arrival location is required.';
        }
        if (e.type === 'Other' && !e.customType.trim()) {
          newErrors[`custom_${e.type}`] = 'Please specify the event type.';
        }
      });
    }

    if (formData.package === 'None selected') newErrors.package = 'Please choose a package or Custom Quote.';
    if (formData.package === 'Custom Quote' && !formData.budget.trim()) {
      newErrors.budget = 'Please enter your estimated budget.';
    }
    if (!formData.message.trim()) newErrors.message = 'Please add brief shoot notes or requirements.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const selectedEvents = events.filter((ev) => ev.selected);
    const chosenPackage =
      formData.package === 'Custom Quote'
        ? `Custom Quote (Budget: Rs. ${formData.budget})`
        : formData.package;

    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `CLI-${Date.now()}`,
          name: formData.name.trim(),
          email: 'Pending',
          phone: formData.phone.trim(),
          location: selectedEvents[0]?.startLocation || 'Hasilpur',
          eventName: 'Booking Inquiry',
          eventType: selectedEvents.map((ev) => (ev.type === 'Other' ? ev.customType : ev.type)).join(', '),
          eventDate: selectedEvents.map((ev) => `${formatDisplayDate(ev.date)} ${ev.startTime}-${ev.endTime}`).join(', '),
          package: chosenPackage,
          status: 'pending',
          totalAmount: 0,
          paidAmount: 0,
        }),
      });

      await Promise.all(
        selectedEvents.map((ev, idx) => {
          const typeName = ev.type === 'Other' ? ev.customType : ev.type;
          const loc = ev.type === 'Barat' ? `${ev.startLocation} to ${ev.endLocation}` : ev.startLocation;
          return fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: `EVT-${Date.now()}-${idx}`,
              clientName: formData.name.trim(),
              eventName: `${formData.name.trim()}'s ${typeName}`,
              eventType: typeName,
              date: ev.date,
              venue: loc,
              teamLead: 'Pending Assignment',
              packageDetails: chosenPackage,
              status: 'Upcoming',
              deliverablesCount: 0,
            }),
          });
        })
      );
    } catch (err) {
      console.error('Failed to post client inquiry', err);
    }

    let eventsText = '';
    selectedEvents.forEach((ev) => {
      const typeName = ev.type === 'Other' ? ev.customType : ev.type;
      const loc = ev.type === 'Barat' ? `${ev.startLocation} to ${ev.endLocation}` : ev.startLocation;
      eventsText += `\n- ${typeName}: ${formatDisplayDate(ev.date)} (${ev.startTime} - ${ev.endTime}) at ${loc}`;
    });

    const waText = `Assalam-o-Alaikum MuzFrame Studio!\n\nName: ${formData.name.trim()}\nPhone: ${formData.phone.trim()}\nEvents:${eventsText}\n\nPackage: ${chosenPackage}\nNotes: ${formData.message.trim()}`;
    const waUrl = buildWhatsAppUrl(waText);

    setIsSubmitting(false);
    setSubmittedWaUrl(waUrl);
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', package: 'None selected', budget: '', message: '' });
    setEvents(
      events.map((ev) => ({
        ...ev,
        selected: false,
        date: '',
        startTime: '',
        endTime: '',
        startLocation: '',
        endLocation: '',
        customType: '',
      }))
    );
    setSubmittedWaUrl(null);
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Business Contact Column */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <p className="text-[#f2a900] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Booking & Availability Desk
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4">
              Book Your <span className="italic text-[#f2a900]">Event Date</span>
            </h1>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Submit your wedding dates and package preference below. Our studio coordinator confirms crew availability and sends your written agreement via our official booking desk.
            </p>
          </div>

          <div className="space-y-6 pt-2">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl border border-white/15 flex items-center justify-center bg-[#101010] text-[#f2a900] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                  Official Studio WhatsApp & Booking Line
                </h2>
                <a
                  href={`tel:${STUDIO_CONTACT.officialPhoneTel}`}
                  className="text-white hover:text-[#f2a900] font-mono text-lg font-semibold mt-0.5 block select-text transition-colors"
                >
                  {STUDIO_CONTACT.officialPhoneDisplay}
                </a>
                <p className="text-xs text-white/50 mt-0.5">{STUDIO_CONTACT.hours}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl border border-white/15 flex items-center justify-center bg-[#101010] text-[#f2a900] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                  Studio Office
                </h2>
                <p className="text-white/80 text-sm mt-0.5 leading-relaxed">
                  {STUDIO_CONTACT.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl border border-white/15 flex items-center justify-center bg-[#101010] text-[#f2a900] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                  Email Inquiries
                </h2>
                <a
                  href={`mailto:${STUDIO_CONTACT.officialEmail}`}
                  className="text-white/80 hover:text-[#f2a900] text-sm sm:text-base mt-0.5 block transition-colors select-text"
                >
                  {STUDIO_CONTACT.officialEmail}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="w-full h-52 rounded-2xl overflow-hidden border border-white/15 bg-[#101010]">
              <iframe
                title="MuzFrame Studio Hasilpur Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113941.69617307842!2d72.58550791475752!3d29.697669074742784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393c5d6c8eafb0e9%3A0x67394db432ab4311!2sHasilpur%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Right: Accessible Standardized Enquiry Form */}
        <div className="lg:col-span-7 bg-[#101010] border border-white/15 rounded-2xl p-6 sm:p-8 lg:p-10">
          {submittedWaUrl ? (
            <div className="py-10 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-[#f2a900]/15 border border-[#f2a900]/40 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-[#f2a900]" />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-semibold text-white mb-2">
                  Booking Enquiry Saved
                </h2>
                <p className="text-sm sm:text-base text-white/75 max-w-md mx-auto">
                  Your event dates and package details are registered with our studio desk. Open WhatsApp below to chat directly with our booking manager.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={submittedWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto btn-primary"
                >
                  <span>Continue on WhatsApp</span>
                  <Send className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto btn-secondary"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitEnquiry} noValidate className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-white mb-2">
                    Full Name <span className="text-[#f2a900]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    aria-invalid={!!errors.name}
                    onChange={handleChange}
                    className={`w-full bg-black border ${
                      errors.name ? 'border-red-500' : 'border-white/20'
                    } rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-[#f2a900]`}
                    placeholder="e.g. Bilal & Fatima"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-white mb-2">
                    Mobile / WhatsApp Number <span className="text-[#f2a900]">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    aria-invalid={!!errors.phone}
                    onChange={handleChange}
                    className={`w-full bg-black border ${
                      errors.phone ? 'border-red-500' : 'border-white/20'
                    } rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-[#f2a900]`}
                    placeholder="e.g. 0300 6103262"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Custom Styled Accessible Event Checkboxes */}
              <div>
                <span className="block text-sm font-medium text-white mb-2.5">
                  Event Functions <span className="text-[#f2a900]">*</span>
                </span>
                {errors.events && (
                  <p className="text-red-400 text-xs mb-2.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.events}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {events.map((ev, index) => (
                    <label
                      key={ev.type}
                      className={`min-h-[46px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-colors select-none ${
                        ev.selected
                          ? 'border-[#f2a900] bg-[#f2a900]/10 text-white'
                          : 'border-white/15 bg-black/60 text-white/80 hover:border-white/35'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={ev.selected}
                        onChange={() => toggleEvent(index)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          ev.selected
                            ? 'bg-[#f2a900] border-[#f2a900] text-black'
                            : 'bg-black border-white/30'
                        }`}
                      >
                        {ev.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                      <span className="text-sm font-medium">{ev.type}</span>
                    </label>
                  ))}
                </div>

                {/* Selected Event Schedules */}
                <div className="mt-4 space-y-4">
                  <AnimatePresence>
                    {events.map(
                      (ev, index) =>
                        ev.selected && (
                          <motion.div
                            key={`details-${ev.type}`}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="p-4 sm:p-5 rounded-xl border border-white/15 bg-black/60 space-y-4"
                          >
                            <h3 className="text-sm font-semibold text-[#f2a900]">
                              {ev.type} Schedule & Venue
                            </h3>

                            {ev.type === 'Other' && (
                              <div>
                                <label htmlFor={`custom-${index}`} className="block text-xs text-white/70 mb-1.5">
                                  Specify Event Name <span className="text-[#f2a900]">*</span>
                                </label>
                                <input
                                  id={`custom-${index}`}
                                  type="text"
                                  placeholder="e.g. Engagement / Aqiqah"
                                  value={ev.customType}
                                  onChange={(e) => handleEventChange(index, 'customType', e.target.value)}
                                  className={`w-full bg-[#101010] border ${
                                    errors[`custom_${ev.type}`] ? 'border-red-500' : 'border-white/20'
                                  } rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2a900]`}
                                />
                                {errors[`custom_${ev.type}`] && (
                                  <p className="text-red-400 text-xs mt-1">{errors[`custom_${ev.type}`]}</p>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <div>
                                <label htmlFor={`date-${index}`} className="block text-xs text-white/70 mb-1.5">
                                  Event Date <span className="text-[#f2a900]">*</span>
                                </label>
                                <div className="relative">
                                  <Calendar className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  <input
                                    id={`date-${index}`}
                                    type="date"
                                    value={ev.date}
                                    onClick={(e) => {
                                      try {
                                        (e.target as HTMLInputElement).showPicker();
                                      } catch {}
                                    }}
                                    onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                                    className={`w-full pl-10 pr-3 py-2.5 bg-[#101010] border ${
                                      errors[`date_${ev.type}`] ? 'border-red-500' : 'border-white/20'
                                    } rounded-xl text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                                  />
                                </div>
                                {errors[`date_${ev.type}`] && (
                                  <p className="text-red-400 text-xs mt-1">{errors[`date_${ev.type}`]}</p>
                                )}
                              </div>

                              <div>
                                <span className="block text-xs text-white/70 mb-1.5">
                                  Timing (Start – End) <span className="text-[#f2a900]">*</span>
                                </span>
                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                  <div className="relative">
                                    <Clock className="w-3.5 h-3.5 text-white/50 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <select
                                      aria-label={`${ev.type} start time`}
                                      value={ev.startTime}
                                      onChange={(e) => handleEventChange(index, 'startTime', e.target.value)}
                                      className={`w-full appearance-none pl-8 pr-6 py-2.5 bg-[#101010] border ${
                                        errors[`startTime_${ev.type}`] ? 'border-red-500' : 'border-white/20'
                                      } rounded-xl text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                                    >
                                      <option value="">Start</option>
                                      {Array.from({ length: 24 }).map((_, i) => {
                                        const h24 = i.toString().padStart(2, '0');
                                        const h12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
                                        const ampm = i < 12 ? 'AM' : 'PM';
                                        return (
                                          <option key={h24} value={`${h24}:00`}>
                                            {`${h12}:00 ${ampm}`}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                  <span className="text-xs text-white/50">to</span>
                                  <div className="relative">
                                    <Clock className="w-3.5 h-3.5 text-white/50 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <select
                                      aria-label={`${ev.type} end time`}
                                      value={ev.endTime}
                                      onChange={(e) => handleEventChange(index, 'endTime', e.target.value)}
                                      className={`w-full appearance-none pl-8 pr-6 py-2.5 bg-[#101010] border ${
                                        errors[`endTime_${ev.type}`] ? 'border-red-500' : 'border-white/20'
                                      } rounded-xl text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                                    >
                                      <option value="">End</option>
                                      {Array.from({ length: 24 }).map((_, i) => {
                                        const h24 = i.toString().padStart(2, '0');
                                        const h12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
                                        const ampm = i < 12 ? 'AM' : 'PM';
                                        return (
                                          <option key={h24} value={`${h24}:00`}>
                                            {`${h12}:00 ${ampm}`}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                </div>
                                {(errors[`startTime_${ev.type}`] || errors[`endTime_${ev.type}`]) && (
                                  <p className="text-red-400 text-xs mt-1">
                                    {errors[`startTime_${ev.type}`] || errors[`endTime_${ev.type}`]}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <div className={ev.type === 'Barat' ? '' : 'sm:col-span-2'}>
                                <label htmlFor={`loc-start-${index}`} className="block text-xs text-white/70 mb-1.5">
                                  {ev.type === 'Barat' ? 'Departure Location' : 'Venue / Hall Location'}{' '}
                                  <span className="text-[#f2a900]">*</span>
                                </label>
                                <div className="relative">
                                  <MapPin className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  <input
                                    id={`loc-start-${index}`}
                                    type="text"
                                    placeholder={ev.type === 'Barat' ? 'Groom residence / city' : 'Marquee or venue name'}
                                    value={ev.startLocation}
                                    onChange={(e) => handleEventChange(index, 'startLocation', e.target.value)}
                                    className={`w-full pl-10 pr-3 py-2.5 bg-[#101010] border ${
                                      errors[`startLocation_${ev.type}`] ? 'border-red-500' : 'border-white/20'
                                    } rounded-xl text-sm text-white focus:outline-none focus:border-[#f2a900]`}
                                  />
                                </div>
                                {errors[`startLocation_${ev.type}`] && (
                                  <p className="text-red-400 text-xs mt-1">{errors[`startLocation_${ev.type}`]}</p>
                                )}
                              </div>

                              {ev.type === 'Barat' && (
                                <div>
                                  <label htmlFor={`loc-end-${index}`} className="block text-xs text-white/70 mb-1.5">
                                    Barat Arrival Hall <span className="text-[#f2a900]">*</span>
                                  </label>
                                  <div className="relative">
                                    <MapPin className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      id={`loc-end-${index}`}
                                      type="text"
                                      placeholder="Destination marquee / hall"
                                      value={ev.endLocation}
                                      onChange={(e) => handleEventChange(index, 'endLocation', e.target.value)}
                                      className={`w-full pl-10 pr-3 py-2.5 bg-[#101010] border ${
                                        errors[`endLocation_${ev.type}`] ? 'border-red-500' : 'border-white/20'
                                      } rounded-xl text-sm text-white focus:outline-none focus:border-[#f2a900]`}
                                    />
                                  </div>
                                  {errors[`endLocation_${ev.type}`] && (
                                    <p className="text-red-400 text-xs mt-1">{errors[`endLocation_${ev.type}`]}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Package Selector with Visible Dropdown Indicator */}
              <div>
                <label htmlFor="contact-package" className="block text-sm font-medium text-white mb-2">
                  Interested Package <span className="text-[#f2a900]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="contact-package"
                    name="package"
                    value={formData.package}
                    aria-invalid={!!errors.package}
                    onChange={handleChange}
                    className={`w-full appearance-none bg-black border ${
                      errors.package ? 'border-red-500' : 'border-white/20'
                    } rounded-xl pl-4 pr-10 py-3.5 text-sm sm:text-base text-white focus:outline-none focus:border-[#f2a900] cursor-pointer [color-scheme:dark]`}
                  >
                    <option value="None selected">Select a photography package...</option>
                    <optgroup label="Wedding Packages">
                      {ALL_PACKAGES.filter((p) => p.category === 'wedding').map((p) => (
                        <option key={p.id} value={`${p.code} — ${p.name} (${p.price})`}>
                          {p.code} — {p.name} ({p.price})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Bridal Special Packages">
                      {ALL_PACKAGES.filter((p) => p.category === 'bridal').map((p) => (
                        <option key={p.id} value={`${p.code} — ${p.name} (${p.price})`}>
                          {p.name} ({p.price})
                        </option>
                      ))}
                    </optgroup>
                    <option value="Custom Quote">Custom Quote / Multi-Event Bundle</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-white/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.package && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.package}</span>
                  </p>
                )}
              </div>

              {formData.package === 'Custom Quote' && (
                <div>
                  <label htmlFor="contact-budget" className="block text-sm font-medium text-white mb-2">
                    Estimated Budget (Rs.) <span className="text-[#f2a900]">*</span>
                  </label>
                  <input
                    id="contact-budget"
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={`w-full bg-black border ${
                      errors.budget ? 'border-red-500' : 'border-white/20'
                    } rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-[#f2a900]`}
                    placeholder="e.g. 150,000"
                  />
                  {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget}</p>}
                </div>
              )}

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-white mb-2">
                  Shoot Requirements & Notes <span className="text-[#f2a900]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  name="message"
                  required
                  value={formData.message}
                  aria-invalid={!!errors.message}
                  onChange={handleChange}
                  className={`w-full bg-black border ${
                    errors.message ? 'border-red-500' : 'border-white/20'
                  } rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-[#f2a900] resize-none`}
                  placeholder="Share any preferences such as female photography coverage, drone flights, or custom album requests..."
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full min-h-[48px] bg-[#f2a900] hover:bg-white text-black rounded-xl px-6 py-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Booking Enquiry'}</span>
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
              <p className="text-center text-white/50 text-xs">
                Submits directly to our booking desk and generates your WhatsApp confirmation message.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
