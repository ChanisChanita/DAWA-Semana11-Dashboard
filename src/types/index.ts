export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'Planificado' | 'En progreso' | 'En revisión' | 'Completado';
  progress: number;
  teamMembers: string[]; // Array de IDs de miembros
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  role: string;
  name: string;
  email: string;
  position: string;
  birthdate: Date;
  phone: string;
  projectId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  description: string;
  projectId: string;
  status: 'Pendiente' | 'En progreso' | 'Completado';
  priority: 'Baja' | 'Media' | 'Alta' | 'Urgente';
  userId: string;
  dateline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'es' | 'en';
  notifications: boolean;
  emailUpdates: boolean;
  projectsPerPage: number;
  tasksPerPage: number;
}