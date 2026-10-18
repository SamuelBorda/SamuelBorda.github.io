import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { soundManager } from '../utils/soundEffects';

/* ================================================================
   BACKGROUND 3D — Real 3D Space Cosmos with Bloom & Dynamic Shadows
   ================================================================
   • 360° Skybox 4K Sphere: 4096x2048 HDRI Galaxy Panorama
   • Initial Viewpoint: Exact cinematic perspective (Earth on left, Sun on right)
   • Central Sun: photorealistic animated GLB with slow rotation + Bloom
   • Earth: animated rotating planet with dynamic clouds (GLB) + EM shield
   • Moon: real 3D GLB model orbiting closely with beautiful flyby effect
   • Satellite: real 3D GLB model in low Earth orbit (LEO) with deployed panels
   • Saturn, Mars, Neptune: planets with PBR materials and ring shadows
   • 3D Space Navigation:
     - Drag with mouse / touch: 360° orbital rotation with inertia
     - Wheel: cosmic zoom in / out
     - Single Click/Tap: Tactical scanner HUD + collision shockwave
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
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300 opacity-0 translate-y-3 font-mono text-xs px-4 py-2 border backdrop-blur-md rounded';
    toast.style.backgroundColor = 'rgba(5, 8, 14, 0.92)';
    toast.style.borderColor = '#00f0ff';
    toast.style.color = '#00f0ff';
    toast.style.boxShadow = '0 0 24px rgba(0, 240, 255, 0.35)';
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

    // Flag para herramientas de calibración de cámara (desactivado por defecto)
    const DEBUG_CAMERA = false;

    let camButton: HTMLButtonElement | null = null;
    if (DEBUG_CAMERA) {
      camButton = document.createElement('button');
      camButton.type = 'button';
      camButton.className =
        'fixed bottom-6 left-6 z-50 pointer-events-auto font-mono text-xs px-3 py-1.5 border border-[#00f0ff]/50 bg-[#05080e]/90 text-[#00f0ff] hover:bg-[#00f0ff]/20 hover:border-[#00f0ff] transition-all backdrop-blur-md rounded shadow-[0_0_15px_rgba(0,240,255,0.25)] cursor-pointer flex items-center gap-1.5';
      camButton.innerHTML = '<span>📷</span> <span>COPIAR CÁMARA</span>';
      container.appendChild(camButton);
    }

    // ---- SCENE, CAMERA & RENDERER ----
    const scene = new THREE.Scene();
    // Espacio transparente y negro cósmico (sin niebla)
    scene.fog = null;

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      6000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x020307, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
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

    // ---- CINEMATIC POST-PROCESSING BLOOM ----
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.55,
      0.4,
      0.82
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    const BASE_FOV = 52;
    const BASE_ASPECT = 16 / 9;
    const BASE_STAR_SIZE = 1.35;
    let starMat: THREE.PointsMaterial | null = null;

    const updateCameraProjection = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const aspect = w / h;
      camera.aspect = aspect;

      // Mantener la relación horizontal (ancho) igual que en PC para ver toda la escena en móviles
      if (aspect < BASE_ASPECT) {
        const baseFovRad = THREE.MathUtils.degToRad(BASE_FOV);
        const tanHalfHFov = Math.tan(baseFovRad / 2) * BASE_ASPECT;
        const vFovRad = 2 * Math.atan(tanHalfHFov / aspect);
        camera.fov = THREE.MathUtils.radToDeg(vFovRad);
      } else {
        camera.fov = BASE_FOV;
      }

      camera.updateProjectionMatrix();

      // Ajuste responsive para las estrellas generadas: en móvil se escalan proporcionalmente
      // al campo visual para evitar que se vean como esferas gigantes
      if (starMat) {
        const baseFovRad = THREE.MathUtils.degToRad(BASE_FOV);
        const curFovRad = THREE.MathUtils.degToRad(camera.fov);
        const fovFactor = Math.tan(baseFovRad / 2) / Math.tan(curFovRad / 2);
        const mobileScale = aspect < 1.0 ? Math.max(0.35, aspect / BASE_ASPECT) : 1.0;
        starMat.size = BASE_STAR_SIZE * fovFactor * mobileScale;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, true);
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
    };

    updateCameraProjection();

    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    const mixers: THREE.AnimationMixer[] = [];

    // Normalizador de tamaño de modelos GLB
    const normalizeModelSize = (object: THREE.Object3D, targetDiameter: number) => {
      object.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const factor = targetDiameter / maxDim;
        object.scale.setScalar(factor);
      }
    };

    // ---- TEXTURA PROCEDURAL PARA GLOW Y PARTICULAS ----
    const makeGlowTexture = (color: string, size = 128) => {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
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

    // Gas Giant & Saturn Rings
    const makeGasGiantTexture = () => {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 512;
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
      c.width = 512;
      c.height = 1;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 512, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.1, 'rgba(210, 185, 140, 0.4)');
      g.addColorStop(0.3, 'rgba(240, 220, 180, 0.85)');
      g.addColorStop(0.48, 'rgba(10, 8, 5, 0.05)');
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
      c.width = 512;
      c.height = 256;
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

    // Neptune Texture
    const makeIceGiantTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#001a33');
      g.addColorStop(0.5, '#0077b6');
      g.addColorStop(1, '#001a33');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);
      return new THREE.CanvasTexture(c);
    };

    // ========================================================
    // 1. COSMIC PANORAMA SKYBOX SPHERE (4K HDRI 360°)
    // ========================================================
    const skyTexture = textureLoader.load('/textures/galaxy_panorama.jpg');
    skyTexture.colorSpace = THREE.SRGBColorSpace;
    skyTexture.minFilter = THREE.LinearFilter;
    skyTexture.magFilter = THREE.LinearFilter;

    const skyGeo = new THREE.SphereGeometry(2800, 64, 32);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // ---- COSMOS GROUP (Contenedor de planetas y órbitas) ----
    const cosmos = new THREE.Group();
    scene.add(cosmos);

    // ========================================================
    // 2. EXTRA SPECTRAL STAR DUST (Puntos con paralaje 3D)
    // ========================================================
    const STAR_COUNT = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starBase = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const starPhase = new Float32Array(STAR_COUNT);

    const spectralColors = [
      new THREE.Color('#9bb0ff'),
      new THREE.Color('#cad7ff'),
      new THREE.Color('#fff4e8'),
      new THREE.Color('#ffd2a1'),
      new THREE.Color('#00f0ff'),
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      // Radio amplio fuera de la órbita de planetas y cámara para evitar estrellas gigantes en primer plano
      const rad = 240 + Math.pow(Math.random(), 0.65) * 850;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = rad * Math.sin(phi) * Math.cos(theta);
      const y = rad * Math.sin(phi) * Math.sin(theta);
      const z = rad * Math.cos(phi);

      starPos[i3] = x;
      starPos[i3 + 1] = y;
      starPos[i3 + 2] = z;
      starBase[i3] = x;
      starBase[i3 + 1] = y;
      starBase[i3 + 2] = z;
      starPhase[i] = Math.random() * Math.PI * 2;

      const sc = spectralColors[Math.floor(Math.random() * spectralColors.length)];
      starCol[i3] = sc.r;
      starCol[i3 + 1] = sc.g;
      starCol[i3 + 2] = sc.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

    starMat = new THREE.PointsMaterial({
      size: BASE_STAR_SIZE,
      sizeAttenuation: true,
      vertexColors: true,
      map: makeGlowTexture('#ffffff', 64),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    cosmos.add(starPoints);

    // Sincronizar tamaño responsive inmediatamente
    updateCameraProjection();

    // ========================================================
    // 3. THE CENTRAL SUN (sun.glb con rotación suave)
    // ========================================================
    const sunGroup = new THREE.Group();
    let sunModel: THREE.Object3D | null = null;
    const sunInteractiveMeshes: THREE.Mesh[] = [];

    // Corona Sprite
    const coronaMat = new THREE.SpriteMaterial({
      map: makeGlowTexture('#ff9900', 256),
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
        map: makeGlowTexture('#ff4400', 256),
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.4,
      })
    );
    coronaOuter.scale.set(110, 110, 1);
    sunGroup.add(coronaOuter);

    sunGroup.position.set(90, 45, -80);
    cosmos.add(sunGroup);

    // Luz del sol puntual
    const sunPointLight = new THREE.PointLight(0xfff5dd, 4.0, 1500, 0.3);
    sunPointLight.position.copy(sunGroup.position);
    scene.add(sunPointLight);

    // Luz solar direccional proyectando sombras hacia la Tierra y planetas
    const sunDirectional = new THREE.DirectionalLight(0xffeedd, 3.2);
    sunDirectional.position.copy(sunGroup.position);
    sunDirectional.target.position.set(-38, -12, -40);
    sunDirectional.castShadow = true;
    sunDirectional.shadow.mapSize.width = 2048;
    sunDirectional.shadow.mapSize.height = 2048;
    sunDirectional.shadow.camera.near = 20;
    sunDirectional.shadow.camera.far = 700;
    sunDirectional.shadow.camera.left = -160;
    sunDirectional.shadow.camera.right = 160;
    sunDirectional.shadow.camera.top = 160;
    sunDirectional.shadow.camera.bottom = -160;
    sunDirectional.shadow.bias = -0.0006;
    scene.add(sunDirectional);
    scene.add(sunDirectional.target);

    // Carga de sun.glb
    gltfLoader.load(
      '/models/sun.glb',
      (gltf) => {
        sunModel = gltf.scene;
        normalizeModelSize(sunModel, 36);

        sunModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            (m as any).planetData = {
              name: 'SOL CENTRAL',
              telemetry: 'Enana Amarilla (G2V) // 5,778 K // Fusión Termonuclear Activa',
              color: '#fcee0a',
            };
            sunInteractiveMeshes.push(m);
          }
        });
        sunGroup.add(sunModel);

        if (gltf.animations && gltf.animations.length > 0) {
          const sunMixer = new THREE.AnimationMixer(sunModel);
          gltf.animations.forEach((clip) => {
            const action = sunMixer.clipAction(clip);
            action.timeScale = 0.05; // 20 veces más lento para rotación solar majestuosa
            action.play();
          });
          mixers.push(sunMixer);
        }
      },
      undefined,
      (err) => console.warn('Could not load sun GLB:', err)
    );

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

    // --- A. EARTH (earth.glb + Nubes animadas) ---
    const earthGroup = new THREE.Group();
    let earthModel: THREE.Object3D | null = null;
    const earthInteractiveMeshes: THREE.Mesh[] = [];

    const earthShield = makeShield(11.5, 0x00f0ff);
    earthGroup.add(earthShield);

    earthGroup.position.set(-38, -12, -40);
    earthGroup.rotation.z = 0.41;
    cosmos.add(earthGroup);

    gltfLoader.load(
      '/models/earth.glb',
      (gltf) => {
        earthModel = gltf.scene;
        normalizeModelSize(earthModel, 22);

        earthModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.castShadow = true;
            m.receiveShadow = true;

            if (m.material) {
              const mats = Array.isArray(m.material) ? m.material : [m.material];
              mats.forEach((mat) => {
                mat.needsUpdate = true;
                if (
                  m.name.toLowerCase().includes('cloud') ||
                  (mat.name && mat.name.toLowerCase().includes('cloud'))
                ) {
                  mat.transparent = true;
                  mat.opacity = 0.85;
                  mat.depthWrite = false;
                }
              });
            }
            earthInteractiveMeshes.push(m);
          }
        });
        earthGroup.add(earthModel);

        if (gltf.animations && gltf.animations.length > 0) {
          const earthMixer = new THREE.AnimationMixer(earthModel);
          gltf.animations.forEach((clip) => {
            earthMixer.clipAction(clip).play();
          });
          mixers.push(earthMixer);
        }
      },
      undefined,
      (err) => console.warn('Could not load earth GLB:', err)
    );

    // --- B. MOON (moon.glb: Escala compacta y órbita cercana para hermoso efecto flyby) ---
    const moonGroup = new THREE.Group();
    let moonModel: THREE.Object3D | null = null;
    const moonInteractiveMeshes: THREE.Mesh[] = [];
    const moonShield = makeShield(1.8, 0xcad7ff);
    moonGroup.add(moonShield);
    cosmos.add(moonGroup);

    gltfLoader.load(
      '/models/moon.glb',
      (gltf) => {
        moonModel = gltf.scene;
        // Escala más compacta y delicada (diámetro 2.9)
        normalizeModelSize(moonModel, 2.9);

        moonModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.castShadow = true;
            m.receiveShadow = true;
            moonInteractiveMeshes.push(m);
          }
        });
        moonGroup.add(moonModel);
      },
      undefined,
      (err) => console.warn('Could not load moon GLB:', err)
    );

    // --- C. SATELLITE (satelite.glb en órbita baja LEO) ---
    const sateliteGroup = new THREE.Group();
    let sateliteModel: THREE.Object3D | null = null;
    const sateliteInteractiveMeshes: THREE.Mesh[] = [];
    const satShield = makeShield(1.4, 0x00f0ff);
    sateliteGroup.add(satShield);
    cosmos.add(sateliteGroup);

    gltfLoader.load(
      '/models/satelite.glb',
      (gltf) => {
        sateliteModel = gltf.scene;
        normalizeModelSize(sateliteModel, 1.6);

        sateliteModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.castShadow = true;
            m.receiveShadow = true;
            sateliteInteractiveMeshes.push(m);
          }
        });
        sateliteGroup.add(sateliteModel);
      },
      undefined,
      (err) => console.warn('Could not load satelite GLB:', err)
    );

    // --- D. SATURN (Reubicado lejos de la línea visual del Sol para no estorbar) ---
    const saturnGroup = new THREE.Group();
    const saturnMesh = new THREE.Mesh(
      new THREE.SphereGeometry(15, 48, 48),
      new THREE.MeshStandardMaterial({
        map: makeGasGiantTexture(),
        roughness: 0.75,
      })
    );
    saturnMesh.castShadow = true;
    saturnMesh.receiveShadow = true;
    saturnGroup.add(saturnMesh);

    // Anillos de Saturno
    const ringGeo = new THREE.RingGeometry(20, 36, 96);
    const rPos = ringGeo.attributes.position;
    const rUV = ringGeo.attributes.uv;
    for (let i = 0; i < rPos.count; i++) {
      const d = Math.sqrt(rPos.getX(i) ** 2 + rPos.getY(i) ** 2);
      rUV.setXY(i, (d - 20) / 16, 0);
    }
    const ringMesh = new THREE.Mesh(
      ringGeo,
      new THREE.MeshStandardMaterial({
        map: makeRingsTexture(),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        roughness: 0.8,
      })
    );
    ringMesh.receiveShadow = true;
    ringMesh.rotation.x = Math.PI / 2.3;
    saturnGroup.add(ringMesh);

    const saturnShield = makeShield(16, 0xfcee0a);
    saturnGroup.add(saturnShield);

    // Posicionado lateralmente a (140, -25, -60) para no obstaculizar la vista entre la Tierra y el Sol
    saturnGroup.position.set(140, -25, -60);
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

    // --- E. MARS ---
    const marsMesh = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 32, 32),
      new THREE.MeshStandardMaterial({
        map: makeMarsTexture(),
        roughness: 0.85,
      })
    );
    marsMesh.castShadow = true;
    marsMesh.receiveShadow = true;

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

    // --- F. NEPTUNE ---
    const neptuneMesh = new THREE.Mesh(
      new THREE.SphereGeometry(9, 32, 32),
      new THREE.MeshStandardMaterial({
        map: makeIceGiantTexture(),
        roughness: 0.55,
      })
    );
    neptuneMesh.castShadow = true;
    neptuneMesh.receiveShadow = true;

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

    // Luz ambiental neutra espacial
    scene.add(new THREE.AmbientLight(0x1a202c, 1.4));

    // ========================================================
    // 5. RANDOM SPACE EVENTS (Naves, Meteoros)
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
          arr[0] = 0;
          arr[1] = 0;
          arr[2] = 0;
          tGeo.attributes.position.needsUpdate = true;
        },
        done: function () {
          return this.life >= this.maxLife;
        },
      };
    };

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
        done: function () {
          return this.life >= this.maxLife;
        },
      };
    };

    const eventSpawners = [spawnMeteor, spawnMeteor, spawnShip];

    // ========================================================
    // 6. TACTICAL HUD & INTERACTION
    // ========================================================

    // ========================================================
    // 7. CINEMATIC CAMERA SETUP (PERSPECTIVA EXACTA DE LA CAPTURA)
    // ========================================================
    // Encuadre idéntico a la captura: Tierra en primer plano a la izquierda, Sol en el horizonte derecho

const baseCamPos = new THREE.Vector3(-35.1, -13.7, -22.9);
const baseTarget = new THREE.Vector3(55.8, 27.5, -139.0);
    let orbitYaw = 0;
    let orbitPitch = 0;
    let dragVelYaw = 0;
    let dragVelPitch = 0;

    let zoomScale = 1.0;
    let targetZoomScale = 1.0;

    const raycaster = new THREE.Raycaster();
    const mouseVec2 = new THREE.Vector2();
    let mouseNX = 0,
      mouseNY = 0;
    let smoothMX = 0,
      smoothMY = 0;

    let isDragging = false;
    let hasDragged = false;
    let startX = 0,
      startY = 0;
    let prevX = 0,
      prevY = 0;
    let scrollY = 0;

    const handlePointerAction = (clientX: number, clientY: number) => {
      mouseVec2.set(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouseVec2, camera);

      // Click en el Sol
      if (sunInteractiveMeshes.length > 0) {
        const sunHits = raycaster.intersectObjects(sunInteractiveMeshes, true);
        if (sunHits.length > 0) {
          showPlanetHUD(
            'SOL CENTRAL',
            'Enana Amarilla (G2V) // 5,778 K // Fusión Termonuclear Activa',
            '#fcee0a'
          );
          return;
        }
      }

      // Click en la Tierra
      if (earthInteractiveMeshes.length > 0) {
        const earthHits = raycaster.intersectObjects(earthInteractiveMeshes, true);
        if (earthHits.length > 0) {
          (earthShield.material as THREE.MeshBasicMaterial).opacity = 0.95;
          showPlanetHUD(
            'PLANETA TIERRA (TERRA)',
            'Biosfera activa // Nubes y atmósfera en rotación // Escudo EM preparado',
            '#00f0ff'
          );
          return;
        }
      }

      // Click en la Luna
      if (moonInteractiveMeshes.length > 0) {
        const moonHits = raycaster.intersectObjects(moonInteractiveMeshes, true);
        if (moonHits.length > 0) {
          (moonShield.material as THREE.MeshBasicMaterial).opacity = 0.95;
          showPlanetHUD(
            'LA LUNA (LUNA)',
            'Satélite natural de Terra // Bloqueo de marea // Cráteres y regolito',
            '#cbd5e1'
          );
          return;
        }
      }

      // Click en el Satélite
      if (sateliteInteractiveMeshes.length > 0) {
        const satHits = raycaster.intersectObjects(sateliteInteractiveMeshes, true);
        if (satHits.length > 0) {
          (satShield.material as THREE.MeshBasicMaterial).opacity = 0.95;
          showPlanetHUD(
            'SATÉLITE ORBITAL (PW-SAT2)',
            'Órbita baja LEO // Enlace de datos de telemetría activo // Paneles solares desplegados',
            '#00f0ff'
          );
          return;
        }
      }

      // Click en otros planetas
      const otherMeshes = interactivePlanets.map((p) => p.mesh);
      const hits = raycaster.intersectObjects(otherMeshes);

      if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh;
        const matched = interactivePlanets.find((p) => p.mesh === hitMesh);
        if (matched) {
          matched.boost = 0.45;
          (matched.shield.material as THREE.MeshBasicMaterial).opacity = 0.95;
          showPlanetHUD(matched.data.name, matched.data.telemetry, matched.data.color);
          return;
        }
      }

      // Click en espacio vacío: silencioso y limpio (sin explosión)
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('.interactive-clickable'))
      ) {
        return;
      }

      isDragging = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseNX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        const totalDist = Math.hypot(e.clientX - startX, e.clientY - startY);
        if (totalDist > 6) {
          hasDragged = true;
        }
        dragVelYaw += dx * 0.0018;
        dragVelPitch += dy * 0.0018;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging && !hasDragged) {
        handlePointerAction(e.clientX, e.clientY);
      }
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      // El zoom inicial (1.0) es el límite más cercano: no se puede acercar más de lo que estaba al inicio
      targetZoomScale = THREE.MathUtils.clamp(
        targetZoomScale + e.deltaY * 0.0012,
        1.0,
        2.8
      );
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const currentLookTarget = new THREE.Vector3().copy(baseTarget);

    const printCameraCoords = () => {
      const code = `const baseCamPos = new THREE.Vector3(${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)});\nconst baseTarget = new THREE.Vector3(${currentLookTarget.x.toFixed(1)}, ${currentLookTarget.y.toFixed(1)}, ${currentLookTarget.z.toFixed(1)});`;
      console.log(
        `%c[CÁMARA COORDENADAS COPIADAS]:\n${code}`,
        'color: #00f0ff; font-weight: bold; font-size: 14px; background: #05080e; padding: 8px; border: 1px solid #00f0ff; border-radius: 4px;'
      );
      showPlanetHUD(
        'CÁMARA COPIADA',
        `X:${camera.position.x.toFixed(1)} Y:${camera.position.y.toFixed(1)} Z:${camera.position.z.toFixed(1)} (Código en portapapeles)`,
        '#00f0ff'
      );
      try {
        navigator.clipboard.writeText(code);
      } catch {}
      return code;
    };

    let onKeyDown: ((e: KeyboardEvent) => void) | null = null;
    if (DEBUG_CAMERA) {
      if (camButton) {
        camButton.onclick = (e) => {
          e.stopPropagation();
          printCameraCoords();
        };
      }

      try {
        Object.defineProperty(window, 'c', {
          get: printCameraCoords,
          configurable: true,
        });
        Object.defineProperty(window, 'cam', {
          get: printCameraCoords,
          configurable: true,
        });
        (window as any).getCam = printCameraCoords;
      } catch {}

      onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'c' || e.key === 'C') {
          printCameraCoords();
        }
      };
      window.addEventListener('keydown', onKeyDown);
    }

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Zoom-proof Resizer adaptativo para móviles, tablets y monitores
    const handleResize = () => {
      updateCameraProjection();
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

      // Update animation mixers
      for (let i = 0; i < mixers.length; i++) {
        mixers[i].update(dt);
      }

      // Giro inercial 3D libre
      orbitYaw += dragVelYaw;
      orbitPitch = THREE.MathUtils.clamp(orbitPitch + dragVelPitch, -1.2, 1.2);
      dragVelYaw *= 0.92;
      dragVelPitch *= 0.92;

      // Zoom interpolado suave
      zoomScale += (targetZoomScale - zoomScale) * 0.08;

      // Mouse Parallax suave
      smoothMX += (mouseNX - smoothMX) * 0.04;
      smoothMY += (mouseNY - smoothMY) * 0.04;

      // Progreso de scroll de la página (0.0 al inicio, 1.0 al final de la página)
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1000
      );
      const scrollFraction = THREE.MathUtils.clamp(Math.max(0, scrollY) / maxScroll, 0, 1);
      // Curva suave para alejarse poco a poquito
      const scrollProgress = Math.pow(scrollFraction, 0.85);

      // Posición alejada y centrada cuando se desliza hacia abajo (alinea la Tierra al centro)
      const scrollCenteredCam = new THREE.Vector3(-38.0, -11.0, 72.0);
      const scrollCenteredTarget = new THREE.Vector3(-38.0, -12.0, -40.0);

      // Interpolación entre posición inicial y posición centrada
      const activeBaseCam = new THREE.Vector3().lerpVectors(
        baseCamPos,
        scrollCenteredCam,
        scrollProgress
      );
      const activeBaseTarget = new THREE.Vector3().lerpVectors(
        baseTarget,
        scrollCenteredTarget,
        scrollProgress
      );

      // Cámara orbital en torno a la Tierra
      const earthCenter = earthGroup.position;
      const relCam = new THREE.Vector3().subVectors(activeBaseCam, earthCenter);

      relCam.applyAxisAngle(new THREE.Vector3(0, 1, 0), orbitYaw);
      relCam.applyAxisAngle(new THREE.Vector3(1, 0, 0), orbitPitch);
      relCam.multiplyScalar(zoomScale);

      camera.position.copy(earthCenter).add(relCam);
      const parallaxFactor = 1 - scrollProgress * 0.45;
      camera.position.x += smoothMX * (2.5 * parallaxFactor);
      camera.position.y += smoothMY * (1.8 * parallaxFactor);

      const lookTarget = new THREE.Vector3().copy(activeBaseTarget);
      lookTarget.applyAxisAngle(new THREE.Vector3(0, 1, 0), orbitYaw * 0.6);
      lookTarget.x += smoothMX * (4 * parallaxFactor);
      lookTarget.y += smoothMY * (3 * parallaxFactor);
      currentLookTarget.copy(lookTarget);
      camera.lookAt(lookTarget);

      // Domo de estrellas 4K siempre centrado en el observador
      skyMesh.position.copy(camera.position);
      skyMesh.rotation.y += 0.00004 * dt * 60;

      // Pulsación suave de la corona solar
      const sunPulse = 1 + Math.sin(t * 1.5) * 0.03;
      corona.scale.set(65 * sunPulse, 65 * sunPulse, 1);
      if (sunModel) {
        // Rotación axial lenta y majestuosa
        sunModel.rotation.y += 0.00015 * dt * 60;
      }

      // Rotación suave del globo terrestre
      if (earthModel) {
        earthModel.rotation.y +=
          (0.004 + (earthShield.material as THREE.MeshBasicMaterial).opacity * 0.02) *
          dt *
          60;
      }

      // --- ÓRBITA DE LA LUNA (moon.glb: radio 16.5 para efecto flyby cinematográfico cercano) ---
      const moonOrbitRadius = 16.5;
      const moonAngle = t * 0.22;
      moonGroup.position.set(
        earthGroup.position.x + Math.cos(moonAngle) * moonOrbitRadius,
        earthGroup.position.y + Math.sin(moonAngle) * -1,
        earthGroup.position.z + Math.sin(moonAngle) * moonOrbitRadius
      );
      if (moonModel) {
        moonModel.rotation.y = moonAngle; // Bloqueo de marea mirando hacia Terra
      }

      // --- ÓRBITA DEL SATÉLITE (satelite.glb) EN ÓRBITA BAJA (LEO) ---
      const satOrbitRadius = 13.8;
      const satAngle = t * 0.85; // Revolución ágil alrededor de la Tierra
      sateliteGroup.position.set(
        earthGroup.position.x + Math.cos(satAngle) * satOrbitRadius,
        earthGroup.position.y + Math.sin(satAngle * 1.3) * 5,
        earthGroup.position.z + Math.sin(satAngle) * satOrbitRadius
      );
      sateliteGroup.rotation.y = -satAngle + Math.PI / 2;
      sateliteGroup.rotation.z = Math.sin(satAngle) * 0.25;

      // Rotación de otros planetas
      saturnMesh.rotation.y += (0.05 + interactivePlanets[0]?.boost || 0) * dt * 30;
      marsMesh.rotation.y += (0.07 + interactivePlanets[1]?.boost || 0) * dt * 30;
      neptuneMesh.rotation.y += (0.06 + interactivePlanets[2]?.boost || 0) * dt * 30;

      // Decaimiento de escudos
      interactivePlanets.forEach((p) => {
        if (p.boost > 0) p.boost = Math.max(0, p.boost - dt * 0.2);
        const mat = p.shield.material as THREE.MeshBasicMaterial;
        if (mat.opacity > 0.01) {
          mat.opacity -= dt * 0.6;
          p.shield.rotation.y += dt * 2;
        }
      });

      const earthShieldMat = earthShield.material as THREE.MeshBasicMaterial;
      if (earthShieldMat.opacity > 0.01) {
        earthShieldMat.opacity -= dt * 0.55;
        earthShield.rotation.y += dt * 1.8;
      }

      const moonShieldMat = moonShield.material as THREE.MeshBasicMaterial;
      if (moonShieldMat.opacity > 0.01) {
        moonShieldMat.opacity -= dt * 0.55;
        moonShield.rotation.y += dt * 1.8;
      }

      const satShieldMat = satShield.material as THREE.MeshBasicMaterial;
      if (satShieldMat.opacity > 0.01) {
        satShieldMat.opacity -= dt * 0.55;
        satShield.rotation.y += dt * 1.8;
      }

      // Titileo de polvo estelar
      const sArr = starGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < STAR_COUNT; i++) {
        const i3 = i * 3;
        const twinkle = Math.sin(t * (1.3 + (i % 9) * 0.18) + starPhase[i]);
        sArr[i3 + 1] = starBase[i3 + 1] + twinkle * 0.12;
      }
      starGeo.attributes.position.needsUpdate = true;

      // Eventos espaciales aleatorios
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


      // Renderizado con Bloom
      composer.render();
    };

    animate();

    // ---- CLEANUP ----
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      if (onKeyDown) window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      ro.disconnect();

      if (container.contains(toast)) container.removeChild(toast);
      if (camButton && container.contains(camButton)) container.removeChild(camButton);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      try {
        delete (window as any).c;
        delete (window as any).cam;
      } catch {}
      skyGeo.dispose();
      skyMat.dispose();
      skyTexture.dispose();
      composer.dispose();
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
