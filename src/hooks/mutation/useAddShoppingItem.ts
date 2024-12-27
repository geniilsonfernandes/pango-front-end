import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateShoppingItem, shoppingAPI } from '@/service/api';
import { addItemOptimisticUpdate, rollbackItems } from '@/utils/optimisticUpdates';
import { shoppingListKeys } from '../queries/useShoppingList';

// const addItemOptimisticUpdate

// rollbackItems;

export const useAddShoppingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newItem: CreateShoppingItem) => shoppingAPI.create(newItem),
    onMutate: async (newItem) => addItemOptimisticUpdate(queryClient, newItem),
    onError: (error, newItem, context) => rollbackItems(queryClient, context?.previousItems || []),
    onSuccess: () => queryClient.invalidateQueries(shoppingListKeys.list()),
  });
};
