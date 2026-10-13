import React, { useState, useMemo } from 'react';
import { Search, FolderGit2, Terminal } from 'lucide-react';
import type { Project } from '../utils/types';
import { curatedProjects } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { soundManager } from '../utils/soundEffects';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { label: 'Todos los Proyectos', value: 'ALL' },
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
          <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <FolderGit2 className="w-4 h-4 text-[#00f0ff]" />
            <span>DATATERM // DEPLOYMENTS & REPOSITORIOS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-mono">
            Proyectos <span className="text-[#fcee0a] glow-yellow">Curados</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl font-light">
            Selección exclusiva de soluciones backend y web conectadas a GitHub. Solo los repositorios autorizados se renderizan en esta red.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-[#0a0c12] border-l-2 border-[#fcee0a] border-t border-r border-b border-slate-800 text-[#00f0ff] font-mono text-xs flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#fcee0a]" />
            <span>
              DESPLEGADOS: <strong className="text-white font-bold">{curatedProjects.length}</strong> REPOS
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
                className={`px-3.5 py-1.5 text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#fcee0a] text-slate-950 font-black shadow-md shadow-yellow-500/20'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-[#00f0ff] hover:text-[#00f0ff]'
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
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 focus:border-[#00f0ff] focus:outline-none text-slate-200 text-xs font-mono placeholder:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-slate-800 bg-[#0a0c12]/60">
          <p className="text-slate-400 font-mono text-sm">No se encontraron repositorios con ese filtro.</p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-mono border border-[#00f0ff]/50 hover:bg-[#00f0ff]/20"
          >
            Resetear Filtros
          </button>
        </div>
      )}
    </section>
  );
};
