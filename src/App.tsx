import { useState, useEffect } from 'react';
import { Terminal as TermIcon, Settings, RefreshCw, Layers } from 'lucide-react';
import { PillChoice, SystemSettings } from './types';
import MorpheusChoice from './components/MorpheusChoice';
import RedPillTerminal from './components/RedPillTerminal';
import BluePillConstruct from './components/BluePillConstruct';
import TerminalOverlay from './components/TerminalOverlay';
import SettingsPanel from './components/SettingsPanel';
import MatrixLoader from './components/MatrixLoader';

export default function App() {
  // App initialization load screen state
  const [isLoading, setIsLoading] = useState(true);

  // Pill choice state ('none' for Choice, 'red' for Red Pill terminal, 'blue' for Blue Pill construct)
  const [choice, setChoice] = useState<PillChoice>('none');
  
  // Transition animation triggers
  const [isGlitching, setIsGlitching] = useState(false);
  const [activeScreen, setActiveScreen] = useState<PillChoice>('none');

  // Toggle Overlays
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // System Config Settings
  const [settings, setSettings] = useState<SystemSettings>({
    scanlineOpacity: 0.15,
    terminalSpeed: 'normal',
    digitalRainDensity: 1.0,
    retroFont: false,
  });

  // Handle transition animations when pill choice is made
  const handleChoosePill = (selected: PillChoice) => {
    setIsGlitching(true);
    
    // Simulate dramatic reality transition shift blip
    setTimeout(() => {
      setChoice(selected);
      setActiveScreen(selected);
      setIsGlitching(false);
    }, 800);
  };

  const handleResetToChoice = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setChoice('none');
      setActiveScreen('none');
      setIsGlitching(false);
      setShowSettings(false);
    }, 600);
  };

  // Commands execution map for developer terminal
  const handleExecuteCommand = (cmd: string): string => {
    const parts = cmd.trim().split(' ');
    const base = parts[0].toLowerCase();

    if (base === '/help') {
      return `Available mainframe operations:
  /help - Display this command map.
  /choice - Reset cognitive state and return to Morpheus.
  /pill <red|blue> - Force load a specific pill reality.
  /decrypt <text> - Translate a text packet into uppercase mainframe string.
  /diagnose - Perform diagnostics scan on active node state.`;
    }

    if (base === '/choice') {
      handleResetToChoice();
      return '[SUCCESS] Cognitive state terminated. Re-initializing choice...';
    }

    if (base === '/pill') {
      const p = parts[1]?.toLowerCase();
      if (p === 'red' || p === 'blue') {
        handleChoosePill(p as PillChoice);
        return `[SUCCESS] Loaded subspace matrices for ${p.toUpperCase()}_PILL reality.`;
      }
      return '[ERROR] Invalid argument. Syntax: /pill <red|blue>';
    }

    if (base === '/decrypt') {
      const text = parts.slice(1).join(' ');
      if (!text) return '[ERROR] Please provide text to decrypt. Syntax: /decrypt <message>';
      return `[SUCCESS] Decryption translation complete: "${text.toUpperCase()}"`;
    }

    if (base === '/diagnose') {
      return `[DIAGNOSTICS READOUT]
  ZION MAIN TRANSMITTER: ${choice !== 'none' ? 'CONNECTED' : 'DISCONNECTED'}
  ACTIVE COGNITIVE CELL: ${choice.toUpperCase() || 'STANDBY_CONSTRUCT'}
  MEMORY BUFFERS: STABLE
  STATUS: CORE_SYSTEM_ALIGNED`;
    }

    return `[ERROR] Unknown command: "${cmd}". Type /help to see available operations.`;
  };

  return (
    <div 
      className={`min-h-screen bg-[#121414] text-[#e2e2e2] transition-all relative overflow-x-hidden ${
        settings.retroFont ? 'font-mono' : 'font-sans'
      }`}
    >
      {/* CRT Scanline Simulation Layer */}
      {settings.scanlineOpacity > 0 && (
        <div 
          className="scanline-overlay" 
          style={{ opacity: settings.scanlineOpacity }} 
        />
      )}

      {/* Screen Glitch Reality Transition Overlay */}
      {isGlitching && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono text-matrix-green crt-screen">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-matrix-green/10 to-transparent animate-pulse" />
          <div className="text-center space-y-4 relative z-10">
            <RefreshCw className="w-10 h-10 animate-spin mx-auto text-primary" />
            <div className="text-xl font-bold tracking-widest uppercase animate-pulse">
              [SHIFTING REALITY COGNITIVE CHANNELS]
            </div>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Bypassing temporal logic, corrupting cached memory constructs, downloading core parameters...
            </p>
          </div>
        </div>
      )}

      {/* Header element conforming precisely to layout style */}
      {activeScreen !== 'red' && (
        <header className="border-b border-outline-variant bg-[#0c0f0f] relative z-30">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            
            {/* Logo Title - Heavy brutalist type */}
            <div 
              onClick={handleResetToChoice}
              className="font-anton text-3xl md:text-4xl text-on-surface-variant cursor-pointer select-none tracking-wider uppercase hover:text-white transition-colors"
            >
              Ground_Xero
            </div>

            {/* Core system state chips and action controls */}
            <div className="flex items-center space-x-4">
              
              {/* Reality quick-indicators */}
              {activeScreen !== 'none' && (
                <button
                  onClick={handleResetToChoice}
                  className={`hidden md:flex items-center space-x-1.5 font-mono text-[10px] uppercase font-bold tracking-widest border px-2.5 py-1 transition-all cursor-pointer ${
                    activeScreen === 'red' 
                      ? 'border-matrix-red text-matrix-red hover:bg-matrix-red/15' 
                      : 'border-matrix-blue text-matrix-blue hover:bg-matrix-blue/15'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>STATE: {activeScreen} PILL</span>
                </button>
              )}

              {/* Quick Developer Console toggle */}
              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className={`p-2.5 border cursor-pointer transition-all ${
                  showTerminal 
                    ? 'border-primary bg-primary/10 text-white font-bold' 
                    : 'border-outline-variant text-on-surface-variant hover:text-white hover:border-white'
                }`}
                title="Toggle Core Command Shell"
              >
                <TermIcon className="w-5 h-5" />
              </button>

              {/* Config System Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2.5 border cursor-pointer transition-all ${
                  showSettings 
                    ? 'border-primary bg-primary/10 text-white font-bold' 
                    : 'border-outline-variant text-on-surface-variant hover:text-white hover:border-white'
                }`}
                title="System Configuration Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

          </div>
        </header>
      )}

      {/* Main active screen component section */}
      <main className={`${activeScreen === 'red' ? '' : 'relative min-h-[calc(100vh-80px)]'} crt-screen`}>
        {activeScreen === 'none' && (
          <MorpheusChoice onChoose={handleChoosePill} />
        )}
        {activeScreen === 'red' && (
          <RedPillTerminal 
            onOpenSettings={() => setShowSettings(true)}
            onExit={handleResetToChoice}
          />
        )}
        {activeScreen === 'blue' && (
          <BluePillConstruct />
        )}
      </main>

      {/* Interactive Floating Overlays */}
      {showTerminal && (
        <TerminalOverlay
          onClose={() => setShowTerminal(false)}
          onExecuteCommand={handleExecuteCommand}
        />
      )}

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onChangeSettings={setSettings}
          onClose={() => setShowSettings(false)}
          onResetToChoice={handleResetToChoice}
        />
      )}

      {isLoading && (
        <MatrixLoader onFinished={() => setIsLoading(false)} />
      )}
    </div>
  );
}
