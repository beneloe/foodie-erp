const pool = require('../config/db');

const createOtherCost = async (date, vendor, amount, paid, status) => {
  const query = `
    INSERT INTO other_costs (date, vendor, amount, paid, status)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [date, vendor, amount, paid, status];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllOtherCosts = async () => {
  const query = 'SELECT * FROM other_costs;';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { createOtherCost, getAllOtherCosts };
