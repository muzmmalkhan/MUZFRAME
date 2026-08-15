const fs = require('fs');

let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

const target = `  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!newPass || !confirmPass) {
      setPassError('Please fill in new password fields');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters long');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match');
      return;
    }

    setIsChangingPass(true);
    try {
      await changePassword(newPass);
      setPassSuccess('Your portal password has been updated securely.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      setPassError(err.message || 'Failed to update password');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (`

const replacement = `  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!newPass || !confirmPass) {
      setPassError('Please fill in new password fields');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters long');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match');
      return;
    }

    setIsChangingPass(true);
    try {
      await changePassword(newPass);
      setPassSuccess('Your portal password has been updated securely.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      setPassError(err.message || 'Failed to update password');
    } finally {
      setIsChangingPass(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black pt-28 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-[#f2a900]/10 rounded-full flex items-center justify-center mb-8 border border-[#f2a900]/20">
            <Lock className="w-10 h-10 text-[#f2a900]" />
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-medium text-white leading-tight mb-6">
            Client Portal <br />
            <span className="text-[#f2a900] italic">Coming Soon</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Our dedicated client portal is currently under development. It will launch on August 28th, bringing you a fully immersive experience to review, manage, and download your precious moments.
          </p>
          <button onClick={handleLogout} className="btn-primary flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

  return (`

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
console.log('patched');
