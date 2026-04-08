import {fallbackProducts} from '../data/fallbackCatalog';
import {getAllProducts, seedProductsIfEmpty} from '../db/firebase/productsFirebase';
import {Product} from '../types/product.types';

const menKeywords = ['men', 'shirt', 'jean', 'jacket', 'hoodie', 'shoe'];
const womenKeywords = ['women', 'dress', 'heel', 'bag', 'skirt', 'blouse'];

const fallbackImages = fallbackProducts.map(product => product.imageUrl);

// Sanitize image URL helper function
const sanitizeImage = (value?: string, fallbackIndex = 0) => {
  if (!value) {
    return fallbackImages[fallbackIndex % fallbackImages.length];
  }

  const trimmed = value.trim();

  if (trimmed.startsWith('["')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed[0]) {
        return parsed[0];
      }
    } catch (error) {
      return fallbackImages[fallbackIndex % fallbackImages.length];
    }
  }

  return trimmed;
};

// Infer category helper function
const inferCategory = (product: Product, index: number) => {
  const haystack = `${product.name} ${product.brand} ${product.categoryId}`.toLowerCase();

  if (womenKeywords.some(keyword => haystack.includes(keyword))) {
    return 'women';
  }

  if (menKeywords.some(keyword => haystack.includes(keyword))) {
    return 'men';
  }

  return index % 2 === 0 ? 'men' : 'women';
};

// Normalize product helper function
const normalizeProduct = (product: Product, index: number): Product => {
  const colors = product.colors?.filter(Boolean)?.length
    ? product.colors
    : index % 2 === 0
      ? ['White', 'Stone', 'Blue']
      : ['Cream', 'Rose', 'Black'];

  const sizes = product.sizes?.filter(Boolean)?.length
    ? product.sizes
    : ['S', 'M', 'L'];

  const normalizedImages = (product.images ?? [])
    .filter(Boolean)
    .map((image, imageIndex) => sanitizeImage(image, index + imageIndex));

  const primaryImage = sanitizeImage(
    product.imageUrl || normalizedImages[0],
    index,
  );

  return {
    ...product,
    brand: product.brand || 'Retail Edit',
    categoryId: inferCategory(product, index),
    imageUrl: primaryImage,
    images: normalizedImages.length > 0 ? normalizedImages : [primaryImage],
    colors,
    sizes,
    rating: product.rating || 4.7,
    reviewCount: product.reviewCount || 128,
    currency: product.currency || 'USD',
  };
};

// Load catalog helper function
export const loadCatalog = async (): Promise<Product[]> => {
  try {
    await seedProductsIfEmpty();
    const remoteProducts = await getAllProducts();

    if (remoteProducts.length > 0) {
      return remoteProducts.map(normalizeProduct);
    }
  } catch (error) {
    console.warn('Falling back to the local catalog.', error);
  }

  return fallbackProducts.map(normalizeProduct);
};

// Get editorial featured products helper function
export const getEditorialFeaturedProducts = (products: Product[]) => {
  const featured = products.filter(product => product.isFeatured);
  const source = featured.length > 0 ? featured : products;
  return source.slice(0, 4);
};
