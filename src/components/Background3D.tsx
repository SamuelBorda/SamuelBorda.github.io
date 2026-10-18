<<<<<<< HEAD
import React, { useEffect, useRef, useCallback } from 'react';
=======
import React, { useEffect, useRef } from 'react';
>>>>>>> parent of c4a3a92 (proyecto)
import * as THREE from 'three';

<<<<<<< HEAD
/* ================================================================
   BACKGROUND 3D — INFINITE PROCEDURAL LIVING SPACE ENGINE v3.0
   ================================================================
   Features:
   • Pointer-Lock FPS mouse look (true space-sim feel)
   • Sector-based infinite universe generation (No Man's Sky style)
   • Hyperjump system (J key or click distant galaxy)
   • Living cosmos: comets, NPC ships, meteors, novas
   • Improved planetary shaders: Rayleigh atmo, specular oceans
   • Star corona + lens flare, binary stars orbiting barycenter
   • Camera roll on strafe, FOV ramp during warp
   • Real OS cursor hidden during flight via pointer lock
   ================================================================ */

export interface TelemetryTarget {
  name: string;
  telemetry: string;
  color: string;
  position?: THREE.Vector3;
}

interface Background3DProps {
  isPiloting: boolean;
  onPilotingChange: (active: boolean) => void;
  onSpeedUpdate: (speed: number) => void;
  onWarpChange: (isWarp: boolean) => void;
  onProximityAlert: (alert: string | null) => void;
  onDistanceUpdate: (dist: number | null) => void;
  onTargetScanned: (target: TelemetryTarget | null) => void;
  onSecondsRemainingUpdate: (sec: number) => void;
}

// Mulberry32 PRNG - deterministic from seed
function createPRNG(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Mix hash for sector coordinates
function sectorHash(x: number, y: number, z: number, seed: number): number {
  return (((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) >>> 0) ^ (seed >>> 0);
}

export const Background3D: React.FC<Background3DProps> = ({
  isPiloting,
  onPilotingChange,
  onSpeedUpdate,
  onWarpChange,
  onProximityAlert,
  onDistanceUpdate,
  onTargetScanned,
  onSecondsRemainingUpdate,
}) => {
=======
export const Background3D: React.FC = () => {
>>>>>>> parent of c4a3a92 (proyecto)
  const containerRef = useRef<HTMLDivElement>(null);
  const flightActiveRef = useRef(isPiloting);
  flightActiveRef.current = isPiloting;

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRemainingRef = useRef(10);

  const resetInactivityTimer = useCallback(() => {
    if (!flightActiveRef.current) {
      onPilotingChange(true);
    }

    secondsRemainingRef.current = 10;
    onSecondsRemainingUpdate(10);

    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      secondsRemainingRef.current = Math.max(0, secondsRemainingRef.current - 1);
      onSecondsRemainingUpdate(secondsRemainingRef.current);
      if (secondsRemainingRef.current <= 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      }
    }, 1000);

    inactivityTimerRef.current = setTimeout(() => {
      onPilotingChange(false);
      onSpeedUpdate(0);
      onWarpChange(false);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }, 10000);
  }, [onPilotingChange, onSecondsRemainingUpdate, onSpeedUpdate, onWarpChange]);

  useEffect(() => {
    if (!containerRef.current) return;

<<<<<<< HEAD
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const globalSeed = Math.floor(Math.random() * 9000000) + 1000000;
    const rng = createPRNG(globalSeed);

    // Toast Scanner Banner
    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300 opacity-0 translate-y-3 font-mono text-xs px-5 py-2.5 border backdrop-blur-md rounded-xs';
    toast.style.backgroundColor = 'rgba(4, 8, 22, 0.92)';
    toast.style.borderColor = '#00f0ff';
    toast.style.color = '#00f0ff';
    toast.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.35)';
    container.appendChild(toast);

    // Hyperjump overlay
    const jumpOverlay = document.createElement('div');
    jumpOverlay.style.cssText = `
      position: fixed; inset: 0; z-index: 45; pointer-events: none;
      background: radial-gradient(ellipse at center, #ffffff 0%, #00f0ff 20%, #0a0050 60%, #000010 100%);
      opacity: 0; transition: opacity 0.3s ease;
    `;
    container.appendChild(jumpOverlay);

    let activeScannedMesh: THREE.Object3D | null = null;
    let isHyperjumping = false;

    const showPlanetHUD = (target: THREE.Object3D, name: string, telemetry: string, color = '#00f0ff') => {
      soundManager.playSuccess();
      activeScannedMesh = target;
      toast.style.borderColor = color;
      toast.style.color = color;
      toast.innerHTML = `<span style="color:#fcee0a; font-weight:bold;">[SECTOR #${globalSeed}]</span> <strong style="color:#ffffff;">${name}:</strong> ${telemetry}`;
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, 0)';
      clearTimeout((toast as any).timeoutId);
      (toast as any).timeoutId = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 14px)';
      }, 4500);

      const targetPos = new THREE.Vector3();
      target.getWorldPosition(targetPos);
      onTargetScanned({ name, telemetry, color, position: targetPos });
    };

    // ---- THREE.JS SCENE SETUP ----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);
    scene.fog = new THREE.FogExp2(0x020408, 0.000018);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.5,
      80000
    );
    camera.rotation.order = 'YXZ';

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x020408, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.shadowMap.enabled = false;
=======
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a0f, 0.0015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
>>>>>>> parent of c4a3a92 (proyecto)

    // 1. Particle Cloud (Starfield Nebula)
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

