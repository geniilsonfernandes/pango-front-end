import { matchSorter } from 'match-sorter';
import { Product } from '@/service/models/types';

export const categorizeProducts = (
  items: Product[]
): {
  unchecked: Product[];
  checked: Product[];
} => {
  if (!items?.length) {
    return {
      unchecked: [],
      checked: [],
    };
  }

  const reduced = items.reduce(
    (acc, cur) => {
      return {
        unchecked: acc.unchecked.concat(cur.checked ? [] : [cur]),
        checked: acc.checked.concat(cur.checked ? [cur] : []),
      };
    },
    {
      unchecked: [],
      checked: [],
    } as {
      unchecked: Product[];
      checked: Product[];
    }
  );

  return {
    unchecked: matchSorter(reduced.unchecked, '', {
      keys: ['name'],
    }),
    checked: matchSorter(reduced.checked, '', {
      keys: ['name'],
    }),
  };
};