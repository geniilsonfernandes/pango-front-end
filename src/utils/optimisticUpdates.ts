import { QueryClient } from '@tanstack/react-query';
import { shoppingListKeys } from '@/hooks/queries/useShoppingList';
import { ShoppingItem } from '@/service/api';

export const addItemOptimisticUpdate = (
  queryClient: QueryClient,
  newItem: Omit<ShoppingItem, 'createdAt' | 'checked' | 'userId'>
) => {
  const previousItems = queryClient.getQueryData<ShoppingItem[]>(shoppingListKeys.list());
  if (previousItems) {
    queryClient.setQueryData(shoppingListKeys.list(), [...previousItems, newItem]);
  }
  return { previousItems };
};

export const rollbackItems = (queryClient: QueryClient, previousItems: ShoppingItem[]) => {
  queryClient.setQueryData(shoppingListKeys.list(), previousItems);
};
