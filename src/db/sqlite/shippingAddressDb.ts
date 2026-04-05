import {getDbConnection} from './database';
import {ShippingAddress} from '../../types/user.types';

export const getShippingAddresses = async (): Promise<ShippingAddress[]> => {
  const db = await getDbConnection();
  const addresses: ShippingAddress[] = [];

  await db.transaction((tx: any) => {
    tx.executeSql(
      `SELECT * FROM shipping_address ORDER BY is_default DESC, id DESC`,
      [],
      (_: any, results: any) => {
        for (let i = 0; i < results.rows.length; i++) {
          const row = results.rows.item(i);
          addresses.push({
            id: row.id,
            label: row.label,
            fullName: row.full_name,
            addressLine1: row.address_line1,
            addressLine2: row.address_line2,
            city: row.city,
            province: row.province,
            postalCode: row.postal_code,
            isDefault: row.is_default,
          });
        }
      },
    );
  });

  return addresses;
};

export const addShippingAddress = async (
  address: ShippingAddress,
): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction((tx: any) => {
    if (address.isDefault === 1) {
      tx.executeSql(`UPDATE shipping_address SET is_default = 0`);
    }

    tx.executeSql(
      `
        INSERT INTO shipping_address (
          label,
          full_name,
          address_line1,
          address_line2,
          city,
          province,
          postal_code,
          is_default
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        address.label,
        address.fullName,
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.province,
        address.postalCode,
        address.isDefault,
      ],
    );
  });
};

export const updateShippingAddress = async (
  address: ShippingAddress,
): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction((tx: any) => {
    if (address.isDefault === 1) {
      tx.executeSql(`UPDATE shipping_address SET is_default = 0`);
    }

    tx.executeSql(
      `
        UPDATE shipping_address
        SET
          label = ?,
          full_name = ?,
          address_line1 = ?,
          address_line2 = ?,
          city = ?,
          province = ?,
          postal_code = ?,
          is_default = ?
        WHERE id = ?
      `,
      [
        address.label,
        address.fullName,
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.province,
        address.postalCode,
        address.isDefault,
        address.id,
      ],
    );
  });
};

export const deleteShippingAddress = async (id: number): Promise<void> => {
  const db = await getDbConnection();

  await db.transaction((tx: any) => {
    tx.executeSql(`DELETE FROM shipping_address WHERE id = ?`, [id]);
  });
};
