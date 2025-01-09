import axios from 'axios';


export type ShoppingItem = {
  id: string;
  listId?: number;
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
  async list(): Promise<ShoppingItem[]> {
    const response = await axios.get(`${this.baseURL}/shoppingList`);
    return response.data;
  }

  // Create or update an item (increment quantity if it already exists)
  async create(data: CreateShoppingItemDTO): Promise<ShoppingItem> {
    const existingItems = await this.list();
    const existingItem = existingItems.find(
      (i) => i.name === data.name && i.category === data.category
    );

    if (existingItem) {
      return this.incrementQuantity(existingItem.id);
    }

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

  // Update an existing item
  async update(id: string | number, updatedItem: Partial<ShoppingItem>): Promise<ShoppingItem> {
    try {
      const response = await axios.patch(`${this.baseURL}/shoppingList/${id}`, {
        ...updatedItem,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to update item: ${error}`);
    }
  }

  async incrementQuantity(id: string | number): Promise<ShoppingItem> {
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

  async decrementQuantity(id: string | number): Promise<ShoppingItem> {
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

  async createList(data: CreateListDTO): Promise<ListDTO> {
    const response = await axios.post(`${this.baseURL}/lists`, data);

    return response.data;
  }

  async getLists(): Promise<ListDTO[]> {
    const response = await axios.get(`${this.baseURL}/lists`);

    return response.data;
  }

  async deleteList(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/lists/${id}`);
  }

  async updateList(id: string, data: CreateListDTO): Promise<ListDTO> {
    const response = await axios.patch(`${this.baseURL}/lists/${id}`, data);

    return response.data;
  }
}

export type CreateListDTO = {
  name: string;
  budget?: number;
  date?: string;
  description?: string;
};

export type ListDTO = {
  id: string;
  name: string;
  budget?: number;
  date?: string;
  description?: string;
  items?: ShoppingItem[];
};

// Usage example
export const shoppingAPI = new ShoppingListAPI('http://localhost:5555');

// // Example operations
// (async () => {
//   try {
//     // List all items
//     console.log('Current shopping list:', await shoppingAPI.list());

//     // Add a new item
//     const newItem = {
//       name: 'Milk',
//       category: 'Dairy',
//       quantity: 2,
//       price: 10,
//     };
//     console.log('Adding item:', await shoppingAPI.create(newItem));

//     // Increment quantity of an existing item
//     console.log('Incrementing item quantity:', await shoppingAPI.create(newItem));

//     // Mark an item as checked
//     console.log('Marking item as checked:', await shoppingAPI.toggleCheck(1, true));

//     // Delete an item
//     console.log('Deleting item with ID 1');
//     await shoppingAPI.delete(1);

//     // List updated shopping list
//     console.log('Updated shopping list:', await shoppingAPI.list());
//   } catch (error) {
//     console.error('Error:', error);
//   }
// })();