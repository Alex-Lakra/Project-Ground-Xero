import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  updateProfile,
  User as FirebaseUser 
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration loaded strictly from environment variables (.env.local)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export interface AuthResult {
  email: string;
  role: 'student' | 'admin';
  uid: string;
  displayName: string | null;
}

/**
 * Timeout promise wrapper to prevent async calls from hanging indefinitely
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 6000, errorMsg: string = 'Operation timed out'): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(errorMsg));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Helper to check if email has admin privileges
 */
export function checkIsAdmin(email: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  return cleanEmail.includes('admin') || cleanEmail === 'admin@xero.io';
}

/**
 * Verify if a user possesses System Administrator role in Firebase
 */
export async function verifyAdminRole(uid: string, email: string): Promise<boolean> {
  if (checkIsAdmin(email)) return true;

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await withTimeout(getDoc(userRef), 2500, 'Firestore timeout');
    if (userSnap.exists()) {
      return userSnap.data()?.role === 'admin';
    }
  } catch (err) {
    console.warn('[Firebase Auth] Admin role verification fallback:', err);
  }

  return checkIsAdmin(email);
}

/**
 * Save user profile to Firebase (Firestore & Realtime DB) with strict non-blocking timeouts
 */
async function saveAndFetchUserProfile(user: FirebaseUser, extraData: Record<string, any> = {}): Promise<'student' | 'admin'> {
  const role: 'student' | 'admin' = checkIsAdmin(user.email || '') ? 'admin' : 'student';

  // 1. Save / Fetch in Firestore with a strict 2-second timeout
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await withTimeout(getDoc(userRef), 2000, 'Firestore timeout');

    if (userSnap.exists()) {
      const existingData = userSnap.data();
      const userRole = existingData?.role || role;
      
      // Update last login timestamp in background
      withTimeout(setDoc(userRef, {
        lastLogin: new Date().toISOString(),
        updatedAt: serverTimestamp(),
        ...extraData
      }, { merge: true }), 2000, 'Firestore update timeout').catch(() => {});

      return userRole as 'student' | 'admin';
    } else {
      // Save new user profile to Firebase Firestore
      withTimeout(setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || extraData.displayName || '',
        role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ...extraData
      }), 2000, 'Firestore write timeout').catch(() => {});

      return role;
    }
  } catch (err) {
    console.warn('[Firebase Auth] Firestore query/sync bypassed due to timeout or network block:', err);
  }

  // 2. Backup write to Realtime DB with strict 1.5s timeout
  try {
    const dbUrl = (firebaseConfig.databaseURL || import.meta.env.VITE_FIREBASE_DB_URL || '').replace(/\/$/, '');
    if (dbUrl) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1500);

      await fetch(`${dbUrl}/users/${user.uid}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || extraData.displayName || '',
          role,
          lastLogin: new Date().toISOString()
        }),
        signal: controller.signal
      });
      clearTimeout(timer);
    }
  } catch (rtdbErr) {
    console.warn('[Firebase Auth] Realtime DB sync fallback warning:', rtdbErr);
  }

  return role;
}

/**
 * Sign In with Email & Password via Firebase Auth
 * STRICT: Throws any authentication failure to caller.
 */
export async function firebaseSignIn(email: string, pass: string): Promise<AuthResult> {
  if (!email.trim() || !pass.trim()) {
    throw new Error('Please enter both your email address and password.');
  }

  const userCredential = await withTimeout(
    signInWithEmailAndPassword(auth, email.trim(), pass),
    6000,
    'Firebase sign-in timed out. Please check your network connection.'
  );
  const user = userCredential.user;

  // Save/Sync login event to Firebase
  const role = await saveAndFetchUserProfile(user);

  return {
    email: user.email || email,
    role,
    uid: user.uid,
    displayName: user.displayName
  };
}

/**
 * Create Account / Sign Up with Email & Password via Firebase Auth
 * STRICT: Throws any registration failure to caller.
 */
export async function firebaseSignUp(email: string, pass: string, fullName: string): Promise<AuthResult> {
  if (!email.trim() || !pass.trim()) {
    throw new Error('Please enter a valid email address and password.');
  }
  if (pass.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  const userCredential = await withTimeout(
    createUserWithEmailAndPassword(auth, email.trim(), pass),
    6000,
    'Firebase account creation timed out. Please check your network connection.'
  );
  const user = userCredential.user;

  // Update Firebase display name
  if (fullName.trim()) {
    try {
      await updateProfile(user, { displayName: fullName.trim() });
    } catch (e) {
      console.warn('[Firebase Auth] Could not update displayName:', e);
    }
  }

  // Save new user profile to Firebase
  const role = await saveAndFetchUserProfile(user, { displayName: fullName.trim() });

  return {
    email: user.email || email,
    role,
    uid: user.uid,
    displayName: fullName.trim() || user.displayName
  };
}

/**
 * Sign In with Google OAuth via Firebase Auth
 * STRICT: Throws any OAuth failure to caller.
 */
export async function firebaseGoogleSignIn(): Promise<AuthResult> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  const userCredential = await withTimeout(
    signInWithPopup(auth, provider),
    8000,
    'Google sign-in timed out or was blocked by browser popup settings.'
  );
  const user = userCredential.user;

  // Save/Sync Google profile to Firebase
  const role = await saveAndFetchUserProfile(user);

  return {
    email: user.email || 'user@google.com',
    role,
    uid: user.uid,
    displayName: user.displayName
  };
}

/**
 * Format raw Firebase Auth errors into clear user-friendly messages
 */
export function formatFirebaseError(error: any): string {
  if (!error) return 'An unexpected error occurred during authentication.';
  
  const code = error?.code || '';
  const message = error?.message || error?.toString() || '';

  if (
    code.includes('auth/invalid-credential') || 
    code.includes('auth/wrong-password') || 
    code.includes('auth/user-not-found') ||
    code.includes('auth/invalid-email')
  ) {
    return 'Invalid email or password.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Access temporarily disabled due to many failed attempts. Please try again later.';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 8 characters.';
  }
  if (code.includes('auth/popup-closed-by-user')) {
    return 'Google Sign-in popup was closed before completion.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Network connection error. Please check your internet connection.';
  }
  if (code.includes('auth/invalid-api-key') || code.includes('api-key-not-valid')) {
    return 'Firebase API Key is missing or invalid in your .env.local file.';
  }

  if (message.includes('Please enter both') || message.includes('Please enter a valid')) {
    return message;
  }

  return message.replace('Firebase: ', '') || 'Authentication failed. Please try again.';
}
