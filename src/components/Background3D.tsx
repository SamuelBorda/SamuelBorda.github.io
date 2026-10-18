import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { soundManager } from '../utils/soundEffects';

/* ================================================================
   BACKGROUND 3D — MAJESTIC COSMIC NEBULA & LIVING SOLAR EXPLORER
   ================================================================
   Recreates the Hubble/JWST Deep Space Nebula Reference:
   • Deep Indigo & Cobalt celestial space dome (never dull black!)
   • Multi-layered Volumetric Gas Clouds:
     - Ionized Cyan & Turquoise luminous filaments (O-III emission)
     - Deep Cosmic Cobalt & Sapphire gas streams (H-beta)
     - Royal Violet & Orchid tendrils (H-alpha)
     - Dark Interstellar Dust Absorption Lanes (opaque silhouetted dust)
   • Radiant Stars with 4-Point Optical Diffraction Spikes & Halos
   • Distant Spiral Galaxy tilted in the upper quadrant
   • Embedded Star Cluster casting radiant light from inside the cloud
   • Fully Textured Orbiting Planets (Terra, Lava, Jovian Gas Giants, Rings)
   • Flight Engine: WASD + Mouse look + Warp speed + Scannable Telemetry
   ================================================================ */

export interface TelemetryTarget {
  name: string;
  telemetry: string;
  color: string;
  position?: THREE.Vector3;
}

interface Background3DProps {
  isPiloting?: boolean;
  onPilotingChange?: (active: boolean) => void;
  onSpeedUpdate?: (speed: number) => void;
  onWarpChange?: (isWarp: boolean) => void;
  onProximityAlert?: (alert: string | null) => void;
  onDistanceUpdate?: (dist: number | null) => void;
  onTargetScanned?: (target: TelemetryTarget | null) => void;
  onSecondsRemainingUpdate?: (sec: number) => void;
}

