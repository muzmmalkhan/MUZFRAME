const fs = require('fs');
let code = fs.readFileSync('src/pages/Packages.tsx', 'utf-8');

if (!code.includes("import { QuickCalculator }")) {
  code = code.replace(
    "import { motion } from 'framer-motion';",
    "import { motion } from 'framer-motion';\nimport { QuickCalculator } from '../components/QuickCalculator';"
  );
  fs.writeFileSync('src/pages/Packages.tsx', code);
  console.log("Import fixed");
}
