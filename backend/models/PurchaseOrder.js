const pool = require('../config/db');

const createPurchaseOrder = async (date, vendor, amount, paid, received) => {
  const query = `
    INSERT INTO purchase_orders (date, vendor, amount, paid, received)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [date, vendor, amount, paid, received];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllPurchaseOrders = async () => {
  const query = 'SELECT * FROM purchase_orders;';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { createPurchaseOrder, getAllPurchaseOrders };
