const pool = require('../config/db');

const createServiceCost = async (date, vendor, amount, paid, status) => {
  const query = `
    INSERT INTO service_costs (date, vendor, amount, paid, status)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [date, vendor, amount, paid, status];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllServiceCosts = async () => {
  const query = 'SELECT * FROM service_costs;';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { createServiceCost, getAllServiceCosts };
