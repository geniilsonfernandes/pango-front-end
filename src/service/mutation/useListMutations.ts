import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { CreateListDTO, shoppingAPI } from '@/service/api';
import { listKeys } from '../queries/useLists';

export type CreateListInput = CreateListDTO;
type useHookProps = {
  onSuccess?: () => void;
};

export const useCreateList = ({ onSuccess }: useHookProps = {}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListInput) => shoppingAPI.createList(input),

    // onMutate: async (input) => addItemOptimisticUpdate(queryClient, input),
    // onError: (_error, _input, context) => rollbackItems(queryClient, context?.previousItems || []),
    onSuccess: (data) => {
      onSuccess?.();
      queryClient.invalidateQueries(listKeys.list());
      notifications.show({
        title: 'Success',
        message: 'List created',
        color: 'green',
      });
      navigate(`/shopping-lists/${data.id}`);
    },
  });
};

export const useDeleteList = ({ onSuccess }: useHookProps = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shoppingAPI.deleteList(id),
    onSuccess: () => {
      onSuccess?.();
      notifications.show({
        title: 'Success',
        message: 'List deleted',
        color: 'green',
      });
      queryClient.invalidateQueries(listKeys.list());
    },
  });
};

type UpdateListInput = {
  id: string;
} & CreateListInput;

export const useUpdateList = ({ onSuccess }: useHookProps = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateListInput) => shoppingAPI.updateList(input.id, input),
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries(listKeys.list());
      notifications.show({
        title: 'Success',
        message: 'List updated',
        color: 'green',
      });
    },
  });
};
