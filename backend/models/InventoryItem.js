const { Pool } = require('pg');
const pool = new Pool();

const createItem = async (itemName, stock, unit, price, startingQuantity, picture) => {
  const query = `
    INSERT INTO inventory_items (item_name, stock, unit, price, starting_quantity, picture)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [itemName, stock, unit, price, startingQuantity, picture];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { createItem };
