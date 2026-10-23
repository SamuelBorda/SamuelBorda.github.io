import React, { useState, useRef } from 'react';
import { Star, GitFork, ArrowUpRight } from 'lucide-react';
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

    const rotX = -((y - centerY) / centerY) * 8;
    const rotY = ((x - centerX) / centerX) * 8;

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
      className="relative flex flex-col justify-between rounded-3xl backdrop-blur-2xl bg-[#090b14]/75 border border-white/10 hover:border-cyan-400/40 p-6 sm:p-7 shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all duration-300 group hover:shadow-[0_16px_40px_rgba(0,240,255,0.12)] overflow-hidden"
    >
      {/* Holographic Subtle Glare */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(0, 240, 255, ${glarePos.opacity}), transparent)`,
        }}
      />

      {/* Top Section */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium text-[#00f0ff]">
            {project.category}
          </span>

          <div className="flex items-center gap-2">
            {project.architecture && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 bg-white/[0.02] border border-white/[0.06]">
                {project.architecture}
              </span>
            )}
            {project.deployStatus && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{project.deployStatus}</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-[#fcee0a] transition-colors mb-3 leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-white/[0.03] border border-white/[0.06] text-zinc-300 group-hover:border-white/15 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono text-xs">
        {/* Stars / Forks */}
        <div className="flex items-center gap-3 text-zinc-400">
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="px-3.5 py-1.5 rounded-full bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff] flex items-center gap-1 transition-all text-xs font-bold active:scale-95"
            >
              <span>Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            onMouseEnter={() => soundManager.playHover()}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-[#fcee0a] text-zinc-300 hover:text-[#fcee0a] transition-all active:scale-95"
            title="Ver Código en GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
