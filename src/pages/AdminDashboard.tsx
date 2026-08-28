import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Image as ImageIcon, 
  Bell, 
  ArrowLeft, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Send, 
  Edit3, 
  Upload,
  ShieldAlert,
  LogOut,
  Sparkles,
  Eye,
  Music,
  Play,
  Pause,
  Download,
  FileText,
  Printer,
  Volume2,
  ListMusic,
  ListPlus,
  Check,
  Disc,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { studioAudio } from '../utils/audioPlayer';

interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  eventName: string;
  eventType?: 'Wedding' | 'Barat' | 'Walima' | 'Corporate' | 'Mehndi';
  eventDate: string;
  package: string;
  status: 'active' | 'completed' | 'pending';
  totalAmount: number;
  paidAmount: number;
}

interface EventRecord {
  id: string;
  clientName: string;
  eventName: string;
  eventType: 'Wedding' | 'Barat' | 'Walima' | 'Corporate' | 'Mehndi';
  date: string;
  venue: string;
  teamLead: string;
  packageDetails: string;
  status: 'Upcoming' | 'In Progress' | 'Editing' | 'Color Grading' | 'Delivered';
  deliverablesCount: number;
}

interface PaymentRecord {
  id: string;
  clientName: string;
  eventName: string;
  amount: number;
  date: string;
  method: 'Bank Transfer' | 'Cash' | 'Easypaisa / JazzCash';
  status: 'Received' | 'Pending';
}

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  recipient: string;
  date: string;
  sent: boolean;
}

interface SongRecord {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: string;
  bpm: string;
  previewUrl: string;
}

interface ClientPlaylist {
  clientId: string;
  clientName: string;
  songIds: string[];
  status: 'Draft' | 'Submitted & Locked';
}

