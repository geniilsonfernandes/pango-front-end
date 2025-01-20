import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI, ProductDTO } from '../api';
import { errorMessage, successMessage } from '../helpers';
import { Product } from '../models/types';

const RQKEY_ROOT = 'product';
export const RQKEY = (prefix: string) => [RQKEY_ROOT, prefix];

export type PatchProductInput = { id: string; data: Partial<ProductDTO> };

export const usePatchProduct = () => {
  const queryClient = useQueryClient();
  const listId = localStorage.getItem('activeList') || '';

  return useMutation({
    mutationFn: (input: PatchProductInput) => productAPI.patch(input.id, input.data),
    onMutate: (variables) => {
      const previousItems = queryClient.getQueryData<Product[]>(RQKEY(listId));
      if (previousItems) {
        queryClient.setQueryData(
          RQKEY(listId),
          previousItems.map((item) => {
            if (item.id === variables.id) {
              return { ...item, ...variables.data };
            }
            return item;
          })
        );
      }
    },
    onError: () => {
      errorMessage('Error updating product');
    },
  });
};

export type UpdateProductInput = { id: string; data: Partial<ProductDTO> };

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const listId = localStorage.getItem('activeList') || '';

  return useMutation({
    mutationFn: (input: UpdateProductInput) => productAPI.update(input.id, input.data),
    onMutate: (variables) => {
      const previousItems = queryClient.getQueryData<Product[]>(RQKEY(listId));
      if (previousItems) {
        queryClient.setQueryData(
          RQKEY(listId),
          previousItems.map((item) => {
            if (item.id === variables.id) {
              return { ...item, ...variables.data };
            }
            return item;
          })
        );
      }
    },
    onSuccess: (_data) => {
      successMessage('Product updated');
    },
    onError: () => {
      errorMessage('Error updating product');
    },
  });
};

export type DeleteProductInput = { id: string };

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const listId = localStorage.getItem('activeList') || '';

  return useMutation({
    mutationFn: (input: DeleteProductInput) => productAPI.delete(input.id),
    onMutate: (variables) => {
      const previousItems = queryClient.getQueryData<Product[]>(RQKEY(listId));
      if (previousItems) {
        queryClient.setQueryData(
          RQKEY(listId),
          previousItems.filter((item) => item.id !== variables.id)
        );
      }
    },
    onSuccess: (_data) => {
      successMessage('Product deleted');
    },
    onError: () => {
      errorMessage('Error deleting product');
    },
  });
};

export type AddProductInput = ProductDTO[];

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const listId = localStorage.getItem('activeList') || '';

  return useMutation({
    mutationFn: (input: AddProductInput) => productAPI.create(input),
    onMutate: (variables) => {
      const previousItems = queryClient.getQueryData<Product[]>(RQKEY(listId));
      const hasDuplicates = variables.some((item) =>
        previousItems?.some((i) => i.name === item.name)
      );
      if (hasDuplicates) {
        return;
      }
      if (previousItems) {
        queryClient.setQueryData(RQKEY(listId), [...previousItems, ...variables]);
      }
    },
    onSuccess: (_data, variables) => {
      if (variables.length > 1) {
        successMessage(`${variables.length} products added to list`);
      } else {
        successMessage(`${variables[0].name} added to list`);
      }
    },
  });
};
