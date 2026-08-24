import { Lock, Mail, Key, User, ArrowLeft, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [viewMode, setViewMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.hash === '#admin') {
      // Admin hash no longer changes view mode, handled by login credentials instead
    }
  }, [location.hash]);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client/' + user.id);
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (viewMode === 'forgot') {
      if (!email) {
        setError('Please enter your email address to reset password');
        return;
      }
      setIsLoading(true);
      try {
        await resetPassword(email);
        setSuccessMsg('Password reset instructions have been dispatched to ' + email);
      } catch (err: any) {
        setError(err.message || 'Failed to send reset email');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (viewMode === 'signup') {
      if (!name || name.trim().length < 3) {
        setError('Please enter a valid full name (at least 3 characters)');
        return;
      }
      if (!clientLocation || clientLocation.trim().length < 2) {
        setError('Please enter your city or location');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (viewMode === 'signup') {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, location: clientLocation })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');
        login(data.user);
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Invalid credentials');
        login(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden pt-24 pb-16">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f2a900]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl bg-black/80 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#f2a900]/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-[#f2a900]/30 text-[#f2a900]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 id="client-area-heading" className="font-serif text-3xl font-medium mb-2 text-white">
              {viewMode === 'signup' ? "Create Account" : viewMode === 'forgot' ? "Forgot Password" : "Client Area"}
            </h1>
            <p className="text-white/60 text-sm">
              {viewMode === 'forgot' 
                ? "Enter your registered email to receive a secure password reset link." 
                : "Securely manage event details, timeline, and private collections."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/30 py-3 px-4 rounded-xl">
                {error}
              </motion.div>
            )}
            
            {successMsg && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#f2a900] text-xs text-center bg-[#f2a900]/10 border border-[#f2a900]/30 py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {viewMode === 'signup' && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#f2a900]/60 transition-colors text-sm"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Location / City" 
                    value={clientLocation}
                    onChange={(e) => setClientLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#f2a900]/60 transition-colors text-sm"
                  />
                </div>
              </>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                type="text" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#f2a900]/60 transition-colors text-sm"
              />
            </div>

            {viewMode !== 'forgot' && (
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={viewMode !== 'forgot'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#f2a900]/60 transition-colors text-sm"
                />
              </div>
            )}

            {viewMode === 'signin' && (
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => { setViewMode('forgot'); setError(''); setSuccessMsg(''); }}
                  className="text-xs text-white/60 hover:text-[#f2a900] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#f2a900] text-black rounded-xl px-4 py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all group shadow-lg shadow-[#f2a900]/20 disabled:opacity-50 mt-4"
            >
              {isLoading ? "Processing..." : viewMode === 'signup' ? "Create Client Account" : viewMode === 'forgot' ? "Send Reset Instructions" : "Secure Login"}
            </button>
          </form>

          {viewMode === 'forgot' ? (
            <div className="text-center mt-6">
              <button 
                onClick={() => { setViewMode('signin'); setError(''); setSuccessMsg(''); }}
                className="text-xs text-[#f2a900] hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Client Area Login
              </button>
            </div>
          ) : (
            <>
              <p className="text-center text-white/50 text-xs mt-6">
                {viewMode === 'signup' ? "Already have an account?" : "Don't have a client account?"}
                <button 
                  onClick={() => { setViewMode(viewMode === 'signup' ? 'signin' : 'signup'); setError(''); setSuccessMsg(''); }} 
                  className="text-[#f2a900] hover:underline font-semibold ml-2"
                >
                  {viewMode === 'signup' ? "Sign In" : "Register"}
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

