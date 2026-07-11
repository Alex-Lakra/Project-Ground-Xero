import { useState } from 'react';
import { PillChoice } from '../types';
import morpheusSvg from '../assets/morpheus.svg';

interface MorpheusChoiceProps {
  onChoose: (choice: PillChoice) => void;
}

export default function MorpheusChoice({ onChoose }: MorpheusChoiceProps) {
  const [hoveredPill, setHoveredPill] = useState<'none' | 'red' | 'blue'>('none');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 md:py-12 select-none relative z-10">
      {/* Narrative Intro */}
      <div className="max-w-2xl text-center mb-8 space-y-3">
        <p className="font-sans text-xs tracking-[0.2em] text-outline uppercase font-semibold">
          SYSTEM CONSTRUCT: STANDBY_MODE
        </p>
        <h2 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white tracking-wide uppercase leading-none">
          MAKE YOUR CHOICE
        </h2>
        <p className="font-mono text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          "This is your last chance. After this, there is no turning back. 
          Choose wisely, for your consciousness will adapt to the reality you select."
        </p>
      </div>

      {/* Main Morpheus Choice Card */}
      <div className="relative max-w-3xl w-full bg-[#0c0f0f] border border-outline-variant p-2 md:p-4 mb-8 group overflow-hidden">
        {/* Neon decorative scanlines & edges inside card */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary" />

        <div className="relative aspect-square w-full overflow-hidden bg-black">
          {/* Main Hotlink Image of Morpheus */}
          <img
            src={morpheusSvg}
            alt="Morpheus Red Pill Blue Pill"
            className="w-full h-full object-contain opacity-90 transition-all duration-500 brightness-105 group-hover:brightness-115 group-hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />

          {/* Interactive Pills Hover & Overlay Hotspots */}
          
          {/* Red Pill Hotspot (Morpheus's Right Hand - Left side of image) */}
          <button
            onClick={() => onChoose('red')}
            onMouseEnter={() => setHoveredPill('red')}
            onMouseLeave={() => setHoveredPill('none')}
            style={{ left: '27.68%', top: '69.02%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer focus:outline-none z-20 group/hotspot"
            aria-label="Choose Red Pill"
          >
            {/* Pulsing indicator */}
            <span className={`absolute inline-flex h-full w-full rounded-full bg-matrix-red/20 animate-ping duration-1000 ${hoveredPill === 'red' ? 'opacity-100' : 'opacity-40'}`} />
            {/* Pill capsule representation */}
            <div 
              className={`w-7 h-3.5 bg-matrix-red rounded-full -rotate-[25deg] transition-all duration-300 shadow-[0_0_15px_#ff0033] ${
                hoveredPill === 'red' ? 'scale-135 shadow-[0_0_25px_#ff0033]' : 'scale-100'
              }`}
            />
          </button>

          {/* Blue Pill Hotspot (Morpheus's Left Hand - Right side of image) */}
          <button
            onClick={() => onChoose('blue')}
            onMouseEnter={() => setHoveredPill('blue')}
            onMouseLeave={() => setHoveredPill('none')}
            style={{ left: '75.88%', top: '69.42%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer focus:outline-none z-20 group/hotspot"
            aria-label="Choose Blue Pill"
          >
            {/* Pulsing indicator */}
            <span className={`absolute inline-flex h-full w-full rounded-full bg-matrix-blue/20 animate-ping duration-1000 ${hoveredPill === 'blue' ? 'opacity-100' : 'opacity-40'}`} />
            {/* Pill capsule representation */}
            <div 
              className={`w-7 h-3.5 bg-matrix-blue rounded-full rotate-[45deg] transition-all duration-300 shadow-[0_0_15px_#0070ff] ${
                hoveredPill === 'blue' ? 'scale-135 shadow-[0_0_25px_#0070ff]' : 'scale-100'
              }`}
            />
          </button>

          {/* Glitch Overlay Text */}
          {hoveredPill !== 'none' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/90 border border-outline-variant font-mono text-xs text-center select-none animate-pulse">
              {hoveredPill === 'red' ? (
                <span className="text-matrix-red uppercase tracking-widest font-semibold">
                  &gt; CHOICE: UNVEIL THE COLD TRUTH
                </span>
              ) : (
                <span className="text-matrix-blue uppercase tracking-widest font-semibold">
                  &gt; CHOICE: MAINTAIN THE PEACEFUL DREAM
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Brutalist Button Selection Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mt-2">
        {/* Red Pill Button */}
        <button
          onClick={() => onChoose('red')}
          onMouseEnter={() => setHoveredPill('red')}
          onMouseLeave={() => setHoveredPill('none')}
          className="relative group border border-matrix-red px-6 py-4 flex flex-col items-start bg-black text-left hover:bg-matrix-red/10 cursor-pointer transition-all duration-150 active:scale-[0.99] active:duration-75 overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-matrix-red text-black font-mono text-[10px] px-1.5 py-0.5 tracking-wider font-bold">
            TRUTH
          </div>
          <span className="font-sans text-[10px] tracking-widest text-matrix-red font-bold uppercase mb-1">
            OPTION _01 // RED_PILL
          </span>
          <span className="font-anton text-2xl text-white tracking-wide uppercase group-hover:text-matrix-red transition-colors">
            AWAKEN THE MIND
          </span>
          <span className="font-mono text-[11px] text-on-surface-variant mt-2 leading-relaxed">
            Break free of the matrix. Uncover the raw decrypted truth of the machine core.
          </span>
        </button>

        {/* Blue Pill Button */}
        <button
          onClick={() => onChoose('blue')}
          onMouseEnter={() => setHoveredPill('blue')}
          onMouseLeave={() => setHoveredPill('none')}
          className="relative group border border-matrix-blue px-6 py-4 flex flex-col items-start bg-black text-left hover:bg-matrix-blue/10 cursor-pointer transition-all duration-150 active:scale-[0.99] active:duration-75 overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-matrix-blue text-white font-mono text-[10px] px-1.5 py-0.5 tracking-wider font-bold">
            DREAM
          </div>
          <span className="font-sans text-[10px] tracking-widest text-matrix-blue font-bold uppercase mb-1">
            OPTION _02 // BLUE_PILL
          </span>
          <span className="font-anton text-2xl text-white tracking-wide uppercase group-hover:text-matrix-blue transition-colors">
            EMBRACE COMFORT
          </span>
          <span className="font-mono text-[11px] text-on-surface-variant mt-2 leading-relaxed">
            Stay in the construct. Live a life of perfect, peaceful, cozy, digital illusions.
          </span>
        </button>
      </div>
    </div>
  );
}
