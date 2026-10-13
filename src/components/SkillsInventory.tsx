import React, { useState } from 'react';
import { Cpu, Server, Layout, Database, CheckCircle2, Sparkles, Terminal } from 'lucide-react';
import { detailedSkills, type DetailedSkill } from '../data/skills';
import { soundManager } from '../utils/soundEffects';

export const SkillsInventory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'php-core' | 'frontend' | 'database-tools'>('all');
  const [activeSkill, setActiveSkill] = useState<DetailedSkill>(detailedSkills[0]);

  const categories = [
    { id: 'all', label: 'Todo el Ecosistema', icon: Cpu, count: detailedSkills.length },
    { id: 'php-core', label: 'Core PHP & Laravel (5 Años)', icon: Server, count: detailedSkills.filter(s => s.category === 'php-core').length },
    { id: 'frontend', label: 'Frontend Reactivo (Next/React/Angular)', icon: Layout, count: detailedSkills.filter(s => s.category === 'frontend').length },
    { id: 'database-tools', label: 'Bases de Datos & Entornos', icon: Database, count: detailedSkills.filter(s => s.category === 'database-tools').length },
  ];

  const filteredSkills = selectedCategory === 'all'
    ? detailedSkills
    : detailedSkills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0a0c12] border border-[#fcee0a]/50 text-[#fcee0a] text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRAYECTORIA // 5 AÑOS DE EXPERIENCIA PRÁCTICA</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
          Dominio & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fcee0a] via-[#00f0ff] to-[#fcee0a] glow-yellow">Especialidad Técnica</span>
        </h2>
        <p className="text-slate-400 text-sm mt-3 font-light max-w-2xl mx-auto">
          Enfoque honesto y centrado en la producción real. Mi mayor fortaleza y profundidad es el ecosistema <strong className="text-[#fcee0a] font-medium">PHP & Laravel</strong>, integrado fluidamente con librerías modernas de frontend y bases de datos relacionales.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
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
              className={`px-4 py-2 text-xs font-mono transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-[#fcee0a] text-slate-950 font-black border-[#fcee0a] shadow-lg shadow-yellow-500/20 clip-cyber-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-[#00f0ff] hover:text-[#00f0ff]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${isSelected ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive 2-Column Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Skills List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredSkills.map((skill) => {
            const isActive = activeSkill.name === skill.name;
            return (
              <div
                key={skill.name}
                onClick={() => {
                  soundManager.playClick();
                  setActiveSkill(skill);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`p-4 border transition-all cursor-pointer relative overflow-hidden backdrop-blur-md ${
                  isActive
                    ? 'bg-[#0a121e]/90 border-[#00f0ff] shadow-xl shadow-cyan-950/50 scale-[1.01]'
                    : 'bg-[#080a10]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#0d1017]/80'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#fcee0a] to-[#00f0ff]" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-white">
                      {skill.name}
                    </span>
                    {skill.isPrimaryMastery && (
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#fcee0a]/10 text-[#fcee0a] border border-[#fcee0a]/40 rounded-sm">
                        CORE SPECIALIST
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {skill.years} {skill.years === 1 ? 'año' : 'años'} exp.
                    </span>
                    <span className={`font-bold ${skill.isPrimaryMastery ? 'text-[#fcee0a]' : 'text-[#00f0ff]'}`}>
                      {skill.levelPercent}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900/90 h-1.5 overflow-hidden mb-2 rounded-full">
                  <div
                    className={`h-full transition-all duration-500 ${
                      skill.isPrimaryMastery
                        ? 'bg-gradient-to-r from-[#fcee0a] to-[#ffaa00]'
                        : 'bg-gradient-to-r from-[#00f0ff] to-[#0088ff]'
                    }`}
                    style={{ width: `${skill.levelPercent}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 font-light line-clamp-2">
                  {skill.highlight}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Holographic Detailed Telemetry Panel */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="p-6 bg-[#080a10]/80 border border-[#00f0ff]/50 backdrop-blur-xl shadow-2xl shadow-cyan-950/40 clip-cyber">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
              <span className="text-[#00f0ff] flex items-center gap-1.5 font-bold">
                <Terminal className="w-4 h-4 text-[#fcee0a]" /> TELEMETRÍA DE HABILIDAD
              </span>
              <span className="text-[#fcee0a] font-bold">
                {activeSkill.years} AÑOS DE EXPERIENCIA
              </span>
            </div>

            <div className="my-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-2xl font-black font-mono text-white">
                  {activeSkill.name}
                </h3>
                <span className="text-xs font-mono text-slate-400 px-2 py-0.5 bg-slate-900 border border-slate-800">
                  {activeSkill.tag}
                </span>
              </div>
              <p className="text-xs text-[#00f0ff] font-mono font-semibold">
                {activeSkill.highlight}
              </p>
            </div>

            {/* In-depth description */}
            <div className="mb-6 p-3.5 bg-slate-950/70 border border-slate-800 text-xs text-slate-300 font-light leading-relaxed">
              {activeSkill.description}
            </div>

            {/* Ecosystem Chips */}
            <div className="mb-6">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Ecosistema y Herramientas Integradas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeSkill.ecosystem.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 bg-slate-900/90 border border-slate-800 hover:border-[#00f0ff] text-xs font-mono text-slate-200 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#00f0ff]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Meter */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400">NIVEL PRÁCTICO:</span>
              <span className="text-[#fcee0a] font-bold">
                {activeSkill.levelPercent}% // {activeSkill.years >= 4 ? 'AVANZADO / PRODUCCIÓN' : 'INTERMEDIO SÓLIDO'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
