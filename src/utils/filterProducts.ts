import { ShoppingItem } from '@/service/api';

interface FilterOptions<T> {
  items: T[];
  query: string;
  keys: (keyof T)[];
}

export const filterItems = <T>({ items, query, keys }: FilterOptions<T>): T[] => {
  if (!query.trim()) {
    return items;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return items.filter((item) =>
    keys.some((key) => {
      const value = String(item[key]).toLowerCase();
      return value.includes(normalizedQuery);
    })
  );
};

export const findProductByName = (
  products: ShoppingItem[],
  name: string
): ShoppingItem | undefined => {
  return products.find((product) => product.name === name);
};
