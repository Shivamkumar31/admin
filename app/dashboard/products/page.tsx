'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import RatingIcon from '@mui/icons-material/Star';
import { useProductStore } from '@/store/productStore';

const LIMIT = 12;

export default function ProductsPage() {
  const router = useRouter();

  const {
    products,
    categories,
    isLoading,
    error,
    pagination,
    searchResults,
    isSearching,
    selectedCategory,
    fetchProducts,
    searchProducts,
    fetchProductsByCategory,
    fetchCategories,
    clearProductsCache,
  } = useProductStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const skip = (currentPage - 1) * LIMIT;

    if (categoryFilter) {
      fetchProductsByCategory(categoryFilter, LIMIT, skip);
    } else if (!searchQuery) {
      fetchProducts(LIMIT, skip);
    }
  }, [currentPage, categoryFilter, fetchProducts, fetchProductsByCategory, searchQuery]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      setCurrentPage(1);
      setCategoryFilter('');

      if (query.trim()) {
        searchProducts(query);
      }
    },
    [searchProducts]
  );

  const handleCategoryChange = useCallback(
    (e: SelectChangeEvent) => {
      const category = e.target.value;
      setCategoryFilter(category);
      setCurrentPage(1);
      setSearchQuery('');
    },
    []
  );

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    },
    []
  );

  const handleRefresh = useCallback(() => {
    clearProductsCache();
    setCurrentPage(1);
    setSearchQuery('');
    setCategoryFilter('');
  }, [clearProductsCache]);

  const displayProducts = useMemo(() => {
    if (searchQuery && searchResults) {
      return searchResults;
    }
    return products;
  }, [products, searchResults, searchQuery]);

  const totalPages = useMemo(() => {
    const total = searchQuery && searchResults ? searchResults.length : pagination.total;
    return Math.ceil(total / LIMIT);
  }, [pagination.total, searchResults, searchQuery]);

  const isLoaded = !isLoading && !isSearching;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Products Catalog
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Total Products: <strong>{pagination.total}</strong>
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => {}}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'auto auto auto', md: '1fr auto auto' },
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          disabled={isSearching || isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={handleCategoryChange}
            label="Category"
            disabled={isLoading}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ textTransform: 'capitalize' }}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>

      {(searchQuery || categoryFilter) && (
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {searchQuery && (
            <Chip
              label={`Search: "${searchQuery}"`}
              onDelete={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
            />
          )}
          {categoryFilter && (
            <Chip
              label={`Category: ${categoryFilter}`}
              onDelete={() => {
                setCategoryFilter('');
                setCurrentPage(1);
              }}
            />
          )}
        </Box>
      )}

      {(isLoading || isSearching) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {isLoaded && displayProducts.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {displayProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  component={Link}
                  href={`/dashboard/products/${product.id}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.thumbnail || '/placeholder.jpg'}
                    alt={product.title}
                    sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                  />

                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={product.category}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                      {product.discountPercentage && (
                        <Chip
                          label={`-${product.discountPercentage.toFixed(0)}%`}
                          size="small"
                          color="error"
                        />
                      )}
                    </Box>

                    {product.rating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <RatingIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {product.rating.toFixed(1)}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ mt: 'auto' }}>
                    <Button fullWidth size="small">
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {!searchQuery && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {isLoaded && displayProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" sx={{ color: '#999', mb: 2 }}>
            {searchQuery ? 'No products found' : 'No products available'}
          </Typography>
          {(searchQuery || categoryFilter) && (
            <Button
              variant="contained"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
}