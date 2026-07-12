import React from 'react';
import { X, RefreshCw, Layers, ShieldCheck, Cpu } from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsPanelProps {
  settings: SystemSettings;
  onChangeSettings: (settings: SystemSettings) => void;
  onClose: () => void;
  onResetToChoice: () => void;
}

export default function SettingsPanel({
  settings,
  onChangeSettings,
  onClose,
  onResetToChoice,
}: SettingsPanelProps) {
  
  // ==========================================
  // Logic Event Handlers
  // ==========================================
  
  // Enforces/Disables JetBrains Mono font overlay across the DOM
  const handleToggleRetroFont = () => {
    onChangeSettings({ ...settings, retroFont: !settings.retroFont });
  };

  // Updates overlay opacity of the CRT scanline emulation overlay
  const handleChangeScanline = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeSettings({ ...settings, scanlineOpacity: parseFloat(e.target.value) });
  };

  // Adjusts rendering frequency of digital rain fall streams
  const handleChangeDensity = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeSettings({ ...settings, digitalRainDensity: parseFloat(e.target.value) });
  };

  // Alters the general typing animation speed of the system boot outputs
  const handleChangeSpeed = (speed: 'fast' | 'normal' | 'slow') => {
    onChangeSettings({ ...settings, terminalSpeed: speed });
  };

  // ==========================================
  // Layout Rendering
  // ==========================================
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex justify-end">
      
      {/* Drawer Container Panel */}
      <div className="w-full max-w-md bg-[#0a0c0c] border-l border-outline-variant h-full p-6 flex flex-col justify-between relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        
        {/* Neon corner brackets */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary" />

        {/* Panel Content Scroll Container */}
        <div className="space-y-4">
          
          {/* Header section with closing control */}
          <div className="flex items-center justify-between border-b border-outline-variant pb-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-primary" />
              <h3 className="font-anton text-2xl tracking-wider uppercase text-white">CONSTRUCT SETTINGS</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:text-white border border-transparent hover:border-outline-variant text-on-surface-variant cursor-pointer rounded-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls list */}
          <div className="space-y-6 pt-4">
            
            {/* Control 1: Retro Font Toggle Switch */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-sans text-xs tracking-wider uppercase text-white font-bold">
                  ENFORCE SYSTEM MONOSPACE
                </label>
                <span className="font-mono text-[11px] text-on-surface-variant">
                  Overrides all interface typography to JetBrains Mono.
                </span>
              </div>
              
              <button
                onClick={handleToggleRetroFont}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer transition-colors duration-200 ease-in-out border border-outline-variant ${
                  settings.retroFont ? 'bg-primary' : 'bg-black'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform bg-white transition duration-200 ease-in-out m-1 ${
                    settings.retroFont ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Control 2: CRT Scanline Opacity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-sans text-xs tracking-wider uppercase text-white font-bold">
                  SCANLINE INTENSITY
                </label>
                <span className="font-mono text-xs text-primary">
                  {Math.round(settings.scanlineOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.6"
                step="0.05"
                value={settings.scanlineOpacity}
                onChange={handleChangeScanline}
                className="w-full accent-primary bg-black border border-outline-variant cursor-pointer h-2"
              />
              <span className="block font-mono text-[10px] text-on-surface-variant">
                Adjusts the CRT screen raster simulation layer opacity.
              </span>
            </div>

            {/* Control 3: Code Rain Density Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-sans text-xs tracking-wider uppercase text-white font-bold">
                  SUB-CODE DRIFT DENSITY
                </label>
                <span className="font-mono text-xs text-primary">
                  {settings.digitalRainDensity}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={settings.digitalRainDensity}
                onChange={handleChangeDensity}
                className="w-full accent-primary bg-black border border-outline-variant cursor-pointer h-2"
              />
              <span className="block font-mono text-[10px] text-on-surface-variant">
                Alters rendering frequency of background Matrix digital streams.
              </span>
            </div>

            {/* Control 4: Terminal Boot text print Speed grid */}
            <div className="space-y-3">
              <label className="block font-sans text-xs tracking-wider uppercase text-white font-bold">
                DIAGNOSTIC TRANSMISSION SPEED
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['slow', 'normal', 'fast'] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleChangeSpeed(speed)}
                    className={`font-mono text-xs py-2 border uppercase cursor-pointer transition-colors duration-150 ${
                      settings.terminalSpeed === speed
                        ? 'border-primary bg-primary/15 text-white font-bold'
                        : 'border-outline-variant text-on-surface-variant hover:text-white'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 5: Re-initialize / Reset mainframe button */}
            <div className="pt-4 border-t border-outline-variant space-y-3">
              <div className="flex items-center space-x-2 text-white">
                <Layers className="w-4 h-4 text-primary" />
                <span className="font-sans text-xs tracking-wider uppercase font-bold">CONSTRUCT LIFECYCLE</span>
              </div>
              <p className="font-mono text-[11px] text-on-surface-variant">
                Re-initialize the cognitive interface choice. This will clear the active state and return you to Morpheus.
              </p>
              <button
                onClick={onResetToChoice}
                className="w-full font-mono text-xs py-2.5 bg-black border border-primary text-primary hover:bg-primary hover:text-black font-bold uppercase cursor-pointer transition-all duration-150 flex items-center justify-center space-x-2 active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>TERMINATE CURRENT MIND STATE</span>
              </button>
            </div>

          </div>
        </div>

        {/* Footer Security Sign-off Info Block */}
        <div className="border-t border-outline-variant pt-4 space-y-2">
          <div className="flex items-center space-x-2 font-mono text-[10px] text-on-surface-variant">
            <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
            <span>SECURE ZION CONNECTION SEC_LEVEL: ALPHA</span>
          </div>
          <div className="font-mono text-[9px] text-on-surface-variant/75 text-center">
            CONSTRUCT_OS v4.11 // SYSTEM: ACTIVE // RE-REFRESH DISALLOWED
          </div>
        </div>

      </div>
    </div>
  );
}
