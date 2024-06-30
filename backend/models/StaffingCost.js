const pool = require('../config/db');

const createStaffingCost = async (date, period, employee, amount, paid) => {
  const query = `
    INSERT INTO staffing_costs (date, period, employee, amount, paid)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [date, period, employee, amount, paid];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllStaffingCosts = async () => {
  const query = 'SELECT * FROM staffing_costs;';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { createStaffingCost, getAllStaffingCosts };
