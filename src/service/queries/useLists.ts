import { useQuery } from '@tanstack/react-query';
import { shoppingAPI } from '@/service/api';

export const listKeys = {
  all: () => ['list'],
  list: () => [...listKeys.all(), 'list'],
};

export function useLists() {
  return useQuery({
    queryKey: listKeys.list(),
    queryFn: () => shoppingAPI.getLists(),
    refetchOnWindowFocus: false,
  });
}

// <AxiosResponse, Error, ShoppingItem, MutationContext>
