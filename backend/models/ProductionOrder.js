const pool = require('../config/db');

const createProductionOrder = async (userId, date, productName, quantity, status) => {
  const query = `
    INSERT INTO production_orders (user_id, date, product_name, quantity, status)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [userId, date, productName, quantity, status];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllProductionOrders = async (userId) => {
  const query = 'SELECT * FROM production_orders WHERE user_id = $1;';
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createProductionOrder, getAllProductionOrders };
