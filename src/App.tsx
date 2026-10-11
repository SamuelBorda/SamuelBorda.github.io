import { useState } from 'react';
import { Background3D } from './components/Background3D';
import { NavbarHUD } from './components/NavbarHUD';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsInventory } from './components/SkillsInventory';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TerminalModal } from './components/TerminalModal';

export function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#090a0f] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Three.js Procedural 3D Canvas Background */}
      <Background3D />

      {/* Optional CRT Retro Gaming Scanlines Effect */}
      {scanlinesActive && (
        <div className="fixed inset-0 z-40 pointer-events-none scanlines" />
      )}

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavbarHUD
          onOpenTerminal={() => setTerminalOpen(true)}
          scanlinesActive={scanlinesActive}
          onToggleScanlines={() => setScanlinesActive((prev) => !prev)}
        />

        <main className="flex-1">
          <HeroSection />
          <ProjectsSection />
          <SkillsInventory />
          <ContactSection />
        </main>

        <Footer />
      </div>

      {/* Interactive Holographic Terminal Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
    </div>
  );
}

export default App;
