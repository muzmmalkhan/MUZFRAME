const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

code = code.replace(
  'className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-tight mb-8 uppercase"',
  'className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-8 uppercase max-w-4xl mx-auto"'
);

fs.writeFileSync('src/pages/Home.tsx', code);
console.log("Updated heading size in Home.tsx");
