const fs = require('fs');

let navbarCode = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

navbarCode = navbarCode.replace(
  "{ name: 'Services', path: '/services' },",
  "{ name: 'Services', path: '/services' },\n    { name: 'MuzBeauty', path: '/muzbeauty' },"
);

fs.writeFileSync('src/components/Navbar.tsx', navbarCode);
console.log("Navbar.tsx patched");
