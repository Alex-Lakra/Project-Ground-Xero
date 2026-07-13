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
const FIREBASE_URL = (import.meta.env.VITE_FIREBASE_DB_URL || '').trim();

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
// Public REST API / Simulation Interface
// ----------------------------------------------------
export const firebaseDb = {
  /**
   * Retrieves a user by their username
   */
  async getUser(username: string): Promise<SSHUser | null> {
    const key = username.toLowerCase();
    if (FIREBASE_URL) {
      try {
        const response = await fetch(`${FIREBASE_URL}/users/${key}.json`);
        if (!response.ok) throw new Error('Network error');
        const user = await response.json();
        
        // Auto-seed root in Firebase if the database is uninitialized
        if (!user && key === 'root') {
          const defaultRoot = SEED_USERS.root;
          await this.saveUser(defaultRoot);
          return defaultRoot;
        }
        
        return user || null;
      } catch (err) {
        console.warn('[Firebase DB] Connection failed, using LocalStorage fallback.', err);
      }
    }
    const localUsers = getLocalUsers();
    return localUsers[key] || null;
  },

  /**
   * Creates or updates a user record
   */
  async saveUser(user: SSHUser): Promise<void> {
    const key = user.username.toLowerCase();
    if (FIREBASE_URL) {
      try {
        const response = await fetch(`${FIREBASE_URL}/users/${key}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        if (response.ok) return;
      } catch (err) {
        console.warn('[Firebase DB] Save failed, using LocalStorage fallback.', err);
      }
    }
    const localUsers = getLocalUsers();
    localUsers[key] = user;
    saveLocalUsers(localUsers);
  },

  /**
   * Retrieves all users currently registered
   */
  async listAllUsers(): Promise<SSHUser[]> {
    if (FIREBASE_URL) {
      try {
        const response = await fetch(`${FIREBASE_URL}/users.json`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        if (data) {
          return Object.values(data) as SSHUser[];
        }
        return [];
      } catch (err) {
        console.warn('[Firebase DB] List failed, using LocalStorage fallback.', err);
      }
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

    if (FIREBASE_URL) {
      try {
        const response = await fetch(`${FIREBASE_URL}/users/${key}.json`, {
          method: 'DELETE',
        });
        if (response.ok) return true;
      } catch (err) {
        console.warn('[Firebase DB] Delete failed, using LocalStorage fallback.', err);
      }
    }
    const localUsers = getLocalUsers();
    if (localUsers[key]) {
      delete localUsers[key];
      saveLocalUsers(localUsers);
      return true;
    }
    return false;
  },

  /**
   * Helper to check if Firebase DB is active
   */
  isFirebaseConfigured(): boolean {
    return FIREBASE_URL.length > 0;
  },
};
