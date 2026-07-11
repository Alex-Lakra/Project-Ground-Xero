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

    // Set canvas dimensions with ResizeObserver to correctly handle container size changes
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

    // Characters list (Katakana + standard numbers/letters)
    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabet = katakana.split('');

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);

    // Rain drop states
    let rainDrops: number[] = [];
    
    const initRain = () => {
      columns = Math.floor(canvas.width / fontSize);
      rainDrops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -100)); // stagger start positions
    };

    initRain();

    // Redraw on resize
    const handleWindowResize = () => {
      if (!parent) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initRain();
      }
    };
    window.addEventListener('resize', handleWindowResize);

    const draw = () => {
      // Create a fading trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        // Pick a random character
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        // Draw character
        // Highlight head of rain drop with pure white
        if (rainDrops[i] > 0 && Math.random() > 0.95) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = color;
        }

        ctx.fillText(text, x, y);

        // Reset drop to top if it reaches bottom
        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }

        // Increment drop position
        rainDrops[i] += density;
      }
    };

    const intervalId = setInterval(draw, 33);

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
