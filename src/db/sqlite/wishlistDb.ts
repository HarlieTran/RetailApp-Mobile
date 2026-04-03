// src/db/sqlite/wishlistDb.ts
import { getDbConnection } from './database';
import { WishlistItem } from '../../types/cart.types';

// Add to wishlist
export const addToWishlist = async (
  item: WishlistItem
): Promise<void> => {
  const db = await getDbConnection();
  await db.transaction(tx => {
    tx.executeSql(
      `INSERT OR IGNORE INTO wishlist 
       (product_id, product_name, brand, price, image_url, date_added)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item.productId, item.productName, item.brand,
        item.price, item.imageUrl, new Date().toISOString()
      ]
    );
  });
};

// Get all wishlist items
export const getWishlistItems = async (): Promise<WishlistItem[]> => {
  const db = await getDbConnection();
  const items: WishlistItem[] = [];

  await db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM wishlist ORDER BY date_added DESC`,
      [],
      (_, result) => {
        for (let i = 0; i < result.rows.length; i++) {
          const row = result.rows.item(i);
          items.push({
            id: row.id,
            productId: row.product_id,
            productName: row.product_name,
            brand: row.brand,
            price: row.price,
            imageUrl: row.image_url,
            dateAdded: row.date_added,
          });
        }
      }
    );
  });

  return items;
};

// Check if product is in wishlist
export const isInWishlist = async (productId: string): Promise<boolean> => {
  const db = await getDbConnection();
  let exists = false;

  await db.transaction(tx => {
    tx.executeSql(
      `SELECT id FROM wishlist WHERE product_id = ?`,
      [productId],
      (_, result) => {
        exists = result.rows.length > 0;
      }
    );
  });

  return exists;
};

// Remove from wishlist
export const removeFromWishlist = async (productId: string): Promise<void> => {
  const db = await getDbConnection();
  await db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM wishlist WHERE product_id = ?`,
      [productId]
    );
  });
};

// Toggle wishlist
export const toggleWishlist = async (
  item: WishlistItem
): Promise<boolean> => {
  const inWishlist = await isInWishlist(item.productId);
  if (inWishlist) {
    await removeFromWishlist(item.productId);
    return false; // removed
  } else {
    await addToWishlist(item);
    return true; // added
  }
};