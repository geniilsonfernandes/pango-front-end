import axios from 'axios';
import { loadSession } from '@/store/userStore';
import { List, Product, Session, User } from './models/types';

// ---- list methods

const api = axios.create({
  baseURL: 'http://localhost:3000', // Altere para sua API.
});

api.interceptors.request.use((config) => {
  const session = loadSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

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
  private route = '/list';

  async create(data: CreateListDTO): Promise<ListDTO> {
    const response = await api.post<ListDTO>(this.route, data);
    return response.data;
  }

  async update(id: string, data: CreateListDTO): Promise<ListDTO> {
    const response = await api.put<ListDTO>(`${this.route}/${id}`, data);
    return response.data;
  }

  async get(id?: string): Promise<List> {
    const response = await api.get<List>(`${this.route}/${id}`);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.route}/${id}`);
  }

  async deletePermanent(id: string): Promise<void> {
    await api.delete(`${this.route}/${id}/permanent`);
  }

  async restore(id: string): Promise<void> {
    await api.post(`${this.route}/${id}/restore`);
  }

  async list(q: { deleted?: boolean } = {}): Promise<List[]> {
    const response = await api.get<List[]>(this.route, {
      params: { deleted: q.deleted },
    });
    return response.data;
  }
}

export const listAPI = new ListAPI();

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
  private route = '/product';

  async delete(id: string): Promise<void> {
    await api.delete(`${this.route}/${id}`);
  }

  async list(listId?: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`${this.route}`, {
      params: { list_id: listId },
    });
    return response.data;
  }

  async patch(id: string, input: Partial<ProductDTO>): Promise<Product> {
    const response = await api.patch<Product>(`${this.route}/${id}`, {
      ...input,
    });
    return response.data;
  }
  async update(id: string, input: Partial<ProductDTO>): Promise<Product> {
    const response = await api.patch<Product>(`${this.route}/${id}`, {
      ...input,
    });
    return response.data;
  }

  async create(input: ProductDTO[]): Promise<Product> {
    const response = await api.post<Product>(`${this.route}`, input);
    return response.data;
  }
}
export const productAPI = new ProductAPI();

// ---- user methods

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

  async createAnonymous(data?: { name: string }): Promise<authenticateResponse> {
    const response = await axios.post<authenticateResponse>(
      `${this.baseURL}/${this.route}/anonymous`,
      data
    );
    return response.data;
  }

  async authenticate(data: { email: string; password: string }): Promise<authenticateResponse> {
    const response = await axios.post<authenticateResponse>(`${this.baseURL}/authenticate`, data);
    return response.data;
  }
}

export const userAPI = new UserAPI('http://localhost:3000');
