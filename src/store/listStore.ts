import { create } from 'zustand';
import { notifications } from '@mantine/notifications';
import { createProduct } from '@/utils/factory/productFactory';
import { Product } from '../models/Product';

interface List {
  name: string;
  products: Product[];
}

interface ListStore {
  list: List;
  recentProducts: Product[];
  favoriteProducts: Product[];
  addProduct: (name: string, category: string) => void;
  onDecrementProduct: (name: string) => void;
  onRemoveProduct: (name: string) => void;
  onCheckProduct: (name: string) => void;
  clearCheckedProducts: () => void;
}

const showNotification = (title: string, message: string, color: string) => {
  notifications.show({ title, message, color, position: 'bottom-left' });
};

const updateProductQuantity = (product: Product, change: number) => ({
  ...product,
  quantity: (product.quantity || 0) + change,
});

export const useListStore = create<ListStore>((set) => ({
  list: { name: 'lista teste', products: [] },
  recentProducts: [],
  favoriteProducts: [],
  addProduct: (name: string, category: string) => {
    const newProduct = createProduct(name, category);

    set((state) => {
      const alreadyExists = state.list.products.some((product) => product.name === name);

      if (alreadyExists) {
        showNotification(
          'Increment product',
          `${name} quantity incremented in list "${state.list.name}"`,
          'green'
        );
        return {
          list: {
            ...state.list,
            products: state.list.products.map((product) =>
              product.name === name ? updateProductQuantity(product, 1) : product
            ),
          },
        };
      }

      showNotification('Add product', `${name} added to list "${state.list.name}"`, 'green');
      state.recentProducts.push(newProduct);
      return {
        list: {
          ...state.list,
          products: [...state.list.products, newProduct],
        },
      };
    });
  },

  onDecrementProduct: (name: string) => {
    set((state) => {
      const product = state.list.products.find((p) => p.name === name);

      const productQuantity = product?.quantity || 0;

      if (product && productQuantity > 1) {
        showNotification(
          'Decrement product',
          `${name} quantity decremented in list "${state.list.name}"`,
          'yellow'
        );
        return {
          list: {
            ...state.list,
            products: state.list.products.map((product) =>
              product.name === name ? updateProductQuantity(product, -1) : product
            ),
          },
        };
      }

      if (product) {
        return {
          list: {
            ...state.list,
            products: state.list.products.filter((product) => product.name !== name),
          },
        };
      }

      return state;
    });
  },

  onRemoveProduct: (name: string) => {
    set((state) => {
      showNotification('Remove product', `${name} removed from list "${state.list.name}"`, 'red');
      return {
        list: {
          ...state.list,
          products: state.list.products.filter((product) => product.name !== name),
        },
      };
    });
  },

  onCheckProduct: (name: string) => {
    set((state) => {
      return {
        list: {
          ...state.list,
          products: state.list.products.map((product) =>
            product.name === name ? { ...product, checked: !product.checked } : product
          ),
        },
      };
    });
  },

  clearCheckedProducts: () => {
    set((state) => {
      return {
        list: {
          ...state.list,
          products: state.list.products.filter((product) => !product.checked),
        },
      };
    });
  },
}));
