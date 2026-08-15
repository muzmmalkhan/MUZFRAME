const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

code = code.replace(/<\/button>\\n<\/form>\\n<\/div>\\n{\/\* Submit Selections Button \*\/}/g, '</button>\n</form>\n</div>\n{/* Submit Selections Button */}');
code = code.replace(/\n        \)}\n        \)}\n        {\/\* Tab 4/g, '\n        )}\n        {/* Tab 4');

fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
