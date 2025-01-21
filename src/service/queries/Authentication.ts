import { useMutation } from '@tanstack/react-query';
import { userAPI } from '../api';

const RQKEY_ROOT = 'authentication';
export const RQKEY = (prefix?: string) => (prefix ? [RQKEY_ROOT, prefix] : [RQKEY_ROOT]);

export const useAuthenticate = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => userAPI.authenticate(data),
  });
};
