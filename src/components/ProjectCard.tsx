import React, { useRef, useState } from 'react';
import { ExternalLink, Star, GitFork, Award, Code } from 'lucide-react';
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

    // Calculate rotation limits (-12 to 12 deg)
    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const difficultyColors = {
    EASY: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30',
    MEDIUM: 'border-blue-500/50 text-blue-400 bg-blue-950/30',
    HARD: 'border-purple-500/50 text-purple-400 bg-purple-950/30',
    BOSS: 'border-rose-500/50 text-rose-400 bg-rose-950/30 font-bold animate-pulse',
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
      className="relative flex flex-col justify-between rounded-xl bg-slate-900/75 border border-slate-800 hover:border-cyan-500/60 p-6 backdrop-blur-md shadow-xl transition-shadow duration-300 group hover:shadow-cyan-950/50 overflow-hidden"
    >
      {/* Holographic light glare */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(6, 182, 212, ${glarePos.opacity}), transparent)`,
        }}
      />

      {/* Top Card Header: Category & Quest Difficulty */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase">
            <Code className="w-3.5 h-3.5" />
            <span>{project.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {project.rewardXP && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" />
                +{project.rewardXP} XP
              </span>
            )}

            {project.difficulty && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  difficultyColors[project.difficulty]
                }`}
              >
                {project.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 font-mono">
          {project.title}
        </h3>

        {/* Project Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800/80 border border-slate-700/60 text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Card: Stats & Action Buttons */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
        {/* GitHub Stats if available */}
        <div className="flex items-center gap-3 text-slate-400">
          {project.stats?.stars !== undefined && (
            <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>{project.stats.stars}</span>
            </span>
          )}
          {project.stats?.forks !== undefined && (
            <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
              <GitFork className="w-3.5 h-3.5 text-cyan-400" />
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
              className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 transition-all text-xs font-semibold"
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
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all"
            title="Ver Repositorio en GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
