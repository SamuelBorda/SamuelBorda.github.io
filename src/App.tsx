import { useState, useEffect } from 'react';
import { Background3D } from './components/Background3D';
import { CyberCursor } from './components/CyberCursor';
import { NavbarHUD } from './components/NavbarHUD';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsInventory } from './components/SkillsInventory';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TerminalModal } from './components/TerminalModal';
import { CommandPalette } from './components/CommandPalette';
import { soundManager } from './utils/soundEffects';
import { userProfile } from './data/profile';
import { Eye } from 'lucide-react';

const SectionDivider: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 my-4 opacity-50">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
  </div>
);

export function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [isSoundscapeActive, setIsSoundscapeActive] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast
  const showToast = (message: string) => {
    setToastMessage(message);
    soundManager.playSuccess();
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 2800);
  };

  const handleCopyEmail = () => {
    try {
      navigator.clipboard.writeText(userProfile.email);
    } catch {
      // fallback
    }
    showToast(`✓ Correo ${userProfile.email} copiado al portapapeles`);
  };

  const handleToggleSoundscape = () => {
    const isPlaying = soundManager.toggleAmbientSoundscape();
    setIsSoundscapeActive(isPlaying);
    if (isPlaying) {
      showToast('Paisaje sonoro activado');
    } else {
      showToast('Paisaje sonoro en pausa');
    }
  };

  // Listen for custom palette event from keyboard listener
  useEffect(() => {
    const handleOpenPalette = () => {
      setCommandPaletteOpen(true);
    };
    window.addEventListener('open-command-palette', handleOpenPalette);
    return () => window.removeEventListener('open-command-palette', handleOpenPalette);
  }, []);

  // Escape listener for Zen Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zenMode) {
        setZenMode(false);
        soundManager.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zenMode]);

  // Start soundscape by default on load, with automatic resume on first user interaction
  useEffect(() => {
    // 1. Intentar inicio inmediato al montar el componente
    try {
      soundManager.startAmbientSoundscape();
      setIsSoundscapeActive(true);
    } catch {
      // Ignorar si el navegador suspende AudioContext antes del primer gesto
    }

    // 2. Si las políticas de autoplay del navegador suspenden el AudioContext,
    // se reanuda imperceptiblemente con el primer toque, scroll o tecla
    const resumeOnInteraction = () => {
      try {
        soundManager.resumeAudioContext();
      } catch {
        // Ignorar
      }
    };

    window.addEventListener('pointerdown', resumeOnInteraction, { once: true });
    window.addEventListener('keydown', resumeOnInteraction, { once: true });
    window.addEventListener('scroll', resumeOnInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', resumeOnInteraction);
      window.removeEventListener('keydown', resumeOnInteraction);
      window.removeEventListener('scroll', resumeOnInteraction);
    };
  }, []);


  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-[#fcee0a] selection:text-slate-950">
      {/* Three.js Procedural 3D Galaxy Canvas Background (kept intact) */}
      <Background3D />

      {/* Interactive Cyberpunk Cursor Tracker & Trail */}
      <CyberCursor />

      {/* Optional CRT Retro Gaming Scanlines Effect */}
      {scanlinesActive && (
        <div className="fixed inset-0 z-40 pointer-events-none scanlines" />
      )}

      {/* Main Content Layout with translucent backdrop so 3D galaxy shines through */}
      <div
        className={`relative z-10 flex flex-col min-h-screen transition-opacity duration-700 ${
          zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <NavbarHUD
          onOpenTerminal={() => setTerminalOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleSoundscape={handleToggleSoundscape}
          isSoundscapeActive={isSoundscapeActive}
          scanlinesActive={scanlinesActive}
          onToggleScanlines={() => setScanlinesActive((prev) => !prev)}
        />

        <main className="flex-1">
          <HeroSection onCopyEmail={handleCopyEmail} />
          <SectionDivider />
          <ProjectsSection />
          <SectionDivider />
          <SkillsInventory />
          <SectionDivider />
          <ContactSection onCopyEmail={handleCopyEmail} />
        </main>

        <Footer onToggleZenMode={() => setZenMode(true)} />
      </div>

      {/* Zen Mode Observatory Floating Banner */}
      {zenMode && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#07090e]/90 backdrop-blur-2xl border border-cyan-400/40 text-xs font-mono text-cyan-300 shadow-[0_0_35px_rgba(0,240,255,0.3)] animate-in fade-in duration-300">
          <Eye className="w-4 h-4 text-[#00f0ff] animate-pulse" />
          <span>
            Modo Observatorio Cósmico · Presiona{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">ESC</kbd> para
            volver
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              setZenMode(false);
            }}
            className="ml-2 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] transition-colors cursor-pointer"
          >
            Salir
          </button>
        </div>
      )}

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#07090e]/95 border border-[#00f0ff]/50 text-xs font-mono text-white shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(0,240,255,0.25)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Interactive Holographic Terminal Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      {/* Interactive Command Palette Modal (Ctrl + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenTerminal={() => setTerminalOpen(true)}
        onToggleZenMode={() => setZenMode((prev) => !prev)}
        onToggleScanlines={() => setScanlinesActive((prev) => !prev)}
        onToggleSoundscape={handleToggleSoundscape}
        isSoundscapeActive={isSoundscapeActive}
        onCopyEmail={handleCopyEmail}
      />
    </div>
  );
}

export default App;

