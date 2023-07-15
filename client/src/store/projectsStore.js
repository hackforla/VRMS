import { create } from 'zustand';

export const useProjectsStore = create((set) => ({
  // projects: {},
  projectToEdit: {},
  // setProjects: (projects) => set((state) => ({ projects: projects })),
  setProjectToEdit: (projectToEdit) =>
    set((state) => ({ projectToEdit: projectToEdit })),
}));
