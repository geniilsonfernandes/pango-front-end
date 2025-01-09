import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingAPI } from '@/service/api';
import { toggleShoppingItemUpdate } from '@/utils/optimisticUpdates';
import { shoppingListKeys } from '../queries/useShoppingList';

export type ToggleShoppingItemInput = { id: string; checked: boolean };

export const useToggleShoppingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ToggleShoppingItemInput) =>
      shoppingAPI.toggleCheck(input.id, input.checked),
    onMutate: async (input) => toggleShoppingItemUpdate(queryClient, input),
    onSuccess: () => queryClient.invalidateQueries(shoppingListKeys.list()),
  });
};
