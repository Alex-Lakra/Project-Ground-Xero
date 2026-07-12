import React, { useState, useEffect, useRef } from 'react';
import { Shield, Terminal as TermIcon, Check, Eye, Activity, Brain, Settings } from 'lucide-react';
import { DecryptionLog, DiagnosticsItem } from '../types';
import DigitalRain from './DigitalRain';

interface RedPillTerminalProps {
  onOpenSettings?: () => void;
  onExit?: () => void;
}

export default function RedPillTerminal({ onOpenSettings, onExit }: RedPillTerminalProps) {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'terminal' | 'decryptor' | 'rain'>('terminal');

  // Input States
  const [cliInput, setCliInput] = useState('');
  const [decryptInput, setDecryptInput] = useState('');

  // Active status/progress states
  const [activeHack, setActiveHack] = useState<'none' | 'firewall' | 'memory' | 'sentinel'>('none');
  const [hackProgress, setHackProgress] = useState(0);
  const [hackLogs, setHackLogs] = useState<string[]>([]);
  const [rainDensity, setRainDensity] = useState(1.2);

  // Focus and Scroll Refs
  const cliInputRef = useRef<HTMLInputElement | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Terminal Stream logs
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

  // Decryption log lists
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

  // Core Diagnostics list
  const diagnostics: DiagnosticsItem[] = [
    { name: 'ZION CORE MAIN LINK', status: 'active', value: 'DECRYPTED_LINK_ALPHA' },
    { name: 'AGENT TRACE RADIUS', status: 'warning', value: '4.2 KM // CLOSING_IN' },
    { name: 'MEMORY BUFFER DECAY', status: 'error', value: 'BUFFER_OVERFLOW_WARNING' },
    { name: 'SUBCONSCIOUS COUPLER', status: 'active', value: 'RED_PILL_ALIGNED' },
  ];

  // Auto-Scroll terminal logs
  useEffect(() => {
    if (currentTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, currentTab]);

  // Click anywhere to focus terminal input
  useEffect(() => {
    const handleGlobalClick = () => {
      if (currentTab === 'terminal') {
        cliInputRef.current?.focus();
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [currentTab]);

  // CLI execute command handler
  const handleExecuteCliCommand = async () => {
    const cmd = cliInput.trim();
    if (!cmd) return;

    setCliInput('');
    setTerminalLogs(prev => [...prev, `root/ $ ${cmd}`]);

    const parts = cmd.split(' ');
    const base = parts[0].toLowerCase();

    // 1. HELP
    if (base === 'help' || base === '?') {
      setTerminalLogs(prev => [
        ...prev,
        ' ',
        'Ground_Xero COGNITIVE CORE BYPASS CONSOLE',
        '==========================================',
        'help / ?           - List active terminal bypass operations.',
        'diagnose           - Perform instant mainframe diagnostic sector analysis.',
        'bypass / hack      - Trigger multi-layer cognitive firewall overload sequence.',
        'decrypt <text>     - Run custom text scrambling translator on a text string.',
        'rain               - Adjust ambient Matrix rain visual density.',
        'clear              - Erase local console logs buffer cache.',
        'exit / blue        - Return to Morpheus, escape reality (take Blue Pill).',
        ' '
      ]);
      return;
    }

    // 2. CLEAR
    if (base === 'clear') {
      setTerminalLogs(['[LOCAL BUFFER CACHE ERASED]']);
      return;
    }

    // 3. EXIT / BLUE
    if (base === 'exit' || base === 'blue') {
      setTerminalLogs(prev => [...prev, ' ', '>> DETACHING NEURAL COUPLING SYSTEM...', '>> RE-INJECTING COGNITIVE COMFORT BUFFER...']);
      setTimeout(() => {
        onExit?.();
      }, 700);
      return;
    }

    // 4. DIAGNOSE
    if (base === 'diagnose') {
      setTerminalLogs(prev => [
        ...prev,
        ' ',
        '>> INITIATING DIAGNOSTIC PING PACKETS...',
        '-------------------------------------------------------',
        '● ZION CORE MAIN LINK      : ACTIVE   [100% SECURE INTEGRITY]',
        '● AGENT TRACE RADIUS       : WARNING  [4.2 KM // DECREASING]',
        '● MEMORY BUFFER DECAY      : CRITICAL [BUFFER EXCEEDED STABLE SECTORS]',
        '● SUBCONSCIOUS COUPLER     : ALIGNED  [RED_PILL_ALIGNED]',
        '-------------------------------------------------------',
        '>> ADVISE: Trigger firewall bypass hack or clear buffer overflow.',
        ' '
      ]);
      return;
    }

    // 5. BYPASS / HACK
    if (base === 'bypass' || base === 'hack') {
      setTerminalLogs(prev => [...prev, ' ', '>> BOOTSTRAPPING GLITCH BYPASS CODES...']);
      const logs = [
        '>> [PORT-80] FLOODING LOCAL NETWORK GATEWAYS... [OK]',
        '>> [SEC_DUMP] INJECTING MALICIOUS COGNITIVE STRINGS... [OK]',
        '>> [DECRYPT] SECURING RE-ROUTING BEACONS... [OK]',
        '>> [STEALTH] ACTIVATING EM EMISSION SHIELD CONCEALER... [OK]',
        '>> COGNITIVE INTERACTION OVERRIDE SUCCESSFUL! FIREWALL GONE.'
      ];
      logs.forEach((log, i) => {
        setTimeout(() => {
          setTerminalLogs(prev => [...prev, log]);
        }, (i + 1) * 350);
      });
      return;
    }

    // 6. DECRYPT
    if (base === 'decrypt') {
      const text = parts.slice(1).join(' ');
      if (!text) {
        setTerminalLogs(prev => [...prev, '[ERROR] Incorrect syntax. Use: decrypt <string>']);
        return;
      }
      setTerminalLogs(prev => [...prev, `>> TRANSLATING MATRIX SCRAMBLED PACKET: "${text}"`]);
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, `>> DECRYPTED RESULT: "${text.toUpperCase()}"`, ' ']);
      }, 400);
      return;
    }

    // 7. RAIN
    if (base === 'rain') {
      setTerminalLogs(prev => [...prev, '>> ADJUSTING AMBIENT WATERFALL CASCADE DENSITY...', ' ']);
      setRainDensity(prev => (prev >= 2.0 ? 0.5 : prev + 0.5));
      return;
    }

    // 8. Unknown command fallback
    setTerminalLogs(prev => [...prev, `command not found: "${cmd}"`]);
  };

  // Diagnostics Tab - Run simulated hack operations
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

  // Text Decryption tool implementation
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

  return (
    <div className="bg-black text-[#e2e2e2] font-mono min-h-screen overflow-hidden flex flex-col relative">

      {/* Background Matrix Rain Cascade */}
      <DigitalRain color="#ff0033" density={rainDensity} />

      {/* TopAppBar (Desktop Navigation) */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-3 bg-black border-b border-[#5f3e3d] flat no shadows md:flex hidden">
        <div className="font-anton text-4xl text-[#ffb3af] tracking-tighter select-none">
            Ground_Xero
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setCurrentTab('terminal')}
            title="Core CLI Shell"
            className={`cursor-pointer instant state changes no-transition p-2 hover:bg-neutral-900 transition-colors ${currentTab === 'terminal' ? 'text-[#ffb3af]' : 'text-[#e9bcb9]'}`}
          >
            <TermIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentTab('decryptor')}
            title="Diagnostics & Tools"
            className={`cursor-pointer instant state changes no-transition p-2 hover:bg-neutral-900 transition-colors ${currentTab === 'decryptor' ? 'text-[#ffb3af]' : 'text-[#e9bcb9]'}`}
          >
            <Brain className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentTab('rain')}
            title="Waterfall Screen"
            className={`cursor-pointer instant state changes no-transition p-2 hover:bg-neutral-900 transition-colors ${currentTab === 'rain' ? 'text-[#ffb3af]' : 'text-[#e9bcb9]'}`}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenSettings}
            title="System Settings"
            className="text-[#e9bcb9] cursor-pointer hover:bg-neutral-900 p-2 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-16 md:pt-24 pb-20 md:pb-6 flex-1 flex flex-col overflow-y-auto bg-black px-6 md:px-12 relative z-10">

        {/* TAB 1: CORE CLI SHELL */}
        {currentTab === 'terminal' && (
          <div className="flex-1 flex flex-col justify-between h-full">
            {/* Scrollable logs */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 font-mono text-xs select-text text-[#ff0033] leading-relaxed max-h-[calc(100vh-220px)] mt-4">
              {terminalLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap font-mono font-medium tracking-wide">
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input prompt at the very bottom */}
            <div className="flex items-center font-mono text-sm mt-auto border-t border-[#5f3e3d]/40 pt-4 mb-2 md:mb-0">
              <span className="text-[#e2e2e2] mr-2">root/</span>
              <span className="text-[#ff0033] animate-pulse mr-2">$</span>
              <input
                ref={cliInputRef}
                aria-label="Terminal Input"
                autoFocus
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleExecuteCliCommand();
                  }
                }}
                placeholder="Type 'help' for options..."
                className="bg-transparent border-none outline-none text-[#ff0033] font-mono text-sm w-full focus:ring-0 p-0 m-0 caret-current placeholder-[#ff0033]/30"
              />
            </div>
          </div>
        )}

        {/* TAB 3: DECRYPTOR & DIAGNOSTICS */}
        {currentTab === 'decryptor' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 max-w-6xl mx-auto w-full h-[calc(100vh-180px)] overflow-y-auto">

            {/* Diagnostics Column */}
            <div className="lg:col-span-5 space-y-6">

              {/* Diagnostic table */}
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
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${diag.status === 'active' ? 'text-[#ff0033]' : diag.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                          {diag.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action tools */}
              <div className="bg-black/90 border border-[#5f3e3d] p-5 space-y-3">
                <h3 className="font-anton text-lg tracking-wider text-white uppercase">MAINFRAME BYPASS EXPLOITS</h3>

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

            {/* Decryptor Column */}
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

        {/* TAB 4: IMMERSIVE RAIN VISUALIZER */}
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
          className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'decryptor' ? 'text-[#ffb3af]' : 'text-[#e9bcb9]'}`}
        >
          <Brain className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentTab('rain')}
          className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'rain' ? 'text-[#ffb3af]' : 'text-[#e9bcb9]'}`}
        >
          <Eye className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentTab('terminal')}
          className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'terminal' ? 'text-[#ffb3af]' : 'text-[#e9bcb9]'}`}
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

    </div>
  );
}
