import { Product } from '@/service/models/types';

export const categorizeProducts = (items: Product[]) => {
  if (!items?.length) {
    return {
      unchecked: [],
      checked: [],
    };
  }
  return items.reduce(
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
};
