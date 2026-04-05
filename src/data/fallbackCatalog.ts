import {Product} from '../types/product.types';

export const fallbackProducts: Product[] = [
  {
    id: 'fallback-1',
    name: 'Ripped Jeans - Hopped Bean London Limited Edition',
    brand: 'Hopped Bean London',
    categoryId: 'men',
    price: 500,
    currency: 'USD',
    description:
      'A washed denim statement with a relaxed cut and soft lining, designed for casual styling that still feels refined.',
    imageUrl:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: ['White', 'Blue', 'Red'],
    sizes: ['36', '38', '39', '40', '41'],
    rating: 4.9,
    reviewCount: 400,
    inStock: true,
    isFeatured: true,
  },
  {
    id: 'fallback-2',
    name: 'Structured Wool Coat',
    brand: 'North Arc',
    categoryId: 'women',
    price: 240,
    currency: 'USD',
    description:
      'Tailored outerwear with a clean silhouette, oversized collar, and warm interior for a polished winter wardrobe.',
    imageUrl:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: ['Cream', 'Camel', 'Black'],
    sizes: ['S', 'M', 'L'],
    rating: 4.7,
    reviewCount: 184,
    inStock: true,
    isFeatured: true,
  },
  {
    id: 'fallback-3',
    name: 'Textured Knit Polo',
    brand: 'Studio Common',
    categoryId: 'men',
    price: 120,
    currency: 'USD',
    description:
      'A breathable knit polo with subtle texture and a modern relaxed fit for smart casual dressing.',
    imageUrl:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: ['Sand', 'Navy', 'Olive'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviewCount: 94,
    inStock: true,
    isFeatured: false,
  },
  {
    id: 'fallback-4',
    name: 'Leather Mini Crossbody',
    brand: 'Muse Edit',
    categoryId: 'women',
    price: 180,
    currency: 'USD',
    description:
      'Compact everyday bag with polished hardware and a detachable strap for day to evening transitions.',
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: ['Ivory', 'Tan', 'Black'],
    sizes: ['One Size'],
    rating: 4.8,
    reviewCount: 132,
    inStock: true,
    isFeatured: true,
  },
  {
    id: 'fallback-5',
    name: 'Cloud Runner Sneakers',
    brand: 'Aero Line',
    categoryId: 'men',
    price: 155,
    currency: 'USD',
    description:
      'Lightweight trainers with plush cushioning, flexible support, and a clean fashion-forward profile.',
    imageUrl:
      'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: ['White', 'Stone', 'Graphite'],
    sizes: ['40', '41', '42', '43'],
    rating: 4.5,
    reviewCount: 210,
    inStock: true,
    isFeatured: false,
  },
  {
    id: 'fallback-6',
    name: 'Pleated Satin Dress',
    brand: 'Etoile',
    categoryId: 'women',
    price: 215,
    currency: 'USD',
    description:
      'A draped satin dress with elegant movement, slim straps, and a soft sheen for evening styling.',
    imageUrl:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: ['Rose', 'Sage', 'Gold'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.9,
    reviewCount: 76,
    inStock: true,
    isFeatured: true,
  },
];
