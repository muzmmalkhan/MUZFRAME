import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AIChatbot } from '../components/AIChatbot';

export function ComingSoon() {
  const calculateTimeLeft = () => {
    const difference = +new Date('2026-08-28T00:00:00') - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft as { days?: number; hours?: number; minutes?: number; seconds?: number };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

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
        <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto mb-8">
          We are live in
        </p>

        {timeLeft.days !== undefined ? (
          <div className="flex gap-3 md:gap-6 justify-center items-center mb-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-bold text-white w-12 md:w-20">{timeLeft.days}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest mt-2">Days</span>
            </div>
            <span className="text-2xl text-[#f2a900] mb-6">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-bold text-white w-12 md:w-20">{timeLeft.hours}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest mt-2">Hours</span>
            </div>
            <span className="text-2xl text-[#f2a900] mb-6">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-bold text-white w-12 md:w-20">{timeLeft.minutes}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest mt-2">Mins</span>
            </div>
            <span className="text-2xl text-[#f2a900] mb-6">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-bold text-white w-12 md:w-20">{timeLeft.seconds}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest mt-2">Secs</span>
            </div>
          </div>
        ) : null}

        <div className="mt-8">
          <p className="text-sm text-gray-500">Tel:</p>
          <a href="tel:+923006103262" className="text-[#f2a900] text-lg font-bold hover:underline">
            +92 300 6103262
          </a>
        </div>
      </motion.div>
      <AIChatbot />
    </div>
  );
}
