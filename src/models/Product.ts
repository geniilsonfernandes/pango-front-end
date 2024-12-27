// Definindo o tipo para o produto
export interface Product {
  checked?: boolean;
  id: string | number;
  quantity: number;
  unit?: string;
  price?: number;
  name: string;
  category: string;
  code?: string;
}
