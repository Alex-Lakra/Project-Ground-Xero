import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Plus, Trash2, Heart, Moon, Smile, Sparkles } from 'lucide-react';
import { ComfortableTask, DreamRecord } from '../types';

export default function BluePillConstruct() {
  // ==========================================
  // State Definitions
  // ==========================================
  
  // Comfort rating status level (out of 100)
  const [comfortLevel, setComfortLevel] = useState(100);

  // Calming Audio Ambience Synthesizer state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<'cafe' | 'meadow' | 'static' | 'office'>('cafe');
  const [volume, setVolume] = useState(0.5);

  // Daily comfortable calendar schedule tasks state
  const [tasks, setTasks] = useState<ComfortableTask[]>([
    { id: '1', text: 'Sip a warm vanilla latte', completed: true, time: '09:00' },
    { id: '2', text: 'Walk in the virtual sunflower field', completed: false, time: '12:00' },
    { id: '3', text: 'Listen to soft cafe acoustic guitar', completed: true, time: '14:30' },
    { id: '4', text: 'Order gourmet dinner with delivery', completed: false, time: '18:00' },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('10:00');

  // Subconscious diary dream records storage state
  const [dreams, setDreams] = useState<DreamRecord[]>([
    {
      id: 'd1',
      title: 'Floating over blue valleys',
      content: 'I was floating over endless valleys of indigo wildflowers. The wind felt warm and smelled of honey and fresh bread. Everyone I spoke with smiled and agreed with me.',
      date: 'July 10, 2026',
      pleasantness: 5,
    },
    {
      id: 'd2',
      title: 'A warm cottage in the rain',
      content: 'Sitting inside a perfect stone cottage beside a crackling fire. It was raining softly outside. I had a heavy blanket and an endless cup of chamomile tea.',
      date: 'July 09, 2026',
      pleasantness: 4,
    }
  ]);
  const [newDreamTitle, setNewDreamTitle] = useState('');
  const [newDreamContent, setNewDreamContent] = useState('');
  const [newDreamPleasantness, setNewDreamPleasantness] = useState(5);

  // ==========================================
  // Effects & Lifecycles
  // ==========================================

  // Calming Ambience Synthesizer: Generates pleasant, low-stress therapeutic frequencies dynamically
  useEffect(() => {
    if (!isPlaying) return;

    // Create web audio context for pleasant calming low frequencies
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    let audioCtx: AudioContext | null = null;
    let biquadFilter: BiquadFilterNode | null = null;
    let gainNode: GainNode | null = null;
    let oscillator: OscillatorNode | null = null;

    try {
      audioCtx = new AudioContextClass();
      oscillator = audioCtx.createOscillator();
      biquadFilter = audioCtx.createBiquadFilter();
      gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      
      // Calibrate frequency presets based on active sound ambience setting
      if (activeSound === 'cafe') {
        oscillator.frequency.setValueAtTime(80, audioCtx.currentTime); // Low cafe rumble
        biquadFilter.type = 'lowpass';
        biquadFilter.frequency.setValueAtTime(150, audioCtx.currentTime);
      } else if (activeSound === 'meadow') {
        oscillator.frequency.setValueAtTime(110, audioCtx.currentTime); // Gentle meadow hum
        biquadFilter.type = 'peaking';
        biquadFilter.frequency.setValueAtTime(220, audioCtx.currentTime);
      } else if (activeSound === 'static') {
        oscillator.frequency.setValueAtTime(55, audioCtx.currentTime); // Warm brown static hum
        biquadFilter.type = 'lowpass';
        biquadFilter.frequency.setValueAtTime(80, audioCtx.currentTime);
      } else {
        oscillator.frequency.setValueAtTime(120, audioCtx.currentTime); // Air conditioning hum
        biquadFilter.type = 'notch';
        biquadFilter.frequency.setValueAtTime(300, audioCtx.currentTime);
      }

      oscillator.connect(biquadFilter);
      biquadFilter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Lock gain low to maintain a calming volume
      gainNode.gain.setValueAtTime(volume * 0.15, audioCtx.currentTime);
      oscillator.start();
    } catch (e) {
      console.error('Audio initialization blocked or unsupported:', e);
    }

    return () => {
      if (oscillator) {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch (_) {}
      }
      if (audioCtx) {
        try {
          audioCtx.close();
        } catch (_) {}
      }
    };
  }, [isPlaying, activeSound, volume]);

  // Load user data from localStorage
  useEffect(() => {
    const savedDreams = localStorage.getItem('construct_dreams');
    if (savedDreams) setDreams(JSON.parse(savedDreams));

    const savedTasks = localStorage.getItem('construct_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  // ==========================================
  // Helper Actions & Persistence
  // ==========================================

  const saveDreamsToStorage = (updatedDreams: DreamRecord[]) => {
    localStorage.setItem('construct_dreams', JSON.stringify(updatedDreams));
  };

  const saveTasksToStorage = (updatedTasks: ComfortableTask[]) => {
    localStorage.setItem('construct_tasks', JSON.stringify(updatedTasks));
  };

  // ==========================================
  // Task Logic Handlers
  // ==========================================

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    saveTasksToStorage(updated);

    // Dynamic comfort rating based on completions
    const completedCount = updated.filter(t => t.completed).length;
    setComfortLevel(Math.min(100, 80 + Math.floor((completedCount / updated.length) * 20)));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const added: ComfortableTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      time: newTaskTime,
    };
    const updated = [...tasks, added];
    setTasks(updated);
    saveTasksToStorage(updated);
    setNewTaskText('');
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveTasksToStorage(updated);
  };

  // ==========================================
  // Dream Logic Handlers
  // ==========================================

  const handleAddDream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDreamTitle.trim() || !newDreamContent.trim()) return;

    const added: DreamRecord = {
      id: Date.now().toString(),
      title: newDreamTitle.trim(),
      content: newDreamContent.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      pleasantness: newDreamPleasantness,
    };

    const updated = [added, ...dreams];
    setDreams(updated);
    saveDreamsToStorage(updated);

    setNewDreamTitle('');
    setNewDreamContent('');
    setNewDreamPleasantness(5);
  };

  const handleDeleteDream = (id: string) => {
    const updated = dreams.filter(d => d.id !== id);
    setDreams(updated);
    saveDreamsToStorage(updated);
  };

  // ==========================================
  // Chart Visual Computations
  // ==========================================

  // Asset projection ticker details (simulated steady dream-like climb)
  const chartPoints = [
    { label: 'Jan', val: 120000 },
    { label: 'Feb', val: 125000 },
    { label: 'Mar', val: 132000 },
    { label: 'Apr', val: 141000 },
    { label: 'May', val: 148000 },
    { label: 'Jun', val: 156000 },
    { label: 'Jul', val: 168000 },
  ];

  const maxVal = 180000;
  const minVal = 100000;
  const width = 500;
  const height = 150;

  // Map asset data array values to matching SVG coordinate paths
  const pointsString = chartPoints.map((p, idx) => {
    const x = (idx / (chartPoints.length - 1)) * width;
    const y = height - ((p.val - minVal) / (maxVal - minVal)) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPointsString = `0,${height} ${pointsString} ${width},${height}`;

  // ==========================================
  // Layout Rendering
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-8 select-none">
      
      {/* 1. Welcome Construct Citizen Banner */}
      <div className="bg-black border border-matrix-blue p-6 md:p-8 relative">
        <div className="absolute top-0 right-0 bg-matrix-blue text-white font-mono text-xs px-2.5 py-0.5 uppercase tracking-widest font-bold">
          CONSTRUCT VERIFIED
        </div>
        <div className="space-y-2">
          <span className="font-sans text-xs text-matrix-blue tracking-[0.2em] font-bold uppercase">
            SECTOR 07 // COZY CITIZEN PORTAL
          </span>
          <h2 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white tracking-wide uppercase leading-none">
            WELCOME BACK TO THE CONSTRUCT
          </h2>
          <p className="font-mono text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Your environment has been fully calibrated for optimal peace and minimal stress. 
            Enjoy standard-citizen conveniences, track your schedule, and capture pleasant memories in total security.
          </p>
        </div>
      </div>

      {/* Dashboard Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Dashboard Column (Vitals & Ambient Synthesizer) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Diagnostic vitals card */}
          <div className="bg-[#111111] border border-outline-variant p-6 space-y-4">
            <h3 className="font-anton text-xl tracking-wider text-white uppercase">VITAL STABILIZERS</h3>
            
            <div className="space-y-4 font-mono text-xs">
              {/* Vitals: Cognitive Comfort level */}
              <div className="space-y-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>COGNITIVE COMFORT</span>
                  <span className="text-matrix-blue font-bold">{comfortLevel}%</span>
                </div>
                <div className="w-full bg-black h-2 border border-outline-variant">
                  <div 
                    className="bg-matrix-blue h-full transition-all duration-500" 
                    style={{ width: `${comfortLevel}%` }}
                  />
                </div>
              </div>

              {/* Vitals: Environmental Stress */}
              <div className="space-y-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>ENVIRONMENTAL STRESS</span>
                  <span className="text-matrix-blue font-bold">0% [STABLE]</span>
                </div>
                <div className="w-full bg-black h-2 border border-outline-variant">
                  <div className="bg-matrix-blue h-full w-[2%] shadow-[0_0_8px_#0070ff]" />
                </div>
              </div>

              {/* Vitals: Pulse rates */}
              <div className="flex items-center justify-between border-t border-outline-variant/50 pt-3">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-matrix-blue animate-pulse" />
                  <span className="text-on-surface-variant">HEART RATE</span>
                </div>
                <span className="text-white font-bold">68 BPM</span>
              </div>

              {/* Vitals: Dream stabilizer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="w-4 h-4 text-matrix-blue" />
                  <span className="text-on-surface-variant">DREAM STABILIZER</span>
                </div>
                <span className="text-white font-bold">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Ambience audio synthesizer panel */}
          <div className="bg-[#111111] border border-outline-variant p-6 space-y-4 relative overflow-hidden">
            <h3 className="font-anton text-xl tracking-wider text-white uppercase flex items-center space-x-2">
              <span>COZY AMBIENCE</span>
              {isPlaying && (
                <span className="flex space-x-0.5 items-end h-3 w-4">
                  <span className="w-0.5 bg-matrix-blue h-3 animate-[pulse_1s_infinite]" />
                  <span className="w-0.5 bg-matrix-blue h-2 animate-[pulse_0.8s_infinite_delay-150]" />
                  <span className="w-0.5 bg-matrix-blue h-3.5 animate-[pulse_1.2s_infinite_delay-300]" />
                </span>
              )}
            </h3>

            {/* Glowing feedback listener button */}
            <div className="flex justify-center py-4 relative">
              <div className={`w-28 h-28 border border-outline-variant flex items-center justify-center transition-all duration-300 ${
                isPlaying ? 'border-matrix-blue glow-blue scale-105' : ''
              }`}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-20 h-20 bg-black hover:bg-matrix-blue/10 border text-white font-mono text-xs uppercase tracking-widest font-bold flex flex-col items-center justify-center cursor-pointer transition-all rounded-xs ${
                    isPlaying ? 'border-matrix-blue text-matrix-blue' : 'border-outline-variant'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-5 h-5 mb-1 text-matrix-blue" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 mb-1" />
                      <span>LISTEN</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Presets selectors */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              {[
                { id: 'cafe', name: 'Rainy Cafe' },
                { id: 'meadow', name: 'Meadow Hum' },
                { id: 'static', name: 'White Static' },
                { id: 'office', name: 'Comfort Office' },
              ].map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => setActiveSound(sound.id as any)}
                  className={`py-1.5 border text-center cursor-pointer transition-all rounded-xs ${
                    activeSound === sound.id
                      ? 'border-matrix-blue bg-matrix-blue/15 text-white font-bold'
                      : 'border-outline-variant text-on-surface-variant hover:text-white'
                  }`}
                >
                  {sound.name}
                </button>
              ))}
            </div>

            {/* Synth Volume slider */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
                <span>VOLUME</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-matrix-blue bg-black border border-outline-variant h-1 cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Right Dashboard Column (Calendar Schedule & SVG Asset Curve) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* daily calendar tasks list */}
          <div className="bg-[#111111] border border-outline-variant p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2">
              <h3 className="font-anton text-xl tracking-wider text-white uppercase">DAILY COZY CALENDAR</h3>
              <span className="font-mono text-xs text-matrix-blue uppercase font-semibold">
                CALIBRATED TASKS
              </span>
            </div>

            {/* Tasks list */}
            <div className="space-y-1 font-mono text-xs">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border-b border-outline-variant/30 hover:bg-black/40 group"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-5 h-5 border flex items-center justify-center cursor-pointer ${
                        task.completed 
                          ? 'border-matrix-blue bg-matrix-blue/20 text-matrix-blue' 
                          : 'border-outline-variant hover:border-white'
                      }`}
                    >
                      {task.completed && '✓'}
                    </button>
                    <span className="text-outline-variant w-12 font-bold">{task.time}</span>
                    <span className={`text-on-background ${task.completed ? 'line-through text-on-surface-variant/50' : 'text-white'}`}>
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-matrix-red border border-transparent hover:border-outline-variant cursor-pointer text-on-surface-variant transition-opacity rounded-xs"
                    aria-label="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Suggest Task form */}
            <form onSubmit={handleAddTask} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Suggest a comfortable task..."
                className="flex-1 bg-black border border-outline-variant text-white font-mono text-xs p-2.5 focus:border-matrix-blue outline-none"
              />
              <input
                type="text"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                placeholder="Time"
                className="w-20 bg-black border border-outline-variant text-white font-mono text-xs p-2.5 focus:border-matrix-blue outline-none text-center"
              />
              <button
                type="submit"
                className="bg-matrix-blue hover:bg-matrix-blue/80 text-white border border-matrix-blue font-sans text-xs uppercase tracking-wider font-bold px-4 cursor-pointer flex items-center space-x-1.5 active:scale-95 rounded-xs"
              >
                <Plus className="w-4 h-4" />
                <span>ADD</span>
              </button>
            </form>
          </div>

          {/* SVG Area Chart asset projection panel */}
          <div className="bg-[#111111] border border-outline-variant p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-anton text-xl tracking-wider text-white uppercase">CITIZEN SAVINGS PORTFOLIO</h3>
                <p className="font-mono text-[11px] text-on-surface-variant">Guaranteed upward trajectory index.</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-matrix-blue block uppercase font-semibold">PROJECTED ASSETS</span>
                <span className="font-sans text-xl text-white font-bold">$168,000.00</span>
              </div>
            </div>

            {/* SVG area drawing element */}
            <div className="relative w-full bg-black border border-outline-variant p-4">
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-[150px] overflow-visible"
              >
                {/* Horizontal reference grids */}
                <line x1="0" y1="37.5" x2={width} y2="37.5" stroke="#222" strokeDasharray="3,3" />
                <line x1="0" y1="75" x2={width} y2="75" stroke="#222" strokeDasharray="3,3" />
                <line x1="0" y1="112.5" x2={width} y2="112.5" stroke="#222" strokeDasharray="3,3" />

                {/* Shading area fill below curve */}
                <polygon 
                  points={areaPointsString} 
                  fill="url(#blueGlow)" 
                  opacity="0.12" 
                />

                {/* Main curve polyline */}
                <polyline
                  fill="none"
                  stroke="#0070ff"
                  strokeWidth="2.5"
                  points={pointsString}
                  className="shadow-[0_0_10px_rgba(0,112,255,0.5)]"
                />

                {/* Nodes coordinates points loops */}
                {chartPoints.map((p, idx) => {
                  const x = (idx / (chartPoints.length - 1)) * width;
                  const y = height - ((p.val - minVal) / (maxVal - minVal)) * height;
                  return (
                    <g key={idx} className="group/node">
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#0070ff"
                        className="cursor-pointer hover:r-6"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#0070ff"
                        opacity="0.25"
                        className="group-hover/node:animate-ping"
                      />
                    </g>
                  );
                })}

                {/* Gradient shader map details */}
                <defs>
                  <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0070ff" />
                    <stop offset="100%" stopColor="#000" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Labels list */}
              <div className="flex justify-between font-mono text-[9px] text-on-surface-variant pt-2">
                {chartPoints.map((p, idx) => (
                  <span key={idx}>{p.label}</span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Subconscious memory journal storage card grid panel */}
      <div className="bg-black border border-outline-variant p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <div className="flex items-center space-x-2">
            <Smile className="w-5 h-5 text-matrix-blue" />
            <h3 className="font-anton text-2xl tracking-wider text-white uppercase">PLEASANT DREAMS STORAGE</h3>
          </div>
          <span className="font-mono text-xs text-matrix-blue uppercase font-semibold">
            SUBCONSCIOUS DATA RECORD
          </span>
        </div>

        {/* Add dream form */}
        <form onSubmit={handleAddDream} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#111111] p-4 border border-outline-variant/60">
          
          <div className="md:col-span-4 space-y-2">
            <label className="block font-mono text-[10px] text-on-surface-variant uppercase font-bold">
              Memory Title
            </label>
            <input
              type="text"
              value={newDreamTitle}
              onChange={(e) => setNewDreamTitle(e.target.value)}
              placeholder="e.g., A walk in the warm rain"
              className="w-full bg-black border border-outline-variant text-white font-mono text-xs p-2.5 focus:border-matrix-blue outline-none"
            />
          </div>

          <div className="md:col-span-5 space-y-2">
            <label className="block font-mono text-[10px] text-on-surface-variant uppercase font-bold">
              Description
            </label>
            <input
              type="text"
              value={newDreamContent}
              onChange={(e) => setNewDreamContent(e.target.value)}
              placeholder="Describe the peaceful details..."
              className="w-full bg-black border border-outline-variant text-white font-mono text-xs p-2.5 focus:border-matrix-blue outline-none"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block font-mono text-[10px] text-on-surface-variant uppercase font-bold">
              Comfort Level (1-5)
            </label>
            <select
              value={newDreamPleasantness}
              onChange={(e) => setNewDreamPleasantness(parseInt(e.target.value))}
              className="w-full bg-black border border-outline-variant text-white font-mono text-xs p-2.5 focus:border-matrix-blue outline-none"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} - {'★'.repeat(n)}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full bg-matrix-blue hover:bg-matrix-blue/80 text-white border border-matrix-blue font-sans text-xs uppercase tracking-wider font-bold py-2.5 cursor-pointer flex items-center justify-center space-x-1.5 active:scale-95 rounded-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>RECORD</span>
            </button>
          </div>
        </form>

        {/* Grid grid-list cards for journal logs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dreams.map((dream) => (
            <div
              key={dream.id}
              className="bg-[#111111] border border-outline-variant p-4 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-anton text-lg text-white tracking-wide uppercase">{dream.title}</h4>
                  <button
                    onClick={() => handleDeleteDream(dream.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-matrix-red border border-transparent hover:border-outline-variant cursor-pointer text-on-surface-variant transition-opacity rounded-xs"
                    aria-label="Delete Dream"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-mono text-xs text-[#e9bcb9] leading-relaxed">
                  {dream.content}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-outline-variant/30 pt-3 mt-4 font-mono text-[10px]">
                <span className="text-on-surface-variant">{dream.date}</span>
                <span className="text-matrix-blue font-bold tracking-wider">
                  STABILIZATION: {'★'.repeat(dream.pleasantness)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
