const pool = require('../config/db');

const createItem = async (userId, itemName, stock, unit, price) => {
  const query = `
    INSERT INTO inventory_item (user_id, item_name, stock, unit, price)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [userId, itemName, stock, unit, price];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllItems = async (userId) => {
  const query = 'SELECT * FROM inventory_item WHERE user_id = $1;';
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createItem, getAllItems };
