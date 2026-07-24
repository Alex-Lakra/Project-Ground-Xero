import { useState } from 'react';
import { Terminal as TermIcon, Settings, RefreshCw, Layers } from 'lucide-react';
import { PillChoice, SystemSettings } from './types';
import MorpheusChoice from './components/MorpheusChoice';
import RedPillTerminal from './components/RedPillTerminal';
import BluePillConstruct from './components/BluePillConstruct';
import TerminalOverlay from './components/TerminalOverlay';
import SettingsPanel from './components/SettingsPanel';
import MatrixLoader from './components/MatrixLoader';

export default function App() {
  // ==========================================
  // State Definitions
  // ==========================================
  
  // App initialization load screen state
  const [isLoading, setIsLoading] = useState(true);

  // Active pill choice ('none' for Morpheus Choice, 'red' for Red Pill terminal, 'blue' for Blue Pill construct)
  const [choice, setChoice] = useState<PillChoice>('none');
  
  // Glitch transition state management
  const [isGlitching, setIsGlitching] = useState(false);
  const [activeScreen, setActiveScreen] = useState<PillChoice>('none');
  const [transitionChoice, setTransitionChoice] = useState<PillChoice>('none');

  // Toggle state for floating overlay drawers
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Main mainframe configuration settings
  const [settings, setSettings] = useState<SystemSettings>({
    scanlineOpacity: 0.15,
    terminalSpeed: 'normal',
    digitalRainDensity: 1.0,
    retroFont: false,
  });

  // ==========================================
  // Transition Handlers
  // ==========================================

  // Triggers dynamic glitch transition and updates active screen
  const handleChoosePill = (selected: PillChoice) => {
    if (selected === 'blue') {
      setChoice(selected);
      setActiveScreen(selected);
      setIsGlitching(false);
      return;
    }

    setTransitionChoice(selected);
    setIsGlitching(true);
    
    // Simulate dramatic temporal shift delay (800ms)
    setTimeout(() => {
      setChoice(selected);
      setActiveScreen(selected);
      setIsGlitching(false);
    }, 800);
  };

  // Re-routes back to the Morpheus Choice screen with a glitch transition
  const handleResetToChoice = () => {
    if (activeScreen === 'blue') {
      setChoice('none');
      setActiveScreen('none');
      setIsGlitching(false);
      setShowSettings(false);
      return;
    }

    setTransitionChoice('none');
    setIsGlitching(true);
    
    // Simulate cognitive buffer reset blip delay (600ms)
    setTimeout(() => {
      setChoice('none');
      setActiveScreen('none');
      setIsGlitching(false);
      setShowSettings(false);
    }, 600);
  };

  // ==========================================
  // Console Command Map
  // ==========================================
  
  const handleExecuteCommand = (cmd: string): string => {
    const parts = cmd.trim().split(' ');
    const base = parts[0].toLowerCase();

    // Command: /help
    if (base === '/help') {
      return `Available mainframe operations:
  /help - Display this command map.
  /choice - Reset cognitive state and return to Morpheus.
  /pill <red|blue> - Force load a specific pill reality.`;
    }

    // Command: /choice
    if (base === '/choice') {
      handleResetToChoice();
      return '[SUCCESS] Cognitive state terminated. Re-initializing choice...';
    }

    // Command: /pill
    if (base === '/pill') {
      const p = parts[1]?.toLowerCase();
      if (p === 'red' || p === 'blue') {
        handleChoosePill(p as PillChoice);
        return `[SUCCESS] Loaded subspace matrices for ${p.toUpperCase()}_PILL reality.`;
      }
      return '[ERROR] Invalid argument. Syntax: /pill <red|blue>';
    }

    return `[ERROR] Unknown command: "${cmd}". Type /help to see available operations.`;
  };

  // ==========================================
  // Main App Render
  // ==========================================
  return (
    <div 
      className={`min-h-screen bg-[#121414] text-[#e2e2e2] transition-all relative overflow-x-hidden ${
        settings.retroFont ? 'font-mono' : 'font-sans'
      }`}
    >
      {/* CRT Scanline simulation layer overlay */}
      {settings.scanlineOpacity > 0 && (
        <div 
          className="scanline-overlay" 
          style={{ opacity: settings.scanlineOpacity }} 
        />
      )}

      {/* Screen Glitch Reality Transition Overlay */}
      {isGlitching && activeScreen !== 'blue' && (
        <div className={`fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono crt-screen ${
          transitionChoice === 'red' ? 'text-matrix-red' : 
          transitionChoice === 'blue' ? 'text-matrix-blue' : 
          'text-on-surface-variant'
        }`}>
          <div className={`absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-transparent animate-pulse ${
            transitionChoice === 'red' ? 'via-matrix-red/10' : 
            transitionChoice === 'blue' ? 'via-matrix-blue/10' : 
            'via-on-surface-variant/10'
          }`} />
          <div className="text-center space-y-4 relative z-10">
            <RefreshCw className={`w-10 h-10 animate-spin mx-auto ${
              transitionChoice === 'red' ? 'text-matrix-red' : 
              transitionChoice === 'blue' ? 'text-matrix-blue' : 
              'text-primary'
            }`} />
            <div className="text-xl font-bold tracking-widest uppercase animate-pulse">
              [SHIFTING REALITY COGNITIVE CHANNELS]
            </div>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Bypassing temporal logic, corrupting cached memory constructs, downloading core parameters...
            </p>
          </div>
        </div>
      )}

      {/* Main Top Header Navigation (Hidden in red & blue full-page views) */}
      {activeScreen !== 'red' && activeScreen !== 'blue' && (
        <header className="border-b border-outline-variant bg-[#0c0f0f] relative z-30">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            
            {/* Main title logo trigger */}
            <div 
              onClick={handleResetToChoice}
              className="font-anton text-3xl md:text-4xl text-on-surface-variant cursor-pointer select-none tracking-wider uppercase hover:text-white transition-colors"
            >
              Ground_Xero
            </div>

            {/* Config & quick-state options */}
            <div className="flex items-center space-x-4">
              
              {/* Pill status chip quick link */}
              {activeScreen !== 'none' && (
                <button
                  onClick={handleResetToChoice}
                  className={`hidden md:flex items-center space-x-1.5 font-mono text-[10px] uppercase font-bold tracking-widest border px-2.5 py-1 transition-all cursor-pointer ${
                    (activeScreen as string) === 'red' 
                      ? 'border-matrix-red text-matrix-red hover:bg-matrix-red/15' 
                      : 'border-matrix-blue text-matrix-blue hover:bg-matrix-blue/15'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>STATE: {activeScreen} PILL</span>
                </button>
              )}

              {/* Developer terminal bypass overlay drawer toggle */}
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

              {/* System configuration console toggler drawer */}
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

      {/* Main Container Router pages switch */}
      <main className={`${activeScreen === 'red' ? '' : activeScreen === 'blue' ? 'relative min-h-screen' : 'relative min-h-[calc(100vh-80px)]'} crt-screen`}>
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

      {/* Floating Overlay Drawers */}
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

      {/* Initial bootloader screen overlay */}
      {isLoading && (
        <MatrixLoader onFinished={() => setIsLoading(false)} />
      )}
    </div>
  );
}
