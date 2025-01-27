import { api, handleApiError } from '../api';
import { List, Product } from '../models/types';

export type CreateListDTO = {
  title: string;
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
  items?: Product[];
};

export class ListHttpService {
  private route = '/list';

  async create(data: CreateListDTO): Promise<List> {
    try {
      const response = await api.post<List>(this.route, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  async update(id: string, data: CreateListDTO): Promise<List> {
    try {
      const response = await api.put(`${this.route}/${id}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  async share(id: string): Promise<List> {
    try {
      const response = await api.post(`${this.route}/${id}/share`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  async unshare(listId: string, userId: string): Promise<void> {
    try {
      await api.delete(`${this.route}/${listId}/unshare/${userId}`);
    } catch (error) {
      handleApiError(error);
    }
  }

  async get(id?: string): Promise<List> {
    try {
      const { data } = await api.get<List>(`${this.route}/${id}`);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.route}/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  }

  async deletePermanent(id: string): Promise<void> {
    try {
      await api.delete(`${this.route}/${id}/permanent`);
    } catch (error) {
      handleApiError(error);
    }
  }

  async restore(id: string): Promise<void> {
    try {
      await api.get(`${this.route}/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  }

  async list(q: { deleted?: boolean } = {}): Promise<List[]> {
    try {
      const response = await api.get<List[]>(this.route, {
        params: { deleted: q.deleted },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
