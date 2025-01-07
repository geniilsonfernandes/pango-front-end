import { useEffect, useState } from 'react';
import { ShoppingItem } from '@/service/api';

export const useRecentsProducts = () => {
  const [recents, setRecents] = useState<ShoppingItem[]>(
    JSON.parse(localStorage.getItem('pango-recents') || '[]')
  );

  const addToRecents = (product: ShoppingItem) => {
    setRecents((prevRecents) => {
      const existingItem = prevRecents.find((item) => item.name === product.name);
      if (existingItem) {
        return prevRecents;
      }
      return [...prevRecents, product];
    });
  };

  const removeFromRecents = (product: ShoppingItem) => {
    setRecents((prevRecents) => prevRecents.filter((item) => item.name !== product.name));
  };

  useEffect(() => {
    const stringifiedRecents = JSON.stringify(recents);
    localStorage.setItem('pango-recents', stringifiedRecents);
  }, [recents]);

  return { recents, addToRecents, removeFromRecents };
};
