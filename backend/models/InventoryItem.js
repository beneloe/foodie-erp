const pool = require('../config/db');

const createItem = async (itemName, stock, unit, price, picture) => {
  const query = `
    INSERT INTO inventory_item (item_name, stock, unit, price, picture)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [itemName, stock, unit, price, picture];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllItems = async () => {
  const query = 'SELECT * FROM inventory_item;';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { createItem, getAllItems };
