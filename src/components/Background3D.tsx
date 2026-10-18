import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { soundManager } from '../utils/soundEffects';

/* ================================================================
   BACKGROUND 3D — Cosmic Nebula & Living Solar Explorer
   ================================================================
   • Custom 3D GLB Models:
     - Earth (earth.glb) with live rotating animated cloud deck
     - Central Sun (sun.glb) with live animated solar corona & flares
   • Realistic Deep Space Cosmic Nebula Background (from reference):
     - Deep Celestial Sky Dome (never flat black!)
     - Volumetric Multi-layer Gas Clouds (Cyan O-III, Cobalt H-beta, Violet)
     - Dark Interstellar Dust Absorption Lanes for authentic 3D contrast
     - Radiant Stars with 4-Point Optical Diffraction Cross Flares
     - Distant Spiral Galaxy tilted in the upper quadrant
   • Orbiting Planets: Saturn (rings), Mars, Neptune, Moon
   • Full mouse & touch interaction with inertia and HUD telemetry
   ================================================================ */

export const Background3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up any residual elements
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // ---- HUD Toast Banner inside DOM for Planet Interactions ----
    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300 opacity-0 translate-y-3 font-mono text-xs px-4 py-2 border backdrop-blur-md rounded-xs';
    toast.style.backgroundColor = 'rgba(4, 10, 26, 0.9)';
    toast.style.borderColor = '#00f0ff';
    toast.style.color = '#00f0ff';
    toast.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.35)';
    container.appendChild(toast);

    const showPlanetHUD = (name: string, telemetry: string, color = '#00f0ff') => {
      soundManager.playSuccess();
      toast.style.borderColor = color;
      toast.style.color = color;
      toast.innerHTML = `<span style="color:#fcee0a; font-weight:bold;">[SCANNER]</span> <strong style="color:#ffffff;">${name}:</strong> ${telemetry}`;
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, 0)';
      clearTimeout((toast as any).timeoutId);
      (toast as any).timeoutId = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 12px)';
      }, 3800);
    };

    // ---- SCENE, CAMERA & RENDERER ----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030818); // Deep indigo, never dull black
    scene.fog = new THREE.FogExp2(0x050e26, 0.00075);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      60000
    );
    camera.position.set(0, 0, 110);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x030818, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
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

    // GLTF Loader & Animation Mixers
    const gltfLoader = new GLTFLoader();
    const animationMixers: THREE.AnimationMixer[] = [];

    // ========================================================
    // PROCEDURAL TEXTURE GENERATORS
    // ========================================================
    const makeGlowTexture = (color: string, size = 128) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.12, color);
      g.addColorStop(0.4, `${color}66`);
      g.addColorStop(0.8, `${color}14`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    };

    // Wispy Volumetric Nebula Gas (Emissive Cloud)
    const makeNebulaGasTexture = (tint1: string, tint2: string, tint3: string, size = 512) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, tint1);
      g.addColorStop(0.35, tint2);
      g.addColorStop(0.7, tint3);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);

      for (let i = 0; i < 40; i++) {
        const cx = (0.2 + Math.random() * 0.6) * size;
        const cy = (0.2 + Math.random() * 0.6) * size;
        const rx = (0.1 + Math.random() * 0.35) * size;
        const ry = (0.05 + Math.random() * 0.2) * size;
        const angle = Math.random() * Math.PI;

        ctx.fillStyle = i % 2 === 0 ? tint1 : tint2;
        ctx.globalAlpha = 0.22 + Math.random() * 0.28;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      return new THREE.CanvasTexture(c);
    };

    // Dark Dust Texture (Absorptive silhouettes for 3D depth)
    const makeDarkDustTexture = (size = 512) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, size, size);

      for (let i = 0; i < 30; i++) {
        const cx = (0.25 + Math.random() * 0.5) * size;
        const cy = (0.25 + Math.random() * 0.5) * size;
        const rad = (0.12 + Math.random() * 0.28) * size;
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

    // Optical 4-Point Diffraction Cross Flare for Stars (Hubble/JWST style)
    const makeCrossStarTexture = (color: string, size = 256) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d')!;
      const half = size / 2;

      const g = ctx.createRadialGradient(half, half, 0, half, half, half * 0.8);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.08, color);
      g.addColorStop(0.35, `${color}44`);
      g.addColorStop(0.7, `${color}11`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);

      // Horizontal spike
      const hGrad = ctx.createLinearGradient(0, half, size, half);
      hGrad.addColorStop(0, 'rgba(255,255,255,0)');
      hGrad.addColorStop(0.46, `${color}66`);
      hGrad.addColorStop(0.5, '#ffffff');
      hGrad.addColorStop(0.54, `${color}66`);
      hGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hGrad;
      ctx.fillRect(0, half - 1.5, size, 3);

      // Vertical spike
      const vGrad = ctx.createLinearGradient(half, 0, half, size);
      vGrad.addColorStop(0, 'rgba(255,255,255,0)');
      vGrad.addColorStop(0.46, `${color}66`);
      vGrad.addColorStop(0.5, '#ffffff');
      vGrad.addColorStop(0.54, `${color}66`);
      vGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = vGrad;
      ctx.fillRect(half - 1.5, 0, 3, size);

      return new THREE.CanvasTexture(c);
    };

    // Planet textures for remaining solar bodies
    const makeMarsTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#591a0c'); g.addColorStop(0.5, '#b83d18'); g.addColorStop(1, '#66220f');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#f0ebe6';
      ctx.fillRect(0, 0, 512, 14); ctx.fillRect(0, 242, 512, 14);
      return new THREE.CanvasTexture(c);
    };

    const makeGasGiantTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#c79c5e'); g.addColorStop(0.25, '#e4c48f'); g.addColorStop(0.5, '#9d703b');
      g.addColorStop(0.75, '#cba068'); g.addColorStop(1, '#81592c');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256);
      return new THREE.CanvasTexture(c);
    };

    const makeIceGiantTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#1a3c6b'); g.addColorStop(0.5, '#2e6bb0'); g.addColorStop(1, '#1b4075');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256);
      return new THREE.CanvasTexture(c);
    };

    const makeMoonTexture = () => {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 128;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#8a9199'; ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = '#676d75';
      for (let i = 0; i < 45; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 256, Math.random() * 128, 1 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };

    const makeRingsTexture = () => {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 1;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 256, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.15, 'rgba(215, 185, 130, 0.85)');
      g.addColorStop(0.48, 'rgba(15, 12, 8, 0.08)');
      g.addColorStop(0.58, 'rgba(235, 205, 150, 0.9)');
      g.addColorStop(0.9, 'rgba(190, 160, 110, 0.7)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 1);
      return new THREE.CanvasTexture(c);
    };

    // ========================================================
    // 1. CELESTIAL SKY DOME (NEVER FLAT BLACK)
    // ========================================================
    const skyGeo = new THREE.SphereGeometry(30000, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0a1638) },      // Deep cosmic cobalt
        bottomColor: { value: new THREE.Color(0x020614) },   // Deep space indigo
        nebulaGlow: { value: new THREE.Color(0x183060) },    // Ambient nebula radiance
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
          vec3 col = mix(bottomColor, topColor, max(h * 0.5 + 0.5, 0.0));
          col += nebulaGlow * (0.28 + sin(x * 3.0) * 0.12);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });
    cosmos.add(new THREE.Mesh(skyGeo, skyMat));

    // ========================================================
    // 2. VOLUMETRIC COSMIC NEBULA (REFERENCE MATCHING)
    // ========================================================
    const nebulaGroup = new THREE.Group();
    cosmos.add(nebulaGroup);

    const texCyanGas = makeNebulaGasTexture('rgba(0, 229, 255, 0.85)', 'rgba(24, 143, 255, 0.45)', 'rgba(10, 30, 80, 0.15)');
    const texCobaltGas = makeNebulaGasTexture('rgba(25, 64, 255, 0.8)', 'rgba(50, 110, 255, 0.45)', 'rgba(15, 25, 70, 0.15)');
    const texVioletGas = makeNebulaGasTexture('rgba(155, 48, 255, 0.8)', 'rgba(128, 40, 255, 0.45)', 'rgba(40, 10, 90, 0.15)');
    const texDarkDust = makeDarkDustTexture();

    const nebulaSprites: { sprite: THREE.Sprite; baseScale: number; phase: number }[] = [];
    const nebulaLayers = [
      { tex: texCyanGas, count: 24, scaleMin: 180, scaleMax: 420, blend: THREE.AdditiveBlending, opacity: 0.38 },
      { tex: texCobaltGas, count: 24, scaleMin: 200, scaleMax: 500, blend: THREE.AdditiveBlending, opacity: 0.42 },
      { tex: texVioletGas, count: 18, scaleMin: 160, scaleMax: 380, blend: THREE.AdditiveBlending, opacity: 0.32 },
      { tex: texDarkDust, count: 20, scaleMin: 140, scaleMax: 340, blend: THREE.NormalBlending, opacity: 0.7 },
    ];

    nebulaLayers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const mat = new THREE.SpriteMaterial({
          map: layer.tex,
          transparent: true,
          opacity: layer.opacity * (0.8 + Math.random() * 0.4),
          blending: layer.blend,
          depthWrite: false,
        });

        const sprite = new THREE.Sprite(mat);
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI * 0.85;
        const dist = 320 + Math.pow(Math.random(), 0.7) * 900;

        sprite.position.set(
          dist * Math.cos(phi) * Math.cos(theta),
          dist * Math.sin(phi) + (Math.random() - 0.5) * 120,
          dist * Math.cos(phi) * Math.sin(theta)
        );

        const s = layer.scaleMin + Math.random() * (layer.scaleMax - layer.scaleMin);
        sprite.scale.set(s, s * (0.75 + Math.random() * 0.5), 1);
        nebulaGroup.add(sprite);

        nebulaSprites.push({
          sprite,
          baseScale: s,
          phase: Math.random() * Math.PI * 2,
        });
      }
    });

    // ========================================================
    // 3. RADIANT CROSS-SPIKE STARS & DEEP STARFIELD
    // ========================================================
    const crossStarGroup = new THREE.Group();
    cosmos.add(crossStarGroup);
    const crossSpikeColors = ['#00e5ff', '#ffffff', '#ffd060', '#99ccff', '#ff88bb'];

    for (let i = 0; i < 35; i++) {
      const color = crossSpikeColors[Math.floor(Math.random() * crossSpikeColors.length)];
      const tex = makeCrossStarTexture(color);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          blending: THREE.AdditiveBlending,
          opacity: 0.88,
          depthWrite: false,
        })
      );
      const dist = 280 + Math.pow(Math.random(), 0.6) * 1100;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.9;
      sprite.position.set(
        dist * Math.cos(phi) * Math.cos(theta),
        dist * Math.sin(phi),
        dist * Math.cos(phi) * Math.sin(theta)
      );
      const baseSize = (i < 6 ? 24 : 12) + Math.random() * 10;
      sprite.scale.set(baseSize, baseSize, 1);
      crossStarGroup.add(sprite);
    }

    // 10,000 background stars
    const STAR_COUNT = 10000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);

    const spectralPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#99d6ff'),
      new THREE.Color('#00f0ff'),
      new THREE.Color('#ffdfa0'),
      new THREE.Color('#ff99ee'),
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const r = 250 + Math.pow(Math.random(), 0.5) * 1800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPos[i3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i3 + 2] = r * Math.cos(phi);

      const sc = spectralPalette[Math.floor(Math.random() * spectralPalette.length)];
      starCol[i3] = sc.r; starCol[i3 + 1] = sc.g; starCol[i3 + 2] = sc.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

    const starPoints = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        size: 2.2,
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

    // Distant spiral galaxy (upper quadrant, matching reference)
    const galaxyGroup = new THREE.Group();
    galaxyGroup.position.set(-650, 320, -780);
    galaxyGroup.rotation.set(0.85, -0.45, 0.6);
    const gCount = 3500;
    const gGeo = new THREE.BufferGeometry();
    const gPos = new Float32Array(gCount * 3);
    const gCol = new Float32Array(gCount * 3);
    const cCore = new THREE.Color('#fff6dd');
    const cArm = new THREE.Color('#66aaff');

    for (let i = 0; i < gCount; i++) {
      const i3 = i * 3;
      const normR = Math.pow(Math.random(), 1.6);
      const r = normR * 42;
      const a = ((i % 2) * Math.PI) + r * 0.08;
      const sp = (Math.random() - 0.5) * (r * 0.22 + 1.2);
      gPos[i3] = Math.cos(a) * r + sp;
      gPos[i3 + 1] = (Math.random() - 0.5) * (4 * (1 - normR) + 0.4);
      gPos[i3 + 2] = Math.sin(a) * r + sp;

      const mixed = cCore.clone().lerp(cArm, normR);
      gCol[i3] = mixed.r; gCol[i3 + 1] = mixed.g; gCol[i3 + 2] = mixed.b;
    }
    gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
    gGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3));
    galaxyGroup.add(new THREE.Points(gGeo, new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      map: makeGlowTexture('#ffffff', 32),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })));
    cosmos.add(galaxyGroup);

    // ========================================================
    // 4. THE CENTRAL SUN (GLB MODEL: sun.glb + LIVE ANIMATIONS)
    // ========================================================
    const sunGroup = new THREE.Group();
    sunGroup.position.set(90, 45, -160);
    cosmos.add(sunGroup);

    // Pulsing Solar Corona Sprites
    const coronaMat = new THREE.SpriteMaterial({
      map: makeGlowTexture('#ff8800', 256),
      color: 0xffcc00,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
    });
    const corona = new THREE.Sprite(coronaMat);
    corona.scale.set(65, 65, 1);
    sunGroup.add(corona);

    const coronaOuter = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeGlowTexture('#ff3300', 256),
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.45,
      })
    );
    coronaOuter.scale.set(110, 110, 1);
    sunGroup.add(coronaOuter);

    // Placeholder mesh while GLB loads
    const sunGeo = new THREE.SphereGeometry(18, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffea77 });
    let sunMesh: THREE.Object3D = new THREE.Mesh(sunGeo, sunMat);
    const sunData = {
      name: 'SOL CENTRAL (3D GLB)',
      telemetry: 'Enana Amarilla (G2V) // Modelo GLB con núcleo de plasma activo',
      color: '#fcee0a',
    };
    (sunMesh as any).planetData = sunData;
    sunGroup.add(sunMesh);

    // Load custom sun.glb
    gltfLoader.load(
      `${import.meta.env.BASE_URL}models/sun.glb`,
      (gltf) => {
        sunGroup.remove(sunMesh);
        const model = gltf.scene;
        // Bounding box of sun.glb is ~20 diameter (radius 10), scale by 1.8 so radius is ~18
        model.scale.set(1.8, 1.8, 1.8);
        model.traverse((child) => {
          if ((child as any).isMesh) {
            (child as any).planetData = sunData;
          }
        });
        sunMesh = model;
        sunGroup.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          animationMixers.push(mixer);
        }
      },
      undefined,
      (err) => console.warn('Loading sun.glb fallback:', err)
    );

    // Sunlight illuminating planets
    const sunLight = new THREE.DirectionalLight(0xfff5ea, 3.8);
    sunLight.position.copy(sunGroup.position);
    scene.add(sunLight);

    // Ambient light from the cosmic nebula
    scene.add(new THREE.AmbientLight(0x284270, 2.8));

    // ========================================================
    // 5. PLANETARY BODIES & GLB EARTH
    // ========================================================
    const interactivePlanets: {
      mesh: THREE.Object3D;
      shield: THREE.Mesh;
      group: THREE.Group | THREE.Mesh;
      rotSpeed: number;
      boost: number;
      data: { name: string; telemetry: string; color: string };
    }[] = [];

    const makeShield = (radius: number, color = 0x00f0ff) => {
      const sGeo = new THREE.SphereGeometry(radius * 1.15, 24, 24);
      const sMat = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Mesh(sGeo, sMat);
    };

    // --- A. EARTH (GLB 3D MODEL: earth.glb + LIVE CLOUD ANIMATION) ---
    const earthGroup = new THREE.Group();
    earthGroup.position.set(-38, -12, -40);
    earthGroup.rotation.z = 0.41;
    cosmos.add(earthGroup);

    const earthShield = makeShield(11.5, 0x00f0ff);
    earthGroup.add(earthShield);

    const earthGeo = new THREE.SphereGeometry(11, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x1b4f8a, roughness: 0.65 });
    let earthMesh: THREE.Object3D = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    const earthEntry = {
      mesh: earthMesh,
      shield: earthShield,
      group: earthGroup,
      rotSpeed: 0.08,
      boost: 0,
      data: {
        name: 'PLANETA TIERRA (GLB 3D)',
        telemetry: 'Biosfera activa // Modelo GLB con manto de nubes animado // Escudo EM preparado',
        color: '#00f0ff',
      },
    };
    (earthMesh as any).planetData = earthEntry.data;
    interactivePlanets.push(earthEntry);

    // Load custom earth.glb
    gltfLoader.load(
      `${import.meta.env.BASE_URL}models/earth.glb`,
      (gltf) => {
        earthGroup.remove(earthMesh);
        const model = gltf.scene;
        // Bounding box of earth.glb is ~20 diameter (radius 10), scale by 1.1 so radius is ~11
        model.scale.set(1.1, 1.1, 1.1);
        model.traverse((child) => {
          if ((child as any).isMesh) {
            (child as any).planetData = earthEntry.data;
          }
        });
        earthMesh = model;
        earthEntry.mesh = model;
        earthGroup.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          animationMixers.push(mixer);
        }
      },
      undefined,
      (err) => console.warn('Loading earth.glb fallback:', err)
    );

    // --- B. MOON (Orbiting Earth) ---
    const moonGeo = new THREE.SphereGeometry(2.8, 24, 24);
    const moonMesh = new THREE.Mesh(moonGeo, new THREE.MeshStandardMaterial({
      map: makeMoonTexture(),
      roughness: 0.9,
    }));
    const moonShield = makeShield(3, 0xbbccff);
    moonMesh.add(moonShield);
    cosmos.add(moonMesh);

    interactivePlanets.push({
      mesh: moonMesh,
      shield: moonShield,
      group: moonMesh,
      rotSpeed: 0.1,
      boost: 0,
      data: {
        name: 'LA LUNA',
        telemetry: 'Satélite natural enlazado a la órbita de Terra',
        color: '#cad7ff',
      },
    });

    // --- C. SATURN ---
    const saturnGroup = new THREE.Group();
    const saturnMesh = new THREE.Mesh(
      new THREE.SphereGeometry(15, 48, 48),
      new THREE.MeshStandardMaterial({ map: makeGasGiantTexture(), roughness: 0.75 })
    );
    saturnGroup.add(saturnMesh);

    const ringGeo = new THREE.RingGeometry(20, 36, 96);
    const rPos = ringGeo.attributes.position;
    const rUV = ringGeo.attributes.uv;
    for (let i = 0; i < rPos.count; i++) {
      const d = Math.sqrt(rPos.getX(i) ** 2 + rPos.getY(i) ** 2);
      rUV.setXY(i, (d - 20) / 16, 0);
    }
    const ringMesh = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        map: makeRingsTexture(),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
      })
    );
    ringMesh.rotation.x = Math.PI / 2.3;
    saturnGroup.add(ringMesh);

    const saturnShield = makeShield(16, 0xfcee0a);
    saturnGroup.add(saturnShield);
    saturnGroup.position.set(50, 18, -90);
    saturnGroup.rotation.z = -0.35;
    cosmos.add(saturnGroup);

    interactivePlanets.push({
      mesh: saturnMesh,
      shield: saturnShield,
      group: saturnGroup,
      rotSpeed: 0.05,
      boost: 0,
      data: {
        name: 'SATURNO (GIGANTE GASEOSO)',
        telemetry: 'Sistema masivo de anillos dobles // Atmósfera de hidrógeno y helio',
        color: '#fcee0a',
      },
    });

    // --- D. MARS ---
    const marsMesh = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 32, 32),
      new THREE.MeshStandardMaterial({ map: makeMarsTexture(), roughness: 0.85 })
    );
    const marsShield = makeShield(7, 0xff003c);
    marsMesh.add(marsShield);
    marsMesh.position.set(-65, 35, -130);
    marsMesh.rotation.z = 0.44;
    cosmos.add(marsMesh);

    interactivePlanets.push({
      mesh: marsMesh,
      shield: marsShield,
      group: marsMesh,
      rotSpeed: 0.07,
      boost: 0,
      data: {
        name: 'MARTE (PLANETA ROJO)',
        telemetry: 'Casquetes polares // Valles secos y minerales de hierro oxidado',
        color: '#ff003c',
      },
    });

    // --- E. NEPTUNE ---
    const neptuneMesh = new THREE.Mesh(
      new THREE.SphereGeometry(9, 32, 32),
      new THREE.MeshStandardMaterial({ map: makeIceGiantTexture(), roughness: 0.55 })
    );
    const neptuneShield = makeShield(9.5, 0x00f0ff);
    neptuneMesh.add(neptuneShield);
    neptuneMesh.position.set(70, -32, -80);
    cosmos.add(neptuneMesh);

    interactivePlanets.push({
      mesh: neptuneMesh,
      shield: neptuneShield,
      group: neptuneMesh,
      rotSpeed: 0.06,
      boost: 0,
      data: {
        name: 'NEPTUNO (GIGANTE DE HIELO)',
        telemetry: 'Vientos supersónicos a 2,100 km/h // Manto de agua, amoníaco y metano',
        color: '#00f0ff',
      },
    });

    // ========================================================
    // 6. METEOR COLLISION RIPPLES & PARTICLES
    // ========================================================
    interface CollisionWave {
      mesh: THREE.Mesh;
      age: number;
      maxAge: number;
    }
    const activeCollisions: CollisionWave[] = [];

    const triggerCosmicCollision = (point: THREE.Vector3) => {
      soundManager.playClick();
      const waveGeo = new THREE.RingGeometry(0.5, 2.5, 32);
      const waveMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const wave = new THREE.Mesh(waveGeo, waveMat);
      wave.position.copy(point);
      wave.lookAt(camera.position);
      cosmos.add(wave);
      activeCollisions.push({ mesh: wave, age: 0, maxAge: 0.85 });
    };

    // ========================================================
    // 7. INTERACTION CONTROLS
    // ========================================================
    const raycaster = new THREE.Raycaster();
    const mouseVec2 = new THREE.Vector2();
    let mouseNX = 0, mouseNY = 0;
    let smoothMX = 0, smoothMY = 0;
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let dragVelX = 0, dragVelY = 0;
    let scrollY = 0;

    const handlePointerAction = (clientX: number, clientY: number) => {
      mouseVec2.set(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouseVec2, camera);

      // Check click on Sun
      const sunHits = raycaster.intersectObject(sunGroup, true);
      if (sunHits.length > 0) {
        showPlanetHUD(sunData.name, sunData.telemetry, sunData.color);
        corona.scale.multiplyScalar(1.3);
        triggerCosmicCollision(sunHits[0].point);
        return;
      }

      // Check click on Planets
      const planetTargets = interactivePlanets.map((p) => p.group);
      const hits = raycaster.intersectObjects(planetTargets, true);

      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const matched = interactivePlanets.find((p) => {
          let cur: THREE.Object3D | null = hitObj;
          while (cur) {
            if (cur === p.group || cur === p.mesh) return true;
            cur = cur.parent;
          }
          return false;
        });

        if (matched) {
          matched.boost = 0.45;
          (matched.shield.material as THREE.MeshBasicMaterial).opacity = 0.95;
          showPlanetHUD(matched.data.name, matched.data.telemetry, matched.data.color);
          triggerCosmicCollision(hits[0].point);
          return;
        }
      }

      // Click on space: cosmic ripple
      const hitWorld = new THREE.Vector3();
      raycaster.ray.at(55, hitWorld);
      triggerCosmicCollision(hitWorld);
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      handlePointerAction(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseNX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        dragVelX += dx * 0.0006;
        dragVelY += dy * 0.0006;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onPointerUp = () => { isDragging = false; };
    const onScroll = () => { scrollY = window.scrollY; };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('scroll', onScroll, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, true);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // ========================================================
    // 8. ANIMATION LOOP
    // ========================================================
    let frameId = 0;
    const t0 = performance.now();
    let lastTime = t0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;
      const t = (now - t0) * 0.001;

      // Update 3D GLB Animation Mixers (Earth clouds & Sun plasma)
      animationMixers.forEach((mixer) => mixer.update(dt));

      // Cosmos auto-rotation & inertia
      cosmos.rotation.y += 0.0008 * dt * 60;
      cosmos.rotation.x += 0.0002 * dt * 60;

      cosmos.rotation.y += dragVelX;
      cosmos.rotation.x += dragVelY;
      dragVelX *= 0.94;
      dragVelY *= 0.94;

      // Mouse Parallax & Scroll camera zoom
      smoothMX += (mouseNX - smoothMX) * 0.04;
      smoothMY += (mouseNY - smoothMY) * 0.04;
      const scrollZ = Math.min(scrollY * 0.015, 25);
      camera.position.x = smoothMX * 14;
      camera.position.y = smoothMY * 9;
      camera.position.z = 110 - scrollZ;
      camera.lookAt(0, 0, 0);

      // Sun pulsing corona
      const sunPulse = 1 + Math.sin(t * 3) * 0.06;
      corona.scale.set(65 * sunPulse, 65 * sunPulse, 1);
      coronaOuter.scale.set(110 * sunPulse, 110 * sunPulse, 1);
      if (sunMesh) sunMesh.rotation.y += dt * 0.08;

      // Earth rotation & Moon orbit
      if (earthMesh) earthMesh.rotation.y += dt * 0.05;

      const moonDist = 20;
      const moonAngle = t * 0.35;
      moonMesh.position.set(
        earthGroup.position.x + Math.cos(moonAngle) * moonDist,
        earthGroup.position.y + Math.sin(moonAngle) * 4,
        earthGroup.position.z + Math.sin(moonAngle) * moonDist
      );
      moonMesh.rotation.y += dt * 0.02;

      // Other planets rotation & shield decay
      interactivePlanets.forEach((p) => {
        p.boost = Math.max(0, p.boost - dt * 0.25);
        p.mesh.rotation.y += (p.rotSpeed + p.boost) * dt * 60 * 0.015;

        const sMat = p.shield.material as THREE.MeshBasicMaterial;
        if (sMat.opacity > 0) {
          sMat.opacity = Math.max(0, sMat.opacity - dt * 1.2);
        }
      });

      // Subtle pulse in cosmic nebula
      nebulaSprites.forEach((item) => {
        const pulse = 1 + Math.sin(t * 0.35 + item.phase) * 0.035;
        item.sprite.scale.set(item.baseScale * pulse, item.baseScale * pulse * 0.85, 1);
      });

      // Collision waves expansion & fade
      for (let i = activeCollisions.length - 1; i >= 0; i--) {
        const c = activeCollisions[i];
        c.age += dt;
        const progress = c.age / c.maxAge;
        const s = 1 + progress * 14;
        c.mesh.scale.set(s, s, 1);
        (c.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - progress) * 0.8;
        if (c.age >= c.maxAge) {
          cosmos.remove(c.mesh);
          c.mesh.geometry.dispose();
          (c.mesh.material as THREE.Material).dispose();
          activeCollisions.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);

      if (container.contains(toast)) container.removeChild(toast);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