const INITIAL_SONGS: SongRecord[] = [
  { id: 'SNG-001', title: 'Tum Ho Toh', artist: 'Atif Aslam', category: 'Romantic BGM', duration: '5:10', bpm: '85 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/73/a1/fd/73a1fd04-ffc4-3678-12fd-8e2ce97356c5/mzaf_2445518110460654640.plus.aac.p.m4a' },
  { id: 'SNG-002', title: 'Humdam', artist: 'Hadiqa Kiani', category: 'Romantic BGM', duration: '4:25', bpm: '90 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview118/v4/a3/35/0e/a3350ef0-0be9-293a-4ec3-8877acb4ae65/mzaf_1893472275867306424.plus.aac.p.m4a' },
  { id: 'SNG-003', title: 'Thaam Lo', artist: 'Atif Aslam', category: 'Couple Entry', duration: '4:00', bpm: '88 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/43/e6/03/43e60360-3f3c-8f87-1852-da6a9149281f/mzaf_2580734198283556935.plus.aac.p.m4a' },
  { id: 'SNG-004', title: 'Jaan Ban Gaye', artist: 'Mithoon, Vishal Mishra', category: 'Couple Entry', duration: '3:45', bpm: '92 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2e/f1/37/2ef13747-be9f-0ced-ebce-3c0356596d4a/mzaf_3559882409919622792.plus.aac.p.m4a' },
  { id: 'SNG-005', title: 'Humdard', artist: 'Arijit Singh', category: 'Romantic BGM', duration: '4:20', bpm: '80 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/92/ab/f4/92abf498-4a29-bc78-8aab-100b6024f618/mzaf_10618261139799213404.plus.aac.p.m4a' },
  { id: 'SNG-006', title: 'Tum Mile', artist: 'Neeraj Shridhar', category: 'Cinematic Teaser', duration: '5:43', bpm: '110 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ff/92/e7/ff92e77e-e631-2c22-e8fb-87c10ff42a01/mzaf_3559705285033933426.plus.aac.p.m4a' },
  { id: 'SNG-007', title: 'Tune Jo Na Kaha', artist: 'Mohit Chauhan', category: 'Romantic BGM', duration: '5:10', bpm: '82 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ed/43/e6/ed43e64f-231e-06a5-8e02-341ee4b1b597/mzaf_7067163473511570473.plus.aac.p.m4a' },
  { id: 'SNG-008', title: 'Hawayein', artist: 'Arijit Singh', category: 'Romantic BGM', duration: '4:50', bpm: '95 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/15/d1/a8/15d1a862-edcd-6a92-624a-2bbf0f7eff26/mzaf_7165241817401822857.plus.aac.p.m4a' },
  { id: 'SNG-009', title: 'Tum Hi Ho', artist: 'Arijit Singh', category: 'Couple Entry', duration: '4:22', bpm: '85 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/38/de/b9/38deb942-d44a-f2bb-205c-ddf05be84693/mzaf_9747647124859107103.plus.aac.p.m4a' },
  { id: 'SNG-010', title: 'Humnava Mere', artist: 'Jubin Nautiyal', category: 'Romantic BGM', duration: '5:04', bpm: '78 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d8/5e/c3/d85ec3f3-450b-6a9b-7ea1-9345538922d7/mzaf_734647189651103547.plus.aac.p.m4a' },
  { id: 'SNG-011', title: 'Dheere Dheere Se', artist: 'Yo Yo Honey Singh', category: 'Walima / Party', duration: '3:32', bpm: '105 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b2/a9/5c/b2a95c7c-45d9-5402-097c-8914231cfc0b/mzaf_11470489494488922036.plus.aac.p.m4a' },
  { id: 'SNG-012', title: 'Wafa Ne Bewafai', artist: 'Arijit Singh, Neeti Mohan', category: 'Cinematic BGM', duration: '4:40', bpm: '80 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/09/62/2c/09622c03-86c3-0acd-a22c-18e9f8703c89/mzaf_9536739329870064023.plus.aac.p.m4a' },
  { id: 'SNG-013', title: 'Kesariya', artist: 'Pritam, Arijit Singh', category: 'Couple Entry', duration: '4:28', bpm: '94 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a' },
  { id: 'SNG-014', title: 'Sitare', artist: 'Ayaan Khan', category: 'Romantic BGM', duration: '3:15', bpm: '100 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/19/0f/dd/190fdd71-103d-fef5-f5db-6483967cba1e/mzaf_4765136315761044502.plus.aac.p.m4a' },
  { id: 'SNG-015', title: 'Pehli Dafa', artist: 'Atif Aslam', category: 'Romantic BGM', duration: '4:52', bpm: '85 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/a0/94/f9/a094f99f-c175-d9dd-c475-040048553ea1/mzaf_16550135546441316062.plus.aac.p.m4a' },
  { id: 'SNG-016', title: 'Tere Hawale', artist: 'Arijit Singh', category: 'Couple Entry', duration: '5:50', bpm: '82 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/96/d1/cd/96d1cda3-c23d-6526-0a32-8681a869af2f/mzaf_8710952031724882316.plus.aac.p.m4a' },
  { id: 'SNG-017', title: 'Tum Se Hi', artist: 'Mohit Chauhan', category: 'Romantic BGM', duration: '5:21', bpm: '90 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e7/39/b8/e739b870-54a1-8f33-57d5-3817108b8bd9/mzaf_16925921654959290990.plus.aac.p.m4a' },
  { id: 'SNG-018', title: 'Channa Mereya', artist: 'Arijit Singh', category: 'Cinematic BGM', duration: '4:49', bpm: '88 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d5/f9/98/d5f998a7-0090-ee2d-03f8-557ad6c5bf65/mzaf_14251357991592637728.plus.aac.p.m4a' },
  { id: 'SNG-019', title: 'Tera Hua', artist: 'Atif Aslam', category: 'Romantic BGM', duration: '3:34', bpm: '95 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/bd/97/56/bd97566b-42ee-c10b-f6da-c39b73ba4f2c/mzaf_15535758550840505739.plus.aac.p.m4a' },
  { id: 'SNG-020', title: 'Thame Dilo Ki Baatain', artist: 'Atif Aslam', category: 'Romantic BGM', duration: '4:00', bpm: '88 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/43/e6/03/43e60360-3f3c-8f87-1852-da6a9149281f/mzaf_2580734198283556935.plus.aac.p.m4a' },
  { id: 'SNG-021', title: 'Sun Saathiya', artist: 'Priya Saraiya', category: 'Couple Entry', duration: '3:38', bpm: '110 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/5c/62/99/5c6299c1-06f1-c8c7-ac80-1ef12df6f037/mzaf_14533040876006658299.plus.aac.p.m4a' },
  { id: 'SNG-022', title: 'Tera Ban Jaunga', artist: 'Akhil Sachdeva', category: 'Romantic BGM', duration: '3:56', bpm: '92 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/61/a9/59/61a95964-c914-f0fe-b99b-4348851c13ee/mzaf_750697725323217609.plus.aac.p.m4a' },
  { id: 'SNG-023', title: 'Kya Sach Ho Tum', artist: 'Amna Riaz', category: 'Romantic BGM', duration: '3:10', bpm: '80 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/90/57/28/90572899-cf22-5791-68dc-6db961bcb308/mzaf_13889619915411454579.plus.aac.p.m4a' },
  { id: 'SNG-024', title: 'Saiyan Dil Mein Aana Re', artist: 'Shamshad Begum', category: 'Fun / Retro', duration: '3:20', bpm: '120 BPM', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/21/bf/11/21bf117c-744b-db9d-06f2-f1f5c87fb998/mzaf_7994364603410990968.plus.aac.p.m4a' }
];

// Helper for dynamic countdown timer calculation
function calculateCountdown(dateString: string): string {
  try {
    const targetDate = new Date(dateString).getTime();
    const now = new Date().getTime();
    if (isNaN(targetDate)) return 'Date TBD';
    const diff = targetDate - now;
    if (diff <= 0) return 'Live / Completed';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h Remaining`;
  } catch {
    return 'Upcoming';
  }
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Route protection inside the component just in case
  useEffect(() => {
    if (!user || user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState<'clients' | 'events' | 'payments' | 'songs' | 'gallery' | 'notifications'>('clients');
  const [searchTerm, setSearchTerm] = useState('');

  // States
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [playlists, setPlaylists] = useState<ClientPlaylist[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<{id: string, date: string, reason: string}[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');
  
  const [songs] = useState<SongRecord[]>(INITIAL_SONGS);
  const [songCategory, setSongCategory] = useState<string>('All');
  const [songSearch, setSongSearch] = useState<string>('');
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  const [selectedPlaylistClient, setSelectedPlaylistClient] = useState<string>('');
  const [toastMsg, setToastMsg] = useState('');

  // Modals
    const [showEditClient, setShowEditClient] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    eventName: '', 
    eventType: 'Wedding' as const,
    eventDate: new Date().toISOString().split('T')[0],
    package: 'Luxury 3-Day Cinematic Package', 
    totalAmount: '90000',
    paidAmount: '0'
  });

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    clientName: '',
    eventName: '',
    amount: '0',
    method: 'Bank Transfer' as const,
    status: 'Received' as const
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchJson = (url: string) => fetch(url).then(async res => {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const text = await res.text();
          try { return JSON.parse(text); } catch (e) { return []; }
        });
        const [cRes, eRes, pRes, nRes, plRes, aRes, bdRes] = await Promise.all([
          fetchJson('/api/clients'),
          fetchJson('/api/events'),
          fetchJson('/api/payments'),
          fetchJson('/api/notifications'),
          fetchJson('/api/playlists'),
          fetchJson('/api/activities'),
          fetchJson('/api/blocked-dates')
        ]);
        setClients(cRes);
        setEvents(eRes);
        setPayments(pRes);
        setNotifications(nRes);
        setPlaylists(plRes);
        setActivities(aRes);
        setBlockedDates(bdRes);
        if (cRes.length > 0) {
          setSelectedPlaylistClient(cRes[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
    };
    fetchData();
    // Poll for activities every 10 seconds
    const interval = setInterval(fetchData, 3000);
    
  return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleAudioStopped = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.songId) {
        setPlayingSongId(prev => prev === customEvent.detail.songId ? null : prev);
      }
    };
    window.addEventListener('audio-stopped', handleAudioStopped);
    return () => {
      studioAudio.stop();
      window.removeEventListener('audio-stopped', handleAudioStopped);
    };
  }, []);

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newBlockedDate, reason: newBlockedReason })
      });
      if (res.ok) {
        const bd = await res.json();
        setBlockedDates([...blockedDates, bd]);
        setNewBlockedDate('');
        setNewBlockedReason('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnblockDate = async (id: string) => {
    try {
      const res = await fetch(`/api/blocked-dates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlockedDates(blockedDates.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

    const handleEditClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    const tot = parseInt(editingClient.totalAmount) || 0;
    const paid = parseInt(editingClient.paidAmount) || 0;
    const updated = { ...editingClient, totalAmount: tot, paidAmount: paid };
    
    await fetch(`/api/clients/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    
    const [freshClients, freshEvents, freshPayments] = await Promise.all([
      fetch('/api/clients').then(res => res.json()),
      fetch('/api/events').then(res => res.json()),
      fetch('/api/payments').then(res => res.json())
    ]);
    setClients(freshClients);
    setEvents(freshEvents);
    setPayments(freshPayments);
    
    setShowEditClient(false);
    triggerToast('Client account updated successfully.');
  };

    const handleEditEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    await fetch(`/api/events/${editingEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingEvent)
    });
    setEvents(events.map(ev => ev.id === editingEvent.id ? editingEvent : ev));
    setShowEditEvent(false);
    triggerToast('Event details updated successfully.');
  };

  const handleAddClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) return;

    const tot = parseInt(newClient.totalAmount) || 90000;
    const paid = parseInt(newClient.paidAmount) || 0;

    const created: ClientRecord = {
      id: `CLI-${Math.floor(100 + Math.random() * 900)}`,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone || '0300-6103262',
      eventName: newClient.eventName || `${newClient.name}'s ${newClient.eventType}`,
      eventType: newClient.eventType,
      eventDate: newClient.eventDate,
      package: newClient.package,
      status: 'active',
      totalAmount: tot,
      paidAmount: paid
    };

    const createdEvent: EventRecord = {
      id: `EVT-${Math.floor(100 + Math.random() * 900)}`,
      clientName: created.name,
      eventName: created.eventName,
      eventType: created.eventType || 'Wedding',
      date: created.eventDate,
      venue: 'Grand Marquee Studio Venue',
      teamLead: 'Muzammal Khan (Lead Cinematographer)',
      packageDetails: created.package,
      status: 'Upcoming',
      deliverablesCount: 0
    };

    const clientRes = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    });
    
    if (!clientRes.ok) {
        const errorData = await clientRes.json();
        alert(errorData.error || "Failed to add client");
        return;
    }

    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdEvent)
    });

    setClients([created, ...clients]);
    setEvents([createdEvent, ...events]);

    if (paid > 0) {
      const payment: PaymentRecord = {
        id: `PAY-${Math.floor(800 + Math.random() * 199)}`,
        clientName: created.name,
        eventName: created.eventName,
        amount: paid,
        date: new Date().toISOString().split('T')[0],
        method: 'Bank Transfer',
        status: 'Received'
      };
      await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      });
      setPayments([payment, ...payments]);
    }

    setShowAddClient(false);
    setNewClient({ name: '', email: '', phone: '', eventName: '', eventType: 'Wedding', eventDate: new Date().toISOString().split('T')[0], package: 'Luxury 3-Day Cinematic Package', totalAmount: '90000', paidAmount: '0' });
    triggerToast(`Client ${created.name} registered successfully!`);
  };

  const handleDeleteClient = async (id: string) => {
    await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    
    const [freshClients, freshEvents, freshPayments] = await Promise.all([
      fetch('/api/clients').then(res => res.json()),
      fetch('/api/events').then(res => res.json()),
      fetch('/api/payments').then(res => res.json())
    ]);
    setClients(freshClients);
    setEvents(freshEvents);
    setPayments(freshPayments);
    
    triggerToast('Client account & associated timelines removed.');
  };

  const handleAddPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(newPayment.amount) || 0;
    if (amt <= 0) return;

    const created: PaymentRecord = {
      id: `PAY-${Math.floor(800 + Math.random() * 199)}`,
      clientName: newPayment.clientName,
      eventName: newPayment.eventName,
      amount: amt,
      date: new Date().toLocaleDateString('en-GB'),
      method: newPayment.method,
      status: newPayment.status
    };

    await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    });

    setPayments([created, ...payments]);

    // Update client paid amount
    const targetClient = clients.find(c => c.name === newPayment.clientName);
    if (targetClient) {
      const updatedClient = { ...targetClient, paidAmount: Math.min(targetClient.totalAmount, targetClient.paidAmount + amt) };
      await fetch(`/api/clients/${targetClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClient)
      });
      setClients(clients.map(c => c.id === targetClient.id ? updatedClient : c));
    }

    setShowAddPayment(false);
    triggerToast(`Payment of Rs. ${amt.toLocaleString()} recorded for ${newPayment.clientName}!`);
  };

  const handleUpdatePaymentStatus = async (paymentId: string, newStatus: PaymentRecord['status']) => {
    await fetch(`/api/payments/${paymentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setPayments(payments.map(p => p.id === paymentId ? { ...p, status: newStatus } : p));
    triggerToast(`Payment status updated to "${newStatus}"!`);
  };

  const handleUpdateEventStatus = async (eventId: string, newStatus: EventRecord['status']) => {
    await fetch(`/api/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setEvents(events.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
    triggerToast(`Event status updated to "${newStatus}"!`);
  };

  const handleSendNotification = async (e: React.FormEvent, title: string, message: string, recipient: string) => {
    e.preventDefault();
    if (!title || !message) return;

    const created: NotificationRecord = {
      id: `NOT-${Math.floor(10 + Math.random() * 90)}`,
      title,
      message,
      recipient,
      date: 'Just now',
      sent: true
    };

    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    });

    setNotifications([created, ...notifications]);
    triggerToast(`Alert dispatched to ${recipient}!`);
  };

  const handleDownloadInvoice = (client: ClientRecord) => {
    const remaining = client.totalAmount - client.paidAmount;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerToast('Popup blocked. Please allow popups to download official invoice.');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${client.id} - MuzFrame Studio</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 3px solid #f2a900; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 28px; font-weight: bold; color: #000; margin: 0; }
            .subtitle { color: #555; font-size: 14px; margin-top: 5px; }
            .badge { background: #f2a900; color: #000; padding: 6px 12px; font-weight: bold; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
            .grid { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .box { background: #f8f9fa; padding: 15px; border-radius: 8px; flex: 1; margin-right: 15px; border: 1px solid #ddd; }
            .box:last-child { margin-right: 0; }
            table { w-full; width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 14px; }
            th { background-color: #111; color: #fff; text-transform: uppercase; font-size: 12px; }
            .total-row { font-weight: bold; background: #fffcf5; }
            .stamp { margin-top: 50px; text-align: right; }
            .stamp-line { border-top: 1px solid #333; display: inline-block; padding-top: 5px; width: 220px; text-align: center; font-size: 13px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">MUZFRAME CINEMATOGRAPHY</h1>
              <div class="subtitle">Luxury Wedding & Cinematic Films • Office No.32, Hasilpur</div>
              <div class="subtitle">Director: Muzammal Khan • Contact: +92 300 6103262</div>
            </div>
            <div>
              <span class="badge">OFFICIAL INVOICE</span>
            </div>
          </div>

          <div class="grid">
            <div class="box">
              <strong style="font-size: 12px; color: #666; text-transform: uppercase;">Billed To Client:</strong><br/>
              <strong style="font-size: 18px;">${client.name}</strong><br/>
              Phone: ${client.phone}<br/>
              Email: ${client.email}
            </div>
            <div class="box">
              <strong style="font-size: 12px; color: #666; text-transform: uppercase;">Event Reference:</strong><br/>
              <strong>${client.eventName}</strong><br/>
              Event Date: ${client.eventDate}<br/>
              Invoice Date: ${new Date().toLocaleDateString('en-GB')}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description / Package Deliverables</th>
                <th>Contract Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${client.package}</strong><br/>
                  <small style="color: #666;">Includes multi-camera cinematography, high-altitude 4K drone coverage, color grading, highlights teaser reel, and full HD leather album production.</small>
                </td>
                <td>Rs. ${client.totalAmount.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>Advance Amount Paid (Verified)</td>
                <td style="color: green;">- Rs. ${client.paidAmount.toLocaleString()}</td>
              </tr>
              <tr class="total-row" style="font-size: 16px;">
                <td>Remaining Balance Due</td>
                <td style="color: #d9534f;">Rs. ${remaining.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="stamp">
            <div style="margin-bottom: 40px; font-style: italic; color: #555;">Authorized Electronic Signature</div>
            <div class="stamp-line">Muzammal Khan (Lead Director)</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    triggerToast(`Official printable invoice generated for ${client.name}!`);
  };

  const handleTogglePlaylistSong = async (songId: string) => {
    let updatedPlaylist: ClientPlaylist | null = null;
    setPlaylists(prev => {
      const nextPlaylists = prev.map(pl => {
        if (pl.clientId === selectedPlaylistClient) {
          const exists = pl.songIds.includes(songId);
          const nextPl = {
            ...pl,
            songIds: exists ? pl.songIds.filter(id => id !== songId) : [...pl.songIds, songId]
          };
          updatedPlaylist = nextPl;
          return nextPl;
        }
        return pl;
      });
      return nextPlaylists;
    });

    if (!updatedPlaylist) {
      // Create new playlist if doesn't exist
      const client = clients.find(c => c.id === selectedPlaylistClient);
      if (client) {
        updatedPlaylist = {
          clientId: client.id,
          clientName: client.name,
          songIds: [songId],
          status: 'Draft'
        };
        setPlaylists(prev => [...prev, updatedPlaylist as ClientPlaylist]);
      }
    }

    if (updatedPlaylist) {
      await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlaylist)
      });
      triggerToast('Client song selection playlist updated!');
    }
  };

  const handleLockPlaylist = async () => {
    let updatedPlaylist: ClientPlaylist | null = null;
    let nextStatus: 'Draft' | 'Submitted & Locked' = 'Draft';
    setPlaylists(prev => {
      const nextPlaylists = prev.map(pl => {
        if (pl.clientId === selectedPlaylistClient) {
          nextStatus = pl.status === 'Draft' ? 'Submitted & Locked' : 'Draft';
          const nextPl: ClientPlaylist = { ...pl, status: nextStatus };
          updatedPlaylist = nextPl;
          return nextPl;
        }
        return pl;
      });
      return nextPlaylists;
    });

    if (updatedPlaylist) {
      await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlaylist)
      });
      triggerToast(`Playlist marked as "${nextStatus}"!`);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSongs = songs.filter(s => {
    const matchCat = songCategory === 'All' || s.category === songCategory;
    const matchSearch = s.title.toLowerCase().includes(songSearch.toLowerCase()) || s.artist.toLowerCase().includes(songSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const activePlaylist = playlists.find(p => p.clientId === selectedPlaylistClient) || {
    clientId: selectedPlaylistClient,
    clientName: clients.find(c => c.id === selectedPlaylistClient)?.name || 'Client',
    songIds: [],
    status: 'Draft' as const
  };

  const totalRevenue = clients.reduce((sum, c) => sum + c.paidAmount, 0);
  const totalReceivables = clients.reduce((sum, c) => sum + Math.max(0, c.totalAmount - c.paidAmount), 0);

  return (
    <div className="min-h-screen bg-black pt-24 pb-24 text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="fixed top-24 right-6 bg-[#f2a900] text-black px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-2xl z-50 flex items-center gap-2.5 border border-white/20"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#f2a900] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Executive Control Center</span>
              <span className="text-white/50 text-xs font-mono">Logged in as: {user?.email || 'muzmmal.khan99@gmail.com'}</span>
            </div>
            <div className="flex items-center gap-4"><img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" /><h1 className="font-serif text-3xl md:text-4xl font-medium text-white">Console</h1></div>
            <p className="text-white/60 text-sm mt-1">Full real-time administration of clients, timelines, finances, and song selections.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link 
              to="/" 
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Main Website
            </Link>
            <button 
              onClick={() => { logout(); navigate('/login'); }} 
              className="px-5 py-3 rounded-full bg-red-500/20 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout Admin
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('clients')}
            className={`px-5 py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'clients' ? 'bg-[#f2a900] text-black shadow-lg shadow-[#f2a900]/20 font-bold' : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <Users className="w-4 h-4" /> 1. Client Management ({clients.length})
          </button>

          <button 
            onClick={() => setActiveTab('events')}
            className={`px-5 py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'events' ? 'bg-[#f2a900] text-black shadow-lg shadow-[#f2a900]/20 font-bold' : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <Calendar className="w-4 h-4" /> 2. Event Management ({events.length})
          </button>

          <button 
            onClick={() => setActiveTab('payments')}
            className={`px-5 py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'payments' ? 'bg-[#f2a900] text-black shadow-lg shadow-[#f2a900]/20 font-bold' : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <CreditCard className="w-4 h-4" /> 3. Payment Management
          </button>

          <button 
            onClick={() => setActiveTab('songs')}
            className={`px-5 py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'songs' ? 'bg-[#f2a900] text-black shadow-lg shadow-[#f2a900]/20 font-bold' : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <Music className="w-4 h-4" /> 4. Song Selection System
          </button>

          <button 
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'gallery' ? 'bg-[#f2a900] text-black shadow-lg shadow-[#f2a900]/20 font-bold' : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <ImageIcon className="w-4 h-4" /> Gallery Uploads
          </button>

          <button 
            onClick={() => setActiveTab('notifications')}
            className={`px-5 py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'notifications' ? 'bg-[#f2a900] text-black shadow-lg shadow-[#f2a900]/20 font-bold' : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <Bell className="w-4 h-4" /> Notifications Center
          </button>
          
          <button 
            onClick={() => setActiveTab('activities')}
            className={`px-5 py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'activities' ? 'bg-[#f2a900] text-black shadow-lg shadow-[#f2a900]/20 font-bold' : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <Sparkles className="w-4 h-4" /> Client Activities
          </button>
        </div>
      </div>

      {/* TAB: ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          <div className="bg-zinc-900/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6">
            <h2 className="text-xl font-serif font-medium text-white mb-6">Recent Client Activities</h2>
            {activities.length === 0 ? (
              <div className="text-white/40 text-sm text-center py-10">No recent client activity found.</div>
            ) : (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="bg-[#f2a900]/20 text-[#f2a900] p-2 rounded-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{act.clientName} <span className="text-white/50 font-normal">performed</span> {act.type}</div>
                      <div className="text-white/70 text-xs mt-1">{act.description}</div>
                      <div className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">{new Date(act.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: CLIENT MANAGEMENT */}
      {activeTab === 'clients' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text"
                placeholder="Search clients by name, event, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#f2a900]/60 transition-colors"
              />
            </div>

            <button 
              onClick={() => setShowAddClient(true)}
              className="bg-[#f2a900] hover:bg-white text-black px-6 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#f2a900]/20 self-start"
            >
              <Plus className="w-4 h-4" /> Add New Client Account
            </button>
          </div>

          <div className="bg-zinc-900/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-widest text-white/50">
                    <th className="py-4 px-6 font-semibold">Client Name & Details</th>
                    <th className="py-4 px-6 font-semibold">Upcoming Event & Timer</th>
                    <th className="py-4 px-6 font-semibold">Amount Paid & Balance</th>
                    <th className="py-4 px-6 font-semibold">Notifications</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {filteredClients.map((client) => {
                    const remaining = Math.max(0, client.totalAmount - client.paidAmount);
                    const percentPaid = Math.min(100, Math.round((client.paidAmount / client.totalAmount) * 100) || 0);
                    
                    const clientEventsList = events.filter(e => e.clientName === client.name);
                    const displayEventName = clientEventsList.length > 0 ? (clientEventsList.length === 1 ? clientEventsList[0].eventName : `${clientEventsList.length} Events Booked`) : client.eventName;
                    const displayEventDate = clientEventsList.length > 0 ? clientEventsList.map(e => e.date).sort()[0] : client.eventDate;
                    const countdown = calculateCountdown(displayEventDate);

                    return (
                      <tr key={client.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white flex items-center gap-2">
                            {client.name}
                            <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/60">{client.id}</span>
                          </div>
                          <div className="text-white/50 text-xs mt-0.5 flex items-center gap-1">
                            {client.email} • {client.phone}
                          </div>
                          <div className="text-[#f2a900]/70 text-[10px] mt-1 flex items-center gap-1 font-medium">
                            <MapPin className="w-3 h-3" /> {client.location || 'Location Not Provided'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-white">{displayEventName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[#f2a900] text-xs flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3" /> {displayEventDate}
                            </span>
                            <span className="bg-white/10 text-white/80 text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-[#f2a900]" /> {countdown}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-green-400 font-bold">Paid: Rs. {client.paidAmount.toLocaleString()}</span>
                            <span className="text-red-400 font-semibold">Bal: Rs. {remaining.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#f2a900] h-full" style={{ width: `${percentPaid}%` }}></div>
                          </div>
                          <div className="text-[10px] text-white/40 mt-1 font-mono">Total: Rs. {client.totalAmount.toLocaleString()} ({percentPaid}%)</div>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            onClick={() => {
                              setActiveTab('notifications');
                              triggerToast(`Prepared alert for ${client.name}`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#f2a900]/20 text-[#f2a900] border border-[#f2a900]/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                          >
                            <Bell className="w-3.5 h-3.5" /> Send Alert
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDownloadInvoice(client)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-[#f2a900] hover:text-black transition-colors text-white/80"
                              title="Download Printable Invoice"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <Link 
                              to={`/client/${client.id}`} 
                              className="p-2 rounded-xl bg-white/5 hover:bg-[#f2a900] hover:text-black transition-colors text-white/80" 
                              title="Inspect Client Portal"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDeleteClient(client.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors text-red-400"
                              title="Delete Client Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVENT MANAGEMENT */}
      {activeTab === 'events' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-medium text-white">Production & Event Tracking</h2>
              <p className="text-white/60 text-xs mt-1">Monitor assigned crews, venues, packages, and live production statuses.</p>
            </div>
          </div>

          
          <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 shadow-xl mb-6">
            <h3 className="font-serif text-xl font-medium text-white mb-4">Calendar Availability (Block Dates)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <form onSubmit={handleBlockDate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Select Date</label>
                  <input type="date" value={newBlockedDate} onChange={e => setNewBlockedDate(e.target.value)} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark] focus:outline-none focus:border-[#f2a900]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Reason (Optional)</label>
                  <input type="text" value={newBlockedReason} onChange={e => setNewBlockedReason(e.target.value)} placeholder="e.g., Public Holiday, Fully Booked" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f2a900]" />
                </div>
                <button type="submit" className="w-full bg-red-600/20 text-red-500 border border-red-500/30 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-red-600/30 transition-all flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Block Selected Date
                </button>
              </form>
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <h4 className="text-white/70 font-semibold text-sm mb-3">Currently Blocked Dates</h4>
                {blockedDates.length === 0 ? (
                  <p className="text-white/40 text-xs">No dates are currently blocked.</p>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {blockedDates.map(bd => (
                      <div key={bd.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/5 rounded-lg p-3 border border-white/10">
                        <div>
                          <p className="text-white font-medium text-sm">{new Date(bd.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          <p className="text-white/50 text-xs">{bd.reason}</p>
                        </div>
                        <button onClick={() => handleUnblockDate(bd.id)} className="text-white/40 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-md transition-all self-start sm:self-auto">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div key={evt.id} className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-[#f2a900]/50 transition-all shadow-xl space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/10 text-white font-mono text-[10px] px-2.5 py-1 rounded font-bold">{evt.id}</span>
                      <button onClick={() => { setEditingEvent(evt); setShowEditEvent(true); }} className="p-1 rounded bg-white/5 hover:bg-[#f2a900] hover:text-black transition-colors text-white/60">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="bg-[#f2a900]/10 border border-[#f2a900]/30 text-[#f2a900] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                      {evt.eventType || 'Wedding'}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-white mb-1">{evt.eventName}</h3>
                  <p className="text-white/60 text-xs mb-3">Client: <span className="text-white font-semibold">{evt.clientName}</span></p>

                  <div className="bg-black/50 p-3 rounded-2xl border border-white/5 space-y-2 text-xs mb-4">
                    <div className="flex justify-between">
                      <span className="text-white/50">Schedule Date</span>
                      <span className="text-[#f2a900] font-mono font-medium">{evt.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Venue</span>
                      <span className="text-white font-medium truncate max-w-[160px]">{evt.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Assigned Team</span>
                      <span className="text-white font-semibold">{evt.teamLead}</span>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider mb-1">Package Details</span>
                    <p className="text-white/80 font-medium bg-white/5 p-2 rounded-xl border border-white/5">{evt.packageDetails}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60 font-semibold">Visual Status Tracking:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${evt.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-[#f2a900]/20 text-[#f2a900]'}`}>
                      {evt.status}
                    </span>
                  </div>

                  <select
                    value={evt.status}
                    onChange={(e) => handleUpdateEventStatus(evt.id, e.target.value as any)}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:border-[#f2a900] focus:outline-none"
                  >
                    <option value="Upcoming">Status: Upcoming Shoot</option>
                    <option value="In Progress">Status: Shoot In Progress</option>
                    <option value="Editing">Status: Editing & Assembly</option>
                    <option value="Color Grading">Status: Color Grading Master</option>
                    <option value="Delivered">Status: Completed & Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT MANAGEMENT */}
      {activeTab === 'payments' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
            <div className="bg-zinc-900/90 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
              <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Total Revenue Collected</p>
              <h2 className="font-serif text-3xl font-medium text-green-400 mt-2">Rs. {totalRevenue.toLocaleString()}</h2>
            </div>
            <div className="bg-zinc-900/90 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2a900]/10 rounded-full blur-2xl"></div>
              <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Pending Receivables (Remaining Balance)</p>
              <h2 className="font-serif text-3xl font-medium text-[#f2a900] mt-2">Rs. {totalReceivables.toLocaleString()}</h2>
            </div>
            <div className="bg-zinc-900/90 border border-white/10 p-6 rounded-3xl flex items-center justify-between">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Logged Transactions</p>
                <h2 className="font-serif text-3xl font-medium text-white mt-2">{payments.length} Records</h2>
              </div>
              <button
                onClick={() => setShowAddPayment(true)}
                className="bg-[#f2a900] hover:bg-white text-black px-4 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
              >
                <Plus className="w-4 h-4" /> Log Payment
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-serif text-xl font-medium text-white">Client Financial Ledger & Invoices</h3>
              <span className="text-xs text-white/50 font-mono">100% Real-time Ledger</span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-widest text-white/50">
                  <th className="py-4 px-6 font-semibold">Transaction ID</th>
                  <th className="py-4 px-6 font-semibold">Client & Event</th>
                  <th className="py-4 px-6 font-semibold">Payment Method</th>
                  <th className="py-4 px-6 font-semibold">Amount Received</th>
                  <th className="py-4 px-6 font-semibold text-right">Invoice & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {payments.map((p) => {
                  const clientObj = clients.find(c => c.name === p.clientName) || {
                    id: p.id,
                    name: p.clientName,
                    email: 'client@muzframe.studio',
                    phone: '0300-6103262',
                    eventName: p.eventName,
                    eventDate: p.date,
                    package: 'Cinematic Coverage Package',
                    status: 'active' as const,
                    totalAmount: p.amount * 2,
                    paidAmount: p.amount
                  };

                  return (
                    <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-white">{p.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">{p.clientName}</div>
                        <div className="text-white/50 text-xs mt-0.5">{p.eventName} • {p.date}</div>
                      </td>
                      <td className="py-4 px-6 text-white/80">{p.method}</td>
                      <td className="py-4 px-6 font-mono font-bold text-[#f2a900]">Rs. {p.amount.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleDownloadInvoice(clientObj)}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#f2a900] hover:text-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                          >
                            <Download className="w-3.5 h-3.5" /> Invoice
                          </button>
                          <select
                            value={p.status}
                            onChange={(e) => handleUpdatePaymentStatus(p.id, e.target.value as any)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider focus:outline-none appearance-none cursor-pointer ${p.status === 'Received' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-[#f2a900]/20 text-[#f2a900] border border-[#f2a900]/30'}`}
                          >
                            <option value="Pending" className="bg-black text-[#f2a900]">Pending</option>
                            <option value="Received" className="bg-black text-green-400">Received</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SONG SELECTION SYSTEM */}
      {activeTab === 'songs' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Song Library */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-white flex items-center gap-2.5">
                    <Disc className="w-6 h-6 text-[#f2a900] animate-spin-slow" /> Studio Song Selection Vault
                  </h2>
                  <p className="text-white/60 text-xs mt-1">Browse, preview, and assign licensed tracks to client cinematic films.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search song or artist..."
                    value={songSearch}
                    onChange={(e) => setSongSearch(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#f2a900]"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'Barat Entry', 'Romantic BGM', 'Cinematic Teaser', 'Walima', 'Mehndi & Dholki'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSongCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${songCategory === cat ? 'bg-[#f2a900] text-black shadow-md' : 'bg-white/5 text-white/70 hover:bg-white/15'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Songs List */}
              <div className="space-y-3">
                {filteredSongs.map((s) => {
                  const isPlaying = playingSongId === s.id;
                  const inPlaylist = activePlaylist.songIds.includes(s.id);

                  return (
                    <div key={s.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${isPlaying ? 'bg-[#f2a900]/10 border-[#f2a900]/50' : 'bg-black/50 border-white/5 hover:border-white/20'}`}>
                      <div className="flex items-center gap-3.5">
                        <button
                          onClick={() => {
                            if (isPlaying) {
                              setPlayingSongId(null);
                              studioAudio.stop();
                            } else {
                              setPlayingSongId(s.id);
                              studioAudio.playSong(s.id, s.previewUrl);
                              triggerToast(`Previewing track: "${s.title}"`);
                            }
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isPlaying ? 'bg-[#f2a900] text-black shadow-lg shadow-[#f2a900]/30 scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div>
                          <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                            {s.title}
                            {isPlaying && <span className="text-[10px] bg-[#f2a900] text-black px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">Playing</span>}
                          </h4>
                          <p className="text-white/50 text-xs mt-0.5">{s.artist} • <span className="text-[#f2a900] font-mono">{s.category}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <span className="text-white/80 font-mono text-xs">{s.duration}</span>
                          <div className="text-white/40 text-[10px]">{s.bpm}</div>
                        </div>

                        <button
                          onClick={() => handleTogglePlaylistSong(s.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${inPlaylist ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-white/10 hover:bg-[#f2a900] hover:text-black text-white'}`}
                        >
                          {inPlaylist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          {inPlaylist ? 'Added' : 'Add to Playlist'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Client Playlist Management */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-serif text-xl font-medium text-white flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-[#f2a900]" /> Client Playlist
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${activePlaylist.status === 'Submitted & Locked' ? 'bg-green-500/20 text-green-400' : 'bg-[#f2a900]/20 text-[#f2a900]'}`}>
                  {activePlaylist.status}
                </span>
              </div>

              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Select Active Client</label>
                <select
                  value={selectedPlaylistClient}
                  onChange={(e) => setSelectedPlaylistClient(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Selected Tracks ({activePlaylist.songIds.length})</h4>
                {activePlaylist.songIds.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-white/10 rounded-2xl text-white/40 text-xs">
                    No tracks added to playlist yet. Click &quot;Add to Playlist&quot; from the song library.
                  </div>
                ) : (
                  activePlaylist.songIds.map(songId => {
                    const song = songs.find(s => s.id === songId);
                    if (!song && !songId.startsWith('CUSTOM-')) return null;
                    return (
                      <div key={songId} className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <strong className="text-white block truncate">{song?.title || 'Custom Song Added By Client'}</strong>
                          <span className="text-white/50 text-[10px]">{song?.category || 'User Request'}</span>
                        </div>
                        <button
                          onClick={() => handleTogglePlaylistSong(songId)}
                          className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
                {activePlaylist.notes && (
                  <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl text-xs">
                    <h5 className="font-bold text-[#f2a900] uppercase tracking-wider mb-2">Client Notes & Custom Songs:</h5>
                    <pre className="text-white/70 whitespace-pre-wrap font-sans">{activePlaylist.notes}</pre>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <button
                  onClick={handleLockPlaylist}
                  disabled={activePlaylist.songIds.length === 0}
                  className="w-full bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {activePlaylist.status === 'Draft' ? 'Submit Final Selection' : 'Unlock Playlist (Draft)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GALLERY UPLOADS */}
      {activeTab === 'gallery' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-medium text-white mb-2">Publish New HD Deliverables</h2>
              <p className="text-white/60 text-xs">Upload 4K Cinematic Reels or Full Resolution Photo Albums directly to client portals.</p>
            </div>

            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center bg-black/40 hover:border-[#f2a900]/60 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-[#f2a900] mx-auto mb-3" />
              <h3 className="text-white font-medium text-sm">Drag & Drop Master Deliverables Here</h3>
              <p className="text-white/40 text-xs mt-1">Supports RAW, JPEG, MP4 4K HDR files up to 25 GB per batch</p>
              <button 
                onClick={() => {
                  setIsUploading(true);
                  setUploadProgress(15);
                  const interval = setInterval(() => {
                    setUploadProgress(prev => {
                      if (prev >= 100) {
                        clearInterval(interval);
                        setIsUploading(false);
                        triggerToast('New HD Batch Published to Client Galleries!');
                        return 0;
                      }
                      return prev + 25;
                    });
                  }, 400);
                }}
                disabled={isUploading}
                className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-[#f2a900] hover:text-black rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all disabled:opacity-50"
              >
                {isUploading ? "Uploading Batch..." : "Select Files from Storage"}
              </button>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                  <span className="text-[#f2a900]">Syncing Cloud CDN...</span>
                  <span className="text-white">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#f2a900] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-8 space-y-6">
            <h2 className="font-serif text-2xl font-medium text-white">Active Portal Galleries</h2>
            <div className="space-y-4">
              {clients.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{c.eventName} ({c.name})</h4>
                    <p className="text-white/50 text-xs mt-1">{c.package} • Full Access</p>
                  </div>
                  <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-bold">Live</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: NOTIFICATIONS CENTER */}
      {activeTab === 'notifications' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-zinc-900/90 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="font-serif text-xl font-medium text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-[#f2a900]" /> Dispatch Client Alert
            </h2>
            <form onSubmit={(e) => {
              const target = (e.currentTarget.elements.namedItem('rec') as HTMLSelectElement).value;
              const title = (e.currentTarget.elements.namedItem('tit') as HTMLInputElement).value;
              const msg = (e.currentTarget.elements.namedItem('msg') as HTMLTextAreaElement).value;
              handleSendNotification(e, title, msg, target);
              (e.currentTarget as HTMLFormElement).reset();
            }} className="space-y-4">
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Target Recipient</label>
                <select name="rec" className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]">
                  <option value="All Active Clients">All Active Clients</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.eventName})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Notification Title</label>
                <input name="tit" type="text" placeholder="e.g. Gallery Ready for Review" required className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
              </div>
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Message Body</label>
                <textarea name="msg" rows={4} placeholder="Write instructions or update..." required className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
              </div>
              <button type="submit" className="w-full bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Portal Notification
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-zinc-900/90 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-medium text-white">Dispatch History</h2>
            <div className="space-y-4">
              {notifications.map((n) => (
                <div key={n.id} className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#f2a900] font-bold text-sm">{n.title}</span>
                    <span className="text-white/40 text-xs font-mono">{n.date}</span>
                  </div>
                  <p className="text-white/80 text-xs leading-relaxed">{n.message}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-white/50 border-t border-white/5">
                    <span>Sent to: <strong className="text-white">{n.recipient}</strong></span>
                    <span className="text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
      <AnimatePresence>
        {showEditEvent && editingEvent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <h2 className="font-serif text-2xl font-medium text-white mb-6">Edit Event Details</h2>
              <form onSubmit={handleEditEventSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Event Name</label>
                  <input type="text" required value={editingEvent.eventName} onChange={(e) => setEditingEvent({ ...editingEvent, eventName: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Date</label>
                    <input type="date" required value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900] [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Team Lead</label>
                    <input type="text" value={editingEvent.teamLead} onChange={(e) => setEditingEvent({ ...editingEvent, teamLead: e.target.value })} placeholder="e.g. Muzammal Khan" className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Venue</label>
                  <input type="text" required value={editingEvent.venue} onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Package Details</label>
                  <input type="text" required value={editingEvent.packageDetails} onChange={(e) => setEditingEvent({ ...editingEvent, packageDetails: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                </div>
                
                <div className="flex items-center gap-3 pt-4">
                  <button type="button" onClick={() => setShowEditEvent(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#f2a900] hover:bg-white text-black font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-lg shadow-[#f2a900]/20">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT CLIENT MODAL */}
      <AnimatePresence>
        {showEditClient && editingClient && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <h2 className="font-serif text-2xl font-medium text-white mb-6">Edit Client Account</h2>
              <form onSubmit={handleEditClientSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Client Full Names</label>
                  <input type="text" required value={editingClient.name} onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Email Address</label>
                    <input type="email" required value={editingClient.email} onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input type="text" value={editingClient.phone} onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Total Amount (Rs)</label>
                    <input type="number" required value={editingClient.totalAmount} onChange={(e) => setEditingClient({ ...editingClient, totalAmount: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Paid Amount (Rs)</label>
                    <input type="number" required value={editingClient.paidAmount} onChange={(e) => setEditingClient({ ...editingClient, paidAmount: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-4">
                  <button type="button" onClick={() => setShowEditClient(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#f2a900] hover:bg-white text-black font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-lg shadow-[#f2a900]/20">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 1: ADD CLIENT ACCOUNT */}
      <AnimatePresence>
        {showAddClient && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <h2 className="font-serif text-2xl font-medium text-white mb-6">Register New Client Account</h2>
              <form onSubmit={handleAddClientSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Client Full Names</label>
                  <input type="text" placeholder="e.g. Bilal & Fatima" required value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Email Address</label>
                    <input type="email" placeholder="client@domain.com" required value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input type="text" placeholder="0300-1234567" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Event Title</label>
                    <input type="text" placeholder="e.g. Barat & Walima Reception" value={newClient.eventName} onChange={(e) => setNewClient({ ...newClient, eventName: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Event Type</label>
                    <select value={newClient.eventType} onChange={(e) => setNewClient({ ...newClient, eventType: e.target.value as any })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]">
                      <option value="Wedding">Wedding</option>
                      <option value="Barat">Barat</option>
                      <option value="Walima">Walima</option>
                      <option value="Mehndi">Mehndi</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Event Date</label>
                    <input type="date" value={newClient.eventDate} onChange={(e) => setNewClient({ ...newClient, eventDate: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Package Selected</label>
                    <select value={newClient.package} onChange={(e) => setNewClient({ ...newClient, package: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]">
                      <option value="Luxury 3-Day Cinematic Package">Luxury 3-Day (Rs. 90,000)</option>
                      <option value="Premium 2-Day Shoot">Premium 2-Day (Rs. 65,000)</option>
                      <option value="Single Day Event Coverage">Single Day (Rs. 40,000)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Total Package Price (Rs)</label>
                    <input type="number" value={newClient.totalAmount} onChange={(e) => setNewClient({ ...newClient, totalAmount: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Advance Paid (Rs)</label>
                    <input type="number" value={newClient.paidAmount} onChange={(e) => setNewClient({ ...newClient, paidAmount: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddClient(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#f2a900] hover:bg-white text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-[#f2a900]/20">Create Account</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: LOG NEW PAYMENT */}
      <AnimatePresence>
        {showAddPayment && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <h2 className="font-serif text-2xl font-medium text-white mb-6">Log New Payment Transaction</h2>
              <form onSubmit={handleAddPaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Select Client</label>
                  <select 
                    value={newPayment.clientName} 
                    onChange={(e) => {
                      const client = clients.find(c => c.name === e.target.value);
                      setNewPayment({ ...newPayment, clientName: e.target.value, eventName: client?.eventName || '' });
                    }} 
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.eventName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Amount Received (Rs)</label>
                  <input type="number" placeholder="25000" required value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Payment Method</label>
                  <select value={newPayment.method} onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value as any })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]">
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Easypaisa / JazzCash">Easypaisa / JazzCash</option>
                    <option value="Cash">Cash at Studio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">Verification Status</label>
                  <select value={newPayment.status} onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value as any })} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2a900]">
                    <option value="Received">Received & Verified</option>
                    <option value="Pending">Pending Clearance</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddPayment(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-green-500 hover:bg-green-400 text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg">Record Payment</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
