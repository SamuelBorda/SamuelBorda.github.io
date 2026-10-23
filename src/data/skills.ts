export interface DetailedSkill {
  name: string;
  category: 'backend' | 'frontend' | 'infra';
  years: number;
  levelPercent: number; // Porcentaje de dominio práctico
  highlight: string;
  description: string;
  ecosystem: string[];
  tag: string;
  isPrimaryMastery?: boolean;
}

export const detailedSkills: DetailedSkill[] = [
  // --- 1. BACKEND & APIS ---
  {
    name: 'Laravel & PHP 8.x',
    category: 'backend',
    years: 4,
    levelPercent: 92,
    isPrimaryMastery: true,
    highlight: 'Framework de cabecera y especialidad backend',
    description: 'Desarrollo integral de backend y APIs RESTful: Eloquent ORM, migraciones complejas, seeders, autenticación (Sanctum), middlewares, API Resources, validación de FormRequests, colas (Queues) y arquitectura limpia en capas.',
    ecosystem: ['Laravel 11', 'PHP 8.3', 'Eloquent ORM', 'Sanctum', 'Artisan CLI', 'Queues', 'Blade'],
    tag: 'Framework Principal',
  },
  {
    name: 'WebSockets & Servicios en Tiempo Real',
    category: 'backend',
    years: 2,
    levelPercent: 86,
    isPrimaryMastery: true,
    highlight: 'Experiencia aplicada en monitoreo y telemetría (Ceta)',
    description: 'Implementación de servidores de eventos bidireccionales en tiempo real, suscripción a canales, intercambio de datos de telemetría y sincronización instantánea entre frontend y backend.',
    ecosystem: ['WebSockets', 'Socket.IO', 'Eventos en Tiempo Real', 'Telemetría', 'Broadcast'],
    tag: 'Tiempo Real',
  },
  {
    name: 'APIs RESTful & Arquitectura MVC',
    category: 'backend',
    years: 4,
    levelPercent: 90,
    isPrimaryMastery: true,
    highlight: 'Diseño estructurado y buenas prácticas de ingeniería',
    description: 'Estructuración semántica de respuestas HTTP, paginación eficiente, filtrado dinámico de queries, control de acceso basado en roles (RBAC), tokens Bearer/JWT y documentación estructurada.',
    ecosystem: ['JSON APIs', 'JWT / Bearer Auth', 'CORS', 'Rate Limiting', 'Postman', 'POO'],
    tag: 'Arquitectura Web',
  },
  {
    name: 'Node.js & Express',
    category: 'backend',
    years: 2.5,
    levelPercent: 80,
    highlight: 'Microservicios y runtime asíncrono en JavaScript',
    description: 'Construcción de servidores ligeros con Express, middlewares de autenticación, integración de bases de datos y scripts de automatización con manejo asíncrono (async/await).',
    ecosystem: ['Express.js', 'NPM Scripts', 'Middlewares', 'Event Loop', 'Async/Await'],
    tag: 'JavaScript Runtime',
  },

  // --- 2. FRONTEND MODERNO ---
  {
    name: 'Next.js (App Router & SSR)',
    category: 'frontend',
    years: 2.5,
    levelPercent: 86,
    isPrimaryMastery: true,
    highlight: 'Fullstack reactivo con renderizado del lado del servidor',
    description: 'Estructuración moderna con App Router, renderizado híbrido (SSR / SSG), Server Actions para mutaciones sin APIs intermedias, optimización de fuentes e imágenes y layouts anidados.',
    ecosystem: ['Next.js 15', 'App Router', 'Server Actions', 'SSR / SSG', 'Route Handlers'],
    tag: 'Framework Fullstack',
  },
  {
    name: 'React.js & TypeScript',
    category: 'frontend',
    years: 3,
    levelPercent: 88,
    isPrimaryMastery: true,
    highlight: 'Componentes interactivos con tipado estricto',
    description: 'Creación de interfaces modulares basadas en componentes, manejo fluido de Hooks (useState, useEffect, useMemo, useCallback), Custom Hooks reutilizables y tipado seguro de props y estados.',
    ecosystem: ['React 19', 'TypeScript', 'Custom Hooks', 'Context API', 'Vite'],
    tag: 'Librería UI',
  },
  {
    name: 'Tailwind CSS & UI Responsiva',
    category: 'frontend',
    years: 3.5,
    levelPercent: 92,
    highlight: 'Maquetación ágil y estética visual moderna',
    description: 'Diseño adaptable con enfoque Mobile-First, flexbox, grid, personalización de paletas cyberpunk/oscuras, micro-animaciones fluidas y maquetación de interfaces de alto impacto visual.',
    ecosystem: ['Tailwind v3/v4', 'CSS Grid & Flexbox', 'Mobile First', 'Micro-interacciones'],
    tag: 'Estilos & Layout',
  },
  {
    name: 'Three.js & Gráficos WebGL',
    category: 'frontend',
    years: 1.5,
    levelPercent: 76,
    highlight: 'Experiencias 3D interactivas y shaders',
    description: 'Integración de escenas Three.js con carga de modelos GLTF/GLB, iluminación PBR, postprocesamiento con bloom, mapas de textura procedurales y controles orbitales interactivos.',
    ecosystem: ['Three.js', 'WebGL', 'GLTF Loader', 'Shaders', 'Post-processing Bloom'],
    tag: 'Computación Gráfica',
  },

  // --- 3. INFRAESTRUCTURA, BASES DE DATOS & REDES ---
  {
    name: 'Bases de Datos Relacionales (PostgreSQL & MySQL)',
    category: 'infra',
    years: 4,
    levelPercent: 88,
    isPrimaryMastery: true,
    highlight: 'Diseño de esquemas y consultas de alto rendimiento',
    description: 'Modelado relacional entidad-relación, integridad referencial con claves foráneas, índices para optimización de queries, transacciones ACID para consistencia y migraciones.',
    ecosystem: ['PostgreSQL', 'MySQL', 'Modelado E/R', 'Índices & Optimización', 'ACID'],
    tag: 'Persistencia de Datos',
  },
  {
    name: 'Docker & Entornos de Desarrollo',
    category: 'infra',
    years: 2,
    levelPercent: 75,
    highlight: 'Contenerización de aplicaciones y servicios',
    description: 'Creación de Dockerfiles y docker-compose.yml para levantar entornos reproducibles (LEMP: PHP + Nginx + MySQL, Node.js) asegurando paridad entre desarrollo y producción.',
    ecosystem: ['Docker', 'docker-compose', 'Contenedores LEMP', 'Volúmenes', 'Nginx'],
    tag: 'Contenerización',
  },
  {
    name: 'Redes & Protocolos de Enrutamiento',
    category: 'infra',
    years: 3,
    levelPercent: 82,
    highlight: 'Experiencia práctica en infraestructura y telecomunicaciones',
    description: 'Fundamentos sólidos de redes TCP/IP, modelos OSI, protocolos de routing, segmentación de subredes, diagnóstico de tráfico de red y configuración de servidores en entorno Linux.',
    ecosystem: ['TCP/IP', 'Routing Protocols', 'Linux CLI', 'Diagnóstico de Red', 'Infraestructura'],
    tag: 'Redes & Sistemas',
  },
  {
    name: 'Control de Versiones con Git & GitHub',
    category: 'infra',
    years: 4,
    levelPercent: 90,
    highlight: 'Flujo de trabajo colaborativo profesional',
    description: 'Gestión de ramas (feature branches), pull requests con code review, resolución de conflictos, integración continua básica con GitHub Actions y despliegues estáticos.',
    ecosystem: ['Git CLI', 'GitHub', 'Pull Requests', 'Code Review', 'Branching'],
    tag: 'Control de Versiones',
  },
];
