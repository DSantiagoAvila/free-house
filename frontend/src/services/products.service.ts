import api from './api';
import type { ApiResponse, PaginatedData } from '../types/api.types';
import type { Product, ProductFilters } from '../types/product.types';

export const productsService = {
  async getProducts(filters?: ProductFilters): Promise<PaginatedData<Product>> {
    const params: Record<string, string | number> = {};
    if (filters?.category) params.category = filters.category;
    if (filters?.categoryId) params.categoryId = filters.categoryId;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.search) params.search = filters.search;
    if (filters?.gender) params.gender = filters.gender;

    const response = await api.get<ApiResponse<PaginatedData<Product>>>('/products', { params });
    return response.data.data;
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${slug}`);
    return response.data.data;
  },
};
