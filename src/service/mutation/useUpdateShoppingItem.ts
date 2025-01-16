import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateShoppingItemDTO, shoppingAPI } from '@/service/api';
import { listQueryKeys } from '../queries/useList';

export type UpdateShoppingItemInput = { id: string; data: Partial<CreateShoppingItemDTO> };

export const useUpdateShoppingItem = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateShoppingItemInput) => shoppingAPI.update(input.id, input.data),
    // onMutate: async (input) => shoppingItemOptimisticUpdate(queryClient, input, listId),
    // onError: (_error, _input, context) => rollbackItems(queryClient, context?.previousItems || [], listId),
    onSuccess: () => queryClient.invalidateQueries(listQueryKeys.listItems(listId)),
  });
};
