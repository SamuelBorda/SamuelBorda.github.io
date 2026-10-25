import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ExternalLink, Code2, GraduationCap, MapPin, MessageCircle, Mail, Download, Copy } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';

interface HeroSectionProps {
  onCopyEmail?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCopyEmail }) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 pt-28 pb-16 max-w-7xl mx-auto">
      {/* Refined Status Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#08090f]/70 border border-white/10 text-xs font-mono text-zinc-300 mb-8 backdrop-blur-2xl shadow-xl shadow-black/40"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="font-semibold text-white">Ingeniería de Sistemas</span>
        <span className="text-zinc-600">·</span>
        <span className="text-[#00f0ff]">Fullstack</span>
        <span className="text-zinc-600">·</span>
        <span className="text-zinc-400">Cochabamba, Bolivia</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Column: Heading, Pitch, and Actions */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          <div className="inline-block text-xs font-mono font-bold tracking-widest text-[#00f0ff] uppercase mb-3">
            Fullstack Developer // Web & Backend Architecture
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.06] mb-6">
            Temis Samuel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fcee0a] via-[#00f0ff] to-[#ffffff] drop-shadow-[0_0_35px_rgba(252,238,10,0.3)]">
              Borda Caballero
            </span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg max-w-2xl font-light mb-8 leading-relaxed">
            <strong className="text-white font-medium">Ingeniero en Sistemas</strong> especializado en arquitectura web fullstack con backend sólido en{' '}
            <strong className="text-[#fcee0a] font-semibold">Laravel & PHP 8</strong> (APIs RESTful, persistencia relacional y WebSockets en tiempo real), complementado con interfaces reactivas y optimizadas en{' '}
            <strong className="text-[#00f0ff] font-semibold">Next.js & React 19</strong>.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-10">
            <a
              href="#projects"
              onClick={() => soundManager.playWarp()}
              onMouseEnter={() => soundManager.playHover()}
              className="px-6 py-3.5 rounded-full bg-[#fcee0a] hover:bg-yellow-300 text-zinc-950 font-mono font-black text-xs tracking-wider shadow-[0_0_24px_rgba(252,238,10,0.35)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 text-center cursor-pointer"
            >
              <Code2 className="w-4 h-4 shrink-0" />
              <span>EXPLORAR PROYECTOS</span>
            </a>

            <a
              href="/cv.pdf"
              download="Samuel_Borda_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playSuccess()}
              onMouseEnter={() => soundManager.playHover()}
              className="px-5 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#fcee0a]/50 text-zinc-200 hover:text-white font-mono font-bold text-xs tracking-wide backdrop-blur-xl transition-all flex items-center justify-center gap-2 text-center active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#fcee0a] shrink-0" />
              <span>DESCARGAR CV</span>
            </a>

            <a
              href="#contact"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="px-5 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#00f0ff]/50 text-zinc-200 hover:text-white font-mono font-bold text-xs tracking-wide backdrop-blur-xl transition-all flex items-center justify-center gap-2 text-center active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#00f0ff] shrink-0" />
              <span>CONTACTO</span>
            </a>
          </div>

          {/* Core Tech Stack Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mr-1">
              Stack Core:
            </span>
            {['Laravel 11', 'Next.js 15', 'React 19', 'TypeScript', 'WebSockets', 'PostgreSQL', 'Docker'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-zinc-300 hover:border-white/20 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Modern Glassmorphic Identity Card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl backdrop-blur-2xl bg-[#080a12]/75 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-cyan-400/30 transition-all duration-300">
            {/* Card Header Status */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] text-xs font-mono">
              <span className="flex items-center gap-2 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>DISPONIBLE PARA CONTRATACIÓN</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fcee0a]/10 border border-[#fcee0a]/30 text-[#fcee0a] text-[10px] font-bold">
                MID DEV
              </span>
            </div>

            {/* Profile Info */}
            <div className="my-6 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#fcee0a] via-[#00f0ff] to-[#ff003c] p-[2px] shadow-lg shadow-cyan-500/20 shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#07090e] flex items-center justify-center font-mono text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fcee0a] to-[#00f0ff]">
                  SB
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
                  {userProfile.name}
                </h3>
                <p className="text-xs text-[#00f0ff] font-mono mt-0.5 font-medium">
                  {userProfile.role}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1 font-mono">
                  <GraduationCap className="w-3.5 h-3.5 text-[#fcee0a]" />
                  <span>Ingeniero en Sistemas</span>
                </div>
              </div>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-lg font-black text-[#fcee0a] font-mono">+4</div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono mt-0.5">Años Práctica</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-lg font-black text-[#00f0ff] font-mono">Core</div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono mt-0.5">Laravel & PHP</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-lg font-black text-white font-mono">Realtime</div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono mt-0.5">WebSockets</div>
              </div>
            </div>

            {/* Quick Contact Points */}
            <div className="space-y-2 mb-6 font-mono text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
                <span>{userProfile.location}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-zinc-300">
                <a
                  href={`mailto:${userProfile.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors overflow-hidden"
                >
                  <Mail className="w-3.5 h-3.5 text-[#fcee0a] shrink-0" />
                  <span className="truncate">{userProfile.email}</span>
                </a>
                {onCopyEmail && (
                  <button
                    onClick={onCopyEmail}
                    onMouseEnter={() => soundManager.playHover()}
                    title="Copiar correo al portapapeles"
                    className="px-2 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-[#00f0ff] transition-all text-[10px] font-mono flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer Direct GitHub Link */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">CÓDIGO PÚBLICO</span>
              <a
                href={userProfile.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                onMouseEnter={() => soundManager.playHover()}
                className="text-[#fcee0a] hover:underline flex items-center gap-1 font-bold"
              >
                <span>github.com/SamuelBorda</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modern Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-14 flex flex-col items-center gap-2 text-zinc-500 font-mono text-xs"
      >
        <span className="tracking-widest text-[10px] uppercase text-zinc-400">Explorar Portafolio</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4 text-[#00f0ff]" />
        </motion.div>
      </motion.div>
    </section>
  );
};
