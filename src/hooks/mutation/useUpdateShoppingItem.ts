import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateShoppingItem, shoppingAPI } from '@/service/api';
import { rollbackItems, shoppingItemOptimisticUpdate } from '@/utils/optimisticUpdates';
import { shoppingListKeys } from '../queries/useShoppingList';

export type UpdateShoppingItemInput = { id: string; data: Partial<CreateShoppingItem> };

export const useUpdateShoppingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateShoppingItemInput) => shoppingAPI.update(input.id, input.data),
    onMutate: async (input) => shoppingItemOptimisticUpdate(queryClient, input),
    onError: (error, input, context) => rollbackItems(queryClient, context?.previousItems || []),
    onSuccess: () => queryClient.invalidateQueries(shoppingListKeys.list()),
    onSettled: () => {
      console.log('Item updated');
    },
  });
};
