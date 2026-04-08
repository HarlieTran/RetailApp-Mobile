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

// Add to cart payload
type AddToCartPayload = {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
};

// Retail app context value
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
  updateProfile: (name: string, email: string) => void;
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

// Retail app provider
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

  // Refresh local state
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

  // Refresh app data
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

  // Sign in function
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

  // Sign out function
  const signOut = () => {
    setIsAuthenticated(false);
    setProfileName('John Doe');
    setProfileEmail(defaultEmail);
  };

  // Update profile function
  const updateProfile = (name: string, email: string) => {
    if (name.trim()) setProfileName(name.trim());
    if (email.trim()) setProfileEmail(email.trim());
  };

  // Add product to cart function
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

  // Toggle product wishlist function
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

  // Update cart quantity function
  const updateCartQuantity = async (id: number, quantity: number) => {
    await updateCartItemQuantity(id, quantity);
    await refreshLocalState();
  };

  // Place order function
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Add an item before checking out.');
      return false;
    }

    await clearCart();
    await refreshLocalState();
    return true;
  };

  // Get product by id function
  const getProductById = (productId: string) => {
    return products.find(product => product.id === productId);
  };

  // Check if product is wishlisted function
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
        updateProfile,
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
