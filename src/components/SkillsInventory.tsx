import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Server, Layout, Database, CheckCircle2, Sparkles, Terminal } from 'lucide-react';
import { detailedSkills, type DetailedSkill } from '../data/skills';
import { soundManager } from '../utils/soundEffects';

export const SkillsInventory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'backend' | 'frontend' | 'infra'>('all');
  const [activeSkill, setActiveSkill] = useState<DetailedSkill>(detailedSkills[0]);

  const categories = [
    { id: 'all', label: 'Todo el Stack', icon: Cpu, count: detailedSkills.length },
    { id: 'backend', label: 'Backend & APIs', icon: Server, count: detailedSkills.filter(s => s.category === 'backend').length },
    { id: 'frontend', label: 'Frontend Moderno', icon: Layout, count: detailedSkills.filter(s => s.category === 'frontend').length },
    { id: 'infra', label: 'Bases de Datos & DevOps', icon: Database, count: detailedSkills.filter(s => s.category === 'infra').length },
  ];

  const filteredSkills = selectedCategory === 'all'
    ? detailedSkills
    : detailedSkills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#fcee0a] text-xs font-mono mb-3 backdrop-blur-xl">
          <Sparkles className="w-3.5 h-3.5" />
          <span>02 // Stack & Especialidades Técnicas</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Dominio & <span className="text-[#00f0ff]">Herramientas</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-3 font-light max-w-2xl mx-auto">
          Especialización central en arquitectura backend con <strong className="text-[#fcee0a] font-medium">Laravel & PHP 8</strong>, interfaces reactivas en <strong className="text-[#00f0ff] font-medium">Next.js & React 19</strong>, y transmisión en tiempo real con <strong className="text-white font-medium">WebSockets</strong>.
        </p>
      </motion.div>

      {/* Category Segmented Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-full bg-[#08090f]/70 border border-white/10 backdrop-blur-xl max-w-fit mx-auto mb-12"
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.id as any);
              }}
              onMouseEnter={() => soundManager.playHover()}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-[#fcee0a] text-zinc-950 font-bold shadow-[0_0_16px_rgba(252,238,10,0.3)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-zinc-950/20 text-zinc-900 font-bold' : 'bg-white/[0.08] text-zinc-400'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* 2-Column Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Skills List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const isActive = activeSkill.name === skill.name;
              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveSkill(skill);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden backdrop-blur-2xl ${
                    isActive
                      ? 'bg-[#0b101c]/90 border-cyan-400/60 shadow-[0_10px_30px_rgba(0,240,255,0.15)] scale-[1.01]'
                      : 'bg-[#080912]/70 border-white/[0.08] hover:border-white/20 hover:bg-[#0c0e18]/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-base text-white">
                        {skill.name}
                      </span>
                      {skill.isPrimaryMastery && (
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#fcee0a]/10 text-[#fcee0a] border border-[#fcee0a]/30 rounded-full">
                          CORE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-zinc-400">
                        {skill.years} {skill.years === 1 ? 'año' : 'años'}
                      </span>
                      <span className={`font-bold ${skill.isPrimaryMastery ? 'text-[#fcee0a]' : 'text-[#00f0ff]'}`}>
                        {skill.levelPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/[0.06] h-1.5 overflow-hidden mb-2.5 rounded-full">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        skill.isPrimaryMastery
                          ? 'bg-gradient-to-r from-[#fcee0a] to-[#ffaa00]'
                          : 'bg-gradient-to-r from-[#00f0ff] to-[#0088ff]'
                      }`}
                      style={{ width: `${skill.levelPercent}%` }}
                    />
                  </div>

                  <p className="text-xs text-zinc-400 font-light line-clamp-2">
                    {skill.highlight}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Right Column: Skill Detail Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 sticky top-28"
        >
          <div className="p-6 sm:p-7 rounded-3xl backdrop-blur-2xl bg-[#080a14]/80 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] font-mono text-xs">
              <span className="text-[#00f0ff] flex items-center gap-1.5 font-bold">
                <Terminal className="w-4 h-4 text-[#fcee0a]" /> DETALLE DE COMPETENCIA
              </span>
              <span className="text-zinc-400">
                {activeSkill.years} Años Práctica
              </span>
            </div>

            <div className="my-5">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-2xl font-black font-mono text-white">
                  {activeSkill.name}
                </h3>
                <span className="text-xs font-mono text-zinc-300 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10">
                  {activeSkill.tag}
                </span>
              </div>
              <p className="text-xs text-[#00f0ff] font-mono font-semibold">
                {activeSkill.highlight}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-300 font-light leading-relaxed">
              {activeSkill.description}
            </div>

            {/* Tools Chips */}
            <div className="mb-6">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2.5">
                Ecosistema & Utilidades:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeSkill.ecosystem.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-[#00f0ff]/50 text-xs font-mono text-zinc-200 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#00f0ff]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Practical Seniority Meter */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-400">NIVEL PRÁCTICO:</span>
              <span className="text-[#fcee0a] font-bold">
                {activeSkill.levelPercent}% // {activeSkill.years >= 3.5 ? 'PRODUCCIÓN / AVANZADO' : 'INTERMEDIO SÓLIDO'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
