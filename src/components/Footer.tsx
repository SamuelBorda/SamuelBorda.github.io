import React from 'react';
import { ArrowUp } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#05060b]/80 backdrop-blur-xl py-10 px-4 font-mono text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#fcee0a]"></span>
          <span>
            {userProfile.name} © {new Date().getFullYear()} · <span className="text-zinc-300">Ingeniero en Sistemas</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400">
          <span>Diseñado para</span>
          <span className="text-[#00f0ff] font-bold">GitHub Pages & WebGL</span>
        </div>

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
