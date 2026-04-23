import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,

  setSession: (session) => {
    set({ session, user: session?.user ?? null, isLoading: false });
  },

  checkSession: async () => {
    console.log('AUTH: checkSession starting...');
    set({ isLoading: true });
    try {
      console.log('AUTH: Fetching session from Supabase...');
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('AUTH: getSession error:', error);
      }
      const session = data?.session;
      console.log('AUTH: getSession success, session exists:', !!session);
      set({ session, user: session?.user ?? null, isLoading: false });
    } catch (error) {
      console.error('AUTH: checkSession unexpected error:', error);
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));


