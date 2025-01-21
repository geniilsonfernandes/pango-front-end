import axios from 'axios';
import { Session } from 'react-router-dom';
import { List, Product, User } from './models/types';

// ---- list methods

export type ListDTO = {
  id: string;
  name: string;
  budget?: number;
  date?: string;
  description?: string;
  items?: Product[];
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

  async deletePermanent(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/${this.routes}/${id}/permanent`);
  }

  async restore(id: string): Promise<void> {
    await axios.post(`${this.baseURL}/${this.routes}/${id}/restore`);
  }

  async list(q: { deleted?: boolean } = {}): Promise<List[]> {
    const response = await axios.get<List[]>(`${this.baseURL}/${this.routes}`, {
      params: { deleted: q.deleted },
    });
    return response.data;
  }
}

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

type authenticateResponse = {
  user: User;
  session: Session;
};

class UserAPI {
  private baseURL: string;
  private route = 'user';

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async create(data: { email: string; password: string }): Promise<void> {
    await axios.post(`${this.baseURL}/${this.route}`, data);
  }

  async authenticate(data: { email: string; password: string }): Promise<authenticateResponse> {
    const response = await axios.post<authenticateResponse>(`${this.baseURL}/authenticate`, data);
    return response.data;
  }
}

export const userAPI = new UserAPI('http://localhost:3000');