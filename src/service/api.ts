import axios from 'axios';
import { List, Product } from './models/types';


// ------

export type ShoppingItem = {
  id: string;
  listId?: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  price?: number;
  checked?: boolean;
  createdAt?: string;
};

export type CreateShoppingItemDTO = Omit<ShoppingItem, 'createdAt' | 'checked' | 'userId'>;

class ShoppingListAPI {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // List all items
  async list(listId?: string): Promise<ShoppingItem[]> {
    const response = await axios.get(`${this.baseURL}/shoppingList`);
    if (listId) {
      return response.data.filter((item: ShoppingItem) => item.listId === listId);
    }
    return response.data;
  }

  // Create or update an item (increment quantity if it already exists)
  async create(data: CreateShoppingItemDTO): Promise<ShoppingItem> {
    const response = await axios.post(`${this.baseURL}/shoppingList`, {
      ...data,
      quantity: data.quantity || 1,
      checked: false,
      createdAt: new Date().toISOString(),
    });

    return response.data;
  }

  async createMany(data: CreateShoppingItemDTO[]): Promise<ShoppingItem[]> {
    data.forEach((item) => {
      this.create(item);
    });

    return data;
  }

  async update(id: string | number, updatedItem: Partial<ShoppingItem>): Promise<void> {
    try {
      const response = await axios.patch(`${this.baseURL}/shoppingList/${id}`, {
        ...updatedItem,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to update item: ${error}`);
    }
  }

  async incrementQuantity(id: string | number): Promise<void> {
    const existingItems = await this.list();
    const existingItem = existingItems.find((i) => i.name === id);

    if (!existingItem) {
      throw new Error(`Item with ID ${id} not found`);
    }

    const updatedItem = {
      ...existingItem,
      quantity: (existingItem.quantity || 1) + 1,
    };

    return this.update(existingItem.id, updatedItem);
  }

  async decrementQuantity(id: string | number): Promise<void> {
    const existingItems = await this.list();
    const existingItem = existingItems.find((i) => i.name === id);

    if (!existingItem) {
      throw new Error(`Item with ID ${id} not found`);
    }

    const updatedItem = {
      ...existingItem,
      quantity: (existingItem.quantity || 1) - 1,
    };

    return this.update(existingItem.id, updatedItem);
  }

  // Mark an item as checked/unchecked
  async toggleCheck(id: string, checked: boolean): Promise<ShoppingItem> {
    const response = await axios.patch(`${this.baseURL}/shoppingList/${id}`, { checked });
    return response.data;
  }

  // Delete an item by ID
  async delete(id: string | number): Promise<void> {
    await axios.delete(`${this.baseURL}/shoppingList/${id}`);
  }

  async getList(id?: string): Promise<ListDTO> {
    if (!id) {
      throw new Error('List ID is required');
    }
    const items = await this.list(id);
    const list = await axios.get(`${this.baseURL}/lists/${id}`);

    return {
      ...list.data,
      items,
    };
  }

  async getlistItems(listId?: string): Promise<ShoppingItem[]> {
    if (!listId) {
      throw new Error('List ID is required');
    }
    const response = await axios.get(`${this.baseURL}/shoppingList`, { params: { listId } });

    return response.data.filter((item: ShoppingItem) => item.listId === listId);
  }

  async getLists(): Promise<List[]> {
    const response = await axios.get<List[]>(`${this.baseURL}/list`);

    return response.data;
  }

  async createList(data: CreateListDTO): Promise<ListDTO> {
    const response = await axios.post<ListDTO>(`${this.baseURL}/list`, data);
    const list = response.data;
    list.items = [];
    return response.data;
  }

  async updateList(id: string, data: CreateListDTO): Promise<ListDTO> {
    const response = await axios.put(`${this.baseURL}/list/${id}`, data);

    const list = response.data;
    list.items = [];

    return response.data;
  }

  async deleteList(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/list/${id}`);
  }
}

// ---- list methods

export type ListDTO = {
  id: string;
  name: string;
  budget?: number;
  date?: string;
  description?: string;
  items?: ShoppingItem[];
};

export type CreateListDTO = {
  title: string;
  budget?: number;
  date?: string;
  description?: string;
};
class ListAPI {
  private baseURL: string;

  private routes = 'list';

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async create(data: CreateListDTO): Promise<ListDTO> {
    const response = await axios.post<ListDTO>(`${this.baseURL}/${this.routes}`, data);
    return response.data;
  }

  async update(id: string, data: CreateListDTO): Promise<ListDTO> {
    const response = await axios.put<ListDTO>(`${this.baseURL}/${this.routes}/${id}`, data);
    return response.data;
  }

  async get(id?: string): Promise<List> {
    const response = await axios.get<List>(`${this.baseURL}/${this.routes}/${id}`);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/${this.routes}/${id}`);
  }

  async list(): Promise<List[]> {
    const response = await axios.get<List[]>(`${this.baseURL}/${this.routes}`);
    return response.data;
  }
}

export const shoppingAPI = new ShoppingListAPI('http://localhost:3000');

export const listAPI = new ListAPI('http://localhost:3000');

// products methods
export type ProductDTO = {
  list_id: string;
  checked: boolean;
  name: string;
  quantity: number;
  price: number;
  category: string;
};

export interface ProductAPIinterface {
  list: (listId?: string) => Promise<Product[]>;
  patch: (id: string, input: Partial<ProductDTO>) => Promise<Product>;
  update: (id: string, input: Partial<ProductDTO>) => Promise<Product>;
  create: (input: ProductDTO[]) => Promise<Product>;
  delete: (id: string) => Promise<void>;
}
export class ProductAPI implements ProductAPIinterface {
  private baseURL: string;
  private route = 'product';

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/${this.route}/${id}`);
  }

  async list(listId?: string): Promise<Product[]> {
    const response = await axios.get<Product[]>(`${this.baseURL}/${this.route}`, {
      params: { list_id: listId },
    });
    return response.data;
  }

  async patch(id: string, input: Partial<ProductDTO>): Promise<Product> {
    const response = await axios.patch<Product>(`${this.baseURL}/${this.route}/${id}`, {
      ...input,
    });
    return response.data;
  }
  async update(id: string, input: Partial<ProductDTO>): Promise<Product> {
    const response = await axios.patch<Product>(`${this.baseURL}/${this.route}/${id}`, {
      ...input,
    });
    return response.data;
  }

  async create(input: ProductDTO[]): Promise<Product> {
    const response = await axios.post<Product>(`${this.baseURL}/${this.route}`, input);
    return response.data;
  }
}

export const productAPI = new ProductAPI('http://localhost:3000');