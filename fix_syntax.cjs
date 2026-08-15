const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

// The replacement was missing `</form>` and some closing divs.
// Currently it looks like:
//                   <button type="submit" ...> Add Custom Song </button>
//               </div>
//              {/* Submit Selections Button */}

// We need to put `</form>` before `</div>`.

code = code.replace(/<\/button>\s*<\/div>\s*{\/\* Submit Selections Button \*\//, '</button>\\n</form>\\n</div>\\n{/* Submit Selections Button */}');
code = code.replace(/ {8}\)}\n\s*}\)\}\n\s*{\/\* Tab 4/g, '        {/* Tab 4');

fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
