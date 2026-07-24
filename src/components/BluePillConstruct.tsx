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

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleContinueAsGuest = () => {
    setUserEmail('Guest Access');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
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
      onLogout={handleLogout} 
    />
  );
}
