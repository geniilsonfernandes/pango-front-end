import { ShoppingItem } from '@/service/api';

export const categorizeProducts = (items: ShoppingItem[]) => {
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
      unchecked: ShoppingItem[];
      checked: ShoppingItem[];
    }
  );
};
