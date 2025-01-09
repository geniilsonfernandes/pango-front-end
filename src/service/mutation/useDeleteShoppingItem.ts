import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingAPI } from '@/service/api';
import { shoppingListKeys } from '../queries/useShoppingList';

type Input = string;

export const useDeleteShoppingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Input) => shoppingAPI.delete(id),
    onSuccess: () => queryClient.invalidateQueries(shoppingListKeys.list()),
  });
};
