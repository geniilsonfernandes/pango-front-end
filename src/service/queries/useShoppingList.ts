import { useQuery } from '@tanstack/react-query';
import { shoppingAPI } from '@/service/api';

export const shoppingListKeys = {
  all: () => ['items'],
  list: () => [...shoppingListKeys.all(), 'list'],
};

export function useShoppingList() {
  return useQuery({
    queryKey: shoppingListKeys.list(),
    queryFn: () => shoppingAPI.list(),
    refetchOnWindowFocus: false,
  });
}

// <AxiosResponse, Error, ShoppingItem, MutationContext>
