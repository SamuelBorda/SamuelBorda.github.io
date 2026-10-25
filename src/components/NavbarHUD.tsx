import React, { useState } from 'react';
import { Volume2, Terminal, Menu, X, ArrowUpRight, Search } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';

interface NavbarHUDProps {
  onOpenTerminal: () => void;
  onOpenCommandPalette: () => void;
  onToggleSoundscape: () => void;
  isSoundscapeActive: boolean;
  scanlinesActive: boolean;
  onToggleScanlines: () => void;
}

export const NavbarHUD: React.FC<NavbarHUDProps> = ({
  onOpenTerminal,
  onOpenCommandPalette,
  onToggleSoundscape,
  isSoundscapeActive,
  scanlinesActive,
  onToggleScanlines,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    soundManager.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl transition-all duration-300">
      <div className="relative flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full backdrop-blur-2xl bg-[#07090e]/80 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
        {/* Left: Brand Identity / Monogram */}
        <a
          href="#"
          onClick={() => soundManager.playSuccess()}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#fcee0a] via-[#00f0ff] to-[#ff003c] p-[1.5px] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-[#07090e] flex items-center justify-center font-mono text-xs font-black text-white">
              SB
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white font-mono group-hover:text-[#fcee0a] transition-colors">
              Samuel Borda
            </span>
            <span className="text-[10px] text-zinc-400 font-mono -mt-0.5">
              Ingeniero en Sistemas
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full p-1 font-mono text-xs text-zinc-300">
          <a
            href="#projects"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/[0.08] transition-all"
          >
            Proyectos
          </a>
          <a
            href="#skills"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/[0.08] transition-all"
          >
            Stack & Habilidades
          </a>
          <a
            href="#contact"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="px-4 py-1.5 rounded-full hover:text-[#fcee0a] hover:bg-white/[0.08] transition-all flex items-center gap-1"
          >
            <span>Contacto</span>
            <ArrowUpRight className="w-3 h-3 text-[#fcee0a]" />
          </a>
        </nav>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search / Command Palette Shortcut Pill */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCommandPalette();
            }}
            onMouseEnter={() => soundManager.playHover()}
            title="Abrir paleta de comandos rápidos (Ctrl + K)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#00f0ff]/40 text-zinc-300 hover:text-white transition-all text-xs font-mono cursor-pointer active:scale-95"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[10px] text-zinc-400 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/10 font-bold">
              ⌘K
            </span>
          </button>

          {/* Cosmic Soundscape with Animated Mini Equalizer */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSoundscape();
            }}
            onMouseEnter={() => soundManager.playHover()}
            title={
              isSoundscapeActive
                ? 'Pausar paisaje sonoro espacial (432Hz)'
                : 'Activar paisaje sonoro cósmico (Web Audio 432Hz)'
            }
            className={`px-2.5 py-1.5 rounded-full border transition-all text-xs active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              isSoundscapeActive
                ? 'bg-[#00f0ff]/15 border-[#00f0ff]/50 text-[#00f0ff]'
                : 'bg-white/[0.03] border-white/10 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]'
            }`}
          >
            {isSoundscapeActive ? (
              <div className="flex items-end gap-0.5 h-3.5 px-0.5">
                <span className="w-0.5 bg-[#00f0ff] rounded-full animate-eq-1" />
                <span className="w-0.5 bg-[#00f0ff] rounded-full animate-eq-2" />
                <span className="w-0.5 bg-[#00f0ff] rounded-full animate-eq-3" />
              </div>
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden lg:inline text-[10px] font-mono font-medium">
              {isSoundscapeActive ? '432Hz' : 'Audio'}
            </span>
          </button>

          {/* CLI Terminal Pill */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTerminal();
            }}
            onMouseEnter={() => soundManager.playHover()}
            title="Abrir Terminal CLI"
            className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#00f0ff]/10 border border-white/10 hover:border-[#00f0ff]/50 text-zinc-200 hover:text-[#00f0ff] transition-all flex items-center gap-1.5 text-xs font-mono font-semibold active:scale-95 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="hidden sm:inline">CLI</span>
          </button>

          {/* GitHub Direct Link */}
          <a
            href={userProfile.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            onMouseEnter={() => soundManager.playHover()}
            title="Ver GitHub Oficial"
            className="p-2 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#fcee0a] text-zinc-300 hover:text-[#fcee0a] hover:bg-white/[0.08] transition-all active:scale-95"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-full bg-white/[0.03] border border-white/10 text-zinc-300 active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-3 rounded-2xl backdrop-blur-2xl bg-[#07090e]/95 border border-white/10 shadow-2xl flex flex-col gap-1 font-mono text-xs">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCommandPalette();
            }}
            className="py-2.5 px-4 rounded-xl hover:bg-white/[0.08] text-zinc-200 hover:text-[#00f0ff] transition-colors flex items-center justify-between text-left"
          >
            <span>Buscar / Comandos</span>
            <span className="text-[10px] text-zinc-500">Ctrl+K</span>
          </button>
          <a
            href="#projects"
            onClick={handleNavClick}
            className="py-2.5 px-4 rounded-xl hover:bg-white/[0.08] text-zinc-200 hover:text-[#00f0ff] transition-colors"
          >
            01 // Proyectos
          </a>
          <a
            href="#skills"
            onClick={handleNavClick}
            className="py-2.5 px-4 rounded-xl hover:bg-white/[0.08] text-zinc-200 hover:text-[#00f0ff] transition-colors"
          >
            02 // Stack & Habilidades
          </a>
          <a
            href="#contact"
            onClick={handleNavClick}
            className="py-2.5 px-4 rounded-xl hover:bg-white/[0.08] text-zinc-200 hover:text-[#fcee0a] transition-colors"
          >
            03 // Contacto
          </a>
          <button
            onClick={() => {
              onToggleScanlines();
              handleNavClick();
            }}
            className="py-2 px-4 rounded-xl hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors text-left flex items-center justify-between"
          >
            <span>Scanlines CRT</span>
            <span className="text-[10px] text-zinc-500">{scanlinesActive ? 'Activo' : 'Inactivo'}</span>
          </button>
        </div>
      )}
    </header>
  );
};

