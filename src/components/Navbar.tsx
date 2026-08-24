import { Link, useLocation } from 'react-router-dom';
import { Camera, Menu, X, ArrowRight, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'MuzBeauty', path: '/muzbeauty' },
    { name: 'Packages', path: '/packages' },
    { name: 'Portfolio', path: '/gallery' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-black/80 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link to="/" onClick={closeMenu} className="flex flex-col items-center group">
          <img src="/logo.png" alt="MuzFrame Studio Logo" className="h-16 w-auto object-contain" />
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={cn(
                "text-sm font-medium uppercase tracking-[0.1em] transition-colors hover:text-[#f2a900]",
                location.pathname === link.path ? "text-[#f2a900]" : "text-white/70"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 border-l border-white/20 pl-6 ml-2">
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : `/client/${user.id}`} className="text-xs font-semibold uppercase tracking-widest text-[#f2a900] border border-[#f2a900]/50 px-5 py-2.5 rounded-full hover:bg-[#f2a900] hover:text-black transition-all flex items-center gap-2">
                <User className="w-4 h-4" /> {user.role === 'admin' ? 'Admin Panel' : 'Client Area'}
              </Link>
            ) : (
              <Link to="/login" className="text-xs font-semibold uppercase tracking-widest text-[#f2a900] border border-[#f2a900]/50 px-5 py-2.5 rounded-full hover:bg-[#f2a900] hover:text-black transition-all">Client Area</Link>
            )}
            <Link to="/contact" className="nav-pill flex items-center gap-2 hover:border-[#f2a900] hover:text-[#f2a900]">
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-b border-white/10 p-6 md:hidden flex flex-col gap-6"
          >
            {links.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={closeMenu}
                className={cn(
                  "text-xl font-serif tracking-widest",
                  location.pathname === link.path ? "text-[#f2a900]" : "text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="divider h-px bg-white/10 w-full my-2"></div>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : `/client/${user.id}`} onClick={closeMenu} className="w-full text-center border border-[#f2a900]/50 text-[#f2a900] py-4 rounded font-bold tracking-widest uppercase hover:bg-[#f2a900] hover:text-black transition-colors flex items-center justify-center gap-2">
                <User className="w-5 h-5" /> {user.role === 'admin' ? 'Admin Panel' : 'Client Area'}
              </Link>
            ) : (
              <Link to="/login" onClick={closeMenu} className="w-full text-center border border-[#f2a900]/50 text-[#f2a900] py-4 rounded font-bold tracking-widest uppercase hover:bg-[#f2a900] hover:text-black transition-colors">Client Area</Link>
            )}
            <Link to="/contact" onClick={closeMenu} className="bg-[#f2a900] text-black w-full py-4 text-center font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2">
              Book Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
