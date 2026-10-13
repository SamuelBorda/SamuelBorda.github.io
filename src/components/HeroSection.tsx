import { Terminal, Code2, ArrowDown, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-4 pt-12 pb-20 max-w-7xl mx-auto">
      {/* Cyberpunk Status Banner */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#050608]/90 border border-[#fcee0a]/60 text-[#fcee0a] text-xs font-mono mb-8 backdrop-blur shadow-lg shadow-yellow-950/20">
        <span className="w-2 h-2 rounded-full bg-[#fcee0a] animate-ping"></span>
        <span className="font-bold">SYSTEM OVERCLOCK: ACTIVE</span>
        <span className="text-slate-600">//</span>
        <span className="text-[#00f0ff]">EDGERUNNER PROTOCOL</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
        {/* Left column: Text, Titles, and Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] font-bold mb-3 tracking-widest uppercase">
            <Cpu className="w-4 h-4 text-[#00f0ff]" />
            <span>Mid Fullstack Developer // Web & Backend</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.06] mb-6 font-mono">
            INGENIERÍA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fcee0a] via-[#00f0ff] to-[#ff003c] glow-yellow">
              FULLSTACK
            </span> <br />
            SIN LÍMITES.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light mb-8 leading-relaxed">
            <strong className="text-white font-medium">5 años de experiencia</strong> desarrollando sistemas web y arquitecturas backend. Especialista en el ecosistema{' '}
            <strong className="text-[#fcee0a] font-semibold">PHP & Laravel</strong> (APIs RESTful, bases de datos y arquitectura limpia), complementado con interfaces reactivas en{' '}
            <strong className="text-[#00f0ff] font-semibold">Next.js, React & Angular</strong>.
          </p>

          {/* Cyberpunk Architecture Telemetry Bars (Engineering specs) */}
          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 font-mono">
            {/* Core Mastery telemetry */}
            <div className="p-3.5 rounded-sm bg-[#0a0c12]/80 border-l-2 border-[#fcee0a] border-t border-r border-b border-slate-800/80 backdrop-blur">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>CORE MASTERY</span>
                <span className="text-[#fcee0a] font-bold">5 AÑOS</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-none mt-2 overflow-hidden">
                <div className="bg-[#fcee0a] h-full w-[95%]"></div>
              </div>
              <div className="text-[11px] text-slate-300 font-semibold mt-1.5">
                Laravel • PHP 8
              </div>
            </div>

            {/* Reactive UI telemetry */}
            <div className="p-3.5 rounded-sm bg-[#0a0c12]/80 border-l-2 border-[#00f0ff] border-t border-r border-b border-slate-800/80 backdrop-blur">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>FRONTEND STACK</span>
                <span className="text-[#00f0ff] font-bold">REACTIVO</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-none mt-2 overflow-hidden">
                <div className="bg-[#00f0ff] h-full w-[82%]"></div>
              </div>
              <div className="text-[11px] text-slate-300 font-semibold mt-1.5">
                Next.js • React • Angular
              </div>
            </div>

            {/* Databases & Tools telemetry */}
            <div className="p-3.5 rounded-sm bg-[#0a0c12]/80 border-l-2 border-[#ff003c] border-t border-r border-b border-slate-800/80 backdrop-blur">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>DATABASES & CI</span>
                <span className="text-[#ff003c] font-bold">STABLE</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-none mt-2 overflow-hidden">
                <div className="bg-[#ff003c] h-full w-[84%]"></div>
              </div>
              <div className="text-[11px] text-slate-300 font-semibold mt-1.5">
                PostgreSQL • Git • Docker
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="#projects"
              onClick={() => soundManager.playWarp()}
              onMouseEnter={() => soundManager.playHover()}
              className="px-6 py-3.5 rounded-sm bg-[#fcee0a] hover:bg-yellow-300 text-slate-950 font-mono font-black text-sm tracking-wide shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] clip-cyber-sm text-center"
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <span>EXPLORAR PROYECTOS // REPOSITORIOS</span>
            </a>

            <a
              href="#contact"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="px-6 py-3.5 rounded-sm bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-[#00f0ff] text-slate-200 font-mono font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 text-center"
            >
              <Code2 className="w-4 h-4 text-[#00f0ff] shrink-0" />
              <span>ESTABLECER CONEXIÓN</span>
            </a>
          </div>
        </div>

        {/* Right column: Cyberpunk Card / Data Node */}
        <div id="about" className="lg:col-span-5 flex justify-center scroll-mt-24">
          <div className="relative w-full max-w-md p-6 rounded-none bg-[#080a10]/55 border border-[#00f0ff]/40 backdrop-blur-md shadow-2xl shadow-cyan-950/40 clip-cyber">
            {/* Header Telemetry */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 font-mono text-xs">
              <span className="text-[#00f0ff] flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4" /> DATACENTER // IDENTIFICADOR
              </span>
              <span className="text-[#fcee0a] font-bold">LEVEL: MID DEV</span>
            </div>

            {/* Emblem and identity */}
            <div className="my-6 flex items-center gap-4">
              <div className="relative w-20 h-20 bg-gradient-to-tr from-[#fcee0a] via-[#00f0ff] to-[#ff003c] p-0.5 shadow-lg shadow-cyan-500/20 clip-cyber-sm">
                <div className="w-full h-full bg-[#050608] flex items-center justify-center">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fcee0a] to-[#00f0ff] font-mono">
                    FS
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-mono">{userProfile.name}</h3>
                <p className="text-xs text-[#00f0ff] font-mono">{userProfile.role}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
                  <span>📍 {userProfile.location}</span>
                </p>
              </div>
            </div>

            {/* Core Stack */}
            <div className="space-y-2 mb-6">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Ecosistema Tecnológico
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Laravel', 'Next.js', 'Node.js', 'PHP 8', 'React 19', 'Angular', 'TypeScript', 'PostgreSQL', 'Docker'].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 hover:border-[#fcee0a] hover:text-[#fcee0a] transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Direct GitHub Connection */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">REPOSITORIOS PÚBLICOS</span>
              <a
                href={userProfile.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                onMouseEnter={() => soundManager.playHover()}
                className="text-[#fcee0a] hover:underline flex items-center gap-1 font-bold"
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
        <span>SCROLL // DESPLEGAR MÓDULOS</span>
        <ArrowDown className="w-4 h-4 text-[#00f0ff]" />
      </div>
    </section>
  );
};
