import { useQuery } from '@tanstack/react-query';
import { matchSorter, rankings } from 'match-sorter';
import { products, type Product as ProductType } from '@/dummyData';

const RQKEY_ROOT = 'catalog';
export const RQKEY = (prefix?: string) => (prefix ? [RQKEY_ROOT, prefix] : [RQKEY_ROOT]);

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
    queryKey: RQKEY(queryValue),
    queryFn: () => catalogQueryFn(queryValue),
    placeholderData: [],
  });
}
