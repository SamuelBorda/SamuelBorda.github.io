export interface DetailedSkill {
  name: string;
  category: 'php-core' | 'frontend' | 'database-tools';
  years: number;
  levelPercent: number; // Porcentaje de dominio práctico
  highlight: string;
  description: string;
  ecosystem: string[];
  tag: string;
  isPrimaryMastery?: boolean;
}

export const detailedSkills: DetailedSkill[] = [
  // --- CORE MASTERY: PHP & LARAVEL (5 Años) ---
  {
    name: 'Laravel Framework',
    category: 'php-core',
    years: 5,
    levelPercent: 92,
    isPrimaryMastery: true,
    highlight: 'Especialidad principal y framework de cabecera',
    description: 'Desarrollo integral de backend: Eloquent ORM, migraciones complejas, seeders, autenticación (Sanctum/Breeze), middlewares, API Resources, validación avanzada de FormRequests, colas (Queues) y arquitectura limpia en capas.',
    ecosystem: ['Eloquent', 'Artisan CLI', 'Blade', 'Sanctum', 'Queues', 'Livewire', 'REST APIs'],
    tag: 'Framework Principal',
  },
  {
    name: 'PHP 8.x Moderno',
    category: 'php-core',
    years: 5,
    levelPercent: 90,
    isPrimaryMastery: true,
    highlight: 'Lenguaje base con 5 años de práctica constante',
    description: 'Programación Orientada a Objetos sólida (POO), herencia, interfaces, traits, tipado estricto en métodos/propiedades, match expressions, composer para gestión de paquetes y buenas prácticas PSR.',
    ecosystem: ['POO Avanzada', 'Tipado Estricto', 'Composer', 'PSR-12', 'PDO', 'MVC'],
    tag: 'Lenguaje Núcleo',
  },
  {
    name: 'APIs RESTful con PHP',
    category: 'php-core',
    years: 4,
    levelPercent: 88,
    isPrimaryMastery: true,
    highlight: 'Diseño de endpoints seguros y estructurados',
    description: 'Estructuración de respuestas JSON uniformes, códigos de estado HTTP semánticos, paginación eficiente, filtrado de queries, autenticación por tokens JWT/Bearer y consumo desde SPAs frontend.',
    ecosystem: ['JSON APIs', 'JWT / Bearer Auth', 'CORS', 'Rate Limiting', 'Postman'],
    tag: 'Arquitectura Web',
  },
  {
    name: 'Frameworks PHP Alternativos',
    category: 'php-core',
    years: 3,
    levelPercent: 78,
    highlight: 'Versatilidad en el ecosistema PHP',
    description: 'Familiaridad con la estructura y componentes de otros frameworks del ecosistema PHP como Symfony (componentes HTTP y console) y CodeIgniter, permitiendo mantenimiento y migración de proyectos legados.',
    ecosystem: ['Symfony Components', 'CodeIgniter', 'Slim Microframework'],
    tag: 'Ecosistema PHP',
  },

  // --- FRONTEND REACTIVO ---
  {
    name: 'Next.js',
    category: 'frontend',
    years: 2.5,
    levelPercent: 82,
    highlight: 'Fullstack reactivo con SSR y Client Components',
    description: 'Enrutamiento por App Router, renderizado del lado del servidor (SSR) para SEO, componentes cliente interactivos, layouts persistentes y consumo de APIs backend de Laravel.',
    ecosystem: ['App Router', 'SSR / SSG', 'Server Actions', 'API Routes'],
    tag: 'React Framework',
  },
  {
    name: 'React',
    category: 'frontend',
    years: 3,
    levelPercent: 84,
    highlight: 'Interfaces modulares y dinámicas',
    description: 'Manejo de Hooks (useState, useEffect, useMemo, useCallback), creación de Custom Hooks reutilizables, consumo de APIs mediante Axios/Fetch, gestión de estado y renderizado condicional.',
    ecosystem: ['React Hooks', 'Context API', 'Vite', 'React Router', 'Component Lifecycle'],
    tag: 'Librería Frontend',
  },
  {
    name: 'Angular',
    category: 'frontend',
    years: 2,
    levelPercent: 74,
    highlight: 'Desarrollo modular con TypeScript estricto',
    description: 'Creación de módulos y componentes standalone, servicios con Inyección de Dependencias, comunicación mediante RxJS / Observables, enrutamiento y formularios reactivos.',
    ecosystem: ['TypeScript', 'Dependency Injection', 'RxJS', 'Directivas', 'Servicios'],
    tag: 'Framework Empresarial',
  },
  {
    name: 'Tailwind CSS & Estilos',
    category: 'frontend',
    years: 4,
    levelPercent: 90,
    highlight: 'Maquetación ágil y diseño responsive',
    description: 'Diseño adaptable (Mobile First), flexbox, grid, animaciones CSS, temas oscuros/neón, y maquetación de interfaces limpias con estética moderna.',
    ecosystem: ['Tailwind v3/v4', 'Flexbox & CSS Grid', 'Mobile First', 'Micro-animaciones'],
    tag: 'UI & Estilos',
  },

  // --- BASES DE DATOS, HERRAMIENTAS & RUNTIMES ---
  {
    name: 'Bases de Datos Relacionales (MySQL & PostgreSQL)',
    category: 'database-tools',
    years: 4.5,
    levelPercent: 85,
    highlight: 'Diseño de esquemas y consultas relacionales',
    description: 'Modelado entidad-relación, llaves foráneas, índices para búsqueda rápida, joins, transacciones para consistencia de datos y optimización de consultas SQL.',
    ecosystem: ['MySQL', 'PostgreSQL', 'Migraciones', 'Relaciones 1:N y N:M', 'Índices'],
    tag: 'Persistencia de Datos',
  },
  {
    name: 'Node.js & Express',
    category: 'database-tools',
    years: 2.5,
    levelPercent: 76,
    highlight: 'Backend secundario y utilidades en JavaScript',
    description: 'Servidores REST básicos con Express, middlewares de autenticación, scripts de automatización con Node y manejo asíncrono con async/await.',
    ecosystem: ['Express.js', 'NPM Scripts', 'Middlewares', 'Event Loop'],
    tag: 'JavaScript Runtime',
  },
  {
    name: 'Git & GitHub',
    category: 'database-tools',
    years: 5,
    levelPercent: 88,
    highlight: 'Control de versiones en el flujo de trabajo diario',
    description: 'Ramas, pull requests, merges, resolución de conflictos, integración con GitHub Actions para despliegues automatizados y hosting estático en GitHub Pages.',
    ecosystem: ['Git CLI', 'GitHub Actions', 'Branching Strategy', 'GitHub Pages'],
    tag: 'Control de Versiones',
  },
  {
    name: 'Docker (Nivel Práctico)',
    category: 'database-tools',
    years: 2,
    levelPercent: 68,
    highlight: 'Contenerización de entornos de desarrollo',
    description: 'Configuración de Dockerfile y docker-compose.yml para levantar entornos locales LEMP (PHP + Nginx + MySQL) y Node sin necesidad de instalar dependencias en la máquina host.',
    ecosystem: ['docker-compose', 'Contenedores LEMP', 'Volúmenes', 'Puertos'],
    tag: 'Virtualización Básica',
  },
];
