import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateShoppingItem, shoppingAPI } from '@/service/api';
import { shoppingListKeys } from '../queries/useShoppingList';

type Input = { id: string; data: Partial<CreateShoppingItem> };

export const useUpdateShoppingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Input) => shoppingAPI.update(input.id, input.data),
    onSuccess: () => queryClient.invalidateQueries(shoppingListKeys.list()),
  });
};
