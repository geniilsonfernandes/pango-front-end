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

type AuthenticateResponse = {
  user: User;
  session: Session;
};

interface IUserAPI {
  create: (data: CreateUserPayload) => Promise<User>;
  edit: (data: EditUserPayload) => Promise<User>;
  changePassword: (data: ChangePasswordPayload) => Promise<void>;
  delete: (id: string) => Promise<void>;
  createAnonymous: (data?: CreateAnonymousPayload) => Promise<AuthenticateResponse>;
  authenticate: (data: AuthenticatePayload) => Promise<AuthenticateResponse>;
}

// Tipos para os payloads
export type CreateUserPayload = { email: string; password: string };
export type EditUserPayload = { id: string; name: string; email: string };
export type ChangePasswordPayload = { id: string; oldPassword: string; newPassword: string };
export type CreateAnonymousPayload = { name?: string };
export type AuthenticatePayload = { email: string; password: string };

class UserAPI implements IUserAPI {
  private readonly route = '/user';

  async create(data: CreateUserPayload): Promise<User> {
    try {
      const response = await api.post<User>(`${this.route}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create user', error);
      throw new Error('Could not create user');
    }
  }

  async edit(data: EditUserPayload): Promise<User> {
    try {
      const { id, ...rest } = data;
      const response = await api.put<User>(`${this.route}/${id}`, rest);
      return response.data;
    } catch (error) {
      console.error('Failed to edit user', error);
      throw new Error('Could not edit user');
    }
  }

  async changePassword(data: ChangePasswordPayload): Promise<void> {
    try {
      const { id, ...rest } = data;
      await api.patch(`${this.route}/${id}/password`, rest);
    } catch (error) {
      console.error('Failed to change user password', error);
      throw new Error('Could not change password');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.route}/${id}`);
    } catch (error) {
      console.error('Failed to delete user', error);
      throw new Error('Could not delete user');
    }
  }

  async createAnonymous(data?: CreateAnonymousPayload): Promise<AuthenticateResponse> {
    try {
      const response = await api.post<AuthenticateResponse>(`${this.route}/anonymous`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create anonymous user', error);
      throw new Error('Could not create anonymous user');
    }
  }

  async authenticate(data: AuthenticatePayload): Promise<AuthenticateResponse> {
    try {
      const response = await api.post<AuthenticateResponse>(`/authenticate`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to authenticate user', error);
      throw new Error('Could not authenticate user');
    }
  }
}

export const userAPI = new UserAPI();
