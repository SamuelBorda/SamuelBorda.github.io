export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Fullstack' | 'Backend' | 'Frontend' | 'Laravel' | 'Next.js' | 'Node.js' | 'Angular';
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  featured?: boolean;
  stats?: {
    stars?: number;
    forks?: number;
    language?: string;
    lastUpdated?: string;
  };
  image?: string;
  architecture?: 'MICROSERVICES' | 'MONOLITH' | 'SERVERLESS' | 'JAMSTACK' | 'HYBRID';
  deployStatus?: 'PRODUCTION' | 'DEPLOYED' | 'ACTIVE';
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: {
    name: string;
    level: number; // 1-100
    experience: string;
    icon: string;
    specialization: 'Core Architecture' | 'Advanced' | 'Enterprise';
    tag: string;
  }[];
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
}

export interface UserProfile {
  name: string;
  handle: string;
  role: string;
  title: string;
  education: string;
  clearance: string;
  location: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
  phone: string;
  availableForHire: boolean;
  experiences: WorkExperience[];
}

