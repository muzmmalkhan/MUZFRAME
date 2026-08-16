import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Packages } from './pages/Packages';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { ClientDashboard } from './pages/ClientDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { MuzBeauty } from './pages/MuzBeauty';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ComingSoon } from './pages/ComingSoon';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f2a900]"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  // Check if current date is before August 28, 2026
  const isComingSoon = new Date() < new Date('2026-08-28T00:00:00');

  if (isComingSoon) {
    return <ComingSoon />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<RootLayout />}>
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/muzbeauty" element={<ProtectedRoute><MuzBeauty /></ProtectedRoute>} />
            <Route path="/packages" element={<ProtectedRoute><Packages /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="/client/:id" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
