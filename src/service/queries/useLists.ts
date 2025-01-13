import { useQuery } from '@tanstack/react-query';
import { shoppingAPI } from '@/service/api';

export const listQueryKeys = {
  all: () => ['lists'],
  list: () => ['lists'],
  getList: (id?: string) => ['list', id],
  listItems: (id?: string) => ['listItems', id],
};

export function useLists() {
  return useQuery({
    queryKey: listQueryKeys.list(),
    queryFn: () => shoppingAPI.getLists(),
    staleTime: 1000 * 60 * 5, // 5 minutos antes de considerar os dados como "stale"
    cacheTime: 1000 * 60 * 30, // Cache armazenado por 30 minutos
  });
}

// <AxiosResponse, Error, ShoppingItem, MutationContext>
