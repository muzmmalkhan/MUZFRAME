const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

if (!css.includes('.hide-scrollbar')) {
  css += `\n\n/* Hide scrollbar for horizontal scrolling containers on mobile */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;
  fs.writeFileSync('src/index.css', css);
  console.log("Updated index.css");
}
