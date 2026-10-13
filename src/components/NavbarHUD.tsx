import { useState } from 'react';
import { Volume2, VolumeX, Terminal, Tv, Menu, X, Cpu } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#050608]/85 border-b border-cyan-500/25 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Cyberpunk Telemetry */}
        <div className="flex items-center gap-3">
          <div
            className="relative flex items-center justify-center w-10 h-10 bg-[#050608] border-2 border-[#fcee0a] shadow-inner group cursor-pointer clip-cyber-sm"
            onClick={() => soundManager.playSuccess()}
            title="Cyberdeck Core"
          >
            <Cpu className="w-5 h-5 text-[#fcee0a] group-hover:rotate-45 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-widest text-[#fcee0a] font-mono glow-yellow">
                {userProfile.handle}
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-950/60 text-[#00f0ff] border border-[#00f0ff]/40 rounded-sm">
                {userProfile.clearance}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SYS: ONLINE</span>
              <span className="text-slate-600">//</span>
              <span className="text-cyan-400">LATENCY: 12ms</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-slate-300">
          <a
            href="#projects"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-sm hover:bg-cyan-950/40 border border-transparent hover:border-[#00f0ff]/40"
          >
            <span className="text-[#fcee0a]">01 //</span> Proyectos
          </a>
          <a
            href="#skills"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-sm hover:bg-cyan-950/40 border border-transparent hover:border-[#00f0ff]/40"
          >
            <span className="text-[#fcee0a]">02 //</span> Tech Stack
          </a>
          <a
            href="#about"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-sm hover:bg-cyan-950/40 border border-transparent hover:border-[#00f0ff]/40"
          >
            <span className="text-[#fcee0a]">03 //</span> Telemetría
          </a>
          <a
            href="#contact"
            onClick={handleNavClick}
            onMouseEnter={() => soundManager.playHover()}
            className="hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-sm hover:bg-cyan-950/40 border border-transparent hover:border-[#00f0ff]/40"
          >
            <span className="text-[#fcee0a]">04 //</span> Conexión
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
            title="Abrir Terminal CLI"
            className="p-2 rounded-sm bg-slate-900/90 border border-slate-700/60 hover:border-[#00f0ff] text-slate-300 hover:text-[#00f0ff] transition-all flex items-center gap-1.5 text-xs font-mono"
          >
            <Terminal className="w-4 h-4 text-[#00f0ff]" />
            <span className="hidden sm:inline font-bold">CLI</span>
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleScanlines();
            }}
            onMouseEnter={() => soundManager.playHover()}
            title={scanlinesActive ? 'Desactivar Scanlines' : 'Activar Scanlines'}
            className={`p-2 rounded-sm border transition-all text-xs ${
              scanlinesActive
                ? 'bg-[#ff003c]/20 border-[#ff003c] text-[#ff003c]'
                : 'bg-slate-900/90 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => soundManager.playHover()}
            title={soundOn ? 'Silenciar audio' : 'Activar audio'}
            className={`p-2 rounded-sm border transition-all ${
              soundOn
                ? 'bg-cyan-950/60 border-[#00f0ff]/60 text-[#00f0ff]'
                : 'bg-slate-900/90 border-slate-700/60 text-slate-500'
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
            className="p-2 rounded-sm bg-slate-900/90 border border-slate-700/60 hover:border-[#fcee0a] text-slate-300 hover:text-[#fcee0a] transition-all"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-sm bg-slate-900 border border-slate-700 text-slate-300"
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
            className="py-2 px-3 rounded hover:bg-cyan-950 text-slate-200 hover:text-[#00f0ff]"
          >
            01 // Proyectos
          </a>
          <a
            href="#skills"
            onClick={handleNavClick}
            className="py-2 px-3 rounded hover:bg-cyan-950 text-slate-200 hover:text-[#00f0ff]"
          >
            02 // Tech Stack
          </a>
          <a
            href="#about"
            onClick={handleNavClick}
            className="py-2 px-3 rounded hover:bg-cyan-950 text-slate-200 hover:text-[#00f0ff]"
          >
            03 // Telemetría
          </a>
          <a
            href="#contact"
            onClick={handleNavClick}
            className="py-2 px-3 rounded hover:bg-cyan-950 text-slate-200 hover:text-[#00f0ff]"
          >
            04 // Conexión
          </a>
        </div>
      )}
    </header>
  );
};
