import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseValidation } from '../services/firebase';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithGithub,
  signInAsGuest,
  linkUserWithGoogle,
  linkUserWithGithub,
  linkUserWithEmail,
  unlinkUserProvider,
  logoutUser,
  sendPasswordReset,
  formatAuthError
} from '../services/authService';

export type UserRole = 'student' | 'admin' | 'guest';

export interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole;
  isAnonymous: boolean;
  loading: boolean;
  error: string | null;
  isConfigValid: boolean;
  missingEnvVars: string[];
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  linkGoogle: () => Promise<void>;
  linkGithub: () => Promise<void>;
  linkEmailPassword: (email: string, password: string) => Promise<void>;
  unlinkProvider: (providerId: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isConfigValid = firebaseValidation.isValid;
  const missingEnvVars = firebaseValidation.missingKeys;

  const determineRole = (user: User | null): UserRole => {
    if (!user) return 'student';
    if (user.isAnonymous) return 'guest';
    
    const emailLower = (user.email || '').toLowerCase();
    if (emailLower.includes('admin') || emailLower.endsWith('@xero.io')) {
      return 'admin';
    }
    return 'student';
  };

  useEffect(() => {
    if (!isConfigValid || !auth) {
      setLoading(false);
      setError('Firebase configuration is missing or invalid. Please configure your .env.local file.');
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setUserRole(determineRole(user));
        setLoading(false);
      },
      (err) => {
        console.error('[AuthContext] Auth state listener error:', err);
        setError(formatAuthError(err));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isConfigValid]);

  const clearError = () => setError(null);

  const handleAuthAction = async (action: () => Promise<any>) => {
    try {
      setError(null);
      await action();
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const login = (email: string, password: string) =>
    handleAuthAction(() => signInWithEmail(email, password));

  const signUp = (email: string, password: string, displayName?: string) =>
    handleAuthAction(() => signUpWithEmail(email, password, displayName));

  const loginWithGoogle = () =>
    handleAuthAction(() => signInWithGoogle());

  const loginWithGithub = () =>
    handleAuthAction(() => signInWithGithub());

  const loginAsGuest = () =>
    handleAuthAction(() => signInAsGuest());

  const linkGoogle = async () => {
    if (!currentUser) return;
    try {
      setError(null);
      const updatedUser = await linkUserWithGoogle(currentUser);
      setCurrentUser({ ...updatedUser });
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const linkGithub = async () => {
    if (!currentUser) return;
    try {
      setError(null);
      const updatedUser = await linkUserWithGithub(currentUser);
      setCurrentUser({ ...updatedUser });
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const linkEmailPassword = async (email: string, password: string) => {
    if (!currentUser) return;
    try {
      setError(null);
      const updatedUser = await linkUserWithEmail(currentUser, email, password);
      setCurrentUser({ ...updatedUser });
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const unlinkProvider = async (providerId: string) => {
    if (!currentUser) return;
    try {
      setError(null);
      const updatedUser = await unlinkUserProvider(currentUser, providerId);
      setCurrentUser({ ...updatedUser });
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await logoutUser();
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordReset(email);
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        isAnonymous: currentUser?.isAnonymous || false,
        loading,
        error,
        isConfigValid,
        missingEnvVars,
        login,
        signUp,
        loginWithGoogle,
        loginWithGithub,
        loginAsGuest,
        linkGoogle,
        linkGithub,
        linkEmailPassword,
        unlinkProvider,
        logout,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
