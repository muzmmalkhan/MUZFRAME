import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CustomCursor } from '../components/CustomCursor';
import { ScrollProgress } from '../components/ScrollProgress';
import { AIChatbot } from '../components/AIChatbot';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function RootLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#f2a900] mb-4" />
        <p className="text-xs uppercase tracking-widest text-white/60">Verifying Client Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col cursor-none">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}
