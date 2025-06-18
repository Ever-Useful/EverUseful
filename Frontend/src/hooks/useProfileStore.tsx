import create from "zustand";
import { persist } from 'zustand/middleware';

export type UserType = 'student' | 'professor' | 'enterprise';

export interface Project {
  id: string;
  name: string;
  aim: string;
  description: string;
  link: string;
}

export interface Paper {
  id: string;
  name: string;
  description: string;
  publisher: string;
  link: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface BaseProfile {
  name: string;
  bio: string;
  avatar: string;
  userType: UserType;
}

export interface StudentProfile extends BaseProfile {
  userType: 'student';
  lastName: string;
  college: string;
  degree: string;
  course: string;
  year: string;
  location: string;
  website: string;
  projects: Project[];
}

export interface ProfessorProfile extends BaseProfile {
  userType: 'professor';
  institution: string;
  department: string;
  experience: string;
  papers: Paper[];
}

export interface EnterpriseProfile extends BaseProfile {
  userType: 'enterprise';
  location: string;
  products: Product[];
}

export type ProfileData = StudentProfile | ProfessorProfile | EnterpriseProfile;

interface ProfileStore {
  profile: ProfileData | null;
  setProfile: (profile: ProfileData) => void;
  updateProfile: (updates: Partial<ProfileData>) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addPaper: (paper: Paper) => void;
  updatePaper: (id: string, paper: Partial<Paper>) => void;
  deletePaper: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProfileStore = create<ProfileStore>(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) => 
        set((state: ProfileStore) => {
          if (!state.profile) return { profile: null };
          switch (state.profile.userType) {
            case 'student':
              return { profile: { ...state.profile, ...updates } as StudentProfile };
            case 'professor':
              return { profile: { ...state.profile, ...updates } as ProfessorProfile };
            case 'enterprise':
              return { profile: { ...state.profile, ...updates } as EnterpriseProfile };
            default:
              return { profile: state.profile };
          }
        }),
      addProject: (project) =>
        set((state: ProfileStore) => {
          if (state.profile?.userType === 'student') {
            return {
              profile: {
                ...state.profile,
                projects: [...state.profile.projects, project]
              }
            };
          }
          return state;
        }),
      updateProject: (id, updates) =>
        set((state: ProfileStore) => {
          if (state.profile?.userType === 'student') {
            return {
              profile: {
                ...state.profile,
                projects: state.profile.projects.map(p => 
                  p.id === id ? { ...p, ...updates } : p
                )
              }
            };
          }
          return state;
        }),
      deleteProject: (id) =>
        set((state: ProfileStore) => {
          if (state.profile?.userType === 'student') {
            return {
              profile: {
                ...state.profile,
                projects: state.profile.projects.filter(p => p.id !== id)
              }
            };
          }
          return state;
        }),
      addPaper: (paper) =>
        set((state: ProfileStore) => {
          if (state.profile?.userType === 'professor') {
            return {
              profile: {
                ...state.profile,
                papers: [...state.profile.papers, paper]
              }
            };
          }
          return state;
        }),
      updatePaper: (id, updates) =>
        set((state: ProfileStore) => {
          if (state.profile?.userType === 'professor') {
            return {
              profile: {
                ...state.profile,
                papers: state.profile.papers.map(p => 
                  p.id === id ? { ...p, ...updates } : p
                )
              }
            };
          }
          return state;
        }),
      deletePaper: (id) =>
        set((state: ProfileStore) => {
          if (state.profile?.userType === 'professor') {
            return {
              profile: {
                ...state.profile,
                papers: state.profile.papers.filter(p => p.id !== id)
              }
            };
          }
          return state;
        }),
      addProduct: (product) =>
        set((state: ProfileStore) => {
          if (state.profile?.userType === 'enterprise') {
            return {
              profile: {
                ...state.profile,
                products: [...state.profile.products, product]
              }
            };
          }
          return state;
        }),
      updateProduct: (id, updates) =>
        set((state: ProfileStore) => {
          if (state.profile?.userType === 'enterprise') {
            return {
              profile: {
                ...state.profile,
                products: state.profile.products.map(p => 
                  p.id === id ? { ...p, ...updates } : p
                )
              }
            };
          }
          return state;
        }),
      deleteProduct: (id) =>
        set((state: ProfileStore) => {
          if (state.profile?.userType === 'enterprise') {
            return {
              profile: {
                ...state.profile,
                products: state.profile.products.filter(p => p.id !== id)
              }
            };
          }
          return state;
        })
    }),
    {
      name: 'profile-storage'
    }
  )
);