<<<<<<< HEAD
    // ========================================================
    // PROCEDURAL TEXTURE LIBRARY
    // ========================================================
    const makeGlowTexture = (color: string, size = 128) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.15, color);
      g.addColorStop(0.45, `${color}88`);
      g.addColorStop(0.8, `${color}22`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    };

    // Star surface texture with solar granulation
    const makeStarTexture = (baseColor: string, spotColor: string) => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(256, 128, 0, 256, 128, 280);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.2, baseColor);
      g.addColorStop(0.7, baseColor);
      g.addColorStop(1, '#000000');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);
      // Granulation / sunspots
      for (let i = 0; i < 40; i++) {
        const x = rng() * 512;
        const y = rng() * 256;
        const r = 3 + rng() * 18;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, spotColor);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Surface flares
      ctx.strokeStyle = `${baseColor}88`;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        let x = rng() * 512, y = rng() * 256;
        ctx.moveTo(x, y);
        for (let j = 0; j < 3; j++) {
          x += (rng() - 0.5) * 40;
          y += (rng() - 0.5) * 30;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      return tex;
    };

    const makeAsteroidTexture = (r: () => number) => {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 128;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#3a424d';
      ctx.fillRect(0, 0, 256, 128);
      for (let i = 0; i < 60; i++) {
        const x = r() * 256, y = r() * 128, rad = 2 + r() * 10;
        ctx.fillStyle = 'rgba(200, 215, 230, 0.3)';
        ctx.beginPath(); ctx.arc(x, y, rad + 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(25, 30, 38, 0.8)';
        ctx.beginPath(); ctx.arc(x + 0.5, y + 0.5, rad, 0, Math.PI * 2); ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };

    const makeTerranTexture = (ocean: string, coast: string, land: string, r: () => number) => {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 512;
      const ctx = c.getContext('2d')!;
      const og = ctx.createLinearGradient(0, 0, 0, 512);
      og.addColorStop(0, '#02112a'); og.addColorStop(0.5, ocean); og.addColorStop(1, '#031523');
      ctx.fillStyle = og; ctx.fillRect(0, 0, 1024, 512);
      // Continents
      for (let c2 = 0; c2 < 4; c2++) {
        const cx = r() * 900 + 60, cy = r() * 400 + 55;
        const rx = 80 + r() * 180, ry = 60 + r() * 120;
        ctx.fillStyle = coast;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.06) {
          const n = 0.75 + Math.sin(a * 4 + r()) * 0.2 + Math.cos(a * 7) * 0.1;
          const x = cx + Math.cos(a) * (rx + 10) * n;
          const y = cy + Math.sin(a) * (ry + 10) * n;
          if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = land;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.06) {
          const n = 0.75 + Math.sin(a * 4 + r()) * 0.2 + Math.cos(a * 7) * 0.1;
          const x = cx + Math.cos(a) * rx * n;
          const y = cy + Math.sin(a) * ry * n;
          if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fill();
      }
      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      for (let i = 0; i < 55; i++) {
        const cx = r() * 1024, cy = 60 + r() * 390;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 35 + r() * 130, 10 + r() * 30, (r() - 0.5) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#e8f4ff';
      ctx.fillRect(0, 0, 1024, 32); ctx.fillRect(0, 480, 1024, 32);
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      return tex;
    };


    const makeGasGiantTexture = (p: string, s: string, r: () => number) => {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 512;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0, p); g.addColorStop(0.3, s); g.addColorStop(0.5, p);
      g.addColorStop(0.7, s); g.addColorStop(1, p);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 512);
      for (let y = 0; y < 512; y += 4) {
        const al = Math.sin(y * 0.18 + r() * 0.3) * 0.14 + 0.07;
        ctx.fillStyle = `rgba(255,255,255,${al})`;
        ctx.fillRect(0, y, 1024, 2);
      }
      // Great storm spot
      ctx.fillStyle = `rgba(255, 100, 30, 0.6)`;
      ctx.beginPath();
      ctx.ellipse(600 + r() * 200, 280 + r() * 80, 70 + r() * 40, 32 + r() * 16, 0.1, 0, Math.PI * 2);
      ctx.fill();
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      return tex;
    };

    const makeLavaTexture = (r: () => number) => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#0c0603'; ctx.fillRect(0, 0, 512, 256);
      ctx.lineWidth = 3; ctx.strokeStyle = '#ff2200'; ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 14;
      for (let i = 0; i < 28; i++) {
        ctx.beginPath();
        let x = r() * 512, y = r() * 256;
        ctx.moveTo(x, y);
        for (let j = 0; j < 7; j++) { x += (r() - 0.5) * 60; y += (r() - 0.5) * 45; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      // Lava pools
      ctx.shadowBlur = 0;
      for (let i = 0; i < 8; i++) {
        const lx = r() * 512, ly = r() * 256;
        const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 15 + r() * 25);
        lg.addColorStop(0, '#ff8800'); lg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = lg;
        ctx.beginPath(); ctx.arc(lx, ly, 25 + r() * 20, 0, Math.PI * 2); ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };

    const makeIceTexture = (r: () => number) => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#071d33'); g.addColorStop(0.5, '#1a5c9e'); g.addColorStop(1, '#081e34');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256);
      ctx.strokeStyle = '#bbdeff'; ctx.lineWidth = 1.5;
      for (let i = 0; i < 35; i++) {
        ctx.beginPath();
        let x = r() * 512, y = r() * 256;
        ctx.moveTo(x, y);
        for (let j = 0; j < 5; j++) { x += (r() - 0.5) * 80; y += (r() - 0.5) * 60; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      return new THREE.CanvasTexture(c);
    };

    const makeRockyTexture = (r: () => number) => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      const hue = Math.floor(r() * 360);
      ctx.fillStyle = `hsl(${hue}, 20%, 25%)`; ctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 80; i++) {
        const x = r() * 512, y = r() * 256, rad = 3 + r() * 20;
        ctx.fillStyle = `hsla(${hue}, 15%, ${20 + r() * 25}%, 0.7)`;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };

    const makeRingsTexture = (c1: string, c2: string) => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 1;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 512, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.1, c1);
      g.addColorStop(0.42, 'rgba(5,4,3,0.06)');
      g.addColorStop(0.52, c2);
      g.addColorStop(0.88, c1);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 1);
      return new THREE.CanvasTexture(c);
    };

    const makeNebulaTexture = (r: () => number, hue: number) => {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, 256, 256);
      for (let i = 0; i < 12; i++) {
        const x = r() * 256, y = r() * 256;
        const rad = 40 + r() * 80;
        const sat = 60 + r() * 40;
        const light = 40 + r() * 30;
        const al = 0.12 + r() * 0.22;
        const gr = ctx.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, `hsla(${hue + r() * 40}, ${sat}%, ${light}%, ${al})`);
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };

    // ========================================================
    // 1. DEEP STARFIELD (follows camera)
    // ========================================================
    const STAR_COUNT = 18000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const starPhase = new Float32Array(STAR_COUNT);
    const starBright = new Float32Array(STAR_COUNT);

    const spectralPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#a0c0ff'),   // blue-white O/B
      new THREE.Color('#ffd090'),   // yellow G
      new THREE.Color('#ffb060'),   // orange K
      new THREE.Color('#ff8888'),   // red M
      new THREE.Color('#c0e0ff'),   // hot blue
      new THREE.Color('#ffe8cc'),   // cream F
    ];

    const starfieldGroup = new THREE.Group();

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const r2 = 800 + Math.pow(rng(), 0.4) * 30000;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(rng() * 2 - 1);
      starPos[i3] = r2 * Math.sin(phi) * Math.cos(theta);
      starPos[i3 + 1] = r2 * Math.sin(phi) * Math.sin(theta);
      starPos[i3 + 2] = r2 * Math.cos(phi);
      starPhase[i] = rng() * Math.PI * 2;
      starBright[i] = 0.5 + rng() * 0.5;
      const sc = spectralPalette[Math.floor(rng() * spectralPalette.length)];
      starCol[i3] = sc.r; starCol[i3 + 1] = sc.g; starCol[i3 + 2] = sc.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

    const starPoints = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        size: 3.0, sizeAttenuation: true, vertexColors: true,
        map: makeGlowTexture('#ffffff', 64),
        transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
    );
    starfieldGroup.add(starPoints);
    scene.add(starfieldGroup);

    // ========================================================
    // 2. SECTOR-BASED UNIVERSE
    // ========================================================
    const SECTOR_SIZE = 12000;
    const SPAWN_SECTORS_RADIUS = 2;
    const generatedSectors = new Set<string>();
    const sectorObjects: Map<string, THREE.Object3D[]> = new Map();
    const scannableObjects: THREE.Object3D[] = [];

    interface CosmicBody {
      mesh: THREE.Mesh;
      group: THREE.Group;
      scannerHighlight: THREE.Mesh;
      radius: number;
      orbitRadius: number;
      orbitSpeed: number;
      orbitAngle: number;
      rotSpeed: number;
      data: TelemetryTarget;
      systemCenter: THREE.Vector3;
    }
    const cosmicBodies: CosmicBody[] = [];

    const createHighlightRing = (radius: number, colorHex: string) => {
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorHex),
        side: THREE.DoubleSide, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(radius * 1.12, radius * 1.22, 48), ringMat);
      ring.visible = false;
      return ring;
    };

    // Create a star system at world position
    const createStarSystem = (worldPos: THREE.Vector3, systemRng: () => number, sectorKey: string) => {
      const objects: THREE.Object3D[] = [];
      const systemGroup = new THREE.Group();
      systemGroup.position.copy(worldPos);
      scene.add(systemGroup);
      objects.push(systemGroup);

      // Star type
      const starTypes = [
        { name: 'GIGANTE AZUL', color: 0x6699ff, light: 0x88aaff, radius: 65, spotColor: '#3355cc', tex: makeStarTexture('#5577ee', '#2233aa', ) },
        { name: 'ENANA AMARILLA', color: 0xffdd66, light: 0xffee88, radius: 50, spotColor: '#cc8800', tex: makeStarTexture('#ffcc00', '#aa6600') },
        { name: 'GIGANTE ROJA', color: 0xff6622, light: 0xff8844, radius: 80, spotColor: '#cc2200', tex: makeStarTexture('#ff4400', '#881100') },
        { name: 'ENANA BLANCA', color: 0xeef6ff, light: 0xccddff, radius: 25, spotColor: '#aaccff', tex: makeStarTexture('#ffffff', '#99ccff') },
        { name: 'PULSAR NEUTRÓNICO', color: 0x00ffee, light: 0x00ffdd, radius: 18, spotColor: '#00ccaa', tex: makeStarTexture('#00ffff', '#006666') },
      ];
      const starType = starTypes[Math.floor(systemRng() * starTypes.length)];

      // Binary star chance
      const isBinary = systemRng() < 0.28;
      const starRadius = starType.radius;

      const starGeo2 = new THREE.SphereGeometry(starRadius, 48, 48);
      const starMat = new THREE.MeshBasicMaterial({ map: starType.tex, color: starType.color });
      const starMesh = new THREE.Mesh(starGeo2, starMat);
      systemGroup.add(starMesh);

      // Corona glow
      const coronaSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeGlowTexture(`#${starType.color.toString(16).padStart(6, '0')}`, 256),
          transparent: true, blending: THREE.AdditiveBlending, opacity: 0.88,
        })
      );
      coronaSprite.scale.set(starRadius * 5.5, starRadius * 5.5, 1);
      systemGroup.add(coronaSprite);

      // Light from star
      const starLight = new THREE.PointLight(starType.light, 4.5, SECTOR_SIZE * 0.9, 0.28);
      systemGroup.add(starLight);

      (starMesh as any).planetData = {
        name: `ESTRELLA ${starType.name} — SECTOR ${sectorKey}`,
        telemetry: `Radio: ${starRadius * 1000} KM // T: ${Math.floor(systemRng() * 30000 + 3000)} K // Clase espectral confirmada`,
        color: `#${starType.color.toString(16).padStart(6, '0')}`,
      };
      scannableObjects.push(starMesh);

      if (isBinary) {
        const starB = new THREE.Mesh(
          new THREE.SphereGeometry(starRadius * 0.65, 40, 40),
          new THREE.MeshBasicMaterial({ color: 0x88ccff })
        );
        starB.position.set(starRadius * 3.5, 0, 0);
        systemGroup.add(starB);
        const coronaB = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: makeGlowTexture('#88ccff', 128),
            transparent: true, blending: THREE.AdditiveBlending, opacity: 0.75,
          })
        );
        coronaB.scale.set(starRadius * 4, starRadius * 4, 1);
        starB.add(coronaB);
        const lightB = new THREE.PointLight(0x88ccff, 3.0, SECTOR_SIZE * 0.7, 0.3);
        starB.add(lightB);
      }

      // Accretion / protoplanetary disk
      const DISK_COUNT = 8000;
      const diskGeo = new THREE.BufferGeometry();
      const dPos = new Float32Array(DISK_COUNT * 3);
      const dCol = new Float32Array(DISK_COUNT * 3);
      const dAngle = new Float32Array(DISK_COUNT);
      const dDist = new Float32Array(DISK_COUNT);
      const dSpeed = new Float32Array(DISK_COUNT);
      const cInner = new THREE.Color().setHex(starType.color).lerp(new THREE.Color('#ffffff'), 0.6);
      const cOuter = new THREE.Color(`#${starType.color.toString(16).padStart(6, '0')}`).multiplyScalar(0.5);

      for (let i = 0; i < DISK_COUNT; i++) {
        const i3 = i * 3;
        const r = starRadius * 1.8 + Math.pow(systemRng(), 0.7) * starRadius * 8;
        const a = systemRng() * Math.PI * 2;
        const yOff = (systemRng() - 0.5) * (6 + (r / (starRadius * 8)) * 20);
        dDist[i] = r; dAngle[i] = a; dSpeed[i] = 0.9 / Math.sqrt(r);
        dPos[i3] = Math.cos(a) * r; dPos[i3 + 1] = yOff; dPos[i3 + 2] = Math.sin(a) * r;
        const nR = (r - starRadius * 1.8) / (starRadius * 8);
        const col = cInner.clone().lerp(cOuter, nR);
        dCol[i3] = col.r; dCol[i3 + 1] = col.g; dCol[i3 + 2] = col.b;
      }
      diskGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
      diskGeo.setAttribute('color', new THREE.BufferAttribute(dCol, 3));
      const diskMesh = new THREE.Points(diskGeo, new THREE.PointsMaterial({
        size: 2.8, vertexColors: true,
        map: makeGlowTexture('#ffffff', 32),
        transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      diskMesh.rotation.x = 0.2 + systemRng() * 0.3;
      systemGroup.add(diskMesh);

      // Animate disk in render loop
      (diskMesh as any)._diskData = { diskGeo, dPos, dAngle, dDist, dSpeed, count: DISK_COUNT };

      // Planets
      const planetCount = 3 + Math.floor(systemRng() * 5);
      const planetTypes = ['terran', 'gas', 'lava', 'ice', 'rocky', 'neon'] as const;

      for (let p = 0; p < planetCount; p++) {
        const pType = planetTypes[Math.floor(systemRng() * planetTypes.length)];
        const pOrbitRadius = starRadius * 5 + (p + 1) * (starRadius * 3.5 + systemRng() * starRadius * 4);
        const pRadius = pType === 'gas' ? 35 + systemRng() * 45
          : pType === 'neon' ? 30 + systemRng() * 35
          : 12 + systemRng() * 28;

        const pGeo = new THREE.SphereGeometry(pRadius, 48, 48);
        let pMat: THREE.Material;
        let pColor = '#00f0ff';
        let pName = '';
        let pTel = '';
        let hasRings = false;

        if (pType === 'terran') {
          const oceanPals = [
            { o: '#0b3b75', c: '#1abc9c', l: '#1e6834' },
            { o: '#6b3012', c: '#b35d25', l: '#d97d34' },
            { o: '#0d2b4a', c: '#2c7873', l: '#52b2a0' },
          ];
          const pal = oceanPals[Math.floor(systemRng() * oceanPals.length)];
          pMat = new THREE.MeshStandardMaterial({
            map: makeTerranTexture(pal.o, pal.c, pal.l, systemRng),
            roughness: 0.65, metalness: 0.1,
          });
          pColor = '#00f0ff'; pName = 'MUNDO OCEÁNICO'; pTel = 'Biosfera activa // Nitrógeno + O₂ // Habitable';
        } else if (pType === 'gas') {
          const gasPals = [
            ['#c9a063', '#2c2112'], ['#1b2845', '#00f0ff'], ['#7c4d92', '#c0d4f0'],
            ['#8b3a2a', '#d4a76a'],
          ];
          const gp = gasPals[Math.floor(systemRng() * gasPals.length)];
          pMat = new THREE.MeshStandardMaterial({
            map: makeGasGiantTexture(gp[0], gp[1], systemRng),
            roughness: 0.45, metalness: 0.05,
          });
          hasRings = systemRng() > 0.4;
          pColor = '#fcee0a'; pName = 'GIGANTE GASEOSO'; pTel = 'Hidrógeno + Helio // Tormentas continuas // Anillos de hielo';
        } else if (pType === 'lava') {
          pMat = new THREE.MeshStandardMaterial({
            map: makeLavaTexture(systemRng),
            emissiveMap: makeLavaTexture(systemRng),
            emissive: new THREE.Color('#ff3300'),
            emissiveIntensity: 0.55,
            roughness: 0.75, metalness: 0.2,
          });
          pColor = '#ff3300'; pName = 'MUNDO VOLCÁNICO'; pTel = 'Basalto fundido // 1,650°C // Grietas de lava activas';
        } else if (pType === 'ice') {
          pMat = new THREE.MeshStandardMaterial({
            map: makeIceTexture(systemRng),
            roughness: 0.35, metalness: 0.4,
          });
          pColor = '#88ddff'; pName = 'MUNDO HELADO'; pTel = 'Nitrógeno sólido // Geiseres de metano // −200°C';
        } else if (pType === 'neon') {
          pMat = new THREE.MeshStandardMaterial({
            map: makeGasGiantTexture('#1b2845', '#cc00ff', systemRng),
            roughness: 0.3, metalness: 0.1,
            emissive: new THREE.Color('#6600ff'), emissiveIntensity: 0.25,
          });
          hasRings = true;
          pColor = '#ff00aa'; pName = 'GIGANTE NEÓN'; pTel = 'Plasma ionizado // Anillos fluorescentes // Radiación UV extrema';
        } else {
          pMat = new THREE.MeshStandardMaterial({
            map: makeRockyTexture(systemRng),
            roughness: 0.88, metalness: 0.18,
          });
          pColor = '#cc9966'; pName = 'MUNDO ROCOSO'; pTel = 'Silicatos // Sin atmósfera // Cráter masivo detectado';
        }

        const pMesh = new THREE.Mesh(pGeo, pMat);
        const pGroup = new THREE.Group();
        pGroup.add(pMesh);

        // Atmosphere rim for terran / neon
        if (pType === 'terran' || pType === 'neon') {
          const atmoColor = pType === 'neon' ? 0xaa00ff : 0x00aaff;
          const atmoGeo = new THREE.SphereGeometry(pRadius * 1.04, 48, 48);
          const atmoMat = new THREE.ShaderMaterial({
            uniforms: { glowColor: { value: new THREE.Color(atmoColor) } },
            vertexShader: `varying vec3 vNormal; varying vec3 vPosition;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }`,
            fragmentShader: `uniform vec3 glowColor; varying vec3 vNormal; varying vec3 vPosition;
              void main() {
                vec3 viewDir = normalize(-vPosition);
                float intensity = pow(0.75 - dot(viewDir, vNormal), 2.5);
                gl_FragColor = vec4(glowColor, clamp(intensity * 0.85, 0.0, 1.0));
              }`,
            transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
          });
          pGroup.add(new THREE.Mesh(atmoGeo, atmoMat));
        }

        // Rings
        if (hasRings) {
          const ringColors = pType === 'neon'
            ? ['rgba(255,0,170,0.9)', 'rgba(0,240,255,0.95)']
            : ['rgba(230,205,160,0.85)', 'rgba(180,160,120,0.7)'];
          const ringGeo = new THREE.RingGeometry(pRadius * 1.38, pRadius * 2.55, 96);
          const ringMat = new THREE.MeshBasicMaterial({
            map: makeRingsTexture(ringColors[0], ringColors[1]),
            side: THREE.DoubleSide, transparent: true, opacity: 0.92,
          });
          const rMesh = new THREE.Mesh(ringGeo, ringMat);
          rMesh.rotation.x = Math.PI / (2.2 + systemRng() * 0.8);
          pGroup.add(rMesh);
        }

        // Moon
        if (systemRng() < 0.4 && pRadius > 20) {
          const moonR = 4 + systemRng() * 10;
          const moonMesh = new THREE.Mesh(
            new THREE.SphereGeometry(moonR, 24, 24),
            new THREE.MeshStandardMaterial({ map: makeIceTexture(systemRng), roughness: 0.85 })
          );
          const moonDist = pRadius * 2.5 + moonR * 2;
          moonMesh.position.set(moonDist, moonR, 0);
          pGroup.add(moonMesh);
          (moonMesh as any).planetData = {
            name: `LUNA ORBITAL`,
            telemetry: `Satélite natural de ${pName} // Radio orbital: ${Math.round(moonDist * 1000)} KM`,
            color: '#d4e8ff',
          };
          scannableObjects.push(moonMesh);
        }

        const highlight = createHighlightRing(pRadius, pColor);
        pGroup.add(highlight);

        const angle = systemRng() * Math.PI * 2;
        pGroup.position.set(
          Math.cos(angle) * pOrbitRadius,
          (systemRng() - 0.5) * 60,
          Math.sin(angle) * pOrbitRadius
        );
        systemGroup.add(pGroup);

        (pMesh as any).planetData = {
          name: `${pName} — SISTEMA ${sectorKey}`,
          telemetry: pTel,
          color: pColor,
        };
        scannableObjects.push(pMesh);

        cosmicBodies.push({
          mesh: pMesh,
          group: pGroup,
          scannerHighlight: highlight,
          radius: pRadius,
          orbitRadius: pOrbitRadius,
          orbitSpeed: 0.006 / Math.sqrt(pOrbitRadius / (starRadius * 5)),
          orbitAngle: angle,
          rotSpeed: 0.015 + systemRng() * 0.04,
          data: { name: `${pName} — SISTEMA ${sectorKey}`, telemetry: pTel, color: pColor },
          systemCenter: worldPos.clone(),
        });
      }

      // Asteroid belt
      const beltRadius = starRadius * (10 + systemRng() * 8);
      const BELT_COUNT = 200;
      const beltGeo = new THREE.IcosahedronGeometry(1.8, 1);
      const beltMat = new THREE.MeshStandardMaterial({
        map: makeAsteroidTexture(systemRng),
        roughness: 0.9, metalness: 0.2,
      });
      const belt = new THREE.InstancedMesh(beltGeo, beltMat, BELT_COUNT);
      const dummy = new THREE.Object3D();
      for (let i = 0; i < BELT_COUNT; i++) {
        const a = systemRng() * Math.PI * 2;
        const d = beltRadius + (systemRng() - 0.5) * starRadius * 3;
        dummy.position.set(Math.cos(a) * d, (systemRng() - 0.5) * 40, Math.sin(a) * d);
        const s = 0.8 + systemRng() * 3;
        dummy.scale.set(s, s * (0.7 + systemRng() * 0.6), s);
        dummy.rotation.set(systemRng() * Math.PI, systemRng() * Math.PI, systemRng() * Math.PI);
        dummy.updateMatrix();
        belt.setMatrixAt(i, dummy.matrix);
      }
      systemGroup.add(belt);

      if (!sectorObjects.has(sectorKey)) sectorObjects.set(sectorKey, []);
      sectorObjects.get(sectorKey)!.push(systemGroup);

      return objects;
    };

    // Create a distant galaxy (visible from far away)
    const createDistantGalaxy = (worldPos: THREE.Vector3, galaxyRng: () => number, sectorKey: string) => {
      const gGroup = new THREE.Group();
      gGroup.position.copy(worldPos);
      scene.add(gGroup);

      const count = 7000;
      const gGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const cCore = new THREE.Color().setHSL(galaxyRng() * 0.15 + 0.08, 0.4, 0.9);
      const cArm = new THREE.Color().setHSL(galaxyRng() * 0.5 + 0.6, 0.7, 0.55);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const normR = Math.pow(galaxyRng(), 1.4);
        const r = normR * 500;
        const arms = 2 + Math.floor(galaxyRng() * 3);
        const armOff = (i % arms) * (Math.PI * 2 / arms);
        const a = armOff + r * 0.022 + (galaxyRng() - 0.5) * 0.8;
        const sp = (galaxyRng() - 0.5) * (r * 0.3 + 10);
        pos[i3] = Math.cos(a) * r + sp;
        pos[i3 + 1] = (galaxyRng() - 0.5) * (60 * (1 - normR) + 4);
        pos[i3 + 2] = Math.sin(a) * r + sp;
        const mixed = cCore.clone().lerp(cArm, normR);
        col[i3] = mixed.r; col[i3 + 1] = mixed.g; col[i3 + 2] = mixed.b;
      }
      gGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      gGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

      const gMesh = new THREE.Points(gGeo, new THREE.PointsMaterial({
        size: 5.5, vertexColors: true,
        map: makeGlowTexture('#ffffff', 32),
        transparent: true, opacity: 0.8,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      gGroup.add(gMesh);

      gGroup.rotation.x = galaxyRng() * Math.PI * 2;
      gGroup.rotation.y = galaxyRng() * Math.PI * 2;

      // Glow core
      const coreSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture('#fff4cc', 64),
        transparent: true, blending: THREE.AdditiveBlending, opacity: 0.7,
      }));
      coreSprite.scale.set(180, 180, 1);
      gGroup.add(coreSprite);

      // Make clickable for hyperjump
      (gGroup as any).planetData = {
        name: `GALAXIA ESPIRAL — SECTOR ${sectorKey}`,
        telemetry: `Distancia: ~${Math.round(worldPos.length())} KM // Presiona [J] o haz CLIC para salto hiperespacial`,
        color: '#fff0aa',
      };
      (gGroup as any)._isGalaxy = true;
      (gGroup as any)._galaxyPos = worldPos.clone();

      // Add invisible clickable mesh
      const clickMesh = new THREE.Mesh(
        new THREE.SphereGeometry(500, 8, 8),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
      );
      (clickMesh as any).planetData = (gGroup as any).planetData;
      (clickMesh as any)._isGalaxy = true;
      (clickMesh as any)._galaxyPos = worldPos.clone();
      gGroup.add(clickMesh);
      scannableObjects.push(clickMesh);

      if (!sectorObjects.has(sectorKey)) sectorObjects.set(sectorKey, []);
      sectorObjects.get(sectorKey)!.push(gGroup);
    };

    // Create nebula cloud
    const createNebula = (worldPos: THREE.Vector3, nebulaRng: () => number, sectorKey: string) => {
      const hue = Math.floor(nebulaRng() * 360);
      const nGroup = new THREE.Group();
      nGroup.position.copy(worldPos);
      scene.add(nGroup);

      for (let i = 0; i < 6; i++) {
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
          map: makeNebulaTexture(nebulaRng, hue),
          transparent: true, blending: THREE.AdditiveBlending, opacity: 0.22 + nebulaRng() * 0.18,
          depthWrite: false,
        }));
        const size = 800 + nebulaRng() * 1800;
        sprite.scale.set(size, size * (0.5 + nebulaRng() * 0.5), 1);
        sprite.position.set((nebulaRng() - 0.5) * 400, (nebulaRng() - 0.5) * 200, (nebulaRng() - 0.5) * 300);
        nGroup.add(sprite);
      }

      if (!sectorObjects.has(sectorKey)) sectorObjects.set(sectorKey, []);
      sectorObjects.get(sectorKey)!.push(nGroup);
    };

    // Determine what's in a sector by its hash
    const generateSector = (sx: number, sy: number, sz: number) => {
      const key = `${sx},${sy},${sz}`;
      if (generatedSectors.has(key)) return;
      generatedSectors.add(key);

      const h = sectorHash(sx, sy, sz, globalSeed);
      const sRng = createPRNG(h);

      const worldCenter = new THREE.Vector3(
        sx * SECTOR_SIZE,
        sy * SECTOR_SIZE * 0.3,
        sz * SECTOR_SIZE
      );

      const roll = sRng();
      if (roll < 0.5) {
        // Star system
        const offset = new THREE.Vector3(
          (sRng() - 0.5) * SECTOR_SIZE * 0.5,
          (sRng() - 0.5) * SECTOR_SIZE * 0.1,
          (sRng() - 0.5) * SECTOR_SIZE * 0.5
        );
        createStarSystem(worldCenter.clone().add(offset), sRng, key);
      } else if (roll < 0.72) {
        // Distant galaxy (only in y=0 "galactic plane")
        const galaxyOffset = new THREE.Vector3(
          (sRng() - 0.5) * SECTOR_SIZE * 0.3,
          (sRng() - 0.5) * SECTOR_SIZE * 0.05,
          (sRng() - 0.5) * SECTOR_SIZE * 0.3
        );
        createDistantGalaxy(worldCenter.clone().add(galaxyOffset), sRng, key);
      } else if (roll < 0.90) {
        // Nebula
        createNebula(worldCenter, sRng, key);
      }
      // else: void sector
    };

    // Initial camera position - random sector
    const initSX = Math.floor(rng() * 6) - 3;
    const initSZ = Math.floor(rng() * 6) - 3;
    camera.position.set(
      initSX * SECTOR_SIZE + (rng() - 0.5) * SECTOR_SIZE * 0.5,
      (rng() - 0.5) * 500,
      initSZ * SECTOR_SIZE + (rng() - 0.5) * SECTOR_SIZE * 0.5
    );
    camera.lookAt(
      camera.position.x + (rng() - 0.5) * 200,
      camera.position.y,
      camera.position.z - 1000
    );

    // Generate initial sectors around spawn
    for (let dx = -SPAWN_SECTORS_RADIUS; dx <= SPAWN_SECTORS_RADIUS; dx++) {
      for (let dz = -SPAWN_SECTORS_RADIUS; dz <= SPAWN_SECTORS_RADIUS; dz++) {
        generateSector(initSX + dx, 0, initSZ + dz);
      }
    }

    scene.add(new THREE.AmbientLight(0x111828, 2.2));

    // ========================================================
    // 3. LIVING UNIVERSE — Comets, Meteors, NPC Ships
    // ========================================================
    interface LiveObject {
      group: THREE.Group;
      velocity: THREE.Vector3;
      life: number;
      maxLife: number;
      type: 'comet' | 'meteor' | 'npc';
    }
    const liveObjects: LiveObject[] = [];

    const spawnComet = () => {
      const g = new THREE.Group();
      // Comet nucleus
      const nucleus = new THREE.Mesh(
        new THREE.IcosahedronGeometry(4, 1),
        new THREE.MeshStandardMaterial({ color: 0x888899, roughness: 0.9 })
      );
      g.add(nucleus);
      // Tail
      const tailCount = 300;
      const tailGeo = new THREE.BufferGeometry();
      const tp = new Float32Array(tailCount * 3);
      const tc = new Float32Array(tailCount * 3);
      for (let i = 0; i < tailCount; i++) {
        const i3 = i * 3;
        const t = i / tailCount;
        tp[i3] = (Math.random() - 0.5) * 8 * t;
        tp[i3 + 1] = (Math.random() - 0.5) * 4 * t;
        tp[i3 + 2] = -t * 180;
        tc[i3] = 0.6 + t * 0.4; tc[i3 + 1] = 0.85; tc[i3 + 2] = 1.0;
      }
      tailGeo.setAttribute('position', new THREE.BufferAttribute(tp, 3));
      tailGeo.setAttribute('color', new THREE.BufferAttribute(tc, 3));
      const tail = new THREE.Points(tailGeo, new THREE.PointsMaterial({
        size: 2.5, vertexColors: true, transparent: true, opacity: 0.7,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      g.add(tail);

      // Spawn near camera, heading away
      const camPos = camera.position;
      const angle = Math.random() * Math.PI * 2;
      const dist = 800 + Math.random() * 1200;
      g.position.set(camPos.x + Math.cos(angle) * dist, camPos.y + (Math.random() - 0.5) * 300, camPos.z + Math.sin(angle) * dist);
      const vel = new THREE.Vector3(Math.cos(angle + Math.PI) * 120 + (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 20, Math.sin(angle + Math.PI) * 120 + (Math.random() - 0.5) * 60);
      g.lookAt(g.position.clone().add(vel));

      scene.add(g);
      liveObjects.push({ group: g, velocity: vel, life: 0, maxLife: 18, type: 'comet' });
    };

    const spawnMeteor = () => {
      const g = new THREE.Group();
      const meteGeo = new THREE.IcosahedronGeometry(1.5 + Math.random() * 3, 0);
      const mPos = meteGeo.attributes.position;
      for (let i = 0; i < mPos.count; i++) {
        const v = new THREE.Vector3(mPos.getX(i), mPos.getY(i), mPos.getZ(i));
        v.multiplyScalar(0.8 + Math.random() * 0.4);
        mPos.setXYZ(i, v.x, v.y, v.z);
      }
      meteGeo.computeVertexNormals();
      const m = new THREE.Mesh(meteGeo, new THREE.MeshStandardMaterial({
        color: 0x665544, roughness: 0.9, metalness: 0.15,
      }));
      // Glow trail
      const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture('#ff8844', 32),
        transparent: true, blending: THREE.AdditiveBlending, opacity: 0.5,
      }));
      glowSprite.scale.set(20, 20, 1);
      g.add(m);
      g.add(glowSprite);

      const camPos = camera.position;
      const a = Math.random() * Math.PI * 2;
      const d = 500 + Math.random() * 700;
      g.position.set(camPos.x + Math.cos(a) * d, camPos.y + (Math.random() - 0.5) * 200, camPos.z + Math.sin(a) * d);
      const targetAngle = a + Math.PI + (Math.random() - 0.5) * 0.8;
      const speed = 200 + Math.random() * 300;
      const vel = new THREE.Vector3(Math.cos(targetAngle) * speed, (Math.random() - 0.5) * 30, Math.sin(targetAngle) * speed);
      g.lookAt(g.position.clone().add(vel));
      scene.add(g);
      liveObjects.push({ group: g, velocity: vel, life: 0, maxLife: 8, type: 'meteor' });
    };

    const spawnNPCShip = () => {
      const g = new THREE.Group();
      // Body
      const body = new THREE.Mesh(
        new THREE.ConeGeometry(3, 14, 6),
        new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.85, roughness: 0.2 })
      );
      body.rotation.x = Math.PI / 2;
      g.add(body);
      // Engine glow
      const engineGlow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture('#00f0ff', 64),
        transparent: true, blending: THREE.AdditiveBlending, opacity: 0.9,
      }));
      engineGlow.scale.set(12, 12, 1);
      engineGlow.position.z = -8;
      g.add(engineGlow);

      const camPos = camera.position;
      const a = Math.random() * Math.PI * 2;
      const d = 400 + Math.random() * 600;
      g.position.set(camPos.x + Math.cos(a) * d, camPos.y + (Math.random() - 0.5) * 100, camPos.z + Math.sin(a) * d);
      const targetA = a + Math.PI + (Math.random() - 0.5) * 0.5;
      const speed = 80 + Math.random() * 120;
      const vel = new THREE.Vector3(Math.cos(targetA) * speed, (Math.random() - 0.5) * 15, Math.sin(targetA) * speed);
      g.lookAt(g.position.clone().add(vel));
      scene.add(g);
      liveObjects.push({ group: g, velocity: vel, life: 0, maxLife: 14, type: 'npc' });
    };

    // ========================================================
    // 4. POINTER LOCK MOUSE LOOK (FPS space sim)
    // ========================================================
    const yaw = { value: camera.rotation.y };
    const pitch = { value: camera.rotation.x };
    let isPointerLocked = false;
    let isDragging = false;
    let prevMouseX = 0, prevMouseY = 0;

    const onPointerLockChange = () => {
      isPointerLocked = document.pointerLockElement === canvas;
    };

    const onPointerLockError = () => {
      isPointerLocked = false;
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockError);

    const onMouseMove = (e: MouseEvent) => {
      if (isPointerLocked) {
        // FPS pointer-lock look
        const sens = 0.0022;
        yaw.value -= e.movementX * sens;
        pitch.value -= e.movementY * sens;
        pitch.value = Math.max(-Math.PI * 0.44, Math.min(Math.PI * 0.44, pitch.value));
        if (flightActiveRef.current) resetInactivityTimer();
      } else if (isDragging) {
        // Fallback drag look
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        prevMouseX = e.clientX; prevMouseY = e.clientY;
        yaw.value -= dx * 0.0032;
        pitch.value -= dy * 0.0032;
        pitch.value = Math.max(-Math.PI * 0.44, Math.min(Math.PI * 0.44, pitch.value));
        if (flightActiveRef.current) resetInactivityTimer();
      }
    };

    // Raycaster for click-to-scan
    const raycaster = new THREE.Raycaster();
    const mouseVec2 = new THREE.Vector2();
    let hyperjumpTarget: THREE.Vector3 | null = null;

    const doHyperjump = (targetPos: THREE.Vector3) => {
      if (isHyperjumping) return;
      isHyperjumping = true;
      soundManager.playHyperjump();

      jumpOverlay.style.opacity = '1';
      setTimeout(() => {
        camera.position.copy(targetPos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 600,
          (Math.random() - 0.5) * 200,
          600 + Math.random() * 400
        ));
        yaw.value = Math.random() * Math.PI * 2;
        pitch.value = 0;
        // Generate sectors around new position
        const nx = Math.round(camera.position.x / SECTOR_SIZE);
        const nz = Math.round(camera.position.z / SECTOR_SIZE);
        for (let dx = -2; dx <= 2; dx++) {
          for (let dz = -2; dz <= 2; dz++) {
            generateSector(nx + dx, 0, nz + dz);
          }
        }
      }, 350);
      setTimeout(() => {
        jumpOverlay.style.opacity = '0';
        isHyperjumping = false;
      }, 700);
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX; prevMouseY = e.clientY;

      // Try to acquire pointer lock for flight
      if (flightActiveRef.current && !isPointerLocked) {
        canvas.requestPointerLock();
      }

      mouseVec2.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouseVec2, camera);
      const hits = raycaster.intersectObjects(scannableObjects, true);
      if (hits.length > 0) {
        const target = hits[0].object as THREE.Mesh;
        const data = (target as any).planetData;
        if (data) {
          const matched = cosmicBodies.find((b) => b.mesh === target);
          if (matched) {
            matched.scannerHighlight.visible = true;
            (matched.scannerHighlight.material as THREE.MeshBasicMaterial).opacity = 0.9;
          }
          showPlanetHUD(target, data.name, data.telemetry, data.color);

          // Hyperjump to galaxy on click
          if ((target as any)._isGalaxy) {
            const gPos = (target as any)._galaxyPos as THREE.Vector3;
            hyperjumpTarget = gPos.clone();
            doHyperjump(hyperjumpTarget);
          }
        }
      }
    };

    const onPointerUp = () => { isDragging = false; };

    // Key controls
    const onKeyDown = (e: KeyboardEvent) => {
      const flightKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'ShiftRight', 'KeyQ', 'KeyE', 'KeyC'];
      if (flightKeys.includes(e.code)) {
        keysPressed.current[e.code] = true;
        resetInactivityTimer();
        // Request pointer lock on first movement key
        if (!isPointerLocked && flightActiveRef.current) {
          canvas.requestPointerLock();
        }
      }
      if (e.code === 'Escape') {
        document.exitPointerLock();
        onPilotingChange(false);
        onSpeedUpdate(0);
        onWarpChange(false);
      }
      // Hyperjump key J
      if (e.code === 'KeyJ' && hyperjumpTarget) {
        doHyperjump(hyperjumpTarget);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight, true);
    };
    window.addEventListener('resize', handleResize);

    // ========================================================
    // 5. ANIMATION LOOP
    // ========================================================
    let frameId = 0;
    let lastTime = performance.now();
    let warpHumPlayed = false;
    let cometTimer = 0;
    let meteorTimer = 0;
    let npcTimer = 0;
    const targetFOV = { value: 52 };
    const currentFOV = { value: 52 };
    const velocity = new THREE.Vector3();
    let cameraRoll = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;
      const t = now * 0.001;

      // ---- FLIGHT PHYSICS ----
      const kp = keysPressed.current;
      const forwardDir = new THREE.Vector3();
      camera.getWorldDirection(forwardDir);
      const rightDir = new THREE.Vector3().crossVectors(forwardDir, camera.up).normalize();
      const upDir = new THREE.Vector3().crossVectors(rightDir, forwardDir).normalize();

      const isHoldingWarp = (kp['ShiftLeft'] || kp['ShiftRight']) && (kp['KeyW'] || kp['ArrowUp']);
      onWarpChange(isHoldingWarp);

      if (isHoldingWarp && !warpHumPlayed) {
        soundManager.playWarp();
        warpHumPlayed = true;
      } else if (!isHoldingWarp) {
        warpHumPlayed = false;
      }

      const thrustAccel = isHoldingWarp ? 720 : 58;
      let isThrusting = false;

      if (kp['KeyW'] || kp['ArrowUp']) { velocity.add(forwardDir.clone().multiplyScalar(thrustAccel * dt)); isThrusting = true; }
      if (kp['KeyS'] || kp['ArrowDown']) { velocity.add(forwardDir.clone().multiplyScalar(-thrustAccel * 0.6 * dt)); isThrusting = true; }
      if (kp['KeyA'] || kp['ArrowLeft']) { velocity.add(rightDir.clone().multiplyScalar(-thrustAccel * 0.7 * dt)); isThrusting = true; }
      if (kp['KeyD'] || kp['ArrowRight']) { velocity.add(rightDir.clone().multiplyScalar(thrustAccel * 0.7 * dt)); isThrusting = true; }
      if (kp['Space'] || kp['KeyE']) { velocity.add(upDir.clone().multiplyScalar(thrustAccel * 0.55 * dt)); isThrusting = true; }
      if (kp['KeyQ'] || kp['KeyC']) { velocity.add(upDir.clone().multiplyScalar(-thrustAccel * 0.55 * dt)); isThrusting = true; }

      velocity.multiplyScalar(0.968);
      camera.position.add(velocity.clone().multiplyScalar(dt));

      if (flightActiveRef.current) onSpeedUpdate(velocity.length());

      // Camera rotation (pointer lock or drag)
      camera.rotation.order = 'YXZ';
      camera.rotation.y = yaw.value;
      camera.rotation.x = pitch.value;

      // Camera roll on strafe
      const strafeInput = (kp['KeyA'] || kp['ArrowLeft'] ? -1 : 0) + (kp['KeyD'] || kp['ArrowRight'] ? 1 : 0);
      const targetRoll = -strafeInput * 0.09;
      cameraRoll += (targetRoll - cameraRoll) * dt * 3.5;
      camera.rotation.z = cameraRoll;

      // FOV ramp (warp = wider FOV for speed feel)
      targetFOV.value = isHoldingWarp ? 68 : isThrusting ? 56 : 52;
      currentFOV.value += (targetFOV.value - currentFOV.value) * dt * 3;
      camera.fov = currentFOV.value;
      camera.updateProjectionMatrix();

      // Starfield follows camera (parallax-free background)
      starfieldGroup.position.copy(camera.position);

      // ---- SECTOR STREAMING ----
      if (!isHyperjumping) {
        const curSX = Math.round(camera.position.x / SECTOR_SIZE);
        const curSZ = Math.round(camera.position.z / SECTOR_SIZE);
        for (let dx = -2; dx <= 2; dx++) {
          for (let dz = -2; dz <= 2; dz++) {
            generateSector(curSX + dx, 0, curSZ + dz);
          }
        }
      }

      // ---- PROXIMITY HAZARD ----
      let proximityHazardName: string | null = null;
      const tempVec = new THREE.Vector3();

      cosmicBodies.forEach((body) => {
        body.group.getWorldPosition(tempVec);
        const dist = camera.position.distanceTo(tempVec);
        const minDist = body.radius * 1.22;
        if (dist < minDist) {
          const pushDir = new THREE.Vector3().subVectors(camera.position, tempVec).normalize();
          camera.position.copy(tempVec.clone().add(pushDir.multiplyScalar(minDist)));
          velocity.multiplyScalar(0.3);
          proximityHazardName = body.data.name;
        }
      });
      onProximityAlert(proximityHazardName);

      // Scanned target distance tracking
      if (activeScannedMesh) {
        const tPos = new THREE.Vector3();
        activeScannedMesh.getWorldPosition(tPos);
        onDistanceUpdate(camera.position.distanceTo(tPos));
      }

      // ---- ANIMATE PLANETS ----
      cosmicBodies.forEach((b) => {
        b.mesh.rotation.y += b.rotSpeed * dt;
        b.orbitAngle += b.orbitSpeed * dt * 0.25;
        // Orbit around the system center (planet groups are children of the system group)
        b.group.position.x = Math.cos(b.orbitAngle) * b.orbitRadius;
        b.group.position.z = Math.sin(b.orbitAngle) * b.orbitRadius;

        if (b.scannerHighlight.visible) {
          b.scannerHighlight.lookAt(camera.position);
          const mat = b.scannerHighlight.material as THREE.MeshBasicMaterial;
          mat.opacity -= dt * 0.45;
          if (mat.opacity <= 0.01) { mat.opacity = 0; b.scannerHighlight.visible = false; }
        }
      });

      // Animate accretion disks
      scene.traverse((obj) => {
        if ((obj as any)._diskData) {
          const { diskGeo, dPos, dAngle, dDist, dSpeed, count } = (obj as any)._diskData;
          for (let i = 0; i < count; i++) {
            dAngle[i] += dSpeed[i] * dt * 0.5;
            const i3 = i * 3;
            dPos[i3] = Math.cos(dAngle[i]) * dDist[i];
            dPos[i3 + 2] = Math.sin(dAngle[i]) * dDist[i];
          }
          diskGeo.attributes.position.needsUpdate = true;
        }
      });

      // Star rotation
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && (obj as any).planetData?.name?.includes('ESTRELLA')) {
          obj.rotation.y += dt * 0.04;
        }
      });

      // ---- LIVE OBJECTS ----
      cometTimer += dt;
      meteorTimer += dt;
      npcTimer += dt;

      if (cometTimer > 12 + Math.random() * 8) { cometTimer = 0; spawnComet(); }
      if (meteorTimer > 4 + Math.random() * 4) { meteorTimer = 0; spawnMeteor(); }
      if (npcTimer > 20 + Math.random() * 15) { npcTimer = 0; spawnNPCShip(); }

      for (let i = liveObjects.length - 1; i >= 0; i--) {
        const lo = liveObjects[i];
        lo.life += dt;
        lo.group.position.add(lo.velocity.clone().multiplyScalar(dt));

        if (lo.type === 'npc') {
          // Engine glow pulse
          lo.group.traverse((c) => {
            if (c instanceof THREE.Sprite) {
              c.material.opacity = 0.7 + Math.sin(t * 8) * 0.2;
            }
          });
        }

        if (lo.life >= lo.maxLife) {
          scene.remove(lo.group);
          liveObjects.splice(i, 1);
        }
      }

      // ---- STAR TWINKLE ----
      if (Math.floor(t * 8) % 2 === 0) {
        const posArr = starGeo.attributes.position.array as Float32Array;
        const colorArr = starGeo.attributes.color.array as Float32Array;
        for (let i = 0; i < Math.min(300, STAR_COUNT); i++) {
          const idx = Math.floor(Math.random() * STAR_COUNT);
          const i3 = idx * 3;
          const twinkle = 0.7 + Math.sin(t * 2 + starPhase[idx]) * 0.3;
          colorArr[i3] = Math.min(1, colorArr[i3] * twinkle * starBright[idx] + 0.01);
          colorArr[i3 + 1] = Math.min(1, colorArr[i3 + 1] * twinkle * starBright[idx] + 0.01);
          colorArr[i3 + 2] = Math.min(1, colorArr[i3 + 2] * twinkle * starBright[idx] + 0.01);
        }
        posArr; // avoid unused warning
        starGeo.attributes.color.needsUpdate = true;
      }

