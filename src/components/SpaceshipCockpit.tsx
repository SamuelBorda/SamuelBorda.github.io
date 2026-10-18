import React, { useEffect, useState } from 'react';
import { soundManager } from '../utils/soundEffects';

interface SpaceshipCockpitProps {
  isPiloting: boolean;
  speed: number;
  isWarp?: boolean;
  proximityWarning?: string | null;
  targetDistance?: number | null;
  onExitFlight: () => void;
  secondsRemaining: number;
  scannedTarget?: {
    name: string;
    telemetry: string;
    color: string;
  } | null;
}

export const SpaceshipCockpit: React.FC<SpaceshipCockpitProps> = ({
  isPiloting,
  speed,
  isWarp = false,
  proximityWarning = null,
  targetDistance = null,
  onExitFlight,
  secondsRemaining,
  scannedTarget,
}) => {
  const [hudTick, setHudTick] = useState(0);

  useEffect(() => {
    if (!isPiloting) return;
    const interval = setInterval(() => {
      setHudTick((prev) => (prev + 1) % 100);
    }, 120);
    return () => clearInterval(interval);
  }, [isPiloting]);

  // Audio danger alarm sound effect when proximity hazard is detected
  useEffect(() => {
    if (!isPiloting || !proximityWarning) return;
    soundManager.playDangerAlarm();
    const alertInterval = setInterval(() => {
      soundManager.playDangerAlarm();
    }, 750);
    return () => clearInterval(alertInterval);
  }, [isPiloting, proximityWarning]);

  if (!isPiloting) return null;

  const displaySpeed = Math.round(speed * (isWarp ? 2400 : 420));
  const throttlePercent = isWarp ? 100 : Math.min(100, Math.round((speed / 2.8) * 100));

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden transition-opacity duration-700 opacity-100 font-mono">
      {/* ========================================================
          CRITICAL COLLISION / PROXIMITY HAZARD WARNING OVERLAY
          ======================================================== */}
      {proximityWarning && (
        <div className="absolute inset-0 pointer-events-none border-4 border-[#ff003c] shadow-[inset_0_0_120px_rgba(255,0,60,0.6)] animate-pulse z-40 flex flex-col items-center justify-start pt-20">
          <div className="bg-[#ff003c]/25 border-2 border-[#ff003c] px-6 py-2.5 backdrop-blur-md shadow-[0_0_30px_rgba(255,0,60,0.8)] flex items-center gap-3">
            <span className="text-xl text-[#fcee0a] animate-ping">⚠</span>
            <span className="text-base font-black text-white tracking-widest uppercase">
              ALERTA DE COLISIÓN INMINENTE // {proximityWarning}
            </span>
            <span className="text-xs text-[#fcee0a] bg-[#ff003c] px-2 py-0.5 rounded-xs font-bold">
              REPULSORES ACTIVOS
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          SPEED WARP TRAILS (Subtle Peripheral Streaks - Center is Clean!)
          ======================================================== */}
      {isWarp && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {/* Peripheral radial motion lines framing the edges */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 45%, rgba(0, 240, 255, 0.08) 80%, rgba(255, 0, 120, 0.22) 100%)',
            }}
          />
          {/* Subtle animated speed streaks on the sides */}
          <div className="absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#00f0ff]/20 to-transparent animate-pulse" />
          <div className="absolute inset-y-0 right-0 w-44 bg-gradient-to-l from-[#00f0ff]/20 to-transparent animate-pulse" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#fcee0a]/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#00f0ff]/20 to-transparent" />
        </div>
      )}

      {/* ========================================================
          1. COCKPIT CANOPY FRAMEWORK (Realistic Starship Canopy)
          ======================================================== */}
      {/* Top Cockpit Header Arch */}
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#060a12]/95 via-[#08101a]/85 to-transparent border-b border-[#00f0ff]/20 flex items-center justify-between px-8 z-20">
        <div className="flex items-center gap-3 text-xs tracking-widest text-[#00f0ff]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
          <span className="font-bold text-white">ORBITAL-CANOPY MK-VII</span>
          <span className="text-slate-500">//</span>
          <span className={isWarp ? 'text-[#fcee0a] font-bold animate-pulse' : 'text-slate-400'}>
            {isWarp ? '⚡ MOTOR WARP AL MÁXIMO' : 'PROPULSIÓN IÓNICA ACTIVA'}
          </span>
        </div>

        {/* 10-Second Auto-Return Countdown Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-[#03070d]/90 border border-[#fcee0a]/50 px-4 py-1.5 shadow-[0_0_15px_rgba(252,238,10,0.2)]">
          <div className="text-[10px] text-slate-400 tracking-wider">
            RETORNO A PORTAFOLIO EN:
          </div>
          <div className="text-base font-bold text-[#fcee0a] animate-pulse">
            {secondsRemaining}s
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onExitFlight();
            }}
            className="cursor-pointer ml-2 text-[10px] px-2.5 py-1 bg-[#00f0ff]/15 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 transition-colors uppercase font-bold"
          >
            VOLVER AHORA [ESC]
          </button>
        </div>
      </div>

      {/* Cockpit Canopy Struts - Angled Sci-Fi Windshield Pillars */}
      <div
        className="absolute top-0 left-0 w-24 h-full pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to right, rgba(5,8,14,0.92) 0%, rgba(5,8,14,0.6) 45%, transparent 100%)',
          borderRight: '1px solid rgba(0, 240, 255, 0.15)',
        }}
      >
        <div className="absolute top-28 left-3 w-14 h-0.5 bg-[#00f0ff]/25" />
        <div className="absolute top-52 left-3 w-10 h-0.5 bg-[#00f0ff]/25" />
        <div className="absolute bottom-40 left-3 w-12 h-0.5 bg-[#00f0ff]/25" />
      </div>

      <div
        className="absolute top-0 right-0 w-24 h-full pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to left, rgba(5,8,14,0.92) 0%, rgba(5,8,14,0.6) 45%, transparent 100%)',
          borderLeft: '1px solid rgba(0, 240, 255, 0.15)',
        }}
      >
        <div className="absolute top-28 right-3 w-14 h-0.5 bg-[#00f0ff]/25" />
        <div className="absolute top-52 right-3 w-10 h-0.5 bg-[#00f0ff]/25" />
        <div className="absolute bottom-40 right-3 w-12 h-0.5 bg-[#00f0ff]/25" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow: 'inset 0 0 120px rgba(0, 5, 15, 0.85)',
        }}
      />

      {/* ========================================================
          2. HOLOGRAPHIC FLIGHT HUD OVERLAY
          ======================================================== */}
      {/* Center Flight Reticle & Crosshair (Always Clean & Visible) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none z-20">
        <div className="absolute inset-0 rounded-full border border-[#00f0ff]/25 animate-spin" style={{ animationDuration: '30s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-[#00f0ff]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-[#00f0ff]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-[#00f0ff]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-[#00f0ff]" />
        </div>

        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-[#00f0ff]/30 flex justify-between">
          <span className="w-1.5 h-1.5 bg-[#00f0ff]/60 -mt-0.5" />
          <span className="w-1.5 h-1.5 bg-[#00f0ff]/60 -mt-0.5" />
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-[#00f0ff]/30 flex justify-between">
          <span className="w-1.5 h-1.5 bg-[#00f0ff]/60 -mt-0.5" />
          <span className="w-1.5 h-1.5 bg-[#00f0ff]/60 -mt-0.5" />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-[#fcee0a]/60">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[#fcee0a]" />
        </div>
      </div>

      {/* Left Flight Instrument: Velocity & Thruster Power */}
      <div className="absolute left-10 bottom-24 bg-[#050810]/85 border border-[#00f0ff]/30 p-3.5 backdrop-blur-md min-w-[210px] shadow-[0_0_20px_rgba(0,240,255,0.15)] z-20">
        <div className="text-[10px] text-[#00f0ff] tracking-widest font-bold mb-1.5 flex items-center justify-between">
          <span>VELOCÍMETRO INERCIAL</span>
          <span className={isWarp ? 'text-[#fcee0a] font-bold' : 'text-[#00ff88]'}>
            {isWarp ? 'WARP X8' : 'SUB-LUZ'}
          </span>
        </div>
        <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-1">
          <span>{displaySpeed}</span>
          <span className="text-xs text-[#00f0ff] font-normal">KM/S</span>
        </div>

        {/* Thruster Bar */}
        <div className="mt-2.5">
          <div className="flex justify-between text-[9px] text-slate-400 mb-1">
            <span>POTENCIA MOTOR</span>
            <span>{throttlePercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-xs overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                isWarp
                  ? 'bg-gradient-to-r from-[#ff0077] via-[#fcee0a] to-[#00f0ff] animate-pulse'
                  : 'bg-gradient-to-r from-[#00f0ff] to-[#fcee0a]'
              }`}
              style={{ width: `${throttlePercent}%` }}
            />
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between text-[9px] text-slate-400">
          <span>AMORTIGUADOR G:</span>
          <span className="text-[#00ff88] font-bold">ACTIVO</span>
        </div>
      </div>

      {/* Right Flight Instrument: Target Scanner / Nav Radar */}
      <div className="absolute right-10 bottom-24 bg-[#050810]/85 border border-[#00f0ff]/30 p-3.5 backdrop-blur-md min-w-[240px] shadow-[0_0_20px_rgba(0,240,255,0.15)] z-20">
        <div className="text-[10px] text-[#00f0ff] tracking-widest font-bold mb-1.5 flex items-center justify-between">
          <span>SENSOR DE BLANCOS</span>
          <span className="text-[#00ff88]">ESPECTRAL</span>
        </div>

        {scannedTarget ? (
          <div>
            <div className="text-sm font-bold text-white mb-0.5" style={{ color: scannedTarget.color }}>
              {scannedTarget.name}
            </div>
            {targetDistance !== null && (
              <div className="text-[10px] text-[#fcee0a] font-bold mb-1">
                DISTANCIA AL BLANCO: {Math.round(targetDistance)} KM
              </div>
            )}
            <div className="text-[10px] text-slate-300 leading-tight">
              {scannedTarget.telemetry}
            </div>
          </div>
        ) : (
          <div className="text-[10px] text-slate-400 py-1">
            Haz clic sobre cualquier planeta, estrella o singularidad para escanear y calcular distancia.
          </div>
        )}

        <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between text-[9px] text-slate-400">
          <span>SISTEMA:</span>
          <span className="text-[#fcee0a]">SECTOR V{hudTick}</span>
        </div>
      </div>

      {/* Bottom Flight Deck Controls Banner */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#060a12]/95 via-[#08101a]/85 to-transparent border-t border-[#00f0ff]/20 flex items-center justify-center px-8 z-20">
        <div className="flex items-center gap-6 text-[11px] text-slate-300 tracking-wide bg-[#02050a]/80 px-6 py-2 border border-[#00f0ff]/30 rounded-xs">
          <div>
            <span className="text-[#fcee0a] font-bold">[W / S]</span> AVANZAR / FRENAR
          </div>
          <div>
            <span className="text-[#fcee0a] font-bold">[SHIFT + W]</span> ESTELA WARP
          </div>
          <div>
            <span className="text-[#fcee0a] font-bold">[A / D]</span> VIRAR LATERAL
          </div>
          <div>
            <span className="text-[#fcee0a] font-bold">[ESPACIO / Q]</span> VERTICAL
          </div>
          <div>
            <span className="text-[#00f0ff] font-bold">[MOUSE]</span> ORIENTAR NAVE
          </div>
          <div>
            <span className="text-[#ff00aa] font-bold">[J]</span> HIPERSALTO
          </div>
          <div>
            <span className="text-[#00ff88] font-bold">[CLICK]</span> ESCANEAR
          </div>
        </div>
      </div>
    </div>
  );
};
