import React from 'react';
import EnterpriseDashboard from './bluepill/EnterpriseDashboard';
import LoginPage from './bluepill/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, RefreshCw } from 'lucide-react';

/**
 * Inner component that enforces authentication route protection based on Firebase Auth state.
 */
function BluePillProtectedRouter({ onExitToChoice }: { onExitToChoice?: () => void }) {
  const { currentUser, loading } = useAuth();

  // Loading state while Firebase restores or checks persistent session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090c12] text-[#dfe2ed] flex flex-col items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mx-auto" />
            <ShieldCheck className="w-6 h-6 text-[#60a5fa] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-sm font-bold tracking-widest text-[#aec6ff] uppercase">
            [VERIFYING FIREBASE SESSION]
          </div>
          <p className="text-xs text-[#6b7280]">
            Checking persistent auth tokens...
          </p>
        </div>
      </div>
    );
  }

  // Protected route check: If unauthenticated, present Firebase Login/Auth page
  if (!currentUser) {
    return <LoginPage onExitToChoice={onExitToChoice} />;
  }

  // Authenticated user access granted: Render Enterprise Dashboard
  return <EnterpriseDashboard />;
}

/**
 * BluePillConstruct serves as the primary entry point for the Blue Pill reality.
 * Wraps the sub-tree in AuthProvider so Firebase Auth state is accessible globally.
 */
export default function BluePillConstruct({ onExitToChoice }: { onExitToChoice?: () => void }) {
  return (
    <AuthProvider>
      <BluePillProtectedRouter onExitToChoice={onExitToChoice} />
    </AuthProvider>
  );
}
