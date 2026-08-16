import React from 'react';
import { motion } from 'framer-motion';
import { AIChatbot } from '../components/AIChatbot';

export function ComingSoon() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img 
          src="/logo.png" 
          alt="MuzFrame Studio" 
          className="h-24 md:h-32 mx-auto mb-8 object-contain"
        />
        <h1 className="text-4xl md:text-6xl font-serif text-[#f2a900] mb-4">
          Coming Soon
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto">
          We are upgrading our digital experience. The full website will be available on August 28th, 2026.
        </p>
        <div className="mt-8">
          <p className="text-sm text-gray-500">For urgent inquiries, contact us at:</p>
          <a href="tel:+923006103262" className="text-[#f2a900] text-lg font-bold hover:underline">
            +92 300 6103262
          </a>
        </div>
      </motion.div>
      <AIChatbot />
    </div>
  );
}
