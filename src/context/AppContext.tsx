"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Project, TeamMember, Task, AppSettings } from '@/types';

// Estado inicial
interface AppState {
  projects: Project[];
  teamMembers: TeamMember[];
  tasks: Task[];
  settings: AppSettings;
  loading: boolean;
}

// Acciones
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  // Project actions
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  // Team actions
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'UPDATE_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'DELETE_TEAM_MEMBER'; payload: string }
  // Task actions
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  // Settings actions
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> };

// Estado inicial
const initialState: AppState = {
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Plataforma de comercio electrónico con Next.js',
      category: 'web',
      priority: 'high',
      status: 'En progreso',
      progress: 65,
      teamMembers: ['1', '2', '3'],
      createdAt: new Date('2024-10-01'),
      updatedAt: new Date('2024-11-01'),
    },
    {
      id: '2',
      name: 'Mobile App',
      description: 'Aplicación móvil con React Native',
      category: 'mobile',
      priority: 'medium',
      status: 'En revisión',
      progress: 90,
      teamMembers: ['1', '4'],
      createdAt: new Date('2024-09-15'),
      updatedAt: new Date('2024-10-28'),
    },
    {
      id: '3',
      name: 'Dashboard Analytics',
      description: 'Panel de análisis con visualizaciones',
      category: 'web',
      priority: 'medium',
      status: 'Planificado',
      progress: 20,
      teamMembers: ['2', '3', '5'],
      createdAt: new Date('2024-10-20'),
      updatedAt: new Date('2024-10-30'),
    },
  ],
  teamMembers: [
    {
      userId: '1',
      role: 'Frontend Developer',
      name: 'María García',
      email: 'maria@example.com',
      position: 'Senior Developer',
      birthdate: new Date('1990-05-15'),
      phone: '+34 600 123 456',
      projectId: '1',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-11-01'),
    },
    {
      userId: '2',
      role: 'Backend Developer',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      position: 'Lead Developer',
      birthdate: new Date('1988-03-22'),
      phone: '+34 600 234 567',
      projectId: '1',
      isActive: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-11-01'),
    },
    {
      userId: '3',
      role: 'UI/UX Designer',
      name: 'Ana López',
      email: 'ana@example.com',
      position: 'Senior Designer',
      birthdate: new Date('1992-08-10'),
      phone: '+34 600 345 678',
      projectId: '3',
      isActive: false,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-10-25'),
    },
    {
      userId: '4',
      role: 'DevOps Engineer',
      name: 'Carlos Ruiz',
      email: 'carlos@example.com',
      position: 'DevOps Lead',
      birthdate: new Date('1985-12-03'),
      phone: '+34 600 456 789',
      projectId: '2',
      isActive: true,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-11-01'),
    },
    {
      userId: '5',
      role: 'Project Manager',
      name: 'Laura Martínez',
      email: 'laura@example.com',
      position: 'Senior PM',
      birthdate: new Date('1987-07-18'),
      phone: '+34 600 567 890',
      isActive: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-11-01'),
    },
  ],
  tasks: [
    {
      id: '1',
      description: 'Implementar autenticación',
      projectId: '1',
      status: 'En progreso',
      priority: 'Alta',
      userId: '1',
      dateline: new Date('2025-11-15'),
      createdAt: new Date('2024-10-01'),
      updatedAt: new Date('2024-11-01'),
    },
    {
      id: '2',
      description: 'Diseñar pantalla de perfil',
      projectId: '2',
      status: 'Pendiente',
      priority: 'Media',
      userId: '3',
      dateline: new Date('2025-11-20'),
      createdAt: new Date('2024-10-05'),
      updatedAt: new Date('2024-10-28'),
    },
    {
      id: '3',
      description: 'Configurar CI/CD',
      projectId: '1',
      status: 'Completado',
      priority: 'Alta',
      userId: '4',
      dateline: new Date('2025-11-10'),
      createdAt: new Date('2024-09-20'),
      updatedAt: new Date('2024-10-15'),
    },
    {
      id: '4',
      description: 'Optimizar queries SQL',
      projectId: '1',
      status: 'En progreso',
      priority: 'Urgente',
      userId: '2',
      dateline: new Date('2025-11-12'),
      createdAt: new Date('2024-10-10'),
      updatedAt: new Date('2024-11-01'),
    },
    {
      id: '5',
      description: 'Documentar API endpoints',
      projectId: '1',
      status: 'Pendiente',
      priority: 'Baja',
      userId: '5',
      dateline: new Date('2025-11-25'),
      createdAt: new Date('2024-10-15'),
      updatedAt: new Date('2024-10-30'),
    },
  ],
  settings: {
    theme: 'light',
    language: 'es',
    notifications: true,
    emailUpdates: false,
    projectsPerPage: 6,
    tasksPerPage: 10,
  },
  loading: false,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    // Project actions
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };

    // Team actions
    case 'ADD_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: [...state.teamMembers, action.payload],
      };
    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: state.teamMembers.map(member =>
          member.userId === action.payload.userId ? action.payload : member
        ),
      };
    case 'DELETE_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: state.teamMembers.filter(member => member.userId !== action.payload),
      };

    // Task actions
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };

    // Settings actions
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
}

// Hooks específicos para cada entidad
export function useProjects() {
  const { state, dispatch } = useApp();

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  };

  const updateProject = (project: Project) => {
    const updatedProject = { ...project, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
  };

  const deleteProject = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  };

  return {
    projects: state.projects,
    addProject,
    updateProject,
    deleteProject,
  };
}

export function useTeamMembers() {
  const { state, dispatch } = useApp();

  const addTeamMember = (member: Omit<TeamMember, 'createdAt' | 'updatedAt'>) => {
    const newMember: TeamMember = {
      ...member,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: newMember });
  };

  const updateTeamMember = (member: TeamMember) => {
    const updatedMember = { ...member, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_TEAM_MEMBER', payload: updatedMember });
  };

  const deleteTeamMember = (userId: string) => {
    dispatch({ type: 'DELETE_TEAM_MEMBER', payload: userId });
  };

  return {
    teamMembers: state.teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
}

export function useTasks() {
  const { state, dispatch } = useApp();

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task: Task) => {
    const updatedTask = { ...task, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  return {
    tasks: state.tasks,
    addTask,
    updateTask,
    deleteTask,
  };
}

export function useSettings() {
  const { state, dispatch } = useApp();

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  return {
    settings: state.settings,
    updateSettings,
  };
}

export function useLoading() {
  const { state, dispatch } = useApp();

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  return {
    loading: state.loading,
    setLoading,
  };
}