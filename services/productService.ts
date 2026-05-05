// src/services/productService.ts
import apiClient from './api';

/**
 * Product Service
 * Handles all product-related API calls to DummyJSON
 * 
 * Endpoints:
 * - GET /products?limit=10&skip=0 - List products with pagination
 * - GET /products/search?q=... - Search products
 * - GET /products/category/{category} - Get products by category
 * - GET /products/categories - Get all available categories
 * - GET /products/{id} - Get single product details
 */

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  thumbnail?: string;
  images?: string[];
  weight?: number;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
  }>;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface SearchResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface CategoriesResponse {
  name: string;
  slug: string;
}

const productService = {
  /**
   * Get paginated list of products
   * @param limit - Number of products per page (default: 10)
   * @param skip - Number of products to skip (for pagination)
   */
  getProducts: async (limit: number = 10, skip: number = 0): Promise<ProductsResponse> => {
    try {
      const response = await apiClient.get<ProductsResponse>('/products', {
        params: { limit, skip },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  /**
   * Search products by title or keywords
   * @param query - Search query string
   */
  searchProducts: async (query: string): Promise<SearchResponse> => {
    try {
      const response = await apiClient.get<SearchResponse>('/products/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw new Error('Product search failed');
    }
  },

  /**
   * Get products filtered by category
   * @param category - Category name
   * @param limit - Number of products per page
   * @param skip - Number of products to skip
   */
  getProductsByCategory: async (
    category: string,
    limit: number = 10,
    skip: number = 0
  ): Promise<ProductsResponse> => {
    try {
      const response = await apiClient.get<ProductsResponse>(
        `/products/category/${category}`,
        {
          params: { limit, skip },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch products from category: ${category}`);
    }
  },

  /**
   * Get single product details
   * @param id - Product ID
   */
  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch product with ID ${id}`);
    }
  },

  /**
   * Get all available product categories
   */
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<string[]>('/products/categories');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  },
};

export default productService;
