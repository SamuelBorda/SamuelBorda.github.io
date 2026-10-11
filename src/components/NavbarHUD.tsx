import React, { useState } from 'react';
import { Volume2, VolumeX, Terminal, Tv, Sparkles, Menu, X } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';

interface NavbarHUDProps {
  onOpenTerminal: () => void;
  scanlinesActive: boolean;
  onToggleScanlines: () => void;
}

export const NavbarHUD: React.FC<NavbarHUDProps> = ({
  onOpenTerminal,
  scanlinesActive,
  onToggleScanlines,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    soundManager.enabled = nextState;
    if (nextState) {
      soundManager.playClick();
    }
  };

  const handleNavClick = () => {
    soundManager.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#090a0f]/80 border-b border-cyan-500/20 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Player Status / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/70 border border-cyan-500/50 shadow-inner group cursor-pointer"
            onClick={() => {
              soundManager.playSuccess();
            }}
          >
            <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-widest text-cyan-400 font-mono">
                {userProfile.handle.toUpperCase()}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded">
                LVL {userProfile.level}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ONLINE <span className="text-slate-600">|</span> CLASS: FULLSTACK
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-slate-300">
          <a
            href="#projects"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 py-1 px-2 rounded hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
          >
            <span className="text-cyan-400">[01]</span> Misiones / Proyectos
          </a>
          <a
            href="#skills"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 py-1 px-2 rounded hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
          >
            <span className="text-cyan-400">[02]</span> Inventario Tech
          </a>
          <a
            href="#about"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 py-1 px-2 rounded hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
          >
            <span className="text-cyan-400">[03]</span> Stats Jugador
          </a>
          <a
            href="#contact"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 py-1 px-2 rounded hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
          >
            <span className="text-cyan-400">[04]</span> Transmisión
          </a>
        </nav>

        {/* Action Controls (Audio, CRT, Terminal, GitHub) */}
        <div className="flex items-center gap-2">
          {/* Terminal button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTerminal();
            }}
            onMouseEnter={() => soundManager.playHover()}
            title="Abrir Terminal Holográfica"
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 text-xs font-mono"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">CLI</span>
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleScanlines();
            }}
            onMouseEnter={() => soundManager.playHover()}
            title={scanlinesActive ? 'Desactivar efecto CRT' : 'Activar efecto CRT'}
            className={`p-2 rounded-lg border transition-all text-xs ${
              scanlinesActive
                ? 'bg-purple-900/40 border-purple-500 text-purple-300'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => soundManager.playHover()}
            title={soundOn ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
            className={`p-2 rounded-lg border transition-all ${
              soundOn
                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-400'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-500'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* GitHub direct link */}
          <a
            href={userProfile.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            onMouseEnter={() => soundManager.playHover()}
            title="Ver GitHub"
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-all"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2 font-mono text-xs">
          <a
            href="#projects"
            onClick={handleNavClick}
            className="py-2 px-3 rounded hover:bg-cyan-500/10 text-slate-200 hover:text-cyan-400"
          >
            [01] Misiones / Proyectos
          </a>
          <a
            href="#skills"
            onClick={handleNavClick}
            className="py-2 px-3 rounded hover:bg-cyan-500/10 text-slate-200 hover:text-cyan-400"
          >
            [02] Inventario Tech
          </a>
          <a
            href="#about"
            onClick={handleNavClick}
            className="py-2 px-3 rounded hover:bg-cyan-500/10 text-slate-200 hover:text-cyan-400"
          >
            [03] Stats Jugador
          </a>
          <a
            href="#contact"
            onClick={handleNavClick}
            className="py-2 px-3 rounded hover:bg-cyan-500/10 text-slate-200 hover:text-cyan-400"
          >
            [04] Transmisión
          </a>
        </div>
      )}
    </header>
  );
};
