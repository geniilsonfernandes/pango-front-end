import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateShoppingItemDTO, shoppingAPI } from '@/service/api';
import { listQueryKeys } from '../queries/useLists';

export type AddShoppingItemInput = CreateShoppingItemDTO;

export const useAddShoppingItem = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddShoppingItemInput) => shoppingAPI.create(input),
    // onMutate: async (input) => addItemOptimisticUpdate(queryClient, input),
    // onError: (_error, _input, context) => rollbackItems(queryClient, context?.previousItems || []),
    onSuccess: () => queryClient.invalidateQueries(listQueryKeys.listItems(listId)),
  });
};
