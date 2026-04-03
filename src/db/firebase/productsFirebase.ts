import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  set,
} from 'firebase/database';
import {db} from './firebaseConfig';
import {Product} from '../../types/product.types';
import {fetchFashionProducts} from '../../api/retailApi';

// Sync products from Platzi API into Firebase Realtime Database
export const syncProductsToFirebase = async (): Promise<number> => {
  const products = await fetchFashionProducts();

  const writeOperations = products.map(product =>
    set(ref(db, `products/${product.id}`), product),
  );

  await Promise.all(writeOperations);

  return products.length;
};

// Seed Firebase only if no products exist yet
export const seedProductsIfEmpty = async (): Promise<{
  seeded: boolean;
  count: number;
}> => {
  const existingProducts = await getAllProducts();

  if (existingProducts.length > 0) {
    return {
      seeded: false,
      count: existingProducts.length,
    };
  }

  const syncedCount = await syncProductsToFirebase();

  return {
    seeded: true,
    count: syncedCount,
  };
};

// Get all products from Firebase
export const getAllProducts = async (): Promise<Product[]> => {
  const productsRef = ref(db, 'products');
  const snapshot = await get(productsRef);

  if (!snapshot.exists()) {
    return [];
  }

  const productsData = snapshot.val();
  return Object.values(productsData) as Product[];
};

// Get products by category from Firebase
export const getProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  const productsRef = ref(db, 'products');
  const categoryQuery = query(
    productsRef,
    orderByChild('categoryId'),
    equalTo(category),
  );

  const snapshot = await get(categoryQuery);

  if (!snapshot.exists()) {
    return [];
  }

  const productsData = snapshot.val();
  return Object.values(productsData) as Product[];
};

// Get a single product by ID from Firebase
export const getProductById = async (
  productId: string,
): Promise<Product | null> => {
  const productRef = ref(db, `products/${productId}`);
  const snapshot = await get(productRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val() as Product;
};

// Get featured products from Firebase
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const productsRef = ref(db, 'products');
  const featuredQuery = query(
    productsRef,
    orderByChild('isFeatured'),
    equalTo(true),
  );

  const snapshot = await get(featuredQuery);

  if (!snapshot.exists()) {
    return [];
  }

  const productsData = snapshot.val();
  return Object.values(productsData) as Product[];
};
