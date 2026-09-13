const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

// Replace the Services section
const startPattern = '{/* Services Snippet */}';
const endPattern = '      {/* Video Reel Section */}';

if (code.includes(startPattern) && code.includes(endPattern)) {
  const startIndex = code.indexOf(startPattern);
  const endIndex = code.indexOf(endPattern);
  
  if (startIndex !== -1 && endIndex !== -1) {
    const originalSection = code.substring(startIndex, endIndex);
    const replacement = `{/* Quick Calculator Section */}
      <section className="bg-black py-24 border-t border-white/5">
        <QuickCalculator />
      </section>

`;
    code = code.replace(originalSection, replacement);
    
    // Add import
    if (!code.includes('QuickCalculator')) {
      code = code.replace(
        "import { TrustedBrandsSection } from '../components/TrustedBrandsSection';",
        "import { TrustedBrandsSection } from '../components/TrustedBrandsSection';\nimport { QuickCalculator } from '../components/QuickCalculator';"
      );
    }
    
    fs.writeFileSync('src/pages/Home.tsx', code);
    console.log("Successfully replaced Our Expertise with QuickCalculator in Home.tsx");
  }
} else {
  console.log("Could not find patterns");
}
