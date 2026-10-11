import React, { useState, useMemo } from 'react';
import { Search, Filter, FolderGit2, Sparkles } from 'lucide-react';
import { curatedProjects } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { soundManager } from '../utils/soundEffects';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { label: 'Todas las Misiones', value: 'ALL' },
    { label: 'Laravel', value: 'Laravel' },
    { label: 'Next.js', value: 'Next.js' },
    { label: 'Node.js', value: 'Node.js' },
    { label: 'Angular', value: 'Angular' },
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
    <section id="projects" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <FolderGit2 className="w-4 h-4" />
            <span>Misiones Cumplidas & Repositorios</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
            Proyectos <span className="text-cyan-400 glow-cyan">Curados</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl font-light">
            Selección exclusiva de aplicaciones y servicios conectados a GitHub. Solo los repositorios aprobados son renderizados en esta cuadrícula.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              TOTAL: <strong className="text-white font-bold">{curatedProjects.length}</strong> PROYECTOS
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center mb-10">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
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
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por tag o nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:outline-none text-slate-200 text-xs font-mono placeholder:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-xl border border-slate-800 bg-slate-900/40">
          <Filter className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-mono text-sm">No se encontraron proyectos con ese filtro.</p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded bg-cyan-950 text-cyan-400 text-xs font-mono border border-cyan-500/40"
          >
            Resetear Filtros
          </button>
        </div>
      )}
    </section>
  );
};
