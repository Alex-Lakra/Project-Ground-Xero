import { db, rtdb, firebaseValidation, firebaseConfig } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  collection, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  ref, 
  get, 
  set, 
  remove, 
  child 
} from 'firebase/database';

export interface SSHUser {
  username: string;
  passwordHash: string; // Plain password for ease of inspectability in local simulation
  isPasswordChanged: boolean; // First login requires password reset
  is2faEnabled: boolean; // First login requires 2FA setup
  twoFactorSecret: string; // Authenticator app TOTP secret
  displayName?: string;
  statusBubble?: string;
  bioLink?: string;
  avatarUrl?: string;
  techStack?: string[];
  pronouns?: string;
  uid?: string;
  email?: string;
  friends?: string[];
  friendRequests?: string[];
  sentRequests?: string[];
  blockedUsers?: string[];
  privacySettings?: {
    hideFriendList: boolean;
    disableIncomingRequests: boolean;
  };
  leetcodeUrl?: string;
  codeforcesUrl?: string;
}

export const DEFAULT_GHOST_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" fill="%23050505"/><path d="M50 18C33 18 22 30 22 46v26h10v-6h12v6h12v-6h12v6h10V46c0-16-11-28-28-28z" fill="%23ff0033" opacity="0.85"/><circle cx="40" cy="42" r="5" fill="%23000"/><circle cx="60" cy="42" r="5" fill="%23000"/><circle cx="40" cy="42" r="2" fill="%23ff0033"/><circle cx="60" cy="42" r="2" fill="%23ff0033"/><path d="M36 56h28v3H36z" fill="%23ff0033"/></svg>`;

/**
 * Formats user input URLs to direct image CDN links (e.g. converting Google Drive share links)
 */
