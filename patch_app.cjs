const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
appCode = appCode.replace(
  "import { AdminDashboard } from './pages/AdminDashboard';",
  "import { AdminDashboard } from './pages/AdminDashboard';\nimport { MuzBeauty } from './pages/MuzBeauty';"
);

// Add route
appCode = appCode.replace(
  "<Route path=\"/services\" element={<ProtectedRoute><Services /></ProtectedRoute>} />",
  "<Route path=\"/services\" element={<ProtectedRoute><Services /></ProtectedRoute>} />\n            <Route path=\"/muzbeauty\" element={<ProtectedRoute><MuzBeauty /></ProtectedRoute>} />"
);

fs.writeFileSync('src/App.tsx', appCode);
console.log("App.tsx patched");
