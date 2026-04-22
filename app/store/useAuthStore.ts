import { create } from 'zustand';
import * as storage from '../utils/storage';

interface AuthState {
  isLocked: boolean;
  hasPinSet: boolean;
  checkPinSet: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
}

const PIN_KEY = 'elakka_auth_pin';

export const useAuthStore = create<AuthState>((set, get) => ({
  isLocked: true,
  hasPinSet: false,

  checkPinSet: async () => {
    const pin = await storage.getItemAsync(PIN_KEY);
    set({ hasPinSet: !!pin });
  },

  setPin: async (pin: string) => {
    await storage.setItemAsync(PIN_KEY, pin);
    set({ hasPinSet: true, isLocked: false });
  },

  unlock: async (inputPin: string) => {
    const storedPin = await storage.getItemAsync(PIN_KEY);
    if (storedPin === inputPin) {
      set({ isLocked: false });
      return true;
    }
    return false;
  },

  lock: () => set({ isLocked: true }),
}));

