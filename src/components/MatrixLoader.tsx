import { useState, useEffect } from 'react';
import DigitalRain from './DigitalRain';

interface MatrixLoaderProps {
  onFinished: () => void;
}

const BOOT_LOGS = [
  { text: "INITIALIZING GROUND_XERO_OS COGNITIVE TERMINAL...", minProgress: 0 },
  { text: "ESTABLISHING SECURE GATEWAY TUNNEL VIA ZION NODE-7...", minProgress: 15 },
  { text: "BYPASSING SENTINEL FIREWALL INTRUSION DETECTORS...", minProgress: 35 },
  { text: "ALLOCATING NEURAL MEMORY SUBSPACES [OK]...", minProgress: 55 },
  { text: "DECRYPTING CORE MAIN CONSTRUCT PARAMETERS...", minProgress: 75 },
  { text: "COGNITIVE SUB-CHANNEL HANDSHAKE STABLE...", minProgress: 90 },
  { text: "ALL SYSTEM CHECKMARKS: CRITICAL_SUCCESS...", minProgress: 98 },
];

export default function MatrixLoader({ onFinished }: MatrixLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Increment progress dynamically
    const duration = 2800; // 2.8 seconds total progress time
    const intervalTime = 30; // ~33 frames/sec
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.floor((currentStep / totalSteps) * 100), 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(timer);
        // Add a slight delay at 100% before starting the fade-out
        setTimeout(() => {
          setIsFadingOut(true);
          // Wait for fade-out transition to complete (500ms)
          setTimeout(() => {
            onFinished();
          }, 500);
        }, 600);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onFinished]);

  // Sync log messages based on progress
  useEffect(() => {
    const logsToShow = BOOT_LOGS.filter(log => progress >= log.minProgress).map(log => log.text);
    setActiveLogs(logsToShow);
  }, [progress]);

  // Generate ASCII progress bar
  const totalBlocks = 20;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  const progressBar = `[${'█'.repeat(filledBlocks)}${'░'.repeat(emptyBlocks)}] ${progress}%`;

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onFinished();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 bg-[#020303] z-[9999] flex flex-col items-center justify-center font-mono text-on-surface-variant select-none transition-opacity duration-500 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      {/* Immersive Background Rain */}
      <div className="absolute inset-0 z-0">
        <DigitalRain color="#e9bcb9" density={1.2} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* Futuristic CRT Scanlines & Screen Flicker Overlay */}
      <div className="absolute inset-0 scanline-overlay opacity-30 z-10 pointer-events-none" />

      {/* Main Terminal Box Container */}
      <div className="relative z-20 w-[90%] max-w-2xl bg-black/90 border-2 border-on-surface-variant p-6 md:p-8 glow-peach crt-screen overflow-hidden">
        {/* Futuristic Tech Borders */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-on-surface-variant" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-on-surface-variant" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-on-surface-variant" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-on-surface-variant" />

        {/* Terminal Header */}
        <div className="flex justify-between items-center border-b border-on-surface-variant/50 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-on-surface-variant animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-bold">
              SYSTEM_BOOT_LINK // PORT_9911
            </span>
          </div>
          <span className="text-[10px] text-on-surface-variant/60">SYS_REV.3.11</span>
        </div>

        {/* Dynamic Typing Logs */}
        <div className="space-y-2.5 text-left min-h-[160px] md:min-h-[180px] text-xs md:text-sm font-semibold tracking-wide">
          {activeLogs.map((log, index) => {
            const isLast = index === activeLogs.length - 1;
            return (
              <div
                key={index}
                className={`flex items-start ${isLast ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]' : 'text-on-surface-variant'
                  }`}
              >
                <span className="mr-2.5 select-none">{isLast && progress < 100 ? '►' : '✔'}</span>
                <span>{log}</span>
              </div>
            );
          })}
          {progress < 100 && (
            <div className="flex items-center space-x-1 text-white animate-pulse">
              <span className="mr-2">►</span>
              <span>SYNAPSE INJECTION SEQUENCE ACTIVE</span>
              <span className="w-1.5 h-4 bg-on-surface-variant inline-block animate-[blink_0.8s_infinite]" />
            </div>
          )}
        </div>

        {/* Loading Progress Bar Container */}
        <div className="mt-8 pt-4 border-t border-on-surface-variant/30">
          <div className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest text-left mb-1.5 font-bold">
            Cognitive Decoupler Decryption Progress
          </div>
          <div className="font-mono text-sm md:text-base leading-none text-left tracking-wide whitespace-pre overflow-x-auto select-none py-1 text-on-surface-variant">
            {progressBar}
          </div>
        </div>

        {/* Floating Animation Text */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-2xl font-anton tracking-[0.25em] text-white uppercase text-center animate-pulse drop-shadow-[0_0_12px_#ffffff]">
            Entering the Matrix
          </h1>
          <p className="text-[9px] text-on-surface-variant/50 uppercase tracking-widest mt-1">
            Do not disconnect neural node connection
          </p>
        </div>
      </div>

      {/* Neon themed Bypass Option */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-30 font-mono text-[10px] text-on-surface-variant/60 hover:text-white border border-on-surface-variant/30 hover:border-white px-3 py-1 cursor-pointer bg-black/60 transition-all uppercase tracking-widest"
      >
        [ Skip Handshake ]
      </button>
    </div>
  );
}
