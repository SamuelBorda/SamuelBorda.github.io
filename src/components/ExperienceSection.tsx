import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Building2, CheckCircle2, GraduationCap, Globe2, Shield } from 'lucide-react';
import { userProfile } from '../data/profile';
import { soundManager } from '../utils/soundEffects';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-slate-800 pb-8"
      >
        <div>
          <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-4 h-4 text-[#00f0ff]" />
            <span className="text-slate-500">[</span>
            <span>03 // TRAYECTORIA OPERACIONAL & EXPERIENCIA</span>
            <span className="text-slate-500">]</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-mono">
            Experiencia <span className="text-[#fcee0a] glow-yellow">Profesional</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl font-light">
            Historial de desarrollo e infraestructura verificado en empresas e instituciones de Bolivia. Enfoque riguroso en calidad de software, integración de datos y estabilidad operativa.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-[#0a0c12] border-l-2 border-[#fcee0a] border-t border-r border-b border-slate-800 text-[#00f0ff] font-mono text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#fcee0a]" />
            <span>
              TÍTULO: <strong className="text-white font-bold">INGENIERO EN SISTEMAS</strong>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Grid: Timeline on left/center + Education & Languages on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Work Experience Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {userProfile.experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => soundManager.playHover()}
              className="p-6 rounded-none bg-[#080a10]/70 border border-slate-800/90 hover:border-[#00f0ff]/60 transition-all backdrop-blur-xl relative group shadow-xl hover:shadow-cyan-950/20 clip-cyber"
            >
              {/* Corner tech accent */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#fcee0a] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80 mb-4 font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-900 border border-slate-800 text-[#fcee0a] group-hover:border-[#fcee0a] transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-[#00f0ff] transition-colors">
                      {exp.company}
                    </h3>
                    <p className="text-xs text-[#00f0ff] font-medium">{exp.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 border border-slate-800 w-fit">
                  <Calendar className="w-3.5 h-3.5 text-[#fcee0a]" />
                  <span>{exp.period}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 font-light leading-relaxed mb-4">
                {exp.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 group-hover:border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#00f0ff]" />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Education & Academic Identity */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Academic Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 bg-[#080a10]/80 border border-[#fcee0a]/40 backdrop-blur-xl shadow-xl shadow-yellow-950/20 clip-cyber"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 font-mono text-xs text-[#fcee0a] font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>FORMACIÓN UNIVERSITARIA</span>
            </div>

            <div className="my-4">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                CARRERA & ESPECIALIDAD
              </div>
              <h4 className="text-base font-bold text-white font-mono mt-0.5">
                Ingeniería en Sistemas
              </h4>
              <p className="text-xs text-[#00f0ff] font-mono mt-1 font-semibold">
                Facultad de Ciencias y Tecnología
              </p>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800/80 font-mono text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Título:</span>
                <span className="text-white font-bold">Ingeniero en Sistemas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estado:</span>
                <span className="text-[#fcee0a] font-semibold">Titulado / Profesional</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Enfoque:</span>
                <span className="text-slate-200">Software, Redes & Datos</span>
              </div>
            </div>
          </motion.div>

          {/* Languages & Soft Capabilities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 bg-[#080a10]/80 border border-slate-800 backdrop-blur-xl clip-cyber"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 font-mono text-xs text-[#00f0ff] font-bold">
              <Globe2 className="w-4 h-4" />
              <span>IDIOMAS & COMPETENCIAS</span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800">
                <span className="text-white font-semibold">Español</span>
                <span className="text-[#fcee0a] text-[11px] font-bold">Lenguaje Nativo</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800">
                <span className="text-white font-semibold">Inglés</span>
                <span className="text-[#00f0ff] text-[11px] font-bold">Nivel B1 (Técnico / Lectura)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Metodologías de Trabajo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Scrum', 'Kanban', 'POO / MVC', 'Code Review', 'Git Flow', 'Jira / Trello'].map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
