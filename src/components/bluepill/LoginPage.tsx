import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserCheck, 
  User,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Terminal,
  X
} from 'lucide-react';
import { 
  firebaseSignIn, 
  firebaseSignUp, 
  firebaseGoogleSignIn, 
  formatFirebaseError,
  verifyAdminRole
} from '../../services/firebaseAuth';

interface LoginPageProps {
  onLoginSuccess: (email: string, role: 'student' | 'admin') => void;
  onContinueAsGuest: () => void;
}

export default function LoginPage({ onLoginSuccess, onContinueAsGuest }: LoginPageProps) {
  // Tab switch state: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Hidden Admin Mode state (Activated via Cmd/Ctrl + Shift + A or ?mode=admin)
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Status & Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Secret Shortcut & Query Parameter Listener
  useEffect(() => {
    // 1. Secret Key Combo Listener (Cmd + Shift + A or Ctrl + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminMode((prev) => {
          const nextState = !prev;
          setErrorMsg('');
          setSuccessMsg(nextState ? 'System Administrator Console Unlocked' : '');
          return nextState;
        });
      }
    };

    // 2. Secret URL Query Parameter Listener (?mode=admin or ?role=admin)
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('mode') === 'admin' || searchParams.get('role') === 'admin') {
        setIsAdminMode(true);
      }
    } catch (e) {
      // Ignore URL parsing in non-browser environments
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsGoogleSubmitting(true);

    try {
      const authResult = await firebaseGoogleSignIn();
      // Redirect ONLY inside try block AFTER successful resolution
      onLoginSuccess(authResult.email, authResult.role);
    } catch (err: any) {
      // Prevent redirect and display error banner
      setErrorMsg(formatFirebaseError(err));
    } finally {
      // Reset loading state in finally block
      setIsGoogleSubmitting(false);
    }
  };

  // Sign In Form Handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Invalid email or password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const authResult = await firebaseSignIn(email.trim(), password);
      // Redirect ONLY inside try block AFTER successful resolution
      onLoginSuccess(authResult.email, authResult.role);
    } catch (err: any) {
      // Prevent redirect and display error banner
      setErrorMsg(formatFirebaseError(err));
    } finally {
      // Reset loading state in finally block
      setIsSubmitting(false);
    }
  };

  // Sign Up Form Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (signUpPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setIsSubmitting(true);

    try {
      const authResult = await firebaseSignUp(signUpEmail.trim(), signUpPassword, fullName.trim());
      // Redirect ONLY inside try block AFTER successful resolution
      onLoginSuccess(authResult.email, authResult.role);
    } catch (err: any) {
      // Prevent redirect and display error banner
      setErrorMsg(formatFirebaseError(err));
    } finally {
      // Reset loading state in finally block
      setIsSubmitting(false);
    }
  };

  // Hidden Admin Login Handler with Firebase Role Verification
  const handleAdminSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setErrorMsg('Invalid email or password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Authenticate with Firebase Auth
      const authResult = await firebaseSignIn(adminEmail.trim(), adminPassword);
      
      // 2. Strictly verify Admin Role in Firebase
      const isAdmin = await verifyAdminRole(authResult.uid, authResult.email);

      if (isAdmin || authResult.role === 'admin') {
        // Redirect ONLY inside try block AFTER successful admin verification
        onLoginSuccess(authResult.email, 'admin');
      } else {
        setErrorMsg('Unauthorized: This account does not possess System Administrator privileges.');
      }
    } catch (err: any) {
      // Prevent redirect and display error banner
      setErrorMsg(formatFirebaseError(err));
    } finally {
      // Reset loading state in finally block
      setIsSubmitting(false);
    }
  };

  // Password Strength Calculator for Sign Up
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (pass.length >= 12) score += 1;
    return score;
  };

  const pwdStrength = getPasswordStrength(signUpPassword);

  return (
    <div className="min-h-screen bg-[#090c12] text-[#dfe2ed] flex flex-col justify-between relative overflow-hidden font-sans antialiased">
      {/* Background Decorative Ambient Glows */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${isAdminMode ? 'bg-amber-900/20' : 'bg-[#274472]/15'}`} />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#3a6073]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar Header */}
      <header className="border-b border-[#252a36] bg-[#0c0f17]/80 backdrop-blur-md px-6 py-4 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg p-0.5 shadow-md flex items-center justify-center transition-all ${isAdminMode ? 'bg-gradient-to-tr from-amber-600 to-red-600' : 'bg-gradient-to-tr from-[#1d3557] to-[#457b9d]'}`}>
            {isAdminMode ? (
              <ShieldAlert className="w-5 h-5 text-amber-200" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-[#a8dadc]" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-white flex items-center gap-2">
              Project X <span className={`text-xs px-2 py-0.5 border rounded font-mono transition-all ${isAdminMode ? 'bg-amber-950/80 text-amber-300 border-amber-700/60' : 'bg-[#1d3557] text-[#a8dadc] border-[#457b9d]/40'}`}>
                {isAdminMode ? 'ADMIN CONSOLE' : 'ENTERPRISE PORTAL'}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#8d909d] font-mono">
          <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${isAdminMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span>{isAdminMode ? 'SECURITY LEVEL: RESTRICTED' : 'GATEWAY: ACTIVE'}</span>
        </div>
      </header>

      {/* Main Form Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md space-y-4">
          
          {/* Main Card */}
          <div className={`bg-[#111520]/90 border rounded-2xl p-7 shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-300 ${isAdminMode ? 'border-amber-900/60 shadow-amber-950/30' : 'border-[#2e3548]'}`}>
            <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${isAdminMode ? 'bg-gradient-to-r from-amber-500 via-red-500 to-amber-600' : 'bg-gradient-to-r from-[#2563eb] via-[#60a5fa] to-[#3b82f6]'}`} />

            {/* Notification Messages */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs text-amber-300 flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* HIDDEN ADMIN AUTHENTICATION CONSOLE MODE */}
            {/* ======================================================== */}
            {isAdminMode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <h2 className="text-sm font-bold text-amber-200 tracking-wide uppercase font-mono">
                      System Administrator Verification
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminMode(false);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-[#787c8e] hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Exit Admin</span>
                  </button>
                </div>

                <form onSubmit={handleAdminSignInSubmit} className="space-y-4">
                  {/* Admin Email */}
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider mb-1.5 font-mono">
                      Administrator Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/70" />
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@xero.io"
                        disabled={isSubmitting}
                        className="w-full bg-[#0c0f17] border border-amber-900/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-amber-900/40 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Admin Security Access Key */}
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider mb-1.5 font-mono">
                      Security Access Key
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/70" />
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        disabled={isSubmitting}
                        className="w-full bg-[#0c0f17] border border-amber-900/50 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-amber-900/40 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono disabled:opacity-60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-300 transition-colors p-1 cursor-pointer"
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Admin Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed font-mono text-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Admin Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Authenticate Administrator</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* ======================================================== */
              /* PUBLIC USER AUTHENTICATION VIEW */
              /* ======================================================== */
              <div className="space-y-5">
                {/* Tab Navigation Header */}
                <div className="flex bg-[#0c0f17] p-1 rounded-xl border border-[#252b3b]">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeTab === 'signin'
                        ? 'bg-[#1e2738] text-white shadow-md border border-[#3b4d70]/50'
                        : 'text-[#8d909d] hover:text-[#c3c6d4]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeTab === 'signup'
                        ? 'bg-[#1e2738] text-white shadow-md border border-[#3b4d70]/50'
                        : 'text-[#8d909d] hover:text-[#c3c6d4]'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Google OAuth SSO Option */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleSubmitting || isSubmitting}
                    className="w-full py-2.5 px-4 bg-[#161c29] hover:bg-[#1e283b] text-white border border-[#2e374d] hover:border-[#4b5878] rounded-xl text-xs font-medium transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-60"
                  >
                    {isGoogleSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#252a36]" />
                  </div>
                  <span className="relative bg-[#111520] px-3 text-[10px] font-mono text-[#6b7280] uppercase tracking-wider">
                    OR CONTINUE WITH EMAIL
                  </span>
                </div>

                {/* SIGN IN TAB */}
                {activeTab === 'signin' && (
                  <form onSubmit={handleSignInSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@enterprise.io"
                          disabled={isSubmitting}
                          className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          disabled={isSubmitting}
                          className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#c3c6d4] transition-colors p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me / Forgot Password */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-[#8d909d] hover:text-[#c3c6d4]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded bg-[#0c0f17] border-[#2a3142] text-[#2563eb] focus:ring-0 cursor-pointer"
                        />
                        <span>Remember me</span>
                      </label>
                      <span className="text-[#60a5fa] hover:underline cursor-pointer text-xs">Forgot Password?</span>
                    </div>

                    {/* Submit Sign In */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isGoogleSubmitting}
                      className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Authenticating with Firebase...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Portal</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* CREATE ACCOUNT TAB */}
                {activeTab === 'signup' && (
                  <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Alex Rivera"
                          disabled={isSubmitting}
                          className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="name@enterprise.io"
                          disabled={isSubmitting}
                          className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="••••••••••••"
                          disabled={isSubmitting}
                          className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-10 py-2 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#c3c6d4] transition-colors p-1 cursor-pointer"
                        >
                          {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {signUpPassword && (
                        <div className="mt-2 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-[#8d909d]">
                            <span>Password Strength:</span>
                            <span className="font-semibold text-white">
                              {pwdStrength <= 1 && <span className="text-rose-400">Weak</span>}
                              {pwdStrength === 2 && <span className="text-amber-400">Medium</span>}
                              {pwdStrength >= 3 && <span className="text-emerald-400">Strong</span>}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-[#1b2230] rounded-full overflow-hidden flex gap-1">
                            <div className={`h-full flex-1 transition-all ${pwdStrength >= 1 ? (pwdStrength === 1 ? 'bg-rose-500' : pwdStrength === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'}`} />
                            <div className={`h-full flex-1 transition-all ${pwdStrength >= 2 ? (pwdStrength === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'}`} />
                            <div className={`h-full flex-1 transition-all ${pwdStrength >= 3 ? 'bg-emerald-500' : 'bg-transparent'}`} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          value={signUpConfirmPassword}
                          onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          disabled={isSubmitting}
                          className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Terms Agreement Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2 cursor-pointer text-[#8d909d] hover:text-[#c3c6d4] text-xs">
                        <input
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="mt-0.5 rounded bg-[#0c0f17] border-[#2a3142] text-[#2563eb] focus:ring-0 cursor-pointer"
                        />
                        <span className="leading-snug text-[11px]">
                          I agree to the <span className="text-[#60a5fa] underline cursor-pointer">Terms of Service</span> and <span className="text-[#60a5fa] underline cursor-pointer">Privacy Policy</span>.
                        </span>
                      </label>
                    </div>

                    {/* Submit Create Account */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isGoogleSubmitting}
                      className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating Firebase Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Guest Bypass Link */}
                <div className="mt-5 text-center border-t border-[#1e2536] pt-4">
                  <button
                    type="button"
                    onClick={onContinueAsGuest}
                    className="text-xs text-[#8d909d] hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer group"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#60a5fa] group-hover:scale-110 transition-transform" />
                    <span>Continue as Guest</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Subtext */}
          <div className="text-center font-mono text-[11px] text-[#555a68] space-y-0.5">
            <p>Project X Enterprise Subspace Matrix v4.12</p>
            <p className="text-[#3f4452]">Authorized Personnel Only • AES-256 Encrypted Session</p>
          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-[#1c2230] bg-[#090c12]/90 px-6 py-3 text-center text-xs text-[#555a68] font-mono relative z-10 flex justify-between items-center">
        <span>STATUS: OPERATIONAL</span>
        <span>© 2026 Project X Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
