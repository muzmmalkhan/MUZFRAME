const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

if (!code.includes("import { QuickCalculator }")) {
  code = code.replace(
    "import { TrustedBrandsSection } from '../components/TrustedBrandsSection';",
    "import { TrustedBrandsSection } from '../components/TrustedBrandsSection';\nimport { QuickCalculator } from '../components/QuickCalculator';"
  );
  fs.writeFileSync('src/pages/Home.tsx', code);
  console.log("Import fixed in Home.tsx");
} else {
  console.log("Import already exists");
}
