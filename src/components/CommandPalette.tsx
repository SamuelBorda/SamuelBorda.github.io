import React, { useState, useEffect, useRef } from 'react';
import { Search, FolderGit2, Cpu, Mail, Download, Copy, Eye, Music, Terminal, Tv, ExternalLink } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTerminal: () => void;
  onToggleZenMode: () => void;
  onToggleScanlines: () => void;
  onToggleSoundscape: () => void;
  isSoundscapeActive: boolean;
  onCopyEmail: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenTerminal,
  onToggleZenMode,
  onToggleScanlines,
  onToggleSoundscape,
  isSoundscapeActive,
  onCopyEmail,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'projects',
      title: 'Explorar Proyectos Seleccionados',
      category: 'Navegación',
      icon: FolderGit2,
      shortcut: '01',
      action: () => {
        window.location.hash = '#projects';
        onClose();
      },
    },
    {
      id: 'skills',
      title: 'Ver Stack & Especialidades Técnicas',
      category: 'Navegación',
      icon: Cpu,
      shortcut: '02',
      action: () => {
        window.location.hash = '#skills';
        onClose();
      },
    },
    {
      id: 'contact',
      title: 'Ir a Canales de Contacto Directo',
      category: 'Navegación',
      icon: Mail,
      shortcut: '03',
      action: () => {
        window.location.hash = '#contact';
        onClose();
      },
    },
    {
      id: 'copy-email',
      title: `Copiar Correo (${userProfile.email})`,
      category: 'Acción',
      icon: Copy,
      shortcut: 'Email',
      action: () => {
        onCopyEmail();
        onClose();
      },
    },
    {
      id: 'download-cv',
      title: 'Descargar Curriculum Vitae (PDF)',
      category: 'Acción',
      icon: Download,
      shortcut: 'CV',
      action: () => {
        window.open('/cv.pdf', '_blank');
        onClose();
      },
    },
    {
      id: 'zen-mode',
      title: 'Modo Observatorio Cósmico (Exploración 360°)',
      category: 'Inmersión',
      icon: Eye,
      shortcut: 'Zen',
      action: () => {
        onToggleZenMode();
        onClose();
      },
    },
    {
      id: 'soundscape',
      title: isSoundscapeActive ? 'Pausar Paisaje Sonoro Cósmico' : 'Activar Paisaje Sonoro Cósmico (432Hz)',
      category: 'Inmersión',
      icon: Music,
      shortcut: 'Audio',
      action: () => {
        onToggleSoundscape();
        onClose();
      },
    },
    {
      id: 'cli-terminal',
      title: 'Lanzar Terminal CLI de Comandos',
      category: 'Herramientas',
      icon: Terminal,
      shortcut: 'CLI',
      action: () => {
        onClose();
        onOpenTerminal();
      },
    },
    {
      id: 'scanlines',
      title: 'Alternar Filtro Scanlines CRT',
      category: 'Herramientas',
      icon: Tv,
      action: () => {
        onToggleScanlines();
        onClose();
      },
    },
    {
      id: 'github',
      title: 'Abrir Perfil Oficial en GitHub',
      category: 'Externo',
      icon: ExternalLink,
      shortcut: 'GitHub',
      action: () => {
        window.open(userProfile.github, '_blank');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundManager.playClick();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open
          const evt = new CustomEvent('open-command-palette');
          window.dispatchEvent(evt);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      soundManager.playHover();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      soundManager.playHover();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        soundManager.playClick();
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl backdrop-blur-2xl bg-[#080912]/95 border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Escribe un comando o busca una sección..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-white text-sm font-mono placeholder:text-zinc-500"
          />
          <kbd className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-mono text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    soundManager.playClick();
                    cmd.action();
                  }}
                  onMouseEnter={() => {
                    soundManager.playHover();
                    setSelectedIndex(idx);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors font-mono text-xs ${
                    isSelected
                      ? 'bg-white/[0.08] text-white'
                      : 'text-zinc-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#fcee0a] text-zinc-950' : 'bg-white/[0.04] text-zinc-400'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{cmd.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 uppercase">{cmd.category}</span>
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] text-zinc-400">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs font-mono text-zinc-500">
              No se encontraron comandos para "{query}"
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between font-mono text-[10px] text-zinc-500">
          <span>Usa las flechas ↑ ↓ para navegar</span>
          <span>ENTER para ejecutar</span>
        </div>
      </div>
    </div>
  );
};
