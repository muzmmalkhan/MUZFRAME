const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf-8');

const targetEffect = `  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client/' + user.id);
      }
    }
  }, [user, navigate]);`;

const replacementEffect = `  useEffect(() => {
    if (user) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');
      
      if (redirect) {
        navigate('/' + redirect);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client/' + user.id);
      }
    }
  }, [user, navigate]);`;

if (code.includes('if (user) {') && code.includes('user.role === \'admin\'')) {
  code = code.replace(targetEffect, replacementEffect);
  fs.writeFileSync('src/pages/Login.tsx', code);
  console.log("Login.tsx updated with redirect param support");
} else {
  console.log("Could not find the target effect in Login.tsx");
}