function createPRNG(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const Background3D: React.FC<Background3DProps> = ({
  isPiloting = false,
  onPilotingChange = () => {},
  onSpeedUpdate = () => {},
  onWarpChange = () => {},
  onProximityAlert = () => {},
  onDistanceUpdate = () => {},
  onTargetScanned = () => {},
  onSecondsRemainingUpdate = () => {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flightActiveRef = useRef(isPiloting);
  flightActiveRef.current = isPiloting;

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRemainingRef = useRef(10);

  const resetInactivityTimer = useCallback(() => {
    if (!flightActiveRef.current) {
      onPilotingChange?.(true);
    }

    secondsRemainingRef.current = 10;
    onSecondsRemainingUpdate?.(10);

    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      secondsRemainingRef.current = Math.max(0, secondsRemainingRef.current - 1);
      onSecondsRemainingUpdate?.(secondsRemainingRef.current);
      if (secondsRemainingRef.current <= 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      }
    }, 1000);

    inactivityTimerRef.current = setTimeout(() => {
      onPilotingChange?.(false);
      onSpeedUpdate?.(0);
      onWarpChange?.(false);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }, 10000);
  }, [onPilotingChange, onSecondsRemainingUpdate, onSpeedUpdate, onWarpChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const seed = Math.floor(Math.random() * 9000000) + 1000000;
    const rng = createPRNG(seed);

    // Toast Scanner Banner
    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300 opacity-0 translate-y-3 font-mono text-xs px-5 py-2.5 border backdrop-blur-md rounded-xs';
    toast.style.backgroundColor = 'rgba(4, 10, 28, 0.94)';
    toast.style.borderColor = '#00f0ff';
    toast.style.color = '#00f0ff';
    toast.style.boxShadow = '0 0 35px rgba(0, 240, 255, 0.4)';
    container.appendChild(toast);

    let activeScannedMesh: THREE.Object3D | null = null;

    const showPlanetHUD = (target: THREE.Object3D, name: string, telemetry: string, color = '#00f0ff') => {
      soundManager.playSuccess();
      activeScannedMesh = target;
      toast.style.borderColor = color;
      toast.style.color = color;
      toast.innerHTML = `<span style="color:#fcee0a; font-weight:bold;">[SECTOR CÓSMICO #${seed}]</span> <strong style="color:#ffffff;">${name}:</strong> ${telemetry}`;
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, 0)';
      clearTimeout((toast as any).timeoutId);
      (toast as any).timeoutId = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 14px)';
      }, 4500);

      const targetPos = new THREE.Vector3();
      target.getWorldPosition(targetPos);
      onTargetScanned?.({ name, telemetry, color, position: targetPos });
    };

    // ---- THREE.JS SCENE SETUP ----
    const scene = new THREE.Scene();
    // Rich deep space indigo background (never dull pitch black!)
    scene.background = new THREE.Color(0x030818);
    // Subtle cosmic atmosphere fog that blends distance into deep blue-violet
    scene.fog = new THREE.FogExp2(0x050d24, 0.000032);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.5,
      60000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x030818, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, true);

    const canvas = renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'auto';
    canvas.style.zIndex = '0';
    container.appendChild(canvas);

    const cosmos = new THREE.Group();
    scene.add(cosmos);

    // ========================================================
    // PROCEDURAL TEXTURE GENERATORS (NEBULA, STARS & PLANETS)
    // ========================================================

    // 1. Wispy Volumetric Nebula Gas (Emissive Cloud)
    const makeNebulaGasTexture = (tint1: string, tint2: string, tint3: string, size = 512) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d')!;

      // Radial base
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, tint1);
      g.addColorStop(0.35, tint2);
      g.addColorStop(0.7, tint3);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);

      // Organic filaments and wisps using Perlin-like random brush strokes
      for (let i = 0; i < 45; i++) {
        const cx = (0.2 + rng() * 0.6) * size;
        const cy = (0.2 + rng() * 0.6) * size;
        const rx = (0.1 + rng() * 0.35) * size;
        const ry = (0.05 + rng() * 0.2) * size;
        const angle = rng() * Math.PI;

        ctx.fillStyle = i % 2 === 0 ? tint1 : tint2;
        ctx.globalAlpha = 0.22 + rng() * 0.28;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      return new THREE.CanvasTexture(c);
    };

    // 2. Dark Interstellar Dust Lane Texture (Absorptive Silhouettes)
    const makeDarkDustTexture = (size = 512) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, size, size);

      // Dark dense dust clumps with soft feathered edges
      for (let i = 0; i < 35; i++) {
        const cx = (0.25 + rng() * 0.5) * size;
        const cy = (0.25 + rng() * 0.5) * size;
        const rad = (0.12 + rng() * 0.28) * size;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, 'rgba(2, 6, 16, 0.95)');
        g.addColorStop(0.5, 'rgba(4, 10, 24, 0.7)');
        g.addColorStop(0.85, 'rgba(6, 14, 30, 0.25)');
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };

    // 3. Optical Diffraction Spike Cross-Star Texture (Hubble / JWST Cross Flare)
    const makeCrossStarTexture = (color: string, size = 256) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d')!;
      const half = size / 2;

      // Central soft glow
      const g = ctx.createRadialGradient(half, half, 0, half, half, half * 0.8);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.08, color);
      g.addColorStop(0.35, `${color}44`);
      g.addColorStop(0.7, `${color}11`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);

      // Long horizontal spike
      const hGrad = ctx.createLinearGradient(0, half, size, half);
      hGrad.addColorStop(0, 'rgba(255,255,255,0)');
      hGrad.addColorStop(0.46, `${color}66`);
      hGrad.addColorStop(0.5, '#ffffff');
      hGrad.addColorStop(0.54, `${color}66`);
      hGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hGrad;
      ctx.fillRect(0, half - 1.5, size, 3);

      // Long vertical spike
      const vGrad = ctx.createLinearGradient(half, 0, half, size);
      vGrad.addColorStop(0, 'rgba(255,255,255,0)');
      vGrad.addColorStop(0.46, `${color}66`);
      vGrad.addColorStop(0.5, '#ffffff');
      vGrad.addColorStop(0.54, `${color}66`);
      vGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = vGrad;
      ctx.fillRect(half - 1.5, 0, 3, size);

      // Secondary diagonal spikes (fainter 45-degree cross)
      ctx.save();
      ctx.translate(half, half);
      ctx.rotate(Math.PI / 4);
      const diagGrad = ctx.createLinearGradient(-half * 0.7, 0, half * 0.7, 0);
      diagGrad.addColorStop(0, 'rgba(255,255,255,0)');
      diagGrad.addColorStop(0.5, `${color}88`);
      diagGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = diagGrad;
      ctx.fillRect(-half * 0.7, -1, size * 0.7, 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillRect(-half * 0.7, -1, size * 0.7, 2);
      ctx.restore();

      return new THREE.CanvasTexture(c);
    };

    const makeGlowTexture = (color: string, size = 128) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.18, color);
      g.addColorStop(0.5, `${color}66`);
      g.addColorStop(0.85, `${color}15`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    };

    const makeTerranTexture = (palette: { ocean: string; coast: string; land: string }) => {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 512;
      const ctx = c.getContext('2d')!;

      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
      oceanGrad.addColorStop(0, '#031024');
      oceanGrad.addColorStop(0.5, palette.ocean);
      oceanGrad.addColorStop(1, '#051833');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 1024, 512);

      const drawContinent = (cx: number, cy: number, rx: number, ry: number) => {
        ctx.fillStyle = palette.coast;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.08) {
          const n = 0.8 + Math.sin(a * 5 + rng()) * 0.18 + Math.cos(a * 8) * 0.12;
          const x = cx + Math.cos(a) * (rx + 8) * n;
          const y = cy + Math.sin(a) * (ry + 8) * n;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = palette.land;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.08) {
          const n = 0.8 + Math.sin(a * 5 + rng()) * 0.18 + Math.cos(a * 8) * 0.12;
          const x = cx + Math.cos(a) * rx * n;
          const y = cy + Math.sin(a) * ry * n;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      };

      drawContinent(250, 200, 140, 95);
      drawContinent(310, 360, 95, 120);
      drawContinent(660, 190, 210, 110);
      drawContinent(710, 340, 130, 110);
      drawContinent(880, 270, 110, 70);

      // Cloud swirls
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      for (let i = 0; i < 50; i++) {
        const cx = rng() * 1024;
        const cy = 70 + rng() * 370;
        const rx = 40 + rng() * 120;
        const ry = 12 + rng() * 35;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, (rng() - 0.5) * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(0, 0, 1024, 38);
      ctx.fillRect(0, 474, 1024, 38);

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      return tex;
    };

    const makeGasGiantTexture = (primary: string, secondary: string) => {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 512;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0, primary);
      g.addColorStop(0.25, secondary);
      g.addColorStop(0.5, primary);
      g.addColorStop(0.75, secondary);
      g.addColorStop(1, primary);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1024, 512);

      for (let y = 0; y < 512; y += 3) {
        const alpha = Math.sin(y * 0.15) * 0.12 + 0.08;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(0, y, 1024, 2);
      }

      ctx.fillStyle = 'rgba(255, 110, 50, 0.55)';
      ctx.beginPath();
      ctx.ellipse(620, 310, 80, 38, 0.08, 0, Math.PI * 2);
      ctx.fill();

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      return tex;
    };

    const makeLavaTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#0f0705';
      ctx.fillRect(0, 0, 512, 256);

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#ff3300';
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 12;
      for (let i = 0; i < 26; i++) {
        ctx.beginPath();
        let x = rng() * 512;
        let y = rng() * 256;
        ctx.moveTo(x, y);
        for (let j = 0; j < 6; j++) {
          x += (rng() - 0.5) * 70;
          y += (rng() - 0.5) * 50;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      return new THREE.CanvasTexture(c);
    };

    const makeIceTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#0a1d33');
      g.addColorStop(0.5, '#2062a3');
      g.addColorStop(1, '#0c223d');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);

      ctx.strokeStyle = '#cceeff';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        let x = rng() * 512;
        let y = rng() * 256;
        ctx.moveTo(x, y);
        for (let j = 0; j < 4; j++) {
          x += (rng() - 0.5) * 80;
          y += (rng() - 0.5) * 60;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      return new THREE.CanvasTexture(c);
    };

    const makeAsteroidTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#4a525d';
      ctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 90; i++) {
        const x = rng() * 512;
        const y = rng() * 256;
        const r = 3 + rng() * 16;
        ctx.fillStyle = 'rgba(200, 215, 230, 0.35)';
        ctx.beginPath(); ctx.arc(x, y, r + 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(30, 35, 42, 0.7)';
        ctx.beginPath(); ctx.arc(x + 1, y + 1, r, 0, Math.PI * 2); ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };

    const makeRingsTexture = (color1 = 'rgba(230, 205, 160, 0.85)', color2 = 'rgba(0, 240, 255, 0.85)') => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 1;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 512, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.12, color1);
      g.addColorStop(0.44, 'rgba(10, 8, 5, 0.04)');
      g.addColorStop(0.55, color2);
      g.addColorStop(0.88, color1);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 1);
      return new THREE.CanvasTexture(c);
    };

    // ========================================================
    // 1. CELESTIAL BACKGROUND SKY DOME (DEEP INDIGO AURA)
    // ========================================================
    // A huge inverted sphere with a deep space gradient (never pitch black!)
    const skyGeo = new THREE.SphereGeometry(45000, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0a1638) },      // Deep cosmic cobalt
        bottomColor: { value: new THREE.Color(0x020614) },   // Deep space indigo
        nebulaGlow: { value: new THREE.Color(0x183060) },    // Ambient nebula haze
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 nebulaGlow;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          float x = normalize(vWorldPosition).x;
          // Soft cosmic glow gradient
          vec3 col = mix(bottomColor, topColor, max(h * 0.5 + 0.5, 0.0));
          col += nebulaGlow * (0.28 + sin(x * 3.0) * 0.12);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    cosmos.add(skyDome);

    // ========================================================
    // 2. VOLUMETRIC COSMIC NEBULA (EXACT PALETTE FROM REFERENCE)
    // ========================================================
    // Cyan/Teal (O-III), Cobalt/Sapphire, Royal Violet/Magenta, Dark Dust Lanes
    const nebulaGroup = new THREE.Group();
    cosmos.add(nebulaGroup);

    // Textures for each layer
    const texCyanGas = makeNebulaGasTexture('rgba(0, 229, 255, 0.85)', 'rgba(24, 143, 255, 0.45)', 'rgba(10, 30, 80, 0.15)');
    const texCobaltGas = makeNebulaGasTexture('rgba(25, 64, 255, 0.8)', 'rgba(50, 110, 255, 0.45)', 'rgba(15, 25, 70, 0.15)');
    const texVioletGas = makeNebulaGasTexture('rgba(155, 48, 255, 0.8)', 'rgba(128, 40, 255, 0.45)', 'rgba(40, 10, 90, 0.15)');
    const texDarkDust = makeDarkDustTexture();

    // Spawn 80 volumetric cloud sheets across 3D space
    // Creating realistic depth & parallax when flying or rotating
    const nebulaSprites: { sprite: THREE.Sprite; baseScale: number; phase: number }[] = [];

    const nebulaLayers = [
      { tex: texCyanGas, count: 28, scaleMin: 2200, scaleMax: 5500, blend: THREE.AdditiveBlending, opacity: 0.38 },
      { tex: texCobaltGas, count: 28, scaleMin: 2500, scaleMax: 6500, blend: THREE.AdditiveBlending, opacity: 0.42 },
      { tex: texVioletGas, count: 20, scaleMin: 2000, scaleMax: 5000, blend: THREE.AdditiveBlending, opacity: 0.32 },
      { tex: texDarkDust, count: 24, scaleMin: 1800, scaleMax: 4200, blend: THREE.NormalBlending, opacity: 0.75 },
    ];

    nebulaLayers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const mat = new THREE.SpriteMaterial({
          map: layer.tex,
          transparent: true,
          opacity: layer.opacity * (0.8 + rng() * 0.4),
          blending: layer.blend,
          depthWrite: false,
        });

        const sprite = new THREE.Sprite(mat);
        // Distribute in a majestic cosmic cloud formation spanning deep space
        const theta = rng() * Math.PI * 2;
        const phi = (rng() - 0.5) * Math.PI * 0.85;
        const dist = 3500 + Math.pow(rng(), 0.7) * 14000;

        sprite.position.set(
          dist * Math.cos(phi) * Math.cos(theta),
          dist * Math.sin(phi) + (rng() - 0.5) * 2000,
          dist * Math.cos(phi) * Math.sin(theta)
        );

        const s = layer.scaleMin + rng() * (layer.scaleMax - layer.scaleMin);
        sprite.scale.set(s, s * (0.75 + rng() * 0.5), 1);
        nebulaGroup.add(sprite);

        nebulaSprites.push({
          sprite,
          baseScale: s,
          phase: rng() * Math.PI * 2,
        });
      }
    });

    // ========================================================
    // 3. RADIANT STARS WITH 4-POINT DIFFRACTION SPIKES (CROSS FLARES)
    // ========================================================
    // In the reference image, the brightest stars have cross spikes!
    const crossStarGroup = new THREE.Group();
    cosmos.add(crossStarGroup);

    const crossSpikeColors = ['#00e5ff', '#ffffff', '#ffd060', '#99ccff', '#ff88bb'];
    const crossStarSprites: THREE.Sprite[] = [];

    for (let i = 0; i < 48; i++) {
      const color = crossSpikeColors[Math.floor(rng() * crossSpikeColors.length)];
      const tex = makeCrossStarTexture(color);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.88 + rng() * 0.12,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(mat);
      const dist = 2800 + Math.pow(rng(), 0.6) * 16000;
      const theta = rng() * Math.PI * 2;
      const phi = (rng() - 0.5) * Math.PI * 0.9;

      sprite.position.set(
        dist * Math.cos(phi) * Math.cos(theta),
        dist * Math.sin(phi),
        dist * Math.cos(phi) * Math.sin(theta)
      );

      // Star sizes: some huge beacon stars, some medium
      const baseSize = (i < 8 ? 260 : 110) + rng() * 90;
      sprite.scale.set(baseSize, baseSize, 1);
      crossStarGroup.add(sprite);
      crossStarSprites.push(sprite);
    }

    // ========================================================
    // 4. DEEP STARFIELD (15,000 STARS IN COLOR SPECTRUM)
    // ========================================================
    const STAR_COUNT = 15000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const starBase = new Float32Array(STAR_COUNT * 3);
    const starPhase = new Float32Array(STAR_COUNT);

    const spectralPalette = [
      new THREE.Color('#ffffff'),   // Diamond white
      new THREE.Color('#99d6ff'),   // Icy blue
      new THREE.Color('#00f0ff'),   // Electric cyan
      new THREE.Color('#ffdfa0'),   // Warm golden
      new THREE.Color('#ff99ee'),   // Violet-pink
      new THREE.Color('#78b4ff'),   // Deep blue
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const r = 2000 + Math.pow(rng(), 0.5) * 22000;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(rng() * 2 - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      starPos[i3] = x; starPos[i3 + 1] = y; starPos[i3 + 2] = z;
      starBase[i3] = x; starBase[i3 + 1] = y; starBase[i3 + 2] = z;
      starPhase[i] = rng() * Math.PI * 2;

      const sc = spectralPalette[Math.floor(rng() * spectralPalette.length)];
      starCol[i3] = sc.r; starCol[i3 + 1] = sc.g; starCol[i3 + 2] = sc.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

    const starPoints = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        size: 3.4,
        sizeAttenuation: true,
        vertexColors: true,
        map: makeGlowTexture('#ffffff', 64),
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    cosmos.add(starPoints);

    // ========================================================
    // 5. DISTANT SPIRAL GALAXY (AS IN UPPER LEFT OF REFERENCE)
    // ========================================================
    const makeReferenceSpiralGalaxy = () => {
      const gGroup = new THREE.Group();
      // Positioned in upper quadrant like the image
      gGroup.position.set(-9500, 4800, -11500);
      gGroup.rotation.x = 0.85;
      gGroup.rotation.y = -0.45;
      gGroup.rotation.z = 0.6;

      const count = 5500;
      const gGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const cCore = new THREE.Color('#fff6dd');
      const cArm = new THREE.Color('#66aaff');

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const normR = Math.pow(rng(), 1.6);
        const r = normR * 480;
        const a = ((i % 2) * Math.PI) + r * 0.024;
        const sp = (rng() - 0.5) * (r * 0.22 + 12);

        pos[i3] = Math.cos(a) * r + sp;
        pos[i3 + 1] = (rng() - 0.5) * (45 * (1 - normR) + 4);
        pos[i3 + 2] = Math.sin(a) * r + sp;

        const mixed = cCore.clone().lerp(cArm, normR);
        col[i3] = mixed.r; col[i3 + 1] = mixed.g; col[i3 + 2] = mixed.b;
      }

      gGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      gGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

      const gMesh = new THREE.Points(
        gGeo,
        new THREE.PointsMaterial({
          size: 4.5,
          vertexColors: true,
          map: makeGlowTexture('#ffffff', 32),
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      gGroup.add(gMesh);

      // Core glow
      const coreSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture('#fff4cc', 128),
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
      }));
      coreSprite.scale.set(160, 160, 1);
      gGroup.add(coreSprite);

      return gGroup;
    };
    cosmos.add(makeReferenceSpiralGalaxy());

    // ========================================================
    // 6. CENTRAL STELLAR ARCHETYPE & EMBEDDED STAR CLUSTER
    // ========================================================
    const centralType = Math.floor(rng() * 4);
    const centralGroup = new THREE.Group();
    centralGroup.position.set(0, 0, 0);
    cosmos.add(centralGroup);

    let centralCoreRadius = 85;
    let centralMesh: THREE.Object3D;
    let centralCorona: THREE.Sprite | null = null;
    let centralDisk: THREE.Points | null = null;
    let centralJet: THREE.Sprite | null = null;
    let binaryStarB: THREE.Mesh | null = null;

    if (centralType === 0) {
      // Blazar with Jet & Fiery Disk
      centralCoreRadius = 80;
      const coreGeo = new THREE.SphereGeometry(centralCoreRadius, 64, 64);
      centralMesh = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
      centralGroup.add(centralMesh);

      const jetMat = new THREE.SpriteMaterial({
        map: makeGlowTexture('#ffffff', 128),
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
      });
      centralJet = new THREE.Sprite(jetMat);
      centralJet.scale.set(16, 950, 1);
      centralJet.rotation.z = 0.55;
      centralGroup.add(centralJet);

      (centralMesh as any).planetData = {
        name: 'BLAZAR RELATIVISTA AETHEL-IX',
        telemetry: 'Chorro colimado polar // Disco a 8,500 K en el corazón de la nebulosa',
        color: '#ffaa00',
      };
      const light = new THREE.PointLight(0xffdd99, 6.0, 20000, 0.35);
      centralGroup.add(light);

    } else if (centralType === 1) {
      // Black Hole with Lensing Ring
      centralCoreRadius = 90;
      const bhGeo = new THREE.SphereGeometry(centralCoreRadius, 64, 64);
      centralMesh = new THREE.Mesh(bhGeo, new THREE.MeshBasicMaterial({ color: 0x000000 }));
      centralGroup.add(centralMesh);

      const wRingGeo = new THREE.RingGeometry(centralCoreRadius * 1.05, centralCoreRadius * 1.85, 64);
      const wRing = new THREE.Mesh(
        wRingGeo,
        new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
        })
      );
      wRing.lookAt(camera.position);
      centralGroup.add(wRing);

      (centralMesh as any).planetData = {
        name: 'SINGULARIDAD CYGNUS-PRIME',
        telemetry: 'Horizonte de sucesos absoluto // Lente gravitacional de Einstein',
        color: '#00f0ff',
      };
      const light = new THREE.PointLight(0x77ccff, 5.0, 18000, 0.4);
      centralGroup.add(light);

    } else if (centralType === 2) {
      // Binary Twin Stars (Amber & Sapphire)
      centralCoreRadius = 60;
      centralMesh = new THREE.Mesh(
        new THREE.SphereGeometry(centralCoreRadius, 48, 48),
        new THREE.MeshBasicMaterial({ color: 0xffaa00 })
      );
      centralMesh.position.set(-85, 0, 0);
      centralGroup.add(centralMesh);

      binaryStarB = new THREE.Mesh(
        new THREE.SphereGeometry(centralCoreRadius * 0.85, 48, 48),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      binaryStarB.position.set(85, 0, 0);
      centralGroup.add(binaryStarB);

      (centralMesh as any).planetData = {
        name: 'SISTEMA BINARIO HELIOS-CYGNUS',
        telemetry: 'Estrellas gemelas en danza gravitacional dentro del cúmulo estelar',
        color: '#fcee0a',
      };
      const lightA = new THREE.PointLight(0xffdd88, 4.5, 18000, 0.35);
      const lightB = new THREE.PointLight(0x88e0ff, 4.0, 18000, 0.35);
      centralMesh.add(lightA);
      binaryStarB.add(lightB);

    } else {
      // Hyper-Quasar & Energy Corona
      centralCoreRadius = 85;
      centralMesh = new THREE.Mesh(
        new THREE.SphereGeometry(centralCoreRadius, 64, 64),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      centralGroup.add(centralMesh);

      centralCorona = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeGlowTexture('#00f0ff', 256),
          transparent: true,
          blending: THREE.AdditiveBlending,
          opacity: 0.95,
        })
      );
      centralCorona.scale.set(450, 450, 1);
      centralGroup.add(centralCorona);

      (centralMesh as any).planetData = {
        name: 'HIPER-QUÁSAR BARYCENTER',
        telemetry: 'Singularidad primordial que ioniza toda la nebulosa // T: 150,000 K',
        color: '#00f0ff',
      };
      const light = new THREE.PointLight(0xaae8ff, 6.5, 20000, 0.35);
      centralGroup.add(light);
    }

    // Swirling Accretion Disk
    const DISK_COUNT = 15000;
    const diskGeo = new THREE.BufferGeometry();
    const diskPos = new Float32Array(DISK_COUNT * 3);
    const diskCol = new Float32Array(DISK_COUNT * 3);
    const diskAngle = new Float32Array(DISK_COUNT);
    const diskDist = new Float32Array(DISK_COUNT);
    const diskSpeed = new Float32Array(DISK_COUNT);

    const cWhite = new THREE.Color('#ffffff');
    const cPrimary = new THREE.Color(centralType === 0 ? '#ffaa00' : '#00f0ff');
    const cOuter = new THREE.Color(centralType === 0 ? '#ff2200' : '#8a2be2');

    for (let i = 0; i < DISK_COUNT; i++) {
      const i3 = i * 3;
      const r = 180 + Math.pow(rng(), 0.65) * 620;
      const a = rng() * Math.PI * 2;
      const y = (rng() - 0.5) * (8 + (r / 800) * 26);

      diskDist[i] = r;
      diskAngle[i] = a;
      diskSpeed[i] = 1.2 / Math.sqrt(r);

      diskPos[i3] = Math.cos(a) * r;
      diskPos[i3 + 1] = y;
      diskPos[i3 + 2] = Math.sin(a) * r;

      const normR = (r - 180) / 620;
      const col = normR < 0.25 ? cWhite.clone().lerp(cPrimary, normR / 0.25) : cPrimary.clone().lerp(cOuter, (normR - 0.25) / 0.75);
      diskCol[i3] = col.r; diskCol[i3 + 1] = col.g; diskCol[i3 + 2] = col.b;
    }
    diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPos, 3));
    diskGeo.setAttribute('color', new THREE.BufferAttribute(diskCol, 3));

    centralDisk = new THREE.Points(
      diskGeo,
      new THREE.PointsMaterial({
        size: 3.5,
        vertexColors: true,
        map: makeGlowTexture('#ffffff', 32),
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    centralDisk.rotation.x = 0.35;
    centralGroup.add(centralDisk);

    // ========================================================
    // 7. ORBITING PLANETS SYSTEM (EXPONENTIAL SPACING)
    // ========================================================
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
    }

    const cosmicBodies: CosmicBody[] = [];
    const scannableObjects: THREE.Object3D[] = [centralMesh];

    const createHighlightRing = (radius: number, colorHex: string) => {
      const ringGeo = new THREE.RingGeometry(radius * 1.15, radius * 1.25, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorHex),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.visible = false;
      return ring;
    };

    const planetPool = [
      {
        name: 'VULCAN-PRIME (LAVA)',
        radius: 20,
        orbitRadius: 750,
        tex: makeLavaTexture(),
        hasRings: false,
        color: '#ff3300',
        tel: 'Mundo volcánico activo // Grietas de basalto fundido a 1,650 °C',
      },
      {
        name: 'ARRAKIS SECUNDUS (DESIERTO)',
        radius: 26,
        orbitRadius: 1350,
        tex: makeTerranTexture({ ocean: '#6b3012', coast: '#b35d25', land: '#d97d34' }),
        hasRings: false,
        color: '#e67e22',
        tel: 'Dunas de silicio de 500m // Tormentas electromagnéticas',
      },
      {
        name: 'TERRA CELESTIS (EDÉN)',
        radius: 34,
        orbitRadius: 2150,
        tex: makeTerranTexture({ ocean: '#0b3b75', coast: '#1abc9c', land: '#1e6834' }),
        hasRings: false,
        hasMoon: true,
        color: '#00f0ff',
        tel: 'Biosfera oceánica de clase Edén // Dispersión Rayleigh azul y nubes vivas',
      },
      {
        name: 'KRONOS MAGNUS (GIGANTE JOVIANO)',
        radius: 68,
        orbitRadius: 4200,
        tex: makeGasGiantTexture('#c9a063', '#2c2112'),
        hasRings: true,
        color: '#fcee0a',
        tel: 'Gigante gaseoso colosal // Sistema masivo de anillos dobles de hielo',
      },
      {
        name: 'EXO-PLANETA KRONOS-NEÓN',
        radius: 54,
        orbitRadius: 5800,
        tex: makeGasGiantTexture('#1b2845', '#00f0ff'),
        hasRings: true,
        neonRings: true,
        color: '#ff00aa',
        tel: 'Atmósfera de plasma ionizado // Anillos fluorescentes de silicato púrpura',
      },
      {
        name: 'GLACIES-IX (HIELO)',
        radius: 42,
        orbitRadius: 7600,
        tex: makeIceTexture(),
        hasRings: false,
        color: '#00c3ff',
        tel: 'Mundo criogénico exterior // Manto de nitrógeno helado y geiseres',
      },
    ];

    planetPool.forEach((def, idx) => {
      const pGroup = new THREE.Group();
      const pGeo = new THREE.SphereGeometry(def.radius, 64, 64);
      const pMat = new THREE.MeshStandardMaterial({
        map: def.tex,
        roughness: 0.55,
        metalness: 0.15,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pGroup.add(pMesh);

      // Atmospheric Rayleigh Rim for Terran
      if (def.name.includes('TERRA')) {
        const atmoGeo = new THREE.SphereGeometry(def.radius * 1.035, 64, 64);
        const atmoMat = new THREE.ShaderMaterial({
          uniforms: { glowColor: { value: new THREE.Color(0x00f0ff) } },
          vertexShader: `
            varying vec3 vNormal; varying vec3 vPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 glowColor; varying vec3 vNormal; varying vec3 vPosition;
            void main() {
              vec3 viewDir = normalize(-vPosition);
              float intensity = pow(0.78 - dot(viewDir, vNormal), 2.2);
              gl_FragColor = vec4(glowColor, intensity * 0.9);
            }
          `,
          transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
        });
        pGroup.add(new THREE.Mesh(atmoGeo, atmoMat));
      }

      // Planetary Rings with Proper Clearance
      if (def.hasRings) {
        const ringGeo = new THREE.RingGeometry(def.radius * 1.35, def.radius * 2.35, 96);
        const ringMat = new THREE.MeshBasicMaterial({
          map: def.neonRings
            ? makeRingsTexture('rgba(255, 0, 170, 0.9)', 'rgba(0, 240, 255, 0.95)')
            : makeRingsTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        });
        const rMesh = new THREE.Mesh(ringGeo, ringMat);
        rMesh.rotation.x = Math.PI / (2.2 + idx * 0.15);
        pGroup.add(rMesh);
      }

      // Moon orbiting Terra with safe separation (130 units away)
      if (def.hasMoon) {
        const moonRadius = 8;
        const moonGeo = new THREE.SphereGeometry(moonRadius, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({ map: makeIceTexture(), roughness: 0.8 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(130, 25, -60);
        pGroup.add(moonMesh);

        (moonMesh as any).planetData = {
          name: 'LUNA SELENE ORBITAL',
          telemetry: 'Satélite en marea sincrónica a 130,000 KM de Terra // Cero interferencia',
          color: '#d4e1ff',
        };
        scannableObjects.push(moonMesh);
      }

      const highlight = createHighlightRing(def.radius, def.color);
      pGroup.add(highlight);

      const angle = (idx * Math.PI * 2) / planetPool.length + rng() * 0.6;
      pGroup.position.set(Math.cos(angle) * def.orbitRadius, (rng() - 0.5) * 40, Math.sin(angle) * def.orbitRadius);
      cosmos.add(pGroup);

      const pData: TelemetryTarget = {
        name: def.name,
        telemetry: def.tel,
        color: def.color,
      };
      (pMesh as any).planetData = pData;
      scannableObjects.push(pMesh);

      cosmicBodies.push({
        mesh: pMesh,
        group: pGroup,
        scannerHighlight: highlight,
        radius: def.radius,
        orbitRadius: def.orbitRadius,
        orbitSpeed: 0.008 / Math.sqrt(def.orbitRadius / 750),
        orbitAngle: angle,
        rotSpeed: 0.04 + rng() * 0.04,
        data: pData,
      });
    });

    // ========================================================
    // 8. ASTEROID BELT & ALIEN RELAY MONOLITH
    // ========================================================
    const asteroidGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const aPos = asteroidGeo.attributes.position;
    for (let i = 0; i < aPos.count; i++) {
      const v = new THREE.Vector3(aPos.getX(i), aPos.getY(i), aPos.getZ(i));
      v.multiplyScalar(0.72 + rng() * 0.55);
      aPos.setXYZ(i, v.x, v.y, v.z);
    }
    asteroidGeo.computeVertexNormals();

    const asteroidMat = new THREE.MeshStandardMaterial({
      map: makeAsteroidTexture(),
      roughness: 0.88,
      metalness: 0.25,
    });
    const ASTEROID_COUNT = 450;
    const asteroidMesh = new THREE.InstancedMesh(asteroidGeo, asteroidMat, ASTEROID_COUNT);
    const dummy = new THREE.Object3D();
    const beltCenter = 3000;

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = beltCenter + (rng() - 0.5) * 450;
      dummy.position.set(Math.cos(angle) * dist, (rng() - 0.5) * 60, Math.sin(angle) * dist);
      const s = 1.0 + rng() * 3.5;
      dummy.scale.set(s, s * (0.8 + rng() * 0.4), s);
      dummy.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
      dummy.updateMatrix();
      asteroidMesh.setMatrixAt(i, dummy.matrix);
    }
    cosmos.add(asteroidMesh);

    // Alien Relay Monolith at deep frontier
    const relayGroup = new THREE.Group();
    relayGroup.position.set(-6800, 350, 6800);
    const relayMesh = new THREE.Mesh(
      new THREE.BoxGeometry(30, 160, 30),
      new THREE.MeshStandardMaterial({ color: 0x0a1020, metalness: 0.9, roughness: 0.1 })
    );
    relayGroup.add(relayMesh);
    const relayBeacon = new THREE.PointLight(0x00f0ff, 3.5, 900);
    relayBeacon.position.set(0, 85, 0);
    relayGroup.add(relayBeacon);
    (relayMesh as any).planetData = {
      name: 'MONOLITO RELÉ CUÁNTICO (FRONTERA PROFUNDA)',
      telemetry: 'Estructura artificial extraterrestre // Enlace interestelar a 9,500 KM',
      color: '#00f0ff',
    };
    scannableObjects.push(relayMesh);
    cosmos.add(relayGroup);

    // Luminous cosmic ambient lighting (bathes everything in soft nebula radiance)
    scene.add(new THREE.AmbientLight(0x284270, 3.2));

    // ========================================================
    // 9. INITIAL CAMERA FRAMING (NEAR TERRA CELESTIS)
    // ========================================================
    const terra = cosmicBodies.find((b) => b.data.name.includes('TERRA'));
    if (terra) {
      const tPos = terra.group.position;
      camera.position.set(tPos.x + 85, tPos.y + 25, tPos.z + 105);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 45, 1400);
      camera.lookAt(0, 0, 0);
    }

    // ========================================================
    // 10. INTERACTION, SCANNING & FLIGHT CONTROLS
    // ========================================================
    const raycaster = new THREE.Raycaster();
    const mouseVec2 = new THREE.Vector2();
    let isMouseDown = false;
    let prevMouseX = 0, prevMouseY = 0;
    const velocity = new THREE.Vector3();
    const shipHeading = { yaw: camera.rotation.y, pitch: camera.rotation.x };

    const onPointerDown = (e: PointerEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      mouseVec2.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouseVec2, camera);

      const hits = raycaster.intersectObjects(scannableObjects);
      if (hits.length > 0) {
        const target = hits[0].object as THREE.Mesh;
        const data = (target as any).planetData;
        if (data) {
          const matched = cosmicBodies.find((b) => b.mesh === target);
          if (matched) {
            matched.scannerHighlight.visible = true;
            (matched.scannerHighlight.material as THREE.MeshBasicMaterial).opacity = 0.95;
          }
          showPlanetHUD(target, data.name, data.telemetry, data.color);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isMouseDown) {
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        shipHeading.yaw -= dx * 0.0032;
        shipHeading.pitch -= dy * 0.0032;
        shipHeading.pitch = Math.max(-Math.PI * 0.44, Math.min(Math.PI * 0.44, shipHeading.pitch));

        if (flightActiveRef.current) resetInactivityTimer();
      }
    };

    const onPointerUp = () => { isMouseDown = false; };

    const onKeyDown = (e: KeyboardEvent) => {
      const flightKeys = [
        'KeyW', 'KeyA', 'KeyS', 'KeyD',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Space', 'ShiftLeft', 'ShiftRight',
        'KeyQ', 'KeyE', 'KeyC',
      ];
      if (flightKeys.includes(e.code)) {
        keysPressed.current[e.code] = true;
        resetInactivityTimer();
      }
      if (e.code === 'Escape') {
        onPilotingChange(false);
        onSpeedUpdate(0);
        onWarpChange(false);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, true);
    };
    window.addEventListener('resize', handleResize);

    // ========================================================
    // 11. ANIMATION LOOP
    // ========================================================
    let frameId = 0;
    let lastTime = performance.now();
    let warpHumPlayed = false;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;
      const t = now * 0.001;

      // 1. Warp Drive Acceleration & Flight Dynamics
      const kp = keysPressed.current;
      const forwardDir = new THREE.Vector3();
      camera.getWorldDirection(forwardDir);
      const rightDir = new THREE.Vector3().crossVectors(forwardDir, camera.up).normalize();

      const isHoldingWarp = (kp['ShiftLeft'] || kp['ShiftRight']) && (kp['KeyW'] || kp['ArrowUp']);
      onWarpChange?.(isHoldingWarp);

      if (isHoldingWarp && !warpHumPlayed) {
        soundManager.playWarp();
        warpHumPlayed = true;
      } else if (!isHoldingWarp) {
        warpHumPlayed = false;
      }

      const thrustAccel = isHoldingWarp ? 680 : 55;

      if (kp['KeyW'] || kp['ArrowUp']) velocity.add(forwardDir.clone().multiplyScalar(thrustAccel * dt));
      if (kp['KeyS'] || kp['ArrowDown']) velocity.add(forwardDir.clone().multiplyScalar(-thrustAccel * 0.65 * dt));
      if (kp['KeyA'] || kp['ArrowLeft']) velocity.add(rightDir.clone().multiplyScalar(-thrustAccel * 0.7 * dt));
      if (kp['KeyD'] || kp['ArrowRight']) velocity.add(rightDir.clone().multiplyScalar(thrustAccel * 0.7 * dt));
      if (kp['Space'] || kp['KeyE']) velocity.y += thrustAccel * 0.6 * dt;
      if (kp['KeyQ'] || kp['KeyC']) velocity.y -= thrustAccel * 0.6 * dt;

      velocity.multiplyScalar(0.965);
      camera.position.add(velocity.clone().multiplyScalar(dt));

      if (flightActiveRef.current) {
        onSpeedUpdate?.(velocity.length());
      }

      camera.rotation.order = 'YXZ';
      camera.rotation.y = shipHeading.yaw;
      camera.rotation.x = shipHeading.pitch;

      // 2. Proximity Hazard Detection & Collision Deflection
      let proximityHazardName: string | null = null;
      const tempVec = new THREE.Vector3();

      const distToCore = camera.position.length();
      const minCoreDist = centralCoreRadius * 1.25;
      if (distToCore < minCoreDist) {
        tempVec.copy(camera.position).normalize();
        camera.position.copy(tempVec.multiplyScalar(minCoreDist));
        velocity.multiplyScalar(0.35);
        proximityHazardName = 'NÚCLEO ESTELAR CENTRAL';
      }

      cosmicBodies.forEach((body) => {
        body.group.getWorldPosition(tempVec);
        const dist = camera.position.distanceTo(tempVec);
        const minDist = body.radius * 1.22;
        if (dist < minDist) {
          const pushDir = new THREE.Vector3().subVectors(camera.position, tempVec).normalize();
          camera.position.copy(tempVec.clone().add(pushDir.multiplyScalar(minDist)));
          velocity.multiplyScalar(0.35);
          proximityHazardName = body.data.name;
        }
      });
      onProximityAlert?.(proximityHazardName);

      // 3. Real-Time Scanned Distance Tracker
      if (activeScannedMesh) {
        const targetPos = new THREE.Vector3();
        activeScannedMesh.getWorldPosition(targetPos);
        const realDist = camera.position.distanceTo(targetPos);
        onDistanceUpdate?.(realDist);
      }

      // 4. Animate Central Body
      centralMesh.rotation.y += dt * 0.05;
      if (centralCorona) {
        centralCorona.scale.set(450 + Math.sin(t * 3) * 15, 450 + Math.sin(t * 3) * 15, 1);
      }
      if (binaryStarB) {
        binaryStarB.rotation.y -= dt * 0.06;
      }

      if (centralDisk) {
        const dArr = diskGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < DISK_COUNT; i++) {
          diskAngle[i] += diskSpeed[i] * dt * 0.6;
          const i3 = i * 3;
          dArr[i3] = Math.cos(diskAngle[i]) * diskDist[i];
          dArr[i3 + 2] = Math.sin(diskAngle[i]) * diskDist[i];
        }
        diskGeo.attributes.position.needsUpdate = true;
      }

      // 5. Animate Planets & Belts
      cosmicBodies.forEach((b) => {
        b.mesh.rotation.y += b.rotSpeed * dt;
        b.orbitAngle += b.orbitSpeed * dt * 0.2;
        b.group.position.x = Math.cos(b.orbitAngle) * b.orbitRadius;
        b.group.position.z = Math.sin(b.orbitAngle) * b.orbitRadius;

        if (b.scannerHighlight.visible) {
          b.scannerHighlight.lookAt(camera.position);
          const mat = b.scannerHighlight.material as THREE.MeshBasicMaterial;
          mat.opacity -= dt * 0.4;
          if (mat.opacity <= 0.01) {
            mat.opacity = 0;
            b.scannerHighlight.visible = false;
          }
        }
      });

      asteroidMesh.rotation.y += dt * 0.008;
      relayMesh.rotation.y += dt * 0.15;

      // 6. Subtle Pulse in Cosmic Nebula & Cross Flares (Breathes life into the gas)
      nebulaSprites.forEach((item, idx) => {
        const pulse = 1 + Math.sin(t * 0.4 + item.phase) * 0.04;
        item.sprite.scale.set(item.baseScale * pulse, item.baseScale * pulse * 0.85, 1);
        if (idx % 3 === 0) {
          item.sprite.material.opacity = (item.sprite.material as THREE.SpriteMaterial).opacity;
        }
      });

      // Subtle twinkling in diffraction cross-stars
      crossStarSprites.forEach((s, idx) => {
        const twinkle = 0.85 + Math.sin(t * 1.5 + idx * 0.8) * 0.15;
        s.material.opacity = twinkle;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

      if (container.contains(toast)) container.removeChild(toast);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [onPilotingChange, onSpeedUpdate, onWarpChange, onProximityAlert, onDistanceUpdate, onTargetScanned, resetInactivityTimer]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
