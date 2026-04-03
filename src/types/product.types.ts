// src/types/product.types.ts
export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: string;       // 'men' or 'women'
  price: number;
  currency: string;
  description: string;
  imageUrl: string;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
}

export interface Category {
  id: string;
  name: string;            // 'Men', 'Women'
  imageUrl: string;
  order: number;
}

export interface DeliveryOption {
  id: string;
  name: string;            // 'FedEx Regular (3-5 days)'
  price: number;
  estimatedDays: string;
}

export interface Promotion {
  id: string;
  code: string;            // 'SAVE10'
  discountPercent: number;
  minOrderAmount: number;
  expiryDate: string;
}