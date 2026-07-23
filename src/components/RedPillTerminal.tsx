import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TermIcon, Eye, Settings } from 'lucide-react';
import DigitalRain from './DigitalRain';
import { firebaseDb, SSHUser } from '../services/firebaseDb';
import { QRCodeSVG } from 'qrcode.react';
import ProfileCard from './ProfileCard';

interface RedPillTerminalProps {
  onOpenSettings?: () => void;
  onExit?: () => void;
}

export default function RedPillTerminal({ onOpenSettings, onExit }: RedPillTerminalProps) {
  // ==========================================
  // State Definitions
  // ==========================================

  // Navigation State
  const [currentTab, setCurrentTab] = useState<'terminal' | 'rain'>('terminal');

  // Input & Command States
  const [cliInput, setCliInput] = useState('');

  // SSH Mainframe Login and Session States
  const [sshState, setSshState] = useState<'none' | 'ssh_password' | 'ssh_new_password' | 'ssh_confirm_password' | 'ssh_2fa_setup' | 'ssh_2fa_verify' | 'logged_in' | 'leetcode_setup' | 'codeforces_setup'>('none');
  const [sshPrevState, setSshPrevState] = useState<'none' | 'logged_in'>('none');
  const [sshUser, setSshUser] = useState('');
  const [sshSessionUser, setSshSessionUser] = useState<SSHUser | null>(null);
  const [sshTempPassword, setSshTempPassword] = useState('');
  const [ssh2faSecret, setSsh2faSecret] = useState('');

  // Profile Card Panel Visibility & Customization State
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [localGuestProfile, setLocalGuestProfile] = useState<SSHUser>(() => {
    const saved = localStorage.getItem('ground_xero_guest_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      username: 'guest',
      passwordHash: '',
      isPasswordChanged: true,
      is2faEnabled: false,
      twoFactorSecret: '',
      displayName: 'Alex_The_Gamer',
      statusBubble: '> Compiling kernel...',
      bioLink: 'https://github.com/AlexTheCoder/projects',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6GitQ1FgotQ3ZRvpwtA7OqLnbSM252dmUg6zl6vacllhND-FyKowiKAvD-KfIxqHPTZusmImpUcMM1zyjLPrMIu3X0Sg4K8-YMGLjSFmCf-Ydkd-Ns8lMotlwgkFYjL6eyuVEDUU86zsPW2XaTj2XG2e4kgiqwNLkcoChnDEnvzybiRiCOWTYWaY1LsW7fEv1THKeamH1MreFDxqSojSNVDIsg4I4plkwXMfGVUQ7CaVxaBXanodGmOdz642Fqw48UnHYE84PtV77',
      techStack: ['TS', 'REACT', 'NODE'],
      pronouns: 'he/him',
      uid: '25UCOMP008',
    };
  });

  // Rain visualizer configuration State
  const [rainDensity, setRainDensity] = useState(1.2);
  const [cmatrixConfig, setCmatrixConfig] = useState<{ active: boolean, color: string }>({ active: false, color: '#00ff00' });

  // References for UI focus & scroll alignment
  const cliInputRef = useRef<HTMLInputElement | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Command history for up/down arrow navigation
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [draftCommand, setDraftCommand] = useState<string>('');

  // Terminal history logs
  const [terminalLogs, setTerminalLogs] = useState<(string | React.ReactNode)[]>([
    '█   █  █████  ████    ███',
    ' █ █   █      █   █  █   █ ',
    '  █    ████   ████   █   █ ',
    ' █ █   █      █  █   █   █ ',
    '█   █  █████  █   █   ███  ',
    ' ',
    '====================================================================================================================',
    `[SYSTEM]: LOGGED IN TO Ground_Xero SECURE NODE // OPERATOR CHANNEL ALIGNED`,
    `[SYSTEM]: CONNECTION INTRUSION STATUS: SECURE // DIRECT_BYPASS: OK // TIME: ${new Date().toLocaleTimeString()}`,
    '====================================================================================================================',
    ' ',
    'Type "help" to display available mainframe security bypass command operations.',
    ' '
  ]);



  // ==========================================
  // Hooks & Effects
  // ==========================================

  // Automatically scroll down when terminal logs buffer updates
  useEffect(() => {
    if (currentTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, currentTab]);

  // Auto-focus terminal command input when clicking anywhere on the screen
  useEffect(() => {
    const handleGlobalClick = () => {
      if (currentTab === 'terminal') {
        cliInputRef.current?.focus();
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [currentTab]);

  useEffect(() => {
    const handleCmatrixExit = (e: KeyboardEvent) => {
      if (!cmatrixConfig.active) return;
      if (e.key === 'q' || e.key === 'Q' || (e.key.toLowerCase() === 'c' && e.ctrlKey)) {
        e.preventDefault();
        setCmatrixConfig(prev => ({ ...prev, active: false }));
      }
    };
    if (cmatrixConfig.active) {
      document.addEventListener('keydown', handleCmatrixExit);
    }
    return () => document.removeEventListener('keydown', handleCmatrixExit);
  }, [cmatrixConfig.active]);



  // ==========================================
  // SSH Session Utilities
  // ==========================================

  // Generate standard 16-character Base32 secret key for Google Authenticator app
  const generate2faSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  // Decode Base32 string to Uint8Array for RFC 4226 / 6238 TOTP
  const decodeBase32 = (base32Str: string): Uint8Array => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const cleanStr = base32Str.toUpperCase().replace(/[\s-]/g, '');
    const bytes = new Uint8Array(Math.floor((cleanStr.length * 5) / 8));

    let buffer = 0;
    let bitsLeft = 0;
    let index = 0;

    for (let i = 0; i < cleanStr.length; i++) {
      const idx = alphabet.indexOf(cleanStr[i]);
      if (idx === -1) continue;

      buffer = (buffer << 5) | idx;
      bitsLeft += 5;

      if (bitsLeft >= 8) {
        bytes[index++] = (buffer >> (bitsLeft - 8)) & 0xff;
        bitsLeft -= 8;
        buffer &= (1 << bitsLeft) - 1;
      }
    }
    return bytes;
  };

  // Verify standard TOTP using pure JS SHA1/HMAC-SHA1 (fully compatible with Google Authenticator, immune to secure-context locks)
  const verifyTOTP = async (secret: string, inputOtp: string): Promise<boolean> => {
    // Standard developer bypass code
    if (inputOtp === '123456') return true;

    // Tiny SHA-1 hashing algorithm in pure JS
    const sha1 = (buffer: Uint8Array): Uint8Array => {
      const blocks = new Uint32Array(((buffer.length + 8) >> 6) + 1 << 4);
      for (let i = 0; i < buffer.length; i++) {
        blocks[i >> 2] |= buffer[i] << (24 - (i % 4) * 8);
      }
      blocks[buffer.length >> 2] |= 0x80 << (24 - (buffer.length % 4) * 8);
      blocks[blocks.length - 1] = buffer.length * 8;

      let h0 = 0x67452301;
      let h1 = 0xEFCDAB89;
      let h2 = 0x98BADCFE;
      let h3 = 0x10325476;
      let h4 = 0xC3D2E1F0;

      const w = new Uint32Array(80);

      for (let i = 0; i < blocks.length; i += 16) {
        for (let j = 0; j < 16; j++) w[j] = blocks[i + j];
        for (let j = 16; j < 80; j++) {
          const val = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
          w[j] = (val << 1) | (val >>> 31);
        }

        let a = h0;
        let b = h1;
        let c = h2;
        let d = h3;
        let e = h4;

        for (let j = 0; j < 80; j++) {
          let f, k;
          if (j < 20) {
            f = (b & c) | (~b & d);
            k = 0x5A827999;
          } else if (j < 40) {
            f = b ^ c ^ d;
            k = 0x6ED9EBA1;
          } else if (j < 60) {
            f = (b & c) | (b & d) | (c & d);
            k = 0x8F1BBCDC;
          } else {
            f = b ^ c ^ d;
            k = 0xCA62C1D6;
          }

          const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[j]) | 0;
          e = d;
          d = c;
          c = (b << 30) | (b >>> 2);
          b = a;
          a = temp;
        }

        h0 = (h0 + a) | 0;
        h1 = (h1 + b) | 0;
        h2 = (h2 + c) | 0;
        h3 = (h3 + d) | 0;
        h4 = (h4 + e) | 0;
      }

      const result = new Uint8Array(20);
      for (let i = 0; i < 5; i++) {
        const val = [h0, h1, h2, h3, h4][i];
        result[i * 4] = (val >>> 24) & 0xff;
        result[i * 4 + 1] = (val >>> 16) & 0xff;
        result[i * 4 + 2] = (val >>> 8) & 0xff;
        result[i * 4 + 3] = val & 0xff;
      }
      return result;
    };

    // Standard HMAC-SHA-1 computation
    const hmacSha1 = (keyBytes: Uint8Array, msgBytes: Uint8Array): Uint8Array => {
      const blockBytes = new Uint8Array(64);
      if (keyBytes.length > 64) {
        blockBytes.set(sha1(keyBytes));
      } else {
        blockBytes.set(keyBytes);
      }

      const ipad = new Uint8Array(64);
      const opad = new Uint8Array(64);
      for (let i = 0; i < 64; i++) {
        ipad[i] = blockBytes[i] ^ 0x36;
        opad[i] = blockBytes[i] ^ 0x5c;
      }

      const innerMsg = new Uint8Array(64 + msgBytes.length);
      innerMsg.set(ipad);
      innerMsg.set(msgBytes, 64);
      const innerHash = sha1(innerMsg);

      const outerMsg = new Uint8Array(64 + 20);
      outerMsg.set(opad);
      outerMsg.set(innerHash, 64);
      return sha1(outerMsg);
    };

    try {
      const cleanSecret = secret.toUpperCase().replace(/[\s-]/g, '');
      const keyBytes = decodeBase32(cleanSecret);

      const currentTimeStep = Math.floor(Date.now() / 1000 / 30);

      // Look checking range [-4, 4] to account for clock time drifts
      for (let drift = -4; drift <= 4; drift++) {
        const timeStep = currentTimeStep + drift;
        const msg = new Uint8Array(8);
        let temp = timeStep;
        for (let i = 7; i >= 0; i--) {
          msg[i] = temp & 0xff;
          temp = Math.floor(temp / 256);
        }

        const hmac = hmacSha1(keyBytes, msg);

        const offset = hmac[19] & 0xf;
        const codeBin =
          ((hmac[offset] & 0x7f) << 24) |
          ((hmac[offset + 1] & 0xff) << 16) |
          ((hmac[offset + 2] & 0xff) << 8) |
          (hmac[offset + 3] & 0xff);

        const calculatedOtp = (codeBin % 1000000).toString().padStart(6, '0');
        if (calculatedOtp === inputOtp) {
          return true;
        }
      }
    } catch (e) {
      console.error('Error verifying TOTP:', e);
    }
    return false;
  };



  // Extract username from profile URL
  const extractUsername = (profileUrl: string): string => {
    const trimmed = profileUrl.trim();
    try {
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        const urlObj = new URL(trimmed);
        const parts = urlObj.pathname.split("/").filter(Boolean);
        if (parts.length > 0) {
          return parts[parts.length - 1];
        }
      }
    } catch (e) {
      // ignore, fall through to default extraction
    }
    return trimmed.replace(/\/$/, "").split("/").pop() || trimmed;
  };

  // Fetch stats and print to terminal logs
  const fetchStatsAndPrint = async (username: string) => {
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error');
      }

      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => [
          ...prev,
          ` `,
          `--- Problem Solved Stats for ${username} ---`,
          `Easy:   ${data.stats.easy}`,
          `Medium: ${data.stats.medium}`,
          `Hard:   ${data.stats.hard}`,
          ` `,
          `--- Top Recent Accepted Submissions ---`,
          ...(data.recent.length === 0 
            ? ['No recent submissions found. (Profile might be private or DOM structure changed)']
            : data.recent.map((sub: string, index: number) => `${index + 1}. ${sub}`)),
          ` `
        ]);
      } else {
        throw new Error('Response unsuccessful');
      }
    } catch (error: any) {
      setTerminalLogs(prev => [
        ...prev,
        `[ERROR] Failed to fetch LeetCode data: ${error.message}`
      ]);
    }
  };

  // Fetch Codeforces stats and print to terminal logs
  const fetchCodeforcesStatsAndPrint = async (username: string) => {
    try {
      const response = await fetch('/api/scrape-codeforces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error');
      }

      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => [
          ...prev,
          ` `,
          `--- Codeforces Stats for ${username} ---`,
          `Problems Solved: ${data.stats.solved}`,
          ` `,
          `--- Top Recent Accepted Submissions ---`,
          ...(data.recent.length === 0 
            ? ['No recent submissions found.']
            : data.recent.map((sub: string, index: number) => `${index + 1}. ${sub}`)),
          ` `
        ]);
      } else {
        throw new Error('Response unsuccessful');
      }
    } catch (error: any) {
      setTerminalLogs(prev => [
        ...prev,
        `[ERROR] Failed to fetch Codeforces data: ${error.message}`
      ]);
    }
  };

  // ==========================================
  // CLI Command Logic
  // ==========================================

  const handleExecuteCliCommand = async () => {
    const cmd = cliInput.trim();
    if (!cmd) return;

    setCliInput('');

    // Print command line representation in history logs
    // (If in password/sensitive state, print masked dots instead of raw passwords)
    const isSensitive = sshState === 'ssh_password' || sshState === 'ssh_new_password' || sshState === 'ssh_confirm_password';
    const logPrefix = sshState === 'logged_in'
      ? `${sshSessionUser?.username}@zero:~$`
      : (sshState === 'none' ? 'root/ $' : `[SSH INPUT]`);

    const displayCmd = isSensitive ? '•'.repeat(Math.min(cmd.length, 12)) : cmd;
    setTerminalLogs(prev => [...prev, `${logPrefix} ${displayCmd}`]);

    if (!isSensitive && cmd) {
      setCommandHistory(prev => {
        if (prev[prev.length - 1] !== cmd) {
          return [...prev, cmd];
        }
        return prev;
      });
      setHistoryIndex(-1);
      setDraftCommand('');
    }

    // ----------------------------------------------------
    // STATE: NONE (Local terminal mode)
    // ----------------------------------------------------
    const parts = cmd.split(' ');
    const base = parts[0].toLowerCase();

    // Global Commands (Work in any state)
    if (base === 'clear' || base === 'cls') {
      setTerminalLogs(['[LOCAL BUFFER CACHE ERASED]']);
      return;
    }

    // Global Profile Commands (Work in local shell or SSH session)
    if (base === 'profile' || base === 'rename' || base === 'about' || base === 'addstack' || base === 'repo' || base === 'profpic' || base === 'clearstack') {
      if (base === 'profile') {
        setShowProfile(prev => !prev);
        setTerminalLogs(prev => [
          ...prev,
          ' ',
          '======================================================',
          '[SYSTEM]: OPERATOR MAINFRAME PROFILE PANEL TOGGLED',
          '======================================================',
          'Profile matrix displayed on the right viewport panel.',
          ' ',
          'Available Profile Customization Commands:',
          '  rename <display_name>   - Update operator display name.',
          '  about <status>          - Update status bubble / bio message.',
          '  addstack <tech>         - Add tech stack tag (e.g. TS, REACT, NODE, PY).',
          '  repo <url>              - Update repository / GitHub URL.',
          '  profpic <url>           - Update avatar profile picture URL.',
          '  clearstack              - Clear all tech stack tags.',
          ' '
        ]);
        return;
      }

      if (base === 'rename') {
        const newName = cmd.slice(6).trim();
        if (!newName) {
          setTerminalLogs(prev => [...prev, 'Usage: rename <display_name>']);
          return;
        }

        if (sshSessionUser) {
          const updated = { ...sshSessionUser, displayName: newName };
          setSshSessionUser(updated);
          await firebaseDb.saveUser(updated);
        }
        setLocalGuestProfile(prev => {
          const updated = { ...prev, displayName: newName };
          localStorage.setItem('ground_xero_guest_profile', JSON.stringify(updated));
          return updated;
        });

        setShowProfile(true);
        setTerminalLogs(prev => [...prev, `[SUCCESS] Profile display name updated to "${newName}" (Synced with Database).`]);
        return;
      }

      if (base === 'about') {
        const newStatus = cmd.slice(5).trim();
        if (!newStatus) {
          setTerminalLogs(prev => [...prev, 'Usage: about <status_text_or_bio>']);
          return;
        }

        if (sshSessionUser) {
          const updated = { ...sshSessionUser, statusBubble: newStatus };
          setSshSessionUser(updated);
          await firebaseDb.saveUser(updated);
        }
        setLocalGuestProfile(prev => {
          const updated = { ...prev, statusBubble: newStatus };
          localStorage.setItem('ground_xero_guest_profile', JSON.stringify(updated));
          return updated;
        });

        setShowProfile(true);
        setTerminalLogs(prev => [...prev, `[SUCCESS] Profile status bubble updated to "> ${newStatus}" (Synced with Database).`]);
        return;
      }

      if (base === 'addstack') {
        const tech = cmd.slice(8).trim().toUpperCase();
        if (!tech) {
          setTerminalLogs(prev => [...prev, 'Usage: addstack <tech_name> (e.g. TS, REACT, NODE, PYTHON)']);
          return;
        }

        if (sshSessionUser) {
          const currentStack = sshSessionUser.techStack || [];
          const updatedStack = currentStack.includes(tech) ? currentStack : [...currentStack, tech];
          const updated = { ...sshSessionUser, techStack: updatedStack };
          setSshSessionUser(updated);
          await firebaseDb.saveUser(updated);
        }
        setLocalGuestProfile(prev => {
          const currentStack = prev.techStack || [];
          const updatedStack = currentStack.includes(tech) ? currentStack : [...currentStack, tech];
          const updated = { ...prev, techStack: updatedStack };
          localStorage.setItem('ground_xero_guest_profile', JSON.stringify(updated));
          return updated;
        });

        setShowProfile(true);
        setTerminalLogs(prev => [...prev, `[SUCCESS] Added '${tech}' to profile tech stack (Synced with Database).`]);
        return;
      }

      if (base === 'repo') {
        const newRepo = cmd.slice(4).trim();
        if (!newRepo) {
          setTerminalLogs(prev => [...prev, 'Usage: repo <url> (e.g. https://github.com/username/project)']);
          return;
        }

        if (sshSessionUser) {
          const updated = { ...sshSessionUser, bioLink: newRepo };
          setSshSessionUser(updated);
          await firebaseDb.saveUser(updated);
        }
        setLocalGuestProfile(prev => {
          const updated = { ...prev, bioLink: newRepo };
          localStorage.setItem('ground_xero_guest_profile', JSON.stringify(updated));
          return updated;
        });

        setShowProfile(true);
        setTerminalLogs(prev => [...prev, `[SUCCESS] Profile repository URL set to ${newRepo} (Synced with Database).`]);
        return;
      }

      if (base === 'profpic') {
        const newPic = cmd.slice(7).trim();
        if (!newPic) {
          setTerminalLogs(prev => [...prev, 'Usage: profpic <image_url>']);
          return;
        }

        if (sshSessionUser) {
          const updated = { ...sshSessionUser, avatarUrl: newPic };
          setSshSessionUser(updated);
          await firebaseDb.saveUser(updated);
        }
        setLocalGuestProfile(prev => {
          const updated = { ...prev, avatarUrl: newPic };
          localStorage.setItem('ground_xero_guest_profile', JSON.stringify(updated));
          return updated;
        });

        setShowProfile(true);
        setTerminalLogs(prev => [...prev, `[SUCCESS] Profile picture URL updated (Synced with Database).`]);
        return;
      }

      if (base === 'clearstack') {
        if (sshSessionUser) {
          const updated = { ...sshSessionUser, techStack: [] };
          setSshSessionUser(updated);
          await firebaseDb.saveUser(updated);
        }
        setLocalGuestProfile(prev => {
          const updated = { ...prev, techStack: [] };
          localStorage.setItem('ground_xero_guest_profile', JSON.stringify(updated));
          return updated;
        });

        setShowProfile(true);
        setTerminalLogs(prev => [...prev, `[SUCCESS] Profile tech stack cleared (Synced with Database).`]);
        return;
      }
    }

    // ----------------------------------------------------
    // STATE: LEETCODE_SETUP
    // ----------------------------------------------------
    if (sshState === 'leetcode_setup') {
      const url = cmd.trim();
      if (!url) {
        const currentUrl = localStorage.getItem(`leetcode_url_${sshSessionUser?.username || 'global'}`);
        if (currentUrl) {
          setTerminalLogs(prev => [...prev, `Kept current profile URL.`]);
        } else {
          setTerminalLogs(prev => [...prev, `[ERROR] URL cannot be empty. Setup aborted.`]);
        }
        setSshState(sshPrevState);
        return;
      }

      localStorage.setItem(`leetcode_url_${sshSessionUser?.username || 'global'}`, url);
      const username = extractUsername(url);
      setTerminalLogs(prev => [
        ...prev,
        `[SUCCESS] LeetCode profile URL saved.`,
        `Extracted username: ${username}`,
        `You can now type "leet" to fetch your solved questions stats!`
      ]);
      setSshState(sshPrevState);
      return;
    }

    // ----------------------------------------------------
    // STATE: CODEFORCES_SETUP
    // ----------------------------------------------------
    if (sshState === 'codeforces_setup') {
      const url = cmd.trim();
      if (!url) {
        const currentUrl = localStorage.getItem(`codeforces_url_${sshSessionUser?.username || 'global'}`);
        if (currentUrl) {
          setTerminalLogs(prev => [...prev, `Kept current profile/handle.`]);
        } else {
          setTerminalLogs(prev => [...prev, `[ERROR] Handle/URL cannot be empty. Setup aborted.`]);
        }
        setSshState(sshPrevState);
        return;
      }

      localStorage.setItem(`codeforces_url_${sshSessionUser?.username || 'global'}`, url);
      const username = extractUsername(url);
      setTerminalLogs(prev => [
        ...prev,
        `[SUCCESS] Codeforces handle/URL saved.`,
        `Extracted handle: ${username}`,
        `You can now type "codef" to fetch your Codeforces stats!`
      ]);
      setSshState(sshPrevState);
      return;
    }

    if (sshState === 'none') {

      // Help command
      if (base === 'help' || base === '?') {
        setTerminalLogs(prev => [
          ...prev,
          ' ',
          'Ground_Xero COGNITIVE CORE BYPASS CONSOLE',
          '==========================================',
          'help / ?                    - List active terminal operations.',
          'clear / cls                 - Erase local console logs buffer cache.',
          'fastfetch                   - Display system information and diagnostics.',
          'cmatrix                     - Enter full screen matrix rain visualizer mode.',
          'profile                     - Toggle operator profile card on right side.',
          'rename <name>               - Update display name.',
          'about <status>              - Update status bubble message.',
          'addstack <tech>             - Add tech stack tag (TS, REACT, NODE, etc.).',
          'repo <url>                  - Update repository link.',
          'profpic <url>               - Update avatar profile picture URL.',
          'ssh user@zero               - SSH tunnel into the zero server node.',
          '/leet                       - Configure LeetCode profile (requires login).',
          'leet                        - View LeetCode solved stats (requires login).',
          '/codef                      - Configure Codeforces profile (requires login).',
          'codef                       - View Codeforces solved stats (requires login).',
          'exit / ctrl+c / blue        - Return to Morpheus, escape reality (take Blue Pill).',
          ' '
        ]);
        return;
      }

      // LeetCode & Codeforces commands check - require login
      if (base === '/leet' || base === 'leet' || base === '/codef' || base === 'codef') {
        setTerminalLogs(prev => [
          ...prev,
          `[ERROR] You must be logged in to zero to use this command.`,
          `Please use "ssh root@zero" (pass: matrix) to connect and authenticate first.`
        ]);
        return;
      }

      // Fastfetch command
      if (base === 'fastfetch') {
        const os = navigator.platform || 'Unknown OS';
        const ua = navigator.userAgent.toLowerCase();
        const browser = ua.includes('chrome') ? 'Chrome' :
          ua.includes('firefox') ? 'Firefox' :
            ua.includes('safari') ? 'Safari' :
              ua.includes('edge') ? 'Edge' : 'Unknown Browser';
        const resolution = `${window.screen.width}x${window.screen.height}`;
        const cpuCores = navigator.hardwareConcurrency || 'Unknown';
        const memory = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Unknown';
        const language = navigator.language || 'Unknown';
        const uptime = 'System Online';

        const fastfetchArt = [
          '                                                  ',
          '                              ▒         ▒▒        ',
          '                        ▒▒░▒  ▒▒        ▒▒ ▒      ',
          '                             ▒▒▒▒                 ',
          '                             ▒▒▒▒▒▒ ▒             ',
          '                            ▒▒▒▒    ▒             ',
          '                            ▒▒  ▒                 ',
          '                           ▒▒▒▒ ▒ ▒▒▒▒░       ▒░  ',
          '                          ▒▒▒▒▒▒▒▒▒▒▒▒▒        ░  ',
          '                           ▒▒▒▒▒▒▒▒▒▒▒░      ▒    ',
          '                           ▒▒▒▒▒▒▒▒▒▒▒▒      ▒    ',
          '                           ▒▒▒▒▒▒▒▒▒▒▒▒▒          ',
          '                            ▒▒▒▒▒▒▒▒▒▒▒▒          ',
          '                    ▒▒▒     ▒▒▒▒▒ ▒▒▒▒▒▒          ',
          '                 ▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒           ',
          '             ▒▒▒▒▒▒   ▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒             ',
          '              ▒▒▒▒     ▒▒▒▒░ ▒▒▒▒▒▒    ▒          ',
          '               ▒▒▒▒▒▒▒▒▒▒            ▒▒▒          ',
          '               ▒▒ ▒▒▒▒▒▒           ░▒▒▒           ',
          '                 ▒                                ',
          '                  ▒▒▒▒▒▒               ▒          ',
          '                  ▒▒▒▒▒▒▒▒▒     ░▒▒▒▒▒▒▒▒         ',
          '                  ▒     ▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒',
          '                   ▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒▒▒',
          '              ▒▒▒▒▒▒▒▒▒▒▒▒▒   ░▒▒░ ▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒',
          '               ▒▒ ░▒▒▒▒▒▒▒▒ ░▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒'
        ];

        const username = sshSessionUser?.username || 'root';
        const info = [
          `${username}@zero`,
          `---------`,
          `OS         : ${os}`,
          `Browser    : ${browser}`,
          `Resolution : ${resolution}`,
          `CPU Cores  : ${cpuCores}`,
          `Memory     : ${memory}`,
          `Language   : ${language}`,
          `Status     : ${uptime}`,
        ];

        const outputLines = [...fastfetchArt];
        const infoStartIndex = 8;

        info.forEach((inf, idx) => {
          if (outputLines[infoStartIndex + idx]) {
            outputLines[infoStartIndex + idx] += `   ${inf}`;
          }
        });

        setTerminalLogs(prev => [...prev, ...outputLines, ' ']);
        return;
      }

      // Cmatrix command
      if (base === 'cmatrix') {
        let showHelp = false;
        let color = '#00ff00';

        for (let i = 1; i < parts.length; i++) {
          const flag = parts[i].toLowerCase();

          if (flag === '-h' || flag === '-help') {
            showHelp = true;
          }

          if ((flag === '-c' || flag === '-color') && parts[i + 1]) {
            // Support quotes around hex codes
            color = parts[i + 1].replace(/['"]/g, '');
            // Simple hex validation
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
              color = '#00ff00';
            }
            i++; // skip next since it was consumed as color argument
          }
        }

        if (showHelp) {
          setTerminalLogs(prev => [
            ...prev,
            ' ',
            'Usage: cmatrix [OPTIONS]',
            ' ',
            'A full-screen terminal visualizer simulating the Matrix digital rain.',
            ' ',
            'Options:',
            '  -h, -help                   Show this help message and exit.',
            '  -c, -color <HEX_CODE>       Set the rain color using a valid hex code (e.g., #ff0033).',
            '                              Defaults to #00ff00 (green).',
            ' ',
            'Navigation:',
            '  Press "q" anytime while visualizer is active to exit.',
            ' '
          ]);
          return;
        }

        setCmatrixConfig({ active: true, color });
        return;
      }

      // Exit constructor
      if (base === 'exit' || base === 'blue') {
        setTerminalLogs(prev => [...prev, ' ', '>> DETACHING NEURAL COUPLING SYSTEM...', '>> RE-INJECTING COGNITIVE COMFORT BUFFER...']);
        setTimeout(() => {
          onExit?.();
        }, 700);
        return;
      }

      // SSH Trigger command matching user@zero
      if (base === 'ssh') {
        const hasHelp = parts.some(p => p.toLowerCase() === '-h' || p.toLowerCase() === '-help');
        if (hasHelp) {
          setTerminalLogs(prev => [
            ...prev,
            ' ',
            'Usage: ssh [OPTIONS] user@host',
            ' ',
            'Establish an authenticated Secure Shell connection to a specified node.',
            ' ',
            'Options:',
            '  -h, -help                   Show this help message and exit.',
            ' ',
            'Example:',
            '  ssh root@zero               Connects to the "zero" mainframe node as "root".',
            ' '
          ]);
          return;
        }

        const sshMatch = cmd.match(/^ssh\s+([a-zA-Z0-9_-]+)@([a-zA-Z0-9._-]+)$/i);
        if (sshMatch) {
          const username = sshMatch[1];
          const host = sshMatch[2].toLowerCase();

          if (host !== 'zero') {
            setTerminalLogs(prev => [...prev, `ssh: Could not resolve hostname ${host}: Name or service not known`]);
            return;
          }

          setTerminalLogs(prev => [
            ...prev,
            `Connecting to server '${host}'...`,
            `Establishing secure user-session handshake...`
          ]);

          // Fetch user from DB first to verify existence
          const userObj = await firebaseDb.getUser(username);

          const diag = firebaseDb.getDiagnostics();
          let dbStatus = '';
          if (diag.isFirebaseConfigured) {
            if (diag.lastError) {
              dbStatus = `[Handshake]: Firestore DB connection failed (${diag.lastError}). Falling back to LocalStorage.`;
            } else {
              dbStatus = `[Handshake]: Routing session requests to remote Firestore DB.`;
            }
          } else {
            dbStatus = `[Handshake]: No environment URL found. Routing session to LocalStorage simulation.`;
          }

          setTerminalLogs(prev => [...prev, dbStatus]);

          if (!userObj) {
            setTerminalLogs(prev => [...prev, `ssh: ${username}@zero: User account does not exist in the database.`]);
            return;
          }

          setTerminalLogs(prev => [...prev, `${username}@${host}'s password: `]);
          setSshUser(username);
          setSshState('ssh_password');
          return;
        }

        setTerminalLogs(prev => [...prev, `command not found: "${cmd}"`]);
        return;
      }

      setTerminalLogs(prev => [...prev, `command not found: "${cmd}"`]);
      return;
    }

      // ----------------------------------------------------
      // STATE: SSH_PASSWORD (Login authentication check)
      // ----------------------------------------------------
      if (sshState === 'ssh_password') {
        const userObj = await firebaseDb.getUser(sshUser);

        if (userObj && userObj.passwordHash === cmd) {
          setSshSessionUser(userObj);

          // Check if mandatory first login password reset is needed
          if (!userObj.isPasswordChanged) {
            setTerminalLogs(prev => [
              ...prev,
              `Authentication Approved.`,
              `[MANDATORY PROTOCOL]: First login detected. You must change your default password.`,
              `Enter new password:`
            ]);
            setSshState('ssh_new_password');
            return;
          }

          // Check if 2FA enrollment is completed
          if (!userObj.is2faEnabled) {
            const secret = generate2faSecret();
            const updatedUser = { ...userObj, twoFactorSecret: secret };
            await firebaseDb.saveUser(updatedUser);
            setSshSessionUser(updatedUser);
            setSsh2faSecret(secret);
            setSshState('ssh_2fa_setup');

            setTerminalLogs(prev => [
              ...prev,
              `Authentication Approved.`,
              `[MANDATORY PROTOCOL]: 2FA Authenticator setup is required.`,
              `----------------------------------------------------`,
              `1. Open Google Authenticator or another TOTP application.`,
              `2. Scan the generated QR Code below, OR add the custom key manually:`,
              `   Key (Raw): ${secret}`,
              `   Key (Formatted): ${secret.match(/.{1,4}/g)?.join(' ') || secret}`,
              `3. Enter the 6-digit active verification OTP below to enroll.`,
              `[TESTING OPTION]: Enter "123456" to bypass.`,
              `----------------------------------------------------`,
              `Enter 2FA OTP Code:`
            ]);
            return;
          }

          // Else, ask for standard 2FA OTP verification code
          setSshState('ssh_2fa_verify');
          setTerminalLogs(prev => [
            ...prev,
            `Enter 2FA Code (OTP) for verification:`,
            `[TESTING OPTION]: Enter "123456" to bypass.`
          ]);
        } else {
          setTerminalLogs(prev => [...prev, `Permission denied, please try again.`]);
          setSshState('none');
          setSshUser('');
        }
        return;
      }

      // ----------------------------------------------------
      // STATE: SSH_NEW_PASSWORD (Mandatory reset entry)
      // ----------------------------------------------------
      if (sshState === 'ssh_new_password') {
        if (cmd.length < 4) {
          setTerminalLogs(prev => [...prev, `[ERROR] Password must be at least 4 characters. Enter new password:`]);
          return;
        }
        setSshTempPassword(cmd);
        setSshState('ssh_confirm_password');
        setTerminalLogs(prev => [...prev, `Confirm new password:`]);
        return;
      }

      // ----------------------------------------------------
      // STATE: SSH_CONFIRM_PASSWORD (Password match check)
      // ----------------------------------------------------
      if (sshState === 'ssh_confirm_password') {
        if (cmd !== sshTempPassword) {
          setTerminalLogs(prev => [...prev, `[ERROR] Passwords do not match. Enter new password:`]);
          setSshState('ssh_new_password');
          setSshTempPassword('');
          return;
        }

        const userObj = await firebaseDb.getUser(sshUser);
        if (!userObj) {
          setTerminalLogs(prev => [...prev, `[ERROR] User session error.`]);
          setSshState('none');
          return;
        }
        const updatedUser = { ...userObj, passwordHash: cmd, isPasswordChanged: true };

        // Setup 2FA secret now
        const secret = generate2faSecret();
        updatedUser.twoFactorSecret = secret;
        await firebaseDb.saveUser(updatedUser);

        setSshSessionUser(updatedUser);
        setSsh2faSecret(secret);
        setSshState('ssh_2fa_setup');

        setTerminalLogs(prev => [
          ...prev,
          `[SUCCESS] Password changed successfully.`,
          `[MANDATORY PROTOCOL]: 2FA Authenticator setup is required.`,
          `----------------------------------------------------`,
          `1. Open Google Authenticator or another TOTP application.`,
          `2. Add custom key (copy/paste): ${secret}`,
          `3. Key (Formatted): ${secret.match(/.{1,4}/g)?.join(' ') || secret}`,
          `4. Enter the 6-digit active verification OTP below to enroll.`,
          `----------------------------------------------------`,
          `Enter 2FA OTP Code:`
        ]);
        return;
      }

      // ----------------------------------------------------
      // STATE: SSH_2FA_SETUP (OTP enrollment validation)
      // ----------------------------------------------------
      if (sshState === 'ssh_2fa_setup') {
        const isOtpValid = await verifyTOTP(ssh2faSecret, cmd);
        if (isOtpValid) {
          const userObj = await firebaseDb.getUser(sshUser);
          if (userObj) {
            const updatedUser = { ...userObj, is2faEnabled: true };
            await firebaseDb.saveUser(updatedUser);
            setSshSessionUser(updatedUser);
            setSshState('logged_in');

            setTerminalLogs(prev => [
              ...prev,
              `[SUCCESS] Authenticator verified and enrolled successfully.`,
              ` `,
              `Welcome to zero mainframe // node: zero // user: ${sshUser}`,
              `Type 'help' to see authorized node operations.`,
              ` `
            ]);
          }
        } else {
          setTerminalLogs(prev => [...prev, `[ERROR] Invalid OTP verification code. Enter active code:`]);
        }
        return;
      }

      // ----------------------------------------------------
      // STATE: SSH_2FA_VERIFY (Subsequent OTP validations)
      // ----------------------------------------------------
      if (sshState === 'ssh_2fa_verify') {
        const isOtpValid = await verifyTOTP(sshSessionUser!.twoFactorSecret, cmd);
        if (isOtpValid) {
          setSshState('logged_in');
          setTerminalLogs(prev => [
            ...prev,
            `[SUCCESS] Verification successful. Access granted.`,
            ` `,
            `Welcome to zero mainframe // node: zero // user: ${sshUser}`,
            `Type 'help' to see authorized node operations.`,
            ` `
          ]);
        } else {
          setTerminalLogs(prev => [...prev, `Permission denied. SSH Connection Closed.`, ` `]);
          setSshState('none');
          setSshUser('');
          setSshSessionUser(null);
        }
        return;
      }

      // ----------------------------------------------------
      // STATE: LOGGED_IN (Zero SSH session active)
      // ----------------------------------------------------
      if (sshState === 'logged_in') {

        // Help CLI zero commands
        if (base === 'help' || base === '?') {
          const standardLogs = [
            ' ',
            'Zero Mainframe SSH Console Operations',
            '======================================',
            'whoami           - Display the current active user.',
            'passwd <new_pass> - Reset your active user password.',
            'profile          - Toggle operator profile matrix card on right side.',
            'rename <name>    - Update profile display name (saves to DB).',
            'about <status>   - Update profile status message (saves to DB).',
            'addstack <tech>  - Add tech stack item (saves to DB).',
            'repo <url>       - Update profile repository URL (saves to DB).',
            'profpic <url>    - Update profile picture URL (saves to DB).',
            '/leet            - Configure your LeetCode profile URL.',
            'leet             - View your LeetCode stats & recent submissions.',
            '/codef           - Configure your Codeforces profile URL/handle.',
            'codef            - View your Codeforces stats & recent submissions.',
            'logout / exit    - Terminate SSH session and exit to local shell.'
          ];

          if (sshSessionUser?.username === 'root') {
            standardLogs.push(
              'createuser <name> <pass>  - Create a new user with a default password.',
              'listusers                 - List all registered users and status.',
              'deleteuser <name>         - Remove a standard user account.',
              'reset2fa <username>       - Reset 2FA status and key for a user.',
              'resetpassword <user> <ps> - Reset another user\'s password (forces change on next login).'
            );
          }

          standardLogs.push(' ');
          setTerminalLogs(prev => [...prev, ...standardLogs]);
          return;
        }

        // /leet command
        if (base === '/leet') {
          const savedUrl = localStorage.getItem(`leetcode_url_${sshSessionUser?.username || 'global'}`);
          setSshPrevState(sshState);
          setSshState('leetcode_setup');
          if (savedUrl) {
            setTerminalLogs(prev => [
              ...prev,
              `Current LeetCode Profile: ${savedUrl}`,
              `Enter new LeetCode profile URL (or press Enter to cancel):`
            ]);
          } else {
            setTerminalLogs(prev => [
              ...prev,
              `Enter LeetCode profile URL (e.g., https://leetcode.com/u/username/):`
            ]);
          }
          return;
        }

        // leet command
        if (base === 'leet') {
          const savedUrl = localStorage.getItem(`leetcode_url_${sshSessionUser?.username || 'global'}`);
          if (!savedUrl) {
            setTerminalLogs(prev => [
              ...prev,
              `[ERROR] No LeetCode profile URL found in database.`,
              `Please run "/leet" first to set up your profile.`
            ]);
            return;
          }

          const username = extractUsername(savedUrl);
          setTerminalLogs(prev => [...prev, `Fetching LeetCode stats for ${username}...`]);
          fetchStatsAndPrint(username);
          return;
        }

        // /codef command
        if (base === '/codef') {
          const savedUrl = localStorage.getItem(`codeforces_url_${sshSessionUser?.username || 'global'}`);
          setSshPrevState(sshState);
          setSshState('codeforces_setup');
          if (savedUrl) {
            setTerminalLogs(prev => [
              ...prev,
              `Current Codeforces Profile/Handle: ${savedUrl}`,
              `Enter new Codeforces handle or profile URL (or press Enter to cancel):`
            ]);
          } else {
            setTerminalLogs(prev => [
              ...prev,
              `Enter Codeforces handle or profile URL (e.g. https://codeforces.com/profile/tourist):`
            ]);
          }
          return;
        }

        // codef command
        if (base === 'codef') {
          const savedUrl = localStorage.getItem(`codeforces_url_${sshSessionUser?.username || 'global'}`);
          if (!savedUrl) {
            setTerminalLogs(prev => [
              ...prev,
              `[ERROR] No Codeforces profile URL/handle found in database.`,
              `Please run "/codef" first to set up your profile.`
            ]);
            return;
          }

          const username = extractUsername(savedUrl);
          setTerminalLogs(prev => [...prev, `Fetching Codeforces stats for ${username}...`]);
          fetchCodeforcesStatsAndPrint(username);
          return;
        }

        // Whoami command
        if (base === 'whoami') {
          setTerminalLogs(prev => [...prev, sshSessionUser?.username || 'unknown']);
          return;
        }

        // User passwd/resetpassword command
        if (base === 'passwd' || base === 'resetpassword') {
          const isRoot = sshSessionUser?.username === 'root';
          const arg1 = parts[1];
          const arg2 = parts[2];

          if (isRoot && arg1 && arg2) {
            // Root resetting another user's password
            const targetUser = arg1;
            const newPassword = arg2;

            const targetObj = await firebaseDb.getUser(targetUser);
            if (targetObj) {
              const updatedUser = {
                ...targetObj,
                passwordHash: newPassword,
                isPasswordChanged: false // Force mandatory reset on next login
              };
              await firebaseDb.saveUser(updatedUser);
              setTerminalLogs(prev => [...prev, `[SUCCESS] Password reset successfully for user '${targetUser}'.`]);
            } else {
              setTerminalLogs(prev => [...prev, `[ERROR] User '${targetUser}' does not exist.`]);
            }
          } else {
            // Resetting self password
            const newPassword = arg1;
            if (!newPassword) {
              const usageMsg = isRoot 
                ? `Usage: passwd <new_password>  OR  resetpassword <username> <new_password>`
                : `Usage: passwd <new_password>`;
              setTerminalLogs(prev => [...prev, usageMsg]);
              return;
            }

            if (arg2 && !isRoot) {
              setTerminalLogs(prev => [...prev, `[ERROR] Permission denied: standard users can only change their own password.`]);
              return;
            }

            const userObj = await firebaseDb.getUser(sshUser);
            if (userObj) {
              const updatedUser = { ...userObj, passwordHash: newPassword, isPasswordChanged: true };
              await firebaseDb.saveUser(updatedUser);
              setSshSessionUser(updatedUser);
              setTerminalLogs(prev => [...prev, `[SUCCESS] Password changed successfully for user '${sshUser}'.`]);
            } else {
              setTerminalLogs(prev => [...prev, `[ERROR] User session error.`]);
            }
          }
          return;
        }

        // Exit SSH command
        if (base === 'exit' || base === 'logout') {
          setTerminalLogs(prev => [...prev, `Connection to zero closed.`, ` `]);
          setSshState('none');
          setSshUser('');
          setSshSessionUser(null);
          return;
        }

        // Admin createuser command
        if (base === 'createuser') {
          if (sshSessionUser?.username !== 'root') {
            setTerminalLogs(prev => [...prev, `zero-shell: Permission denied. root access required.`]);
            return;
          }

          const newUsername = parts[1];
          const defaultPassword = parts[2];

          if (!newUsername || !defaultPassword) {
            setTerminalLogs(prev => [...prev, `Usage: createuser <username> <default_password>`]);
            return;
          }

          const existing = await firebaseDb.getUser(newUsername);
          if (existing) {
            setTerminalLogs(prev => [...prev, `[ERROR] User account '${newUsername}' already exists.`]);
            return;
          }

          await firebaseDb.saveUser({
            username: newUsername,
            passwordHash: defaultPassword,
            isPasswordChanged: false,
            is2faEnabled: false,
            twoFactorSecret: '',
          });

          setTerminalLogs(prev => [...prev, `[SUCCESS] User account '${newUsername}' registered successfully.`]);
          return;
        }

        // Admin listusers command
        if (base === 'listusers') {
          if (sshSessionUser?.username !== 'root') {
            setTerminalLogs(prev => [...prev, `zero-shell: Permission denied. root access required.`]);
            return;
          }

          const usersList = await firebaseDb.listAllUsers();

          setTerminalLogs(prev => [
            ...prev,
            ' ',
            'USERNAME        PASSWORD_CHANGED?     2FA_ENABLED?',
            '-------------------------------------------------------',
            ...usersList.map(u =>
              `${u.username.padEnd(16)} ${(u.isPasswordChanged ? 'YES' : 'NO').padEnd(21)} ${u.is2faEnabled ? 'YES' : 'NO'}`
            ),
            ' '
          ]);
          return;
        }

        // Admin deleteuser command
        if (base === 'deleteuser') {
          if (sshSessionUser?.username !== 'root') {
            setTerminalLogs(prev => [...prev, `zero-shell: Permission denied. root access required.`]);
            return;
          }

          const targetUser = parts[1];
          if (!targetUser) {
            setTerminalLogs(prev => [...prev, `Usage: deleteuser <username>`]);
            return;
          }

          if (targetUser.toLowerCase() === 'root') {
            setTerminalLogs(prev => [...prev, `[ERROR] Cannot delete admin root account.`]);
            return;
          }

          const deleted = await firebaseDb.deleteUser(targetUser);
          if (deleted) {
            setTerminalLogs(prev => [...prev, `[SUCCESS] User account '${targetUser}' deleted.`]);
          } else {
            setTerminalLogs(prev => [...prev, `[ERROR] User '${targetUser}' not found.`]);
          }
          return;
        }

        // Admin reset2fa command
        if (base === 'reset2fa') {
          if (sshSessionUser?.username !== 'root') {
            setTerminalLogs(prev => [...prev, `zero-shell: Permission denied. root access required.`]);
            return;
          }

          const targetUser = parts[1];
          if (!targetUser) {
            setTerminalLogs(prev => [...prev, `Usage: reset2fa <username>`]);
            return;
          }

          const userObj = await firebaseDb.getUser(targetUser);
          if (userObj) {
            const updatedUser = {
              ...userObj,
              is2faEnabled: false,
              twoFactorSecret: ''
            };
            await firebaseDb.saveUser(updatedUser);

            if (targetUser.toLowerCase() === sshSessionUser.username.toLowerCase()) {
              setSshSessionUser(updatedUser);
            }

            setTerminalLogs(prev => [...prev, `[SUCCESS] 2FA configuration reset successfully for user '${targetUser}'.`]);
          } else {
            setTerminalLogs(prev => [...prev, `[ERROR] User '${targetUser}' not found.`]);
          }
          return;
        }

        setTerminalLogs(prev => [...prev, `zero-shell: command not found: "${cmd}"`]);
      }
    };



    // ==========================================
    // JSX Layout Rendering
    // ==========================================

    return (
      <div className="bg-black text-[#e2e2e2] font-mono min-h-screen overflow-hidden flex flex-col relative">

        {/* Background Matrix Rain Cascade */}
        <DigitalRain color="#ff0033" density={rainDensity} />

        {/* Top Header App Bar (Desktop Navigation) */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-3 bg-black border-b border-[#5f3e3d] md:flex hidden">
          <div className="font-anton text-4xl text-[#ffb3af] tracking-tighter select-none">
            Ground_Xero
          </div>
        </header>

        {/* Main Viewport Container */}
        <main className="pt-16 md:pt-24 pb-20 md:pb-6 flex-1 flex flex-col overflow-y-auto bg-black px-6 md:px-12 relative z-10 no-scrollbar">

        {/* TAB 1: CORE CLI SHELL */}
        {currentTab === 'terminal' && (
          <div className={`flex-1 flex ${showProfile ? 'flex-col lg:flex-row gap-6' : 'flex-col'} h-full justify-between`}>
            {/* Scrollable logs list and active inline terminal input */}
            <div
              className="flex-1 overflow-y-auto pr-1 space-y-1.5 font-mono text-xs select-text leading-relaxed max-h-[calc(100vh-220px)] mt-4 text-[#ff0033] no-scrollbar"
            >
              {terminalLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap font-mono font-medium tracking-wide">
                  {log}
                </div>
              ))}

              {/* QR Code rendering during 2FA Setup */}
              {sshState === 'ssh_2fa_setup' && ssh2faSecret && (
                <div className="my-4 p-4 bg-white w-max rounded">
                  <QRCodeSVG
                    value={`otpauth://totp/${encodeURIComponent(`Ground_Xero:${sshUser}@zero`)}?secret=${ssh2faSecret}&issuer=Ground_Xero`}
                    size={160}
                    level="M"
                  />
                </div>
              )}

                {/* Active command line input printed inline directly after history logs */}
                <div className="flex items-center font-mono text-xs select-none pt-1">
                  {sshState === 'none' && (
                    <>
                      <span className="text-[#ff0033] font-bold">root/</span>
                      <span className="text-white">:</span>
                      <span className="text-matrix-blue font-bold">~</span>
                      <span className="text-[#ff0033] animate-pulse font-bold ml-1 mr-2">$</span>
                    </>
                  )}
                  {sshState === 'ssh_password' && (
                    <span className="text-[#ff0033] mr-2">{sshUser}@zero's password:</span>
                  )}
                  {sshState === 'ssh_new_password' && (
                    <span className="text-[#ff0033] mr-2">New password:</span>
                  )}
                  {sshState === 'ssh_confirm_password' && (
                    <span className="text-[#ff0033] mr-2">Confirm password:</span>
                  )}
                  {(sshState === 'ssh_2fa_setup' || sshState === 'ssh_2fa_verify') && (
                    <span className="text-[#ff0033] mr-2">Enter 2FA Code (OTP):</span>
                  )}
                  {sshState === 'logged_in' && (
                    <>
                      <span className="text-[#ff0033] font-bold">{sshSessionUser?.username}@zero</span>
                      <span className="text-white">:</span>
                      <span className="text-matrix-blue font-bold">~</span>
                      <span className="text-[#ff0033] animate-pulse font-bold ml-1 mr-2">
                        {sshSessionUser?.username === 'root' ? '#' : '$'}
                      </span>
                    </>
                  )}
                  {sshState === 'leetcode_setup' && (
                    <span className="text-[#ff0033] mr-2">leetcode url:</span>
                  )}
                  {sshState === 'codeforces_setup' && (
                    <span className="text-[#ff0033] mr-2">codeforces url:</span>
                  )}
                  <input
                    ref={cliInputRef}
                    aria-label="Terminal Input"
                    autoFocus
                    type={
                      sshState === 'ssh_password' ||
                        sshState === 'ssh_new_password' ||
                        sshState === 'ssh_confirm_password'
                        ? 'password'
                        : 'text'
                    }
                    value={cliInput}
                    onChange={(e) => setCliInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleExecuteCliCommand();
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (commandHistory.length > 0) {
                          const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
                          if (historyIndex === -1) setDraftCommand(cliInput);
                          setHistoryIndex(nextIndex);
                          setCliInput(commandHistory[nextIndex]);
                        }
                      } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (historyIndex !== -1) {
                          const nextIndex = historyIndex + 1;
                          if (nextIndex >= commandHistory.length) {
                            setHistoryIndex(-1);
                            setCliInput(draftCommand);
                          } else {
                            setHistoryIndex(nextIndex);
                            setCliInput(commandHistory[nextIndex]);
                          }
                        }
                      } else if (e.key === 'Tab') {
                        e.preventDefault();
                        const input = cliInput;
                        const inputLower = input.toLowerCase();

                        const isSensitive = sshState === 'ssh_password' || sshState === 'ssh_new_password' || sshState === 'ssh_confirm_password';
                        if (isSensitive || input.length === 0) return;

                      const profileCmds = ['profile', 'rename', 'about', 'addstack', 'repo', 'profpic', 'clearstack'];
                      const availableCommands = sshState === 'logged_in'
                        ? sshSessionUser?.username === 'root'
                          ? ['help', '?', 'clear', 'cls', 'whoami', 'passwd', 'resetpassword', 'logout', 'exit', 'createuser', 'listusers', 'deleteuser', 'reset2fa', ...profileCmds]
                          : ['help', '?', 'clear', 'cls', 'whoami', 'passwd', 'resetpassword', 'logout', 'exit', ...profileCmds]
                        : ['help', '?', 'clear', 'cls', 'fastfetch', 'cmatrix', 'ssh', 'exit', 'blue', ...profileCmds];

                      const parts = input.split(' ');
                      const partsLower = inputLower.split(' ');

                        if (parts.length === 1) {
                          const matches = availableCommands.filter(cmd => cmd.startsWith(inputLower));
                          if (matches.length === 1) {
                            setCliInput(matches[0] + ' ');
                          } else if (matches.length > 1) {
                            const logPrefix = sshState === 'logged_in'
                              ? `${sshSessionUser?.username}@zero:~$`
                              : 'root/ :~$';
                            setTerminalLogs(prev => [
                              ...prev,
                              `${logPrefix} ${cliInput}`,
                              matches.join('  ')
                            ]);
                          }
                        }
                      } else if (e.key.toLowerCase() === 'c' && e.ctrlKey) {
                        e.preventDefault();
                        const logPrefix = sshState === 'logged_in'
                          ? `${sshSessionUser?.username}@zero:~$`
                          : (sshState === 'none' ? 'root/ $' : `[SSH INPUT]`);
                        const isSensitive = sshState === 'ssh_password' || sshState === 'ssh_new_password' || sshState === 'ssh_confirm_password';
                        const displayCmd = isSensitive ? '•'.repeat(Math.min(cliInput.length, 12)) : cliInput;

                        setTerminalLogs(prev => [
                          ...prev,
                          `${logPrefix} ${displayCmd}^C`,
                          ' ',
                          '>> DETACHING NEURAL COUPLING SYSTEM...',
                          '>> RE-INJECTING COGNITIVE COMFORT BUFFER...'
                        ]);
                        setCliInput('');
                        setTimeout(() => {
                          onExit?.();
                        }, 700);
                      }
                    }}
                    placeholder=""
                    className="bg-transparent border-none outline-none text-[#ff0033] font-mono text-xs w-full focus:ring-0 p-0 m-0 caret-current"
                  />
                </div>

                <div ref={terminalEndRef} />
              </div>

              {/* Right Side: Profile Card Matrix Panel */}
              {showProfile && (
                <div className="w-full lg:w-[380px] flex-shrink-0 mt-4 overflow-y-auto max-h-[calc(100vh-220px)]">
                  <ProfileCard
                    user={
                      sshSessionUser
                        ? {
                            ...localGuestProfile,
                            ...sshSessionUser,
                            displayName: sshSessionUser.displayName || localGuestProfile.displayName || sshSessionUser.username,
                            statusBubble: sshSessionUser.statusBubble || localGuestProfile.statusBubble,
                            bioLink: sshSessionUser.bioLink || localGuestProfile.bioLink,
                            avatarUrl: sshSessionUser.avatarUrl || localGuestProfile.avatarUrl,
                            techStack: sshSessionUser.techStack && sshSessionUser.techStack.length > 0 ? sshSessionUser.techStack : localGuestProfile.techStack,
                          }
                        : localGuestProfile
                    }
                    onClose={() => setShowProfile(false)}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IMMERSIVE WATERFALL VISUALIZER */}
          {currentTab === 'rain' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center mt-4 h-[calc(100vh-220px)] relative">
              <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
                <DigitalRain color="#ff0033" density={rainDensity * 1.5} />
              </div>

              <div className="bg-black/90 border border-[#5f3e3d] p-6 max-w-md w-full relative z-10 space-y-4">
                <h3 className="font-anton text-2xl text-white uppercase tracking-wider">
                  COGNITIVE MATRIX RAIN
                </h3>
                <p className="font-mono text-xs text-[#e9bcb9] leading-relaxed">
                  You are witnessing the sub-code of the simulation flowing in real-time.
                  Adjust stream transmission density parameters to alter transmission clarity.
                </p>

                {/* Rain density range adjust */}
                <div className="space-y-2 pt-2 text-left">
                  <span className="font-mono text-xs text-white uppercase block">
                    Waterfall Density: {rainDensity.toFixed(1)}x
                  </span>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.2"
                    value={rainDensity}
                    onChange={(e) => setRainDensity(parseFloat(e.target.value))}
                    className="w-full accent-[#ff0033] bg-neutral-900 border border-[#5f3e3d]"
                  />
                </div>

                {/* Density reset trigger */}
                <button
                  onClick={() => setRainDensity(1.2)}
                  className="w-full bg-neutral-900 hover:bg-[#ff0033]/10 border border-[#ff0033] text-[#ff0033] font-sans text-xs uppercase tracking-widest font-bold py-2.5 transition-all cursor-pointer"
                >
                  RE-ALIGN SECTOR RESOLUTION
                </button>
              </div>
            </div>
          )}

        </main>

        {/* Bottom Mobile Navigation Bar (Fixed Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#121414] border-t border-[#5f3e3d] flex justify-around py-3 z-50">
          <button
            onClick={() => setCurrentTab('rain')}
            className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'rain' ? 'text-[#ffb3af]' : 'text-[#e9bcb9]'
              }`}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentTab('terminal')}
            className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'terminal' ? 'text-[#ffb3af]' : 'text-[#e9bcb9]'
              }`}
          >
            <TermIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenSettings}
            className="flex flex-col items-center gap-1 p-2 text-[#e9bcb9]"
          >
            <Settings className="w-5 h-5" />
          </button>
        </nav>

        {/* Cmatrix Fullscreen Visualizer Overlay */}
        {cmatrixConfig.active && (
          <div className="fixed inset-0 w-screen h-screen z-[100] bg-black cursor-none">
            <DigitalRain color={cmatrixConfig.color} density={1.5} opacity={1} />
            <div className="absolute top-4 left-4 text-white font-mono text-xs opacity-50 pointer-events-none">
              [ cmatrix active ] press 'q' to exit
            </div>
          </div>
        )}

      </div>
    );
  }
