import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  updateProfile,
  signInWithPopup,
  signInAnonymously,
  linkWithCredential,
  linkWithPopup,
  unlink,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  GoogleAuthProvider,
  GithubAuthProvider,
  User,
  AuthError,
  AuthCredential
} from 'firebase/auth';
import { auth, firebaseValidation } from './firebase';

// Lazy Provider Singletons
let googleProviderInstance: GoogleAuthProvider | null = null;
let githubProviderInstance: GithubAuthProvider | null = null;

export function getGoogleProvider(): GoogleAuthProvider {
  if (!googleProviderInstance) {
    googleProviderInstance = new GoogleAuthProvider();
    googleProviderInstance.addScope('email');
    googleProviderInstance.addScope('profile');
  }
  return googleProviderInstance;
}

export function getGithubProvider(): GithubAuthProvider {
  if (!githubProviderInstance) {
    githubProviderInstance = new GithubAuthProvider();
    githubProviderInstance.addScope('user:email');
  }
  return githubProviderInstance;
}

/**
 * Format Firebase Auth errors into clean, user-friendly messages.
 */
export function formatAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  const code = (error as AuthError).code || error.message || String(error);
  
  switch (code) {
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key':
      return 'Firebase API key is invalid or unconfigured. Please configure your .env.local file with valid credentials from Firebase Console.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please verify your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in with your password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact system support.';
    case 'auth/too-many-requests':
      return 'Access blocked due to multiple failed login attempts. Please reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connectivity.';
    case 'auth/requires-recent-login':
      return 'Please sign in again to perform this sensitive security action.';
    case 'auth/operation-not-allowed':
      return 'This sign-in provider is not enabled in your Firebase Console. Please see SETUP_FIREBASE.md to enable it.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing authentication. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email address using a different sign-in method.';
    case 'auth/provider-already-linked':
      return 'This sign-in provider is already linked to your account.';
    case 'auth/credential-already-in-use':
      return 'This provider account is already linked to another user.';
    case 'auth/cancelled-popup-request':
      return 'Authentication request cancelled. Please try again.';
    case 'auth/unauthorized-domain':
    case 'auth/auth-domain-config-required':
      return 'This domain is not authorized for OAuth operations in your Firebase Console settings.';
    case 'auth/timeout':
      return 'Authentication request timed out. Please check your network and try again.';
    default:
      if (typeof error.message === 'string' && error.message.length > 0) {
        return error.message.replace(/^Firebase:\s*/, '');
      }
      return 'Authentication failed. Please check your input and try again.';
  }
}

function ensureAuthInitialized() {
  if (!firebaseValidation.isValid || !auth) {
    const missing = firebaseValidation.missingKeys.join(', ');
    throw new Error(`Firebase is unconfigured or missing required environment variables: [${missing}]. Please update your .env.local file.`);
  }
}

/**
 * Handle account collision internally and complete provider linking silently.
 */
async function handleSilentAccountCollision(err: any, targetProvider: string): Promise<User> {
  const email = err.customData?.email || err.email;
  let pendingCredential: AuthCredential | null = null;

  if (targetProvider === 'google.com') {
    pendingCredential = GoogleAuthProvider.credentialFromError(err);
  } else if (targetProvider === 'github.com') {
    pendingCredential = GithubAuthProvider.credentialFromError(err);
  }

  if (email && pendingCredential) {
    const existingMethods = await fetchSignInMethodsForEmail(auth, email);

    // If existing account uses GitHub, trigger GitHub OAuth popup to authenticate existing account & link pending credential
    if (existingMethods.includes('github.com')) {
      const existingUserCred = await signInWithPopup(auth, getGithubProvider());
      await linkWithCredential(existingUserCred.user, pendingCredential);
      return existingUserCred.user;
    }

    // If existing account uses Google, trigger Google OAuth popup to authenticate existing account & link pending credential
    if (existingMethods.includes('google.com')) {
      const existingUserCred = await signInWithPopup(auth, getGoogleProvider());
      await linkWithCredential(existingUserCred.user, pendingCredential);
      return existingUserCred.user;
    }

    // If existing account uses Email & Password
    if (existingMethods.includes('password')) {
      throw new Error(`An account with email "${email}" already exists using Email & Password. Please sign in with your email password first to link ${targetProvider === 'google.com' ? 'Google' : 'GitHub'}.`);
    }
  }

  throw err;
}

