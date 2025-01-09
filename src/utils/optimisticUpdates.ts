import { QueryClient } from '@tanstack/react-query';
import { ShoppingItem } from '@/service/api';
import {
  AddShoppingItemInput,
  ToggleShoppingItemInput,
  UpdateShoppingItemInput,
} from '@/service/mutation';
import { productsKeys, shoppingListKeys } from '@/service/queries';


export const addItemOptimisticUpdate = (queryClient: QueryClient, input: AddShoppingItemInput) => {
  const previousItems = queryClient.getQueryData<ShoppingItem[]>(shoppingListKeys.list());
  const recentsItems = queryClient.getQueryData<ShoppingItem[]>(productsKeys.recent());
  if (recentsItems) {
    queryClient.setQueryData(productsKeys.recent(), [...recentsItems, input]);
  }
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

export const shoppingItemOptimisticUpdate = (
  queryClient: QueryClient,
  input: UpdateShoppingItemInput
) => {
  const previousItems = queryClient.getQueryData<ShoppingItem[]>(shoppingListKeys.list());
  const optimisticUpdate = previousItems?.map((item) => {
    if (item.id === input.id) {
      return {
        ...item,
        ...input,
        quantity: input.data.quantity,
      };
    }
    return item;
  });
  queryClient.setQueryData(shoppingListKeys.list(), optimisticUpdate);
  return { previousItems };
};

export const rollbackItems = (queryClient: QueryClient, previousItems: ShoppingItem[]) => {
  queryClient.setQueryData(shoppingListKeys.list(), previousItems);
};