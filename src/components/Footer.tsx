import React from 'react';
import { ArrowUp, Terminal } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-900 bg-[#06070a] py-12 px-4 font-mono text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>
            {userProfile.handle.toUpperCase()} © {new Date().getFullYear()} // TODOS LOS DERECHOS RESERVADOS
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Diseñado para alto rendimiento en</span>
          <span className="text-cyan-400 font-bold">GitHub Pages</span>
        </div>

        <button
          onClick={scrollToTop}
          onMouseEnter={() => soundManager.playHover()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
        >
          <span>VOLVER ARRIBA</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
