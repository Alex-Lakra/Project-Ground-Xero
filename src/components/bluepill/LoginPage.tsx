import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserCheck, 
  Sparkles,
  KeyRound,
  AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
  onContinueAsGuest: () => void;
}

export default function LoginPage({ onLoginSuccess, onContinueAsGuest }: LoginPageProps) {
  // Credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Default test credentials
  const DEMO_EMAIL = 'alex.rivera@projectx.io';
  const DEMO_PASSWORD = 'matrix2026';

  // Quick auto-fill handler
  const handleAutoFill = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your enterprise email or username.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your security access key / password.');
      return;
    }

    setIsSubmitting(true);

    // Simulate authentication packet processing delay
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(email);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#090c12] text-[#dfe2ed] flex flex-col justify-between relative overflow-hidden font-sans antialiased">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#274472]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#3a6073]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar Header */}
      <header className="border-b border-[#252a36] bg-[#0c0f17]/80 backdrop-blur-md px-6 py-4 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#1d3557] to-[#457b9d] p-0.5 shadow-md flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#a8dadc]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-white flex items-center gap-2">
              Project X <span className="text-xs px-2 py-0.5 bg-[#1d3557] text-[#a8dadc] border border-[#457b9d]/40 rounded font-mono">ENTERPRISE PORTAL</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#8d909d] font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GATEWAY: ACTIVE</span>
        </div>
      </header>

      {/* Main Form Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md space-y-6">
          
          {/* Main Login Card */}
          <div className="bg-[#111520]/90 border border-[#2e3548] rounded-2xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563eb] via-[#60a5fa] to-[#3b82f6]" />

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">System Authentication</h2>
              <p className="text-xs text-[#8d909d] mt-1">
                Enter your credentials to access the Corporate Construct.
              </p>
            </div>

            {/* Test Credentials Highlight Card */}
            <div className="mb-6 bg-[#171d2b] border border-[#2b354c] rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between font-mono text-[#aec6ff] font-semibold">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#60a5fa]" />
                  TEST CREDENTIALS
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                  READY
                </span>
              </div>
              <div className="font-mono text-[#c3c6d4] space-y-1 bg-[#0c0f17] p-2.5 rounded border border-[#212738]">
                <div className="flex justify-between">
                  <span className="text-[#787c8e]">Email:</span>
                  <span className="text-white font-medium">{DEMO_EMAIL}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787c8e]">Password:</span>
                  <span className="text-white font-medium">{DEMO_PASSWORD}</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleAutoFill}
                className="w-full mt-1 py-1.5 px-3 bg-[#1d273a] hover:bg-[#273550] border border-[#3b4d70] rounded text-[#aec6ff] hover:text-white transition-all flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Auto-fill Test Credentials
              </button>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username */}
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
                    className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#c3c6d4] uppercase tracking-wider mb-1.5">
                  Access Key / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#c3c6d4] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me / Forgot Option */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#8d909d] hover:text-[#c3c6d4]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#0c0f17] border-[#2a3142] text-[#2563eb] focus:ring-0 cursor-pointer"
                  />
                  <span>Keep session active</span>
                </label>
                <span className="text-[#60a5fa] hover:underline cursor-pointer">Security help?</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Access Packet...</span>
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
                OR BYPASS AUTHENTICATION
              </span>
            </div>

            {/* CONTINUE WITHOUT LOGIN BUTTON */}
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full py-2.5 px-4 bg-[#161c29] hover:bg-[#1f283a] text-[#dfe2ed] border border-[#2e374d] hover:border-[#4b5878] rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
            >
              <UserCheck className="w-4 h-4 text-[#a8dadc] group-hover:text-white transition-colors" />
              <span>Continue without Login (Guest Access)</span>
            </button>

          </div>

          {/* Footer note */}
          <div className="text-center font-mono text-[11px] text-[#555a68] space-y-1">
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
