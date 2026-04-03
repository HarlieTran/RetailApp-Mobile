# Src Overview

This folder contains the app data layer, shared types, and future UI modules.

## Current Data Flow

```text
Platzi API -> src/api/retailApi.ts -> Firebase Realtime Database -> UI screens
                                            |
                                            -> SQLite local data for user actions
```

## Folder Structure

- `api/`
  - External REST API calls and response mapping.
- `db/firebase/`
  - Remote database configuration, product sync, and product read helpers.
- `db/sqlite/`
  - Local database setup and CRUD helpers for app-specific user data.
- `types/`
  - Shared TypeScript interfaces for products, cart, and user-related data.

## External API

File:
- `src/api/retailApi.ts`

Main function:
- `fetchFashionProducts()`

Purpose:
- Fetches product data from the Platzi Fake Store API
- Filters to fashion-related categories
- Maps API response into the app `Product` type

## Firebase Realtime Database

Files:
- `src/db/firebase/firebaseConfig.ts`
- `src/db/firebase/productsFirebase.ts`

Current Firebase path:
- `products/{productId}`

Example structure:

```json
{
  "products": {
    "1": {
      "id": "1",
      "name": "Product name",
      "brand": "Platzi Store",
      "categoryId": "clothes",
      "price": 120,
      "currency": "USD",
      "description": "Product description",
      "imageUrl": "https://...",
      "images": ["https://..."],
      "colors": ["Default"],
      "sizes": ["S", "M", "L"],
      "rating": 4,
      "reviewCount": 0,
      "inStock": true,
      "isFeatured": true
    }
  }
}
```

Main functions in `productsFirebase.ts`:
- `syncProductsToFirebase()`
  - Fetches products from the external API and writes them to Firebase
- `seedProductsIfEmpty()`
  - Seeds Firebase only when `products` does not exist yet
- `getAllProducts()`
  - Reads all products from Firebase
- `getProductsByCategory(category)`
  - Reads products by `categoryId`
- `getProductById(productId)`
  - Reads one product
- `getFeaturedProducts()`
  - Reads products where `isFeatured === true`

## SQLite Local Database

Files:
- `src/db/sqlite/database.ts`
- `src/db/sqlite/cartDb.ts`
- `src/db/sqlite/wishlistDb.ts`
- `src/db/sqlite/shippingAddressDb.ts`
- `src/db/sqlite/paymentMethodDb.ts`

Database name:
- `retail_app.db`

Current local tables:
- `cart`
- `wishlist`
- `shipping_address`
- `payment_method`

Tables mainly used for current screens:
- `cart`
  - Stores product chosen for checkout
- `wishlist`
  - Stores liked/favorited products
- `shipping_address`
  - Stores checkout address
- `payment_method`
  - Stores checkout payment method

Main local functions:

`cartDb.ts`
- `addToCart(item)`
- `getCartItems()`
- `updateCartItemQuantity(id, quantity)`
- `removeFromCart(id)`
- `clearCart()`
- `getCartItemCount()`

`wishlistDb.ts`
- `addToWishlist(item)`
- `getWishlistItems()`
- `isInWishlist(productId)`
- `removeFromWishlist(productId)`
- `toggleWishlist(item)`

`shippingAddressDb.ts`
- `getShippingAddresses()`
- `addShippingAddress(address)`
- `updateShippingAddress(address)`
- `deleteShippingAddress(id)`

`paymentMethodDb.ts`
- `getPaymentMethods()`
- `addPaymentMethod(method)`
- `updatePaymentMethod(method)`
- `deletePaymentMethod(id)`

## Shared Types

Files:
- `src/types/product.types.ts`
- `src/types/cart.types.ts`
- `src/types/user.types.ts`

Purpose:
- Keep data models consistent across API, Firebase, SQLite, and UI code

## Current Screen Support

This data layer is prepared for these screens:
- Login / welcome screen
- Home screen
- Product detail screen
- Checkout screen

Mapping by screen:
- Home screen
  - Reads product catalog from Firebase
- Product detail screen
  - Reads product details from Firebase
  - Writes cart and wishlist data to SQLite
- Checkout screen
  - Reads cart, shipping address, and payment method from SQLite

## Recommended Usage For The Next Phase

- Use Firebase helpers for shared product catalog data
- Use SQLite helpers for user-specific local state
- Do not call the external API directly from screens
- Prefer importing from service files instead of writing SQL inside UI code

## Notes

- Firebase is currently used as the remote product database
- SQLite is currently used for local user action data
- `seedProductsIfEmpty()` is the safest startup option for loading initial product data
