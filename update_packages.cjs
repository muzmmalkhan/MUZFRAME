const fs = require('fs');
let code = fs.readFileSync('src/pages/Packages.tsx', 'utf-8');

const targetBox = `<div className="mt-20 max-w-3xl mx-auto glass-panel p-8 rounded-2xl flex items-start gap-4 border-l-4 border-l-[#f2a900]">
          <Info className="w-6 h-6 text-[#f2a900] flex-shrink-0 mt-1" />
          <p className="text-white/70 text-sm leading-relaxed">
            <strong className="text-white block mb-1">Looking for a custom quote?</strong>
            We understand every event is unique. If you require specialized drone coverage, extended days, or specific album designs, please contact us directly for a customized proposal that fits your exact needs.
          </p>
        </div>`;

if (code.includes('Looking for a custom quote?')) {
  code = code.replace(targetBox, '<QuickCalculator />');
  
  if (!code.includes('QuickCalculator')) {
    code = code.replace(
      "import { motion } from 'framer-motion';",
      "import { motion } from 'framer-motion';\nimport { QuickCalculator } from '../components/QuickCalculator';"
    );
  }
  
  fs.writeFileSync('src/pages/Packages.tsx', code);
  console.log("Packages.tsx updated with QuickCalculator");
} else {
  console.log("Could not find the target box in Packages.tsx");
}
