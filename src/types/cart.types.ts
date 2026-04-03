// src/types/cart.types.ts
export interface CartItem {
  id: number;
  productId: string;
  productName: string;
  brand: string;
  price: number;
  imageUrl: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  dateAdded: string;
}

export interface WishlistItem {
  id: number;
  productId: string;
  productName: string;
  brand: string;
  price: number;
  imageUrl: string;
  dateAdded: string;
}