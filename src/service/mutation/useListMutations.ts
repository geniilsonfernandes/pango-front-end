import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { CreateListDTO, shoppingAPI } from '@/service/api';
import { listQueryKeys } from '../queries/useLists';

export type CreateListInput = CreateListDTO;
type useHookProps = {
  onSuccess?: () => void;
  queryKey?: string[];
};

const successMessage = (message: string) => {
  notifications.show({
    title: 'Success',
    message,
    color: 'green',
  });
};

const errorMessage = (message: string) => {
  notifications.show({
    title: 'Error',
    message,
    color: 'red',
  });
};

export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListInput) => shoppingAPI.createList(input),
    onSuccess: () => {
      queryClient.invalidateQueries(listQueryKeys.all());
      successMessage('List created');
    },
    onError: () => {
      errorMessage('Error creating list');
    },
  });
};

export const useDeleteList = ({ onSuccess }: useHookProps = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shoppingAPI.deleteList(id),
    onSuccess: () => {
      onSuccess?.();
      successMessage('List deleted');
      queryClient.invalidateQueries(listQueryKeys.all());
    },
    onError: () => {
      errorMessage('Error deleting list');
    },
  });
};

type UpdateListInput = {
  id: string;
} & CreateListInput;

// TODO: add optimistic update
export const useUpdateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateListInput) => shoppingAPI.updateList(input.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries(listQueryKeys.all());
      successMessage('List updated');
    },
    onError: () => {
      errorMessage('Error updating list');
    },
  });
};
