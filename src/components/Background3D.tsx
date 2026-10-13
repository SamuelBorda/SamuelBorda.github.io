import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { soundManager } from '../utils/soundEffects';

/* ================================================================
   BACKGROUND 3D — Living Solar System & Deep Space Universe
   ================================================================
   • Central Sun: glowing core, pulsing solar corona & lens flare
   • Planets: Earth (clouds & atmo), Moon, Saturn (rings), Mars, Neptune
   • Celestial Auroras: shimmering undulating curtains of light
   • Random space events: spacecraft, comets, falling meteors
   • Full mouse & touch interaction:
     - Tap/Click on empty space: Cosmic meteor collision & shockwave
     - Tap/Click on any planet/sun: Electromagnetic shield triggers,
       rotation burst, data pulse & sound
     - Mouse drag: full 3D celestial rotation with inertia physics
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
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300 opacity-0 translate-y-3 font-mono text-xs px-4 py-2 border backdrop-blur-md';
    toast.style.backgroundColor = 'rgba(5, 8, 14, 0.85)';
    toast.style.borderColor = '#00f0ff';
    toast.style.color = '#00f0ff';
    toast.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.25)';
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
      }, 3500);
    };

    // ---- SCENE, CAMERA & RENDERER ----
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010308, 0.001);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      4000
    );
    camera.position.set(0, 0, 110);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x010308, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
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

    // ---- PROCEDURAL TEXTURE GENERATORS ----
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

    // Sun Surface Texture (Solar granulation and solar flares)
    const makeSunTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#ff9900');
      g.addColorStop(0.3, '#ffcc00');
      g.addColorStop(0.5, '#fff1a8');
      g.addColorStop(0.7, '#ffaa00');
      g.addColorStop(1, '#ff6600');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);

      // Granulation spots
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const r = 4 + Math.random() * 18;
        ctx.fillStyle = 'rgba(255, 240, 180, 0.4)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };

    // Earth Texture: Oceans + Continents
    const makeEarthTexture = () => {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 512;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0, '#0a2342');
      g.addColorStop(0.5, '#0d3268');
      g.addColorStop(1, '#081c36');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1024, 512);

      const seedNoise = (cx: number, cy: number, rx: number, ry: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.15) {
          const rVar = 0.7 + Math.sin(a * 5) * 0.2 + Math.cos(a * 3) * 0.15;
          const x = cx + Math.cos(a) * rx * rVar;
          const y = cy + Math.sin(a) * ry * rVar;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      };
      seedNoise(280, 200, 110, 100, '#2d5a27');
      seedNoise(290, 360, 90, 130, '#1f441e');
      seedNoise(620, 190, 180, 90, '#3b6e22');
      seedNoise(650, 340, 110, 120, '#8c7853');
      seedNoise(750, 240, 120, 80, '#2e5318');
      seedNoise(820, 390, 70, 50, '#9c6644');

      ctx.fillStyle = '#f0f8ff';
      ctx.fillRect(0, 0, 1024, 35);
      ctx.fillRect(0, 477, 1024, 35);

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      return tex;
    };

    // Earth Clouds Texture
    const makeEarthCloudsTexture = () => {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 512;
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, 1024, 512);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 40; i++) {
        const cx = Math.random() * 1024;
        const cy = 60 + Math.random() * 380;
        const rx = 40 + Math.random() * 120;
        const ry = 15 + Math.random() * 40;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.3 - 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      return tex;
    };

    // Moon Texture
    const makeMoonTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#8a939e';
      ctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const r = 4 + Math.random() * 20;
        ctx.fillStyle = '#656d78';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };

    // Gas Giant & Saturn Rings
    const makeGasGiantTexture = () => {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 512;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0, '#3a2e1d');
      g.addColorStop(0.2, '#c9a063');
      g.addColorStop(0.4, '#e4c590');
      g.addColorStop(0.6, '#f5deb3');
      g.addColorStop(0.8, '#a07844');
      g.addColorStop(1, '#2c2112');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1024, 512);
      for (let y = 0; y < 512; y += 4) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(y * 0.1) * 0.08 + 0.04})`;
        ctx.fillRect(0, y, 1024, 2);
      }
      return new THREE.CanvasTexture(c);
    };

    const makeRingsTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 1;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 512, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.1, 'rgba(210, 185, 140, 0.4)');
      g.addColorStop(0.3, 'rgba(240, 220, 180, 0.85)');
      g.addColorStop(0.48, 'rgba(10, 8, 5, 0.05)'); // Cassini
      g.addColorStop(0.55, 'rgba(220, 195, 150, 0.7)');
      g.addColorStop(0.85, 'rgba(160, 130, 90, 0.3)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 1);
      return new THREE.CanvasTexture(c);
    };

    // Mars Texture
    const makeMarsTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#5a1e0b');
      g.addColorStop(0.5, '#c1440e');
      g.addColorStop(1, '#421406');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(256, 10, 45, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(c);
    };

    // Neptune / Cyan Ice Giant
    const makeIceGiantTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#001a33');
      g.addColorStop(0.5, '#0077b6');
      g.addColorStop(1, '#001a33');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);
      return new THREE.CanvasTexture(c);
    };

    // ---- COSMOS GROUP ----
    const cosmos = new THREE.Group();
    scene.add(cosmos);

    // ========================================================
    // 1. STARFIELD (9,000 spectral stars)
    // ========================================================
    const STAR_COUNT = 9000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starBase = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const starPhase = new Float32Array(STAR_COUNT);

    const spectralColors = [
      new THREE.Color('#9bb0ff'), // Blue
      new THREE.Color('#cad7ff'), // White
      new THREE.Color('#fff4e8'), // Yellow
      new THREE.Color('#ffd2a1'), // Orange
      new THREE.Color('#00f0ff'), // Cyber Cyan
      new THREE.Color('#fcee0a'), // Cyber Yellow
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const rad = 50 + Math.pow(Math.random(), 0.6) * 480;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = rad * Math.sin(phi) * Math.cos(theta);
      const y = rad * Math.sin(phi) * Math.sin(theta);
      const z = rad * Math.cos(phi);

      starPos[i3] = x; starPos[i3 + 1] = y; starPos[i3 + 2] = z;
      starBase[i3] = x; starBase[i3 + 1] = y; starBase[i3 + 2] = z;
      starPhase[i] = Math.random() * Math.PI * 2;

      const sc = spectralColors[Math.floor(Math.random() * spectralColors.length)];
      starCol[i3] = sc.r; starCol[i3 + 1] = sc.g; starCol[i3 + 2] = sc.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      sizeAttenuation: true,
      vertexColors: true,
      map: makeGlowTexture('#ffffff', 64),
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    cosmos.add(starPoints);

    // ========================================================
    // 2. COSMIC AURORA BOREALIS (Curtains of Light)
    // ========================================================
    const auroraGroup = new THREE.Group();
    const AURORA_BANDS = 3;
    const auroraPlanes: { mesh: THREE.Mesh; seed: number; speed: number }[] = [];

    const auroraColors = [
      new THREE.Color('#00ff88'), // Emerald Aurora
      new THREE.Color('#00f0ff'), // Electric Cyan
      new THREE.Color('#8a2be2'), // Violet
    ];

    for (let b = 0; b < AURORA_BANDS; b++) {
      const planeGeo = new THREE.PlaneGeometry(160, 24, 48, 8);
      const planeMat = new THREE.MeshBasicMaterial({
        color: auroraColors[b],
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.position.set(-20 + b * 20, 45 + b * 8, -120 - b * 20);
      mesh.rotation.x = 0.35;
      mesh.rotation.z = -0.15;
      auroraGroup.add(mesh);
      auroraPlanes.push({ mesh, seed: b * 1.5, speed: 0.6 + b * 0.3 });
    }
    cosmos.add(auroraGroup);

    // ========================================================
    // 3. THE CENTRAL SUN (Glowing Star + Corona + Flares)
    // ========================================================
    const sunGroup = new THREE.Group();
    const sunGeo = new THREE.SphereGeometry(18, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({
      map: makeSunTexture(),
      color: 0xffea77,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    (sunMesh as any).planetData = {
      name: 'SOL CENTRAL',
      telemetry: 'Enana Amarilla (G2V) // 5,778 K // Corona activa',
      color: '#fcee0a',
    };
    sunGroup.add(sunMesh);

    // Solar Corona Sprite
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

    // Secondary Outer Glow
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

    sunGroup.position.set(90, 45, -160);
    cosmos.add(sunGroup);

    // Sunlight illuminating the solar system
    const sunLight = new THREE.DirectionalLight(0xfff4e6, 3.5);
    sunLight.position.copy(sunGroup.position);
    scene.add(sunLight);

    // ========================================================
    // 4. PLANETARY BODIES & INTERACTIVE SHIELDS
    // ========================================================
    const interactivePlanets: {
      mesh: THREE.Mesh;
      shield: THREE.Mesh;
      group: THREE.Group | THREE.Mesh;
      rotSpeed: number;
      boost: number;
      data: { name: string; telemetry: string; color: string };
    }[] = [];

    // Helper to create an electromagnetic shield wireframe
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

    // --- A. EARTH ---
    const earthGroup = new THREE.Group();
    const earthGeo = new THREE.SphereGeometry(11, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      map: makeEarthTexture(),
      roughness: 0.65,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    const earthClouds = new THREE.Mesh(
      new THREE.SphereGeometry(11.25, 40, 40),
      new THREE.MeshStandardMaterial({
        map: makeEarthCloudsTexture(),
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    earthGroup.add(earthClouds);

    const earthShield = makeShield(11.5, 0x00f0ff);
    earthGroup.add(earthShield);

    earthGroup.position.set(-38, -12, -40);
    earthGroup.rotation.z = 0.41;
    cosmos.add(earthGroup);

    interactivePlanets.push({
      mesh: earthMesh,
      shield: earthShield,
      group: earthGroup,
      rotSpeed: 0.08,
      boost: 0,
      data: {
        name: 'PLANETA TIERRA (TERRA)',
        telemetry: 'Biosfera activa // Nubes y atmósfera en rotación // Escudo EM preparado',
        color: '#00f0ff',
      },
    });

    // --- B. MOON (Orbiting Earth) ---
    const moonGeo = new THREE.SphereGeometry(2.8, 24, 24);
    const moonMesh = new THREE.Mesh(
      moonGeo,
      new THREE.MeshStandardMaterial({
        map: makeMoonTexture(),
        roughness: 0.9,
      })
    );
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
        telemetry: 'Satelite natural // Mareas gravitacionales enlazadas a Terra',
        color: '#cad7ff',
      },
    });

    // --- C. SATURN ---
    const saturnGroup = new THREE.Group();
    const saturnMesh = new THREE.Mesh(
      new THREE.SphereGeometry(15, 48, 48),
      new THREE.MeshStandardMaterial({
        map: makeGasGiantTexture(),
        roughness: 0.75,
      })
    );
    saturnGroup.add(saturnMesh);

    // Rings
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
        telemetry: 'Sistema de anillos dobles // Atmósfera de hidrógeno y helio',
        color: '#fcee0a',
      },
    });

    // --- D. MARS ---
    const marsMesh = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 32, 32),
      new THREE.MeshStandardMaterial({
        map: makeMarsTexture(),
        roughness: 0.85,
      })
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
        telemetry: 'Casquetes polares // Valles secos y minerales de hierro',
        color: '#ff003c',
      },
    });

    // --- E. NEPTUNE ---
    const neptuneMesh = new THREE.Mesh(
      new THREE.SphereGeometry(9, 32, 32),
      new THREE.MeshStandardMaterial({
        map: makeIceGiantTexture(),
        roughness: 0.55,
      })
    );
    const neptuneShield = makeShield(9.5, 0x00f0ff);
    neptuneMesh.add(neptuneShield);
    neptuneMesh.position.set(75, -30, -170);
    cosmos.add(neptuneMesh);

    interactivePlanets.push({
      mesh: neptuneMesh,
      shield: neptuneShield,
      group: neptuneMesh,
      rotSpeed: 0.06,
      boost: 0,
      data: {
        name: 'NEPTUNO (GIGANTE DE HIELO)',
        telemetry: 'Vientos supersónicos // Metano atmosférico azul profundo',
        color: '#00f0ff',
      },
    });

    // Ambient Space Light
    scene.add(new THREE.AmbientLight(0x182238, 1.4));

    // ========================================================
    // 5. RANDOM SPACE EVENTS (Naves, Meteoros, Cometas)
    // ========================================================
    interface SpaceEvent {
      mesh: THREE.Object3D;
      life: number;
      maxLife: number;
      update: (t: number, dt: number) => void;
      done: () => boolean;
    }
    const activeEvents: SpaceEvent[] = [];
    const MAX_EVENTS = 2;
    let nextEventTimer = 2.5 + Math.random() * 4;

    // Fast Meteor
    const spawnMeteor = (): SpaceEvent => {
      const group = new THREE.Group();
      const head = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeGlowTexture('#ffaa22', 64),
          transparent: true,
          blending: THREE.AdditiveBlending,
        })
      );
      head.scale.set(4.5, 4.5, 1);
      group.add(head);

      const TRAIL_LEN = 25;
      const tGeo = new THREE.BufferGeometry();
      const tPos = new Float32Array(TRAIL_LEN * 3);
      tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
      const trail = new THREE.Points(
        tGeo,
        new THREE.PointsMaterial({
          size: 2.2,
          map: makeGlowTexture('#ff4400', 64),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      group.add(trail);

      const side = Math.random() > 0.5 ? 1 : -1;
      group.position.set(side * 130, 45 + Math.random() * 40, -30);
      const vel = new THREE.Vector3(-side * 4, -2, 0);
      cosmos.add(group);

      return {
        mesh: group,
        life: 0,
        maxLife: 3.2,
        update: (_t, dt) => {
          group.position.add(vel.clone().multiplyScalar(dt * 30));
          const arr = tGeo.attributes.position.array as Float32Array;
          for (let i = TRAIL_LEN - 1; i > 0; i--) {
            arr[i * 3] = arr[(i - 1) * 3];
            arr[i * 3 + 1] = arr[(i - 1) * 3 + 1];
            arr[i * 3 + 2] = arr[(i - 1) * 3 + 2];
          }
          arr[0] = 0; arr[1] = 0; arr[2] = 0;
          tGeo.attributes.position.needsUpdate = true;
        },
        done: function () { return this.life >= this.maxLife; },
      };
    };

    // Exploration Spacecraft with cyan ion engine
    const spawnShip = (): SpaceEvent => {
      const group = new THREE.Group();
      const hull = new THREE.Mesh(
        new THREE.ConeGeometry(0.8, 3.5, 4),
        new THREE.MeshBasicMaterial({ color: 0x445566 })
      );
      hull.rotation.z = Math.PI / 2;
      group.add(hull);

      const engine = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeGlowTexture('#00f0ff', 64),
          transparent: true,
          blending: THREE.AdditiveBlending,
        })
      );
      engine.scale.set(5.5, 2.5, 1);
      engine.position.set(-2.2, 0, 0);
      group.add(engine);

      const side = Math.random() > 0.5 ? 1 : -1;
      group.position.set(side * 140, (Math.random() - 0.5) * 60, 20);
      const vel = new THREE.Vector3(-side * 2.2, (Math.random() - 0.5) * 0.3, 0);
      cosmos.add(group);

      return {
        mesh: group,
        life: 0,
        maxLife: 6.5,
        update: (_t, dt) => {
          group.position.add(vel.clone().multiplyScalar(dt * 25));
          engine.material.opacity = 0.6 + Math.sin(performance.now() * 0.02) * 0.35;
        },
        done: function () { return this.life >= this.maxLife; },
      };
    };

    const eventSpawners = [spawnMeteor, spawnMeteor, spawnShip];

    // ========================================================
    // 6. CLICK/TAP IMPACT & EXPLOSION COLLISION SYSTEM
    // ========================================================
    interface CollisionFx {
      group: THREE.Group;
      ring: THREE.Mesh;
      flash: THREE.Sprite;
      sparks: THREE.Points;
      vels: Float32Array;
      life: number;
      maxLife: number;
    }
    const activeCollisions: CollisionFx[] = [];

    const triggerCosmicCollision = (worldPoint: THREE.Vector3) => {
      const group = new THREE.Group();
      group.position.copy(worldPoint);

      // Flash
      const flash = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeGlowTexture('#fcee0a', 128),
          transparent: true,
          blending: THREE.AdditiveBlending,
        })
      );
      flash.scale.set(8, 8, 1);
      group.add(flash);

      // Expanding Shockwave Ring
      const rGeo = new THREE.RingGeometry(0.5, 1.2, 32);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.lookAt(camera.position);
      group.add(ring);

      // Fragment sparks
      const SPARK_COUNT = 60;
      const sGeo = new THREE.BufferGeometry();
      const sPos = new Float32Array(SPARK_COUNT * 3);
      const vels = new Float32Array(SPARK_COUNT * 3);

      for (let i = 0; i < SPARK_COUNT; i++) {
        sPos[i * 3] = 0; sPos[i * 3 + 1] = 0; sPos[i * 3 + 2] = 0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const speed = 0.8 + Math.random() * 2.2;
        vels[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        vels[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        vels[i * 3 + 2] = Math.cos(phi) * speed;
      }
      sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));

      const sparks = new THREE.Points(
        sGeo,
        new THREE.PointsMaterial({
          size: 3.5,
          map: makeGlowTexture('#ffaa00', 64),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      group.add(sparks);

      scene.add(group);
      soundManager.playWarp();

      activeCollisions.push({
        group,
        ring,
        flash,
        sparks,
        vels,
        life: 0,
        maxLife: 1.6,
      });
    };

    // ========================================================
    // 7. INTERACTION LISTENERS (Raycasting for Planets & Collisions)
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

      // Check for click on Sun first
      const sunHits = raycaster.intersectObject(sunMesh);
      if (sunHits.length > 0) {
        showPlanetHUD(
          (sunMesh as any).planetData.name,
          (sunMesh as any).planetData.telemetry,
          (sunMesh as any).planetData.color
        );
        corona.scale.multiplyScalar(1.3);
        triggerCosmicCollision(sunHits[0].point);
        return;
      }

      // Check for click on Planets
      const planetMeshes = interactivePlanets.map((p) => p.mesh);
      const hits = raycaster.intersectObjects(planetMeshes);

      if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh;
        const matched = interactivePlanets.find((p) => p.mesh === hitMesh);
        if (matched) {
          matched.boost = 0.45; // boost rotation speed
          (matched.shield.material as THREE.MeshBasicMaterial).opacity = 0.95; // flash shield
          showPlanetHUD(matched.data.name, matched.data.telemetry, matched.data.color);
          triggerCosmicCollision(hits[0].point);
          return;
        }
      }

      // Click on empty space: trigger cosmic meteor impact
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

    const onPointerUp = () => {
      isDragging = false;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Zoom-proof Resizer
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
    const ro = new ResizeObserver(handleResize);
    ro.observe(document.documentElement);

    // ========================================================
    // 8. ANIMATION LOOP (60 FPS)
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
      sunMesh.rotation.y = t * 0.03;

      // Earth & Cloud layer rotations
      earthMesh.rotation.y += (0.08 + interactivePlanets[0].boost) * dt * 30;
      earthClouds.rotation.y += 0.12 * dt * 30;
      saturnMesh.rotation.y += (0.05 + interactivePlanets[2].boost) * dt * 30;
      marsMesh.rotation.y += (0.07 + interactivePlanets[3].boost) * dt * 30;
      neptuneMesh.rotation.y += (0.06 + interactivePlanets[4].boost) * dt * 30;

      // Decay planet rotation boosts and shields
      interactivePlanets.forEach((p) => {
        if (p.boost > 0) p.boost = Math.max(0, p.boost - dt * 0.2);
        const mat = p.shield.material as THREE.MeshBasicMaterial;
        if (mat.opacity > 0.01) {
          mat.opacity -= dt * 0.6;
          p.shield.rotation.y += dt * 2;
        }
      });

      // Moon Orbiting Earth
      const moonOrbitRadius = 24;
      moonMesh.position.set(
        earthGroup.position.x + Math.cos(t * 0.4) * moonOrbitRadius,
        earthGroup.position.y + Math.sin(t * 0.4) * 4,
        earthGroup.position.z + Math.sin(t * 0.4) * moonOrbitRadius
      );
      moonMesh.rotation.y = t * 0.1;

      // Shimmering Aurora Borealis Waves
      auroraPlanes.forEach((ap) => {
        const pos = ap.mesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const wave = Math.sin(t * ap.speed + x * 0.08 + ap.seed) * 2.5;
          pos.setZ(i, wave);
        }
        pos.needsUpdate = true;
      });

      // Twinkling Starfield
      const sArr = starGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < STAR_COUNT; i++) {
        const i3 = i * 3;
        const twinkle = Math.sin(t * (1.3 + (i % 9) * 0.18) + starPhase[i]);
        sArr[i3 + 1] = starBase[i3 + 1] + twinkle * 0.12;
      }
      starGeo.attributes.position.needsUpdate = true;

      // Random space events
      nextEventTimer -= dt;
      if (nextEventTimer <= 0 && activeEvents.length < MAX_EVENTS) {
        const spawner = eventSpawners[Math.floor(Math.random() * eventSpawners.length)];
        activeEvents.push(spawner());
        nextEventTimer = 5 + Math.random() * 9;
      }

      for (let i = activeEvents.length - 1; i >= 0; i--) {
        const ev = activeEvents[i];
        ev.life += dt;
        ev.update(t, dt);
        if (ev.done()) {
          cosmos.remove(ev.mesh);
          ev.mesh.traverse((child) => {
            if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
          });
          activeEvents.splice(i, 1);
        }
      }

      // Active Collisions / Impacts Update
      for (let i = activeCollisions.length - 1; i >= 0; i--) {
        const col = activeCollisions[i];
        col.life += dt;
        const progress = col.life / col.maxLife;

        // Flash fades quickly
        col.flash.material.opacity = Math.max(0, 1 - progress * 2.5);

        // Ring expands and fades
        const ringScale = 1 + progress * 22;
        col.ring.scale.set(ringScale, ringScale, 1);
        (col.ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.9 * (1 - progress));

        // Fragment sparks fly out
        const pArr = col.sparks.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j < col.vels.length / 3; j++) {
          pArr[j * 3] += col.vels[j * 3] * dt * 25;
          pArr[j * 3 + 1] += col.vels[j * 3 + 1] * dt * 25;
          pArr[j * 3 + 2] += col.vels[j * 3 + 2] * dt * 25;
        }
        col.sparks.geometry.attributes.position.needsUpdate = true;
        (col.sparks.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - progress);

        if (progress >= 1) {
          scene.remove(col.group);
          col.group.traverse((c) => {
            if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose();
          });
          activeCollisions.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // ---- CLEANUP ----
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      ro.disconnect();

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
