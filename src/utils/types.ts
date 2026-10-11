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
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS';
  rewardXP?: number;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: {
    name: string;
    level: number; // 1-100
    experience: string;
    icon: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    tag: string;
  }[];
}

export interface UserProfile {
  name: string;
  handle: string;
  role: string;
  level: number;
  location: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
  availableForHire: boolean;
}