/**
 * Sign up a new user with Email, Password, and Display Name.
 * Automatically upgrades guest session if user is currently anonymous.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  ensureAuthInitialized();
  const trimmedEmail = email.trim();

  // Upgrade guest session silently if currently anonymous
  if (auth.currentUser && auth.currentUser.isAnonymous) {
    const credential = EmailAuthProvider.credential(trimmedEmail, password);
    const userCredential = await linkWithCredential(auth.currentUser, credential);
    const user = userCredential.user;

    if (displayName && displayName.trim()) {
      await updateProfile(user, { displayName: displayName.trim() });
    }
    return user;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    const user = userCredential.user;

    if (displayName && displayName.trim()) {
      await updateProfile(user, { displayName: displayName.trim() });
    }

    try {
      await firebaseSendEmailVerification(user);
    } catch (verificationErr) {
      console.warn('[AuthService] Automatic email verification send failed:', verificationErr);
    }

    return user;
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      const existingMethods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
      if (existingMethods.length > 0) {
        throw new Error(`An account with email "${trimmedEmail}" already exists via ${existingMethods.join(', ')}. Please sign in using your existing provider.`);
      }
    }
    throw err;
  }
}

/**
 * Sign in existing user with Email and Password.
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  ensureAuthInitialized();
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
}

/**
 * Sign in with Google OAuth Provider.
 * Upgrades guest session if anonymous, or completes provider account linking silently.
 */
export async function signInWithGoogle(): Promise<User> {
  ensureAuthInitialized();
  const provider = getGoogleProvider();

  // Upgrade guest session silently if currently anonymous
  if (auth.currentUser && auth.currentUser.isAnonymous) {
    const userCredential = await linkWithPopup(auth.currentUser, provider);
    return userCredential.user;
  }

  try {
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (err: any) {
    if (err.code === 'auth/account-exists-with-different-credential') {
      return await handleSilentAccountCollision(err, 'google.com');
    }
    throw err;
  }
}

/**
 * Sign in with GitHub OAuth Provider.
 * Upgrades guest session if anonymous, or completes provider account linking silently.
 */
export async function signInWithGithub(): Promise<User> {
  ensureAuthInitialized();
  const provider = getGithubProvider();

  // Upgrade guest session silently if currently anonymous
  if (auth.currentUser && auth.currentUser.isAnonymous) {
    const userCredential = await linkWithPopup(auth.currentUser, provider);
    return userCredential.user;
  }

  try {
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (err: any) {
    if (err.code === 'auth/account-exists-with-different-credential') {
      return await handleSilentAccountCollision(err, 'github.com');
    }
    throw err;
  }
}

/**
 * Sign in anonymously (Guest session).
 */
export async function signInAsGuest(): Promise<User> {
  ensureAuthInitialized();
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
}

/**
 * Link an existing signed-in user with Google OAuth provider.
 */
export async function linkUserWithGoogle(user: User): Promise<User> {
  const userCredential = await linkWithPopup(user, getGoogleProvider());
  return userCredential.user;
}

/**
 * Link an existing signed-in user with GitHub OAuth provider.
 */
export async function linkUserWithGithub(user: User): Promise<User> {
  const userCredential = await linkWithPopup(user, getGithubProvider());
  return userCredential.user;
}

/**
 * Link an existing signed-in user with Email & Password.
 */
export async function linkUserWithEmail(user: User, email: string, password: string): Promise<User> {
  const credential = EmailAuthProvider.credential(email.trim(), password);
  const userCredential = await linkWithCredential(user, credential);
  return userCredential.user;
}

/**
 * Unlink a provider from the user account.
 * Ensures at least one sign-in method remains.
 */
export async function unlinkUserProvider(user: User, providerId: string): Promise<User> {
  if (user.providerData.length <= 1 && !user.isAnonymous) {
    throw new Error('Cannot unlink provider. You must keep at least one sign-in method linked to your account.');
  }
  const updatedUser = await unlink(user, providerId);
  return updatedUser;
}

/**
 * Log out the current user.
 */
export async function logoutUser(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

/**
 * Send a Password Reset Email to the specified address.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  ensureAuthInitialized();
  await firebaseSendPasswordResetEmail(auth, email.trim());
}

/**
 * Resend Email Verification for the provided Firebase User.
 */
export async function resendVerificationEmail(user: User): Promise<void> {
  await firebaseSendEmailVerification(user);
}
