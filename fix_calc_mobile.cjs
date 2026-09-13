const fs = require('fs');
let code = fs.readFileSync('src/components/QuickCalculator.tsx', 'utf-8');

code = code.replace(
  'className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl"',
  'className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2rem] shadow-2xl"'
);

code = code.replace(
  'className="grid grid-cols-1 md:grid-cols-2 gap-12"',
  'className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12"'
);

code = code.replace(
  'className="text-[#f2a900] font-serif text-5xl md:text-6xl mb-2"',
  'className="text-[#f2a900] font-serif text-4xl sm:text-5xl md:text-6xl mb-2"'
);

code = code.replace(
  'className="w-full bg-[#f2a900] text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors shadow-lg shadow-[#f2a900]/20 flex items-center justify-center gap-2 mt-4"',
  'className="w-full bg-[#f2a900] text-black px-6 sm:px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-white transition-colors shadow-lg shadow-[#f2a900]/20 flex items-center justify-center gap-2 mt-4"'
);

code = code.replace(
  /className="p-4 border border-white\/10 rounded-xl bg-black\/50"/g,
  'className="p-3 sm:p-4 border border-white/10 rounded-xl bg-black/50"'
);

fs.writeFileSync('src/components/QuickCalculator.tsx', code);
console.log("Updated Calculator mobile layout");
