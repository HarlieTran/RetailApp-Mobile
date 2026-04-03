import {Product} from '../types/product.types';

interface PlatziCategory {
  id: number;
  name: string;
  image: string;
  slug: string;
}

interface PlatziProduct {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: PlatziCategory;
  images: string[];
}

const PLATZI_PRODUCTS_URL = 'https://api.escuelajs.co/api/v1/products';

const FASHION_KEYWORDS = [
  'clothes',
  'clothing',
  'shoe',
  'shoes',
  'fashion',
  'shirt',
  't-shirt',
  'tee',
  'cap',
  'jacket',
  'hoodie',
  'dress',
  'bag',
  'watch',
  'sneaker',
];

const isFashionProduct = (item: PlatziProduct): boolean => {
  const haystack = [
    item.title,
    item.description,
    item.category?.name,
    item.category?.slug,
  ]
    .join(' ')
    .toLowerCase();

  return FASHION_KEYWORDS.some(keyword => haystack.includes(keyword));
};

const mapPlatziProductToAppProduct = (item: PlatziProduct): Product => {
  const primaryImage = item.images?.[0] ?? '';

  return {
    id: String(item.id),
    name: item.title,
    brand: 'Platzi Store',
    categoryId: item.category?.slug ?? 'fashion',
    price: item.price,
    currency: 'USD',
    description: item.description,
    imageUrl: primaryImage,
    images: item.images ?? [],
    colors: ['Default'],
    sizes: ['S', 'M', 'L'],
    rating: 4.0,
    reviewCount: 0,
    inStock: true,
    isFeatured: item.price >= 80,
  };
};

export const fetchFashionProducts = async (): Promise<Product[]> => {
  const response = await fetch(PLATZI_PRODUCTS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch products. Status: ${response.status}`);
  }

  const data: PlatziProduct[] = await response.json();

  return data
    .filter(isFashionProduct)
    .map(mapPlatziProductToAppProduct);
};
