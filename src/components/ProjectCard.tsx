import React, { useState, useRef } from 'react';
import { ExternalLink, Star, GitFork, Code2 } from 'lucide-react';
import type { Project } from '../utils/types';
import { GithubIcon } from './BrandIcons';
import { soundManager } from '../utils/soundEffects';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 11;
    const rotY = ((x - centerX) / centerX) * 11;

    setRotateX(rotX);
    setRotateY(rotY);

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => soundManager.playHover()}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="relative flex flex-col justify-between bg-[#080a10]/60 border border-slate-800/80 hover:border-[#00f0ff]/70 p-6 backdrop-blur-md shadow-xl transition-shadow duration-300 group hover:shadow-cyan-950/60 overflow-hidden"
    >
      {/* Cyberpunk Holographic glare */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 300px at ${glarePos.x}% ${glarePos.y}%, rgba(0, 240, 255, ${glarePos.opacity}), transparent)`,
        }}
      />

      {/* Top Card Header: Architecture & Deploy Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-[#00f0ff] font-bold uppercase tracking-wider">
            <Code2 className="w-3.5 h-3.5" />
            <span>{project.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {project.architecture && (
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-700">
                {project.architecture}
              </span>
            )}

            {project.deployStatus && (
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-500/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {project.deployStatus}
              </span>
            )}
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-[#fcee0a] transition-colors mb-2.5 font-mono">
          {project.title}
        </h3>

        {/* Project Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
          {project.description}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] font-mono bg-slate-950 border border-slate-800 text-slate-300 group-hover:border-slate-700 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Card: Stats & Action Buttons */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
        {/* GitHub Stats */}
        <div className="flex items-center gap-3 text-slate-400">
          {project.stats?.stars !== undefined && (
            <span className="flex items-center gap-1 hover:text-[#fcee0a] transition-colors">
              <Star className="w-3.5 h-3.5 text-[#fcee0a]" />
              <span>{project.stats.stars}</span>
            </span>
          )}
          {project.stats?.forks !== undefined && (
            <span className="flex items-center gap-1 hover:text-[#00f0ff] transition-colors">
              <GitFork className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>{project.stats.forks}</span>
            </span>
          )}
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="px-3 py-1.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-[#00f0ff] flex items-center gap-1.5 transition-all text-xs font-bold"
            >
              <span>Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            onMouseEnter={() => soundManager.playHover()}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-[#fcee0a] text-slate-300 hover:text-[#fcee0a] transition-all"
            title="Ver Repositorio en GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
