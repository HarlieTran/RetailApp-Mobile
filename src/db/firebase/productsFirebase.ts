import {ref, get, query, orderByChild, equalTo} from 'firebase/database';
import { db } from './firebaseConfig';
import { Product } from '../../types/product.types';

// Get all products from Firebase
const getAllProducts = async (): Promise<Product[]> => {
    const productsRef = ref(db, 'products');
    const snapshot = await get(productsRef);

    if (!snapshot.exists()) {
        return [];
    }

    const productsData = snapshot.val();
    return Object.values(productsData) as Product[];
};

// Get products by category from Firebase
const getProductsByCategory = async (category: string): Promise<Product[]> => {
    const productsRef = ref(db, 'products');
    const categotyQuery = query(
        productsRef,
        orderByChild('categoryId'),
        equalTo(category)
    );

    const snapshot = await get(categotyQuery);

    if (!snapshot.exists()) {
        return [];
    }

    const productsData = snapshot.val();
    return Object.values(productsData) as Product[];
};

// Get a single product by ID from Firebase
const getProductById = async (productId: string): Promise<Product | null> => {
    const productRef = ref(db, `products/${productId}`);
    const snapshot = await get(productRef);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.val() as Product;
};

// Get featured products from Firebase
const getFeaturedProducts = async (): Promise<Product[]> => {
    const productsRef = ref(db, 'products');
    const featuredQuery = query(
        productsRef,
        orderByChild('isFeatured'),
        equalTo(true)
    );

    const snapshot = await get(featuredQuery);

    if (!snapshot.exists()) {
        return [];
    }

    const productsData = snapshot.val();
    return Object.values(productsData) as Product[];
};

export {
    getAllProducts,
    getProductsByCategory,
    getProductById,
    getFeaturedProducts
};
