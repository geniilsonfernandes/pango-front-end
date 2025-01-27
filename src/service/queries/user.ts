import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChangePasswordPayload,
  userAPI,
  type CreateAnonymousPayload,
  type CreateUserPayload,
  type EditUserPayload,
} from '../api';
import { successMessage } from '../helpers';
import { handleQueryError } from './helpers';


const RQKEY_ROOT = 'user';
export const RQKEY = (prefix?: string) => (prefix ? [RQKEY_ROOT, prefix] : [RQKEY_ROOT]);

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: CreateUserPayload) => userAPI.create(data),
    onError: handleQueryError,
  });
};

export const useCreateAnonymous = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: CreateAnonymousPayload) => userAPI.createAnonymous(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: handleQueryError,
  });
};

export const useEditUser = () => {
  return useMutation({
    mutationFn: (data: EditUserPayload) => userAPI.edit(data),
    onSuccess: () => {
      successMessage('User updated');
    },
    onError: handleQueryError,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => userAPI.changePassword(data),
    onError: handleQueryError,
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (id: string) => userAPI.delete(id),
    onError: handleQueryError,
  });
};