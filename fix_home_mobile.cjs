const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

code = code.replace(
  'className="flex flex-col sm:flex-row items-center justify-center gap-6"',
  'className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4 sm:px-0"'
);

code = code.replace(
  'className="bg-[#f2a900] text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-white transition-colors shadow-[0_0_20px_rgba(242,169,0,0.4)]"',
  'className="w-full sm:w-auto justify-center bg-[#f2a900] text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 hover:bg-white transition-colors shadow-[0_0_20px_rgba(242,169,0,0.4)]"'
);

code = code.replace(
  'className="px-8 py-4 rounded-full border border-white/30 text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"',
  'className="w-full sm:w-auto justify-center px-8 py-4 rounded-full border border-white/30 text-white font-bold uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"'
);

code = code.replace(
  'className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-8 uppercase max-w-4xl mx-auto"',
  'className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-6 sm:mb-8 uppercase max-w-4xl mx-auto px-4 sm:px-0"'
);

code = code.replace(
  'className="text-white/60 text-sm md:text-base uppercase tracking-[0.3em] font-medium mb-6 block"',
  'className="text-white/60 text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] sm:tracking-[0.3em] font-medium mb-4 sm:mb-6 block"'
);

code = code.replace(
  'className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors"',
  'className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors"'
);

fs.writeFileSync('src/pages/Home.tsx', code);
console.log("Updated Home mobile layout");
