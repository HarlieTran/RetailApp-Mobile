import {getDbConnection} from './database';
import {PaymentMethod} from '../../types/user.types';

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const db = await getDbConnection();
  const methods: PaymentMethod[] = [];

  await db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM payment_method ORDER BY is_default DESC, id DESC`,
      [],
      (_, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          const row = results.rows.item(i);
          methods.push({
            id: row.id,
            type: row.type,
            label: row.label,
            isDefault: row.is_default,
          });
        }
      },
    );
  });

  return methods;
};

export const addPaymentMethod = async (
  method: PaymentMethod,
): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction(tx => {
    if (method.isDefault === 1) {
      tx.executeSql(`UPDATE payment_method SET is_default = 0`);
    }

    tx.executeSql(
      `
        INSERT INTO payment_method (type, label, is_default)
        VALUES (?, ?, ?)
      `,
      [method.type, method.label, method.isDefault],
    );
  });
};

export const updatePaymentMethod = async (
  method: PaymentMethod,
): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction(tx => {
    if (method.isDefault === 1) {
      tx.executeSql(`UPDATE payment_method SET is_default = 0`);
    }

    tx.executeSql(
      `
        UPDATE payment_method
        SET type = ?, label = ?, is_default = ?
        WHERE id = ?
      `,
      [method.type, method.label, method.isDefault, method.id],
    );
  });
};

export const deletePaymentMethod = async (id: number): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction(tx => {
    tx.executeSql(`DELETE FROM payment_method WHERE id = ?`, [id]);
  });
};
