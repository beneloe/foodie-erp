const pool = require('../config/db');

const createSalesOrder = async (userId, date, customer, amount, paid, delivered) => {
  const query = `
    INSERT INTO sales_orders (user_id, date, customer, amount, paid, delivered)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [userId, date, customer, amount, paid, delivered];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllSalesOrders = async (userId) => {
  const query = 'SELECT * FROM sales_orders WHERE user_id = $1;';
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createSalesOrder, getAllSalesOrders };
