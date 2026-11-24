import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { BrandLogo } from './BrandLogo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const links = [
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'Portfolio', path: '/gallery' },
    { name: 'MuzBeauty', path: '/muzbeauty' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-colors duration-200',
        scrolled || isOpen
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/10 py-3.5'
          : 'bg-gradient-to-b from-black/80 to-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center gap-6">
        {/* Zone 1: Crisp Vector Brand Wordmark */}
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="MuzFrame Studio Home"
          className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2a900]"
        >
          <BrandLogo size="sm" />
        </Link>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-7">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'relative text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1',
                  active ? 'text-[#f2a900]' : 'text-white/80 hover:text-white'
                )}
              >
                {link.name}
                {active && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#f2a900] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Secondary Portal Link + Single Primary CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin' : `/client/${user.id}`}
              className="text-sm font-medium text-white/85 hover:text-[#f2a900] px-3.5 py-2 rounded-xl border border-white/15 hover:border-[#f2a900]/50 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2"
            >
              <User className="w-4 h-4 text-[#f2a900]" />
              <span>{user.role === 'admin' ? 'Admin Panel' : 'Client Portal'}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-white/85 hover:text-[#f2a900] px-3.5 py-2 rounded-xl border border-white/15 hover:border-[#f2a900]/50 transition-colors whitespace-nowrap shrink-0"
            >
              Client Portal
            </Link>
          )}
          <Link
            to="/contact"
            className="bg-[#f2a900] hover:bg-white text-black font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2"
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="lg:hidden min-w-[44px] min-h-[44px] rounded-xl border border-white/15 bg-black/60 text-white flex items-center justify-center hover:border-[#f2a900] transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#0a0a0a] border-b border-white/10 px-4 sm:px-6 pt-4 pb-6 mt-3"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={cn(
                  'py-3 px-3 rounded-xl text-base font-medium transition-colors',
                  location.pathname === '/' ? 'text-[#f2a900] bg-white/5' : 'text-white/85 hover:bg-white/5'
                )}
              >
                Home
              </Link>
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className={cn(
                    'py-3 px-3 rounded-xl text-base font-medium transition-colors',
                    location.pathname === link.path ? 'text-[#f2a900] bg-white/5' : 'text-white/85 hover:bg-white/5'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="h-px bg-white/10 my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : `/client/${user.id}`}
                  onClick={closeMenu}
                  className="w-full min-h-[44px] text-center border border-white/20 text-white py-3 px-4 rounded-xl font-medium text-sm hover:border-[#f2a900] hover:text-[#f2a900] transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-[#f2a900]" />
                  <span>{user.role === 'admin' ? 'Admin Panel' : 'Client Portal'}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full min-h-[44px] text-center border border-white/20 text-white py-3 px-4 rounded-xl font-medium text-sm hover:border-[#f2a900] hover:text-[#f2a900] transition-colors flex items-center justify-center"
                >
                  Client Portal
                </Link>
              )}
              <Link
                to="/contact"
                onClick={closeMenu}
                className="w-full min-h-[44px] bg-[#f2a900] text-black py-3 px-4 text-center font-semibold text-sm rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
