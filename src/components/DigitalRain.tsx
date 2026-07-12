import { useEffect, useRef } from 'react';

interface DigitalRainProps {
  color?: string;
  density?: number;
}

export default function DigitalRain({ color = '#00ff41', density = 1 }: DigitalRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions dynamically using a ResizeObserver to observe parent node changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        canvas.width = entry.contentRect.width || window.innerWidth;
        canvas.height = entry.contentRect.height || window.innerHeight;
      }
    });

    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Character set of Matrix code: Katakana symbols + standard numbers & capital alphabet characters
    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabet = katakana.split('');

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);

    // Track the vertical position of falling rain columns
    let rainDrops: number[] = [];
    
    const initRain = () => {
      columns = Math.floor(canvas.width / fontSize);
      // Stagger start positions vertically (random negative starting index)
      rainDrops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -100)); 
    };

    initRain();

    // Fallback event listener for general window resizing (if parent observer is delayed)
    const handleWindowResize = () => {
      if (!parent) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initRain();
      }
    };
    window.addEventListener('resize', handleWindowResize);

    // Main Draw loop executed on interval ticks
    const draw = () => {
      // 1. Create a transparent black overlay to fade out past characters gradually
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Set code font styles
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px monospace`;

      // 3. Draw characters in each column drop
      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        // Highlight the lead character with pure white for realistic glowing trails
        if (rainDrops[i] > 0 && Math.random() > 0.95) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = color;
        }

        ctx.fillText(text, x, y);

        // Reset drop position to top with a slight delay once it rolls past the viewport bottom
        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }

        // Advance character index downwards by the specified speed density
        rainDrops[i] += density;
      }
    };

    // Run draw ticks at ~30 FPS (33ms interval)
    const intervalId = setInterval(draw, 33);

    // Cleanup resources
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver.disconnect();
    };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-20 matrix-fade"
    />
  );
}
