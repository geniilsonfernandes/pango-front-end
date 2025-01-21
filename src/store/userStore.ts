import { Session } from 'react-router-dom';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/service/models/types';

type UserState = {
  isLoggedIn: boolean;
  user?: User;
  session?: Session;
  login: (user: User, session: Session) => void;
  logout: () => void;
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: undefined,
      login: (user, session) =>
        set({
          isLoggedIn: true,
          user,
          session,
        }),
      logout: () =>
        set({
          isLoggedIn: false,
          user: undefined,
          session: undefined,
        }),
    }),
    {
      name: 'user-store',
    }
  )
);

export default useUserStore;
