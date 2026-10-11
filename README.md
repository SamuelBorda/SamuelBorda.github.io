# 🎮 Portafolio Web Interactivo & Gaming HUD

Portafolio web interactivo de alto rendimiento estilo videojuego / cyberpunk para desarrollador Fullstack (**Laravel, Next.js, Node.js, Angular, React y PHP**). 
Construido con **React 19, Vite, Three.js, Tailwind CSS v4, Lucide Icons y Framer Motion**, optimizado para desplegarse de forma 100% gratuita en **GitHub Pages**.

---

## 🚀 Características Principales

- **Fondo 3D con Three.js (Sin modelos 3D pesados):** Campo de estrellas procedural, núcleo geométrico wireframe holográfico que responde a la posición del cursor del ratón.
- **Micro-interacciones de Videojuego:**
  - Sistema de sonido sintetizado con Web Audio API (efectos de hover, clic, level-up y warp; sin archivos mp3 pesados).
  - Efecto 3D Parallax Tilt en las tarjetas de proyectos con reflejo holográfico.
  - Filtro CRT / Scanlines retro conmutable en el HUD.
  - Terminal de comandos interactiva integrada (`CLI`).
  - Árbol de habilidades con niveles y rarezas (Común, Rara, Épica, Legendaria).
- **Control Total de tus Proyectos de GitHub:** Solo tú decides qué repositorios se publican y se muestran en la web.
- **Despliegue Automático en GitHub Pages:** Archivo `.github/workflows/deploy.yml` listo para compilar y publicar en cada `git push`.

---

## 🛠️ Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo local
npm run dev

# Compilar para producción
npm run build

# Previsualizar la compilación de producción
npm run preview
```

---

## 📦 Cómo conectar tus proyectos de GitHub

Solo tú controlas qué proyectos aparecen públicamente:

### 1. Sincronizar tus repositorios con el script local:
Ejecuta en tu terminal:
```bash
npm run sync-repos tu-usuario-de-github
```
El script consultará la API pública de GitHub y guardará la información de tus repositorios (estrellas, lenguaje, descripción, forks) en:
`src/data/github-repos-cache.json`.

### 2. Elegir qué mostrar:
Abre [`src/data/projects.ts`](file:///f:/proyectos%20portafolio/portafolio%20web/src/data/projects.ts) y añade o edita los proyectos que deseas mostrar. Puedes asignarles dificultad de misión (`EASY`, `MEDIUM`, `HARD`, `BOSS`), XP de recompensa, enlaces a demos en vivo y tags.

---

## 👤 Personalizar tu Perfil

Edita el archivo [`src/data/profile.ts`](file:///f:/proyectos%20portafolio/portafolio%20web/src/data/profile.ts):
- Tu nombre y usuario de GitHub.
- Tu rol y nivel.
- Tu biografía.
- Enlaces a LinkedIn, GitHub y correo.

---

## 🌐 Cómo publicar gratis en GitHub Pages

1. **Crea un repositorio en GitHub:**
   - Si quieres que la URL sea `tu-usuario.github.io`, nombra el repositorio exactamente como `tu-usuario.github.io`.
   - O si usas cualquier otro nombre (ej. `mi-portafolio`), se verá en `tu-usuario.github.io/mi-portafolio`.

2. **Sube tu código:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/NOMBRE-DEL-REPO.git
   git push -u origin main
   ```

3. **Activar GitHub Pages con GitHub Actions:**
   - En tu repositorio de GitHub, ve a **Settings** > **Pages**.
   - En **Build and deployment > Source**, selecciona **GitHub Actions**.
   - ¡Listo! En cada `git push`, el flujo de trabajo en `.github/workflows/deploy.yml` compilará y actualizará tu portafolio automáticamente en segundos.
