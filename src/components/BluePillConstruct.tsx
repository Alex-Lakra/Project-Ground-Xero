import React, { useState } from 'react';
import EnterpriseDashboard from './bluepill/EnterpriseDashboard';
import LoginPage from './bluepill/LoginPage';

/**
 * BluePillConstruct serves as the primary entry point for the Blue Pill reality.
 * It renders the temporary Login Gate first, and upon authentication or continuing as guest,
 * renders the CodeFlow Enterprise Dashboard.
 */
export default function BluePillConstruct() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');

  const handleLoginSuccess = (email: string, role: 'student' | 'admin') => {
    setUserEmail(email);
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleContinueAsGuest = () => {
    setUserEmail('Guest Access');
    setUserRole('student');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserRole('student');
  };

  if (!isLoggedIn) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return (
    <EnterpriseDashboard 
      userEmail={userEmail}
      userRole={userRole}
      onLogout={handleLogout} 
    />
  );
}
