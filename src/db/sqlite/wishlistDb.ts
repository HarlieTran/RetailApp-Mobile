import {getDbConnection} from './database';
import {WishlistItem} from '../../types/cart.types';

export const addToWishlist = async (item: WishlistItem): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction(tx => {
    tx.executeSql(
      `
        INSERT OR IGNORE INTO wishlist (
          product_id,
          product_name,
          brand,
          price,
          image_url,
          date_added
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        item.productId,
        item.productName,
        item.brand,
        item.price,
        item.imageUrl,
        new Date().toISOString(),
      ],
    );
  });
};

export const getWishlistItems = async (): Promise<WishlistItem[]> => {
  const db = await getDbConnection();
  const items: WishlistItem[] = [];

  await db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM wishlist ORDER BY date_added DESC`,
      [],
      (_, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          const row = results.rows.item(i);
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
      },
    );
  });

  return items;
};

export const isInWishlist = async (productId: string): Promise<boolean> => {
  const db = await getDbConnection();
  let exists = false;

  await db.transaction(tx => {
    tx.executeSql(
      `SELECT id FROM wishlist WHERE product_id = ?`,
      [productId],
      (_, results) => {
        exists = results.rows.length > 0;
      },
    );
  });

  return exists;
};

export const removeFromWishlist = async (
  productId: string,
): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction(tx => {
    tx.executeSql(`DELETE FROM wishlist WHERE product_id = ?`, [productId]);
  });
};

export const toggleWishlist = async (
  item: WishlistItem,
): Promise<boolean> => {
  const exists = await isInWishlist(item.productId);

  if (exists) {
    await removeFromWishlist(item.productId);
    return false;
  }

  await addToWishlist(item);
  return true;
};
