'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <Box p={3}>
      <Button onClick={() => router.back()}>⬅ Back</Button>

      {/* 🔥 IMAGE SECTION */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          mb: 3,
        }}
      >
        {product.images?.map((img: string, index: number) => (
          <img
            key={index}
            src={img}
            alt={product.title}
            style={{
              width: 200,
              height: 200,
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
        ))}
      </Box>

      {/* TEXT DATA */}
      <Typography variant="h4" sx={{ mb: 1 }}>
        {product.title}
      </Typography>

      <Typography sx={{ mb: 2 }}>
        {product.description}
      </Typography>

      <Typography>Price: ${product.price}</Typography>
      <Typography>Category: {product.category}</Typography>
      <Typography>Rating: {product.rating}</Typography>
    </Box>
  );
}