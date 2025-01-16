import { useQuery } from '@tanstack/react-query';
import { matchSorter, rankings } from 'match-sorter';
import { products, type Product as ProductType } from '@/dummyData';

export const catalogQueryKeys = {
  base: () => ['catalog'],
  list: () => [...catalogQueryKeys.base(), 'list'],
  search: (query: string) => [...catalogQueryKeys.base(), query],
};

export type CatalogProduct = ProductType;

const catalogQueryFn = (query: string) => {
  if (query) {
    return matchSorter<CatalogProduct>(products || [], query, {
      keys: ['name'],
      threshold: rankings.ACRONYM,
    });
  }

  return products;
};

export function useProductsCatalog(queryValue: string) {
  return useQuery({
    queryKey: catalogQueryKeys.search(queryValue),
    queryFn: () => catalogQueryFn(queryValue),
  });
}
