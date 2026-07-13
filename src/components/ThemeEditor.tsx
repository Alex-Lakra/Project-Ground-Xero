import React, { useState, useEffect } from 'react';
import { TerminalTheme } from '../types';
import { Save, X, Palette, Image as ImageIcon, HelpCircle } from 'lucide-react';

interface ThemeEditorProps {
  onClose: () => void;
  onThemeSaved: (theme: TerminalTheme) => void;
  currentTheme: TerminalTheme;
}

export default function ThemeEditor({ onClose, onThemeSaved, currentTheme }: ThemeEditorProps) {
  const [themeName, setThemeName] = useState(currentTheme.name || '');
  const [background, setBackground] = useState(currentTheme.background || '#121414');
  const [textColor, setTextColor] = useState(currentTheme.text || '#e2e2e2');
  const [rainColor, setRainColor] = useState(currentTheme.rainColor || '#ff0033');
  const [showHelp, setShowHelp] = useState(false);

  const handleSave = () => {
    let finalName = themeName.trim();
    if (!finalName) {
      // Auto-name generation logic
      const savedThemes = JSON.parse(localStorage.getItem('redpill_themes') || '[]') as TerminalTheme[];
      let counter = 1;
      while (savedThemes.some(t => t.name === `Untitled-${counter}`)) {
        counter++;
      }
      finalName = `Untitled-${counter}`;
    }

    const newTheme: TerminalTheme = {
      name: finalName,
      background: background.trim(),
      text: textColor.trim(),
      rainColor: rainColor.trim() || undefined,
    };

    onThemeSaved(newTheme);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#121414] text-[#e2e2e2] p-6 relative overflow-y-auto font-mono z-10 crt-screen">
      <div className="flex justify-between items-center border-b border-outline-variant pb-4 mb-6">
        <div className="flex items-center space-x-3 text-matrix-red">
          <Palette className="w-6 h-6" />
          <h2 className="text-xl font-bold tracking-wider uppercase">Theme Config Editor</h2>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-[#1a1c1c] hover:bg-[#252828] border border-outline-variant text-sm transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-3 py-1.5 border border-matrix-red text-matrix-red hover:bg-matrix-red/15 text-sm transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full space-y-8">
        
        {showHelp && (
          <div className="bg-[#1a1c1c] border border-matrix-blue/50 p-4 rounded text-sm space-y-3 mb-6">
            <h3 className="text-matrix-blue font-bold uppercase border-b border-matrix-blue/30 pb-2">Editor Arguments & Explanations</h3>
            <ul className="space-y-2 text-on-surface-variant list-disc pl-5">
              <li><strong>Theme Name:</strong> Identifier for your theme. Leaving this blank will auto-generate 'Untitled-X'.</li>
              <li><strong>Background:</strong> Accepts a standard CSS Hex Code (e.g., <code>#121414</code>).</li>
              <li><strong>Text Color:</strong> Accepts a standard CSS Hex Code to color terminal text (e.g., <code>#00ff00</code>).</li>
              <li><strong>Rain Color:</strong> Accepts a standard CSS Hex Code for the background digital rain (e.g., <code>#ff0033</code>).</li>
              <li className="text-matrix-red pt-2"><strong>Safety Protocol:</strong> Press <code>Ctrl + Shift + R</code> at any time while in the terminal to revert to the default theme if settings break the UI.</li>
            </ul>
          </div>
        )}

        <div className="space-y-6 bg-[#0c0f0f] border border-outline-variant p-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant">Theme Name</label>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="e.g. Matrix Reloaded"
              className="w-full bg-[#121414] border border-outline-variant p-2.5 text-[#e2e2e2] focus:border-matrix-red outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant">Background Color (Hex Code)</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="#000000"
                className="flex-1 bg-[#121414] border border-outline-variant p-2.5 text-[#e2e2e2] focus:border-matrix-red outline-none transition-colors"
              />
              <div className="w-10 h-10 border border-outline-variant shrink-0" style={{ backgroundColor: background }} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant">Text Color (Hex Code)</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                placeholder="#00ff00"
                className="flex-1 bg-[#121414] border border-outline-variant p-2.5 text-[#e2e2e2] focus:border-matrix-red outline-none transition-colors"
              />
              <div className="w-10 h-10 border border-outline-variant shrink-0" style={{ backgroundColor: textColor }} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant">Rain Color (Hex Code)</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={rainColor}
                onChange={(e) => setRainColor(e.target.value)}
                placeholder="#ff0033"
                className="flex-1 bg-[#121414] border border-outline-variant p-2.5 text-[#e2e2e2] focus:border-matrix-red outline-none transition-colors"
              />
              <div className="w-10 h-10 border border-outline-variant shrink-0" style={{ backgroundColor: rainColor }} />
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2.5 bg-matrix-red/10 border border-matrix-red text-matrix-red hover:bg-matrix-red/20 font-bold tracking-widest uppercase transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Save Configuration</span>
          </button>
        </div>

      </div>
    </div>
  );
}
