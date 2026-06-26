import api from './api';
import type { ApiResponse } from '../types/api.types';
import type { Category } from '../types/product.types';

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },

  async getCategory(slug: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/categories/${slug}`);
    return response.data.data;
  },
};
