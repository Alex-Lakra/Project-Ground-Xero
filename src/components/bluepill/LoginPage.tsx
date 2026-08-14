import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  User,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

type AuthMode = 'login' | 'signup' | 'forgot_password';
type AuthProviderType = 'email' | 'google' | 'github' | 'guest' | null;

export default function LoginPage({ onExitToChoice }: { onExitToChoice?: () => void }) {
  const {
    login,
    signUp,
    loginWithGoogle,
    loginWithGithub,
    loginAsGuest,
    resetPassword,
    error,
    clearError,
    isConfigValid,
    missingEnvVars
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');

  // Form Fields
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Hidden Admin Mode state (Activated via Cmd/Ctrl + Shift + A or ?mode=admin)
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Loading States
  const [activeProvider, setActiveProvider] = useState<AuthProviderType>(null);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isSubmitting = activeProvider !== null;

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setFormError('');
    setSuccessMsg('');
    clearError();
  };

  const isPasswordValid = password.length >= 6;
  const passwordsMatch = password === confirmPassword;

  // Secret Shortcut & Query Parameter Listener
  React.useEffect(() => {
    // 1. Secret Key Combo Listener (Cmd + Shift + A or Ctrl + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminMode((prev) => {
          const nextState = !prev;
          setFormError('');
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

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setFormError('Please enter your corporate email address.');
      return;
    }
    if (!password.trim()) {
      setFormError('Please enter your security access key / password.');
      return;
    }

    setActiveProvider('email');
    try {
      await login(email, password);
    } catch (err: any) {
      // Error handled by AuthContext
    } finally {
      setActiveProvider(null);
    }
  };

  // Handle Admin Login Submit
  const handleAdminSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setFormError('Invalid email or password.');
      return;
    }

    setActiveProvider('email');
    try {
      // Attempt login via the AuthContext
      await login(adminEmail.trim(), adminPassword);
    } catch (err: any) {
      // Error handled by AuthContext
    } finally {
      setActiveProvider(null);
    }
  };

  // Handle Sign Up Submit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setFormError('Please enter a valid corporate email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setFormError('Security password must be at least 6 characters long.');
      return;
    }
    if (!passwordsMatch) {
      setFormError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setActiveProvider('email');
    try {
      await signUp(email, password, displayName);
      setSuccessMsg('Account created successfully! Check your email for verification.');
    } catch (err: any) {
      // Error handled by AuthContext
    } finally {
      setActiveProvider(null);
    }
  };

  // Handle Forgot Password Submit
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setFormError('Please enter your email address to receive a password reset link.');
      return;
    }

    setActiveProvider('email');
    try {
      await resetPassword(email);
      setSuccessMsg(`Password reset link sent to ${email}. Please check your inbox.`);
    } catch (err: any) {
      // Error handled by AuthContext
    } finally {
      setActiveProvider(null);
    }
  };

  // Handle Provider Logins (Google, GitHub, Guest)
  const handleProviderLogin = async (provider: 'google' | 'github' | 'guest') => {
    setFormError('');
    setSuccessMsg('');
    clearError();

    if (!isConfigValid) {
      setFormError('Firebase is unconfigured. Please update your .env.local file with valid credentials.');
      return;
    }

    setActiveProvider(provider);

    try {
      if (provider === 'google') await loginWithGoogle();
      else if (provider === 'github') await loginWithGithub();
      else if (provider === 'guest') await loginAsGuest();
    } catch (err: any) {
      // Error handled by AuthContext
    } finally {
      setActiveProvider(null);
    }
  };

  const activeError = formError || error;

  return (
    <div className="min-h-screen bg-[#090c12] text-[#dfe2ed] flex flex-col justify-between relative overflow-hidden font-sans antialiased">
      {/* Ambient Glow Effects */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${isAdminMode ? 'bg-amber-900/20' : 'bg-[#274472]/15'}`} />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#3a6073]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-[#252a36] bg-[#0c0f17]/80 backdrop-blur-md px-6 py-4 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onExitToChoice && (
            <button
              onClick={onExitToChoice}
              className="p-2 rounded hover:bg-[#1d3557]/50 text-[#8d909d] hover:text-white transition-colors cursor-pointer mr-2"
              title="Return to Construct Choice"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg p-0.5 shadow-md flex items-center justify-center transition-all ${isAdminMode ? 'bg-gradient-to-tr from-amber-600 to-red-600' : 'bg-gradient-to-tr from-[#1d3557] to-[#457b9d]'}`}>
              {isAdminMode ? (
                <AlertTriangle className="w-5 h-5 text-amber-200" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-[#a8dadc]" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide text-white flex items-center gap-2">
                Project X <span className={`text-xs px-2 py-0.5 border rounded font-mono transition-all ${isAdminMode ? 'bg-amber-950/80 text-amber-300 border-amber-700/60' : 'bg-[#1d3557] text-[#a8dadc] border-[#457b9d]/40'}`}>
                  {isAdminMode ? 'ADMIN CONSOLE' : 'FIREBASE AUTHENTICATION'}
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#8d909d] font-mono">
          <span className={`inline-block w-2 h-2 rounded-full ${isConfigValid ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-bounce'}`} />
          <span>{isConfigValid ? 'FIREBASE SDK: ONLINE' : 'CONFIG CHECK: ATTENTION NEEDED'}</span>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md space-y-6">

          {/* DEVELOPER CONFIGURATION WARNING BANNER */}
          {!isConfigValid && (
            <div className="bg-amber-950/60 border border-amber-800/80 rounded-2xl p-5 shadow-2xl space-y-3 font-mono text-xs animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Firebase Configuration Notice</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed text-[11px]">
                Firebase configuration is missing or invalid. Please populate your <code className="bg-amber-900/80 px-1 py-0.5 rounded text-amber-100 font-bold">.env.local</code> file.
              </p>
              
              <div className="bg-[#0c0f17] border border-amber-900/50 rounded-lg p-3 space-y-1">
                <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Unconfigured / Missing Keys:</div>
                <ul className="list-disc list-inside text-rose-300 text-[11px]">
                  {missingEnvVars.map(key => (
                    <li key={key}>{key}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-amber-300/80 pt-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Refer to <strong className="text-white">SETUP_FIREBASE.md</strong> and <strong className="text-white">.env.example</strong> for instructions.</span>
              </div>
            </div>
          )}

          {/* Authentication Card */}
          <div className={`bg-[#111520]/90 border rounded-2xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-300 ${isAdminMode ? 'border-amber-900/60 shadow-amber-950/30' : 'border-[#2e3548]'}`}>
            <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${isAdminMode ? 'bg-gradient-to-r from-amber-500 via-red-500 to-amber-600' : 'bg-gradient-to-r from-[#2563eb] via-[#60a5fa] to-[#3b82f6]'}`} />

            {/* Title */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {mode === 'login' && 'System Authentication'}
                {mode === 'signup' && 'Create Security Profile'}
                {mode === 'forgot_password' && 'Reset Security Credentials'}
              </h2>
              <p className="text-xs text-[#8d909d] mt-1">
                {mode === 'login' && 'Authenticate via Firebase to access the Corporate Construct.'}
                {mode === 'signup' && 'Register your corporate credentials with Firebase Auth.'}
                {mode === 'forgot_password' && 'Enter your email to receive password recovery instructions.'}
              </p>
            </div>



            {/* Active Error Banner */}
            {activeError && (
              <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{activeError}</span>
              </div>
            )}

            {/* Success Message Banner */}
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* HIDDEN ADMIN AUTHENTICATION CONSOLE MODE */}
            {isAdminMode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <h2 className="text-sm font-bold text-amber-200 tracking-wide uppercase font-mono">
                      System Administrator Verification
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminMode(false);
                      setFormError('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-[#787c8e] hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
                    disabled={isSubmitting || !isConfigValid}
                    className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed font-mono text-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
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
              <>
                {/* SIGN IN FORM */}
                {mode === 'login' && (
              <div className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1.5">
                      Corporate Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@enterprise.io"
                        required
                        className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold text-[#c3c6d4] uppercase tracking-wider">
                        Access Key / Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
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

                  <button
                    type="submit"
                    disabled={isSubmitting || !isConfigValid}
                    className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {activeProvider === 'email' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authenticating via Firebase...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#252a36]" />
                  </div>
                  <span className="relative bg-[#111520] px-3 text-[11px] font-mono text-[#6b7280] uppercase tracking-wider">
                    OR AUTHENTICATE WITH PROVIDER
                  </span>
                </div>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => handleProviderLogin('google')}
                    disabled={isSubmitting || !isConfigValid}
                    className="w-full py-2.5 px-4 bg-[#171d29] hover:bg-[#202838] border border-[#2d374d] hover:border-[#425275] rounded-xl font-medium text-xs text-[#dfe2ed] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {activeProvider === 'google' ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                        <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderLogin('github')}
                    disabled={isSubmitting || !isConfigValid}
                    className="w-full py-2.5 px-4 bg-[#171d29] hover:bg-[#202838] border border-[#2d374d] hover:border-[#425275] rounded-xl font-medium text-xs text-[#dfe2ed] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {activeProvider === 'github' ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#a8dadc]" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0 fill-current text-[#dfe2ed]" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    )}
                    <span>Continue with GitHub</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderLogin('guest')}
                    disabled={isSubmitting || !isConfigValid}
                    className="w-full py-2.5 px-4 bg-[#161c29] hover:bg-[#1f283a] text-[#dfe2ed] border border-[#2e374d] hover:border-[#4b5878] rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {activeProvider === 'guest' ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-[#a8dadc] group-hover:text-white transition-colors" />
                    )}
                    <span>Continue as Guest (Anonymous Access)</span>
                  </button>
                </div>

                <div className="flex justify-between items-center pt-6 mt-2">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot_password')}
                    className="text-xs text-[#60a5fa] hover:text-white transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-xs text-[#60a5fa] hover:text-white transition-colors cursor-pointer font-semibold"
                  >
                    Create account
                  </button>
                </div>
              </div>
            )}

            {/* SIGN UP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1.5">
                    Full Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1.5">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@enterprise.io"
                      required
                      className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1.5">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
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

                <div>
                  <label className="block text-xs font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isConfigValid}
                  className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activeProvider === 'email' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating Firebase Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Firebase Account</span>
                    </>
                  )}
                </button>
                
                <div className="text-center pt-2 mt-4">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-xs text-[#8d909d] hover:text-white transition-colors cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {mode === 'forgot_password' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@enterprise.io"
                      required
                      className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isConfigValid}
                  className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activeProvider === 'email' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Password Reset Email...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Send Recovery Link</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2 mt-4">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-xs text-[#8d909d] hover:text-white transition-colors cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
              </>
            )}

          </div>

          {/* Footer Subtext */}
          <div className="text-center font-mono text-[11px] text-[#555a68] space-y-1">
            <p>Project X Enterprise Auth Matrix v6.1</p>
            <p className="text-[#3f4452]">Single UID • Seamless Provider Linking • TLS 1.3 Encrypted</p>
          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-[#1c2230] bg-[#090c12]/90 px-6 py-3 text-center text-xs text-[#555a68] font-mono relative z-10 flex justify-between items-center">
        <span>STATUS: SEAMLESS SILENT LINKING ACTIVE</span>
        <span>© 2026 Project X Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
