// src/db/sqlite/cartDb.ts

import {getDbConnection} from './database';
import {CartItem} from '../../types/cart.types';

// Add a new item to the cart

export const addToCart = async (item: CartItem): Promise<void> => {
    const db = await getDbConnection();

    // Check if same product with same size and color already exists
    await db.transaction ( tx => {
        tx.executeSql(`
            SELECT id FROM cart WHERE productId = ? AND selected_size = ? AND selected_color
        `, [item.productId, item.selectedSize, item.selectedColor], (tx, results) => {
                if (results.rows.length > 0) {
                    // If item exists, update quantity
                    const existingItem = results.rows.item(0);
                    tx.executeSql(
                        `UPDATE cart SET quantity = quantity + ? WHERE id = ?`,
                        [existingItem.quantity + item.quantity, existingItem.id]
            );
        } else {
            // If item does not exist, insert new record
            tx.executeSql(
                `INSERT INTO cart (product_id, product_name, brand, price, image_url, selected_color, selected_size, quantity, date_added) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [item.productId, item.productName, item.brand, item.price, item.imageUrl, item.selectedColor, item.selectedSize, item.quantity, new Date().toISOString()]
          );
        }
      }
    );
  });
};

// Get all items in the cart
export const getCartItems = async (): Promise<CartItem[]> => {
    const db = await getDbConnection();
    const cartItems: CartItem[] = [];

    await db.transaction((tx: any) => {
        tx.executeSql(
            `SELECT * FROM cart ORDER BY date_added DESC`,
            [],
            (tx: any, results: any) => {
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
                        dateAdded: row.date_added
                    });
                }
            }
        );
    });

    return cartItems;
};

// Update quantity of a cart item
export const updateCartItemQuantity = async (id: number, quantity: number): Promise<void> => {
    const db = await getDbConnection();
    await db.transaction((tx: any) => {
        tx.executeSql(
            `UPDATE cart SET quantity = ? WHERE id = ?`,
            [quantity, id]
        );
    });
};

// Remove an item from the cart
export const removeFromCart = async (id: number): Promise<void> => {
    const db = await getDbConnection();
    await db.transaction((tx: any) => {
        tx.executeSql(
            `DELETE FROM cart WHERE id = ?`,
            [id]
        );
    });
};

// Clear the entire cart
export const clearCart = async (): Promise<void> => {
    const db = await getDbConnection();
    await db.transaction((tx: any) => {
        tx.executeSql(
            `DELETE FROM cart`
        );
    });
};

// Get total count of items in the cart
export const getCartItemCount = async (): Promise<number> => {
    const db = await getDbConnection();
    let itemCount = 0;

    await db.transaction((tx: any) => {
        tx.executeSql(
            `SELECT SUM(quantity) as count FROM cart`,
            [],
            (tx: any, results: any) => {
                itemCount = results.rows.item(0).count || 0;
            }
        );
    });

    return itemCount;
};
