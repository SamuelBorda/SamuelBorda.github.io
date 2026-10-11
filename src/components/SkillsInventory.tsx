import React, { useState } from 'react';
import { Cpu, Database, Server, Layout } from 'lucide-react';
import { skillCategories } from '../data/skills';
import { soundManager } from '../utils/soundEffects';

export const SkillsInventory: React.FC = () => {
  const [activeSkillName, setActiveSkillName] = useState<string | null>(null);

  const rarityBadge = {
    Common: 'bg-slate-800 text-slate-300 border-slate-700',
    Rare: 'bg-blue-950/60 text-blue-300 border-blue-500/50',
    Epic: 'bg-purple-950/60 text-purple-300 border-purple-500/50',
    Legendary: 'bg-amber-950/60 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20',
  };

  return (
    <section id="skills" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/40 text-purple-300 text-xs font-mono mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>INVENTARIO & ÁRBOL DE HABILIDADES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
          Habilidades & <span className="text-purple-400 glow-purple">Tecnologías</span>
        </h2>
        <p className="text-slate-400 text-sm mt-3 font-light">
          Arsenal tecnológico forjado a lo largo de proyectos en producción. Pasa el cursor por cada habilidad para inspeccionar su experiencia.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {skillCategories.map((cat, idx) => (
          <div
            key={cat.title}
            className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/90 p-6 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/50 transition-colors"
          >
            {/* Top Category Badge */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 font-mono">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                {idx === 0 && <Server className="w-4 h-4 text-cyan-400" />}
                {idx === 1 && <Layout className="w-4 h-4 text-purple-400" />}
                {idx === 2 && <Database className="w-4 h-4 text-emerald-400" />}
                <span>{cat.title}</span>
              </div>
              <span className="text-[10px] text-slate-500">SLOT #{idx + 1}</span>
            </div>

            {/* Skills List */}
            <div className="space-y-4">
              {cat.skills.map((skill) => {
                const isSelected = activeSkillName === skill.name;
                return (
                  <div
                    key={skill.name}
                    onMouseEnter={() => {
                      soundManager.playHover();
                      setActiveSkillName(skill.name);
                    }}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveSkillName(isSelected ? null : skill.name);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-950/40 scale-[1.01]'
                        : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">
                          {skill.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          [{skill.tag}]
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                            rarityBadge[skill.rarity]
                          }`}
                        >
                          {skill.rarity}
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {skill.level}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>

                    {/* Detailed Experience */}
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      {skill.experience}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
