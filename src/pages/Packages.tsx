import React from 'react';
import { Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PRICING = [
  {
    price: 'Rs. 50,000/',
    features: [
      'Photography with 1 Cam',
      'Videography with 1 Cam',
      'Drone 1 Day',
      'Indian Album 1',
      'Video Editing'
    ]
  },
  {
    isPopular: true,
    price: 'Rs. 60,000/',
    features: [
      'Photography with 2 Cam',
      'DSLR Videography with 1 Cam',
      'Drone 1 Day',
      'Indian Album 1',
      'Complete Video Editing'
    ]
  },
  {
    price: 'Rs. 90,000/',
    features: [
      'Photography with 2 Cam',
      'DSLR Videography with 2 Cam',
      'Drone 3 Day',
      'Indian Album 2',
      'Complete Video Editing',
      '+ Highlights'
    ]
  }
];

export function Packages() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#f2a900] text-xs font-bold tracking-[0.3em] uppercase mb-4"
          >
            Pricing
          </motion.p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">Price <span className="luxury-gradient italic">Packages</span></h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            Choose the perfect package for your event. All packages include standard editing and delivery via client portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-2 flex flex-col ${
                plan.isPopular 
                ? 'bg-gradient-to-b from-[#1a1a1a] to-black border-2 border-[#f2a900] shadow-[0_0_30px_rgba(242,169,0,0.1)]' 
                : 'glass-panel border-white/10'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f2a900] text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h2 className={`font-serif text-3xl md:text-4xl text-center mb-8 ${plan.isPopular ? 'text-[#f2a900]' : 'text-white'}`}>
                {plan.price}
              </h2>
              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.isPopular ? 'text-[#f2a900]' : 'text-white/40'}`} />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
              <Link 
                to="/contact" 
                className={`w-full py-4 text-center rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${
                  plan.isPopular 
                  ? 'bg-[#f2a900] text-black hover:bg-white' 
                  : 'bg-white/5 text-white hover:bg-[#f2a900] hover:text-black border border-white/10 hover:border-transparent'
                }`}
              >
                Book This Package
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto glass-panel p-8 rounded-2xl flex items-start gap-4 border-l-4 border-l-[#f2a900]">
          <Info className="w-6 h-6 text-[#f2a900] flex-shrink-0 mt-1" />
          <p className="text-white/70 text-sm leading-relaxed">
            <strong className="text-white block mb-1">Looking for a custom quote?</strong>
            We understand every event is unique. If you require specialized drone coverage, extended days, or specific album designs, please contact us directly for a customized proposal that fits your exact needs.
          </p>
        </div>
      </div>
    </div>
  );
}
