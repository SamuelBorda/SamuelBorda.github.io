import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, CornerDownLeft } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';
import { curatedProjects } from '../data/projects';
import confetti from 'canvas-confetti';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  id: number;
  type: 'input' | 'output' | 'system';
  text: string;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 1,
      type: 'system',
      text: 'CYBER-TERMINAL V4.2.0 [Sesión activa con ' + userProfile.handle + ']',
    },
    {
      id: 2,
      type: 'system',
      text: 'Escribe "help" para ver los comandos disponibles.',
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    soundManager.playClick();
    const newLogs: CommandLog[] = [...logs, { id: Date.now(), type: 'input', text: `$ ${inputVal}` }];

    switch (cmd) {
      case 'help':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `Comandos disponibles:
  - help      : Muestra esta lista de comandos
  - skills    : Enumera las tecnologías principales
  - projects  : Lista los proyectos curados
  - about     : Muestra la información del desarrollador
  - contact   : Información de contacto
  - github    : Enlace al perfil de GitHub
  - clear     : Limpia la pantalla de la terminal
  - secret    : Easter egg especial`,
        });
        break;

      case 'skills':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `Arsenal Principal:
  • Backend: Laravel, PHP 8, Node.js, Express, REST APIs, MySQL, PostgreSQL
  • Frontend: Next.js, React, Angular, TypeScript, Tailwind CSS, Three.js
  • Herramientas: Git, GitHub Actions, Docker, Linux`,
        });
        break;

      case 'projects':
        const projList = curatedProjects
          .map((p, i) => `  [${i + 1}] ${p.title} (${p.category}) - ${p.githubUrl}`)
          .join('\n');
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `Misiones disponibles:\n${projList}`,
        });
        break;

      case 'about':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `PERFIL:\n  Nombre: ${userProfile.name}\n  Rol: ${userProfile.role}\n  Nivel: ${userProfile.level}\n  Bio: ${userProfile.bio}`,
        });
        break;

      case 'contact':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `TRANSMISIÓN:\n  Email: ${userProfile.email}\n  GitHub: ${userProfile.github}\n  LinkedIn: ${userProfile.linkedin}`,
        });
        break;

      case 'github':
        window.open(userProfile.github, '_blank');
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `Abriendo perfil de GitHub: ${userProfile.github}`,
        });
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'sudo':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: 'Permiso denegado: este incidente será reportado al Administrador del Sistema.',
        });
        break;

      case 'secret':
        soundManager.playSuccess();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: '★ ¡HAS DESBLOQUEADO EL MODO CYBER HACKER! Disfruta la visita al portafolio.',
        });
        break;

      default:
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `Comando no reconocido: "${cmd}". Escribe "help" para ver las opciones.`,
        });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#090b10] border border-cyan-500/50 rounded-xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col font-mono text-xs">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>TERMINAL_INTERACTIVA.EXE</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal body */}
        <div className="p-4 h-80 overflow-y-auto space-y-2 text-slate-300">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`whitespace-pre-wrap leading-relaxed ${
                log.type === 'input'
                  ? 'text-cyan-400 font-bold'
                  : log.type === 'system'
                  ? 'text-purple-400'
                  : 'text-slate-300'
              }`}
            >
              {log.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input prompt */}
        <form
          onSubmit={handleCommand}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 border-t border-slate-800"
        >
          <span className="text-cyan-400 font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="escribe un comando ('help' para opciones)..."
            className="flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-600 text-xs"
          />
          <button
            type="submit"
            className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
