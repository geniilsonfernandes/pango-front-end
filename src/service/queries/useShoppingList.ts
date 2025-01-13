import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { shoppingAPI } from '@/service/api';

export const shoppingListKeys = {
  all: () => ['list'],
  list: () => [...shoppingListKeys.all(), 'list'],
  getList: (id?: string) => [...shoppingListKeys.all(), id],
};

export const listItemsQuery = (id?: string): UseQueryOptions => {
  return {
    queryKey: shoppingListKeys.getList(id),
    queryFn: () => shoppingAPI.getList(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  };
};

export function useListItems(id?: string) {
  return useQuery({
    queryKey: shoppingListKeys.all(),
    queryFn: () => shoppingAPI.list(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}

export function useShoppingList(id?: string) {
  return useQuery({
    queryKey: shoppingListKeys.getList(id), // Apenas gera a queryKey se o id for válido
    queryFn: () => shoppingAPI.getList(id as string), // Assegura que o id é válido na query
    refetchOnWindowFocus: false,
    enabled: !!id, // Só executa a query se o id for definido
  });
}

// <AxiosResponse, Error, ShoppingItem, MutationContext>
