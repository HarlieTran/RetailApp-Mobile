import {Product} from '../types/product.types';
import {ShippingAddress} from '../types/user.types';

export const formatCurrency = (value: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    return `$${Math.round(value)}`;
  }
};

export const formatReviewCount = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return String(value);
};

export const formatCategoryLabel = (product: Product) => {
  return product.categoryId === 'women' ? 'Woman' : 'Men';
};

export const formatAddressPreview = (address?: ShippingAddress) => {
  if (!address) {
    return 'Add a shipping address';
  }

  return `${address.fullName}, ${address.addressLine1}, ${address.city}`;
};
