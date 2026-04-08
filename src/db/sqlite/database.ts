import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const databaseName = 'retail_app.db';

// Get database connection
export const getDbConnection = async () => {
  return SQLite.openDatabase({
    name: databaseName,
    location: 'default',
  });
};

// Create tables
export const createTables = async () => {
  const db = await getDbConnection();

  await db.transaction((tx: any) => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        avatar_url TEXT
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS shipping_address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        full_name TEXT NOT NULL,
        address_line1 TEXT NOT NULL,
        address_line2 TEXT,
        city TEXT NOT NULL,
        province TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1))
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS payment_method (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        label TEXT NOT NULL,
        is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1))
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        brand TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        selected_color TEXT NOT NULL,
        selected_size TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
        date_added TEXT NOT NULL
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL UNIQUE,
        product_name TEXT NOT NULL,
        brand TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        date_added TEXT NOT NULL
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS recently_viewed (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        brand TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        viewed_at TEXT NOT NULL
      );
    `);

    tx.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_cart_product_id
      ON cart (product_id);
    `);

    tx.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_wishlist_product_id
      ON wishlist (product_id);
    `);

    tx.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_recently_viewed_product_id
      ON recently_viewed (product_id);
    `);
  });

  await seedDefaultData(db);

  return db;
};

const seedDefaultData = async (db: any) => {
  await db.transaction((tx: any) => {
    tx.executeSql(`
      INSERT OR IGNORE INTO user_profile (id, name, email, phone, avatar_url)
      VALUES (1, 'John Doe', 'john@example.com', '647-123-4567', '');
    `);

    tx.executeSql(`
      INSERT OR IGNORE INTO shipping_address
      (id, label, full_name, address_line1, city, province, postal_code, is_default)
      VALUES (1, 'Home', 'John Doe', '123 Main St', 'Toronto', 'ON', 'M1A 1A1', 1);
    `);

    tx.executeSql(`
      INSERT OR IGNORE INTO payment_method (id, type, label, is_default)
      VALUES (1, 'E-Wallet', 'My Wallet', 1);
    `);
  });
};
