import { useEffect, useState } from 'react';
import { ProductDTO } from '@/service/api';

export const useRecentsProducts = () => {
  const [recents, setRecents] = useState<ProductDTO[]>(
    JSON.parse(localStorage.getItem('pango-recents') || '[]')
  );

  const addToRecents = (product: ProductDTO) => {
    setRecents((prevRecents) => {
      const existingItem = prevRecents.find((item) => item.name === product.name);
      if (existingItem) {
        return prevRecents;
      }
      return [...prevRecents, product];
    });
  };

  const removeFromRecents = (product: ProductDTO) => {
    setRecents((prevRecents) => prevRecents.filter((item) => item.name !== product.name));
  };

  useEffect(() => {
    const stringifiedRecents = JSON.stringify(recents);
    localStorage.setItem('pango-recents', stringifiedRecents);
  }, [recents]);

  return { recents, addToRecents, removeFromRecents };
};
