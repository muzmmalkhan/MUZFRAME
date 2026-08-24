import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    package: 'None selected',
    budget: '',
    message: ''
  });
  
  const [events, setEvents] = useState<{
    type: string;
    customType: string;
    date: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
    selected: boolean;
  }[]>([
    { type: 'Mehndi', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
    { type: 'Barat', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
    { type: 'Walima', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
    { type: 'Nikkah', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
    { type: 'Birthday', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false },
    { type: 'Other', customType: '', date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', selected: false }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleEvent = (index: number) => {
    const newEvents = [...events];
    newEvents[index].selected = !newEvents[index].selected;
    setEvents(newEvents);
  };

  const handleEventChange = (index: number, field: string, value: string) => {
    const newEvents = [...events];
    (newEvents[index] as any)[field] = value;
    setEvents(newEvents);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    const selectedEvents = events.filter(e => e.selected);
    if (selectedEvents.length === 0) {
      newErrors.events = 'Please select at least one event (Mehndi, Barat, Walima, Nikkah, Birthday, or Other).';
    } else {
      selectedEvents.forEach(e => {
        if (!e.date) newErrors[`date_${e.type}`] = 'Date required';
        if (!e.startTime) newErrors[`startTime_${e.type}`] = 'Start time required';
        if (!e.endTime) newErrors[`endTime_${e.type}`] = 'End time required';
        if (!e.startLocation) newErrors[`startLocation_${e.type}`] = 'Location required';
        if (e.type === 'Barat' && !e.endLocation) newErrors[`endLocation_${e.type}`] = 'Arrival location required';
        if (e.type === 'Other' && !e.customType.trim()) {
          newErrors[`custom_${e.type}`] = 'Event type required';
        }
      });
    }

    if (formData.package === 'None selected') newErrors.package = 'Please select a package';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    if (formData.package === 'Custom Quote' && !formData.budget.trim()) {
      newErrors.budget = 'Please enter your budget';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: ''});
    }
  };

  const handleWhatsAppRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    const selectedEvents = events.filter(ev => ev.selected);
    
    // Create client in admin panel
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `CLI-${Date.now()}`,
          name: formData.name,
          email: "Pending",
          phone: "Provided via WhatsApp",
          location: "Unknown",
          eventName: "Booking Inquiry",
          eventType: selectedEvents.map(ev => ev.type === 'Other' ? ev.customType : ev.type).join(', '),
          eventDate: selectedEvents.map(ev => `${ev.date} ${ev.startTime}-${ev.endTime}`).join(', '),
          package: formData.package === 'Custom Quote' ? `Custom Quote (Budget: Rs. ${formData.budget})` : formData.package,
          status: 'pending',
          totalAmount: 0,
          paidAmount: 0
        })
      });

      // Post each selected event to events table
      await Promise.all(selectedEvents.map((ev, idx) => {
        const typeName = ev.type === 'Other' ? ev.customType : ev.type;
        const loc = ev.type === 'Barat' ? `${ev.startLocation} to ${ev.endLocation}` : ev.startLocation;
        return fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `EVT-${Date.now()}-${idx}`,
            clientName: formData.name,
            eventName: `${formData.name}'s ${typeName}`,
            eventType: typeName,
            date: ev.date,
            venue: loc,
            teamLead: 'Pending Assignment',
            packageDetails: formData.package === 'Custom Quote' ? `Custom Quote (Budget: Rs. ${formData.budget})` : formData.package,
            status: 'Upcoming',
            deliverablesCount: 0
          })
        });
      }));
    } catch (err) {
      console.error("Failed to post client to admin panel", err);
    }

    // Simulate additional network request / processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      let eventsText = '';
      selectedEvents.forEach(ev => {
        const typeName = ev.type === 'Other' ? ev.customType : ev.type;
        const loc = ev.type === 'Barat' ? `${ev.startLocation} to ${ev.endLocation}` : ev.startLocation;
        eventsText += `\n- *${typeName}*: ${ev.date} (${ev.startTime} - ${ev.endTime}) @ ${loc}`;
      });

      const waPackage = formData.package === 'Custom Quote' ? `Custom Quote (Budget: Rs. ${formData.budget})` : formData.package;
      const text = `Hello MuzFrame Studio!%0A%0A*Name:* ${formData.name}%0A*Events:*${eventsText.replace(/\n/g, '%0A')}%0A%0A*Interest:* ${waPackage}%0A%0A*Message:* ${formData.message}`;
      
      const waUrl = `https://wa.me/923006103262?text=${text}`;
      window.open(waUrl, '_blank');
      
      setFormData({ name: '', package: 'None selected', budget: '', message: '' });
      setEvents(events.map(ev => ({ ...ev, selected: false, date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', customType: '' })));
      setShowSuccess(false);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          <div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">Let's <span className="luxury-gradient italic">Talk.</span></h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Secure your date. Messages sent through this form will redirect directly to our official WhatsApp for immediate assistance.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-[#f2a900]">
                 <Phone className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-1">Official Number</h4>
                  <p className="text-white/60 font-serif text-xl">+92 300 6103262</p>
               </div>
            </div>
            
            <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-[#f2a900]">
                 <MapPin className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-1">Studio Location</h4>
                  <p className="text-white/60 max-w-[200px] leading-relaxed">Office No.32, Old Kachheri, Hasilpur, 63000, Pakistan</p>
               </div>
            </div>

            <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-[#f2a900]">
                 <Mail className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-1">Email Inquiry</h4>
                  <p className="text-white/60 font-serif text-xl">booking@muzframe.studio</p>
               </div>
            </div>
            
            {/* Map Embed */}
            <div className="pt-6 border-t border-white/10">
              <div className="w-full h-48 rounded-2xl overflow-hidden rounded-bl-sm border border-white/10 relative grayscale hover:grayscale-0 transition-all duration-500">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113941.69617307842!2d72.58550791475752!3d29.697669074742784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393c5d6c8eafb0e9%3A0x67394db432ab4311!2sHasilpur%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-5 sm:p-8 md:p-12 rounded-3xl relative overflow-hidden"
        >
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
              >
                <CheckCircle className="w-16 h-16 text-[#f2a900] mb-4" />
                <h3 className="font-serif text-3xl mb-2">Request Processed</h3>
                <p className="text-white/60 text-sm">Redirecting to WhatsApp to complete your booking...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleWhatsAppRedirect} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Your Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-[#f2a900] transition-colors`} 
                placeholder="John Doe"
              />
              {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-3">Event Types (Select Multiple)</label>
              {errors.events && <span className="text-red-500 text-xs mb-3 block">{errors.events}</span>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {events.map((ev, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${ev.selected ? 'border-[#f2a900] bg-[#f2a900]/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                      <input 
                        type="checkbox" 
                        checked={ev.selected}
                        onChange={() => toggleEvent(index)}
                        className="accent-[#f2a900] w-4 h-4 shrink-0"
                      />
                      <span className="text-sm font-medium">{ev.type}</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-4">
                {events.map((ev, index) => ev.selected && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    key={`details-${index}`} 
                    className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4"
                  >
                    <h5 className="font-semibold text-[#f2a900]">{ev.type} Details</h5>
                    
                    {ev.type === 'Other' && (
                      <div>
                        <input 
                          type="text" 
                          placeholder="Specify Event Type"
                          value={ev.customType}
                          onChange={(e) => handleEventChange(index, 'customType', e.target.value)}
                          className={`w-full bg-black/50 border ${errors[`custom_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]`}
                        />
                        {errors[`custom_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{errors[`custom_${ev.type}`]}</span>}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                            <input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} 
                              type="date"
                              value={ev.date}
                              onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                              className={`w-full pl-9 pr-3 py-3 bg-black/50 border ${errors[`date_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                            />
                          </div>
                          {errors[`date_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{errors[`date_${ev.type}`]}</span>}
                        </div>
                        
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                          <div className="w-full">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                              <input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} 
                                type="time"
                                value={ev.startTime}
                                onChange={(e) => handleEventChange(index, 'startTime', e.target.value)}
                                className={`w-full pl-8 pr-2 py-3 bg-black/50 border ${errors[`startTime_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark] min-w-0`}
                              />
                            </div>
                            {errors[`startTime_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{errors[`startTime_${ev.type}`]}</span>}
                          </div>
                          <span className="text-white/50 text-xs">to</span>
                          <div className="w-full">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                              <input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} 
                                type="time"
                                value={ev.endTime}
                                onChange={(e) => handleEventChange(index, 'endTime', e.target.value)}
                                className={`w-full pl-8 pr-2 py-3 bg-black/50 border ${errors[`endTime_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark] min-w-0`}
                              />
                            </div>
                            {errors[`endTime_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{errors[`endTime_${ev.type}`]}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-1">
                        <div className={ev.type === 'Barat' ? 'col-span-1' : 'col-span-1 xl:col-span-2'}>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input 
                              type="text"
                              placeholder={ev.type === 'Barat' ? 'Departure Location' : 'Venue Location'}
                              value={ev.startLocation}
                              onChange={(e) => handleEventChange(index, 'startLocation', e.target.value)}
                              className={`w-full pl-9 pr-3 py-3 bg-black/50 border ${errors[`startLocation_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                            />
                          </div>
                          {errors[`startLocation_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{errors[`startLocation_${ev.type}`]}</span>}
                        </div>
                        
                        {ev.type === 'Barat' && (
                          <div className="col-span-1">
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                              <input 
                                type="text"
                                placeholder="Arrival Location"
                                value={ev.endLocation}
                                onChange={(e) => handleEventChange(index, 'endLocation', e.target.value)}
                                className={`w-full pl-9 pr-3 py-3 bg-black/50 border ${errors[`endLocation_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                              />
                            </div>
                            {errors[`endLocation_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{errors[`endLocation_${ev.type}`]}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Interested Package</label>
              <select 
                name="package"
                value={formData.package}
                onChange={handleChange}
                className={`w-full bg-[#111] border ${errors.package ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-[#f2a900] transition-colors appearance-none [color-scheme:dark]`}
              >
                <option value="None selected">Select a package...</option>
                <option value="Rs. 50,000 Package">Rs. 50,000 Package</option>
                <option value="Rs. 60,000 Package">Rs. 60,000 Package (Popular)</option>
                <option value="Rs. 90,000 Package">Rs. 90,000 Package</option>
                <option value="Custom Quote">Custom Quote / Other</option>
              </select>
              {errors.package && <span className="text-red-500 text-xs mt-1 block">{errors.package}</span>}
            </div>

            {formData.package === 'Custom Quote' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Your Budget (Rs.)</label>
                <input 
                  type="text" 
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className={`w-full bg-white/5 border ${errors.budget ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-4 text-white focus:outline-none focus:border-[#f2a900] transition-colors`} 
                  placeholder="e.g. 150000"
                />
                {errors.budget && <span className="text-red-500 text-xs mt-1 block">{errors.budget}</span>}
              </motion.div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Message</label>
              <textarea 
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`w-full bg-white/5 border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#f2a900] transition-colors resize-none`} 
                placeholder="Tell us about your event..."
              ></textarea>
              {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message}</span>}
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-[#f2a900] text-black rounded-xl px-4 py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-white transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Processing...' : 'Send via WhatsApp'} {!isSubmitting && <Send className="w-4 h-4" />}
            </button>
            <p className="text-center text-white/30 text-xs mt-4">You will be redirected to WhatsApp to send this message.</p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
