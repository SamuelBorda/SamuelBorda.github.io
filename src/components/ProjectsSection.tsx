import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderGit2, Code2 } from 'lucide-react';
import type { Project } from '../utils/types';
import { curatedProjects } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { soundManager } from '../utils/soundEffects';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Laravel', value: 'Laravel' },
    { label: 'Next.js', value: 'Next.js' },
    { label: 'Node.js', value: 'Node.js' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Frontend', value: 'Frontend' },
  ];

  const filteredProjects = useMemo(() => {
    return curatedProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        project.category === selectedCategory ||
        project.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());

      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-white/[0.08]"
      >
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#00f0ff] uppercase tracking-wider mb-2">
            <FolderGit2 className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>01 // Portafolio de Software</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Proyectos <span className="text-[#fcee0a]">Destacados</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl font-light">
            Sistemas web, APIs de backend y aplicaciones interactivas desarrolladas con código abierto en GitHub.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-[#fcee0a]"></span>
          <span>
            <strong className="text-white font-bold">{curatedProjects.length}</strong> Repositorios Verificados
          </span>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center mb-10"
      >
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-full bg-[#08090f]/70 border border-white/10 backdrop-blur-xl">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat.value);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-[#fcee0a] text-zinc-950 font-bold shadow-[0_0_16px_rgba(252,238,10,0.3)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por tecnología..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#08090f]/70 border border-white/10 focus:border-[#00f0ff]/50 focus:outline-none text-zinc-200 text-xs font-mono placeholder:text-zinc-500 backdrop-blur-xl transition-all"
          />
        </div>
      </motion.div>

      {/* Projects Grid with Stagger */}
      {filteredProjects.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project: Project, idx: number) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="py-20 text-center rounded-3xl border border-white/10 bg-[#08090f]/60 backdrop-blur-xl">
          <Code2 className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-mono text-sm">No se encontraron repositorios con ese filtro.</p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-mono border border-[#00f0ff]/40 hover:bg-[#00f0ff]/20 active:scale-95 transition-all cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      )}
    </section>
  );
};
