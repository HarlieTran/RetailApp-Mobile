// src/types/user.types.ts
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface ShippingAddress {
  id: number;
  label: string;           // 'Home', 'Work'
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: number;       // 0 or 1, SQLite has no boolean
}

export interface PaymentMethod {
  id: number;
  type: string;            // 'E-Wallet', 'Credit Card'
  label: string;           // 'My Wallet', 'Visa ending 4242'
  isDefault: number;       // 0 or 1
}