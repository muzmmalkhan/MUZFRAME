import React, { useState, useEffect } from 'react';
import { Download, MapPin,  Share2, Heart, Image as ImageIcon, Loader2, LogOut, Lock, Calendar, CheckCircle2, Clock, ShieldCheck, User, Video, FileText, Sparkles, Key, Music, Play, Pause, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { studioAudio } from '../utils/audioPlayer';

const MY_IMAGES = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2938&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2942&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2938&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2942&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?q=80&w=2699&auto=format&fit=crop"
];

const VIDEOS = [
  { id: '1', title: 'Cinematic Teaser Trailer (4K HD)', duration: '01:45', thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop' },
  { id: '2', title: 'Full Barat Ceremony Reel', duration: '12:30', thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop' }
];

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'overview' | 'songs' | 'security' | 'booking'>('gallery');
  const [playingSong, setPlayingSong] = useState<string | null>(null);
  const [filter, setFilter] = useState<'highlights' | 'full' | 'videos'>('highlights');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Security password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  
  // Booking Form State
  const [bookingPackage, setBookingPackage] = useState('');
  const [bookingBudget, setBookingBudget] = useState('');
  const [bookingLocation, setBookingLocation] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingSongs, setBookingSongs] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  
  const [bookingEvents, setBookingEvents] = useState<{
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

  const toggleBookingEvent = (index: number) => {
    const newEvents = [...bookingEvents];
    newEvents[index].selected = !newEvents[index].selected;
    setBookingEvents(newEvents);
  };

  const handleBookingEventChange = (index: number, field: string, value: string) => {
    const newEvents = [...bookingEvents];
    (newEvents[index] as any)[field] = value;
    setBookingEvents(newEvents);
  };
  const [passSuccess, setPassSuccess] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const { user, logout, changePassword, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.role === 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const [clientData, setClientData] = useState<any>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [clientEvents, setClientEvents] = useState<any[]>([]);
  const [playlistData, setPlaylistData] = useState<any>(null);
  const [draftSongIds, setDraftSongIds] = useState<string[] | null>(null);
  const [draftNotes, setDraftNotes] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [customSongName, setCustomSongName] = useState("");
  const [customEventName, setCustomEventName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      try {
        const fetchJson = (url: string) => fetch(url).then(async res => {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const text = await res.text();
          try { return JSON.parse(text); } catch (e) { return []; }
        });
        
        const [clients, events, playlists, payments] = await Promise.all([
          fetchJson('/api/clients'),
          fetchJson('/api/events'),
          fetchJson('/api/playlists'),
          fetchJson('/api/payments')
        ]);
        const foundClient = clients.find((c: any) => c.email === user.email);
        if (foundClient) {
          setClientData(foundClient);
          setBookingEmail(user.email || '');
          const foundEvents = events.filter((e: any) => e.clientName === foundClient.name);
          setClientEvents(foundEvents);
          if (foundEvents.length > 0) {
            setEventData(foundEvents[0]);
          }
          const foundPlaylist = playlists.find((p: any) => p.clientId === foundClient.id);
          if (foundPlaylist) {
            setPlaylistData(foundPlaylist);
          }
          const foundPayment = payments.find((p: any) => p.clientName === foundClient.name);
          if (foundPayment) {
            setPaymentData(foundPayment);
          }
        }
      } catch (err) {
        console.error("Failed to load client data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [user]);

  // Combine user info with real client/event data if it exists
  const displayEventName = eventData?.eventName || clientData?.eventName || user?.eventName || 'Royal Wedding Collection';
  const displayEventDate = eventData?.date || clientData?.eventDate || user?.eventDate || 'November 15, 2026';
  const displayPackage = clientData?.package || user?.package || 'Rs. 90,000 Luxury Package';
  const hasBookedEvent = !!eventData;
  
  const currentSongIds = draftSongIds !== null ? draftSongIds : (playlistData?.songIds || []);

  const handleToggleSong = (songId: string, title?: string) => {
    if (playlistData?.status === "Submitted & Locked") return;
    const isSelected = currentSongIds.includes(songId);
    const newIds = isSelected ? currentSongIds.filter((id: string) => id !== songId) : [...currentSongIds, songId];
    setDraftSongIds(newIds);
  };

  const handleAddCustomSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSongName.trim() || playlistData?.status === "Submitted & Locked") return;
    
    const newSongId = `CUSTOM-${Date.now()}`;
    const newIds = [...currentSongIds, newSongId];
    
    const currentNotes = draftNotes !== null ? draftNotes : (playlistData?.notes || "");
    const newNotes = currentNotes + (currentNotes ? "\n" : "") + `Custom Song: ${customSongName} (For: ${customEventName})`;
    
    setDraftSongIds(newIds);
    setDraftNotes(newNotes);
    setCustomSongName("");
    setCustomEventName("");
  };

  const handleSubmitSelections = async () => {
    if (playlistData?.status === "Submitted & Locked") return;
    
    const finalSongIds = draftSongIds !== null ? draftSongIds : (playlistData?.songIds || []);
    const finalNotes = draftNotes !== null ? draftNotes : (playlistData?.notes || "");
    
    const updatedPlaylist = {
      id: playlistData?.id || clientData?.id || user?.id,
      clientId: clientData?.id || user?.id,
      clientName: clientData?.name || user?.name || user?.email,
      songIds: finalSongIds,
      status: playlistData?.status || "Draft",
      notes: finalNotes
    };
    
    setPlaylistData(updatedPlaylist);
    setDraftSongIds(null);
    setDraftNotes(null);
    
    await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPlaylist)
    });
    
    const adminPhone = "923006103262";
    const message = `*Song Selections Submitted*\nClient: ${clientData?.name || user?.name}\nEmail: ${user?.email}\nTotal Selected: ${finalSongIds.length}\n${finalNotes ? 'Includes custom requests.' : ''}`;
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };


  useEffect(() => {
    const handleAudioStopped = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.songId) {
        setPlayingSong(prev => prev === customEvent.detail.songId ? null : prev);
      }
    };
    window.addEventListener('audio-stopped', handleAudioStopped);
    return () => {
      studioAudio.stop();
      window.removeEventListener('audio-stopped', handleAudioStopped);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleFavorite = (index: number) => {
    setFavorites(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      setDownloadingUrl(url);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.warn('Error downloading image via fetch, falling back to new tab', error);
      window.open(url, '_blank');
    } finally {
      setDownloadingUrl(null);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      for (let i = 0; i < MY_IMAGES.length; i++) {
        await handleDownload(MY_IMAGES[i], `event-image-${i + 1}.jpg`);
      }
    } catch (error) {
      console.error('Error downloading all images', error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Record<string, string> = {};
    const selectedEvents = bookingEvents.filter(ev => ev.selected);
    if (selectedEvents.length === 0) {
      newErrors.events = 'Please select at least one event (Mehndi, Barat, Walima, Nikkah, Birthday, or Other).';
    } else {
      selectedEvents.forEach(ev => {
        if (!ev.date) newErrors[`date_${ev.type}`] = 'Date required';
        if (!ev.startTime) newErrors[`startTime_${ev.type}`] = 'Start time required';
        if (!ev.endTime) newErrors[`endTime_${ev.type}`] = 'End time required';
        if (!ev.startLocation) newErrors[`startLocation_${ev.type}`] = 'Location required';
        if (ev.type === 'Barat' && !ev.endLocation) newErrors[`endLocation_${ev.type}`] = 'Arrival location required';
        if (ev.type === 'Other' && !ev.customType.trim()) {
          newErrors[`custom_${ev.type}`] = 'Event type required';
        }
      });
    }
    
    if (bookingPackage === 'Custom Quote' && !bookingBudget.trim()) {
      newErrors.budget = 'Please enter your budget';
    }

    if (Object.keys(newErrors).length > 0) {
      setBookingErrors(newErrors);
      return;
    }
    setBookingErrors({});

    setIsSubmittingBooking(true);
    try {
      const clientName = user?.name || clientData?.name || 'Unknown Client';
      
      await Promise.all(selectedEvents.map((ev, idx) => {
        const typeName = ev.type === 'Other' ? ev.customType : ev.type;
        const loc = ev.type === 'Barat' ? `${ev.startLocation} to ${ev.endLocation}` : ev.startLocation;
        return fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `EVT-${Date.now()}-${idx}`,
            clientName: clientName,
            eventName: `${clientName}'s ${typeName}`,
            eventType: typeName,
            date: ev.date,
            venue: loc,
            teamLead: 'Pending Assignment',
            packageDetails: (bookingPackage === 'Custom Quote' ? `Custom Quote (Budget: Rs. ${bookingBudget})` : bookingPackage) + (bookingSongs ? ` | Notes: ${bookingSongs}` : ''),
            status: 'Upcoming',
            deliverablesCount: 0
          })
        });
      }));
      
      // WhatsApp redirection
      const adminPhone = "923006103262";
      let eventsText = '';
      selectedEvents.forEach(ev => {
        const typeName = ev.type === 'Other' ? ev.customType : ev.type;
        const loc = ev.type === 'Barat' ? `${ev.startLocation} to ${ev.endLocation}` : ev.startLocation;
        eventsText += `\n- *${typeName}*: ${ev.date} (${ev.startTime} - ${ev.endTime}) @ ${loc}`;
      });

      const waPackage = bookingPackage === 'Custom Quote' ? `Custom Quote (Budget: Rs. ${bookingBudget})` : bookingPackage;
      const waText = encodeURIComponent(`New Booking Request\n\nClient: ${clientName}\nEvents:${eventsText}\nPackage: ${waPackage}\nPreferred Songs: ${bookingSongs}`);

      window.open(`https://wa.me/${adminPhone}?text=${waText}`, '_blank');
      
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 5000);
      setBookingPackage('');
      setBookingBudget('');
      setBookingLocation('');
      setBookingSongs('');
      setBookingEvents(bookingEvents.map(ev => ({ ...ev, selected: false, date: '', startTime: '', endTime: '', startLocation: '', endLocation: '', customType: '' })));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!newPass || !confirmPass) {
      setPassError('Please fill in new password fields');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters long');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match');
      return;
    }

    setIsChangingPass(true);
    try {
      await changePassword(newPass);
      setPassSuccess('Your portal password has been updated securely.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      setPassError(err.message || 'Failed to update password');
    } finally {
      setIsChangingPass(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black pt-28 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-[#f2a900]/10 rounded-full flex items-center justify-center mb-8 border border-[#f2a900]/20">
            <Lock className="w-10 h-10 text-[#f2a900]" />
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-medium text-white leading-tight mb-6">
            Client Portal <br />
            <span className="text-[#f2a900] italic">Coming Soon</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Our dedicated client portal is currently under development. It will launch on August 28th, bringing you a fully immersive experience to review, manage, and download your precious moments.
          </p>
          <button onClick={handleLogout} className="btn-primary flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen bg-black">
      {/* Cover Header */}
      <div className="h-[40vh] w-full relative">
        <img 
          src={MY_IMAGES[0]} 
          className="w-full h-full object-cover" 
          alt="Event cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-6 lg:left-12 right-6 lg:right-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#f2a900] text-black text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Active Event Portal</span>
              <span className="text-white/60 text-xs flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#f2a900] pointer-events-none" /> {displayEventDate}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-medium text-white mb-1">{displayEventName}</h1>
            <p className="text-white/60 text-sm">{user?.name || clientData?.name ? `Prepared exclusively for ${user?.name || clientData?.name}` : 'Private Client Portal'}</p>
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            <button 
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
              className="bg-[#f2a900] text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-50 shadow-lg shadow-[#f2a900]/20"
            >
              {isDownloadingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isDownloadingAll ? 'Downloading...' : 'Download Collection HD'}
            </button>
            <button 
              onClick={handleShare}
              className="px-5 py-3 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white flex items-center gap-2 text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share Link
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-5 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors border border-red-500/30"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {shareToast && (
        <div className="fixed top-24 right-6 bg-[#f2a900] text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Private Client Link Copied to Clipboard!
        </div>
      )}

      {/* Main Dashboard Tabs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 overflow-x-auto">
          <div className="flex gap-8 min-w-max">
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`pb-3 font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors relative ${activeTab === 'gallery' ? 'text-[#f2a900]' : 'text-white/50 hover:text-white'}`}
            >
              <ImageIcon className="w-4 h-4" /> Private Collection Gallery
              {activeTab === 'gallery' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2a900]" />}
            </button>
            <button 
              onClick={() => setActiveTab('booking')}
              className={`pb-3 font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors relative ${activeTab === 'booking' ? 'text-[#f2a900]' : 'text-white/50 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4 pointer-events-none" /> New Booking
              {activeTab === 'booking' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2a900]" />}
            </button>

            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-3 font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors relative ${activeTab === 'overview' ? 'text-[#f2a900]' : 'text-white/50 hover:text-white'}`}
            >
              <FileText className="w-4 h-4" /> Event Details & Status Timeline
              {activeTab === 'overview' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2a900]" />}
            </button>

            <button 
              onClick={() => setActiveTab('songs')}
              className={`pb-3 font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors relative ${activeTab === 'songs' ? 'text-[#f2a900]' : 'text-white/50 hover:text-white'}`}
            >
              <Music className="w-4 h-4" /> Assigned Song Selection & Playlist
              {activeTab === 'songs' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2a900]" />}
            </button>

            <button 
              onClick={() => setActiveTab('security')}
              className={`pb-3 font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors relative ${activeTab === 'security' ? 'text-[#f2a900]' : 'text-white/50 hover:text-white'}`}
            >
              <ShieldCheck className="w-4 h-4" /> Account & Change Password
              {activeTab === 'security' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2a900]" />}
            </button>

            
          </div>
          <p className="text-white/40 text-xs hidden md:block uppercase tracking-widest font-mono">ID: {user?.id || 'CLIENT-PORTAL'}</p>
        </div>

        {/* Tab 1: Gallery */}
        {activeTab === 'gallery' && (
          <div>
            {/* HELPFUL HINT FOR GALLERY */}
            <div className="bg-[#f2a900]/10 border border-[#f2a900]/30 rounded-2xl p-4 flex items-start gap-3 mb-6">
              <ImageIcon className="w-5 h-5 text-[#f2a900] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[#f2a900] text-sm font-bold uppercase tracking-wider mb-1">Your Media Collection</h4>
                <p className="text-white/70 text-xs leading-relaxed">Here you can view and download high-resolution photos and videos. Use the heart icon to mark your favorites, and use the download button on any photo to save it to your device.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex gap-4 bg-white/5 p-1.5 rounded-xl border border-white/10">
                <button 
                  onClick={() => setFilter('highlights')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${filter === 'highlights' ? 'bg-[#f2a900] text-black font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  Highlights ({MY_IMAGES.length})
                </button>
                <button 
                  onClick={() => setFilter('full')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${filter === 'full' ? 'bg-[#f2a900] text-black font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  Full Album (324 Photos)
                </button>
                <button 
                  onClick={() => setFilter('videos')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${filter === 'videos' ? 'bg-[#f2a900] text-black font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  Cinematic Videos ({VIDEOS.length})
                </button>
              </div>
              <div className="text-white/50 text-xs">
                Favorites: <span className="text-[#f2a900] font-bold">{favorites.length}</span> selected
              </div>
            </div>

            {filter === 'videos' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {VIDEOS.map((vid) => (
                  <div key={vid.id} className="bg-zinc-900/80 rounded-2xl overflow-hidden border border-white/10 group">
                    <div className="aspect-video relative overflow-hidden bg-black">
                      <img src={vid.thumb} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" alt={vid.title} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-16 h-16 rounded-full bg-[#f2a900] text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                          <Video className="w-6 h-6 fill-current" />
                        </button>
                      </div>
                      <span className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded text-[10px] text-white font-mono">{vid.duration}</span>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-medium text-white">{vid.title}</h3>
                        <p className="text-white/50 text-xs mt-1">4K UHD Color-Graded Delivery</p>
                      </div>
                      <button 
                        onClick={() => handleDownload(vid.thumb, `${vid.title}.mp4`)}
                        className="bg-white/10 hover:bg-[#f2a900] hover:text-black p-3 rounded-xl transition-colors text-white"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {MY_IMAGES.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="aspect-square relative group rounded-xl overflow-hidden bg-zinc-900"
                  >
                    <img 
                      src={src} 
                      className="w-full h-full object-cover bg-[#1a1a1a] transform group-hover:scale-105 transition-transform duration-700" 
                      alt={`Gallery item ${i}`} 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                      <div className="flex justify-between items-start">
                        <span className="bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-white/80">#MF-{100 + i}</span>
                        <button 
                          onClick={() => toggleFavorite(i)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${favorites.includes(i) ? 'bg-red-500 text-white' : 'bg-black/60 hover:bg-white hover:text-black text-white'}`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(i) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleDownload(src, `gallery-image-${i + 1}.jpg`)}
                          disabled={downloadingUrl === src}
                          className="px-4 py-2 rounded-full bg-[#f2a900] hover:bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        >
                          {downloadingUrl === src ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                          <span>HD</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Event Details & Timeline */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {!hasBookedEvent ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-zinc-900/90 via-black to-zinc-900/90 border border-[#f2a900]/40 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#f2a900]/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-20 h-20 bg-[#f2a900]/20 border border-[#f2a900]/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-[#f2a900]">
                  <Video className="w-10 h-10 animate-bounce" />
                </div>

                <span className="bg-red-500/20 border border-red-500/40 text-red-400 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-4">
                  🚨 EMERGENCY: ZERO CINEMATIC BOOKINGS DETECTED
                </span>

                <h2 className="font-serif text-3xl md:text-5xl font-medium text-white max-w-3xl mx-auto leading-tight mb-4">
                  Your Calendar is Looking <span className="text-[#f2a900] italic">Dangerously Un-Cinematic!</span>
                </h2>

                <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
                  We deployed our high-altitude 4K drones to scan the horizon, interrogated our editing servers in Hasilpur, and checked under every lens cap... but we couldn't find an active event booking under your account yet!
                </p>

                {/* Persuasive and funny reasons cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10 text-left">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#f2a900]/50 transition-colors">
                    <div className="text-2xl mb-3">📸</div>
                    <h3 className="font-serif text-lg font-medium text-white mb-2">Anti-Regret Guarantee</h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Don't let your big day be remembered by your uncle's blurry smartphone camera. Our multi-camera cinema rigs make you look like Hollywood royalty!
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#f2a900]/50 transition-colors">
                    <div className="text-2xl mb-3">🛸</div>
                    <h3 className="font-serif text-lg font-medium text-white mb-2">Drone Overlord Status</h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Why walk normally when our high-speed aerial drone can orbit your entrance like an epic movie hero? Guaranteed relative envy!
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#f2a900]/50 transition-colors">
                    <div className="text-2xl mb-3">🍿</div>
                    <h3 className="font-serif text-lg font-medium text-white mb-2">Viral 60s Teaser Reel</h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Get your color-graded cinematic teaser reel before your honeymoon luggage is even unpacked. Built for maximum Instagram glory!
                    </p>
                  </div>
                </div>

                {/* Convincing CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/packages')}
                    className="w-full sm:w-auto bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-2xl shadow-xl shadow-[#f2a900]/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4" /> Explore Studio Packages
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* HELPFUL HINT FOR OVERVIEW */}
                  <div className="bg-[#f2a900]/10 border border-[#f2a900]/30 rounded-2xl p-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#f2a900] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[#f2a900] text-sm font-bold uppercase tracking-wider mb-1">Welcome to your Portal!</h4>
                      <p className="text-white/70 text-xs leading-relaxed">Here you can track your event progress. The timeline below shows the status of your cinematic deliverables. You can also view payment status and check our gallery for your final media.</p>
                    </div>
                  </div>

                  {(clientEvents && clientEvents.length > 0 ? clientEvents : [{ id: 'dummy', eventName: displayEventName, status: eventData?.status || 'Upcoming' }]).map((evt: any) => (
  <div key={evt.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
    <h2 className="font-serif text-2xl font-medium text-white mb-6 flex items-center gap-3">
      <Sparkles className="w-5 h-5 text-[#f2a900]" /> {evt.eventName} Deliverables
    </h2>
    <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
      {['Upcoming', 'In Progress', 'Editing', 'Color Grading', 'Delivered'].map((step, idx) => {
        const statusOrder = ['Upcoming', 'In Progress', 'Editing', 'Color Grading', 'Delivered'];
        const currentStatus = evt.status || 'Upcoming';
        let currentIndex = statusOrder.indexOf(currentStatus);
        if (currentIndex === -1) currentIndex = 0;
        
        const stepIndex = idx;
        const isDelivered = currentStatus === 'Delivered';
        
        const isCompleted = isDelivered ? true : stepIndex < currentIndex;
        const isCurrent = isDelivered ? false : stepIndex === currentIndex;
        const isPending = isDelivered ? false : stepIndex > currentIndex;

        const titles = [
          'Booking Confirmed & Agreement Signed',
          'Event Shoot Completed',
          'Editing & Assembly',
          'Color Grading & Highlights',
          'Completed & Delivered'
        ];
        const desc = [
          'Package locked: ' + displayPackage + '. Advance deposit verified.',
          'Multi-camera cinematography & aerial drone coverage successfully concluded.',
          'Initial assembly and sync of all video and audio footage.',
          'First pass cinematic highlights color-graded and uploaded to portal.',
          'Final media available for download and custom albums in production.'
        ];
        return (
          <div key={step} className="flex items-start gap-4 relative">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${isCompleted || isCurrent ? 'bg-[#f2a900] text-black' : 'bg-white/10 border border-[#f2a900] text-[#f2a900]'}`}>
               {isCompleted ? <CheckCircle2 className="w-4 h-4 pointer-events-none" /> : isCurrent ? <Clock className="w-4 h-4 animate-pulse pointer-events-none" /> : <div className="w-2 h-2 rounded-full bg-[#f2a900]" />}
            </div>
            <div>
              <h3 className={`font-medium text-sm ${isCompleted || isCurrent ? 'text-white' : 'text-white/50'}`}>{titles[idx]} {isCurrent && '(In Progress)'}</h3>
              <p className="text-white/50 text-xs mt-1">{desc[idx]}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
))}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

                    <h3 className="font-serif text-xl font-medium text-white mb-4">Assigned Studio Team</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#f2a900]/20 text-[#f2a900] flex items-center justify-center font-bold">MR</div>
                        <div>
                          <p className="text-white text-sm font-medium">Muzammil Rashid</p>
                          <p className="text-white/50 text-xs">Lead Cinematographer & Director</p>
                        </div>
                      </div>
                      <div className="bg-black/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center font-bold">AS</div>
                        <div>
                          <p className="text-white text-sm font-medium">Ali Sher</p>
                          <p className="text-white/50 text-xs">Senior Drone Pilot & Editor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#f2a900]/20 via-black to-black border border-[#f2a900]/30 rounded-3xl p-6">
                    <h3 className="font-serif text-lg text-white mb-4">Package Specification</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/60">Selected Package</span>
                        <span className="text-white font-semibold">{displayPackage}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/60">Total Value</span>
                        <span className="text-[#f2a900] font-bold">Rs. {paymentData?.amount ? paymentData.amount.toLocaleString() : 'Pending'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/60">Payment Status</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${paymentData?.status === 'Received' ? 'bg-green-500/20 text-green-400' : 'bg-[#f2a900]/20 text-[#f2a900]'}`}>
                          {paymentData?.status || 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-white/60">Studio Location</span>
                        <span className="text-white text-right">Office No.32, Hasilpur</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Song Selection & Playlist */}
        {activeTab === 'songs' && (
          <div className="space-y-6">
            {/* HELPFUL HINT FOR MUSIC */}
            <div className="bg-[#f2a900]/10 border border-[#f2a900]/30 rounded-2xl p-4 flex items-start gap-3">
              <ListMusic className="w-5 h-5 text-[#f2a900] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[#f2a900] text-sm font-bold uppercase tracking-wider mb-1">Song Selection Guide</h4>
                <p className="text-white/70 text-xs leading-relaxed">Here you can see the tracks curated by our studio for your event film. You can listen to previews by clicking the play button. If you wish to suggest changes or select different tracks, please contact our studio directly.</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-white flex items-center gap-2">
                    <Music className="w-6 h-6 text-[#f2a900]" /> Assigned Song Selection & Playlist
                  </h2>
                  <p className="text-white/60 text-xs mt-1">Review the tracks curated by Muzammil Frame Studio for your cinematic highlights film.</p>
                </div>
                <span className={`border px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest self-start md:self-center ${playlistData?.status === 'Submitted & Locked' ? 'bg-[#f2a900]/20 text-[#f2a900] border-[#f2a900]/30' : 'bg-white/10 text-white/70 border-white/20'}`}>
                  {playlistData?.status || 'Draft'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'SNG-001', title: 'Tum Ho Toh', artist: 'Atif Aslam', category: 'Romantic BGM', duration: '5:10', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/73/a1/fd/73a1fd04-ffc4-3678-12fd-8e2ce97356c5/mzaf_2445518110460654640.plus.aac.p.m4a' },
                  { id: 'SNG-002', title: 'Humdam', artist: 'Hadiqa Kiani', category: 'Romantic BGM', duration: '4:25', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview118/v4/a3/35/0e/a3350ef0-0be9-293a-4ec3-8877acb4ae65/mzaf_1893472275867306424.plus.aac.p.m4a' },
                  { id: 'SNG-003', title: 'Thaam Lo', artist: 'Atif Aslam', category: 'Couple Entry', duration: '4:00', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/43/e6/03/43e60360-3f3c-8f87-1852-da6a9149281f/mzaf_2580734198283556935.plus.aac.p.m4a' },
                  { id: 'SNG-004', title: 'Jaan Ban Gaye', artist: 'Mithoon, Vishal Mishra', category: 'Couple Entry', duration: '3:45', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2e/f1/37/2ef13747-be9f-0ced-ebce-3c0356596d4a/mzaf_3559882409919622792.plus.aac.p.m4a' },
                  { id: 'SNG-005', title: 'Humdard', artist: 'Arijit Singh', category: 'Romantic BGM', duration: '4:20', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/92/ab/f4/92abf498-4a29-bc78-8aab-100b6024f618/mzaf_10618261139799213404.plus.aac.p.m4a' },
                  { id: 'SNG-006', title: 'Tum Mile', artist: 'Neeraj Shridhar', category: 'Cinematic Teaser', duration: '5:43', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ff/92/e7/ff92e77e-e631-2c22-e8fb-87c10ff42a01/mzaf_3559705285033933426.plus.aac.p.m4a' },
                  { id: 'SNG-007', title: 'Tune Jo Na Kaha', artist: 'Mohit Chauhan', category: 'Romantic BGM', duration: '5:10', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ed/43/e6/ed43e64f-231e-06a5-8e02-341ee4b1b597/mzaf_7067163473511570473.plus.aac.p.m4a' },
                  { id: 'SNG-008', title: 'Hawayein', artist: 'Arijit Singh', category: 'Romantic BGM', duration: '4:50', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/15/d1/a8/15d1a862-edcd-6a92-624a-2bbf0f7eff26/mzaf_7165241817401822857.plus.aac.p.m4a' },
                  { id: 'SNG-009', title: 'Tum Hi Ho', artist: 'Arijit Singh', category: 'Couple Entry', duration: '4:22', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/38/de/b9/38deb942-d44a-f2bb-205c-ddf05be84693/mzaf_9747647124859107103.plus.aac.p.m4a' },
                  { id: 'SNG-010', title: 'Humnava Mere', artist: 'Jubin Nautiyal', category: 'Romantic BGM', duration: '5:04', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d8/5e/c3/d85ec3f3-450b-6a9b-7ea1-9345538922d7/mzaf_734647189651103547.plus.aac.p.m4a' },
                  { id: 'SNG-011', title: 'Dheere Dheere Se', artist: 'Yo Yo Honey Singh', category: 'Walima / Party', duration: '3:32', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b2/a9/5c/b2a95c7c-45d9-5402-097c-8914231cfc0b/mzaf_11470489494488922036.plus.aac.p.m4a' },
                  { id: 'SNG-012', title: 'Wafa Ne Bewafai', artist: 'Arijit Singh, Neeti Mohan', category: 'Cinematic BGM', duration: '4:40', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/09/62/2c/09622c03-86c3-0acd-a22c-18e9f8703c89/mzaf_9536739329870064023.plus.aac.p.m4a' },
                  { id: 'SNG-013', title: 'Kesariya', artist: 'Pritam, Arijit Singh', category: 'Couple Entry', duration: '4:28', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a' },
                  { id: 'SNG-014', title: 'Sitare', artist: 'Ayaan Khan', category: 'Romantic BGM', duration: '3:15', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/19/0f/dd/190fdd71-103d-fef5-f5db-6483967cba1e/mzaf_4765136315761044502.plus.aac.p.m4a' },
                  { id: 'SNG-015', title: 'Pehli Dafa', artist: 'Atif Aslam', category: 'Romantic BGM', duration: '4:52', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/a0/94/f9/a094f99f-c175-d9dd-c475-040048553ea1/mzaf_16550135546441316062.plus.aac.p.m4a' },
                  { id: 'SNG-016', title: 'Tere Hawale', artist: 'Arijit Singh', category: 'Couple Entry', duration: '5:50', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/96/d1/cd/96d1cda3-c23d-6526-0a32-8681a869af2f/mzaf_8710952031724882316.plus.aac.p.m4a' },
                  { id: 'SNG-017', title: 'Tum Se Hi', artist: 'Mohit Chauhan', category: 'Romantic BGM', duration: '5:21', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e7/39/b8/e739b870-54a1-8f33-57d5-3817108b8bd9/mzaf_16925921654959290990.plus.aac.p.m4a' },
                  { id: 'SNG-018', title: 'Channa Mereya', artist: 'Arijit Singh', category: 'Cinematic BGM', duration: '4:49', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d5/f9/98/d5f998a7-0090-ee2d-03f8-557ad6c5bf65/mzaf_14251357991592637728.plus.aac.p.m4a' },
                  { id: 'SNG-019', title: 'Tera Hua', artist: 'Atif Aslam', category: 'Romantic BGM', duration: '3:34', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/bd/97/56/bd97566b-42ee-c10b-f6da-c39b73ba4f2c/mzaf_15535758550840505739.plus.aac.p.m4a' },
                  { id: 'SNG-020', title: 'Thame Dilo Ki Baatain', artist: 'Atif Aslam', category: 'Romantic BGM', duration: '4:00', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/43/e6/03/43e60360-3f3c-8f87-1852-da6a9149281f/mzaf_2580734198283556935.plus.aac.p.m4a' },
                  { id: 'SNG-021', title: 'Sun Saathiya', artist: 'Priya Saraiya', category: 'Couple Entry', duration: '3:38', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/5c/62/99/5c6299c1-06f1-c8c7-ac80-1ef12df6f037/mzaf_14533040876006658299.plus.aac.p.m4a' },
                  { id: 'SNG-022', title: 'Tera Ban Jaunga', artist: 'Akhil Sachdeva', category: 'Romantic BGM', duration: '3:56', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/61/a9/59/61a95964-c914-f0fe-b99b-4348851c13ee/mzaf_750697725323217609.plus.aac.p.m4a' },
                  { id: 'SNG-023', title: 'Kya Sach Ho Tum', artist: 'Amna Riaz', category: 'Romantic BGM', duration: '3:10', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/90/57/28/90572899-cf22-5791-68dc-6db961bcb308/mzaf_13889619915411454579.plus.aac.p.m4a' },
                  { id: 'SNG-024', title: 'Saiyan Dil Mein Aana Re', artist: 'Shamshad Begum', category: 'Fun / Retro', duration: '3:20', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/21/bf/11/21bf117c-744b-db9d-06f2-f1f5c87fb998/mzaf_7994364603410990968.plus.aac.p.m4a' }
                ].map((song) => {
                  const isPlaying = playingSong === song.id;
                  const isSelected = currentSongIds.includes(song.id);
                  return (
                    <div key={song.id} className={`p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${isPlaying ? 'bg-[#f2a900]/10 border-[#f2a900]/50' : 'bg-black/50 border-white/10 hover:border-white/20'}`}>
                      <div className="flex items-center gap-3.5">
                        <button
                          onClick={() => {
                            if (isPlaying) {
                              setPlayingSong(null);
                              studioAudio.stop();
                            } else {
                              setPlayingSong(song.id);
                              studioAudio.playSong(song.id, song.previewUrl);
                            }
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-[#f2a900] text-black shadow-lg scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div>
                          <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                            {song.title}
                            {isPlaying && <span className="text-[10px] bg-[#f2a900] text-black px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">Playing</span>}
                          </h4>
                          <p className="text-white/50 text-xs mt-0.5">{song.artist} • <span className="text-[#f2a900] font-mono">{song.category}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-white/80 font-mono text-xs">{song.duration}</span>
                        <button onClick={() => handleToggleSong(song.id, song.title)} className={`mt-2 px-3 py-1 ml-auto block rounded-lg text-[10px] font-bold uppercase transition-all ${isSelected ? "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white" : "bg-white/10 text-white hover:bg-[#f2a900] hover:text-black"}`}>
                          {isSelected ? "Remove" : "Select"}
                        </button>
                        {isSelected && (
                          <div className="text-green-400 text-[10px] flex items-center justify-end gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Selected
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-white/10 pt-8">
                <h3 className="font-serif text-xl font-medium text-white mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#f2a900]" /> Add Custom Song
                </h3>
                <form onSubmit={handleAddCustomSong} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={customSongName}
                    onChange={(e) => setCustomSongName(e.target.value)}
                    placeholder="Song Name & Artist"
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2a900] md:col-span-1"
                  />
                  <input
                    type="text"
                    value={customEventName}
                    onChange={(e) => setCustomEventName(e.target.value)}
                    placeholder="Event Name (e.g., Barat Entry)"
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2a900] md:col-span-1"
                  />
                  
                  <button type="submit" className="bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs px-6 py-2.5 rounded-xl transition-all shadow-lg md:col-span-1">
                    Add Custom Song
                  </button>
                </form>

                {/* Display custom requests */}
                {(draftNotes || playlistData?.notes) && (
                  <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-[#f2a900] text-xs font-bold uppercase tracking-wider mb-2">Custom Requests:</h4>
                    <pre className="text-white/70 text-xs whitespace-pre-wrap font-sans">{draftNotes !== null ? draftNotes : playlistData?.notes}</pre>
                  </div>
                )}

</div>
{/* Submit Selections Button */}
              {draftSongIds !== null && (
                <div className="mt-8 border-t border-[#f2a900]/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#f2a900]/5 p-6 rounded-2xl">
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#f2a900]"/> Unsaved Selections</h3>
                    <p className="text-white/60 text-xs mt-1">You have made changes to your song selection. Click submit to send them to the studio.</p>
                  </div>
                  <button onClick={handleSubmitSelections} className="w-full md:w-auto bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs px-8 py-3.5 rounded-xl transition-all shadow-lg flex-shrink-0 flex items-center justify-center gap-2">
                    Submit Selections
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab 4: Security & Account Settings (Change Password) */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#f2a900]/10 border border-[#f2a900]/30 text-[#f2a900] flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-medium text-white">Change Portal Password</h2>
                  <p className="text-white/50 text-xs">Update your private client portal access credentials.</p>
                </div>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                {passError && (
                  <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 py-3 px-4 rounded-xl">
                    {passError}
                  </div>
                )}
                {passSuccess && (
                  <div className="text-[#f2a900] text-xs bg-[#f2a900]/10 border border-[#f2a900]/30 py-3 px-4 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{passSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter current password" 
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password (min. 6 characters)" 
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="Confirm new password" 
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isChangingPass}
                  className="w-full bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg shadow-[#f2a900]/20 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                >
                  {isChangingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  {isChangingPass ? "Updating Security..." : "Save New Password"}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="font-serif text-xl font-medium text-white mb-4">Account Profile</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-white/40 block text-xs uppercase tracking-wider mb-1">Registered Client</span>
                    <span className="text-white font-medium">{user?.name || 'Client Account'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs uppercase tracking-wider mb-1">Email Address</span>
                    <span className="text-white font-medium">{user?.email || 'client@muzframe.studio'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs uppercase tracking-wider mb-1">Access Role</span>
                    <span className="bg-[#f2a900]/20 text-[#f2a900] text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider inline-block">Authorized Client</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 border border-white/10 rounded-3xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">End-to-End Portal Encryption</h4>
                  <p className="text-white/50 text-xs mt-1">All collection downloads and client communications are protected by 256-bit SSL encryption.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: New Booking */}
        {activeTab === 'booking' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#f2a900]/10 border border-[#f2a900]/30 rounded-2xl p-4 flex items-start gap-3 mb-6">
              <Calendar className="w-5 h-5 text-[#f2a900] flex-shrink-0 mt-0.5 pointer-events-none" />
              <div>
                <h4 className="text-[#f2a900] text-sm font-bold uppercase tracking-wider mb-1">Book New Event</h4>
                <p className="text-white/70 text-xs leading-relaxed">Fill out the details below to request a new event booking. Your request will be sent to the admin portal and instantly via WhatsApp for quick response.</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              {bookingSuccess && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" /> Booking request sent successfully! We will contact you soon.
                </div>
              )}
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">Event Types (Select Multiple)</label>
                  {bookingErrors.events && <span className="text-red-500 text-xs mb-3 block">{bookingErrors.events}</span>}
                  <div className="grid grid-cols-2 gap-3">
                    {bookingEvents.map((ev, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${ev.selected ? 'border-[#f2a900] bg-[#f2a900]/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                          <input 
                            type="checkbox" 
                            checked={ev.selected}
                            onChange={() => toggleBookingEvent(index)}
                            className="accent-[#f2a900] w-4 h-4"
                          />
                          <span className="text-sm font-medium">{ev.type}</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-4">
                    {bookingEvents.map((ev, index) => ev.selected && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        key={`details-${index}`} 
                        className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3"
                      >
                        <h5 className="font-semibold text-[#f2a900]">{ev.type} Details</h5>
                        
                        {ev.type === 'Other' && (
                          <div>
                            <input 
                              type="text" 
                              placeholder="Specify Event Type"
                              value={ev.customType}
                              onChange={(e) => handleBookingEventChange(index, 'customType', e.target.value)}
                              className={`w-full bg-black/50 border ${bookingErrors[`custom_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f2a900]`}
                            />
                            {bookingErrors[`custom_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{bookingErrors[`custom_${ev.type}`]}</span>}
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                <input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} 
                                  type="date"
                                  value={ev.date}
                                  onChange={(e) => handleBookingEventChange(index, 'date', e.target.value)}
                                  className={`w-full pl-9 pr-3 py-2 bg-black/50 border ${bookingErrors[`date_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                                />
                              </div>
                              {bookingErrors[`date_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{bookingErrors[`date_${ev.type}`]}</span>}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                  <input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} 
                                    type="time"
                                    value={ev.startTime}
                                    onChange={(e) => handleBookingEventChange(index, 'startTime', e.target.value)}
                                    className={`w-full pl-9 pr-3 py-2 bg-black/50 border ${bookingErrors[`startTime_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                                  />
                                </div>
                                {bookingErrors[`startTime_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{bookingErrors[`startTime_${ev.type}`]}</span>}
                              </div>
                              <span className="text-white/50 text-xs">to</span>
                              <div className="flex-1">
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                  <input onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} 
                                    type="time"
                                    value={ev.endTime}
                                    onChange={(e) => handleBookingEventChange(index, 'endTime', e.target.value)}
                                    className={`w-full pl-9 pr-3 py-2 bg-black/50 border ${bookingErrors[`endTime_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                                  />
                                </div>
                                {bookingErrors[`endTime_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{bookingErrors[`endTime_${ev.type}`]}</span>}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                            <div className={ev.type === 'Barat' ? 'col-span-1' : 'col-span-1 md:col-span-2'}>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input 
                                  type="text"
                                  placeholder={ev.type === 'Barat' ? 'Departure Location' : 'Venue Location'}
                                  value={ev.startLocation}
                                  onChange={(e) => handleBookingEventChange(index, 'startLocation', e.target.value)}
                                  className={`w-full pl-9 pr-3 py-2 bg-black/50 border ${bookingErrors[`startLocation_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                                />
                              </div>
                              {bookingErrors[`startLocation_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{bookingErrors[`startLocation_${ev.type}`]}</span>}
                            </div>
                            
                            {ev.type === 'Barat' && (
                              <div>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                  <input 
                                    type="text"
                                    placeholder="Arrival Location"
                                    value={ev.endLocation}
                                    onChange={(e) => handleBookingEventChange(index, 'endLocation', e.target.value)}
                                    className={`w-full pl-9 pr-3 py-2 bg-black/50 border ${bookingErrors[`endLocation_${ev.type}`] ? 'border-red-500' : 'border-white/10'} rounded-lg text-sm text-white focus:outline-none focus:border-[#f2a900] [color-scheme:dark]`}
                                  />
                                </div>
                                {bookingErrors[`endLocation_${ev.type}`] && <span className="text-red-500 text-xs mt-1 block">{bookingErrors[`endLocation_${ev.type}`]}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Select Package</label>
                    <select 
                      value={bookingPackage}
                      onChange={(e) => setBookingPackage(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                    >
                      <option value="" disabled>Choose a package...</option>
                      <option value="Premium Wedding Cover">Premium Wedding Cover</option>
                      <option value="Luxury Cinematic Package">Luxury Cinematic Package</option>
                      <option value="Basic Event Shoot">Basic Event Shoot</option>
                      <option value="Pre-Wedding / Engagement">Pre-Wedding / Engagement</option>
                      <option value="Custom Quote">Custom Quote / Other</option>
                    </select>
                  </div>

                  {bookingPackage === 'Custom Quote' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Your Budget (Rs.)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 150000" 
                        value={bookingBudget}
                        onChange={(e) => setBookingBudget(e.target.value)}
                        className={`w-full bg-black/50 border ${bookingErrors.budget ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors [color-scheme:dark] [color-scheme:dark] [color-scheme:dark]`}
                      />
                      {bookingErrors.budget && <span className="text-red-500 text-xs mt-1 block">{bookingErrors.budget}</span>}
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Preferred Songs / Additional Notes</label>
                  <textarea 
                    placeholder="E.g., We would love to use 'Kesariya' for our entry and 'Tum Hi Ho' for the romantic sequence." 
                    value={bookingSongs}
                    onChange={(e) => setBookingSongs(e.target.value)}
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#f2a900]/50 transition-colors"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmittingBooking}
                  className="w-full md:w-auto bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs py-4 px-8 rounded-xl transition-all shadow-lg shadow-[#f2a900]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmittingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4 pointer-events-none" />}
                  {isSubmittingBooking ? "Sending Request..." : "Submit Booking Request"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

