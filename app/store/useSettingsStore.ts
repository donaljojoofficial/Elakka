import { create } from 'zustand';

interface SettingsState {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark', // default theme matching Dark Forest UI
  setTheme: (theme) => set({ theme }),
}));
