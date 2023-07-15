import { create } from 'zustand';

export const useRecurringEventsStore = create((set) => ({
  recurringEvents: {},
  setRecurringEvents: (recurringEvents) =>
    set((state) => ({ recurringEvents: recurringEvents })),
}));
