import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  addToCart,
  clearCart,
  getCartItems,
  updateCartItemQuantity,
} from '../db/sqlite/cartDb';
import {createTables} from '../db/sqlite/database';
import {getPaymentMethods} from '../db/sqlite/paymentMethodDb';
import {getShippingAddresses} from '../db/sqlite/shippingAddressDb';
import {getWishlistItems, toggleWishlist} from '../db/sqlite/wishlistDb';
import {loadCatalog, getEditorialFeaturedProducts} from '../services/catalogService';
import {CartItem, WishlistItem} from '../types/cart.types';
import {Product} from '../types/product.types';
import {PaymentMethod, ShippingAddress} from '../types/user.types';

type AddToCartPayload = {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
};

type RetailAppContextValue = {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  products: Product[];
  featuredProducts: Product[];
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  shippingAddresses: ShippingAddress[];
  paymentMethods: PaymentMethod[];
  profileName: string;
  profileEmail: string;
  cartCount: number;
  subtotal: number;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
  refreshAppData: () => Promise<void>;
  addProductToCart: (payload: AddToCartPayload) => Promise<void>;
  toggleProductWishlist: (product: Product) => Promise<void>;
  updateCartQuantity: (id: number, quantity: number) => Promise<void>;
  placeOrder: () => Promise<boolean>;
  getProductById: (productId: string) => Product | undefined;
  isProductWishlisted: (productId: string) => boolean;
};

const RetailAppContext = createContext<RetailAppContextValue | undefined>(
  undefined,
);

const defaultEmail = 'john@example.com';

export const RetailAppProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>(
    [],
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [profileName, setProfileName] = useState('John Doe');
  const [profileEmail, setProfileEmail] = useState(defaultEmail);

  const refreshLocalState = async () => {
    try {
      const [nextCartItems, nextWishlistItems, nextAddresses, nextPaymentMethods] =
        await Promise.all([
          getCartItems(),
          getWishlistItems(),
          getShippingAddresses(),
          getPaymentMethods(),
        ]);

      setCartItems(nextCartItems);
      setWishlistItems(nextWishlistItems);
      setShippingAddresses(nextAddresses);
      setPaymentMethods(nextPaymentMethods);
    } catch (error) {
      console.warn('Unable to refresh local app state.', error);
    }
  };

  const refreshAppData = async () => {
    try {
      const nextProducts = await loadCatalog();
      setProducts(nextProducts);
      setFeaturedProducts(getEditorialFeaturedProducts(nextProducts));
    } catch (error) {
      console.warn('Unable to refresh the catalog.', error);
    }

    await refreshLocalState();
  };

  useEffect(() => {
    const initialize = async () => {
      setIsBootstrapping(true);

      try {
        await createTables();
        await refreshAppData();
      } catch (error) {
        console.warn('App bootstrap failed.', error);
      } finally {
        setIsBootstrapping(false);
      }
    };

    initialize();
  }, []);

  const signIn = (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return false;
    }

    const handle = email.split('@')[0] || 'guest';
    const normalizedName = handle
      .split(/[._-]/g)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    setProfileEmail(email.trim());
    setProfileName(normalizedName || 'Retail Member');
    setIsAuthenticated(true);
    return true;
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setProfileName('John Doe');
    setProfileEmail(defaultEmail);
  };

  const addProductToCart = async ({
    product,
    quantity,
    selectedColor,
    selectedSize,
  }: AddToCartPayload) => {
    await addToCart({
      id: 0,
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      price: product.price,
      imageUrl: product.imageUrl,
      selectedColor,
      selectedSize,
      quantity,
      dateAdded: new Date().toISOString(),
    });

    await refreshLocalState();
  };

  const toggleProductWishlist = async (product: Product) => {
    const isNowWishlisted = await toggleWishlist({
      id: 0,
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      price: product.price,
      imageUrl: product.imageUrl,
      dateAdded: new Date().toISOString(),
    });

    await refreshLocalState();

    if (isNowWishlisted) {
      Alert.alert('Saved', 'The item has been added to your wishlist.');
    }
  };

  const updateCartQuantity = async (id: number, quantity: number) => {
    await updateCartItemQuantity(id, quantity);
    await refreshLocalState();
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Add an item before checking out.');
      return false;
    }

    await clearCart();
    await refreshLocalState();
    return true;
  };

  const getProductById = (productId: string) => {
    return products.find(product => product.id === productId);
  };

  const isProductWishlisted = (productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <RetailAppContext.Provider
      value={{
        isAuthenticated,
        isBootstrapping,
        products,
        featuredProducts,
        cartItems,
        wishlistItems,
        shippingAddresses,
        paymentMethods,
        profileName,
        profileEmail,
        cartCount,
        subtotal,
        signIn,
        signOut,
        refreshAppData,
        addProductToCart,
        toggleProductWishlist,
        updateCartQuantity,
        placeOrder,
        getProductById,
        isProductWishlisted,
      }}>
      {children}
    </RetailAppContext.Provider>
  );
};

export const useRetailApp = () => {
  const context = useContext(RetailAppContext);

  if (!context) {
    throw new Error('useRetailApp must be used within RetailAppProvider.');
  }

  return context;
};
