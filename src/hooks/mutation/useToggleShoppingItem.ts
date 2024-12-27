import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingAPI } from '@/service/api';
import { shoppingListKeys } from '../queries/useShoppingList';

type Input = { id: string; checked: boolean };

export const useToggleShoppingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Input) => shoppingAPI.toggleCheck(input.id, input.checked),
    onSuccess: () => queryClient.invalidateQueries(shoppingListKeys.list()),
  });
};
