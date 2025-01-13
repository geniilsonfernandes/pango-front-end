import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingAPI } from '@/service/api';
import { listQueryKeys } from '../queries/useLists';

export type ToggleShoppingItemInput = { id: string; checked: boolean };

export const useToggleShoppingItem = (listId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ToggleShoppingItemInput) =>
      shoppingAPI.toggleCheck(input.id, input.checked),
    // onMutate: async (input) => toggleShoppingItemUpdate(queryClient, input),
    onSuccess: () => queryClient.invalidateQueries(listQueryKeys.listItems(listId)),
  });
};
