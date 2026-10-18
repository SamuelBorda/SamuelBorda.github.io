# 🌌 Samuel Borda // Fullstack Developer & Cyber-Space HUD Portfolio

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Demo_en_Vivo-samuelborda.github.io-00f0ff?style=for-the-badge&logo=googlechrome&logoColor=white)](https://samuelborda.github.io)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<p align="center">
  <strong>Portafolio interactivo de alto rendimiento que fusiona desarrollo Fullstack moderno, simulación espacial 3D en tiempo real y una estética Cyberpunk / Gaming HUD inmersiva.</strong>
</p>

</div>

---

## 👨‍💻 Sobre Mí

Soy **Samuel Borda Caballero**, Desarrollador Fullstack con **5 años de experiencia práctica** diseñando, construyendo y desplegando aplicaciones web de alto impacto, plataformas escalables y arquitecturas de APIs robustas.

- 🎯 **Núcleo Técnico Principal:** Ecosistema **PHP & Laravel** (Arquitectura limpia, Eloquent ORM, APIs RESTful de alto rendimiento y diseño de bases de datos relacionales).
- ⚡ **Frontend Moderno:** **Next.js**, **React 19**, **Angular**, TypeScript y diseño centrado en micro-interacciones interactivas.
- 📍 **Ubicación:** Bolivia // Disponible para oportunidades remotas globales.
- 🚀 **Explora el proyecto en vivo:** [https://samuelborda.github.io](https://samuelborda.github.io)

---

## 🌟 Experiencia Interactiva & Características Clave

Este proyecto no es solo una hoja de vida estática: es una aplicación web interactiva diseñada como una cabina de comando espacial y táctica:

### 🪐 1. Simulación Espacial 3D en Tiempo Real (Three.js WebGL)
- **Modelos GLTF/GLB Optimizados:**
  - **Planeta Tierra (Terra):** Con rotación axial independiente, atmósfera con shader glow, nubes y escudo electromagnético reactivo.
  - **El Sol (Helios):** Emisor central de luz dinámica con corona solar y fusión termonuclear activa.
  - **La Luna & Satélite Orbital (PW-SAT2):** Satélites naturales y artificiales orbitando con cálculos orbitales en tiempo real.
- **Skybox 4K de Espacio Profundo:** Domo panorámico equirectangular inmersivo con textura 360° de la Vía Láctea.
- **Polvo Estelar Dinámico:** Más de 2000 estrellas espectrales distribuidas con titileo procedural y profundidad de campo.

### 📱 2. Motor de Proyección Responsive Sincronizado
- Algoritmo de **Horizontal FOV Constante** mediante trigonometría esférica:
  $$\text{vFov} = 2 \cdot \arctan\left(\frac{\tan(26^\circ) \cdot (16/9)}{\text{aspect}}\right)$$
- En cualquier smartphone o pantalla vertical, la relación horizontal de la escena se preserva idéntica a la de un monitor panorámico de PC: la Tierra, el Sol y el espacio se encuadran automáticamente sin cortes laterales ni distorsión.

### 🛰️ 3. Telemetría Táctica y Scanner Raycasting
- Haz clic o tap en los planetas, la Luna o el satélite orbital para proyectar su escudo electromagnético y desplegar su ficha de telemetría astronómica en el HUD.
- Interacción orbital fluida con arrastre de ratón (pitch & yaw inercial) y zoom suave adaptativo.

### 🔊 4. Audio Procedural Sintetizado (Web Audio API)
- Cero archivos `.mp3` o `.wav` pesados: los efectos sonoros futuristas (clics, alertas tácticas, warps de navegación) son **sintetizados matemáticamente en tiempo de ejecución** mediante osciladores, filtros biquad y nodos de ganancia en memoria.

### 💻 5. Terminal CLI Interactiva
- Consola integrada accesible mediante atajo o botón HUD para interactuar con el portafolio mediante comandos (`help`, `skills`, `projects`, `contact`, `clear`).

### 🎮 6. Gamificación del Stack Tecnológico
- Árbol de inventario de habilidades categorizado con niveles de dominio y rarezas de videojuego (*Legendario*, *Épico*, *Raro*, *Común*).
- Tarjetas de proyectos con efecto **3D Parallax Tilt** holográfico.
- Modo retro **CRT / Scanlines** conmutable en vivo para fanáticos de la estética arcade.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript, Vite |
| **Gráficos 3D** | Three.js (r186), GLTFLoader, EffectComposer, UnrealBloomPass |
| **Estilos & Diseño** | Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Motor de Audio** | Web Audio API (Sintetizador Procedural) |
| **CI / CD & Deploy** | GitHub Actions (`deploy.yml`), GitHub Pages |

---

## 📂 Arquitectura del Proyecto

```text
SamuelBorda.github.io/
├── public/
│   ├── models/            # Modelos 3D GLB (earth.glb, sun.glb, moon.glb, satelite.glb)
│   ├── textures/          # Textura 4K equirectangular de espacio profundo
│   └── favicon.svg        # Identidad visual del HUD
├── src/
│   ├── components/
│   │   ├── Background3D.tsx     # Motor Three.js 3D (Cosmos, planetas, cámara y bloom)
│   │   ├── CyberCursor.tsx      # Retículo táctico HUD y tracker de coordenadas
│   │   ├── NavbarHUD.tsx        # Barra de navegación con telemetría y controles
│   │   ├── HeroSection.tsx      # Presentación principal con tipografía glitch
│   │   ├── ProjectsSection.tsx  # Showcase de proyectos con filtros interactivos
│   │   ├── SkillsInventory.tsx  # Matriz de tecnologías con niveles y rarezas
│   │   ├── TerminalModal.tsx    # Terminal interactiva estilo hacker/CLI
│   │   └── ContactSection.tsx   # Enlace de comunicación y formulario
│   ├── data/
│   │   ├── profile.ts           # Datos biográficos y profesionales
│   │   └── projects.ts          # Repositorios y proyectos destacados
│   └── utils/
│       ├── soundEffects.ts      # Sintetizador procedural con Web Audio API
│       └── types.ts             # Definiciones e interfaces TypeScript
└── .github/workflows/           # Pipeline automatizado de compilación y despliegue
```

---

## ⚡ Instalación y Ejecución Local

Si deseas clonar y explorar el proyecto en tu entorno local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/SamuelBorda/SamuelBorda.github.io.git

# 2. Entrar a la carpeta
cd SamuelBorda.github.io

# 3. Instalar dependencias
npm install

# 4. Levantar el entorno de desarrollo
npm run dev
```

El servidor estará disponible inmediatamente en `http://localhost:5173`.

---

## 📬 Contacto & Conexión

- **Portafolio:** [samuelborda.github.io](https://samuelborda.github.io)
- **LinkedIn:** [linkedin.com/in/samuelborda](https://linkedin.com/in/samuelborda)
- **GitHub:** [github.com/SamuelBorda](https://github.com/SamuelBorda)
- **Email:** [samuelborda@gmail.com](mailto:samuelborda@gmail.com)

---

<div align="center">
  <sub>Diseñado y desarrollado por <strong>Samuel Borda Caballero</strong> // 2026</sub>
</div>
