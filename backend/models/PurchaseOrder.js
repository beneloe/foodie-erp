const pool = require('../config/db');

const createPurchaseOrder = async (userId, date, vendor, amount, paid, received) => {
  const query = `
    INSERT INTO purchase_orders (user_id, date, vendor, amount, paid, received)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [userId, date, vendor, amount, paid, received];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllPurchaseOrders = async (userId) => {
  const query = 'SELECT * FROM purchase_orders WHERE user_id = $1;';
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createPurchaseOrder, getAllPurchaseOrders };
