import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../api';
import { errorMessage } from '../helpers';

const RQKEY_ROOT = 'user';
export const RQKEY = (prefix?: string) => (prefix ? [RQKEY_ROOT, prefix] : [RQKEY_ROOT]);

export const useCreateUser = () => {
  return useMutation({
    mutationKey: RQKEY(),
    mutationFn: (data: { email: string; password: string }) => userAPI.create(data),
    onError: () => errorMessage('Failed to create user'),
  });
};

export const useCreateAnonymous = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: RQKEY(),
    mutationFn: (data?: { name: string }) => userAPI.createAnonymous(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: () => errorMessage('Failed to create user'),
  });
};
