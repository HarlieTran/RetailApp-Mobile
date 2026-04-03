import {getDbConnection} from './database';
import {CartItem} from '../../types/cart.types';

// Add a product to cart. If the same product/color/size already exists,
// increase its quantity instead of inserting a duplicate row.
export const addToCart = async (item: CartItem): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction(tx => {
    tx.executeSql(
      `
        SELECT id, quantity
        FROM cart
        WHERE product_id = ? AND selected_size = ? AND selected_color = ?
      `,
      [item.productId, item.selectedSize, item.selectedColor],
      (_, results) => {
        if (results.rows.length > 0) {
          const existingItem = results.rows.item(0);
          const newQuantity = existingItem.quantity + item.quantity;

          tx.executeSql(`UPDATE cart SET quantity = ? WHERE id = ?`, [
            newQuantity,
            existingItem.id,
          ]);
        } else {
          tx.executeSql(
            `
              INSERT INTO cart (
                product_id,
                product_name,
                brand,
                price,
                image_url,
                selected_color,
                selected_size,
                quantity,
                date_added
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              item.productId,
              item.productName,
              item.brand,
              item.price,
              item.imageUrl,
              item.selectedColor,
              item.selectedSize,
              item.quantity,
              new Date().toISOString(),
            ],
          );
        }
      },
    );
  });
};

export const getCartItems = async (): Promise<CartItem[]> => {
  const db = await getDbConnection();
  const cartItems: CartItem[] = [];

  await db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM cart ORDER BY date_added DESC`,
      [],
      (_, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          const row = results.rows.item(i);
          cartItems.push({
            id: row.id,
            productId: row.product_id,
            productName: row.product_name,
            brand: row.brand,
            price: row.price,
            imageUrl: row.image_url,
            selectedColor: row.selected_color,
            selectedSize: row.selected_size,
            quantity: row.quantity,
            dateAdded: row.date_added,
          });
        }
      },
    );
  });

  return cartItems;
};

export const updateCartItemQuantity = async (
  id: number,
  quantity: number,
): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction(tx => {
    if (quantity <= 0) {
      tx.executeSql(`DELETE FROM cart WHERE id = ?`, [id]);
    } else {
      tx.executeSql(`UPDATE cart SET quantity = ? WHERE id = ?`, [quantity, id]);
    }
  });
};

export const removeFromCart = async (id: number): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction(tx => {
    tx.executeSql(`DELETE FROM cart WHERE id = ?`, [id]);
  });
};

export const clearCart = async (): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction(tx => {
    tx.executeSql(`DELETE FROM cart`);
  });
};

export const getCartItemCount = async (): Promise<number> => {
  const db = await getDbConnection();
  let itemCount = 0;

  await db.transaction(tx => {
    tx.executeSql(
      `SELECT SUM(quantity) AS count FROM cart`,
      [],
      (_, results) => {
        itemCount = results.rows.item(0).count || 0;
      },
    );
  });

  return itemCount;
};
