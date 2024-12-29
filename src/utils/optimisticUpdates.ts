import { QueryClient } from '@tanstack/react-query';
import { AddShoppingItemInput } from '@/hooks/mutation/useAddShoppingItem';
import { ToggleShoppingItemInput } from '@/hooks/mutation/useToggleShoppingItem';
import { shoppingListKeys } from '@/hooks/queries/useShoppingList';
import { ShoppingItem } from '@/service/api';

export const addItemOptimisticUpdate = (queryClient: QueryClient, input: AddShoppingItemInput) => {
  const previousItems = queryClient.getQueryData<ShoppingItem[]>(shoppingListKeys.list());
  if (previousItems) {
    queryClient.setQueryData(shoppingListKeys.list(), [...previousItems, input]);
  }
  return { previousItems };
};

export const toggleShoppingItemUpdate = (
  queryClient: QueryClient,
  input: ToggleShoppingItemInput
) => {
  const previousItems = queryClient.getQueryData<ShoppingItem[]>(shoppingListKeys.list());
  const optimisticUpdate = previousItems?.map((item) => {
    if (item.id === input.id) {
      return { ...item, checked: input.checked };
    }
    return item;
  });
  queryClient.setQueryData(shoppingListKeys.list(), optimisticUpdate);
  return { previousItems };
};

export const rollbackItems = (queryClient: QueryClient, previousItems: ShoppingItem[]) => {
  queryClient.setQueryData(shoppingListKeys.list(), previousItems);
};
