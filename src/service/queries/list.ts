import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateListDTO, listAPI, productAPI, ProductDTO, shoppingAPI } from '@/service/api';
import { errorMessage, successMessage } from '../helpers';
import { List, Product } from '../models/types';

export const listQueryKeys = {
  list: () => ['lists'],
  getList: (id?: string) => ['list', id],
  listItems: (id?: string) => ['listItems', id],
};

const CACHE_TIME = 1000 * 60 * 30;
const STALE_TIME = 1000 * 60 * 5;
const REFRESH_INTERVAL = {
  MIN: 15000,
  MAX: 30000,
  INFINITE: Infinity,
};

export function useList() {
  return useQuery({
    queryKey: listQueryKeys.list(),
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
    mutationFn: (id: string) => listAPI.delete(id),
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

/// products and list query

export const useListItems = (listId?: string) => {
  const queryClient = useQueryClient();
  if (listId) {
    localStorage.setItem('activeList', listId);
  }
  return useQueries({
    queries: [
      {
        queryKey: listQueryKeys.getList(listId),
        queryFn: () => listAPI.get(listId),
        staleTime: STALE_TIME,
        cacheTime: CACHE_TIME,
        enabled: !!listId,
        initialData: () => {
          const lists = queryClient.getQueryData(listQueryKeys.list()) as List[] | undefined;
          localStorage.setItem('activeList', listId || '');
          return lists?.find((item) => item.id === listId);
        },
      },
      {
        queryKey: listQueryKeys.listItems(listId),
        queryFn: () => productAPI.list(listId),
        staleTime: 0,
        cacheTime: CACHE_TIME,
        refetchInterval: REFRESH_INTERVAL.MIN,
      },
    ],
  });
};

/// -------- products of list

export type PatchProductInput = { id: string; data: Partial<ProductDTO> };

export const usePatchProduct = () => {
  const queryClient = useQueryClient();
  const listId = localStorage.getItem('activeList') || '';

  return useMutation({
    mutationFn: (input: PatchProductInput) => productAPI.patch(input.id, input.data),
    onMutate: (variables) => {
      const previousItems = queryClient.getQueryData<Product[]>(listQueryKeys.listItems(listId));
      if (previousItems) {
        queryClient.setQueryData(
          listQueryKeys.listItems(listId),
          previousItems.map((item) => {
            if (item.id === variables.id) {
              return { ...item, ...variables.data };
            }
            return item;
          })
        );
      }
    },
    onError: () => {
      errorMessage('Error updating product');
    },
  });
};

export type UpdateProductInput = { id: string; data: Partial<ProductDTO> };

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const listId = localStorage.getItem('activeList') || '';

  return useMutation({
    mutationFn: (input: UpdateProductInput) => productAPI.update(input.id, input.data),
    onMutate: (variables) => {
      const previousItems = queryClient.getQueryData<Product[]>(listQueryKeys.listItems(listId));
      if (previousItems) {
        queryClient.setQueryData(
          listQueryKeys.listItems(listId),
          previousItems.map((item) => {
            if (item.id === variables.id) {
              return { ...item, ...variables.data };
            }
            return item;
          })
        );
      }
    },
    onSuccess: (_data) => {
      successMessage('Product updated');
    },
    onError: () => {
      errorMessage('Error updating product');
    },
  });
};

export type DeleteProductInput = { id: string };

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const listId = localStorage.getItem('activeList') || '';

  return useMutation({
    mutationFn: (input: DeleteProductInput) => productAPI.delete(input.id),
    onMutate: (variables) => {
      const previousItems = queryClient.getQueryData<Product[]>(listQueryKeys.listItems(listId));
      if (previousItems) {
        queryClient.setQueryData(
          listQueryKeys.listItems(listId),
          previousItems.filter((item) => item.id !== variables.id)
        );
      }
    },
    onSuccess: (_data) => {
      successMessage('Product deleted');
    },
    onError: () => {
      errorMessage('Error deleting product');
    },
  });
};

export type AddProductInput = ProductDTO[];

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const listId = localStorage.getItem('activeList') || '';

  return useMutation({
    mutationFn: (input: AddProductInput) => productAPI.create(input),
    onMutate: (variables) => {
      const previousItems = queryClient.getQueryData<Product[]>(listQueryKeys.listItems(listId));
      const hasDuplicates = variables.some((item) =>
        previousItems?.some((i) => i.name === item.name)
      );
      if (hasDuplicates) {
        return;
      }
      if (previousItems) {
        queryClient.setQueryData(listQueryKeys.listItems(listId), [...previousItems, ...variables]);
      }
    },
    onSuccess: (_data, variables) => {
      if (variables.length > 1) {
        successMessage(`${variables.length} products added to list`);
      } else {
        successMessage(`${variables[0].name} added to list`);
      }
    },
  });
};