export function formatImageUrl(url?: string): string {
  if (!url) return DEFAULT_GHOST_AVATAR;
  const cleanUrl = url.trim();
  if (!cleanUrl) return DEFAULT_GHOST_AVATAR;

  // Transform Google Drive viewer URLs into direct CDN image URLs
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('drive.usercontent.google.com') || cleanUrl.includes('lh3.googleusercontent.com')) {
    const fileIdMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w500`;
    }
  }

  return cleanUrl;
}

// ----------------------------------------------------
// DB Provider Configurations
// ----------------------------------------------------
const PROJECT_ID = (firebaseConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || 'project-ground-xero').trim();
const DB_URL = (firebaseConfig.databaseURL || import.meta.env.VITE_FIREBASE_DB_URL || '').replace(/\/$/, '');
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Seed data: Root account with default password 'matrix'
const SEED_USERS: Record<string, SSHUser> = {
  root: {
    username: 'root',
    passwordHash: 'matrix',
    isPasswordChanged: false,
    is2faEnabled: false,
    twoFactorSecret: '',
    displayName: 'Alex_The_Gamer',
    statusBubble: '> Compiling kernel...',
    bioLink: 'https://github.com/AlexTheCoder/projects',
    avatarUrl: DEFAULT_GHOST_AVATAR,
    techStack: ['TS', 'REACT', 'NODE', 'PY'],
    pronouns: 'he/him',
    uid: '25UCOMP008',
    email: 'root@groundxero.local'
  },
};

// ----------------------------------------------------
// LocalStorage Repository (Fallback Mock)
// ----------------------------------------------------
const getLocalUsers = (): Record<string, SSHUser> => {
  const users = localStorage.getItem('ground_xero_ssh_users');
  if (!users) {
    localStorage.setItem('ground_xero_ssh_users', JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
  try {
    return JSON.parse(users);
  } catch (e) {
    return SEED_USERS;
  }
};

const saveLocalUsers = (users: Record<string, SSHUser>) => {
  localStorage.setItem('ground_xero_ssh_users', JSON.stringify(users));
};

let lastError: string | null = null;
let lastSuccessfulSync: number | null = null;

// Clean raw user object for Firebase Realtime DB and Firestore
function sanitizeUserForDb(user: SSHUser): Record<string, any> {
  return {
    username: user.username || '',
    passwordHash: user.passwordHash || '',
    isPasswordChanged: Boolean(user.isPasswordChanged),
    is2faEnabled: Boolean(user.is2faEnabled),
    twoFactorSecret: user.twoFactorSecret || '',
    displayName: user.displayName || '',
    statusBubble: user.statusBubble || '',
    bioLink: user.bioLink || '',
    avatarUrl: formatImageUrl(user.avatarUrl),
    techStack: Array.isArray(user.techStack) ? user.techStack : [],
    pronouns: user.pronouns || 'he/him',
    uid: user.uid || '',
    email: user.email || '',
    friends: Array.isArray(user.friends) ? user.friends : [],
    friendRequests: Array.isArray(user.friendRequests) ? user.friendRequests : [],
    sentRequests: Array.isArray(user.sentRequests) ? user.sentRequests : [],
    blockedUsers: Array.isArray(user.blockedUsers) ? user.blockedUsers : [],
    privacySettings: {
      hideFriendList: Boolean(user.privacySettings?.hideFriendList),
      disableIncomingRequests: Boolean(user.privacySettings?.disableIncomingRequests),
    },
    leetcodeUrl: user.leetcodeUrl || '',
    codeforcesUrl: user.codeforcesUrl || '',
    updatedAt: new Date().toISOString(),
  };
}

// ----------------------------------------------------
// Async Timeout Wrappers to Prevent UI Freezing
// ----------------------------------------------------
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 500, fallbackVal: T | null = null): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<T | null>((resolve) => setTimeout(() => resolve(fallbackVal), timeoutMs))
  ]).catch(() => fallbackVal);
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 500): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    return null;
  }
}

// ----------------------------------------------------
// Public Firebase Database Service
// ----------------------------------------------------
export const firebaseDb = {
  /**
   * Helper to retrieve diagnostic connection state for terminal and visualizers
   */
  getDiagnostics() {
    return {
      isFirebaseConfigured: firebaseValidation.isValid,
      projectId: PROJECT_ID,
      databaseURL: DB_URL,
      storageBucket: firebaseConfig.storageBucket || '',
      authDomain: firebaseConfig.authDomain || '',
      provider: rtdb ? 'Firebase Realtime Database & Firestore SDK' : (db ? 'Firebase Firestore SDK' : 'LocalStorage Simulation'),
      lastError,
      lastSuccessfulSync: lastSuccessfulSync ? new Date(lastSuccessfulSync).toLocaleTimeString() : null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    };
  },

  /**
   * Retrieves a user by their username or email
   */
  async getUserByEmailOrUsername(identifier: string): Promise<SSHUser | null> {
    const key = identifier.toLowerCase().trim();
    if (!key) return null;
    
    // Quick check root
    if (key === 'root') {
      const rootUser = await this.getUser('root');
      return rootUser || SEED_USERS.root;
    }

    // First try by username
    const userByUsername = await this.getUser(key);
    if (userByUsername) return userByUsername;

    // If not found, list all users and find by email
    const allUsers = await this.listAllUsers();
    return allUsers.find(u => u?.email?.toLowerCase() === key || u?.username?.toLowerCase() === key) || null;
  },

  /**
   * Retrieves a user by their username with fast timeout protection
   */
  async getUser(username: string): Promise<SSHUser | null> {
    const key = username.toLowerCase().trim();
    if (!key) return null;

    const localUsers = getLocalUsers();
    const localUser = localUsers[key] || (key === 'root' ? SEED_USERS.root : null);

    // 1. Try Firebase Realtime Database SDK (with 1.5s max timeout)
    if (rtdb) {
      try {
        const dbRef = ref(rtdb);
        const snapshot = await withTimeout(get(child(dbRef, `users/${key}`)), 500);
        if (snapshot && snapshot.exists()) {
          const val = snapshot.val();
          lastError = null;
          lastSuccessfulSync = Date.now();
          return {
            ...val,
            avatarUrl: formatImageUrl(val.avatarUrl),
          } as SSHUser;
        } else if (key === 'root' && (!snapshot || !snapshot.exists())) {
          // Auto-seed root in background
          this.saveUser(SEED_USERS.root).catch(() => {});
        }
      } catch (err: any) {
        lastError = err.message || String(err);
      }
    }

    // 2. Try Firestore SDK (with 1.5s max timeout)
    if (db) {
      try {
        const userDocRef = doc(db, 'users', key);
        const snap = await withTimeout(getDoc(userDocRef), 500);
        if (snap && snap.exists()) {
          const data = snap.data() as SSHUser;
          lastError = null;
          lastSuccessfulSync = Date.now();
          return {
            ...data,
            avatarUrl: formatImageUrl(data.avatarUrl),
          };
        }
      } catch (err: any) {
        lastError = err.message || String(err);
      }
    }

    // 3. Try Realtime Database REST API fallback (with 1.5s timeout)
    if (DB_URL) {
      try {
        const res = await fetchWithTimeout(`${DB_URL}/users/${key}.json`, {}, 500);
        if (res && res.ok) {
          const data = await res.json();
          if (data) {
            lastError = null;
            lastSuccessfulSync = Date.now();
            return {
              ...data,
              avatarUrl: formatImageUrl(data.avatarUrl),
            } as SSHUser;
          }
        }
      } catch (err: any) {
        lastError = err.message || String(err);
      }
    }

    // 4. Return local fallback
    return localUser;
  },

  /**
   * Creates or updates a user record across Firebase Realtime DB, Firestore, and LocalStorage
   */
  async saveUser(user: SSHUser): Promise<void> {
    const key = user.username.toLowerCase().trim();
    if (!key) return;
    const sanitized = sanitizeUserForDb(user);

    // 1. Immediately mirror to LocalStorage (0ms latency for UI)
    const localUsers = getLocalUsers();
    localUsers[key] = { ...user, avatarUrl: sanitized.avatarUrl };
    saveLocalUsers(localUsers);

    // 2. Sync to Realtime Database SDK in background (non-blocking)
    if (rtdb) {
      withTimeout(set(ref(rtdb, `users/${key}`), sanitized), 2000).then(() => {
        lastError = null;
        lastSuccessfulSync = Date.now();
      }).catch(() => {});
    }

    // 3. Sync to Firestore SDK in background (non-blocking)
    if (db) {
      withTimeout(setDoc(doc(db, 'users', key), sanitized, { merge: true }), 2000).then(() => {
        lastError = null;
        lastSuccessfulSync = Date.now();
      }).catch(() => {});
    }

    // 4. Realtime Database REST API sync in background
    if (DB_URL) {
      fetchWithTimeout(`${DB_URL}/users/${key}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized),
      }, 2000).catch(() => {});
    }
  },

  /**
   * Retrieves all users currently registered in the database
   */
  async listAllUsers(): Promise<SSHUser[]> {
    // 1. Realtime Database SDK
    if (rtdb) {
      try {
        const snapshot = await withTimeout(get(ref(rtdb, 'users')), 500);
        if (snapshot && snapshot.exists()) {
          const val = snapshot.val();
          lastError = null;
          lastSuccessfulSync = Date.now();
          const users = Object.values(val) as SSHUser[];
          return users.map(u => ({ ...u, avatarUrl: formatImageUrl(u.avatarUrl) }));
        }
      } catch (err: any) {
        lastError = err.message || String(err);
      }
    }

    // 2. Firestore SDK
    if (db) {
      try {
        const snapshot = await withTimeout(getDocs(collection(db, 'users')), 500);
        if (snapshot && !snapshot.empty) {
          const users: SSHUser[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as SSHUser;
            users.push({ ...data, avatarUrl: formatImageUrl(data.avatarUrl) });
          });
          lastError = null;
          lastSuccessfulSync = Date.now();
          return users;
        }
      } catch (err: any) {
        lastError = err.message || String(err);
      }
    }

    // 3. Realtime DB REST Fallback
    if (DB_URL) {
      try {
        const res = await fetchWithTimeout(`${DB_URL}/users.json`, {}, 500);
        if (res && res.ok) {
          const data = await res.json();
          if (data) {
            lastError = null;
            lastSuccessfulSync = Date.now();
            return (Object.values(data) as SSHUser[]).map(u => ({ ...u, avatarUrl: formatImageUrl(u.avatarUrl) }));
          }
        }
      } catch (err: any) {
        lastError = err.message || String(err);
      }
    }

    // 4. LocalStorage Fallback
    const localUsers = getLocalUsers();
    return Object.values(localUsers);
  },

  /**
   * Deletes a user by their username
   */
  async deleteUser(username: string): Promise<boolean> {
    const key = username.toLowerCase().trim();
    if (key === 'root') return false; // Prevent root deletion

    let deleted = false;

    // 1. Realtime Database
    if (rtdb) {
      try {
        await remove(ref(rtdb, `users/${key}`));
        deleted = true;
      } catch (e) {}
    }

    // 2. Firestore
    if (db) {
      try {
        await deleteDoc(doc(db, 'users', key));
        deleted = true;
      } catch (e) {}
    }

    // 3. Realtime DB REST
    if (DB_URL) {
      try {
        await fetch(`${DB_URL}/users/${key}.json`, { method: 'DELETE' });
        deleted = true;
      } catch (e) {}
    }

    // 4. LocalStorage
    const localUsers = getLocalUsers();
    if (localUsers[key]) {
      delete localUsers[key];
      saveLocalUsers(localUsers);
      deleted = true;
    }

    return deleted;
  },

  /**
   * Retrieves course progress for a given user
   */
  async getUserProgress(username: string): Promise<{ username: string; completedLessons: Record<string, string[]>; savedCourses: string[] }> {
    const key = (username || 'root').toLowerCase().trim();

    // 1. Realtime Database
    if (rtdb) {
      try {
        const snap = await get(ref(rtdb, `user_progress/${key}`));
        if (snap.exists()) {
          const val = snap.val();
          return {
            username: key,
            completedLessons: val.completedLessons || {},
            savedCourses: val.savedCourses || [],
          };
        }
      } catch (e) {}
    }

    // 2. Firestore
    if (db) {
      try {
        const snap = await getDoc(doc(db, 'user_progress', key));
        if (snap.exists()) {
          const val = snap.data();
          return {
            username: key,
            completedLessons: typeof val.completedLessonsJson === 'string' ? JSON.parse(val.completedLessonsJson) : (val.completedLessons || {}),
            savedCourses: typeof val.savedCoursesJson === 'string' ? JSON.parse(val.savedCoursesJson) : (val.savedCourses || []),
          };
        }
      } catch (e) {}
    }

    // 3. LocalStorage
    const local = localStorage.getItem(`ground_xero_progress_${key}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }

    return { username: key, completedLessons: {}, savedCourses: [] };
  },

  /**
   * Saves course progress for a given user
   */
  async saveUserProgress(progress: { username: string; completedLessons: Record<string, string[]>; savedCourses: string[] }): Promise<void> {
    const key = (progress.username || 'root').toLowerCase().trim();

    // 1. Realtime Database
    if (rtdb) {
      try {
        await set(ref(rtdb, `user_progress/${key}`), {
          username: key,
          completedLessons: progress.completedLessons || {},
          savedCourses: progress.savedCourses || [],
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {}
    }

    // 2. Firestore
    if (db) {
      try {
        await setDoc(doc(db, 'user_progress', key), {
          username: key,
          completedLessonsJson: JSON.stringify(progress.completedLessons || {}),
          savedCoursesJson: JSON.stringify(progress.savedCourses || []),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {}
    }

    // 3. LocalStorage
    localStorage.setItem(`ground_xero_progress_${key}`, JSON.stringify(progress));
  },

  /**
   * Automatically fetches video metadata via YouTube oEmbed API and caches it in Firebase Realtime DB / Firestore / LocalStorage
   */
  async fetchAndSaveVideoMetadata(videoId: string): Promise<{ videoId: string; title: string; authorName: string; authorUrl: string; thumbnailUrl: string } | null> {
    const key = videoId.trim();
    if (!key) return null;

    // 1. Check Realtime DB cache
    if (rtdb) {
      try {
        const snap = await get(ref(rtdb, `video_metadata/${key}`));
        if (snap.exists()) {
          return snap.val();
        }
      } catch (e) {}
    }

    // 2. Check Firestore cache
    if (db) {
      try {
        const snap = await getDoc(doc(db, 'video_metadata', key));
        if (snap.exists()) {
          return snap.data() as any;
        }
      } catch (e) {}
    }

    // 3. Fetch live metadata via YouTube oEmbed API
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${key}&format=json`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        const meta = {
          videoId: key,
          title: data.title || '',
          authorName: data.author_name || '',
          authorUrl: data.author_url || '',
          thumbnailUrl: data.thumbnail_url || `https://i.ytimg.com/vi/${key}/hqdefault.jpg`,
        };

        // Save to Realtime Database
        if (rtdb) {
          try {
            await set(ref(rtdb, `video_metadata/${key}`), meta);
          } catch (e) {}
        }

        // Save to Firestore
        if (db) {
          try {
            await setDoc(doc(db, 'video_metadata', key), meta, { merge: true });
          } catch (e) {}
        }

        // Save to LocalStorage fallback
        localStorage.setItem(`ground_xero_video_meta_${key}`, JSON.stringify(meta));
        return meta;
      }
    } catch (err: any) {
      console.warn('[Firebase DB] fetchAndSaveVideoMetadata oEmbed error', err);
    }

    // LocalStorage fallback
    const local = localStorage.getItem(`ground_xero_video_meta_${key}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }

    return null;
  },
};

