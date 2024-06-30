const pool = require('../config/db');

const createServiceCost = async (userId, date, vendor, amount, paid, status) => {
  const query = `
    INSERT INTO service_costs (user_id, date, vendor, amount, paid, status)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [userId, date, vendor, amount, paid, status];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllServiceCosts = async (userId) => {
  const query = 'SELECT * FROM service_costs WHERE user_id = $1;';
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createServiceCost, getAllServiceCosts };
