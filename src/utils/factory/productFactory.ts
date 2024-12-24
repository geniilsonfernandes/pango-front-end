import { randomId } from '@mantine/hooks';
import { Product } from '@/models/Product';

export const createProduct = (name: string, category: string): Product => {
  return {
    id: randomId('pango'),
    name,
    category,
    code: randomId('pango'),
    quantity: 1,
  };
};