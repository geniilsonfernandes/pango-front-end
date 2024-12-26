import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Product } from '@/models/Product';

export const api = {
  list: () => 'http://localhost:5555/shoppingList',
  edit: (id: string) => `http://localhost:5555/shoppingList/${id}`,
  add: () => 'http://localhost:5555/shoppingList',
};

export const shoppingListKeys = {
  all: () => ['shoppingList'],
  list: () => [...shoppingListKeys.all(), 'list'],
};

export function useShoppingList() {
  return useQuery({
    queryKey: shoppingListKeys.list(),
    queryFn: fetchShoppingList,
    // // Habilita o cache offline
    // staleTime: Infinity,
    // cacheTime: Infinity,
  });
}

const fetchShoppingList = async () => {
  const response = await axios.get<Product[]>(api.list());

  return response.data;
};

// <AxiosResponse, Error, ShoppingItem, MutationContext>

export const useAddItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newItem: Product) => {
      return axios.post(api.add(), newItem);
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries(shoppingListKeys.list());
      const previousList = queryClient.getQueryData(shoppingListKeys.list());

      queryClient.setQueryData(shoppingListKeys.list(), (old?: Product[]) => {
        return [...(old || []), newItem];
      });

      return { previousList };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(shoppingListKeys.list(), context?.previousList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(shoppingListKeys.list());
    },
  });
};
