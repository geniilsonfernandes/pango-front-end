import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateListDTO, listAPI, productAPI, shoppingAPI } from '@/service/api';
import { errorMessage, successMessage } from '../helpers';
import { List } from '../models/types';
import { RQKEY as RQKEY_PRODUCT } from './product';

const RQKEY_ROOT = 'list';
export const RQKEY = (prefix?: string) => (prefix ? [RQKEY_ROOT, prefix] : [RQKEY_ROOT]);

const CACHE_TIME = 1000 * 60 * 30;
const STALE_TIME = 1000 * 60 * 5;
const REFRESH_INTERVAL = {
  MIN: 15000,
  MAX: 30000,
  INFINITE: Infinity,
};

export function useList() {
  return useQuery({
    queryKey: RQKEY(),
    queryFn: () => listAPI.list(),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
  });
}

export type CreateListInput = CreateListDTO;
export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListInput) => listAPI.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries(RQKEY());
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
    mutationFn: (id: string) => listAPI.delete(id),
    onSuccess: () => {
      successMessage('List deleted');
      queryClient.invalidateQueries(RQKEY());
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
      queryClient.invalidateQueries(RQKEY());
      queryClient.invalidateQueries(RQKEY_PRODUCT(data.id));
      successMessage('List updated');
    },
    onError: () => {
      errorMessage('Error updating list');
    },
  });
};

export const useListItems = (listId?: string) => {
  const queryClient = useQueryClient();
  if (listId) {
    localStorage.setItem('activeList', listId);
  }
  return useQueries({
    queries: [
      {
        queryKey: RQKEY(listId),
        queryFn: () => listAPI.get(listId),
        staleTime: STALE_TIME,
        cacheTime: CACHE_TIME,
        enabled: !!listId,
        initialData: () => {
          const lists = queryClient.getQueryData(RQKEY()) as List[] | undefined;
          localStorage.setItem('activeList', listId || '');
          return lists?.find((item) => item.id === listId);
        },
      },
      {
        queryKey: RQKEY_PRODUCT(listId || ''),
        queryFn: () => productAPI.list(listId),
        staleTime: 0,
        cacheTime: CACHE_TIME,
        refetchInterval: REFRESH_INTERVAL.MIN,
      },
    ],
  });
};
