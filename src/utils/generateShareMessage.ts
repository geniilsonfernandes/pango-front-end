import { List, Product } from '@/service/models/types';

export const generateShareMessage = (list: List, products: Product[]): string => {
  let message = `*${list.title}*\n\n${list.description}\n\nItens da lista:\n`;

  products.forEach((product) => {
    message += `• ${product.name} (${product.quantity} ${product?.unit || 'unit'}) - R$${product.price.toFixed(2)}\n`;
  });

  if (list.budget) {
    message += `\n*Orçamento Total:* R$${list.budget.toFixed(2)}\n`;
  }

  const url = window.location.href;
  message += `\nConfira a lista completa aqui: ${url}`;

  return message;
};
