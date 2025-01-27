import { useEffect, useState } from 'react';
import { userAPI } from '@/service/api';
import useModalStore from '@/store/modalStore';
import useUserStore from '@/store/userStore';

export const useVerifyAuth = () => {
  const [initialized, setInitialized] = useState(false);

  const { openModal } = useModalStore();
  const { user, logout } = useUserStore();
  useEffect(() => {
    userAPI
      ?.verifyToken()
      .then(() => {
        if (!user) {
          openModal('auth');
        }
      })
      .catch(() => {
        logout();
        openModal('welcoming');
      });
    setInitialized(true);
  }, []);

  return {
    initialized,
    hasSession: !!user,
  };
};
