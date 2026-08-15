const fs = require('fs');

const replacement = `<img src="/logo.png" alt="MuzFrame Studio Logo" className="h-16 w-auto object-contain" />`;

// Navbar
let navbarCode = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbarCode = navbarCode.replace(
  /<div className="relative">\s*\{\/\* A styled text representing the arabic logo aesthetics \*\/\}\s*<span className="font-serif text-3xl font-bold tracking-widest text-white drop-shadow-\[0_0_10px_rgba\(255,255,255,0\.3\)\]">مُزفریم<\/span>\s*<span className="absolute -bottom-1 -right-2 font-serif text-\[10px\] text-\[#f2a900\]">حاصل پور<\/span>\s*<\/div>\s*<div className="flex flex-col items-center mt-1">\s*<span className="text-\[#f2a900\] font-sans font-black text-xs tracking-\[0\.2em\] uppercase">Studio<\/span>\s*<span className="text-white\/80 font-sans text-\[10px\] tracking-widest">03006103262<\/span>\s*<\/div>/g,
  replacement
);
fs.writeFileSync('src/components/Navbar.tsx', navbarCode);

// Footer
let footerCode = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footerCode = footerCode.replace(
  /<div className="relative">\s*<span className="font-serif text-4xl font-bold tracking-widest text-white drop-shadow-\[0_0_10px_rgba\(255,255,255,0\.3\)\]">مُزفریم<\/span>\s*<span className="absolute -bottom-1 -right-4 font-serif text-xs text-\[#f2a900\]">حاصل پور<\/span>\s*<\/div>\s*<div className="flex flex-col items-start mt-2">\s*<span className="text-\[#f2a900\] font-sans font-black text-sm tracking-\[0\.2em\] uppercase">Studio<\/span>\s*<span className="text-white\/80 font-sans text-xs tracking-widest">03006103262<\/span>\s*<\/div>/g,
  `<img src="/logo.png" alt="MuzFrame Studio Logo" className="h-20 w-auto object-contain" />`
);
fs.writeFileSync('src/components/Footer.tsx', footerCode);

console.log("Logo replaced in Navbar and Footer");
