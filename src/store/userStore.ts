import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session, User } from '@/service/models/types';

type UserState = {
  isLoggedIn: boolean;
  user?: User;
  setUser: (user: User) => void;
  session?: Session;

  isAnonymous: boolean;
  login: (user: User, session: Session) => void;
  logout: () => void;
};

export const saveSession = (session: Session) => {
  localStorage.setItem('@pango-session', JSON.stringify(session));
};

export const loadSession = (): Session => {
  return JSON.parse(localStorage.getItem('@pango-session') || '{}');
};

export const clearSession = () => {
  localStorage.removeItem('@pango-session');
};

const checkAnonymous = (email: string) => email.match(/@anonymous.com$/);

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: undefined,
      setUser: (user) => set({ user }),
      session: undefined,
      isAnonymous: false,
      login: (user, session) => {
        set({
          isLoggedIn: true,
          user,
          session,
          isAnonymous: !!checkAnonymous(user.email),
        });
        saveSession(session);
      },
      logout: () => {
        set({
          isLoggedIn: false,
          user: undefined,
          session: undefined,
          isAnonymous: false,
        });
        clearSession();
      },
    }),
    {
      name: 'user-store',
    }
  )
);

export default useUserStore;
