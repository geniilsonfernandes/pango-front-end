import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateListDTO, productAPI } from '@/service/api';
import { listHttpService } from '@/service/http';
import useUserStore from '@/store/userStore';
import { errorMessage, successMessage } from '../helpers';
import { List } from '../models/types';
import { handleQueryError } from './helpers';
import { RQKEY as RQKEY_PRODUCT } from './product';

const RQKEY_ROOT = 'list';
export const RQKEY = (prefix?: string) => (prefix ? [RQKEY_ROOT, prefix] : [RQKEY_ROOT]);

const CACHE_TIME = 1000 * 60 * 30;
const STALE_TIME = 1000 * 60 * 5;
const REFRESH_INTERVAL = {
  MIN: 15000,
  MID: 30000, // 30 seconds
  MAX: 30000,
  INFINITE: Infinity,
};

export function useList(q: { deleted?: boolean; isPublic?: boolean } = {}) {
  const { user } = useUserStore();
  return useQuery({
    queryKey: RQKEY(JSON.stringify(q)),
    enabled: !!user,
    queryFn: () => listHttpService.list(q),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
  });
}

export type CreateListInput = CreateListDTO;

export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListInput) => listHttpService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries(RQKEY());
      successMessage('List created');
    },
    onError: () => {
      errorMessage('Error creating list');
    },
  });
};

type CreateListCopyInput = {
  id: string;
} & CreateListInput;

export const useCreateListCopy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListCopyInput) => listHttpService.createCopy(input.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries(RQKEY());
      successMessage('List created');
    },
    onError: () => {
      errorMessage('Error creating list');
    },
  });
};

export const useShareList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listHttpService.share(id),
    onSuccess: () => {
      queryClient.invalidateQueries(RQKEY('shared'));
    },
    onError: handleQueryError,
  });
};

export const useUnshareList = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => listHttpService.unshare(listId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries(RQKEY());
    },
    onError: handleQueryError,
  });
};

export const useDeleteList = ({ permanent }: { permanent?: boolean } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      permanent ? listHttpService.deletePermanent(id) : listHttpService.delete(id),
    onSuccess: () => {
      successMessage('List deleted');
      queryClient.invalidateQueries(RQKEY());
    },
    onError: handleQueryError,
  });
};

export const useRestoreList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listHttpService.restore(id),
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
    mutationFn: (input: UpdateListInput) => listHttpService.update(input.id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries(RQKEY());
      queryClient.invalidateQueries(RQKEY_PRODUCT(data.id));
      successMessage('List updated');
    },
    onError: handleQueryError,
  });
};

export const useListItems = (listId?: string) => {
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  if (listId) {
    localStorage.setItem('activeList', listId);
  }

  return useQueries({
    queries: [
      {
        queryKey: RQKEY(listId),
        queryFn: () => listHttpService.get(listId),
        staleTime: STALE_TIME,
        cacheTime: CACHE_TIME,
        enabled: !!listId && !!user,
        initialData: () => {
          const lists = queryClient.getQueryData(RQKEY()) as List[] | undefined;
          localStorage.setItem('activeList', listId || '');
          return lists?.find((item) => item.id === listId);
        },
        // refetchInterval: REFRESH_INTERVAL.MID,
      },
      {
        queryKey: RQKEY_PRODUCT(listId || ''),
        queryFn: () => productAPI.list(listId || ''),
        enabled: !!listId && !!user,
        staleTime: 0,
        cacheTime: CACHE_TIME,
        refetchInterval: REFRESH_INTERVAL.MIN,
      },
    ],
  });
};
