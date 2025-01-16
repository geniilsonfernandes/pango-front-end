import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateListDTO, shoppingAPI } from '@/service/api';
import { errorMessage, successMessage } from '../helpers';

export const listQueryKeys = {
  list: () => ['lists'],
  getList: (id?: string) => ['list', id],
  listItems: (id?: string) => ['listItems', id],
};

export function useList() {
  return useQuery({
    queryKey: listQueryKeys.list(),
    queryFn: () => shoppingAPI.getLists(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });
}

export type CreateListInput = CreateListDTO;
export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListInput) => shoppingAPI.createList(input),
    onSuccess: () => {
      queryClient.invalidateQueries(listQueryKeys.list());
      successMessage('List created');
    },
    onError: () => {
      errorMessage('Error creating list');
    },
  });
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shoppingAPI.deleteList(id),
    onSuccess: () => {
      successMessage('List deleted');
      queryClient.invalidateQueries(listQueryKeys.list());
    },
    onError: () => {
      errorMessage('Error deleting list');
    },
  });
};

type UpdateListInput = {
  id: string;
} & CreateListInput;

export const useUpdateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateListInput) => shoppingAPI.updateList(input.id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries(listQueryKeys.list());
      queryClient.invalidateQueries(listQueryKeys.getList(data.id));
      successMessage('List updated');
    },
    onError: () => {
      errorMessage('Error updating list');
    },
  });
};
