import React, { useEffect, useState, useRef } from 'react';

interface TrailDot {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface CyberCursorProps {
  isPiloting?: boolean;
}

export const CyberCursor: React.FC<CyberCursorProps> = ({ isPiloting = false }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const dotIdRef = useRef(0);

  useEffect(() => {
    // Only enable custom cursor if device has a precise pointer (mouse, not touchscreen)
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setActive(true);

      // Add trail dot periodically (only when not piloting)
      if (!isPiloting && Math.random() > 0.4) {
        dotIdRef.current += 1;
        const colors = ['#fcee0a', '#00f0ff', '#ff003c'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newDot: TrailDot = {
          id: dotIdRef.current,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          color: randomColor,
        };
        setTrail((prev) => [...prev.slice(-18), newDot]);
      }
    };

    const handleMouseDown = () => {
      setClicking(true);
      setTimeout(() => setClicking(false), 200);
    };

    const handleMouseLeave = () => {
      setActive(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Fade trail dots
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 45);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(interval);
    };
  }, [isPiloting]);

  // Hide completely during flight mode so ship cockpit controls have full view
  if (!active || isPiloting) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Particle trail embers */}
      {trail.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full transition-opacity duration-300"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: dot.color,
            boxShadow: `0 0 8px ${dot.color}`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.7,
          }}
        />
      ))}

      {/* Cyberpunk HUD Reticle Tracker */}
      <div
        className="absolute transition-transform duration-75 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${clicking ? 1.4 : 1})`,
        }}
      >
        {/* Outer Rotating Crosshair Ring */}
        <div className="relative w-8 h-8 rounded-full border border-[#00f0ff]/80 flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#fcee0a]"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#fcee0a]"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#00f0ff]"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#00f0ff]"></div>
        </div>

        {/* Center Target Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#fcee0a] shadow-sm shadow-[#fcee0a]" />
      </div>
    </div>
  );
};
