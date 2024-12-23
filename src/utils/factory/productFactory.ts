import { Product } from '@/models/Product';
import { generateRandomId } from '../generateRandomId';

export const createProduct = (name: string, category: string): Product => {
  return {
    id: generateRandomId(),
    name,
    category,
    code: generateRandomId(),
    quantity: 1,
  };
};
