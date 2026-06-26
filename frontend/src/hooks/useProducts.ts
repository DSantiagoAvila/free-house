import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products.service';
import type { ProductFilters } from '../types/product.types';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getProducts(filters),
  });
}
