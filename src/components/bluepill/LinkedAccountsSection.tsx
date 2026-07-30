import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck, Link2, Unlink, Lock, Mail, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function LinkedAccountsSection() {
  const { currentUser, isAnonymous, linkGoogle, linkGithub, linkEmailPassword, unlinkProvider } = useAuth();

  const [isLinkingEmail, setIsLinkingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!currentUser) return null;

  const providerData = currentUser.providerData || [];
  const linkedProviderIds = providerData.map(p => p.providerId);

  const hasPassword = linkedProviderIds.includes('password');
  const hasGoogle = linkedProviderIds.includes('google.com');
  const hasGithub = linkedProviderIds.includes('github.com');

  const canUnlink = providerData.length > 1 && !isAnonymous;

  const handleLinkGoogle = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoadingProvider('google.com');
    try {
      await linkGoogle();
      setSuccessMsg('Google account linked successfully! You can now sign in with Google.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to link Google account.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleLinkGithub = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoadingProvider('github.com');
    try {
      await linkGithub();
      setSuccessMsg('GitHub account linked successfully! You can now sign in with GitHub.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to link GitHub account.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleLinkEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!emailInput.trim() || !passwordInput) {
      setErrorMsg('Please enter both email and a password.');
      return;
    }
    if (passwordInput.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoadingProvider('password');
    try {
      await linkEmailPassword(emailInput, passwordInput);
      setSuccessMsg('Email & Password security key linked successfully!');
      setIsLinkingEmail(false);
      setPasswordInput('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to link Email & Password.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleUnlink = async (providerId: string) => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!canUnlink) {
      setErrorMsg('Cannot unlink sign-in method. You must keep at least one authentication method connected.');
      return;
    }

    setLoadingProvider(providerId);
    try {
      await unlinkProvider(providerId);
      setSuccessMsg(`Provider "${providerId}" unlinked successfully.`);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to unlink ${providerId}.`);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="bg-[#181c24] border border-[#31353d] rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-[#292e3a] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#dfe2ed] flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#60a5fa]" />
            Linked Authentication Methods
          </h3>
          <p className="text-xs text-[#8d909d] mt-0.5">
            Single UID: <code className="text-[#a8dadc] bg-[#0c0f17] px-1.5 py-0.5 rounded font-mono text-[11px]">{currentUser.uid}</code>
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-lg">
          {providerData.length} Linked Provider{providerData.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Account Providers Grid */}
      <div className="space-y-3 font-sans text-xs">
        {/* 1. Email & Password Provider */}
        <div className="bg-[#0f131b] border border-[#272d3b] p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#182030] flex items-center justify-center border border-[#2f394d]">
              <Mail className="w-4 h-4 text-[#60a5fa]" />
            </div>
            <div>
              <div className="font-semibold text-white flex items-center gap-2">
                <span>Email & Password</span>
                {hasPassword && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    CONNECTED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8d909d] mt-0.5">
                {hasPassword ? (currentUser.email || 'Email Linked') : 'Not connected to password authentication.'}
              </p>
            </div>
          </div>

          <div>
            {hasPassword ? (
              <button
                type="button"
                onClick={() => handleUnlink('password')}
                disabled={!canUnlink || loadingProvider === 'password'}
                className="px-3 py-1.5 border border-rose-900/60 hover:bg-rose-950/50 text-rose-300 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono"
                title={canUnlink ? 'Unlink Password Sign In' : 'Must keep at least 1 provider linked'}
              >
                {loadingProvider === 'password' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Unlink className="w-3.5 h-3.5" />
                )}
                <span>Unlink</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLinkingEmail(!isLinkingEmail)}
                className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#2e3e58] border border-[#3b4f73] text-[#aec6ff] rounded-lg transition-all font-medium cursor-pointer text-xs"
              >
                {isLinkingEmail ? 'Cancel' : 'Add Password'}
              </button>
            )}
          </div>
        </div>

        {/* Inline Add Password Form */}
        {isLinkingEmail && !hasPassword && (
          <form onSubmit={handleLinkEmailPasswordSubmit} className="bg-[#131722] border border-[#2b354c] p-4 rounded-xl space-y-3 animate-fadeIn">
            <h4 className="text-xs font-bold text-[#aec6ff]">Add Password Credential to Current Session</h4>
            <div>
              <label className="block text-[10px] text-[#8d909d] uppercase font-mono mb-1">Email</label>
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                required
                className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#8d909d] uppercase font-mono mb-1">Create Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full bg-[#0c0f17] border border-[#2a3142] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <button
              type="submit"
              disabled={loadingProvider === 'password'}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loadingProvider === 'password' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Link Email & Password Credential</span>
            </button>
          </form>
        )}

        {/* 2. Google Provider */}
        <div className="bg-[#0f131b] border border-[#272d3b] p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#182030] flex items-center justify-center border border-[#2f394d]">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-white flex items-center gap-2">
                <span>Google Account</span>
                {hasGoogle && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    CONNECTED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8d909d] mt-0.5">
                {hasGoogle ? 'Google OAuth provider linked.' : 'Connect Google for 1-click authentication.'}
              </p>
            </div>
          </div>

          <div>
            {hasGoogle ? (
              <button
                type="button"
                onClick={() => handleUnlink('google.com')}
                disabled={!canUnlink || loadingProvider === 'google.com'}
                className="px-3 py-1.5 border border-rose-900/60 hover:bg-rose-950/50 text-rose-300 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono"
                title={canUnlink ? 'Unlink Google Account' : 'Must keep at least 1 provider linked'}
              >
                {loadingProvider === 'google.com' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Unlink className="w-3.5 h-3.5" />
                )}
                <span>Unlink</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLinkGoogle}
                disabled={loadingProvider === 'google.com'}
                className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#2e3e58] border border-[#3b4f73] text-[#aec6ff] rounded-lg transition-all font-medium cursor-pointer text-xs flex items-center gap-1.5"
              >
                {loadingProvider === 'google.com' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                <span>Connect Google</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. GitHub Provider */}
        <div className="bg-[#0f131b] border border-[#272d3b] p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#182030] flex items-center justify-center border border-[#2f394d]">
              <svg className="w-4 h-4 shrink-0 fill-current text-[#dfe2ed]" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-white flex items-center gap-2">
                <span>GitHub Account</span>
                {hasGithub && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    CONNECTED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8d909d] mt-0.5">
                {hasGithub ? 'GitHub OAuth provider linked.' : 'Connect GitHub for developer portal sign-in.'}
              </p>
            </div>
          </div>

          <div>
            {hasGithub ? (
              <button
                type="button"
                onClick={() => handleUnlink('github.com')}
                disabled={!canUnlink || loadingProvider === 'github.com'}
                className="px-3 py-1.5 border border-rose-900/60 hover:bg-rose-950/50 text-rose-300 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono"
                title={canUnlink ? 'Unlink GitHub Account' : 'Must keep at least 1 provider linked'}
              >
                {loadingProvider === 'github.com' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Unlink className="w-3.5 h-3.5" />
                )}
                <span>Unlink</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLinkGithub}
                disabled={loadingProvider === 'github.com'}
                className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#2e3e58] border border-[#3b4f73] text-[#aec6ff] rounded-lg transition-all font-medium cursor-pointer text-xs flex items-center gap-1.5"
              >
                {loadingProvider === 'github.com' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                <span>Connect GitHub</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
