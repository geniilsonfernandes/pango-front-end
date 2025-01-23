import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChangePasswordPayload,
  userAPI,
  type CreateAnonymousPayload,
  type CreateUserPayload,
  type EditUserPayload,
} from '../api';
import { errorMessage, successMessage } from '../helpers';

const RQKEY_ROOT = 'user';
export const RQKEY = (prefix?: string) => (prefix ? [RQKEY_ROOT, prefix] : [RQKEY_ROOT]);

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: CreateUserPayload) => userAPI.create(data),
    onError: () => errorMessage('Failed to create user'),
  });
};

export const useCreateAnonymous = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: CreateAnonymousPayload) => userAPI.createAnonymous(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: () => errorMessage('Failed to create user'),
  });
};

export const useEditUser = () => {
  return useMutation({
    mutationFn: (data: EditUserPayload) => userAPI.edit(data),
    onSuccess: () => {
      successMessage('User updated');
    },
    onError: () => errorMessage('Failed to edit user'),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => userAPI.changePassword(data),
    onError: () => errorMessage('Failed to change password'),
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (id: string) => userAPI.delete(id),
    onError: () => errorMessage('Failed to delete user'),
  });
};