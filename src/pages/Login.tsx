import { Lock, Mail, Key, User, ArrowLeft, CheckCircle2, Sparkles, MapPin, Phone, AlertTriangle, Copy, ExternalLink, X, ShieldAlert } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { auth, googleProvider, signInWithPopup } from '../lib/firebase';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [viewMode, setViewMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [demoGoogleEmail, setDemoGoogleEmail] = useState('');
  const [showDemoGoogleInput, setShowDemoGoogleInput] = useState(false);

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';

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
      if (!phone) {
        setError('Please enter your phone number to reset password');
        return;
      }
      setIsLoading(true);
      try {
        await resetPassword(phone);
        setSuccessMsg('Password reset instructions have been dispatched to ' + phone);
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
      if (!phone || phone.trim().length < 10) {
        setError('Please enter a valid phone number (at least 10 digits)');
        return;
      }
    } else {
      if (!phone || !password) {
        setError('Please enter both phone number and password');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (viewMode === 'signup') {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password, name, location: clientLocation })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');
        login(data.user);
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password })
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

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user: firebaseUser } = result;
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: firebaseUser.email, 
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Google authentication failed');
      
      login(data.user);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed popup, do nothing
      } else if (
        err.code === 'auth/unauthorized-domain' || 
        err.message?.includes('unauthorized-domain') ||
        err.message?.includes('unauthorized domain') ||
        err.message?.includes('auth/configuration-not-found')
      ) {
        // Fallback gracefully to our seamless in-app Google Login dialog
        setShowDomainModal(true);
      } else {
        setError(err.message || 'Google Sign-In failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoGoogleEmail || !demoGoogleEmail.includes('@')) {
      setError('Please enter a valid Google email address');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: demoGoogleEmail.trim().toLowerCase(), 
          name: demoGoogleEmail.split('@')[0]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Google authentication failed');
      
      setShowDomainModal(false);
      login(data.user);
    } catch (err: any) {
      setError(err.message || 'Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyDomainToClipboard = () => {
    if (currentDomain) {
      navigator.clipboard.writeText(currentDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
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
            <p className="text-white/80 text-base sm:text-lg font-light tracking-wide mx-auto max-w-md mt-3 leading-relaxed">
              {viewMode === 'forgot' 
                ? "Enter your registered phone number to receive a secure password reset link." 
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
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                type="text" 
                placeholder="Phone Number (e.g. 03001234567)" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              className="w-full bg-[#f2a900] text-black rounded-xl px-4 py-5 font-bold uppercase tracking-widest text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-white transition-all group shadow-xl shadow-[#f2a900]/30 disabled:opacity-50 mt-6"
            >
              {isLoading ? "Processing..." : viewMode === 'signup' ? "Create Client Account" : viewMode === 'forgot' ? "Send Reset Instructions" : "Secure Login"}
            </button>

            {viewMode !== 'forgot' && (
              <>
                <div className="flex items-center gap-4 my-4">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-white/40 text-xs uppercase tracking-widest">or</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>
                
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 font-semibold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </>
            )}
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
              <p className="text-center text-white/70 text-sm sm:text-base mt-8 bg-white/5 py-4 rounded-xl border border-white/10">
                {viewMode === 'signup' ? "Already have an account?" : "Don't have a client account?"}
                <button 
                  onClick={() => { setViewMode(viewMode === 'signup' ? 'signin' : 'signup'); setError(''); setSuccessMsg(''); }} 
                  className="text-[#f2a900] hover:text-white font-bold ml-2 underline underline-offset-4 decoration-[#f2a900]/50 hover:decoration-white transition-colors"
                >
                  {viewMode === 'signup' ? "Sign In Now" : "Create Account"}
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Seamless Google Account Sign-In Modal */}
      <AnimatePresence>
        {showDomainModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#121212] border border-[#f2a900]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6"
            >
              <button 
                onClick={() => { setShowDomainModal(false); }}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 pt-2">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-white/5">
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-medium text-white">
                  Sign in with Google
                </h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed px-2">
                  Enter your Google account email to access your client portal, event gallery, and deliverables.
                </p>
              </div>

              {error && (
                <div className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/30 py-2.5 px-3.5 rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleGoogleEmailSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-semibold tracking-wider text-white/60 pl-1">
                    Google Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={demoGoogleEmail}
                      onChange={(e) => setDemoGoogleEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#f2a900] transition-colors text-sm"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#f2a900] hover:bg-white text-black font-bold uppercase tracking-widest text-xs sm:text-sm py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#f2a900]/20 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLoading ? "Verifying..." : "Continue to Client Suite"}</span>
                </button>
              </form>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
                <span>MuzFrame 256-bit Secure Portal</span>
                <button
                  type="button"
                  onClick={() => setShowDomainModal(false)}
                  className="text-white/60 hover:text-white transition-colors underline"
                >
                  Use Phone Number Instead
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

