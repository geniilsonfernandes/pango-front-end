import { useQuery } from '@tanstack/react-query';
import { matchSorter, rankings } from 'match-sorter';
import { products, type Product as ProductType } from '@/dummyData';

export const productsKeys = {
  all: () => ['productsKeys'],
  list: () => [...productsKeys.all(), 'list'],
  search: (query: string) => [...productsKeys.list(), 'search', query],
  recent: () => [...productsKeys.list(), 'recent'],
};

export type Product = ProductType;

const searchProducts = (query: string) => {
  if (query) {
    return matchSorter<Product>(products || [], query, {
      keys: ['name'],
      threshold: rankings.ACRONYM,
    });
  }

  return products;
};

export function useProductsCatalog(queryValue: string) {
  return useQuery({
    queryKey: ['products', 'list', queryValue ?? 'all'],
    queryFn: () => searchProducts(queryValue),
  });
}
