const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

// 1. Update import to include Phone if not present
if (!code.includes('Phone')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, Phone} from 'lucide-react';");
}

// 2. Change state email to phone
code = code.replace(/const \[email, setEmail\] = useState\(''\);/g, "const [phone, setPhone] = useState('');");

// 3. In handleSubmit, change email validation to phone validation
code = code.replace(
  /const emailRegex = \/\^\[\^\\s@\]\+@\[\^\\s@\]\+\\.\[\^\\s@\]\+\$\/;\s*if \(!emailRegex\.test\(email\)\) \{\s*setError\('Please enter a valid email address'\);\s*return;\s*\}/g,
  `if (!phone || phone.trim().length < 10) {
        setError('Please enter a valid phone number (at least 10 digits)');
        return;
      }`
);

// 4. Change email to phone in API calls
code = code.replace(
  /body: JSON\.stringify\(\{ email, password, name, location: clientLocation \}\)/g,
  "body: JSON.stringify({ phone, password, name, location: clientLocation })"
);
code = code.replace(
  /body: JSON\.stringify\(\{ email, password \}\)/g,
  "body: JSON.stringify({ phone, password })"
);

// 5. Change "email" mentions in signin check
code = code.replace(/if \(!email \|\| !password\)/g, "if (!phone || !password)");
code = code.replace(/setError\('Please enter both email and password'\);/g, "setError('Please enter both phone number and password');");

// 6. Update the input UI for email -> phone
code = code.replace(
  /<Mail className="absolute left-4 top-1\/2 -translate-y-1\/2 w-5 h-5 text-white\/40" \/>\s*<input \s*type="text"\s*placeholder="Email Address"\s*value=\{email\}\s*onChange=\{\(e\) => setEmail\(e\.target\.value\)\}/m,
  `<Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                type="text" 
                placeholder="Phone Number (e.g. 03001234567)" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}`
);

// 7. Update Forgot password mode
code = code.replace(
  /if \(!email\) \{\s*setError\('Please enter your email address to reset password'\);/g,
  `if (!phone) {
        setError('Please enter your phone number to reset password');`
);
code = code.replace(/await resetPassword\(email\);/g, "await resetPassword(phone);");
code = code.replace(/setSuccessMsg\('Password reset instructions have been dispatched to ' \+ email\);/g, "setSuccessMsg('Password reset instructions have been dispatched to ' + phone);");

// 8. Update button text/size
code = code.replace(
  /className="w-full bg-\[#f2a900\] text-black rounded-xl px-4 py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all group shadow-lg shadow-\[#f2a900\]\/20 disabled:opacity-50 mt-4"/g,
  `className="w-full bg-[#f2a900] text-black rounded-xl px-4 py-5 font-bold uppercase tracking-widest text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-white transition-all group shadow-xl shadow-[#f2a900]/30 disabled:opacity-50 mt-6"`
);

// 9. Change any placeholder text that talks about email
code = code.replace(
  /"Enter your registered email to receive a secure password reset link."/g,
  `"Enter your registered phone number to receive a secure password reset link."`
);

fs.writeFileSync('src/pages/Login.tsx', code);
