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
    <footer className="border-t border-slate-900 bg-[#030406]/70 backdrop-blur-sm py-12 px-4 font-mono text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#fcee0a]" />
          <span>
            {userProfile.handle} © {new Date().getFullYear()} // NIGHT CITY NETRUNNER PROTOCOL
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Static Export Optimizado para</span>
          <span className="text-[#00f0ff] font-bold">GitHub Pages</span>
        </div>

        <button
          onClick={scrollToTop}
          onMouseEnter={() => soundManager.playHover()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0c12] border border-slate-800 text-slate-300 hover:text-[#fcee0a] hover:border-[#fcee0a]/50 transition-colors"
        >
          <span>TOP // REGRESAR</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
