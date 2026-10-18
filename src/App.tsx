import { useState } from 'react';
import { Background3D } from './components/Background3D';
import type { TelemetryTarget } from './components/Background3D';
import { SpaceshipCockpit } from './components/SpaceshipCockpit';
import { CyberCursor } from './components/CyberCursor';
import { NavbarHUD } from './components/NavbarHUD';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsInventory } from './components/SkillsInventory';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TerminalModal } from './components/TerminalModal';
import { Rocket } from 'lucide-react';
import { soundManager } from './utils/soundEffects';

export function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(false);

  // Spaceship Flight Mode state
  const [isPiloting, setIsPiloting] = useState(false);
  const [flightSpeed, setFlightSpeed] = useState(0);
  const [isWarp, setIsWarp] = useState(false);
  const [proximityWarning, setProximityWarning] = useState<string | null>(null);
  const [targetDistance, setTargetDistance] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [scannedTarget, setScannedTarget] = useState<TelemetryTarget | null>(null);

  const startFlightMode = () => {
    soundManager.playWarp();
    setIsPiloting(true);
    setSecondsRemaining(10);
  };

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-[#fcee0a] selection:text-slate-950 overflow-x-hidden">
      {/* Three.js Procedural 3D Galaxy Canvas Background & Flight Engine */}
      <Background3D
        isPiloting={isPiloting}
        onPilotingChange={setIsPiloting}
        onSpeedUpdate={setFlightSpeed}
        onWarpChange={setIsWarp}
        onProximityAlert={setProximityWarning}
        onDistanceUpdate={setTargetDistance}
        onTargetScanned={setScannedTarget}
        onSecondsRemainingUpdate={setSecondsRemaining}
      />

      {/* Spaceship Cockpit Canopy & Holographic Navigation HUD */}
      <SpaceshipCockpit
        isPiloting={isPiloting}
        speed={flightSpeed}
        isWarp={isWarp}
        proximityWarning={proximityWarning}
        targetDistance={targetDistance}
        onExitFlight={() => setIsPiloting(false)}
        secondsRemaining={secondsRemaining}
        scannedTarget={scannedTarget}
      />

      {/* Interactive Cyberpunk Cursor Tracker & Trail (hidden during flight) */}
      <CyberCursor isPiloting={isPiloting} />

      {/* Optional CRT Retro Gaming Scanlines Effect */}
      {scanlinesActive && (
        <div className="fixed inset-0 z-40 pointer-events-none scanlines" />
      )}

      {/* Flight Mode Quick Launch Pill (visible when not piloting) */}
      {!isPiloting && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={startFlightMode}
            className="cursor-pointer group flex items-center gap-2 px-3.5 py-2 bg-[#050810]/85 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 hover:border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)] backdrop-blur-md font-mono text-xs transition-all duration-200"
            title="Presiona WASD o haz clic aquí para pilotar la nave"
          >
            <Rocket className="w-4 h-4 text-[#fcee0a] group-hover:rotate-45 transition-transform" />
            <span className="font-bold tracking-wider">PILOTAR NAVE [WASD]</span>
          </button>
        </div>
      )}

      {/* Main Content Layout with smooth fade out/in animation during flight */}
      <div
        className={`relative z-10 flex flex-col min-h-screen transition-all duration-700 ease-in-out ${
          isPiloting
            ? 'opacity-0 pointer-events-none -translate-y-6 scale-[0.98] filter blur-xs'
            : 'opacity-100 pointer-events-auto translate-y-0 scale-100 filter blur-none'
        }`}
      >
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
