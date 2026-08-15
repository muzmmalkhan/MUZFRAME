const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

code = code.replace(/import { Camera, Instagram, MapPin, Phone, Mail } from 'lucide-react';/, "import { Camera, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';");

const newSocials = `
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="https://instagram.com/muzframe" target="_blank" rel="noopener noreferrer" className="px-5 h-12 rounded-full bg-white/5 flex items-center gap-3 hover:bg-[#f2a900] hover:text-black transition-colors text-white border border-white/10 hover:border-[#f2a900]">
              <Instagram className="w-5 h-5" />
              <span className="text-sm font-bold tracking-widest uppercase">@muzframe</span>
            </a>
            <a href="https://tiktok.com/@muzframe" target="_blank" rel="noopener noreferrer" className="px-5 h-12 rounded-full bg-white/5 flex items-center gap-3 hover:bg-[#f2a900] hover:text-black transition-colors text-white border border-white/10 hover:border-[#f2a900]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.66-.21-3.16 1.76-6.19 4.79-7.14 1.1-.35 2.26-.4 3.4-.24v4.06c-1.22-.04-2.45.39-3.26 1.25-.86.91-1.07 2.37-.53 3.51.52 1.09 1.76 1.78 2.97 1.83 1.2.04 2.4-.41 3.2-1.32.74-.83 1.08-1.95 1.07-3.07-.03-5.74-.01-11.48-.02-17.22Z"/>
              </svg>
              <span className="text-sm font-bold tracking-widest uppercase">@muzframe</span>
            </a>
            <a href="https://youtube.com/@muzframestudio" target="_blank" rel="noopener noreferrer" className="px-5 h-12 rounded-full bg-white/5 flex items-center gap-3 hover:bg-[#f2a900] hover:text-black transition-colors text-white border border-white/10 hover:border-[#f2a900]">
              <Youtube className="w-5 h-5" />
              <span className="text-sm font-bold tracking-widest uppercase">@muzframestudio</span>
            </a>
          </div>
`;

code = code.replace(/<div className="flex flex-wrap gap-4 mt-8">[\s\S]*?<\/div>/, newSocials);

fs.writeFileSync('src/components/Footer.tsx', code);
