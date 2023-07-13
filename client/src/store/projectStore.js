import { create } from 'zustand';

export const useProjectStore = create((set) => ({
  project: 0,
  setProject: (proj) => set((state) => ({ project: proj})),
}));
