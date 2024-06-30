const pool = require('../config/db');

const createProductionOrder = async (date, productName, quantity, status) => {
  const query = `
    INSERT INTO production_orders (date, product_name, quantity, status)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [date, productName, quantity, status];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllProductionOrders = async () => {
  const query = 'SELECT * FROM production_orders;';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { createProductionOrder, getAllProductionOrders };
