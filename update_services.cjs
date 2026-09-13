const fs = require('fs');
let code = fs.readFileSync('src/pages/Services.tsx', 'utf-8');

// Update imports
code = code.replace(
  "import { Camera, Video, Plane, Edit3, Image as ImageIcon, Check } from 'lucide-react';",
  "import { Camera, Video, Plane, Edit3, Image as ImageIcon, Check, Radio, MonitorPlay, Users, Briefcase } from 'lucide-react';"
);

// Update Services Array
const oldArray = `const INDIVIDUAL_SERVICES = [
  { title: "Wedding Photography", icon: ImageIcon, desc: "Candid and cinematic moments captured beautifully." },
  { title: "Fashion Shoots", icon: Camera, desc: "High-end editorial fashion photography." },
  { title: "Product Shoots", icon: Check, desc: "Premium commercial product showcases." },
  { title: "Drone Shoots", icon: Plane, desc: "Epic aerial 4K cinematography." },
  { title: "Video Editing", icon: Video, desc: "Professional post-production and color grading." },
];`;

const newArray = `const INDIVIDUAL_SERVICES = [
  { title: "Wedding Shoot", icon: ImageIcon, desc: "Candid and cinematic moments captured beautifully." },
  { title: "Model Shoot", icon: Users, desc: "High-end editorial fashion and model photography." },
  { title: "Re Branding", icon: Briefcase, desc: "Transform and elevate your corporate identity." },
  { title: "Audio Video Editing", icon: MonitorPlay, desc: "Professional audio mixing, post-production and color grading." },
  { title: "Live Coverages", icon: Radio, desc: "High-quality multi-camera live streaming and event coverage." },
];`;

code = code.replace(oldArray, newArray);

// Update Grid layout and Card width
const oldGrid = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">`;
const newGrid = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 place-items-center sm:place-items-stretch">`;
code = code.replace(oldGrid, newGrid);

const oldCardClass = `className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-[#fff]/5 hover:border-[#f2a900]/30 transition-all duration-300"`;
const newCardClass = `className="w-[85%] sm:w-full glass-panel p-6 md:p-8 rounded-3xl flex flex-col items-center text-center group hover:bg-[#fff]/5 hover:border-[#f2a900]/30 transition-all duration-300"`;
code = code.replace(oldCardClass, newCardClass);

fs.writeFileSync('src/pages/Services.tsx', code);
console.log("Services updated.");
