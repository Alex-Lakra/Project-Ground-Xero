export interface SSHUser {
  username: string;
  passwordHash: string; // Plain password for ease of inspectability in local simulation
  isPasswordChanged: boolean; // First login requires password reset
  is2faEnabled: boolean; // First login requires 2FA setup
  twoFactorSecret: string; // Authenticator app TOTP secret
}

// ----------------------------------------------------
// DB Provider Configurations
// ----------------------------------------------------
const PROJECT_ID = (import.meta.env.VITE_FIREBASE_PROJECT_ID || 'project-ground-xero').trim();
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Seed data: Root account with default password 'matrix'
const SEED_USERS: Record<string, SSHUser> = {
  root: {
    username: 'root',
    passwordHash: 'matrix',
    isPasswordChanged: false,
    is2faEnabled: false,
    twoFactorSecret: '',
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
  return JSON.parse(users);
};

const saveLocalUsers = (users: Record<string, SSHUser>) => {
  localStorage.setItem('ground_xero_ssh_users', JSON.stringify(users));
};

// ----------------------------------------------------
// Cloud Firestore Mapping Helpers
// ----------------------------------------------------
interface FirestoreField {
  stringValue?: string;
  booleanValue?: boolean;
}

function mapDocumentToUser(doc: any): SSHUser {
  const fields = doc.fields || {};
  return {
    username: fields.username?.stringValue || '',
    passwordHash: fields.passwordHash?.stringValue || '',
    isPasswordChanged: fields.isPasswordChanged?.booleanValue || false,
    is2faEnabled: fields.is2faEnabled?.booleanValue || false,
    twoFactorSecret: fields.twoFactorSecret?.stringValue || '',
  };
}

function mapUserToDocument(user: SSHUser) {
  return {
    fields: {
      username: { stringValue: user.username },
      passwordHash: { stringValue: user.passwordHash },
      isPasswordChanged: { booleanValue: user.isPasswordChanged },
      is2faEnabled: { booleanValue: user.is2faEnabled },
      twoFactorSecret: { stringValue: user.twoFactorSecret },
    }
  };
}

// ----------------------------------------------------
// Public REST API / Simulation Interface
// ----------------------------------------------------
let lastError: string | null = null;

export const firebaseDb = {
  /**
   * Helper to retrieve diagnostic state
   */
  getDiagnostics() {
    return {
      isFirebaseConfigured: true,
      lastError,
    };
  },

  /**
   * Retrieves a user by their username
   */
  async getUser(username: string): Promise<SSHUser | null> {
    const key = username.toLowerCase();
    try {
      const response = await fetch(`${FIRESTORE_BASE}/users/${key}`);
      if (response.status === 404) {
        // Auto-seed root in Firestore if it doesn't exist
        if (key === 'root') {
          const defaultRoot = SEED_USERS.root;
          await this.saveUser(defaultRoot);
          return defaultRoot;
        }
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} (${response.statusText || 'Forbidden/Locked rules'})`);
      }
      const doc = await response.json();
      lastError = null; // Reset error on successful query
      return mapDocumentToUser(doc);
    } catch (err: any) {
      lastError = err.message || String(err);
      console.warn('[Firestore DB] Connection failed, using LocalStorage fallback.', err);
    }
    const localUsers = getLocalUsers();
    return localUsers[key] || null;
  },

  /**
   * Creates or updates a user record
   */
  async saveUser(user: SSHUser): Promise<void> {
    const key = user.username.toLowerCase();
    try {
      const body = mapUserToDocument(user);
      const response = await fetch(`${FIRESTORE_BASE}/users/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} (${response.statusText || 'Forbidden/Locked rules'})`);
      }
      lastError = null;
      return;
    } catch (err: any) {
      lastError = err.message || String(err);
      console.warn('[Firestore DB] Save failed, using LocalStorage fallback.', err);
    }
    const localUsers = getLocalUsers();
    localUsers[key] = user;
    saveLocalUsers(localUsers);
  },

  /**
   * Retrieves all users currently registered
   */
  async listAllUsers(): Promise<SSHUser[]> {
    try {
      const response = await fetch(`${FIRESTORE_BASE}/users`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} (${response.statusText || 'Forbidden/Locked rules'})`);
      }
      const data = await response.json();
      lastError = null;
      if (data && data.documents) {
        return data.documents.map(mapDocumentToUser);
      }
      return [];
    } catch (err: any) {
      lastError = err.message || String(err);
      console.warn('[Firestore DB] List failed, using LocalStorage fallback.', err);
    }
    const localUsers = getLocalUsers();
    return Object.values(localUsers);
  },

  /**
   * Deletes a user by their username
   */
  async deleteUser(username: string): Promise<boolean> {
    const key = username.toLowerCase();
    if (key === 'root') return false; // Prevent admin deletion

    try {
      const response = await fetch(`${FIRESTORE_BASE}/users/${key}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} (${response.statusText || 'Forbidden/Locked rules'})`);
      }
      lastError = null;
      return true;
    } catch (err: any) {
      lastError = err.message || String(err);
      console.warn('[Firestore DB] Delete failed, using LocalStorage fallback.', err);
    }
    const localUsers = getLocalUsers();
    if (localUsers[key]) {
      delete localUsers[key];
      saveLocalUsers(localUsers);
      return true;
    }
    return false;
  },
};
