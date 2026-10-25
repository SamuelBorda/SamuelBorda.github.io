import type { UserProfile } from '../utils/types';

export const userProfile: UserProfile = {
  name: 'Temis Samuel Borda Caballero',
  handle: 'SAMUEL_BORDA',
  role: 'Ingeniero en Sistemas // Fullstack Developer',
  title: 'Ingeniero en Sistemas',
  education: 'Ingeniero en Sistemas',
  clearance: 'ING. EN SISTEMAS // FULLSTACK',
  location: 'Cochabamba, Bolivia',
  bio: 'Ingeniero en Sistemas especializado en desarrollo Fullstack con sólido backend en PHP & Laravel, ecosistemas reactivos modernos en Next.js, React y TypeScript, WebSockets en tiempo real y conocimientos aplicados en ciberseguridad y buenas prácticas defensivas.',
  github: 'https://github.com/SamuelBorda',
  linkedin: 'https://linkedin.com/in/samuelborda',
  email: 'sami287borda@gmail.com',
  phone: '+591 76401404',
  availableForHire: true,
  experiences: [
    {
      company: 'Instituto Ceta',
      role: 'Desarrollo con WebSockets, APIs & Monitoreo de Sistemas',
      period: 'Septiembre 2024 - Junio 2025',
      description: 'Implementación de servicios en tiempo real con WebSockets, diseño y consumo de APIs seguras, telemetría y monitoreo de infraestructura de servidores y soporte técnico especializado.',
      tags: ['WebSockets', 'APIs REST', 'Node.js', 'Monitoreo', 'Soporte y Mantenimiento'],
    },
    {
      company: 'Comteco',
      role: 'Elaboración de Web App de Control de KPIs',
      period: 'Marzo 2024 - Agosto 2024',
      description: 'Arquitectura y desarrollo de plataforma web para captura, cálculo analítico y visualización en tiempo real de indicadores de rendimiento (KPIs) corporativos.',
      tags: ['Laravel / PHP', 'Bases de Datos', 'KPI Analytics', 'Dashboards', 'MVC'],
    },
    {
      company: 'DTIC Telecomunicaciones',
      role: 'Infraestructura de Redes & Sistemas',
      period: 'Junio 2021 - Diciembre 2021',
      description: 'Apoyo en el despliegue, configuración y diagnóstico de la infraestructura de redes, topologías de routing y mantenimiento de conectividad para entornos corporativos y campus.',
      tags: ['Infraestructura de Redes', 'Routing', 'Linux', 'Protocolos IP', 'Telecomunicaciones'],
    },
  ],
};

