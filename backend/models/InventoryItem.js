const pool = require('../config/db'); // Update the path if necessary

const createItem = async (itemName, stock, unit, price, startingQuantity, picture) => {
  const query = `
    INSERT INTO inventory_item (item_name, stock, unit, price, starting_quantity, picture)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [itemName, stock, unit, price, startingQuantity, picture];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllItems = async () => {
  const query = 'SELECT * FROM inventory_item;';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { createItem, getAllItems };
