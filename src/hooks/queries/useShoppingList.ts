import { useQuery } from '@tanstack/react-query';
import { shoppingAPI } from '@/service/api';

export const shoppingListKeys = {
  all: () => ['shoppingList'],
  list: () => [...shoppingListKeys.all(), 'list'],
};

export function useShoppingList() {
  return useQuery({
    queryKey: shoppingListKeys.list(),
    queryFn: () => shoppingAPI.list(),
    // // Habilita o cache offline
    // staleTime: Infinity,
    // cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

// <AxiosResponse, Error, ShoppingItem, MutationContext>
