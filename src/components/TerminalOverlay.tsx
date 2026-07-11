import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TermIcon, Send, X } from 'lucide-react';

interface TerminalOverlayProps {
  onClose: () => void;
  onExecuteCommand: (cmd: string) => string;
}

export default function TerminalOverlay({ onClose, onExecuteCommand }: TerminalOverlayProps) {
  const [history, setHistory] = useState<string[]>([
    'CONSTRUCT_OS INTERACTIVE TERMINAL ENGINE v4.11',
    'Type /help to display authorized mainframe operations.',
    ''
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const newHistory = [...history, `> ${trimmedInput}`];
    setHistory(newHistory);
    setInput('');

    // Simulate short processing delay
    setTimeout(() => {
      const output = onExecuteCommand(trimmedInput);
      setHistory(prev => [...prev, output, '']);
    }, 100);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 w-full max-w-lg bg-black border border-outline-variant p-4 text-matrix-green shadow-[0_0_20px_rgba(0,255,65,0.15)] flex flex-col h-[350px]">
      {/* Terminal Title */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-2 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <TermIcon className="w-4 h-4 text-matrix-green" />
          <span className="font-bold tracking-widest uppercase">CONSTRUCT_OS CORE SHELL</span>
        </div>
        <button
          onClick={onClose}
          className="p-0.5 hover:text-white border border-transparent hover:border-outline-variant text-matrix-green cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 pr-1">
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap leading-relaxed">
            {line.startsWith('>') ? (
              <span className="text-white">{line}</span>
            ) : line.includes('[ERROR]') ? (
              <span className="text-matrix-red">{line}</span>
            ) : line.includes('[SUCCESS]') ? (
              <span className="text-matrix-green font-semibold">{line}</span>
            ) : (
              <span>{line}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleSubmit} className="mt-2 flex items-center border border-outline-variant bg-black">
        <span className="pl-2 pr-1 font-mono text-xs text-white select-none">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command (e.g. /help)..."
          className="flex-1 bg-transparent border-0 outline-none p-2 font-mono text-xs text-white placeholder-matrix-green/30"
          autoFocus
        />
        <button
          type="submit"
          className="p-2 text-matrix-green hover:text-white cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
