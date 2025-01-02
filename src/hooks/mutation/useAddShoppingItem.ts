import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateShoppingItemDTO, shoppingAPI } from '@/service/api';
import { addItemOptimisticUpdate, rollbackItems } from '@/utils/optimisticUpdates';
import { shoppingListKeys } from '../queries/useShoppingList';

export type AddShoppingItemInput = CreateShoppingItemDTO;

export const useAddShoppingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddShoppingItemInput) => shoppingAPI.create(input),
    onMutate: async (input) => addItemOptimisticUpdate(queryClient, input),
    onError: (_error, _input, context) => rollbackItems(queryClient, context?.previousItems || []),
    onSuccess: () => queryClient.invalidateQueries(shoppingListKeys.list()),
  });
};
