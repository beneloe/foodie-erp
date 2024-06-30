const pool = require('../config/db');

const createSalesOrder = async (date, customer, amount, paid, delivered) => {
  const query = `
    INSERT INTO sales_orders (date, customer, amount, paid, delivered)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [date, customer, amount, paid, delivered];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllSalesOrders = async () => {
  const query = 'SELECT * FROM sales_orders;';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { createSalesOrder, getAllSalesOrders };
