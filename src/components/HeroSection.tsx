import React from 'react';
import { Shield, Zap, Terminal, Code2, ArrowDown, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';

export const HeroSection: React.FC = () => {
  const triggerLevelUp = () => {
    soundManager.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#a855f7', '#3b82f6', '#10b981'],
    });
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-4 pt-12 pb-20 max-w-7xl mx-auto">
      {/* Top Gamer Tag / Status pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-400 text-xs font-mono mb-8 backdrop-blur shadow-lg shadow-cyan-950/30">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span>SISTEMA OPERATIVO: ACTIVO</span>
        <span className="text-slate-600">|</span>
        <span className="text-purple-300">MODO: DEVELOPER V4.2</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
        {/* Left column: Text, Titles, and Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold mb-3 tracking-widest uppercase">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Fullstack Developer & System Architect</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6">
            Construyendo <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 glow-cyan">
              Sistemas Robustos
            </span> <br />
            & Experiencias Web.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light mb-8 leading-relaxed">
            Ingeniero de software especializado en el backend con{' '}
            <strong className="text-cyan-300 font-semibold">Laravel & Node.js</strong> y la creación de interfaces interactivas de alto impacto con{' '}
            <strong className="text-purple-300 font-semibold">Next.js, React & Angular</strong>.
          </p>

          {/* Gamified Stat Meters */}
          <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 font-mono">
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 backdrop-blur">
              <div className="text-[11px] text-slate-400 uppercase">HP / Resistencia</div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[100%] animate-pulse"></div>
              </div>
              <div className="text-xs text-emerald-400 font-bold mt-1">100% CLEAN CODE</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 backdrop-blur">
              <div className="text-[11px] text-slate-400 uppercase">MANA / Lógica</div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[96%]"></div>
              </div>
              <div className="text-xs text-cyan-400 font-bold mt-1">96% ARQUITECTURA</div>
            </div>

            <div 
              onClick={triggerLevelUp}
              onMouseEnter={() => soundManager.playHover()}
              className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-purple-950/30 border border-purple-500/40 backdrop-blur cursor-pointer hover:border-purple-400 hover:bg-purple-900/30 transition-all group"
              title="¡Haz clic para celebrar!"
            >
              <div className="text-[11px] text-purple-300 uppercase flex items-center justify-between">
                <span>EXP LEVEL</span>
                <span className="text-[10px] text-purple-400 group-hover:scale-110 transition-transform">★ Click</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[88%]"></div>
              </div>
              <div className="text-xs text-purple-300 font-bold mt-1">LVL {userProfile.level} RANK S</div>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              onClick={() => soundManager.playWarp()}
              onMouseEnter={() => soundManager.playHover()}
              className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Terminal className="w-4 h-4" />
              <span>EXPLORAR MISIONES (PROYECTOS)</span>
            </a>

            <a
              href="#contact"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="px-6 py-3.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 font-mono font-bold text-sm tracking-wide transition-all flex items-center gap-2"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>CONTACTAR</span>
            </a>
          </div>
        </div>

        {/* Right column: HUD Player Card / Hologram Box */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-950/40">
            {/* Tech Corner accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-800 font-mono text-xs">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> PERFIL DE DESARROLLADOR
              </span>
              <span className="text-slate-500">ID: #DEV-2026</span>
            </div>

            {/* Profile Avatar / Emblem */}
            <div className="my-6 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-700 to-purple-800 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#090a0f] rounded-[10px] flex items-center justify-center">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono">
                    FS
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono font-black text-[9px]">
                  LVL {userProfile.level}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-mono">{userProfile.name}</h3>
                <p className="text-xs text-cyan-400 font-mono">{userProfile.role}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <span>📍 {userProfile.location}</span>
                </p>
              </div>
            </div>

            {/* Primary Skill Tree Tags */}
            <div className="space-y-2 mb-6">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Habilidades Principales
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Laravel', 'Next.js', 'Node.js', 'PHP', 'React', 'Angular', 'TypeScript', 'MySQL'].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* GitHub Fast Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">REPOSITORIOS PÚBLICOS</span>
              <a
                href={userProfile.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                onMouseEnter={() => soundManager.playHover()}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>VER GITHUB</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-16 flex flex-col items-center gap-2 text-slate-500 font-mono text-xs animate-bounce">
        <span>DESPLÁZATE PARA EXPLORAR</span>
        <ArrowDown className="w-4 h-4 text-cyan-400" />
      </div>
    </section>
  );
};
