// src/db/sqlite/database.ts

import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const databaseName = 'retail_app.db';

export const getDbConnection = async () => {
    return SQLite.openDatabase({
        name: databaseName,
        location: 'default',
    });
};

export const createTables = async () => {
    const db = await getDbConnection();

    await db.transaction (tx => {
        
        // User Profile table
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS user_profile (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                phone TEXT,
                avatar_url TEXT
            );
        `);

        // Shipping Address table
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS shipping_address (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                label TEXT,
                full_name TEXT,
                address_line1 TEXT,
                address_line2 TEXT,
                city TEXT,
                province TEXT,
                postal_code TEXT,
                is_default INTEGER DEFAULT 0
            );
        `);

        // Payment Method table
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS payment_method (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT,
                label TEXT,
                is_default INTEGER DEFAULT 0
            );
        `);

        // Cart table
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS cart (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT NOT NULL,
                product_name TEXT,
                brand TEXT,
                price REAL,
                image_url TEXT,
                selected_color TEXT,
                selected_size TEXT,
                quantity INTEGER DEFAULT 1,
                date_added TEXT
            );
        `);

        // Wishlist Table
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT NOT NULL,
                product_name TEXT,
                brand TEXT,
                price REAL,
                image_url TEXT,
                date_added TEXT
            );
        `);

        // Recently Viewed Table
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS recently_viewed (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT NOT NULL,
                product_name TEXT,
                brand TEXT,
                price REAL,
                image_url TEXT,
                viewed_at TEXT
            );
        `);
    });

    // Seed default user profile if not exists
    await seedDefaultData(db);
     
    return db;
}

// Seed hardcoded user since auth is skipped
const seedDefaultData = async (db: any) => {
  await db.transaction((tx: any )=> {
    tx.executeSql(
      `INSERT OR IGNORE INTO user_profile (id, name, email, phone, avatar_url)
       VALUES (1, 'John Doe', 'john@example.com', '647-123-4567', '');`
    );

    tx.executeSql(
      `INSERT OR IGNORE INTO shipping_address 
       (id, label, full_name, address_line1, city, province, postal_code, is_default)
       VALUES (1, 'Home', 'John Doe', '123 Main St', 'Toronto', 'ON', 'M1A 1A1', 1);`
    );

    tx.executeSql(
      `INSERT OR IGNORE INTO payment_method (id, type, label, is_default)
       VALUES (1, 'E-Wallet', 'My Wallet', 1);`
    );
  });
};