=======
    const color1 = new THREE.Color(0x06b6d4); // Cyan
    const color2 = new THREE.Color(0x8b5cf6); // Purple
    const color3 = new THREE.Color(0x3b82f6); // Blue

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 350;

      // Gradient color blend
      const mixedColor = color1.clone().lerp(
        Math.random() > 0.5 ? color2 : color3,
        Math.random()
      );
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 2. Holographic Geometric Core (Wireframe Icosahedron & Dodecahedron)
    const coreGroup = new THREE.Group();

    // Outer wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(18, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    // Inner wireframe octahedron
    const innerGeo = new THREE.OctahedronGeometry(10, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Glowing energy center
    const light = new THREE.PointLight(0x06b6d4, 2, 80);
    coreGroup.add(light);

    // Place core slightly offset for balance
    coreGroup.position.set(28, 5, 0);
    scene.add(coreGroup);

    // 3. Ambient cyber grid at bottom
    const gridHelper = new THREE.GridHelper(300, 40, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = -60;
    scene.add(gridHelper);

    // Mouse Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Orbit particles gently
      particles.rotation.y = elapsedTime * 0.03 + mouseX * 0.2;
      particles.rotation.x = elapsedTime * 0.015 + mouseY * 0.2;

      // Rotate geometric core
      coreGroup.rotation.x = elapsedTime * 0.25;
      coreGroup.rotation.y = elapsedTime * 0.35;
      innerMesh.rotation.z = -elapsedTime * 0.5;
      innerMesh.rotation.x = elapsedTime * 0.4;

      // Pulsing scale for core
      const pulse = 1 + Math.sin(elapsedTime * 2) * 0.04;
      coreGroup.scale.set(pulse, pulse, pulse);

      // Camera parallax
      camera.position.x = mouseX * 12;
      camera.position.y = -mouseY * 8;
      camera.lookAt(0, 0, 0);

>>>>>>> parent of c4a3a92 (proyecto)
      renderer.render(scene, camera);
    };

    animate();

<<<<<<< HEAD
    return () => {
      cancelAnimationFrame(frameId);
      document.exitPointerLock();
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('pointerlockerror', onPointerLockError);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

      if (container.contains(toast)) container.removeChild(toast);
      if (container.contains(jumpOverlay)) container.removeChild(jumpOverlay);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
=======
    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
>>>>>>> parent of c4a3a92 (proyecto)
      renderer.dispose();
    };
  }, [onPilotingChange, onSpeedUpdate, onWarpChange, onProximityAlert, onDistanceUpdate, onTargetScanned, resetInactivityTimer]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90"
      aria-hidden="true"
    />
  );
};
