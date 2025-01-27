import axios, { AxiosError } from 'axios';
import { loadSession } from '@/store/userStore';
import { Product, Session, User } from './models/types';

// ---- list methods

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const session = loadSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Função genérica de requisição de API
async function makeApiRequest<T>(
  method: 'get' | 'post' | 'patch' | 'delete' | 'put',
  url: string,
  data?: unknown
): Promise<T> {
  try {
    const response = await api.request<T>({ method, url, data });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data?.message || 'Unknown API error occurred';
    throw new ApiError(errorMessage);
  }
  throw new Error('An unexpected error occurred');
}

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

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

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
  list: (listId: string) => Promise<Product[]>;
  patch: (id: string, input: Partial<ProductDTO>) => Promise<Product>;
  update: (id: string, input: Partial<ProductDTO>, listId: string) => Promise<Product>;
  create: (input: ProductDTO[], listId: string) => Promise<Product>;
  delete: (listId: string, id: string) => Promise<void>;
}

export class ProductAPI implements ProductAPIinterface {
  private route = '/product';

  async delete(listId: string, id: string): Promise<void> {
    await makeApiRequest<void>('delete', `list/${listId}/products/${id}`);
  }

  async list(listId: string): Promise<Product[]> {
    return makeApiRequest<Product[]>('get', `list/${listId}/products`);
  }

  async patch(id: string, input: Partial<ProductDTO>, listId?: string): Promise<Product> {
    return makeApiRequest<Product>('patch', `list/${listId}/products/${id}`, input);
  }

  async update(id: string, input: Partial<ProductDTO>, listId: string): Promise<Product> {
    return makeApiRequest<Product>('patch', `list/${listId}/products/${id}`, input);
  }

  async create(input: ProductDTO[], listId: string): Promise<Product> {
    return makeApiRequest<Product>('post', `list/${listId}/products`, input);
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
      throw new Error('Could not edit user');
    }
  }

  async changePassword(data: ChangePasswordPayload): Promise<void> {
    try {
      const { id, ...rest } = data;
      await api.patch(`${this.route}/${id}/password`, rest);
    } catch (error) {
      throw new Error('Could not change password');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.route}/${id}`);
    } catch (error) {
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

  async verifyToken(): Promise<void> {
    try {
      await api.get(`${this.route}/verify-token`);
    } catch (error) {
      throw new Error('Could not verify token');
    }
  }
}

export const userAPI = new UserAPI();
