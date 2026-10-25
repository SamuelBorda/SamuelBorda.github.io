import React, { useState, useEffect } from 'react';
import { ArrowUp, Clock, GitBranch, Eye } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';

interface FooterProps {
  onToggleZenMode?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onToggleZenMode }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'America/La_Paz',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
        setTimeStr(new Intl.DateTimeFormat('es-BO', options).format(now));
      } catch {
        setTimeStr('21:55:00');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#05060b]/85 backdrop-blur-xl py-10 px-4 font-mono text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Author & Profession */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fcee0a]"></span>
            <span className="text-white font-medium">{userProfile.name}</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <span className="hidden sm:inline text-zinc-600">·</span>
          <span className="text-zinc-400">Ingeniero en Sistemas</span>
        </div>

        {/* Center: Live UTC-4 Clock & GitHub & Zen Mode */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* UTC-4 Live Clock */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Cochabamba [UTC-4]</span>
            <span className="text-white font-semibold tabular-nums">{timeStr || '21:55:00'}</span>
          </div>

          {/* GitHub Telemetry Status */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-300">
            <GitBranch className="w-3.5 h-3.5 text-[#fcee0a]" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">GitHub Activo</span>
          </div>

          {/* Zen Mode Button */}
          {onToggleZenMode && (
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleZenMode();
              }}
              onMouseEnter={() => soundManager.playHover()}
              title="Activar vista inmersiva 3D sin elementos en pantalla"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-white/[0.07] border border-white/[0.08] hover:border-cyan-400/40 text-zinc-400 hover:text-cyan-300 transition-all cursor-pointer active:scale-95"
            >
              <Eye className="w-3 h-3 text-[#00f0ff]" />
              <span className="hidden sm:inline">Modo Zen (3D)</span>
            </button>
          )}
        </div>

        {/* Right: Scroll to top */}
        <button
          onClick={scrollToTop}
          onMouseEnter={() => soundManager.playHover()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 active:scale-95 transition-all cursor-pointer"
        >
          <span>Volver arriba</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#00f0ff]" />
        </button>
      </div>
    </footer>
  );
};
