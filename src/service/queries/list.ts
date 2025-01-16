import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateListDTO, CreateShoppingItemDTO, ListDTO, shoppingAPI } from '@/service/api';
import { errorMessage, successMessage } from '../helpers';

export const listQueryKeys = {
  list: () => ['lists'],
  getList: (id?: string) => ['list', id],
  listItems: (id?: string) => ['listItems', id],
};

const CACHE_TIME = 1000 * 60 * 30;
const STALE_TIME = 1000 * 60 * 5;

export function useList() {
  return useQuery({
    queryKey: listQueryKeys.list(),
    queryFn: () => shoppingAPI.getLists(),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
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

/// products of list

export const useListItems = (listId?: string) => {
  const queryClient = useQueryClient();

  return useQueries({
    queries: [
      {
        queryKey: listQueryKeys.getList(listId),
        queryFn: () => shoppingAPI.getList(listId),
        staleTime: STALE_TIME,
        cacheTime: CACHE_TIME,
        initialData: () => {
          const shoppingList = queryClient.getQueryData(listQueryKeys.list()) as
            | ListDTO[]
            | undefined;

          return shoppingList?.find((item) => item.id === listId);
        },
      },
      {
        queryKey: listQueryKeys.listItems(listId),
        queryFn: () => shoppingAPI.getlistItems(listId),
      },
    ],
  });
};

export type ToggleCheckListProductInput = { id: string; checked: boolean };

export const useCheckListProduct = (listId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ToggleCheckListProductInput) =>
      shoppingAPI.toggleCheck(input.id, input.checked),
    onSuccess: () => queryClient.invalidateQueries(listQueryKeys.listItems(listId)),
    onError: () => {
      errorMessage('Error updating product');
    },
  });
};

export type UpdateProductInput = { id: string; data: Partial<CreateShoppingItemDTO> };

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProductInput) => shoppingAPI.update(input.id, input.data),
    onSuccess: (_data, variables) => {
      successMessage('Product updated');
      const listId = variables.data.listId;
      queryClient.invalidateQueries(listQueryKeys.listItems(listId));
    },
    onError: () => {
      errorMessage('Error updating product');
    },
  });
};

export type DeleteProductInput = { id: string; listId: string };

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteProductInput) => shoppingAPI.delete(input.id),
    onSuccess: (_data, variables) => {
      successMessage('Product deleted');
      const listId = variables.listId;
      queryClient.invalidateQueries(listQueryKeys.listItems(listId));
    },
    onError: () => {
      errorMessage('Error deleting product');
    },
  });
};

export type AddProductInput = CreateShoppingItemDTO;

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddProductInput) => shoppingAPI.create(input),
    onSuccess: (_data, variables) => {
      const listId = variables.listId;
      queryClient.invalidateQueries(listQueryKeys.listItems(listId));
      successMessage(`${variables.name} added to list`);
    },
  });
};
