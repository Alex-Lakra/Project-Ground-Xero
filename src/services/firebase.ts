import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

export interface FirebaseConfigValidation {
  isValid: boolean;
  missingKeys: string[];
  config: {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  };
}

/**
 * Known placeholder pattern tester to detect dummy or unconfigured API keys.
 * Note: Real Firebase API Keys start with 'AIzaSy', so we must NOT flag 'AIzaSy' itself as a placeholder.
 */
function isPlaceholderValue(value: string | undefined): boolean {
  if (!value || typeof value !== 'string') return true;
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  
  const placeholders = [
    'aizasyplaceholder',
    'your_',
    'change_me',
    'placeholder',
    'xxxxxxxx',
    'demo',
    '123456789'
  ];
  
  const lower = trimmed.toLowerCase();
  return placeholders.some(p => lower.includes(p));
}

/**
 * Validate Firebase Environment Configuration
 */
export function validateFirebaseConfig(): FirebaseConfigValidation {
  const env = import.meta.env;

  const rawConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY?.trim(),
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
    databaseURL: env.VITE_FIREBASE_DB_URL?.trim(),
    projectId: env.VITE_FIREBASE_PROJECT_ID?.trim(),
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
    appId: env.VITE_FIREBASE_APP_ID?.trim(),
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID?.trim(),
  };

  const missingKeys: string[] = [];

  if (isPlaceholderValue(rawConfig.apiKey)) missingKeys.push('VITE_FIREBASE_API_KEY');
  if (isPlaceholderValue(rawConfig.authDomain)) missingKeys.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (isPlaceholderValue(rawConfig.projectId)) missingKeys.push('VITE_FIREBASE_PROJECT_ID');
  if (isPlaceholderValue(rawConfig.storageBucket)) missingKeys.push('VITE_FIREBASE_STORAGE_BUCKET');
  if (isPlaceholderValue(rawConfig.messagingSenderId)) missingKeys.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
  if (isPlaceholderValue(rawConfig.appId)) missingKeys.push('VITE_FIREBASE_APP_ID');

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    config: rawConfig,
  };
}

export const firebaseValidation = validateFirebaseConfig();

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

if (firebaseValidation.isValid) {
  try {
    appInstance = !getApps().length ? initializeApp(firebaseValidation.config) : getApp();
    authInstance = getAuth(appInstance);
  } catch (err) {
    console.error('[Firebase Initialization Error]:', err);
  }
} else {
  console.warn(
    '[Firebase Config Warning] Firebase environment variables are missing or contain placeholder values. ' +
    'Missing variables:', firebaseValidation.missingKeys.join(', ')
  );
}

// Export singleton app and auth instances
export const app = appInstance as FirebaseApp;
export const auth = authInstance as Auth;

export default appInstance;
