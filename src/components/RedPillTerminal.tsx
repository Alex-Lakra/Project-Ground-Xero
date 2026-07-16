import React, { useState, useEffect, useRef } from 'react';
import { Shield, Terminal as TermIcon, Check, Eye, Activity, Brain, Settings } from 'lucide-react';
import { DecryptionLog, DiagnosticsItem } from '../types';
import DigitalRain from './DigitalRain';
import { firebaseDb, SSHUser } from '../services/firebaseDb';

interface RedPillTerminalProps {
  onOpenSettings?: () => void;
  onExit?: () => void;
}

export default function RedPillTerminal({ onOpenSettings, onExit }: RedPillTerminalProps) {
  // ==========================================
  // State Definitions
  // ==========================================

  // Navigation State
  const [currentTab, setCurrentTab] = useState<'terminal' | 'decryptor' | 'rain'>('terminal');

  // Input & Command States
  const [cliInput, setCliInput] = useState('');
  const [decryptInput, setDecryptInput] = useState('');

  // SSH Mainframe Login and Session States
  const [sshState, setSshState] = useState<'none' | 'ssh_password' | 'ssh_new_password' | 'ssh_confirm_password' | 'ssh_2fa_setup' | 'ssh_2fa_verify' | 'logged_in' | 'leetcode_setup' | 'codeforces_setup'>('none');
  const [sshPrevState, setSshPrevState] = useState<'none' | 'logged_in'>('none');
  const [sshUser, setSshUser] = useState('');
  const [sshSessionUser, setSshSessionUser] = useState<SSHUser | null>(null);
  const [sshTempPassword, setSshTempPassword] = useState('');
  const [ssh2faSecret, setSsh2faSecret] = useState('');

  // Hacking Simulation State
  const [activeHack, setActiveHack] = useState<'none' | 'firewall' | 'memory' | 'sentinel'>('none');
  const [hackProgress, setHackProgress] = useState(0);
  const [hackLogs, setHackLogs] = useState<string[]>([]);
  const [rainDensity, setRainDensity] = useState(1.2);
  const [cmatrixConfig, setCmatrixConfig] = useState<{ active: boolean, color: string }>({ active: false, color: '#00ff00' });

  // References for UI focus & scroll alignment
  const cliInputRef = useRef<HTMLInputElement | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Terminal history logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
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

  // Scramble logs for the decrypter utility
  const [decryptionLogs, setDecryptionLogs] = useState<DecryptionLog[]>([
    {
      id: 'dec1',
      original: 'The Matrix is everywhere.',
      decrypted: 'THE MATRIX IS EVERYWHERE.',
      progress: 100,
      timestamp: new Date().toLocaleTimeString(),
      status: 'completed'
    }
  ]);

  // Core Diagnostics readout metrics
  const diagnostics: DiagnosticsItem[] = [
    { name: 'ZION CORE MAIN LINK', status: 'active', value: 'DECRYPTED_LINK_ALPHA' },
    { name: 'AGENT TRACE RADIUS', status: 'warning', value: '4.2 KM // CLOSING_IN' },
    { name: 'MEMORY BUFFER DECAY', status: 'error', value: 'BUFFER_OVERFLOW_WARNING' },
    { name: 'SUBCONSCIOUS COUPLER', status: 'active', value: 'RED_PILL_ALIGNED' },
  ];

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
        const pathname = urlObj.pathname;
        const parts = pathname.split("/").filter(Boolean);
        if (parts[0] === "u" && parts[1]) {
          return parts[1];
        } else if (parts[0]) {
          return parts[0];
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

    // ----------------------------------------------------
    // STATE: NONE (Local terminal mode)
    // ----------------------------------------------------
    if (sshState === 'none') {
      const parts = cmd.split(' ');
      const base = parts[0].toLowerCase();

      // Help command
      if (base === 'help' || base === '?') {
        setTerminalLogs(prev => [
          ...prev,
          ' ',
          'Ground_Xero COGNITIVE CORE BYPASS CONSOLE',
          '==========================================',
          'help / ?           - List active terminal operations.',
          'clear / cls        - Erase local console logs buffer cache.',
          'cmatrix            - Enter full screen matrix rain visualizer mode.',
          'ssh user@zero      - SSH tunnel into the zero server node.',
          '/leet              - Configure LeetCode profile (requires login).',
          'leet               - View LeetCode solved stats (requires login).',
          '/codef             - Configure Codeforces profile (requires login).',
          'codef              - View Codeforces solved stats (requires login).',
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

      // Clear logs
      if (base === 'clear' || base === 'cls') {
        setTerminalLogs(['[LOCAL BUFFER CACHE ERASED]']);
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
      const sshMatch = cmd.match(/^ssh\s+([a-zA-Z0-9_-]+)@([a-zA-Z0-9._-]+)$/i);
      if (sshMatch) {
        const username = sshMatch[1];
        const host = sshMatch[2].toLowerCase();

        if (host !== 'zero') {
          setTerminalLogs(prev => [...prev, `ssh: Could not resolve hostname ${host}: Name or service not known`]);
          return;
        }

        // Fetch user from DB first to verify existence
        const userObj = await firebaseDb.getUser(username);
        if (!userObj) {
          setTerminalLogs(prev => [...prev, `ssh: ${username}@zero: User account does not exist in the database.`]);
          return;
        }

        setTerminalLogs(prev => [
          ...prev,
          `Connecting to server '${host}'...`,
          `Establishing secure user-session handshake...`,
          `${username}@${host}'s password: `
        ]);
        setSshUser(username);
        setSshState('ssh_password');
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
            `2. Add custom key (copy/paste): ${secret}`,
            `3. Key (Formatted): ${secret.match(/.{1,4}/g)?.join(' ') || secret}`,
            `4. Enter the 6-digit active verification OTP below to enroll.`,
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
      const parts = cmd.split(' ');
      const base = parts[0].toLowerCase();

      // Help CLI zero commands
      if (base === 'help' || base === '?') {
        const standardLogs = [
          ' ',
          'Zero Mainframe SSH Console Operations',
          '======================================',
          'whoami           - Display the current active user.',
          'passwd <new_pass> - Reset your active user password.',
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
            'reset2fa <username>       - Reset 2FA status and key for a user.'
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
        const newPassword = parts[1];
        if (!newPassword) {
          setTerminalLogs(prev => [...prev, `Usage: passwd <new_password>`]);
          return;
        }

        const userObj = await firebaseDb.getUser(sshUser);
        if (userObj) {
          const updatedUser = { ...userObj, passwordHash: newPassword };
          await firebaseDb.saveUser(updatedUser);
          setSshSessionUser(updatedUser);
          setTerminalLogs(prev => [...prev, `[SUCCESS] Password changed successfully for user '${sshUser}'.`]);
        } else {
          setTerminalLogs(prev => [...prev, `[ERROR] User session error.`]);
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
  // Diagnostics / Hacking Simulation
  // ==========================================

  const runHack = (type: 'firewall' | 'memory' | 'sentinel') => {
    if (activeHack !== 'none') return;
    setActiveHack(type);
    setHackProgress(0);
    setHackLogs([]);

    const logMessages = {
      firewall: [
        'INITIATING BACKDOOR ROUTE ON PORT 8080...',
        'BYPASSING SECTOR SECURITY CODES...',
        'FLOODING AGENT SENSOR ARRAYS...',
        'ESTABLISHING ENCRYPTED ROOT TUNNEL...',
        'FIREWALL OVERRIDDEN. MAIN-SECURE NODE CAPTURED.'
      ],
      memory: [
        'SCANNING VIRTUAL MEMORY BLOCKS...',
        'ALLOCATING FLOATING BUFFER SPACE...',
        'DUMPING CACHED ILLUSION PROTOCOLS...',
        'RE-INJECTING RAW CONSCIOUSNESS DATA...',
        'MEMORY OVERFLOW PURGE COMPLETE. STANDBY_STABLE.'
      ],
      sentinel: [
        'PINGING SENTINEL RADAR FREQUENCY...',
        'INJECTING STATIC NOISE PATHS...',
        'ENCRYPTING ZION TRACE BEACONS...',
        'MASKING ELECTROMAGNETIC SIGNATURES...',
        'SENTINEL SENSORS CONFUSED. SCAN_COOLDOWN ACTIVE.'
      ]
    };

    let step = 0;
    const interval = setInterval(() => {
      setHackProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setActiveHack('none');
          return 100;
        }

        if (prev % 20 === 0 && step < logMessages[type].length) {
          setHackLogs(logs => [...logs, `[${new Date().toLocaleTimeString()}] ${logMessages[type][step]}`]);
          step++;
        }

        return prev + 5;
      });
    }, 120);
  };

  // ==========================================
  // Text Decryption Panel Logic
  // ==========================================

  const handleDecryptText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decryptInput.trim()) return;

    const newLogId = Date.now().toString();
    const originalText = decryptInput;
    const logItem: DecryptionLog = {
      id: newLogId,
      original: originalText,
      decrypted: '',
      progress: 0,
      timestamp: new Date().toLocaleTimeString(),
      status: 'decrypting'
    };

    setDecryptionLogs(prev => [logItem, ...prev]);
    setDecryptInput('');

    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      setDecryptionLogs(logs => logs.map(l => {
        if (l.id === newLogId) {
          if (prog >= 100) {
            clearInterval(interval);
            return {
              ...l,
              progress: 100,
              decrypted: originalText.toUpperCase(),
              status: 'completed'
            };
          }

          const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇ';
          const scrambled = originalText.split('').map(char => {
            if (char === ' ') return ' ';
            return Math.random() > 0.4 ? char.toUpperCase() : katakana[Math.floor(Math.random() * katakana.length)];
          }).join('');

          return {
            ...l,
            progress: prog,
            decrypted: scrambled,
            status: 'decrypting'
          };
        }
        return l;
      }));
    }, 100);
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
      <main className="pt-16 md:pt-24 pb-20 md:pb-6 flex-1 flex flex-col overflow-y-auto bg-black px-6 md:px-12 relative z-10">

        {/* TAB 1: CORE CLI SHELL */}
        {currentTab === 'terminal' && (
          <div className="flex-1 flex flex-col h-full justify-between">
            {/* Scrollable logs list and active inline terminal input */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 font-mono text-xs select-text text-[#ff0033] leading-relaxed max-h-[calc(100vh-220px)] mt-4">
              {terminalLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap font-mono font-medium tracking-wide">
                  {log}
                </div>
              ))}

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
          </div>
        )}

        {/* TAB 2: DECRYPTOR & DIAGNOSTICS */}
        {currentTab === 'decryptor' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 max-w-6xl mx-auto w-full h-[calc(100vh-180px)] overflow-y-auto">

            {/* Diagnostics Column */}
            <div className="lg:col-span-5 space-y-6">

              {/* Diagnostic Parameters Table */}
              <div className="bg-black/90 border border-[#5f3e3d] p-5 space-y-4">
                <h3 className="font-anton text-lg tracking-wider text-white uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#ff0033]" />
                  MAINFRAME LIVE DIAGNOSTICS
                </h3>
                <div className="space-y-4 font-mono text-xs">
                  {diagnostics.map((diag, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-[#5f3e3d]/30 pb-2.5">
                      <span className="text-[#e9bcb9] uppercase">{diag.name}</span>
                      <div className="text-right">
                        <span className="text-white font-bold block">{diag.value}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${diag.status === 'active'
                          ? 'text-[#ff0033]'
                          : diag.status === 'warning'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                          }`}>
                          {diag.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulation Exploiter Tools */}
              <div className="bg-black/90 border border-[#5f3e3d] p-5 space-y-3">
                <h3 className="font-anton text-lg tracking-wider text-white uppercase">MAINFRAME BYPASS EXPLOITS</h3>

                {/* firewall hack */}
                <button
                  disabled={activeHack !== 'none'}
                  onClick={() => runHack('firewall')}
                  className={`w-full font-mono text-xs py-2.5 border uppercase tracking-widest cursor-pointer text-left px-4 flex justify-between items-center ${activeHack === 'firewall'
                    ? 'border-[#ff0033] bg-[#ff0033]/10 text-[#ff0033]'
                    : 'border-[#5f3e3d] text-[#e9bcb9] hover:border-[#ff0033] hover:text-[#ff0033]'
                    }`}
                >
                  <span>OVERRIDE AGENT FIREWALL</span>
                  <Shield className="w-4 h-4" />
                </button>

                {/* memory hack */}
                <button
                  disabled={activeHack !== 'none'}
                  onClick={() => runHack('memory')}
                  className={`w-full font-mono text-xs py-2.5 border uppercase tracking-widest cursor-pointer text-left px-4 flex justify-between items-center ${activeHack === 'memory'
                    ? 'border-[#ff0033] bg-[#ff0033]/10 text-[#ff0033]'
                    : 'border-[#5f3e3d] text-[#e9bcb9] hover:border-[#ff0033] hover:text-[#ff0033]'
                    }`}
                >
                  <span>PURGE SUBSYSTEM BUFFER</span>
                  <TermIcon className="w-4 h-4" />
                </button>

                {/* Live Hack Logging feedback */}
                {activeHack !== 'none' && (
                  <div className="space-y-2 border border-[#5f3e3d] p-3 bg-black/60 font-mono text-xs">
                    <div className="flex justify-between text-[#ff0033] font-bold">
                      <span>RUNNING SYSTEM GLITCH: {activeHack.toUpperCase()}</span>
                      <span>{hackProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-2 border border-[#5f3e3d]">
                      <div className="bg-[#ff0033] h-full transition-all duration-150" style={{ width: `${hackProgress}%` }} />
                    </div>
                    <div className="text-[10px] text-[#e9bcb9] h-20 overflow-y-auto space-y-0.5 pt-1 mt-1 border-t border-[#5f3e3d]/20">
                      {hackLogs.map((log, index) => <div key={index}>{log}</div>)}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Scrambled Text Decryptor Column */}
            <div className="lg:col-span-7">
              <div className="bg-black/90 border border-[#5f3e3d] p-5 space-y-4">
                <h3 className="font-anton text-lg tracking-wider text-white uppercase flex items-center gap-2">
                  <TermIcon className="w-4 h-4 text-[#ff0033]" />
                  TEXT PACKET DECRYPTOR
                </h3>

                <form onSubmit={handleDecryptText} className="flex gap-2">
                  <input
                    type="text"
                    value={decryptInput}
                    onChange={(e) => setDecryptInput(e.target.value)}
                    placeholder="Enter Matrix text to scramble decrypt..."
                    className="flex-1 bg-black border border-[#5f3e3d] text-white font-mono text-xs p-3 focus:border-[#ff0033] outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-black hover:bg-[#ff0033]/10 border border-[#ff0033] text-[#ff0033] font-sans text-xs uppercase tracking-wider font-bold px-5 cursor-pointer flex items-center gap-1"
                  >
                    <Shield className="w-4 h-4" />
                    <span>DECRYPT</span>
                  </button>
                </form>

                {/* Decoded records stream */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-sans text-xs tracking-wider uppercase text-white font-bold">DECRYPTION RECORD STREAM</h4>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {decryptionLogs.map((log) => (
                      <div key={log.id} className="border border-[#5f3e3d]/30 p-3 bg-[#121414]/55 font-mono text-xs flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="text-[10px] text-[#e9bcb9] block uppercase">
                            RAW: "{log.original}"
                          </span>
                          <span className="text-white font-bold block tracking-wider">
                            DECODED: "{log.decrypted}"
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#e9bcb9] block">{log.timestamp}</span>
                          {log.status === 'completed' ? (
                            <span className="text-[#ff0033] font-bold text-[10px] uppercase flex items-center gap-1 justify-end mt-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>SECURE</span>
                            </span>
                          ) : (
                            <span className="text-yellow-500 font-bold text-[10px] uppercase animate-pulse block mt-1">
                              SOLVING {log.progress}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

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
          onClick={() => setCurrentTab('decryptor')}
          className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'decryptor' ? 'text-[#ffb3af]' : 'text-[#e9bcb9]'
            }`}
        >
          <Brain className="w-5 h-5" />
        </button>
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
