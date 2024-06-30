const pool = require('../config/db');

const createStaffingCost = async (userId, date, period, employee, amount, paid) => {
  const query = `
    INSERT INTO staffing_costs (user_id, date, period, employee, amount, paid)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [userId, date, period, employee, amount, paid];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllStaffingCosts = async (userId) => {
  const query = 'SELECT * FROM staffing_costs WHERE user_id = $1;';
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createStaffingCost, getAllStaffingCosts };
