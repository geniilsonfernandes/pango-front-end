import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingAPI } from '@/service/api';
import { listQueryKeys } from '../queries/useList';

type Input = string;

export const useDeleteShoppingItem = (listId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Input) => shoppingAPI.delete(id),
    onSuccess: () => queryClient.invalidateQueries(listQueryKeys.listItems(listId)),
  });
};
