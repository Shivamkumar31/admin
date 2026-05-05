// src/store/productStore.ts
import { create } from 'zustand';
import productService from '@/services/productService';

/**
 * Product Store - Manages products list, categories, and detail view
 * Implements caching strategy to reduce API calls
 * 
 * Caching Strategy:
 * - Products list cached for 5 minutes
 * - Categories cached for 1 day (rarely changes)
 * - Cache cleared on manual refresh
 */

interface Product {
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

interface PaginationMeta {
  total: number;
  limit: number;
  skip: number;
}

interface ProductState {
  // State
  products: Product[];
  currentProduct: Product | null;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  searchResults: Product[] | null;
  isSearching: boolean;
  selectedCategory: string | null;

  // Cache tracking
  lastProductsFetchTime: number;
  lastCategoriesFetchTime: number;
  productsCacheValid: boolean;
  categoriesCacheValid: boolean;

  // Actions
  fetchProducts: (limit: number, skip: number) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  fetchProductsByCategory: (category: string, limit: number, skip: number) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setError: (error: string | null) => void;
  clearProductsCache: () => void;
}

const PRODUCTS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CATEGORIES_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial State
  products: [],
  currentProduct: null,
  categories: [],
  isLoading: false,
  error: null,
  pagination: { total: 0, limit: 10, skip: 0 },
  searchResults: null,
  isSearching: false,
  selectedCategory: null,
  lastProductsFetchTime: 0,
  lastCategoriesFetchTime: 0,
  productsCacheValid: false,
  categoriesCacheValid: false,

  // Actions
  fetchProducts: async (limit: number, skip: number) => {
    const state = get();

    // Check if cache is still valid
    if (
      state.productsCacheValid &&
      Date.now() - state.lastProductsFetchTime < PRODUCTS_CACHE_DURATION &&
      state.products.length > 0
    ) {
      // Use cached data
      set({ pagination: { total: state.pagination.total, limit, skip } });
      return;
    }

    set({ isLoading: true, error: null, searchResults: null });
    try {
      const response = await productService.getProducts(limit, skip);

      set({
        products: response.products,
        pagination: {
          total: response.total,
          limit: response.limit,
          skip: response.skip,
        },
        isLoading: false,
        lastProductsFetchTime: Date.now(),
        productsCacheValid: true,
        selectedCategory: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  searchProducts: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: null, isSearching: false });
      return;
    }

    set({ isSearching: true, error: null });
    try {
      const response = await productService.searchProducts(query);
      set({
        searchResults: response.products,
        isSearching: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      set({
        isSearching: false,
        error: errorMessage,
      });
    }
  },

  fetchProductsByCategory: async (category: string, limit: number, skip: number) => {
    set({ isLoading: true, error: null, searchResults: null });
    try {
      const response = await productService.getProductsByCategory(category, limit, skip);

      set({
        products: response.products,
        pagination: {
          total: response.total,
          limit: response.limit,
          skip: response.skip,
        },
        selectedCategory: category,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  fetchProductById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.getProductById(id);
      set({
        currentProduct: product,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  fetchCategories: async () => {
    const state = get();

    // Check if categories are already cached
    if (
      state.categoriesCacheValid &&
      Date.now() - state.lastCategoriesFetchTime < CATEGORIES_CACHE_DURATION &&
      state.categories.length > 0
    ) {
      return;
    }

    try {
      const categories = await productService.getCategories();
      set({
        categories,
        lastCategoriesFetchTime: Date.now(),
        categoriesCacheValid: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      set({ error: errorMessage });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearProductsCache: () => {
    set({
      products: [],
      searchResults: null,
      lastProductsFetchTime: 0,
      productsCacheValid: false,
    });
  },
}));
